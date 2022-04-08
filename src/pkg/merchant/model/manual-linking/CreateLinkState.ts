import { observable, action, computed } from "mobx";

/* Types */
import {
  CompleteManualLinkRequestType,
  CompleteManualLinkResponseType,
  COMPLETE_MANUAL_LINK_MUTATION,
  CreateLinkStep,
  RequestManualLinkRequestType,
  RequestManualLinkResponseType,
  REQUEST_MANUAL_LINK_MUTATION,
} from "@toolkit/manual-linking/create-link";

/* Stores */
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";

/**
 * Manual linking - link creation flow states
 */
export default class CreateLinkState {
  @observable
  merchant?: string; // merchant email or username

  @observable
  password?: string;

  @observable
  verificationCode?: string;

  @observable
  obfuscatedPhoneNumber: string = i`N/A`;

  @observable
  supportVerificationCode: string = i`N/A`;

  @observable
  currentStep: CreateLinkStep = "AUTHENTICATE";

  @observable
  sendPhoneCall: boolean = false;

  @observable
  isVerificaitonCodeSent: boolean = false;

  @observable
  isAuthenticating: boolean = false;

  @observable
  isVerifying: boolean = false;

  @observable
  isCompleted: boolean = false;

  /**
   * canAuthenticate - indicate whether user has entered valid credentials of linked store and can authenticate linking
   */
  @computed
  get canAuthenticate(): boolean {
    const { merchant, password } = this;

    if (
      merchant == null ||
      merchant.trim().length === 0 ||
      password == null ||
      password.trim().length === 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * canVerify - indicate whether user has entered valid verification data and can verify and create link
   */
  @computed
  get canVerify(): boolean {
    const { merchant, verificationCode } = this;

    if (
      merchant == null ||
      merchant.trim().length === 0 ||
      verificationCode == null ||
      verificationCode.trim().length === 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * authenticateLinking - Authenticate user entered credentials and send verificaiton code
   */
  @action
  authenticateLinking = async () => {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const { merchant, password, sendPhoneCall } = this;

    this.isAuthenticating = true;
    this.isVerificaitonCodeSent = false;

    if (
      merchant == null ||
      merchant.trim().length === 0 ||
      password == null ||
      password.trim().length === 0
    ) {
      this.isAuthenticating = false;
      toastStore.negative(i`Please provide the login credentials to proceed.`);
      return;
    }

    const input = {
      merchant,
      password,
      sendPhoneCall,
    };

    const { data } = await client.mutate<
      RequestManualLinkResponseType,
      RequestManualLinkRequestType
    >({
      mutation: REQUEST_MANUAL_LINK_MUTATION,
      variables: { input },
    });

    const ok = data?.currentUser?.manualLinkEntity.requestManualLink?.ok;
    const message =
      data?.currentUser?.manualLinkEntity.requestManualLink?.message;

    const obfuscatedPhoneNumber =
      data?.currentUser?.manualLinkEntity.requestManualLink
        ?.obfuscatedPhoneNumber;
    const supportVerificationCode =
      data?.currentUser?.manualLinkEntity.requestManualLink
        ?.supportVerificationCode;

    this.isAuthenticating = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`
      );
      return;
    }

    // update verification infos
    this.obfuscatedPhoneNumber = obfuscatedPhoneNumber || i`N/A`;
    this.supportVerificationCode = supportVerificationCode || i`N/A`;
    this.isVerificaitonCodeSent = true;

    // go to verification step
    if (this.currentStep === "AUTHENTICATE") {
      this.currentStep = "VERIFY";
    }
  };

  /**
   * completeLinking - verify code and create link
   */
  @action
  completeLinking = async () => {
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    const { merchant, verificationCode } = this;

    this.isVerifying = true;

    if (
      merchant == null ||
      merchant.trim().length === 0 ||
      verificationCode == null ||
      verificationCode.trim().length === 0
    ) {
      this.isVerifying = false;
      toastStore.negative(i`Please provide the verification code to proceed.`);
      return;
    }

    const input = {
      merchant,
      verificationCode,
    };

    const { data } = await client.mutate<
      CompleteManualLinkResponseType,
      CompleteManualLinkRequestType
    >({
      mutation: COMPLETE_MANUAL_LINK_MUTATION,
      variables: { input },
    });

    const ok = data?.currentUser?.manualLinkEntity.completeManualLink?.ok;
    const message =
      data?.currentUser?.manualLinkEntity.completeManualLink?.message;

    this.isVerifying = false;

    if (!ok) {
      toastStore.negative(
        message || i`Something went wrong, please try again.`
      );
      return;
    }

    this.isCompleted = true;
  };
}
