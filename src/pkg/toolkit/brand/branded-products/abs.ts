/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Type Imports */
import { TrademarkCountryCode } from "@schema/types";

export const startApplicationLink = (brandId?: string) => {
  const queryParam = brandId ? `?brand_id=${brandId}` : ``;
  return `/branded-products/authentic-brand-seller-application${queryParam}`;
};

export const startApplication = (brandId?: string) => {
  const { navigationStore } = AppStore.instance();
  const path = startApplicationLink(brandId);
  navigationStore.navigate(path);
};

export type ABSBApplicationSellerType =
  | "BRAND_OWNER"
  | "AUTHORIZED_RESELLER"
  | "UNAUTHORIZED_RESELLER";

export type ABSBApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type ABSBAuthDoc = {
  readonly display_filename: string;
  readonly url: string;
};

export type ABSBTrademarkCountryCode = TrademarkCountryCode | "D";

export type ABSBApplication = {
  readonly application_id: string;
  readonly status: ABSBApplicationStatus;
  readonly authorization_type: ABSBApplicationSellerType;
  readonly date_submitted: number;
  readonly date_completed: number | null | undefined;
  readonly expiration_date: number | null | undefined;
  readonly auth_docs?: ReadonlyArray<ABSBAuthDoc>;
  readonly provided_countries: ReadonlyArray<ABSBTrademarkCountryCode>;
  readonly confirmed_countries?: ReadonlyArray<ABSBTrademarkCountryCode>;
  readonly brand_owner_name: string;
  readonly brand_rep_name: string;
  readonly brand_rep_title: string;
  readonly brand_rep_phone: string;
  readonly brand_rep_email: string;
  readonly note: string | null | undefined;
};

export type ABSBBrandApplication = {
  readonly brand_id: string;
  readonly brand_name: string;
  readonly logo_url: string | null | undefined;
  readonly applications: ReadonlyArray<ABSBApplication>;
};
