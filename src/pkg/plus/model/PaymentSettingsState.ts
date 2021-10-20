import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import {
  UpdatePayoneerSettingInput,
  UpdatePayPalSettingInput,
  MerchantPaymentCollectorType,
  PayoneerSignupMutation,
  UpdatePayoneerSettingMutation,
  UpdatePayPalSettingMutation,
  PayoutPaymentProviderType,
} from "@schema/types";

import { PaymentSettingsInitialData } from "@toolkit/payment-settings";

import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

const PAYONEER_SIGNUP_MUTATION = gql`
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

const UPDATE_PAYONEER_SETTING_MUTATION = gql`
  mutation PaymentSettingsState_UpdatePayoneerSetting(
    $input: UpdatePayoneerSettingInput!
  ) {
    payments {
      updatePayoneerSetting(input: $input) {
        ok
        message
      }
    }
  }
`;

const UPDATE_PAYPAL_SETTING_MUTATION = gql`
  mutation PaymentSettingsState_UpdatePayPalSetting(
    $input: UpdatePayPalSettingInput!
  ) {
    payments {
      updatePaypalSetting(input: $input) {
        ok
        message
      }
    }
  }
`;

type PayoneerSignupResponseType = {
  readonly payments: {
    readonly payoneerSignup: Pick<
      PayoneerSignupMutation,
      "ok" | "message" | "redirectUrl"
    >;
  };
};

type UpdatePayoneerSettingResponseType = {
  readonly payments: {
    readonly updatePayoneerSetting: Pick<
      UpdatePayoneerSettingMutation,
      "ok" | "message"
    >;
  };
};

type UpdatePayPalSettingResponseType = {
  readonly payments: {
    readonly updatePaypalSetting: Pick<
      UpdatePayPalSettingMutation,
      "ok" | "message"
    >;
  };
};

export default class PaymentSettingsState {
  @observable
  isOnboarding: boolean = false;

  @observable
  isStoreMerchant: boolean = false;

  @observable
  paymentProvider?: PayoutPaymentProviderType;

  @observable
  personalName: string;

  @observable
  personalPhoneNumber: string;

  @observable
  personalId: string | null | undefined;

  @observable
  email: string;

  @observable
  businessName?: string;

  @observable
  businessId?: string;

  @observable
  collectorType: MerchantPaymentCollectorType;

  @observable
  isPersonalNameValid: boolean = false;

  @observable
  isPersonalPhoneNumberValid: boolean = false;

  @observable
  isEmailValid: boolean = false;

  @observable
  isBusinessNameValid: boolean = false;

  @observable
  isBusinessIdValid: boolean = false;

  @observable
  isSubmitting: boolean = false;

  constructor(args: {
    readonly initialData: PaymentSettingsInitialData;
    readonly isOnboarding: boolean;
  }) {
    const {
      initialData: {
        payments: {
          currentMerchant: {
            personalInfo,
            businessInfo,
            currentProvider,
            allowedProviders,
          },
        },
        currentMerchant: { isStoreMerchant },
        currentUser: { firstName, lastName, phoneNumber },
      },
      isOnboarding,
    } = args;

    this.isOnboarding = isOnboarding;

    this.isStoreMerchant = isStoreMerchant;

    this.personalName = isStoreMerchant
      ? `${firstName?.trim()} ${lastName?.trim()}`
      : personalInfo?.name || "";
    this.personalPhoneNumber = isStoreMerchant
      ? phoneNumber || ""
      : personalInfo?.phoneNumber || "";
    this.personalId = personalInfo?.id;
    this.email = "";

    this.businessId = businessInfo?.businessId;
    this.businessName = businessInfo?.name;

    if (currentProvider) {
      this.paymentProvider = currentProvider.type;
    } else if (allowedProviders.length === 1) {
      this.paymentProvider = allowedProviders[0].type;
    } else if (!isStoreMerchant) {
      this.paymentProvider = "PAYPAL_MERCH";
    }

    this.collectorType = businessInfo ? "BUSINESS" : "INDIVIDUAL";
  }

  @computed
  private get asInput() {
    const {
      personalName,
      personalPhoneNumber,
      personalId,
      businessName,
      businessId,
      collectorType,
    } = this;

    return {
      personalName,
      personalPhoneNumber,
      personalId,
      businessName,
      businessId,
      collectorType,
    };
  }

  @computed
  get formValid(): boolean {
    if (this.isStoreMerchant) {
      return this.isEmailValid;
    }

    const hasBusinessFields =
      this.collectorType === "BUSINESS"
        ? this.isBusinessIdValid && this.isBusinessNameValid
        : true;
    const hasPaypalFields =
      this.paymentProvider === "PAYPAL" ||
      this.paymentProvider === "PAYPAL_MERCH"
        ? this.isEmailValid
        : true;

    return !!(
      this.isPersonalNameValid &&
      this.isPersonalPhoneNumberValid &&
      hasBusinessFields &&
      hasPaypalFields
    );
  }

  @computed
  get formValues() {
    return {
      ...this.asInput,
      paymentProvider: this.paymentProvider,
    };
  }

  @action
  async payoneerSignup() {
    const { client } = ApolloStore.instance();
    return await client.mutate<PayoneerSignupResponseType, null>({
      mutation: PAYONEER_SIGNUP_MUTATION,
    });
  }

  @action
  async updatePayoneer() {
    const { asInput: input } = this;
    const { client } = ApolloStore.instance();
    return await client.mutate<
      UpdatePayoneerSettingResponseType,
      { input: UpdatePayoneerSettingInput }
    >({
      mutation: UPDATE_PAYONEER_SETTING_MUTATION,
      variables: { input },
    });
  }

  @action
  async updatePaypal() {
    const { asInput } = this;
    const input = { ...asInput, email: this.email };

    const { client } = ApolloStore.instance();
    return await client.mutate<
      UpdatePayPalSettingResponseType,
      { input: UpdatePayPalSettingInput }
    >({
      mutation: UPDATE_PAYPAL_SETTING_MUTATION,
      variables: { input },
    });
  }

  @action
  async submit() {
    const { paymentProvider, isOnboarding } = this;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    this.isSubmitting = true;

    let ok = null;
    let message = null;

    if (paymentProvider === "PAYPAL" || paymentProvider === "PAYPAL_MERCH") {
      const { data } = await this.updatePaypal();

      ok = data?.payments.updatePaypalSetting.ok;
      message = data?.payments.updatePaypalSetting.message;
    } else if (paymentProvider === "PAYONEER") {
      const { data: redirectData } = await this.payoneerSignup();

      const redirectUrl = redirectData?.payments.payoneerSignup.redirectUrl;

      if (redirectUrl) {
        await navigationStore.navigate(redirectUrl, {
          openInNewTab: true,
        });

        const { data } = await this.updatePayoneer();

        ok = data?.payments.updatePayoneerSetting.ok;
        message = data?.payments.updatePayoneerSetting.message;
      } else {
        ok = redirectData?.payments.payoneerSignup.ok;
        message = redirectData?.payments.payoneerSignup.message;
      }
    }

    this.isSubmitting = false;

    if (!ok) {
      toastStore.negative(
        message ||
          i`Your payment provider failed to connect, please try again.`,
      );
      return;
    }

    navigationStore.releaseNavigationLock();
    if (isOnboarding) {
      await navigationStore.navigate("/plus/home/onboarding-steps");
    } else {
      await navigationStore.navigate("/plus/settings/payment");
    }
    toastStore.positive(i`Success! You may now receive payouts from Wish.`, {
      timeoutMs: 7000,
    });
  }
}
