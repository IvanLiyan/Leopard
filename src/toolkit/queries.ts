import { gql } from "@apollo/client";
import {
  Country,
  Datetime,
  StorefrontSchema,
  StorefrontFeedSchema,
  StorefrontServiceSchema,
  StoreReviewSummarySchema,
  StorefrontServiceSchemaForMerchantArgs,
} from "@toolkit/schema";

export const STOREFRONT_DATA_QUERY = gql`
  query Leopard_StorefrontPageInitialData($mid: ObjectIdType!) {
    storefront {
      serviceEnabled
      merchantEnabled(id: $mid)
      forMerchant(id: $mid) {
        name
        creationDate {
          formatted(fmt: "yyyy")
        }
        location {
          code
          name
        }
        reviewSummary {
          count
          averageRating
        }
        customization {
          feeds {
            id
            name
          }
        }
      }
    }
  }
`;

export type StorefrontDataParams = {
  readonly mid: StorefrontServiceSchemaForMerchantArgs["id"];
};

export type PickedCreationDate = Pick<Datetime, "formatted">;

export type PickedReviewSummary = Pick<
  StoreReviewSummarySchema,
  "count" | "averageRating"
>;

export type PickedLocation = Pick<Country, "code" | "name">;

export type PickedFeeds = Pick<StorefrontFeedSchema, "id" | "name">;

export type PickedCustomization = {
  readonly feeds: PickedFeeds[];
};

export type PickedForMerchant = Pick<StorefrontSchema, "name"> & {
  readonly creationDate: PickedCreationDate;
  readonly reviewSummary: PickedReviewSummary;
  readonly location: PickedLocation;
  readonly customization: PickedCustomization;
};

export type StorefrontDataResponse = {
  readonly storefront: Pick<
    StorefrontServiceSchema,
    "serviceEnabled" | "merchantEnabled"
  > & {
    readonly forMerchant: PickedForMerchant;
  };
};
