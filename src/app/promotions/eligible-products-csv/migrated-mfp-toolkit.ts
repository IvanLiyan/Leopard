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
  MfpServiceSchemaActiveWhitelistProductsArgs,
  CountryCode,
  CampaignEventInfo,
  MfpServiceSchemaCampaignEventsArgs,
  TaxonomyCategorySchema,
  PaymentCurrencyCode,
} from "@schema";
import { gql } from "@apollo/client";
import moment from "moment/moment";
import { useMemo } from "react";
import Fuse from "fuse.js";
import { ci18n } from "@core/toolkit/i18n";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";

// EVENT is the same as PRICE_DISCOUNT on the BE so there is no BE enum for it,
// to use it as an enum on the FE, we are defining it manually
export type CampaignType = MfpCampaignPromotionType | "EVENT";

export type MfpProductTableData = EligibleProductInfo & {
  readonly startTime?: Pick<Datetime, "formatted" | "unix"> | null;
  readonly endTime?: Pick<Datetime, "formatted" | "unix"> | null;
};

export type CampaignToolInfo = {
  readonly name: string;
  readonly description: string;
  readonly createCampaignTitle: string;
};

export type EventTableData = {
  readonly eventId: string;
  readonly eventName: string;
  readonly eventDescription?: string | null;
  readonly eventType: MfpCampaignPromotionType;
  readonly duration: number;
  readonly startDate: Pick<Datetime, "formatted" | "unix">;
  readonly endDate: Pick<Datetime, "formatted" | "unix">;
  readonly deadline: Pick<Datetime, "formatted" | "unix">;
  readonly countries: ReadonlyArray<CountryCode>;
  readonly categories: ReadonlyArray<PickedEventCategory>;
  readonly discountPercentage: number;
};

export const CampaignToolInfoMap: {
  readonly [T in CampaignType]: CampaignToolInfo;
} = {
  PRICE_DISCOUNT: {
    name: ci18n("Discount here is a merchant promotion type", "Discount"),
    description: i`Offer a percentage off products and variations for 7 to 14 days.`,
    createCampaignTitle: i`Create a Discount Promotion`,
  },
  FLASH_SALE: {
    name: i`Flash Sale`,
    description: i`Offer a high percentage off products & their variants for 12 hours.`,
    createCampaignTitle: i`Create a Flash Sale Promotion`,
  },
  EVENT: {
    name: ci18n("Event here is a merchant promotion type", "Event"),
    description: i`Offer a percentage off products & their variants for a promoted Wish event.`,
    createCampaignTitle: i`Create an Event Promotion`,
  },
  // This campaign type is not yet supported
  SPEND_MORE_AND_SAVE_MORE: {
    name: ``,
    description: ``,
    createCampaignTitle: ``,
  },
};

export const CampaignToolOrder: ReadonlyArray<
  ExcludeStrict<MfpCampaignPromotionType, "SPEND_MORE_AND_SAVE_MORE">
> = ["PRICE_DISCOUNT", "FLASH_SALE"];

export const CampaignToolOrderWithEvent: ReadonlyArray<
  ExcludeStrict<CampaignType, "SPEND_MORE_AND_SAVE_MORE">
> = ["PRICE_DISCOUNT", "FLASH_SALE", "EVENT"];

type PickedMerchantSchema = Pick<
  MerchantSchema,
  | "id"
  | "allowMfp"
  | "showMfp"
  | "allowMfpEligibleProducts"
  | "hasMfpWhitelistProducts"
  | "primaryCurrency"
> & {
  readonly shippingSettings?: ReadonlyArray<{
    readonly country: Pick<Country, "code" | "name">;
  }> | null;
};

