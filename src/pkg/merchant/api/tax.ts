/* Lego Toolkit */
import { CountryCode } from "@schema/types";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

import {
  TaxSettingAuthorityLevel,
  CommerceMerchantReviewStatus,
  CommerceMerchantTaxInfoStatus,
  CommerceMerchantTaxInfoGermanyNoNumberReason,
  TaxSetting,
} from "@schema/types";

export type ReviewStatus = CommerceMerchantReviewStatus;
export type TaxInfoStatus = CommerceMerchantTaxInfoStatus;
export type AuthorityLevel = TaxSettingAuthorityLevel;
export type GermanyNoNumberReason =
  CommerceMerchantTaxInfoGermanyNoNumberReason;

export type CommerceMerchantTaxInfoJson = {
  readonly id: string;
  readonly state_code: string;
  readonly tax_number: string | null;
  readonly country_code: CountryCode;
  readonly review_status: ReviewStatus | null | undefined;
  readonly authority_level: AuthorityLevel;
  readonly last_updated: number;
  readonly status: TaxInfoStatus;
  readonly display_name: string | null | undefined;
  readonly certificate_file_url?: string | null | undefined;
  readonly de_no_number_reason?: GermanyNoNumberReason | null | undefined;
  readonly mx_default_ship_from_is_mx?: boolean | null | undefined;
  readonly oss_registration_country_code?: CountryCode | null | undefined;
  readonly tax_number_type?: TaxSetting["taxNumberType"] | null;
  readonly eu_vat_country_codes?: ReadonlySet<CountryCode> | null;
};

export type UpdateTaxIDParams = {
  // JSON string
  readonly data: string;
};

export type UpdateTaxIDResponse = {
  success: boolean;
};

export type DeleteCountrySettingsParams = {
  readonly country_code: string;
};

export type DeleteCountrySettingsResponse = {
  readonly success: boolean;
};

export type ExportReportParams = {
  readonly start_date: number;
  // end date inclusive
  readonly end_date: number;
  // comma-separate list of country codes
  readonly country_codes: string;
};

export type ExportReportResponse = {
  success: boolean;
};

export type HomeRuleAuthority = {
  readonly display_name: string;
  readonly state: string;
  readonly district?: string;
  readonly city?: string;
  readonly county?: string;
  readonly is_marketplace: boolean;
  readonly is_home_rule: boolean;
};

export type GetAvailableHomeRuleAuthoritiesParams = {
  readonly country_code: string;
  readonly state_code: string;
};

export type GetAvailableHomeRuleAuthoritiesResponse = {
  readonly cities: ReadonlyArray<HomeRuleAuthority>;
  readonly counties: ReadonlyArray<HomeRuleAuthority>;
  readonly districts: ReadonlyArray<HomeRuleAuthority>;
};

export const getAvailableHomeRuleAuthorities = (
  args: GetAvailableHomeRuleAuthoritiesParams
): MerchantAPIRequest<
  GetAvailableHomeRuleAuthoritiesParams,
  GetAvailableHomeRuleAuthoritiesResponse
> => new MerchantAPIRequest("tax/get-available-authorities", args);

export const exportReport = (
  args: ExportReportParams
): MerchantAPIRequest<ExportReportParams, ExportReportResponse> =>
  new MerchantAPIRequest("tax/export-report", args);

export const deleteCountrySettings = (
  args: DeleteCountrySettingsParams
): MerchantAPIRequest<
  DeleteCountrySettingsParams,
  DeleteCountrySettingsResponse
> => new MerchantAPIRequest("tax-settings/delete-country", args);

export const setTaxID = (
  args: UpdateTaxIDParams
): MerchantAPIRequest<UpdateTaxIDParams, UpdateTaxIDResponse> =>
  new MerchantAPIRequest("tax-settings/set-id", args);
