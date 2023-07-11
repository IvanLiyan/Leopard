import { gql } from "@gql";
import { WssProductRatingPage, WssProductRefundPage } from "@schema";

export const UNDERPERFORMING_PRODUCTS_TABLE_QUERY = gql(`
  query UnderperformingProductsTableQuery {
    currentMerchant {
      wishSellerStandard {
        deepDive {
          productQualityRefund(isBadByRefund: true) {
            totalCount
          }
          productRating(isBadByRating: true) {
            totalCount
          }
        }
      }
    }
  }
`);

export type UnderperformingProductsTableQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard: {
      readonly deepDive?: {
        readonly productQualityRefund?: Pick<
          WssProductRefundPage,
          "totalCount"
        >;
        readonly productRating?: Pick<WssProductRatingPage, "totalCount">;
      };
    };
  };
};