export type MfpCreateCampaignInitialData = {
  readonly currentMerchant?: PickedMerchantSchema | null;
  readonly platformConstants?: {
    readonly deciderKey: {
      readonly useGenericProducts: boolean;
    };
    readonly mfp?: {
      readonly campaign?: Pick<
        MfpCampaignConstantsSchema,
        | "maxAllowedQuantity"
        | "maxProductVariations"
        | "minCampaignDelayInHour"
        | "maxCampaignDelayInHour"
        | "maxCampaignDurationInDays"
        | "pricingGamingIgnoreThreshold"
        | "pricingGamingCancelThreshold"
      > | null;
      readonly discountCampaign?:
        | (Pick<
            MfpDiscountCampaignConstantsSchema,
            | "minimumPercentageRequired"
            | "minDiscountPercentage"
            | "maxDiscountPercentage"
            | "maxDiscountDifference"
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
            | "maxDiscountDifference"
            | "minDealQuantityPercentage"
          > & {
            readonly minStartTimeForLaunch: {
              readonly inTimezone: Pick<Datetime, "unix">;
            };
          })
        | null;
    } | null;
  } | null;
};

// Get Eligible Products Query
export const GET_ELIGIBLE_PRODUCTS_GENERIC_QUERY = gql`
  query MfpTools_GetEligibleProducts(
    $searchType: MFPProductSearchType
    $searchQuery: String
    $promotionType: MFPCampaignPromotionType!
    $offset: Int
    $limit: Int
    $eventId: ObjectIdType
    $merchantCurrency: PaymentCurrencyCode!
  ) {
    mfp {
      eligibleProducts: genericEligibleProducts(
        searchType: $searchType
        searchQuery: $searchQuery
        promotionType: $promotionType
        offset: $offset
        limit: $limit
        eventId: $eventId
        currency: $merchantCurrency
      )
    }
  }
`;

export const GET_ELIGIBLE_PRODUCTS_QUERY = gql`
  query MfpTools_GetEligibleProducts(
    $searchType: MFPProductSearchType
    $searchQuery: String
    $promotionType: MFPCampaignPromotionType!
    $offset: Int
    $limit: Int
    $eventId: ObjectIdType
    $merchantCurrency: PaymentCurrencyCode!
  ) {
    mfp {
      eligibleProducts(
        searchType: $searchType
        searchQuery: $searchQuery
        promotionType: $promotionType
        offset: $offset
        limit: $limit
        eventId: $eventId
      ) {
        product {
          id
          name
          sales
          sku
          flatRateShippingCountryCandidates {
            country {
              code
            }
            price {
              convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                amount
              }
            }
          }
          shipping {
            defaultShipping {
              price {
                convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                  amount
                }
              }
            }
            warehouseCountryShipping {
              countryShipping {
                price {
                  convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                    amount
                  }
                }
                country {
                  code
                }
              }
            }
          }
          categories {
            id
            name
          }
          l1Category {
            id
            name
          }
        }
        variations {
          id
          inventory {
            count
          }
          color
          size
          price {
            amount
            currencyCode
            display
            convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
              amount
            }
          }
        }
      }
    }
  }
`;

export type EligibleVariation = Pick<
  VariationSchema,
  "id" | "color" | "size"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode" | "display"> & {
    readonly convertedTo: Pick<CurrencyValue, "amount">;
  };
  readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
};

type PickedTaxonomyCategorySchema = Pick<TaxonomyCategorySchema, "id" | "name">;

export type EligibleProduct = Pick<
  ProductSchema,
  "id" | "sales" | "name" | "sku"
