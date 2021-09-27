/* External Libraries */
import { observable, computed } from "mobx";
import { Datetime, ShippingDetailsSchema } from "@schema/types";
import {
  CountriesWeShipToPick,
  InitialOrderData,
  InitialShippingDetails,
  InitialVariationDetails,
} from "@toolkit/orders/fulfill-order";

export type PhoneNumberArgs = {
  readonly country: string;
  readonly areaCode: string;
  readonly phoneNumber: string;
};

export default class OrderEditState {
  @observable
  initialData: InitialOrderData;

  @observable
  id: InitialOrderData["id"];

  @observable
  shippingProviderId: ShippingDetailsSchema["providerId"] | undefined;

  @observable
  shippingOriginCode: InitialOrderData["shippingOrigin"]["code"] | undefined;

  @observable
  shipNote: InitialShippingDetails["shipNote"];

  @observable
  trackingId: InitialShippingDetails["trackingId"] | undefined;

  @observable
  trackingIdIsValid: boolean = false;

  @observable
  isSubmitting: boolean = false;

  @observable
  isValidPhoneNumber: boolean = false;

  @observable
  name: InitialShippingDetails["name"] | undefined;

  @observable
  state: InitialShippingDetails["state"] | undefined;

  @observable
  streetAddress1: InitialShippingDetails["streetAddress1"] | undefined;

  @observable
  streetAddress2: InitialShippingDetails["streetAddress2"] | undefined;

  @observable
  city: InitialShippingDetails["city"] | undefined;

  @observable
  zipcode: InitialShippingDetails["zipcode"] | undefined;

  @observable
  countryCode: InitialShippingDetails["countryCode"] | undefined;

  @observable
  phoneNumber: InitialShippingDetails["phoneNumber"] | undefined;

  @observable
  quantity: InitialOrderData["quantity"];

  @observable
  productId: InitialOrderData["productId"];

  @observable
  productName: InitialVariationDetails["productName"] | undefined;

  @observable
  productSize: InitialOrderData["sizeAtPurchaseTime"];

  @observable
  productColor: InitialOrderData["colorAtPurchaseTime"];

  @observable
  productSku: InitialOrderData["skuAtPurchaseTime"];

  @observable
  countriesWeShipTo: CountriesWeShipToPick;

  @observable
  isWishExpress: InitialOrderData["isWishExpress"];

  @observable
  deliveryDeadline: Datetime["mmddyyyy"] | undefined;

  constructor(args: {
    readonly order: InitialOrderData;
    readonly countriesWeShipTo: CountriesWeShipToPick;
  }) {
    this.initialData = { ...args.order };

    const { hasCreatedWpsLabel } = this;

    this.shippingProviderId = hasCreatedWpsLabel
      ? undefined
      : args.order.shippingProviderId;
    this.trackingId = hasCreatedWpsLabel
      ? undefined
      : args.order.shippingDetails?.trackingId;

    this.id = args.order.id;
    this.shippingOriginCode = args.order.shippingOrigin?.code;
    this.countriesWeShipTo = args.countriesWeShipTo;

    this.quantity = args.order.quantity;
    this.productId = args.order.productId;
    this.productName = args.order.variation?.productName;
    this.productSize = args.order.sizeAtPurchaseTime;
    this.productColor = args.order.colorAtPurchaseTime;
    this.productSku = args.order.skuAtPurchaseTime;

    this.name = args.order.shippingDetails?.name;
    this.state = args.order.shippingDetails?.state;
    this.streetAddress1 = args.order.shippingDetails?.streetAddress1;
    this.streetAddress2 = args.order.shippingDetails?.streetAddress2;
    this.city = args.order.shippingDetails?.city;
    this.zipcode = args.order.shippingDetails?.zipcode;
    this.countryCode = args.order.shippingDetails?.countryCode;
    this.phoneNumber = args.order.shippingDetails?.phoneNumber;
    this.shipNote = args.order.shippingDetails?.shipNote;
    this.isWishExpress = args.order.isWishExpress;
    this.deliveryDeadline = args.order.deliveryDeadline?.mmddyyyy;
  }

  @computed
  get hasCreatedWpsLabel() {
    const { wpsFulfillment } = this.initialData;
    return wpsFulfillment != null && wpsFulfillment.shippingOptionId != null;
  }

  @computed
  get isConfirmedShipped() {
    const { tracking } = this.initialData;
    return tracking?.confirmedFulfillmentDate?.unix != null;
  }

  @computed
  get isReadyFulFill(): boolean {
    const { trackingId, shippingProviderId, trackingIdIsValid } = this;
    if (shippingProviderId == null) {
      return false;
    }

    if (!trackingIdIsValid) {
      return false;
    }

    if (trackingId == null) {
      return false;
    }

    return true;
  }

  @computed
  get shippingAddressIsValid(): boolean {
    const fields = [
      this.name,
      this.phoneNumber,
      this.countryCode,
      this.state,
      this.city,
      this.zipcode,
      this.streetAddress1,
    ];
    return (
      this.isValidPhoneNumber &&
      fields.every((field) => field != null && field.trim().length > 0)
    );
  }
}
