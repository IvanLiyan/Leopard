import {
  Country,
  CurrencyValue,
  Datetime,
  InventorySchema,
  MerchantSchema,
  MfpCampaignConstantsSchema,
  MfpCampaignPromotionType,
  MfpCampaignSchema,
  MfpDiscountCampaignConstantsSchema,
  MfpFlashSaleConstantsSchema,
  MfpProductSearchType,
  MfpServiceSchema,
  MfpServiceSchemaCampaignsArgs,
  MfpServiceSchemaEligibleProductsArgs,
  MfpServiceSchemaEligibleProductsCountArgs,
  MfpVariationDiscountData,
  ProductSchema,
  TrueTagSchema,
  VariationSchema,
} from "@schema/types";
import gql from "graphql-tag";
import moment from "moment/moment";
import { useMemo } from "react";
import Fuse from "fuse.js";
import { ci18n } from "@legacy/core/i18n";

export type CampaignToolInfo = {
  readonly name: string;
  readonly description: string;
};

export const CampaignToolInfoMap: {
  readonly [T in MfpCampaignPromotionType]: CampaignToolInfo;
} = {
  PRICE_DISCOUNT: {
    name: ci18n("Discount here is a merchant promotion type", "Discount"),
    description: i`Offer a percentage off products and variations for up to 14 days.`,
  },
  FLASH_SALE: {
    name: i`Flash Sale`,
    description: i`Offer a high percentage amount for 4-12 hours.`,
  },
  // This campaign type is not yet supported
  SPEND_MORE_AND_SAVE_MORE: {
    name: ``,
    description: ``,
  },
};

export const CampaignToolOrder: ReadonlyArray<
  ExcludeStrict<MfpCampaignPromotionType, "SPEND_MORE_AND_SAVE_MORE">
> = ["PRICE_DISCOUNT", "FLASH_SALE"];

export type MfpCreateCampaignInitialData = {
  readonly currentMerchant?:
    | (Pick<MerchantSchema, "id"> & {
        readonly shippingSettings?: ReadonlyArray<{
          readonly country: Pick<Country, "code" | "name">;
        }> | null;
      })
    | null;
  readonly platformConstants?: {
    readonly mfp?: {
      readonly campaign?: Pick<
        MfpCampaignConstantsSchema,
        | "maxAllowedQuantity"
        | "maxProductVariations"
        | "minCampaignDelayInHour"
        | "maxCampaignDelayInHour"
        | "maxCampaignDurationInDays"
      > | null;
      readonly discountCampaign?:
        | (Pick<
            MfpDiscountCampaignConstantsSchema,
            | "minimumPercentageRequired"
            | "minDiscountPercentage"
            | "maxDiscountPercentage"
          > & {
            readonly minStartTimeForLaunch: {
              readonly inTimezone: Pick<Datetime, "unix">;
            };
          })
        | null;
      readonly flashSaleCampaign?:
        | (Pick<
            MfpFlashSaleConstantsSchema,
            | "minimumPercentageRequired"
            | "minDiscountPercentage"
            | "maxDiscountPercentage"
          > & {
            readonly minStartTimeForLaunch: {
              readonly inTimezone: Pick<Datetime, "unix">;
            };
          })
        | null;
    } | null;
  } | null;
};

export type MfpUploadCampaignInitialData = {
  readonly currentMerchant?:
    | (Pick<MerchantSchema, "id"> & {
        readonly shippingSettings?: ReadonlyArray<{
          readonly country: Pick<Country, "code" | "name">;
        }> | null;
      })
    | null;
  readonly platformConstants?: {
    readonly mfp?: {
      readonly campaign?: Pick<
        MfpCampaignConstantsSchema,
        | "maxAllowedQuantity"
        | "minDiscountPercentage"
        | "maxDiscountPercentage"
        | "maxProductVariations"
        | "minCampaignDelayInHour"
        | "maxCampaignDelayInHour"
        | "maxCampaignDurationInDays"
      > | null;
      readonly discountCampaign?:
        | (Pick<
            MfpDiscountCampaignConstantsSchema,
            "minimumPercentageRequired"
          > & {
            readonly minStartTimeForLaunch: {
              readonly inTimezone: Pick<Datetime, "unix">;
            };
          })
        | null;
      readonly flashSaleCampaign?:
        | (Pick<MfpFlashSaleConstantsSchema, "minimumPercentageRequired"> & {
            readonly minStartTimeForLaunch: {
              readonly inTimezone: Pick<Datetime, "unix">;
            };
          })
        | null;
    } | null;
  } | null;
};

