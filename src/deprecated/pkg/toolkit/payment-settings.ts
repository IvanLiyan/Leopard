import gql from "graphql-tag";

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
  PayoneerSignupMutation,
  UpdatePayoneerSettingMutation,
  UpdatePayPalSettingMutation,
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

export type PickedMerchantPaymentDetail = {
  readonly currentProvider?: PickedPaymentProvider | null;
  readonly allowedProviders: ReadonlyArray<PickedPaymentProvider>;
  readonly personalInfo: PickedPaymentPersonalInfo;
  readonly businessInfo: PickedPaymentBusinessInfo;
  readonly infoCollectedForPaymentProvider?: InfoCollectedForPaymentProvider | null;
  readonly releasePayoutRequest?: PickedReleasePayoutRequest | null;
  readonly nextPayoutTime?: Pick<Datetime, "mmddyyyy" | "unix"> | null;
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

// GQL Mutations

export const PAYONEER_SIGNUP_MUTATION = gql`
  mutation PaymentSettingsState_PayoneerSignup {
    payments {
      payoneerSignup {
        ok
        message
        redirectUrl
      }
    }
  }
`;

export const UPDATE_PAYONEER_SETTING_MUTATION = gql`
  mutation PaymentSettingsState_UpdatePayoneerSetting(
    $input: UpdatePayoneerSettingInput!
  ) {
    payments {
      updatePayoneerSetting(input: $input) {
        ok
        message
        newNextPayoutTime {
          unix
          mmddyyyy
        }
      }
    }
  }
`;

export const UPDATE_PAYPAL_SETTING_MUTATION = gql`
  mutation PaymentSettingsState_UpdatePayPalSetting(
    $input: UpdatePayPalSettingInput!
  ) {
    payments {
      updatePaypalSetting(input: $input) {
        ok
        message
        newNextPayoutTime {
          unix
          mmddyyyy
        }
      }
    }
  }
`;

export type PayoneerSignupResponseType = {
  readonly payments: {
    readonly payoneerSignup: Pick<
      PayoneerSignupMutation,
      "ok" | "message" | "redirectUrl"
    >;
  };
};

export type UpdatePayoneerSettingResponseType = {
  readonly payments: {
    readonly updatePayoneerSetting: Pick<
      UpdatePayoneerSettingMutation,
      "ok" | "message"
    > & {
      readonly newNextPayoutTime?: Pick<Datetime, "unix" | "mmddyyyy"> | null;
    };
  };
};

export type UpdatePayPalSettingResponseType = {
  readonly payments: {
    readonly updatePaypalSetting: Pick<
      UpdatePayPalSettingMutation,
      "ok" | "message"
    > & {
      readonly newNextPayoutTime?: Pick<Datetime, "unix" | "mmddyyyy"> | null;
    };
  };
};
