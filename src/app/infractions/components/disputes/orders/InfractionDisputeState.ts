import { gql } from "@apollo/client";
import { observable, action, computed } from "mobx";
import moment from "moment-timezone";

import ToastStore from "@core/stores/ToastStore";
import ApolloStore from "@core/stores/ApolloStore";
import NavigationStore from "@core/stores/NavigationStore";
import {
  CountryCode,
  UpsertOrderInfractionDisputeInput,
  UpsertOrderInfractionDispute,
  OrderInfractionDisputeAction,
  OrderInfractionDisputeSubreason,
  MerchantWarningReason,
  FileInput,
  UsStateCode,
} from "@schema";
import {
  PickedMerchantWarningSchema,
  OrderInfractionType,
} from "./order-disputes";

const ORDER_INFRACTION_DISPUTE_MUTATION = gql`
  mutation InfractionDisputeState_OrderInfractionDisputeMutation(
    $input: UpsertOrderInfractionDisputeInput!
  ) {
    policy {
      orderInfractionDispute {
        upsertOrderInfractionDispute(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type OrderInfractionDisputeResponse = {
  readonly policy: {
    readonly orderInfractionDispute: {
      readonly upsertOrderInfractionDispute: Pick<
        UpsertOrderInfractionDispute,
        "ok" | "message"
      >;
    };
  };
};

const notBlank = (arg: unknown): boolean => {
  if (typeof arg === "string") {
    return arg.trim() != "";
  }
  return arg != null;
};

const DefaultFormValidationState: {
  [reason in OrderInfractionDisputeSubreason]: ReadonlyArray<unknown>;
} = {
  INCORRECT_CONFIRMED_FULFILLMENT_DATE: [],
  NATIONAL_HOLIDAY: [],
  NATURAL_DISASTER: [],
  OPERATIONAL_OR_IT_ISSUE: [],
  RESHIP_PACKAGE: [],
  UNVERIFIABLE_ADDRESS: [],
  ADDRESS_PO_BOX: [],
  CANNOT_SHIP_TO_REGION: [],
  TECHNICAL_ISSUE: [],
  WISH_LOGISTICS_CANNOT_FULFILL: [],
  INCORRECT_TRACKING_INFO: [],
  SHIPMENT_RETURNED: [],
  SHIPMENT_STUCK_AT_CUSTOMS: [],
  AMBIGUOUS_CUSTOMER_ADDRESS: [],
  CAN_PROVIDE_CORRECT_TRACKING_INFO: [],
  OTHER: [],
  INCORRECT_CONFIRMED_DELIVERY_DATE_FROM_CARRIER: [],
};

// Returns an array of required fields depending on what reason selected
const formValidationFields = (
  state: InfractionDisputeState,
): {
  [disputeType in OrderInfractionType]: {
    [key in OrderInfractionDisputeSubreason]: ReadonlyArray<unknown>;
  };
} => ({
  LATE_CONFIRMED_FULFILLMENT_VIOLATION: {
    ...DefaultFormValidationState,
    INCORRECT_CONFIRMED_FULFILLMENT_DATE: [
      state.carrierSiteLink,
      state.reportedFulfillmentDate,
      state.reportedDestinationCountryCode,
    ],
    NATIONAL_HOLIDAY: [
      state.message,
      state.warehouseCountryCode,
      state.carrierSiteLink,
    ],
    NATURAL_DISASTER: [
      state.message,
      state.warehouseCountryCode,
      state.carrierSiteLink,
    ],
    OPERATIONAL_OR_IT_ISSUE: [state.message, state.carrierSiteLink],
    RESHIP_PACKAGE: [state.message, state.carrierSiteLink],
    OTHER: [state.message],
  },
  MERCHANT_CANCELLATION_VIOLATION: {
    ...DefaultFormValidationState,
    UNVERIFIABLE_ADDRESS: [
      state.customerAddressProof,
      state.invalidAddressProof,
    ],
    ADDRESS_PO_BOX: [state.message],
    CANNOT_SHIP_TO_REGION: [state.message],
    NATIONAL_HOLIDAY: [state.message, state.warehouseCountryCode],
    NATURAL_DISASTER: [state.message, state.warehouseCountryCode],
    TECHNICAL_ISSUE: [state.message],
    WISH_LOGISTICS_CANNOT_FULFILL: [state.message],
    OTHER: [state.message],
  },
  UNFULFILLED_ORDER: {
    ...DefaultFormValidationState,
    NATIONAL_HOLIDAY: [state.message, state.warehouseCountryCode],
    NATURAL_DISASTER: [state.message, state.warehouseCountryCode],
    TECHNICAL_ISSUE: [state.message],
    OTHER: [state.message],
  },
  FAKE_TRACKING: {
    ...DefaultFormValidationState,
    INCORRECT_TRACKING_INFO: [state.message, state.carrierSiteLink],
    SHIPMENT_RETURNED: [state.message, state.carrierSiteLink],
    SHIPMENT_STUCK_AT_CUSTOMS: [state.message, state.carrierSiteLink],
    AMBIGUOUS_CUSTOMER_ADDRESS: [state.message, state.carrierSiteLink],
    CAN_PROVIDE_CORRECT_TRACKING_INFO: [
      state.carrierSiteLink,
      state.newTrackingNumber,
      state.shippedFromCountryCode,
      state.reportedShippingProviderId,
    ],
    OTHER: [state.message],
  },
  WAREHOUSE_FULFILLMENT_POLICY_VIOLATION: {
    ...DefaultFormValidationState,
    INCORRECT_CONFIRMED_FULFILLMENT_DATE: [
      state.carrierSiteLink,
      state.reportedDeliveredDate,
      state.reportedFulfillmentDate,
      state.reportedDestinationCountryCode,
    ],
    NATIONAL_HOLIDAY: [
      state.message,
      state.warehouseCountryCode,
      state.carrierSiteLink,
    ],
    NATURAL_DISASTER: [
      state.message,
      state.warehouseCountryCode,
      state.carrierSiteLink,
    ],
    OPERATIONAL_OR_IT_ISSUE: [state.message, state.carrierSiteLink],
    RESHIP_PACKAGE: [state.message, state.carrierSiteLink],
    OTHER: [state.message],
  },
  ORDER_NOT_DELIVERED: {
    ...DefaultFormValidationState,
    INCORRECT_CONFIRMED_DELIVERY_DATE_FROM_CARRIER: [
      state.reportedDeliveredDate,
      state.carrierSiteLink,
      state.reportedDestinationCountryCode,
    ],
  },
});

export default class InfractionDisputeState {
  @observable
  infractionType: MerchantWarningReason;

  @observable
  id?: string | null;

  @observable
  orderId: string;

  @observable
  disputeSubreason?: OrderInfractionDisputeSubreason | null;

  // User facing form fields below //

  @observable
  action: OrderInfractionDisputeAction;

  @observable
  message?: string | null;

  @observable
  adminMessage?: string | null;

  @observable
  uploadFiles?: ReadonlyArray<FileInput> | null;

  @observable
  customerAddressProof?: ReadonlyArray<FileInput> | null;

  @observable
  invalidAddressProof?: ReadonlyArray<FileInput> | null;

  @observable
  cannedResponseId?: string | null;

  @observable
  reportedFulfillmentDate?: string | null; // MM/DD/YYYY

  @observable
  reportedDeliveredDate?: string | null; // MM/DD/YYYY

  @observable
  reportedDestinationCountryCode?: CountryCode | null;

  @observable
  reportedDestinationStateCode?: UsStateCode | null;

  @observable
  warehouseCountryCode?: CountryCode | null;

  @observable
  shippedFromCountryCode?: CountryCode | null;

  @observable
  carrierSiteLink?: string | null;

  @observable
  reportedShippingProviderId?: string | null;

  @observable
  warningId?: string | null;

  @observable
  newTrackingNumber?: string | null;

  // End of user facing form fields //

  @observable
  isSubmitting = false;

  @observable
  formDataValid = true;

  @observable
  showFormErrors = false;

  constructor(args: {
    infraction: PickedMerchantWarningSchema;
    orderId: string;
  }) {
    const { infraction, orderId } = args;
    this.infractionType = infraction.reason.reason;
    this.action = "CREATE";
    this.orderId = orderId;
    this.warningId = infraction.id;
  }

  @computed
  get isValid(): boolean {
    if (this.disputeSubreason == null) {
      return false;
    }

    if (!this.formDataValid) {
      return false;
    }

    // Check the array of required fields are not empty
    return formValidationFields(this)[
      this.infractionType as OrderInfractionType
    ][this.disputeSubreason].every(notBlank);
  }

  @action
  clearInputs() {
    this.showFormErrors = false;
    this.message = null;
    this.adminMessage = null;
    this.uploadFiles = null;
    this.customerAddressProof = null;
    this.invalidAddressProof = null;
    this.cannedResponseId = null;
    this.reportedFulfillmentDate = null;
    this.reportedDeliveredDate = null;
    this.reportedDestinationCountryCode = null;
    this.reportedDestinationStateCode = null;
    this.reportedShippingProviderId = null;
    this.warehouseCountryCode = null;
    this.shippedFromCountryCode = null;
    this.carrierSiteLink = null;
    this.newTrackingNumber = null;
  }

  @action
  async createDispute() {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    this.isSubmitting = true;

    const {
      disputeSubreason,
      infractionType,
      orderId,
      message,
      adminMessage,
      uploadFiles,
      customerAddressProof,
      invalidAddressProof,
      cannedResponseId,
      reportedDestinationCountryCode,
      reportedDestinationStateCode,
      reportedShippingProviderId,
      warehouseCountryCode,
      shippedFromCountryCode,
      carrierSiteLink,
      warningId,
      newTrackingNumber,
    } = this;

    const reportedFulfillmentDate = this.reportedFulfillmentDate
      ? {
          unix: moment(this.reportedFulfillmentDate, "MM/DD/YYYY").unix(),
        }
      : null;
    const reportedDeliveredDate = this.reportedDeliveredDate
      ? {
          unix: moment(this.reportedDeliveredDate, "MM/DD/YYYY").unix(),
        }
      : null;

    const input = {
      action: this.action,
      warningReason: infractionType,
      orderId,
      disputeSubreason,
      reportedFulfillmentDate,
      reportedDeliveredDate,
      message,
      adminMessage,
      uploadFiles,
      customerAddressProof,
      invalidAddressProof,
      cannedResponseId,
      reportedDestinationCountryCode,
      reportedDestinationStateCode,
      reportedShippingProviderId,
      warehouseCountryCode,
      shippedFromCountryCode,
      carrierSiteLink,
      warningId,
      newTrackingNumber,
    };

    const { data } = await client.mutate<
      OrderInfractionDisputeResponse,
      { input: UpsertOrderInfractionDisputeInput }
    >({
      mutation: ORDER_INFRACTION_DISPUTE_MUTATION,
      variables: { input },
    });

    const ok =
      data?.policy.orderInfractionDispute.upsertOrderInfractionDispute.ok;
    const resultMessage =
      data?.policy.orderInfractionDispute.upsertOrderInfractionDispute.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        resultMessage || i`Something went wrong, please try again.`,
      );
      return;
    }

    toastStore.positive(i`Your dispute has been submitted.`, {
      timeoutMs: 7000,
      deferred: true,
    });
  }

  @action
  async submitReply(
    action: OrderInfractionDisputeAction,
    noSuccessResponse = false,
  ): Promise<boolean> {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

    this.isSubmitting = true;

    const { id, warningId, message, uploadFiles, cannedResponseId } = this;

    const input = {
      action,
      id,
      message,
      uploadFiles,
      cannedResponseId,
      warningId,
    };

    if (
      action !== "REOPEN" &&
      action !== "CLOSE" &&
      action !== "HOLD" &&
      (message == null || message.trim() === "")
    ) {
      toastStore.negative(i`Message must not be empty.`);
      this.isSubmitting = false;
      return false;
    }

    const { data } = await client.mutate<
      OrderInfractionDisputeResponse,
      { input: UpsertOrderInfractionDisputeInput }
    >({
      mutation: ORDER_INFRACTION_DISPUTE_MUTATION,
      variables: { input },
    });

    const ok =
      data?.policy.orderInfractionDispute.upsertOrderInfractionDispute.ok;
    const resultMessage =
      data?.policy.orderInfractionDispute.upsertOrderInfractionDispute.message;

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        resultMessage || i`Something went wrong, please try again.`,
      );
      return false;
    }

    if (!noSuccessResponse) {
      navigationStore.reload();

      toastStore.positive(i`Your response has been submitted.`, {
        timeoutMs: 7000,
        deferred: true,
      });
    }

    return true;
  }
}
