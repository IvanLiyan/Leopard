/* External Libraries */
import { CommerceMerchantState } from "@schema/types";

/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type EntityTypeNumber = 1 | 2;

export type BusinessAddress = {
  readonly city: string;
  readonly country: string;
  readonly country_code: CountryCode;
  readonly state: string;
  readonly street_address1: string;
  readonly street_address2?: string | null | undefined;
  readonly zipcode?: string;
};

export type BackToOnboardingReasonName =
  | "DORMANT"
  | "REVERT_REVIEW_RESULT"
  | "FAKE_NON_CN_NO_REAL_NAME";

export type MerchantUser = {
  readonly business_address: BusinessAddress;
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly username: string;
  readonly bd_email: string;
  readonly is_on_vacation?: boolean;
  readonly phone_number: string;
  readonly merchant_id: string;
  readonly merchant_name?: string | null | undefined;
  // array of step ids
  readonly new_onboarding_steps_completed: ReadonlyArray<number>;
  // array of step ids
  readonly new_onboarding_steps_required: ReadonlyArray<number>;
  readonly onboarding_completed?: boolean;
  readonly can_access_home: boolean;
  readonly is_cn_merchant: boolean;
  readonly from_signup_express: boolean;
  readonly from_signup_merchant_plus: boolean;
  readonly merchant_state: number;
  readonly merchant_state_name: CommerceMerchantState;
  readonly is_epc_active: boolean;
  readonly is_sub_user: boolean;
  readonly back_to_onboarding_reason?: string | null | undefined;
  readonly back_to_onboarding_reason_name?:
    | BackToOnboardingReasonName
    | null
    | undefined;
  readonly ip_country_when_created?: string | null | undefined;
  readonly is_cs_rep: boolean;
  readonly is_cs_rep_team_member: boolean;
  readonly is_cs_rep_team_lead: boolean;
  readonly is_cs_rep_internal: boolean;
  readonly is_admin: boolean;
  readonly is_bd: boolean;
  readonly is_merchant: boolean;
  readonly erp_promo_info_referral_id: string;
  readonly has_active_reduced_rev_share: boolean;
  readonly is_paypal_merchant: boolean;
  readonly have_sent_signup_confirm_email: boolean;
  readonly is_api_user: boolean;
  readonly display_name: string;
  readonly name: string;
  readonly entity_type: null | undefined | EntityTypeNumber;
  readonly company_name: string | null | undefined;
  readonly is_new_merchant_lead: boolean;
  readonly utm_source: string | null | undefined;
  readonly preorder_gmv: number | null | undefined;
  readonly is_preorder_merchant: number | null | undefined;
  readonly is_store_merchant: boolean | null | undefined;
};

export type GetCaptchaResponse = {
  readonly token: string;
};

export const getCaptchaToken = (): MerchantAPIRequest<{}, GetCaptchaResponse> =>
  new MerchantAPIRequest("captcha_token", {});

type LogoutParams = {};

type LogoutResponse = {};

export const logout = (
  args: LogoutParams
): MerchantAPIRequest<LogoutParams, LogoutResponse> =>
  new MerchantAPIRequest("logout", args);

type LoginAsArgs = {
  readonly bd_client: string;
};

type LoginAsResponse = {};

export const loginAsRequest = (
  args: LoginAsArgs
): MerchantAPIRequest<LoginAsArgs, LoginAsResponse> =>
  new MerchantAPIRequest("login-as", args);
