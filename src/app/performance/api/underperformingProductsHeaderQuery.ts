import { gql } from "@apollo/client";
import { RecentStatsDayCount } from "@performance/migrated/toolkit/order-metrics";
import { Datetime, WishSellerStandardStats } from "@schema";

export const UNDERPERFORMING_PRODUCTS_HEADER_QUERY = gql`
  query UnderperformingProductsHeaderQuery {
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
        recentStats(days: ${RecentStatsDayCount}) {
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
`;

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
