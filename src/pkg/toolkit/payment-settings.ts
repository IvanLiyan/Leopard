import {
  PaymentPersonalInfo,
  PaymentBusinessInfo,
  PaymentProvider,
  MerchantSchema,
  UserSchema,
  InfoCollectedForPaymentProvider,
  ReleasePayoutRequest,
  Datetime,
  ChargePaymentProviderType,
  MerchantPaymentDetail,
  PayoutPaymentProviderType,
} from "@schema/types";

export type PickedPaymentProvider = Pick<
  PaymentProvider,
  "name" | "logo" | "type"
>;

type PickedPaymentPersonalInfo = Pick<
  PaymentPersonalInfo,
  "name" | "phoneNumber" | "id"
>;

type PickedPaymentBusinessInfo = Pick<
  PaymentBusinessInfo,
  "name" | "businessId"
>;

type PickedReleasePayoutRequest = Pick<
  ReleasePayoutRequest,
  "canResetPayout" | "releasePaymentRequestId"
>;

type PickedMerchantPaymentDetail = {
  readonly currentProvider?: PickedPaymentProvider | null;
  readonly allowedProviders: ReadonlyArray<PickedPaymentProvider>;
  readonly personalInfo: PickedPaymentPersonalInfo;
  readonly businessInfo: PickedPaymentBusinessInfo;
  readonly infoCollectedForPaymentProvider?: InfoCollectedForPaymentProvider | null;
  readonly releasePayoutRequest?: PickedReleasePayoutRequest | null;
  readonly nextPayoutTime?: Pick<Datetime, "mmddyyyy"> | null;
  readonly pendingChargeProviders?: Array<ChargePaymentProviderType> | null;
} & Pick<
  MerchantPaymentDetail,
  "canEditPaymentInfo" | "hasActiveLoan" | "hasPayoutInProgress"
>;

type PickedMerchantPaymentsService = {
  readonly currentMerchant: PickedMerchantPaymentDetail;
};

type PickedMerchantSchema = Pick<
  MerchantSchema,
  "id" | "primaryCurrency" | "isStoreMerchant"
>;

type PickedUserSchema = Pick<
  UserSchema,
  "firstName" | "lastName" | "phoneNumber"
>;

export type PaymentSettingsInitialData = {
  readonly payments: PickedMerchantPaymentsService;
  readonly currentMerchant: PickedMerchantSchema;
  readonly currentUser: PickedUserSchema;
};

export const SUPPORTED_PAYMENT_PROVIDERS: readonly {
  type: PayoutPaymentProviderType;
  name: string;
}[] = [
  {
    type: "PAYONEER",
    name: "Payoneer",
  },
  {
    type: "PAYPAL_MERCH",
    name: "PayPal",
  },
];
