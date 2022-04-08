import gql from "graphql-tag";
import {
  MerchantWarningSchema,
  MerchantWarningProofSchema,
  MerchantWarningReasonSchema,
  Country,
  MerchantWarningReason,
  OrderInfractionDisputeSubreason,
  OrderSchemaAvailableShippingProvidersArgs,
  FulfillmentSchemaOrderArgs,
  ShippingProviderSchema,
} from "@schema/types";

type PickedMerchantWarningReason = Pick<
  MerchantWarningReasonSchema,
  "reason" | "text"
>;

type PickedMerchantWarningProofSchema = Pick<
  MerchantWarningProofSchema,
  "id" | "type" | "disputeStatus"
>;

export type PickedMerchantWarningSchema = Pick<MerchantWarningSchema, "id"> & {
  readonly reason: PickedMerchantWarningReason;
  readonly proofs?: ReadonlyArray<PickedMerchantWarningProofSchema> | null;
};

export type PickedCountry = Pick<Country, "name" | "code">;

export type InfractionDisputeInitialData = {
  readonly platformConstants: {
    readonly countriesWeShipTo: ReadonlyArray<PickedCountry>;
  };
  readonly policy?: {
    readonly merchantWarnings?: ReadonlyArray<PickedMerchantWarningSchema> | null;
  };
};

type PickedShippingProviderSchema = Pick<ShippingProviderSchema, "id" | "name">;

export type OrderShippingProvidersRequestData = FulfillmentSchemaOrderArgs &
  OrderSchemaAvailableShippingProvidersArgs;

export type OrderShippingProvidersResponseData = {
  readonly fulfillment: {
    readonly order: {
      readonly availableShippingProviders: ReadonlyArray<PickedShippingProviderSchema>;
    };
  };
};

export const ORDER_SHIPPING_PROVIDERS = gql`
  query OrderShippingProviders_InfractionDisputeForm(
    $id: String!
    $originCountryCode: CountryCode!
  ) {
    fulfillment {
      order(id: $id) {
        availableShippingProviders(originCountryCode: $originCountryCode) {
          name
          id
        }
      }
    }
  }
`;

export const ReasonText: {
  [reason in OrderInfractionDisputeSubreason]: string;
} = {
  INCORRECT_CONFIRMED_FULFILLMENT_DATE: i`The confirmed fulfillment date is inaccurate from what the carrier website shows`,
  NATIONAL_HOLIDAY: i`My domiciled country or warehouse country had a national holiday`,
  NATURAL_DISASTER: i`My domiciled country or warehouse country had a natural disaster`,
  OPERATIONAL_OR_IT_ISSUE: i`My carrier had a operational or IT issue`,
  RESHIP_PACKAGE: i`I had to reship the package`,
  UNVERIFIABLE_ADDRESS: i`The shipping carrier could not verify the address`,
  ADDRESS_PO_BOX: i`The address provided is a PO Box`,
  CANNOT_SHIP_TO_REGION: i`My preferred carrier can't ship to a subregion of the order's shipping country`,
  TECHNICAL_ISSUE: i`I was not able to fulfill the order in Wish due to a technical issue`,
  WISH_LOGISTICS_CANNOT_FULFILL: i`Wish Logistics could not fulfill the order`,
  INCORRECT_TRACKING_INFO: i`The carrier tracking information is wrong`,
  SHIPMENT_RETURNED: i`The shipment is being returned to me, or has already returned`,
  SHIPMENT_STUCK_AT_CUSTOMS: i`The shipment is stuck at customs`,
  AMBIGUOUS_CUSTOMER_ADDRESS: i`The customer's address is ambiguous`,
  CAN_PROVIDE_CORRECT_TRACKING_INFO: i`I can now provide correct tracking information`,
  OTHER: i`Other`,
};

export type OrderInfractionType = Extract<
  MerchantWarningReason,
  | "LATE_CONFIRMED_FULFILLMENT_VIOLATION"
  | "MERCHANT_CANCELLATION_VIOLATION"
  | "UNFULFILLED_ORDER"
  | "FAKE_TRACKING"
>;

export const OrderInfractionReasons = [
  "LATE_CONFIRMED_FULFILLMENT_VIOLATION",
  "MERCHANT_CANCELLATION_VIOLATION",
  "UNFULFILLED_ORDER",
  "FAKE_TRACKING",
];

export const ReasonOptions: {
  [disputeType in OrderInfractionType]: ReadonlyArray<OrderInfractionDisputeSubreason>;
} = {
  LATE_CONFIRMED_FULFILLMENT_VIOLATION: [
    "INCORRECT_CONFIRMED_FULFILLMENT_DATE",
    "NATIONAL_HOLIDAY",
    "NATURAL_DISASTER",
    "OPERATIONAL_OR_IT_ISSUE",
    "RESHIP_PACKAGE",
    "OTHER",
  ],
  MERCHANT_CANCELLATION_VIOLATION: [
    "UNVERIFIABLE_ADDRESS",
    "ADDRESS_PO_BOX",
    "CANNOT_SHIP_TO_REGION",
    "NATIONAL_HOLIDAY",
    "NATURAL_DISASTER",
    "TECHNICAL_ISSUE",
    "WISH_LOGISTICS_CANNOT_FULFILL",
    "OTHER",
  ],
  UNFULFILLED_ORDER: [
    "NATIONAL_HOLIDAY",
    "NATURAL_DISASTER",
    "TECHNICAL_ISSUE",
    "OTHER",
  ],
  FAKE_TRACKING: [
    "INCORRECT_TRACKING_INFO",
    "SHIPMENT_RETURNED",
    "SHIPMENT_STUCK_AT_CUSTOMS",
    "AMBIGUOUS_CUSTOMER_ADDRESS",
    "CAN_PROVIDE_CORRECT_TRACKING_INFO",
    "OTHER",
  ],
};