// Get Eligible Products Query
export const GET_ELIGIBLE_PRODUCTS_QUERY = gql`
  query MfpTools_GetEligibleProducts(
    $searchType: MFPProductSearchType
    $searchQuery: String
    $promotionType: MFPCampaignPromotionType!
    $offset: Int
    $limit: Int
  ) {
    mfp {
      eligibleProducts(
        searchType: $searchType
        searchQuery: $searchQuery
        promotionType: $promotionType
        offset: $offset
        limit: $limit
      ) {
        product {
          id
          name
          sales
          sku
          categories {
            name
          }
        }
        variations {
          id
          inventory {
            count
          }
          enabled
          color
          size
          price {
            amount
            currencyCode
            display
          }
        }
      }
    }
  }
`;

export type EligibleVariation = Pick<
  VariationSchema,
  "id" | "color" | "size" | "enabled"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
};

export type EligibleProduct = Pick<
  ProductSchema,
  "id" | "sales" | "name" | "sku"
> & {
  readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">>;
};

export type EligibleProductInfo = {
  readonly product: EligibleProduct;
  readonly variations: ReadonlyArray<EligibleVariation>;
};

export type GetEligibleProductsResponse = {
  readonly mfp?: {
    readonly eligibleProducts?: ReadonlyArray<EligibleProductInfo> | null;
  } | null;
};
export type GetEligibleProductsRequest = MfpServiceSchemaEligibleProductsArgs;

// Get campaigns count query
export const GET_ELIGIBLE_PRODUCTS_COUNT_QUERY = gql`
  query MfpTools_GetEligibleProductsCount(
    $searchType: MFPProductSearchType
    $searchQuery: String
    $promotionType: MFPCampaignPromotionType!
  ) {
    mfp {
      eligibleProductsCount(
        searchType: $searchType
        searchQuery: $searchQuery
        promotionType: $promotionType
      )
    }
  }
`;

export type GetEligibleProductsCountResponse = {
  readonly mfp?: Pick<MfpServiceSchema, "eligibleProductsCount"> | null;
};

export type GetEligibleProductsCountRequest =
  MfpServiceSchemaEligibleProductsCountArgs;

export const variationInventory = (variation: EligibleVariation): number => {
  return variation.inventory.reduce((acc, { count }) => acc + count, 0);
};

// Get prefill campaign information query
export const GET_PREFILL_CAMPAIGN_QUERY = gql`
  query MfpTools_GetPrefillCampaignQuery($id: String) {
    mfp {
      campaigns(
        searchType: CAMPAIGN_ID
        searchQuery: $id
        offset: 0
        limit: 1
      ) {
        name
        id
        state
        startTime {
          unix
        }
        endTime {
          unix
        }
        countries {
          code
        }
        promotionType
        unqualifiedProductVariations {
          variation {
            id
            productId
          }
        }
        flashSaleDetails {
          maxQuantity
          discountPercentage
          product {
            id
            name
            sales
            sku
            categories {
              name
            }
            variations {
              id
              color
              size
              productId
              price {
                amount
                currencyCode
                display
              }
              inventory {
                count
              }
            }
          }
          variation {
            id
            color
            size
            productId
            enabled
            price {
              amount
              currencyCode
              display
            }
            inventory {
              count
            }
          }
        }
        discountDetails {
          maxQuantity
          discountPercentage
          product {
            id
            name
            sales
            sku
            categories {
              name
            }
            variations {
              id
              color
              size
              productId
              price {
                amount
                currencyCode
                display
              }
              inventory {
                count
              }
            }
          }
          variation {
            id
            color
            size
            productId
            enabled
            price {
              amount
              currencyCode
              display
            }
            inventory {
              count
            }
          }
        }
      }
    }
  }
`;

export type PickedCampaignPrefill = Pick<
  MfpCampaignSchema,
  "name" | "id" | "state" | "promotionType"
> & {
  readonly startTime: Pick<Datetime, "unix">;
  readonly endTime: Pick<Datetime, "unix">;
  readonly countries?: ReadonlyArray<Pick<Country, "code">> | null;
  readonly unqualifiedProductVariations?: ReadonlyArray<{
    readonly variation: Pick<VariationSchema, "productId" | "id">;
  }> | null;
  readonly flashSaleDetails?: ReadonlyArray<
    Pick<MfpVariationDiscountData, "discountPercentage" | "maxQuantity"> & {
      readonly product: Pick<ProductSchema, "id" | "sales" | "name" | "sku"> & {
        readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">>;
        readonly variations: ReadonlyArray<
          Pick<VariationSchema, "id" | "color" | "size" | "productId"> & {
            readonly price: Pick<
              CurrencyValue,
              "amount" | "currencyCode" | "display"
            >;
            readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
          }
        >;
      };
      readonly variation: Pick<
        VariationSchema,
        "id" | "color" | "size" | "productId" | "enabled"
      > & {
        readonly price: Pick<
          CurrencyValue,
          "amount" | "currencyCode" | "display"
        >;
        readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
      };
    }
  > | null;
  readonly discountDetails?: ReadonlyArray<
    Pick<MfpVariationDiscountData, "discountPercentage" | "maxQuantity"> & {
      readonly product: Pick<ProductSchema, "id" | "sales" | "name" | "sku"> & {
        readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">>;
        readonly variations: ReadonlyArray<
          Pick<VariationSchema, "id" | "color" | "size" | "productId"> & {
            readonly price: Pick<
              CurrencyValue,
              "amount" | "currencyCode" | "display"
            >;
            readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
          }
        >;
      };
      readonly variation: Pick<
        VariationSchema,
        "id" | "color" | "size" | "productId" | "enabled"
      > & {
        readonly price: Pick<
          CurrencyValue,
          "amount" | "currencyCode" | "display"
        >;
        readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
      };
    }
  > | null;
};

