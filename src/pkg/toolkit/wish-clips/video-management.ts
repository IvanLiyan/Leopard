import gql from "graphql-tag";
import numeral from "numeral";
import {
  ProductVideoServiceSchemaVideosArgs,
  ProductVideo,
  RaccVideoAsset,
  ProductVideoServiceSchema,
  ProductVideoState,
  ProductCatalogMutationsRemoveVideoArgs,
  RemoveVideo,
  ProductVideoServiceSchemaPerformanceArgs,
  VideoPerformance,
  ProductVideoDailyStats,
  Datetime,
  ProductCatalogSchemaProductsArgs,
  ProductSchema,
  ProductCatalogSchema,
  UpsertVideo,
} from "@schema/types";

export const ACCEPTED_FORMATS = [
  ".mp4",
  ".mov",
  ".wmv",
  ".flv",
  ".avi",
  ".mkv",
  ".webm",
];
export const MAX_SIZE_MB = 50;

export type PickedProductSchema = Pick<
  ProductSchema,
  "id" | "totalInventory" | "name"
>;

type PickedProducts = Pick<ProductCatalogSchema, "productCount"> & {
  readonly products?: ReadonlyArray<PickedProductSchema> | null;
};

type PickedVideo = Pick<
  ProductVideo,
  | "title"
  | "id"
  | "likeCount"
  | "viewCount"
  | "averageWatchTime"
  | "productId"
  | "state"
  | "description"
  | "rejectionReason"
> & {
  readonly source: Pick<RaccVideoAsset, "url">;
  readonly preview?: Pick<RaccVideoAsset, "url"> | null;
  readonly lowQuality?: Pick<RaccVideoAsset, "url"> | null;
  readonly highQuality?: Pick<RaccVideoAsset, "url"> | null;
};

type PickedVideoService = {
  readonly videoService: Pick<ProductVideoServiceSchema, "videoCount"> & {
    readonly videos: ReadonlyArray<PickedVideo> | null;
  };
};

export type VideoCatalogRequestData = ProductVideoServiceSchemaVideosArgs;

export type VideoCatalogResponseData = {
  readonly productCatalog?: PickedVideoService | null;
};

export const VIDEO_CATALOG_QUERY = gql`
  query VideoCatalogTable_VideoCatalogQuery(
    $offset: Int
    $limit: Int
    $query: String
    $searchType: VideoSearchType
    $sort: VideoSort
  ) {
    productCatalog {
      videoService {
        videoCount(query: $query, searchType: $searchType)
        videos(
          limit: $limit
          offset: $offset
          query: $query
          searchType: $searchType
          sort: $sort
        ) {
          title
          id
          productId
          source {
            url
          }
          preview {
            url
          }
          lowQuality {
            url
          }
          highQuality {
            url
          }
          likeCount
          viewCount
          averageWatchTime
          state
          description
          rejectionReason
        }
      }
    }
  }
`;

export type ProductsRequestData = ProductCatalogSchemaProductsArgs;

export type ProductsResponseData = {
  readonly productCatalog?: PickedProducts | null;
};

export const PRODUCTS_QUERY = gql`
  query VideoCatalogEdit_ProductsQuery(
    $offset: Int
    $limit: Int
    $query: String
    $videoId: ObjectIdType
    $searchType: ProductSearchType
    $sort: ProductSort
  ) {
    productCatalog {
      products(
        limit: $limit
        offset: $offset
        searchType: $searchType
        videoId: $videoId
        query: $query
        sort: $sort
      ) {
        id
        name
        totalInventory
      }
      productCount(searchType: $searchType, query: $query)
    }
  }
`;

export type UpsertVideoResponseData = {
  readonly productCatalog: {
    readonly upsertVideo: Pick<UpsertVideo, "message" | "ok" | "videoId">;
  } | null;
};

export const UPSERT_VIDEO_MUTATION = gql`
  mutation VideoCatalogEdit_UpsertVideoMutation($input: VideoUpsertInput) {
    productCatalog {
      upsertVideo(input: $input) {
        ok
        message
        videoId
      }
    }
  }
`;

export type RemoveVideoRequestData = ProductCatalogMutationsRemoveVideoArgs;

export type RemoveVideoResponseData = {
  readonly productCatalog?: {
    readonly removeVideo: Pick<RemoveVideo, "ok" | "message">;
  };
};

export const REMOVE_VIDEO_MUTATION = gql`
  mutation VideoCatalogTable_RemoveVideoMutation($input: RemoveVideoInput!) {
    productCatalog {
      removeVideo(input: $input) {
        message
        ok
      }
    }
  }
`;

