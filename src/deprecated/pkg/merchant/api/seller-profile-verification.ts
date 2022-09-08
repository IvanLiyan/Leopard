/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

type NoParam = {};
export type ProfileStatus =
  | "incomplete"
  | "complete"
  | "reviewing"
  | "approved"
  | "rejected";

export type KycStatus = "incomplete" | "complete" | "rejected";

export type EntityTypeName = "individual" | "company";

export type DocType =
  | "national_id"
  | "driver_license"
  | "passport"
  | "state_id"
  | "social_security_card"
  | "citizenship_card"
  | "permanent_resident_card"
  | "business_license"
  | "articles_of_incorporation"
  | "certificate_of_incorporation"
  | "partnership_agreement"
  | "recent_business_returns"
  | "vat_registration_certificate";

type GetProfileParam = {
  readonly create_new?: undefined | null | boolean;
};

export type GetProfileResponse = {
  readonly state: number;
  readonly state_name: ProfileStatus;
  readonly created_time: string;
  readonly updated_time: string;
  readonly is_mandatory: boolean;
  readonly is_kyc_verification: boolean;
  readonly can_start: boolean;
  readonly kyc_status: KycStatus;
  readonly initial_pause_impression_date: undefined | null | string;
  readonly admin_comment: undefined | null | { [field_name: string]: string };
  readonly get_started_viewed: undefined | null | boolean;
  readonly first_name: undefined | null | string;
  readonly middle_name: undefined | null | string;
  readonly last_name: undefined | null | string;
  readonly date_of_birth: undefined | null | string;
  readonly phone_number: undefined | null | string;
  readonly country_code_domicile: undefined | null | CountryCode;
  readonly country_code_domicile_in_cm: undefined | null | CountryCode;
  readonly suspected_country_in_cm: undefined | null | CountryCode;
  readonly merchant_country: undefined | null | CountryCode;
  readonly ba_country_code: undefined | null | CountryCode;
  readonly ba_state: undefined | null | string;
  readonly ba_city: undefined | null | string;
  readonly ba_street1: undefined | null | string;
  readonly ba_street2: undefined | null | string;
  readonly ba_zipcode: undefined | null | string;
  readonly entity_type_name: undefined | null | EntityTypeName;
  readonly company_name: undefined | null | string;
  readonly doc_type: undefined | null | DocType;
  readonly proof_of_id: undefined | null | { [imageId: string]: string };
  readonly gmv_limit: null | number;
};

export const getProfile = (
  args: GetProfileParam
): MerchantAPIRequest<GetProfileParam, GetProfileResponse> =>
  new MerchantAPIRequest("seller-profile-verification/get", args);

type ViewGetStartedParams = {
  readonly page_name: "GetStartedPage";
};

type SetCountryOfDomicileParams = {
  readonly page_name: "CountryOfDomicilePage";
  readonly country_code_domicile: string;
};

type SetBusinessAddressParams = {
  readonly page_name: "BusinessLocationPage";
  readonly ba_state: string;
  readonly ba_city: string;
  readonly ba_street1: string;
  readonly ba_street2: string;
  readonly ba_zipcode: string;
};

type SetPhoneNumberParams = {
  readonly page_name: "PhoneNumberPage";
  readonly phone_number_area_code: string;
  readonly phone_number: string;
  readonly verification_code: string;
};

type SetIdentityParams = {
  readonly page_name: "IdentityPage";
  readonly entity_type_name: EntityTypeName;
  readonly first_name: string;
  readonly last_name: string;
  readonly middle_name: string;
  readonly birthday_timestamp: number;
  readonly company_name: string | null | undefined;
  readonly uploaded_images: string;
  readonly doc_type: DocType;
};

type SetIdentityKYCParams = {
  readonly page_name: "IdentityPageKYC";
  readonly entity_type_name: EntityTypeName;
};

export type SetDataParams =
  | ViewGetStartedParams
  | SetCountryOfDomicileParams
  | SetBusinessAddressParams
  | SetPhoneNumberParams
  | SetIdentityParams
  | SetIdentityKYCParams;

export const setData = (
  args: SetDataParams
): MerchantAPIRequest<SetDataParams, NoParam> =>
  new MerchantAPIRequest("seller-profile-verification/set-data", args);

export const reverifySellerProfile = (
  args: NoParam
): MerchantAPIRequest<NoParam, NoParam> =>
  new MerchantAPIRequest("seller-profile-verification/reverify", args);

export const startOver = (
  args: NoParam
): MerchantAPIRequest<NoParam, NoParam> =>
  new MerchantAPIRequest("seller-profile-verification/start-over", args);

type GetSellerProfileBannerResp = {
  readonly title?: string | null;
  readonly body?: string | null;
};

export const getSellerProfileBanner = (
  args: NoParam
): MerchantAPIRequest<NoParam, GetSellerProfileBannerResp> =>
  new MerchantAPIRequest("seller-profile-verification/get-banner", args);

type GetKYCUrlParam = {
  readonly entity_type_name: EntityTypeName;
};

type GetKYCUrlResp = {
  readonly kyc_url: string;
};

export const getKYCUrl = (
  args: GetKYCUrlParam
): MerchantAPIRequest<GetKYCUrlParam, GetKYCUrlResp> =>
  new MerchantAPIRequest("seller-profile-verification/get-kyc-url", args);
