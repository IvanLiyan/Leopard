/*
 * CreateShippingLabelState.ts
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import { action, computed, observable } from "mobx";
import _ from "lodash";
import {
  CreateShippingLabelInitialData,
  PickedLengthUnit,
  GetShippingOptionResponseType,
  GetShippingOptionsRequestType,
  GET_SHIPPING_OPTIONS,
  PickedWpsShippingOption,
  CardState,
  WarehouseAddress,
  DefaultLengthUnit,
  DefaultWeightUnit,
  CHANGE_PREFERRED_UNITS,
  ChangePreferredUnitsInputType,
  ChangePreferredUnitsResponseType,
  SubmitDimensionsResponseType,
  SubmitDimensionsInputType,
  SUBMIT_DIMENSIONS,
  SubmitShippingOtionResponseType,
  SubmitShippingOptionInputType,
  SUBMIT_SHIPPING_OPTION,
  MARK_ORDER_AS_SHIPPED,
  MarkOrderAsShippedResponseType,
  MarkOrderAsShippedInputType,
  EditShippingOptionResponseType,
  EditShippingOptionInputType,
  EDIT_SHIPPING_OPTION,
  PickedAdditionalServiceOptions,
  PackageType,
  ModifyTrackingOrdersInputType,
  ModifyTrackingOrdersResponseType,
  MODIFY_TRACKING_ORDERS,
} from "@toolkit/wps/create-shipping-label";
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";
import { WeightUnit, WpsAvailableServices } from "@schema/types";
import NavigationStore from "@stores/NavigationStore";

export class PackageState {
  @observable
  cardState: CardState = "CLOSED_NOT_EDITABLE";

  @observable
  packageType: PackageType = "BOX";

  @observable
  weight?: number | null;

  @observable
  isWeightValid: boolean = false;

  @observable
  width?: number | null;

  @observable
  isWidthValid: boolean = false;

  @observable
  height?: number | null;

  @observable
  isHeightValid: boolean = false;

  @observable
  length?: number | null;

  @observable
  isLengthValid: boolean = false;

  @observable
  applyToAllVariations?: boolean;

  @observable
  weightUnit: WeightUnit = DefaultWeightUnit;

  @observable
  lengthUnit: PickedLengthUnit = DefaultLengthUnit;

  @observable
  forceValidation: boolean = false;

  productId: string;
  variationId: string;

  constructor({
    productId,
    variationId,
    preferredWeightUnit,
    preferredLengthUnit,
  }: {
    readonly productId: string;
    readonly variationId: string;
    readonly preferredWeightUnit?: WeightUnit | null | undefined;
    readonly preferredLengthUnit?: PickedLengthUnit | null | undefined;
  }) {
    this.productId = productId;
    this.variationId = variationId;

    if (preferredWeightUnit != null) {
      this.weightUnit = preferredWeightUnit;
    }
    if (preferredLengthUnit != null) {
      this.lengthUnit = preferredLengthUnit;
    }
  }

  @computed
  get canSave(): boolean {
    const {
      weight,
      width,
      height,
      length,
      isWeightValid,
      isWidthValid,
      isHeightValid,
      isLengthValid,
    } = this;

    return (
      isWeightValid &&
      isWidthValid &&
      isHeightValid &&
      isLengthValid &&
      weight != null &&
      width != null &&
      height != null &&
      length != null
    );
  }

  @action
  submit = async (): Promise<boolean> => {
    if (!this.canSave) {
      this.forceValidation = true;
      return false;
    }

    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    const { data: changeUnitsData } = await client.mutate<
      ChangePreferredUnitsResponseType,
      ChangePreferredUnitsInputType
    >({
      mutation: CHANGE_PREFERRED_UNITS,
      variables: {
        input: {
          preferredLengthUnit: this.lengthUnit,
          preferredWeightUnit: this.weightUnit,
        },
      },
    });

    const okChangeUnits =
      changeUnitsData?.currentMerchant.changePreferredUnits.ok;
    const messageChangeUnits =
      changeUnitsData?.currentMerchant.changePreferredUnits.error;
    if (!okChangeUnits) {
      toastStore.negative(messageChangeUnits || i`Something went wrong`);
      return false;
    }

    // The "|| 0" cases are needed for TS but will never occur since all the
    // number values are validated in this.canSave above
    const { data } = await client.mutate<
      SubmitDimensionsResponseType,
      SubmitDimensionsInputType
    >({
      mutation: SUBMIT_DIMENSIONS,
      variables: {
        input: {
          productId: this.productId,
          variationId: this.applyToAllVariations ? undefined : this.variationId,
          packageDimensions: {
            width:
              this.packageType === "BOX"
                ? {
                    value: this.width || 0,
                    unit: this.lengthUnit,
                  }
                : null,
            height:
              this.packageType === "BOX"
                ? {
                    value: this.height || 0,
                    unit: this.lengthUnit,
                  }
                : null,
            length:
              this.packageType === "BOX"
                ? {
                    value: this.length || 0,
                    unit: this.lengthUnit,
                  }
                : null,
            weight: {
              value: this.weight || 0,
              unit: this.weightUnit,
            },
          },
        },
      },
    });

    const ok = data?.productCatalog.updateProductLogisticsMetadata.success;
    const message =
      data?.productCatalog.updateProductLogisticsMetadata.errorMessage;
    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return false;
    }

    return true;
  };
}

export class ShippingState {
  @observable
  orderId: string;

  @observable
  cardState: CardState = "CLOSED_NOT_EDITABLE";

  @observable
  shippingOptions: ReadonlyArray<PickedWpsShippingOption> = [];

  @observable
  selectedShippingOptionId?: string;

  @observable
  selectedAdditionalServices: Set<WpsAvailableServices> = new Set([]);

  @observable
  isFetching: boolean = false;

  constructor({
    initialData,
  }: {
    initialData: CreateShippingLabelInitialData;
  }) {
    this.orderId = initialData.fulfillment.order.id;
  }

  @computed
  get selectedShippingOption(): PickedWpsShippingOption | undefined {
    return this.shippingOptions.find(
      ({ id }) => id === this.selectedShippingOptionId,
    );
  }

  cheapestShippingOptionFrom(
    options: ReadonlyArray<PickedWpsShippingOption>,
  ): PickedWpsShippingOption | undefined {
    return _.minBy(options, ({ price: { amount } }) => amount);
  }

  fastestShippingOptionFrom(
    options: ReadonlyArray<PickedWpsShippingOption>,
  ): PickedWpsShippingOption | undefined {
    return _.minBy(options, "daysToDeliver");
  }

  otherShippingOptionsFrom(
    options: ReadonlyArray<PickedWpsShippingOption>,
  ): ReadonlyArray<PickedWpsShippingOption> {
    const cheapest = this.cheapestShippingOptionFrom(options);
    const fastest = this.fastestShippingOptionFrom(options);

    const excluded = [cheapest, fastest].filter(
      (option) => option != null,
    ) as ReadonlyArray<PickedWpsShippingOption>;

    const others = _.differenceBy(options, excluded, "id");
    return _.sortBy(others, ({ price: amount }) => amount);
  }

  @computed
  get cheapestShippingOption(): PickedWpsShippingOption | undefined {
    return this.cheapestShippingOptionFrom(this.shippingOptions);
  }

  @computed
  get fastestShippingOption(): PickedWpsShippingOption | undefined {
    return this.fastestShippingOptionFrom(this.shippingOptions);
  }

  @computed
  get otherShippingOptions(): ReadonlyArray<PickedWpsShippingOption> {
    return this.otherShippingOptionsFrom(this.shippingOptions);
  }

  @computed
  get selectedAdditionalServicesDetails(): ReadonlyArray<PickedAdditionalServiceOptions> {
    if (this.selectedShippingOption == null) {
      return [];
    }

    return this.selectedShippingOption.availableAdditionalServiceOptions.filter(
      (service) =>
        this.selectedAdditionalServices.has(service.type) &&
        service.fee != null,
    );
  }

  @computed
  get estimatedTotal(): number {
    if (this.selectedShippingOption == null) {
      return 0;
    }

    return this.selectedAdditionalServicesDetails.reduce(
      (acc, { fee }) => acc + (fee?.amount || 0),
      this.selectedShippingOption?.price.amount || 0,
    );
  }

  @action
  clearOptions = () => {
    this.shippingOptions = [];
    this.selectedShippingOptionId = undefined;
  };

  @action
  fetchOptions = async (): Promise<boolean> => {
    this.isFetching = true;

    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();

    const { data } = await client.query<
      GetShippingOptionResponseType,
      GetShippingOptionsRequestType
    >({
      query: GET_SHIPPING_OPTIONS,
      variables: { orderId: this.orderId },
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });

    const shippingOptions =
      data?.fulfillment.wpsShippingOptions?.shippingOptions;
    const ok = data?.fulfillment.wpsShippingOptions?.ok;
    const errorMessage = data?.fulfillment.wpsShippingOptions?.errorMessage;

    if (!ok || shippingOptions == null) {
      toastStore.negative(
        errorMessage ||
          i`No shipping options found due to invalid information provided. ` +
            i`Please correct your originating address and/or package information.`,
      );
      this.isFetching = false;
      return false;
    }

    const cheapest = this.cheapestShippingOptionFrom(shippingOptions);
    const fastest = this.fastestShippingOptionFrom(shippingOptions);
    const other = this.otherShippingOptionsFrom(shippingOptions);

    const selectedId = cheapest?.id || fastest?.id || other[0].id;

    this.shippingOptions = shippingOptions;
    this.selectedShippingOptionId = selectedId;
    this.isFetching = false;
    return true;
  };
}
export default class CreateShippingLabelState {
  @observable
  initialData: CreateShippingLabelInitialData;

  @observable
  isWpsTosChecked: boolean;

  @observable
  shipFromCardState: CardState;

  @observable
  submittedWarehouse: WarehouseAddress | undefined;

  @observable
  packageState: PackageState;

  @observable
  shippingState: ShippingState;

  constructor({
    initialData,
  }: {
    readonly initialData: CreateShippingLabelInitialData;
  }) {
    this.initialData = initialData;

    const {
      currentMerchant: {
        preferredLengthUnit,
        preferredWeightUnit,
        merchantTermsAgreed,
      },
      fulfillment: {
        order: {
          productId,
          variation: { id: variationId },
        },
      },
    } = initialData;

    this.isWpsTosChecked =
      merchantTermsAgreed?.wpsTermsOfService?.agreedWpsTos || false;

    if (this.showTos) {
      this.shipFromCardState = "CLOSED_NOT_EDITABLE";
    } else {
      this.shipFromCardState = "EDITING";
    }

    this.packageState = new PackageState({
      productId,
      variationId,
      preferredLengthUnit,
      preferredWeightUnit,
    });

    this.shippingState = new ShippingState({
      initialData,
    });
  }

  @computed
  get isEdit(): boolean {
    const { wpsFulfillment } = this.initialData.fulfillment.order;
    return wpsFulfillment != null && wpsFulfillment.shippingOptionId != null;
  }

  @computed
  get showSummary(): boolean {
    const {
      shippingState: { selectedShippingOption },
    } = this;

    return selectedShippingOption != null;
  }

  @computed
  get showTos(): boolean {
    return !this.isWpsTosChecked;
  }

  @computed
  get canBuyShippingLabel(): boolean {
    const { shippingState } = this;
    const { selectedShippingOptionId, shippingOptions } = shippingState;

    if (selectedShippingOptionId == null || shippingOptions.length == 0) {
      return false;
    }

    const selectedShippingOption = _.find(shippingOptions, [
      "id",
      selectedShippingOptionId,
    ]);

    if (selectedShippingOption == null) {
      return false;
    }
    return true;
  }

  @action
  onAcceptTos = () => {
    this.shipFromCardState = "EDITING";
    this.packageState.cardState = "CLOSED_NOT_EDITABLE";
    this.shippingState.cardState = "CLOSED_NOT_EDITABLE";
  };

  @action
  onReopenShipFrom = () => {
    this.shipFromCardState = "EDITING";
    this.packageState.cardState = "CLOSED_NOT_EDITABLE";
    this.shippingState.cardState = "CLOSED_NOT_EDITABLE";
    this.shippingState.clearOptions();
  };

  @action
  onCloseShipFrom = () => {
    this.shipFromCardState = "CLOSED_EDITABLE";
    this.packageState.cardState = "EDITING";
  };

  @action
  onReopenPackage = () => {
    this.packageState.cardState = "EDITING";
    this.shippingState.cardState = "CLOSED_NOT_EDITABLE";
    this.shippingState.clearOptions();
  };

  @action
  onClosePackage = async () => {
    this.packageState.cardState = "CLOSED_EDITABLE";
    const success = await this.shippingState.fetchOptions();
    if (success) {
      this.shippingState.cardState = "EDITING";
    }
  };

  @action
  onReopenShipping = () => {
    this.shippingState.cardState = "EDITING";
  };

  @action
  onCloseShipping = () => {
    this.shippingState.cardState = "CLOSED_EDITABLE";
  };

  @action
  onBuyShippingLabel = async (): Promise<boolean> => {
    const { shippingState, submittedWarehouse, isEdit } = this;
    const {
      selectedShippingOptionId,
      shippingOptions,
      orderId,
      selectedAdditionalServices,
    } = shippingState;

    if (
      selectedShippingOptionId == null ||
      shippingOptions.length == 0 ||
      submittedWarehouse == null
    ) {
      return false;
    }

    const selectedShippingOption = _.find(shippingOptions, [
      "id",
      selectedShippingOptionId,
    ]);

    if (selectedShippingOption == null) {
      return false;
    }

    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    if (isEdit) {
      const { data: labelData } = await client.mutate<
        EditShippingOptionResponseType,
        EditShippingOptionInputType
      >({
        mutation: EDIT_SHIPPING_OPTION,
        variables: {
          input: {
            orderId,
            shippingOptionId: selectedShippingOption.id,
            ...(selectedAdditionalServices.size != 0
              ? {
                  additionalServiceOptions: Array.from(
                    selectedAdditionalServices,
                  ),
                }
              : {}),
          },
        },
      });

      const labelOk = labelData?.fulfillment?.modifyWpsTrackingId.ok;
      const errorMessage =
        labelData?.fulfillment?.modifyWpsTrackingId.errorMessage;
      const trackingId = labelData?.fulfillment?.modifyWpsTrackingId.trackingId;
      const providerId = labelData?.fulfillment?.modifyWpsTrackingId.providerId;

      if (!labelOk || trackingId == null || providerId == null) {
        toastStore.negative(errorMessage || i`Something went wrong`);
        return false;
      }

      const {
        address: { countryCode },
      } = submittedWarehouse;

      const { data: markTrackingData } = await client.mutate<
        ModifyTrackingOrdersResponseType,
        ModifyTrackingOrdersInputType
      >({
        mutation: MODIFY_TRACKING_ORDERS,
        variables: {
          input: [
            {
              orderId,
              trackingId,
              providerId,
              originCountryCode: countryCode,
            },
          ],
        },
      });

      const markTrackingOk =
        markTrackingData?.fulfillment?.modifyTrackingOrders
          .modifyTrackingCount == 1;
      const markTrackingMessages =
        markTrackingData?.fulfillment?.modifyTrackingOrders.errorMessages;
      if (!markTrackingOk) {
        toastStore.negative(
          (markTrackingMessages != null &&
            markTrackingMessages.length > 0 &&
            markTrackingMessages[0].message) ||
            i`Something went wrong`,
        );
        return false;
      }

      toastStore.positive(
        i`Your order is marked as shipped. Now, download your shipping label ` +
          i`and prepare your package`,
        { deferred: true },
      );

      await navigationStore.navigate(`/order/${orderId}`);

      return true;
    }

    const { data: labelData } = await client.mutate<
      SubmitShippingOtionResponseType,
      SubmitShippingOptionInputType
    >({
      mutation: SUBMIT_SHIPPING_OPTION,
      variables: {
        input: {
          orderId,
          shippingOptionId: selectedShippingOption.id,
          ...(selectedAdditionalServices.size != 0
            ? {
                additionalServiceOptions: Array.from(
                  selectedAdditionalServices,
                ),
              }
            : {}),
        },
      },
    });

    const labelOk = labelData?.fulfillment?.selectWpsShippingOption?.ok;
    const labelMessage =
      labelData?.fulfillment?.selectWpsShippingOption?.errorMessage;
    const trackingId =
      labelData?.fulfillment?.selectWpsShippingOption?.trackingId;
    const providerId =
      labelData?.fulfillment?.selectWpsShippingOption?.providerId;

    if (!labelOk || trackingId == null || providerId == null) {
      toastStore.negative(labelMessage || i`Something went wrong`);
      return false;
    }

    const {
      address: { countryCode },
    } = submittedWarehouse;

    const { data: markShippedData } = await client.mutate<
      MarkOrderAsShippedResponseType,
      MarkOrderAsShippedInputType
    >({
      mutation: MARK_ORDER_AS_SHIPPED,
      variables: {
        input: [
          {
            orderId,
            trackingId,
            providerId,
            originCountryCode: countryCode,
          },
        ],
      },
    });

    const markShippedOk =
      markShippedData?.fulfillment?.fulfillOrders?.shippedCount == 1;
    const markShippedMessages =
      markShippedData?.fulfillment?.fulfillOrders?.errorMessages;
    if (!markShippedOk) {
      toastStore.negative(
        (markShippedMessages != null &&
          markShippedMessages.length > 0 &&
          markShippedMessages[0].message) ||
          i`Something went wrong`,
      );
      return false;
    }

    toastStore.positive(
      i`Your order is marked as shipped. Now, download your shipping label ` +
        i`and prepare your package`,
      { deferred: true },
    );

    await navigationStore.navigate(`/order/${orderId}`);

    return true;
  };
}
