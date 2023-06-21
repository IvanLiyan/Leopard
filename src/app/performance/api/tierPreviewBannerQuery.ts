import { gql } from "@apollo/client";
import {
  MerchantWishSellerStandardDetails,
  WishSellerStandardStats,
} from "@schema";

export const TIER_PREVIEW_BANNER_QUERY = gql`
  query TierPreviewBannerQuery {
    currentMerchant {
      wishSellerStandard {
        level
        stats {
          levelPreview
        }
      }
    }
  }
`;

export type TierPreviewBannerQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: Pick<
      MerchantWishSellerStandardDetails,
      "level"
    > & {
      readonly stats?: Pick<WishSellerStandardStats, "levelPreview">;
    };
  };
};
