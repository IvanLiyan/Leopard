import { gql } from "@apollo/client";
import {
  RatingPerformanceStats,
  RatingBreakdown,
  ProductRating,
  ProductCatalogSchemaProductsArgs,
  ProductRatingListingTab,
  StoreRating,
  MerchantStatsStoreRatingsArgs,
  MerchantStats,
  Datetime,
  MerchantStatsWeeklyArgs,
} from "@schema";

export const RATING_PERFORMANCE_AGGREGATE_DATA_QUERY = gql`
  query Rating_PerformanceAggregateDataQuery($weeks: Int) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          rating {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            storeRatings
            averageStoreRating
            averageProductRating
            lowStoreRatingPercentage
            productRatings
            lowProductRatingPercentage
            average30dStoreRating
          }
        }
      }
    }
  }
`;

export type PickedRatingAggregate = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
} & Pick<
  RatingPerformanceStats,
  | "storeRatings"
  | "averageStoreRating"
  | "averageProductRating"
  | "lowStoreRatingPercentage"
  | "productRatings"
  | "lowProductRatingPercentage"
  | "average30dStoreRating"
>;

export type RatingAggregateResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly rating: PickedRatingAggregate;
      }>;
    };
  };
};

export type RatingAggregateArgs = MerchantStatsWeeklyArgs;

export type RatingAggregateBenchMark = {
  readonly benchmark: string;
  readonly averageStoreRating: string;
  readonly lowStoreRatingPercentage: string;
  readonly averageProductRating: string;
  readonly lowProductRatingPercentage: string;
  readonly average30dStoreRating: string;
};

export const RATING_PERFORMANCE_WEEKLY_STORE_RATING_DATA_QUERY = gql`
  query Rating_PerformanceAggregateDataQuery($weeks: Int) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          rating {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            averageStoreRating
          }
        }
      }
    }
  }
`;

export type PickedWeeklyStoreRating = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
} & Pick<RatingPerformanceStats, "averageStoreRating">;

export type WeeklyStoreRatingResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly rating: PickedWeeklyStoreRating;
      }>;
    };
  };
};

export type AugmentedWeeklyStoreRating = {
  readonly date: Datetime["mmddyyyy"];
} & Pick<RatingPerformanceStats, "averageStoreRating">;

export type WeeklyStoreRatingArgs = MerchantStatsWeeklyArgs;

export const RATING_PERFORMANCE_WEEKLY_PRODUCT_RATING_DATA_QUERY = gql`
  query Rating_PerformanceAggregateDataQuery($weeks: Int) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          rating {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            averageProductRating
          }
        }
      }
    }
  }
`;

export type PickedWeeklyProductRating = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
} & Pick<RatingPerformanceStats, "averageProductRating">;

export type WeeklyProductRatingResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly rating: PickedWeeklyProductRating;
      }>;
    };
  };
};

export type AugmentedWeeklyProductRating = {
  readonly date: Datetime["mmddyyyy"];
} & Pick<RatingPerformanceStats, "averageProductRating">;

export type WeeklyProductRatingArgs = MerchantStatsWeeklyArgs;

export const RATING_PERFORMANCE_STORE_RATING_BREAKDOWN_DATA_QUERY = gql`
  query Rating_PerformanceAggregateDataQuery($weeks: Int) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          rating {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            storeRatingsBreakdown {
              oneStarRatings
              twoStarRatings
              threeStarRatings
              fourStarRatings
              fiveStarRatings
            }
          }
        }
      }
    }
  }
`;

export type PickedStoreRatingBreakdown = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly storeRatingsBreakdown: Pick<
    RatingBreakdown,
    | "oneStarRatings"
    | "twoStarRatings"
    | "threeStarRatings"
    | "fourStarRatings"
    | "fiveStarRatings"
  >;
};

export type StoreRatingBreakdownResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly rating: PickedStoreRatingBreakdown;
      }>;
    };
  };
};

