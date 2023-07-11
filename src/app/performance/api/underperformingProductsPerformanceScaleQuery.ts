import { gql } from "@gql";
import { WishSellerStandardStats } from "@schema";

export const UNDERPERFORMING_PRODUCTS_PERFORMANCE_SCALE_QUERY = gql(`
  query UnderperformingProductsPerformanceScaleQuery {
    currentMerchant {
      wishSellerStandard {
        stats {
          badProductRate
        }
      }
    }
  }
`);

export type UnderperformingProductsPerformanceScaleQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly stats?: Pick<WishSellerStandardStats, "badProductRate">;
    };
  };
};
