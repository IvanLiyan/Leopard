// ==============================================
// seller-profile-verification/get-banner
// ==============================================

export const SELLER_PROFILE_BANNER_ENDPOINT =
  "/api/seller-profile-verification/get-banner";

export type GetSellerProfileBannerResult = {
  readonly title?: string | null;
  readonly body?: string | null;
};
