import { gql } from "@gql";
import {
  Datetime,
  MerchantWishSellerStandardDetailsRecentStatsArgs,
  WishSellerStandardStats,
} from "@schema";

export const UNDERPERFORMING_PRODUCTS_HEADER_QUERY = gql(`
  query UnderperformingProductsHeaderQuery($days: Int) {
    currentMerchant {
      wishSellerStandard {
        stats {
          badProductRate
          badProductCount
          productWithOrdersCount
          date {
            unix
          }
        }
        recentStats(days: $days) {
          badProductRate
          date {
            unix
          }
        }
        monthlyUpdateStats {
          badProductRate
        }
      }
    }
  }
`);

export type UnderperformingProductsHeaderQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly stats?: Pick<
        WishSellerStandardStats,
        "badProductRate" | "badProductCount" | "productWithOrdersCount"
      > & { readonly date: Pick<Datetime, "unix"> };
      readonly recentStats: ReadonlyArray<
        Pick<WishSellerStandardStats, "badProductRate"> & {
          readonly date: Pick<Datetime, "unix">;
        }
      >;
      readonly monthlyUpdateStats?: Pick<
        WishSellerStandardStats,
        "badProductRate"
      >;
    };
  };
};

export type UnderperformingProductsHeaderQueryRequest =
  MerchantWishSellerStandardDetailsRecentStatsArgs;
