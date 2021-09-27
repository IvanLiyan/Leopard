/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type CountryBan = {
  readonly country_code: CountryCode;
  readonly reapplication_date: number;
};

export type WishExpressState =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "REJECTED";

export type WishExpressApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SubmitReApplyParams = {
  readonly countries: string;
};

export type WishExpressApplication = {
  readonly id: string;
  readonly status_name: WishExpressApplicationStatus;
  readonly created_time: number;
  readonly approved_time: undefined | number;
  readonly declined_time: undefined | number;
  readonly wish_express_countries: ReadonlyArray<CountryCode>;
  readonly approved_countries: undefined | ReadonlyArray<CountryCode>;
  readonly decline_reason_text: undefined | string;
};

export type GetWishExpressStatusResponse = {
  readonly active_bans: { [countryCode in CountryCode]: CountryBan };
  readonly wish_express_state: WishExpressState;
  readonly most_recent_application: undefined | WishExpressApplication;
  readonly we_eligible_application_countries: ReadonlyArray<CountryCode>;
};

export type GetWishExpressCountryReqListResponse = {
  readonly country_req_list: { [country in CountryCode]: number };
};

export const getStatus = (): MerchantAPIRequest<
  {},
  GetWishExpressStatusResponse
> => new MerchantAPIRequest("wish-express/status", {});

export const enrollMerchant = (): MerchantAPIRequest<{}, {}> =>
  new MerchantAPIRequest("wish-express/enroll", {});

export const submitReApply = (
  args: SubmitReApplyParams
): MerchantAPIRequest<SubmitReApplyParams, {}> =>
  new MerchantAPIRequest("wish-express/submit-application", args);

export const getCountryReqList = (): MerchantAPIRequest<
  {},
  GetWishExpressCountryReqListResponse
> => new MerchantAPIRequest("wish-express/country-req-list");