export type AugmentedStoreRatingBreakdown = {
  readonly date: Datetime["mmddyyyy"];
} & RatingBreakdown;

export type StoreRatingBreakdownArgs = MerchantStatsWeeklyArgs;

export const RATING_PERFORMANCE_PRODUCT_RATING_BREAKDOWN_DATA_QUERY = gql`
  query Rating_PerformanceAggregateDataQuery($weeks: Int) {
    currentMerchant {
      storeStats {
        weekly(weeks: $weeks) {
          rating {
            startDate {
              mmddyyyy
            }
            endDate {
              mmddyyyy
            }
            productRatingsBreakdown {
              oneStarRatings
              twoStarRatings
              threeStarRatings
              fourStarRatings
              fiveStarRatings
            }
          }
        }
      }
    }
  }
`;

export type PickedProductRatingBreakdown = {
  readonly startDate: Pick<Datetime, "mmddyyyy">;
  readonly endDate: Pick<Datetime, "mmddyyyy">;
  readonly productRatingsBreakdown: Pick<
    RatingBreakdown,
    | "oneStarRatings"
    | "twoStarRatings"
    | "threeStarRatings"
    | "fourStarRatings"
    | "fiveStarRatings"
  >;
};

export type ProductRatingBreakdownResponseData = {
  readonly currentMerchant: {
    readonly storeStats: {
      readonly weekly: ReadonlyArray<{
        readonly rating: PickedProductRatingBreakdown;
      }>;
    };
  };
};

export type AugmentedProductRatingBreakdown = {
  readonly date: Datetime["mmddyyyy"];
} & RatingBreakdown;

export type ProductRatingBreakdownArgs = MerchantStatsWeeklyArgs;

export const PRODUCT_RATING_LISTING_DATA_QUERY = gql`
  query Rating_ProductRatingListingDataQuery(
    $offset: Int
    $limit: Int
    $listingTab: ProductRatingListingTab
  ) {
    currentMerchant {
      storeStats {
        productRatingsCount
        productRatings(
          offset: $offset
          limit: $limit
          listingTab: $listingTab
        ) {
          productId
          average30dRating
          ratings
          sales
        }
      }
    }
  }
`;

type PickedProductRatingListing = Pick<
  ProductRating,
  "productId" | "average30dRating" | "ratings" | "sales"
>;

export type AugmentedProductRatingListing = PickedProductRatingListing & {
  open?: boolean;
  readonly productName?: string;
};

export type ProductRatingListingResponseData = {
  readonly currentMerchant: {
    readonly storeStats: Pick<MerchantStats, "productRatingsCount"> & {
      readonly productRatings: ReadonlyArray<PickedProductRatingListing>;
    };
  };
};

export type ProductRatingListingRequestArgs = {
  readonly listingTab: ProductRatingListingTab;
} & Pick<ProductCatalogSchemaProductsArgs, "offset" | "limit">;

export type ProductRatingListingTabData = ProductRatingListingTab;

export const STORE_RATING_LISTING_DATA_QUERY = gql`
  query Rating_StoreRatingListingDataQuery(
    $offset: Int
    $limit: Int
    $filterByStars: Int
  ) {
    currentMerchant {
      storeStats {
        storeRatingsCount(filterByStars: $filterByStars)
        storeRatings(
          offset: $offset
          limit: $limit
          filterByStars: $filterByStars
        ) {
          orderIds
          date
          rating
          comment
          refundReason
        }
      }
    }
  }
`;

export type PickedStoreRatingListing = Pick<
  StoreRating,
  "orderIds" | "date" | "rating" | "comment" | "refundReason"
>;

export type StoreRatingListingResponseData = {
  readonly currentMerchant: {
    readonly storeStats: Pick<MerchantStats, "storeRatingsCount"> & {
      readonly storeRatings: ReadonlyArray<PickedStoreRatingListing>;
    };
  };
};

export type StoreRatingListingRequestArgs = MerchantStatsStoreRatingsArgs;