export const VIDEO_CATEGORIES = [
  "LIVE",
  "UNLISTED",
  "PENDING_REVIEW",
  "DECLINED",
] as const;
export type VideoCategoryType = typeof VIDEO_CATEGORIES[number];

export const VideoCategoryLabel: { [key in VideoCategoryType]: string } = {
  LIVE: i`Live`,
  UNLISTED: i`Unlisted`,
  PENDING_REVIEW: i`Pending review`,
  DECLINED: i`Declined`,
};

export const VideoCategoryStatusMapping: {
  [key in VideoCategoryType]: ReadonlyArray<ProductVideoState>;
} = {
  LIVE: ["APPROVED"],
  UNLISTED: [
    "UNKNOWN_STATE",
    "PENDING_TRANSCODE",
    "FAILED_TRANSCODE",
    "FAILED_OBJECT_DETECTION",
    "PENDING_REKOGNITION",
    "FAILED_REKOGNITION",
    "FAILED_AUTO_REVIEW",
  ],
  PENDING_REVIEW: ["PENDING_REVIEW", "PENDING_AUTO_REVIEW"],
  DECLINED: ["REJECTED"],
};

export type ProductsTableData = {
  readonly productName: string;
  readonly productId: string;
  readonly inventoryCount: number;
  readonly productData: PickedProductSchema;
};

export type VideoPerformanceMetricType = "VIEWS" | "LIKES" | "WATCH_TIME";

export const formatVideoPerformanceMetric = ({
  amount,
  metric,
}: {
  readonly amount: number;
  readonly metric: VideoPerformanceMetricType;
}): string => {
  const formatterMap: {
    readonly [T in VideoPerformanceMetricType]: (amt: number) => string;
  } = {
    // Names of strings in TS enum
    /* eslint-disable @typescript-eslint/naming-convention */
    VIEWS: (amt) => numeral(amt).format("0,0"),
    LIKES: (amt) => numeral(amt).format("0,0"),
    WATCH_TIME: (amt) => i`${numeral(amt).format("0,0.0")} hours`,
    /* eslint-enable @typescript-eslint/naming-convention */
  };
  return formatterMap[metric](amount);
};

export const OVERALL_VIDEO_PERFORMANCE_QUERY = gql`
  query VideoManagement_OverallVideoPerformanceQuery(
    $startDate: DatetimeInput!
    $endDate: DatetimeInput!
  ) {
    productCatalog {
      videoService {
        performance(startDate: $startDate, endDate: $endDate) {
          totalViewsPercentChange
          totalLikesPercentChange
          totalWatchTimePercentChange
          dailyStats {
            date {
              unix
            }
            views
            likes
            watchTime
          }
        }
      }
    }
  }
`;

export type PickedVideoPerformanceDailyStats = Pick<
  ProductVideoDailyStats,
  "likes" | "views" | "watchTime"
> & {
  readonly date: Pick<Datetime, "unix">;
};

export type OverallVideoPerformanceResponse = {
  readonly productCatalog?: {
    readonly videoService: {
      readonly performance?:
        | (Pick<
            VideoPerformance,
            | "totalLikesPercentChange"
            | "totalViewsPercentChange"
            | "totalWatchTimePercentChange"
          > & {
            readonly dailyStats: ReadonlyArray<PickedVideoPerformanceDailyStats>;
          })
        | null;
    };
  } | null;
};

export type OverallVideoPerformanceRequest =
  ProductVideoServiceSchemaPerformanceArgs;

export const VIDEO_COUNT_QUERY = gql`
  query VideoManagement_VideoCountQuery {
    productCatalog {
      videoService {
        videoCount
      }
    }
  }
`;

export type VideoCountResponse = {
  readonly productCatalog?: {
    readonly videoService: Pick<ProductVideoServiceSchema, "videoCount">;
  } | null;
};

export const BestPracticesPromotion =
  "https://canary.contestimg.wish.com/api/product-video/fetch/1646772003251_promotional.mp4";
export const BestPracticesInspirational =
  "https://canary.contestimg.wish.com/api/product-video/fetch/1646771728467_inspirational_video.mp4";
export const BestPracticesFunctional =
  "https://canary.contestimg.wish.com/api/product-video/fetch/1646772027575_functional.mp4";
export const ConsumerSideDemo =
  "https://canary.contestimg.wish.com/api/product-video/fetch/1646778896892_consumer_side_demo.mp4";