export type GetPrefillCampaignResponse = {
  readonly mfp?: {
    readonly campaigns?: ReadonlyArray<PickedCampaignPrefill> | null;
  } | null;
};
export type GetPrefillCampaignRequest = {
  readonly id: MfpServiceSchemaCampaignsArgs["searchQuery"];
};

// Length in days that flash sale window must be (Wish chooses specific time within this period)
export const FLASH_SALE_WINDOW_LENGTH = 7;
// Maximum characters that can be included in a camapign name
export const MAX_CAMPAIGN_NAME_LENGTH = 300;

export const campaignNameError = ({
  name,
}: {
  readonly name: string | undefined;
}): string | undefined => {
  if (name == null || name.trim().length == 0) {
    return i`Please enter a promotion name`;
  }

  if (name.length > MAX_CAMPAIGN_NAME_LENGTH) {
    return i`Promotion name must be less than ${MAX_CAMPAIGN_NAME_LENGTH} characters`;
  }
};

export const discountStartTimeError = ({
  startDate,
  startHour,
  minCampaignDelayInHour,
  maxCampaignDelayInHour,
}: {
  readonly startDate: Date | undefined;
  readonly startHour: number | undefined;
  readonly minCampaignDelayInHour: number | null;
  readonly maxCampaignDelayInHour: number | null;
}): string | undefined => {
  if (startDate == null || startHour == null) {
    return i`Promotion must have a start date and time`;
  }

  const startTime = new Date(startDate);
  startTime.setHours(startHour);
  const isStartDateAfterMin =
    minCampaignDelayInHour == null ||
    moment(startTime).diff(moment(), "hours") >= minCampaignDelayInHour;

  if (!isStartDateAfterMin) {
    return i`Promotion must be scheduled at least ${minCampaignDelayInHour} hours in advance`;
  }

  const isStartDateBeforeMax =
    maxCampaignDelayInHour == null ||
    moment(startTime).diff(moment(), "hours") <= maxCampaignDelayInHour;

  if (!isStartDateBeforeMax) {
    return i`Promotion must be scheduled less than ${maxCampaignDelayInHour} hours in advance`;
  }
};

export const discountEndTimeError = ({
  startDate,
  startHour,
  endDate,
  endHour,
  maxCampaignDurationInDays,
}: {
  readonly startDate: Date | undefined;
  readonly startHour: number | undefined;
  readonly endDate: Date | undefined;
  readonly endHour: number | undefined;
  readonly maxCampaignDurationInDays: number | null;
}): string | undefined => {
  if (startDate == null || startHour == null) {
    return;
  }

  if (endDate == null || endHour == null) {
    return i`Promotion must have an end date and time`;
  }

  const startTime = new Date(startDate);
  startTime.setHours(startHour);

  const endTime = new Date(endDate);
  endTime.setHours(endHour);
  const isEndTimeAfterStart = moment(endTime).isAfter(startTime);

  if (!isEndTimeAfterStart) {
    return i`End date must be after start date`;
  }

  const isCampaignTooLong =
    maxCampaignDurationInDays != null &&
    moment(endTime).diff(startTime, "hours") > maxCampaignDurationInDays * 24;

  if (isCampaignTooLong) {
    return i`Promotion must be at most ${maxCampaignDurationInDays} days long`;
  }
};

type PickedProductForSearch = Pick<ProductSchema, "id" | "sku" | "name">;
export const useProductSearch = ({
  products,
  searchType,
}: {
  readonly products: ReadonlyArray<PickedProductForSearch>;
  readonly searchType: MfpProductSearchType;
}) => {
  // Array mutability required type for Fuse
  return useMemo(() => {
    const keysMap: {
      readonly [T in MfpProductSearchType]: Array<keyof PickedProductForSearch>;
    } = {
      ID: ["id"],
      SKU: ["sku"],
      NAME: ["name"],
    };
    const keys: Array<string> = keysMap[searchType];
    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys,
    };
    const index = Fuse.createIndex(keys, products);

    return new Fuse(products, options, index);
  }, [products, searchType]);
};
