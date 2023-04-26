import { CountryCode } from "@schema";

// ==============================================
// wish-express/status
// ==============================================

export const WISH_EXPRESS_GET_STATUS_ENDPOINT = "/api/wish-express/status";

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

// ==============================================
// wish-express/submit-application
// ==============================================

export const WISH_EXPRESS_SUBMIT_APPLICATION_ENDPOINT =
  "/api/wish-express/submit-application";

export type SubmitReApplyParams = {
  readonly countries: ReadonlyArray<CountryCode>;
};
