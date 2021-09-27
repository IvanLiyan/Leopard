/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";
import { Maybe, UserEntityType } from "@schema/types";

export type NewSignupParams = {
  readonly email: string;
  readonly source: "signup_v4" | "signup_express" | "signup_merchant_plus";
  readonly password: string;
  readonly store_name: string;
  readonly captcha_code?: undefined | null | string;
  readonly signupButton?: undefined | null | string;
  readonly captcha_token?: undefined | null | string;
  readonly bd_signup_code?: undefined | null | string;
  readonly salesforce_lead_id?: undefined | null | string;
  readonly landing_source?: undefined | null | string;
  readonly utm_source?: undefined | null | string;
  readonly utm_campaign?: undefined | null | string;
  readonly utm_term?: undefined | null | string;
  readonly utm_content?: undefined | null | string;
  readonly referral_id?: undefined | null | string;
  readonly paypal_merchant_id?: undefined | null | string;
  readonly google_click_id?: undefined | null | string;
  readonly referrer?: undefined | null | string;
  readonly merchant_invitation_code?: undefined | null | string;
  readonly link_position?: undefined | null | string;
  readonly pre_order_invite_code?: string | null | undefined;
  readonly invite?: string | null | undefined;
};

export type NewSignupResponse = {
  readonly session: string;
  readonly paypal_success: boolean;
  readonly email_from_cn: boolean;
};

export type OnboardingContactInfoParams = {
  readonly first_name: string;
  readonly last_name: string;
  readonly phone_number: string;
  readonly street_address1: string;
  readonly street_address2?: undefined | null | string;
  readonly city: string;
  readonly zipcode: string;
  readonly state: string;
  readonly country_code: string;
  readonly verification_code?: undefined | null | string;
  readonly domicile_country?: undefined | null | string;
  readonly company_name?: undefined | null | string;
  readonly entity_type?: Maybe<UserEntityType>;
};

export type OnboardingContantInfoResponse = {};

export type IndividualStoreIdentificationWithPhotoIDParams = {
  readonly photo_id_number: string;
  readonly photo_id_url: string;
  readonly photo_id_filename: string;
};

export type IndividualStoreIdentificationWithStoreDetailsParams = {
  readonly store_url: string;
  // comma-separated list of urls
  readonly screenshots: string;
};

export type IndividualStoreIdentificationParams = (
  | IndividualStoreIdentificationWithPhotoIDParams
  | IndividualStoreIdentificationWithStoreDetailsParams
) & {
  readonly entity_type: 1;
};

export type CompanyStoreIdentificationParams = {
  readonly entity_type: 2;
  readonly company_name: string;

  readonly business_license: string;
  readonly business_license_url: string;
  readonly business_license_filename: string;

  readonly legal_rep_id: string;
  readonly legal_rep_name: string;
  readonly legal_rep_id_url: string;
  readonly legal_rep_id_filename: string;
};

export type ERPIdentificationParams = {
  readonly id_source: 2;
  readonly client_id: string;
};

export type PSPIdentificationParams = {
  readonly id_source: 3;
  readonly psp_id: Uint8Array;
};

export type StoreIdentificationParams =
  | IndividualStoreIdentificationParams
  | CompanyStoreIdentificationParams
  | ERPIdentificationParams
  | PSPIdentificationParams;

export type StoreIdentificationResponse = {};

export type ResellerAgreementParam = {
  readonly userChoice: boolean;
  readonly userCheckTerms: boolean;
  readonly brandNames: string;
};

export type ResellerAgreementResponse = {};

export type OpenStoreParams = {};

export type OpenStoreResponse = {};

export type SendVerificationCodeParams = {
  readonly phoneNumber: string;
  readonly phoneNumberAreaCode: string;
};
export type SendVerificationCodeResponse = {};

export const setStoreIdentification = (
  args: StoreIdentificationParams
): MerchantAPIRequest<StoreIdentificationParams, StoreIdentificationResponse> =>
  new MerchantAPIRequest("onboarding-v4/store-id", args);

export const setContactInfo = (
  args: OnboardingContactInfoParams
): MerchantAPIRequest<
  OnboardingContactInfoParams,
  OnboardingContactInfoParams
> => new MerchantAPIRequest("onboarding/contact-info", args);

export const signup = (
  args: NewSignupParams
): MerchantAPIRequest<NewSignupParams, NewSignupResponse> =>
  new MerchantAPIRequest("user/new-signup", args);

export const openStoreRequest = (
  args: OpenStoreParams
): MerchantAPIRequest<OpenStoreParams, OpenStoreResponse> =>
  new MerchantAPIRequest("lead/open-store", args);

export const resellerAgreementRequest = (
  args: ResellerAgreementParam
): MerchantAPIRequest<ResellerAgreementParam, ResellerAgreementResponse> =>
  new MerchantAPIRequest("reseller-agreement", args);

export const sendVerificationCode = (
  args: SendVerificationCodeParams
): MerchantAPIRequest<
  SendVerificationCodeParams,
  SendVerificationCodeResponse
> => new MerchantAPIRequest("user/send-phone-number-verification-code", args);

export type PaypalMerchant = {
  id: string;
  paypal_id: string;
  paypal_verified: boolean;
  paypal_payer_id: string;
  access_token: string;
  refresh_token: string;
  expiry_time: number;
  email: string;
  business_name: string;
};

export type GetPaypalMerchantDetailsParams = {
  paypal_code: string;
};

export type GetPaypalMerchantDetailsResponse = {
  paypal_merchant?: PaypalMerchant | null | undefined;
  payer_id_already_used?: Boolean | null | undefined;
  untrusted_account: Boolean | null | undefined;
};

export const getPaypalMerchantDetails = (
  args: GetPaypalMerchantDetailsParams
): MerchantAPIRequest<
  GetPaypalMerchantDetailsParams,
  GetPaypalMerchantDetailsResponse
> => new MerchantAPIRequest("paypal/initialize-signup", args);

export type SkipStoreIdentificationParam = {};

export type SkipStoreIdentificationResp = {};

export const skipStoreIdentification = (
  args: SkipStoreIdentificationParam
): MerchantAPIRequest<
  SkipStoreIdentificationParam,
  SkipStoreIdentificationResp
> => new MerchantAPIRequest("skip-store-identification", args);

export type SendConfirmEmailParams = {
  readonly email: string;
  readonly regenerate_code: boolean;
};

export type SendConfirmEmailResp = {};

export const sendConfirmEmail = (
  args: SendConfirmEmailParams
): MerchantAPIRequest<SendConfirmEmailParams, SendConfirmEmailResp> =>
  new MerchantAPIRequest("send-confirmation-email", args);