> & {
  readonly flatRateShippingCountryCandidates: ReadonlyArray<{
    readonly country: Pick<Country, "code">;
    readonly price: {
      readonly convertedTo: Pick<CurrencyValue, "amount">;
    };
  }>;
  readonly shipping: {
    readonly defaultShipping?: ReadonlyArray<{
      readonly price: {
        readonly convertedTo: Pick<CurrencyValue, "amount">;
      };
    }> | null;
    readonly warehouseCountryShipping?: ReadonlyArray<{
      readonly countryShipping?: ReadonlyArray<{
        readonly price?: {
          readonly convertedTo: Pick<CurrencyValue, "amount">;
        } | null;
        readonly country: Pick<Country, "code">;
      }> | null;
    }> | null;
  };
  readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name" | "id">>;
  readonly l1Category?: PickedTaxonomyCategorySchema | null;
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
export type GetEligibleProductsRequest =
  MfpServiceSchemaEligibleProductsArgs & {
    readonly merchantCurrency: PaymentCurrencyCode;
  };

// Get campaigns count query
export const GET_ELIGIBLE_PRODUCTS_COUNT_QUERY = gql`
  query MfpTools_GetEligibleProductsCount(
    $searchType: MFPProductSearchType
    $searchQuery: String
    $promotionType: MFPCampaignPromotionType!
    $eventId: ObjectIdType
  ) {
    mfp {
      eligibleProductsCount(
        searchType: $searchType
        searchQuery: $searchQuery
        promotionType: $promotionType
        eventId: $eventId
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

// Get whitelisted products query
export const GET_WHITELIST_PRODUCTS_QUERY = gql`
  query GetWhitelistProducts_ProductWhitelistingSection(
    $productIds: [ObjectIdType!]
    $offset: Int
    $limit: Int
    $merchantCurrency: PaymentCurrencyCode!
  ) {
    mfp {
      activeWhitelistProducts(
        productIds: $productIds
        offset: $offset
        limit: $limit
      ) {
        product {
          id
          name
          sales
          sku
          flatRateShippingCountryCandidates {
            country {
              code
            }
            price {
              convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                amount
              }
            }
          }
          shipping {
            defaultShipping {
              price {
                convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                  amount
                }
              }
            }
            warehouseCountryShipping {
              countryShipping {
                price {
                  convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                    amount
                  }
                }
                country {
                  code
                }
              }
            }
          }
          categories {
            id
            name
          }
          l1Category {
            id
            name
          }
        }
        variations {
          id
          inventory {
            count
          }
          color
          size
          price {
            amount
            currencyCode
            display
            convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
              amount
            }
          }
        }
        startTime {
          formatted(fmt: "YYYY-MM-dd h:mm a z")
          unix
        }
        endTime {
          formatted(fmt: "YYYY-MM-dd h:mm a z")
          unix
        }
      }
      activeWhitelistProductsCount(productIds: $productIds)
    }
  }
