/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

type NoParam = {};

export type EntityTypeName = "individual" | "company";

export type ProfileStatus =
  | "incomplete"
  | "complete"
  | "reviewing"
  | "approved"
  | "rejected";

// Types do not need to be translated
// eslint-disable-next-line local-rules/unwrapped-i18n
export type GenderType = "Male" | "Female" | "Unknown";

type GetProfileParam = {
  readonly create_new?: undefined | null | boolean;
};

export type GetProfileResponse = {
  readonly state_name: ProfileStatus;
  readonly stored_country: undefined | null | CountryCode;
  readonly can_change_country: boolean;
  readonly can_start_kyc: boolean;
};

export const getProfile = (
  args: GetProfileParam
): MerchantAPIRequest<GetProfileParam, GetProfileResponse> =>
  new MerchantAPIRequest("kyc-verification/get", args);

type SetCountryOfDomicileParams = {
  readonly page_name: "CountryOfDomicileKYC";
  readonly country_code_domicile: CountryCode;
};

type SetIdentityKYCParams = {
  readonly page_name: "IdentityPageKYC";
  readonly entity_type_name: EntityTypeName;
};

export type SetDataParams = SetCountryOfDomicileParams | SetIdentityKYCParams;

export type SetDataResp = {
  readonly selected_non_eea_country?: boolean;
};

export const setData = (
  args: SetDataParams
): MerchantAPIRequest<SetDataParams, SetDataResp> =>
  new MerchantAPIRequest("kyc-verification/set-data", args);

type DnBData = {
  readonly entity_type_name: "company";
  readonly business_number: string;
};

type FourthlineData = {
  readonly entity_type_name: "individual";
  readonly nationality: CountryCode;
  readonly birth_city: string;
  readonly birth_country: CountryCode;
  readonly birthday_timestamp: number;
  readonly gender: GenderType;
};

export type GetKYRedirectionParam = FourthlineData | DnBData;

type GetKYCRedirectionResp = {
  readonly kyc_redirect_code: string;
};

export const getKYCRedirection = (
  args: GetKYRedirectionParam
): MerchantAPIRequest<GetKYRedirectionParam, GetKYCRedirectionResp> =>
  new MerchantAPIRequest("kyc-verification/get-kyc-redirection", args);

export type SwitchVerificationFlowParams = {
  country_code_domicile: CountryCode;
};

export const switchVerificationFlow = (
  args: SwitchVerificationFlowParams
): MerchantAPIRequest<SwitchVerificationFlowParams, NoParam> =>
  new MerchantAPIRequest("kyc-verification/switch-flow", args);
