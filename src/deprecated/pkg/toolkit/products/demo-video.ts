import gql from "graphql-tag";
import {
  Datetime,
  UpsertProduct,
  ProductSchema,
  RaccVideoAsset,
  ProductCatalogSchema,
  ProductVideoState,
  ProductSearchType,
  ProductVideo,
} from "@schema/types";

import {
  Validator,
  UrlValidator,
  ValidationResponse,
} from "@toolkit/validators";
import { Theme, Option } from "@ContextLogic/lego";

export const MAX_VIDEO_LENGTH = 30;
export const ACCEPTED_FORMATS = [
  "mp4",
  "mov",
  "wmv",
  "flv",
  "avi",
  "mkv",
  "webm",
];
export const MAX_SIZE_MB = 50;

export type PickedProductType = Pick<ProductSchema, "id" | "name"> & {
  readonly demoVideo?: Pick<
    ProductVideo,
    "state" | "rejectionReason" | "viewCount"
  > & {
    readonly uploadTime: Pick<Datetime, "mmddyyyy">;
    readonly source: Pick<RaccVideoAsset, "url">;
  };
};

export type AddDemoResponseType = {
  readonly productCatalog: Pick<ProductCatalogSchema, "productCount"> & {
    readonly products: ReadonlyArray<PickedProductType>;
  };
};

export type DeleteDemoResponseType = {
  readonly productCatalog: {
    readonly upsertProduct: Pick<UpsertProduct, "ok" | "message">;
  };
};

export type PickedUpsertProductResponseType = Pick<
  UpsertProduct,
  "ok" | "message"
>;

export const DELETE_DEMO_VIDEO = gql`
  mutation AddProductDemoTable_DeleteDemoVideo($input: ProductUpsertInput!) {
    productCatalog {
      upsertProduct(input: $input) {
        ok
        message
      }
    }
  }
`;

export const ADD_DEMO_VIDEO_TO_PRODUCT = gql`
  mutation UploadVideo_AddDemoVideoToProduct($input: ProductUpsertInput!) {
    productCatalog {
      upsertProduct(input: $input) {
        ok
        message
      }
    }
  }
`;

export class VideoAssetURLValidator extends Validator {
  getRequirements(): ReadonlyArray<Validator> {
    return [new UrlValidator()];
  }

  async validateText(videoUrl: string): Promise<ValidationResponse> {
    const errorMessage =
      i`Please provide the download URL of your video. ` +
      i`Hosted links, such as Youtube, are not accepted.`;
    if (videoUrl.trim().length == 0) {
      return null;
    }

    if (
      videoUrl.includes("drive.google.com") &&
      !videoUrl.includes("export=download")
    ) {
      return errorMessage;
    }

    const isInvalid = [
      "etsy",
      "youtube",
      "vimeo",
      "amazon.com",
      "ebay",
      "youtu.be",
      "drive.google.com",
    ].some((invalidDomain) => videoUrl.includes(invalidDomain));
    if (isInvalid) {
      return errorMessage;
    }
    return null;
  }
}

export const DemoVideoReviewStatusMap: {
  [status in ProductVideoState]: {
    displayName: string;
    theme: Theme;
  };
} = {
  APPROVED: {
    displayName: i`Active`,
    theme: `Cyan`,
  },
  PENDING_AUTO_REVIEW: {
    displayName: i`Pending review`,
    theme: "LightGrey",
  },
  FAILED_AUTO_REVIEW: {
    displayName: i`Pending review`,
    theme: "LightGrey",
  },
  PENDING_REVIEW: {
    displayName: i`Active`,
    theme: `Cyan`,
  },
  UNKNOWN_STATE: {
    displayName: i`Pending review`,
    theme: "LightGrey",
  },
  PENDING_TRANSCODE: {
    displayName: i`Processing`,
    theme: "LightGrey",
  },
  FAILED_TRANSCODE: {
    displayName: i`Processing`,
    theme: "LightGrey",
  },
  REJECTED: {
    displayName: i`Rejected`,
    theme: `Red`,
  },
  FAILED_OBJECT_DETECTION: {
    displayName: i`Rejected`,
    theme: `Red`,
  },
  PENDING_REKOGNITION: {
    displayName: i`Processing`,
    theme: `LightGrey`,
  },
  FAILED_REKOGNITION: {
    displayName: i`Processing`,
    theme: `LightGrey`,
  },
};

export const BlurryVideoUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/5ff50c9264348010ca17b9a0-603a0e92d05ef351d077806c-1614417557-1920_3200.mp4";

export const NonEnglishTextUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/603bb6b017995a962ae1f654-603bb6c02a314bd32e37575d-1614526146-1920_3200.mp4";

export const ImageSlideshowUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/5f3b998601b5b20047c54ea0-6035c8df7f5267cea8c3d7fd-1614172814-1920_3200.mp4";

export const IncorrectRotationUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/5f7b2a0b6ca00a003dd1b663-5fd4ddb7d29db3efdc337a66-1614099081-1920_3200.mp4";
export const ScreenRecordingUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/5f6f19925deadf171e1a527b-5fb01ffd02562062217ce8f4-1614120904-1920_3200.mp4";
export const ReferredCustomerOffPlatformUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/6037d2e4d1323b82feee1957-603bf0be5f2a58c3832c96ef-1614540991-1920_3200.mp4";
export const FactoryVideoUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/5f944b790a054a2adffcc779-5fa25d2bd96d4b783c119abb-1614031491-1920_3200.mp4";
export const HasPersonTalkingUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/5f1421e28af90c05436592ea-5fc25c3a760f05eb0c9dc3fc-1614118978-1920_3200.mp4";
export const PoorLightingUrl =
  "https://canary.contestimg.wish.com/api/product-video/fetch/603f52eb6dd7c927b3b7e7cc-603f52f2028d427cf394b93b-1614762740-1920_3200.mp4";
export const GET_DEMO_PRODUCTS_LIST = gql`
  query GetDemoProductsList(
    $offset: Int!
    $limit: Int!
    $sort: ProductSort
    $query: String
    $searchType: ProductSearchType
    $productStatuses: [CommerceProductStatus!]
    $videoStates: [ProductVideoState!]
  ) {
    productCatalog {
      productCount(
        query: $query
        searchType: $searchType
        productStatuses: $productStatuses
        videoStates: $videoStates
      )
      products(
        offset: $offset
        limit: $limit
        sort: $sort
        query: $query
        searchType: $searchType
        productStatuses: $productStatuses
        videoStates: $videoStates
      ) {
        id
        name
        demoVideo {
          state
          rejectionReason
          uploadTime {
            mmddyyyy
          }
          source {
            url
          }
          viewCount
        }
      }
    }
  }
`;

export const InputHeight = 35;
export const PageLimitOptions = [10, 50, 100];

export const SearchOptions: ReadonlyArray<Option<ProductSearchType>> = [
  {
    value: "NAME",
    text: i`Product name`,
  },
  {
    value: "ID",
    text: i`Product ID`,
  },
  {
    value: "SKU",
    text: i`Product SKU`,
  },
];

export const Placeholders: { [searchType in ProductSearchType]: string } = {
  ID: i`Enter a product id`,
  SKU: i`Enter a product sku`,
  NAME: i`Enter a product name`,
};