`;

type PickedWhitelistProductInfo = {
  readonly product: EligibleProduct;
  readonly variations: ReadonlyArray<EligibleVariation>;
  readonly startTime: Pick<Datetime, "formatted" | "unix">;
  readonly endTime: Pick<Datetime, "formatted" | "unix">;
};

export type GetWhitelistProductsRequestData =
  MfpServiceSchemaActiveWhitelistProductsArgs & {
    readonly merchantCurrency: PaymentCurrencyCode;
  };

export type GetWhitelistProductsResponseData = {
  readonly mfp: {
    readonly activeWhitelistProducts: ReadonlyArray<PickedWhitelistProductInfo>;
  } & Pick<MfpServiceSchema, "activeWhitelistProductsCount">;
};

// Get prefill campaign information query
export const GET_PREFILL_CAMPAIGN_QUERY = gql`
  query MfpTools_GetPrefillCampaignQuery(
    $id: String
    $merchantCurrency: PaymentCurrencyCode!
  ) {
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
              id
              name
            }
            flatRateShippingCountryCandidates {
              country {
                code
              }
              price {
                convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                  amount
                }
              }
            }
            shipping {
              defaultShipping {
                price {
                  convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                    amount
                  }
                }
              }
              warehouseCountryShipping {
                countryShipping {
                  price {
                    convertedTo(
                      currency: $merchantCurrency
                      rate: WISH_LATEST
                    ) {
                      amount
                    }
                  }
                  country {
                    code
                  }
                }
              }
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
                convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                  amount
                }
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
            price {
              amount
              currencyCode
              display
              convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                amount
              }
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
            flatRateShippingCountryCandidates {
              country {
                code
              }
              price {
                convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                  amount
                }
              }
            }
            shipping {
              defaultShipping {
                price {
                  convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                    amount
                  }
                }
              }
              warehouseCountryShipping {
                countryShipping {
                  price {
                    convertedTo(
                      currency: $merchantCurrency
                      rate: WISH_LATEST
                    ) {
                      amount
                    }
                  }
                  country {
                    code
                  }
                }
              }
            }
            categories {
              id
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
                convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                  amount
                }
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
            price {
              amount
              currencyCode
              display
              convertedTo(currency: $merchantCurrency, rate: WISH_LATEST) {
                amount
              }
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
        readonly flatRateShippingCountryCandidates: ReadonlyArray<{
          readonly country: Pick<Country, "code">;
          readonly price: {
            readonly convertedTo: Pick<CurrencyValue, "amount">;
          };
        }>;
        readonly shipping: {
          readonly defaultShipping?: ReadonlyArray<{
            readonly price: {
              readonly convertedTo: Pick<CurrencyValue, "amount">;
            };
          }> | null;
          readonly warehouseCountryShipping?: ReadonlyArray<{
            readonly countryShipping?: ReadonlyArray<{
              readonly price?: {
                readonly convertedTo: Pick<CurrencyValue, "amount">;
              } | null;
              readonly country: Pick<Country, "code">;
            }> | null;
          }> | null;
        };
        readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name" | "id">>;
        readonly variations: ReadonlyArray<
          Pick<VariationSchema, "id" | "color" | "size" | "productId"> & {
            readonly price: Pick<
              CurrencyValue,
              "amount" | "currencyCode" | "display"
            > & {
              readonly convertedTo: Pick<CurrencyValue, "amount">;
            };
            readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
          }
        >;
      };
      readonly variation: Pick<
        VariationSchema,
        "id" | "color" | "size" | "productId"
      > & {
        readonly price: Pick<
          CurrencyValue,
          "amount" | "currencyCode" | "display"
        > & {
          readonly convertedTo: Pick<CurrencyValue, "amount">;
        };
        readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
      };
    }
  > | null;
  readonly discountDetails?: ReadonlyArray<
    Pick<MfpVariationDiscountData, "discountPercentage" | "maxQuantity"> & {
      readonly product: Pick<ProductSchema, "id" | "sales" | "name" | "sku"> & {
        readonly flatRateShippingCountryCandidates: ReadonlyArray<{
          readonly country: Pick<Country, "code">;
          readonly price: {
            readonly convertedTo: Pick<CurrencyValue, "amount">;
          };
        }>;
        readonly shipping: {
          readonly defaultShipping?: ReadonlyArray<{
            readonly price: {
              readonly convertedTo: Pick<CurrencyValue, "amount">;
            };
          }> | null;
          readonly warehouseCountryShipping?: ReadonlyArray<{
            readonly countryShipping?: ReadonlyArray<{
              readonly price?: {
                readonly convertedTo: Pick<CurrencyValue, "amount">;
              } | null;
              readonly country: Pick<Country, "code">;
            }> | null;
          }> | null;
        };
        readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name" | "id">>;
        readonly variations: ReadonlyArray<
          Pick<VariationSchema, "id" | "color" | "size" | "productId"> & {
            readonly price: Pick<
              CurrencyValue,
              "amount" | "currencyCode" | "display"
            > & {
              readonly convertedTo: Pick<CurrencyValue, "amount">;
            };
            readonly inventory: ReadonlyArray<Pick<InventorySchema, "count">>;
          }
        >;
      };
      readonly variation: Pick<
        VariationSchema,
        "id" | "color" | "size" | "productId"
      > & {
        readonly price: Pick<
          CurrencyValue,
          "amount" | "currencyCode" | "display"
        > & {
          readonly convertedTo: Pick<CurrencyValue, "amount">;
        };
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
  readonly merchantCurrency: PaymentCurrencyCode;
};

export const GET_CAMPAIGN_EVENTS_QUERY = gql`
  query MfpTools_GetCampaignEvents(
    $offset: Int
    $limit: Int
    $sort: CampaignEventSort
    $startAtMin: DatetimeInput
    $submitAtMin: DatetimeInput
    $promotionTypes: [MFPCampaignPromotionType!]
  ) {
    mfp {
      campaignEvents(
        offset: $offset
        limit: $limit
        sort: $sort
        startAtMin: $startAtMin
        submitAtMin: $submitAtMin
        promotionTypes: $promotionTypes
      ) {
        id
        name
        description
        minDiscountPercentage
        promotionType
        startTime {
          formatted(fmt: "MMM d")
          unix
        }
        endTime {
          formatted(fmt: "MMM d")
          unix
        }
        submissionDeadline {
          formatted(fmt: "MMM d, YYYY")
          unix
        }
        productCategoryRestrictions {
          id
          name
        }
        countries {
          code
        }
      }
      campaignEventsCount(
        startAtMin: $startAtMin
        submitAtMin: $submitAtMin
        promotionTypes: $promotionTypes
      )
    }
  }
`;

export type GetCampaignEventsRequest = MfpServiceSchemaCampaignEventsArgs;

export type GetCampaignEventsResponse = {
  readonly mfp?: Pick<MfpServiceSchema, "campaignEventsCount"> & {
    readonly campaignEvents: ReadonlyArray<PickedCampaignEventInfo>;
  };
};

export type PickedEventCategory = Pick<TaxonomyCategorySchema, "name" | "id">;

type PickedCampaignEventInfo = Pick<
  CampaignEventInfo,
  "name" | "description" | "minDiscountPercentage" | "id" | "promotionType"
> & {
  readonly startTime: Pick<Datetime, "formatted" | "unix">;
  readonly endTime: Pick<Datetime, "formatted" | "unix">;
  readonly submissionDeadline: Pick<Datetime, "formatted" | "unix">;
  readonly productCategoryRestrictions: ReadonlyArray<PickedEventCategory>;
  readonly countries: ReadonlyArray<Pick<Country, "code">>;
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
    return i`Promotion must be at most ${maxCampaignDurationInDays} calendar days long`;
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

export type SelectedVariationInfo = {
  readonly quantity: number | null | undefined;
  readonly discount: number | null | undefined;
  readonly variation: EligibleVariation;
};

export type SelectedProductInfo = {
  readonly product: EligibleProduct;
  readonly variations: ReadonlyArray<EligibleVariation>;
  readonly selectedVariationInfo: ReadonlyMap<
    string, // variation ID
    SelectedVariationInfo
  >;
};

export type CampaignGamingPrediction = "NONE" | "FLAGGED" | "CANCELLED";

export const getCampaignGamingPrediction = ({
  products,
  maxDifference,
  maxFlaggedBeforeProductsRemoved,
  maxFlaggedBeforeCancelled,
}: {
  readonly products: ReadonlyArray<SelectedProductInfo>;
  readonly maxDifference: number;
  readonly maxFlaggedBeforeProductsRemoved: number;
  readonly maxFlaggedBeforeCancelled: number;
}): CampaignGamingPrediction => {
  const flaggedProductCount = products.reduce((acc, product) => {
    const { selectedVariationInfo } = product;

    const variations = Array.from(selectedVariationInfo.values());

    if (variations.length == 0 || variations.length == 1) {
      return acc;
    }

    const maxDiscountVariation = maxBy(variations, ({ discount }) => discount);
    const minDiscountVariation = minBy(variations, ({ discount }) => discount);

    if (
      maxDiscountVariation?.discount == null ||
      minDiscountVariation?.discount == null
    ) {
      return acc;
    }

    if (
      variations.filter(
        ({ discount }) => discount == maxDiscountVariation.discount,
      ).length > 1
    ) {
      return acc;
    }

    if (
      maxDiscountVariation.discount - minDiscountVariation.discount >
      maxDifference
    ) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const flaggedRatio = flaggedProductCount / products.length;

  if (flaggedRatio > maxFlaggedBeforeCancelled) {
    return "CANCELLED";
  }

  if (flaggedRatio > maxFlaggedBeforeProductsRemoved) {
    return "FLAGGED";
  }

  return "NONE";
};

const getDateChange = (startDateUnix: number, endDateUnix: number): number => {
  return Math.ceil((endDateUnix - startDateUnix) / 60 / 60 / 24);
};

export const createCampaignEvents = (
  events: ReadonlyArray<PickedCampaignEventInfo> | undefined | null,
): ReadonlyArray<EventTableData> => {
  if (events == null) {
    return [];
  }
  return events.map((event) => ({
    eventId: event.id,
    eventName: event.name,
    eventDescription: event.description,
    duration: getDateChange(event.startTime.unix, event.endTime.unix),
    startDate: event.startTime,
    endDate: event.endTime,
    deadline: event.submissionDeadline,
    countries: event.countries.map((country) => country.code),
    categories: event.productCategoryRestrictions,
    discountPercentage: event.minDiscountPercentage,
    eventType: event.promotionType,
  }));
};
