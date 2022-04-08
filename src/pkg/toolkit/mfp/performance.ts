import {
  Country,
  CurrencyValue,
  Datetime,
  MfpCampaignCancelInfo,
  MfpCampaignCancelReason,
  MfpDiscountCampaignConstantsSchema,
  MfpFlashSaleConstantsSchema,
  MfpCampaignSchema,
  MfpServiceSchemaCampaignsArgs,
  MfpUnqualifiedVariationData,
  MfpVariationDiscountData,
  ProductSchema,
  VariationSchema,
  MerchantSchema,
  MfpVariationUnqualifiedReason,
  MfpCampaignPromotionType,
  ProductSchemaPerformanceArgs,
  ProductPerformanceSchema,
  ProductPromotionSchemaPeriodStatsArgs,
  ProductDailyPerformanceSchema,
} from "@schema/types";
import gql from "graphql-tag";
import moment from "moment/moment";

// Get Campaigns Query
export const GET_CAMPAIGN_QUERY = gql`
  query MfpPerformance_GetCampaignQuery(
    $id: String
    $performanceStartDate: DatetimeInput!
    $performanceEndDate: DatetimeInput!
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
          formattedForDiscount: formatted(fmt: "YYYY-MM-dd h:mm a zzzz")
          formattedForFlashSale: formatted(fmt: "MMM-dd-YYYY")
          short: formatted(fmt: "M/d")
          unix
        }
        endTime {
          formattedForDiscount: formatted(fmt: "YYYY-MM-dd h:mm a zzzz")
          formattedForFlashSale: formatted(fmt: "MMM-dd-YYYY")
          short: formatted(fmt: "M/d")
          unix
        }
        countries {
          code
        }
        promotionType
        cancelInfo {
          reason
          comment
        }
        unqualifiedProductVariations {
          reason
          variation {
            id
            productId
            productName
            color
            size
          }
        }
        flashSaleDetails {
          maxQuantity
          discountPercentage
          product {
            id
            name
            variationCount
            performance(
              startDate: $performanceStartDate
              endDate: $performanceEndDate
            ) {
              totalProductDetailPageView
              totalAddToCart
              totalOrders
              totalConversionRate
              totalGmv {
                display
              }
              totalAverageCostOfSaleCalculated {
                display
              }
            }
          }
          scheduledStartTime {
            dateDisplay: formatted(fmt: "MMM dd, YYYY")
            timeDisplay: formatted(fmt: "h a")
            timezone
          }
          scheduledEndTime {
            dateDisplay: formatted(fmt: "MMM dd, YYYY")
            timeDisplay: formatted(fmt: "h a")
            timezone
          }
          variation {
            productId
            productName
            id
            color
            size
            price {
              amount
              currencyCode
              display
            }
          }
        }
        discountDetails {
          maxQuantity
          discountPercentage
          product {
            id
            name
            variationCount
            performance(
              startDate: $performanceStartDate
              endDate: $performanceEndDate
            ) {
              totalProductDetailPageView
              totalAddToCart
              totalOrders
              totalConversionRate
              totalGmv {
                display
              }
              totalAverageCostOfSaleCalculated {
                display
              }
            }
          }
          variation {
            productId
            productName
            id
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
  }
`;

export type PickedProductPerformance = Pick<
  ProductSchema,
  "variationCount" | "id" | "name"
> & {
  readonly performance: Pick<
    ProductPerformanceSchema,
    | "totalProductDetailPageView"
    | "totalAddToCart"
    | "totalOrders"
    | "totalConversionRate"
  > & {
    readonly totalGmv: Pick<CurrencyValue, "display">;
    readonly totalAverageCostOfSaleCalculated: Pick<CurrencyValue, "display">;
  };
};

export type PickedMfpVariationDiscountDataDiscount = Pick<
  MfpVariationDiscountData,
  "discountPercentage" | "maxQuantity"
> & {
  readonly product: PickedProductPerformance;
  readonly variation: Pick<
    VariationSchema,
    "productId" | "productName" | "id" | "color" | "size"
  > & {
    readonly price: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  };
};

export type PickedMfpVariationDiscountDataFlashSale = Pick<
  MfpVariationDiscountData,
  "discountPercentage" | "maxQuantity"
> & {
  readonly product: PickedProductPerformance;
  readonly variation: Pick<
    VariationSchema,
    "productId" | "productName" | "id" | "color" | "size"
  > & {
    readonly price: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  };
  readonly scheduledStartTime?:
    | (Pick<Datetime, "timezone"> & {
        readonly dateDisplay: Datetime["formatted"];
        readonly timeDisplay: Datetime["formatted"];
      })
    | null;
  readonly scheduledEndTime?:
    | (Pick<Datetime, "timezone"> & {
        readonly dateDisplay: Datetime["formatted"];
        readonly timeDisplay: Datetime["formatted"];
      })
    | null;
};

export type PickedCampaignPerfomance = Pick<
  MfpCampaignSchema,
  "name" | "id" | "state" | "promotionType"
> & {
  readonly startTime: Pick<Datetime, "unix"> & {
    readonly formattedForDiscount: Datetime["formatted"];
    readonly formattedForFlashSale: Datetime["formatted"];
    readonly short: Datetime["formatted"];
  };
  readonly endTime: Pick<Datetime, "unix"> & {
    readonly formattedForDiscount: Datetime["formatted"];
    readonly formattedForFlashSale: Datetime["formatted"];
    readonly short: Datetime["formatted"];
  };
  readonly countries?: ReadonlyArray<Pick<Country, "code">> | null;
  readonly unqualifiedProductVariations?: ReadonlyArray<
    Pick<MfpUnqualifiedVariationData, "reason"> & {
      readonly variation: Pick<
        VariationSchema,
        "productId" | "id" | "color" | "size" | "productName"
      >;
    }
  > | null;
  readonly cancelInfo?: Pick<
    MfpCampaignCancelInfo,
    "reason" | "comment"
  > | null;
  readonly flashSaleDetails?: ReadonlyArray<PickedMfpVariationDiscountDataFlashSale> | null;
  readonly discountDetails?: ReadonlyArray<PickedMfpVariationDiscountDataDiscount> | null;
};

export type GetCampaignResponse = {
  readonly mfp?: {
    readonly campaigns?: ReadonlyArray<PickedCampaignPerfomance> | null;
  } | null;
};
export type GetCampaignRequest = {
  readonly id: MfpServiceSchemaCampaignsArgs["searchQuery"];
  readonly performanceStartDate: ProductSchemaPerformanceArgs["startDate"];
  readonly performanceEndDate: ProductSchemaPerformanceArgs["endDate"];
};

export type ViewCampaignInitialCampaignData = Pick<MfpCampaignSchema, "id"> & {
  readonly startTime: Pick<Datetime, "unix">;
  readonly endTime: Pick<Datetime, "unix">;
};

export type ViewCampaignInitialData = GetCampaignResponse & {
  readonly currentMerchant?: Pick<MerchantSchema, "id"> | null;
  readonly platformConstants?: PickedMfpConstantsPerformance | null;
  readonly mfp?: {
    readonly campaigns?: ReadonlyArray<ViewCampaignInitialCampaignData> | null;
  } | null;
};

// Get Daily Product Performance Query
export const GET_DAILY_PRODUCT_PERFORMANCE_QUERY = gql`
  query MfpPerformance_GetDailyProductPerformanceQuery(
    $id: String
    $startDate: DatetimeInput!
    $endDate: DatetimeInput!
  ) {
    productCatalog {
      product(id: $id) {
        performance(startDate: $startDate, endDate: $endDate) {
          daily(startDate: $startDate, endDate: $endDate) {
            addToCart
            conversionRate
            orders
            productDetailPageView
            date {
              unix
              full: formatted(fmt: "EEEE M/dd/YYYY")
              short: formatted(fmt: "M/d")
            }
            gmv {
              amount
              display
              currencyCode
            }
            averageCostOfSaleCalculated {
              amount
              display
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export type PickedDailyPerf = Pick<
  ProductDailyPerformanceSchema,
  "addToCart" | "conversionRate" | "orders" | "productDetailPageView"
> & {
  readonly date: Pick<Datetime, "unix"> & {
    readonly full: Datetime["formatted"];
    readonly short: Datetime["formatted"];
  };
  readonly gmv: Pick<CurrencyValue, "amount" | "display" | "currencyCode">;
  readonly averageCostOfSaleCalculated: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
};

export type GetDailyProductPerformanceResponse = {
  readonly productCatalog?: {
    readonly product?: {
      readonly performance?: {
        readonly daily: ReadonlyArray<PickedDailyPerf>;
      } | null;
    } | null;
  } | null;
};
export type GetDailyProductPerformanceRequest = {
  readonly id: MfpServiceSchemaCampaignsArgs["searchQuery"];
  readonly startDate: ProductPromotionSchemaPeriodStatsArgs["startTime"];
  readonly endDate: ProductPromotionSchemaPeriodStatsArgs["endTime"];
};

export const MfpCancelReasonDisplayNames: {
  readonly [T in MfpCampaignCancelReason]: string;
} = {
  WISH_CANCELLED_FAILED_DEPENDENCIES: i`No valid product in promotion`,
  WISH_CANCELLED_UNQUALIFIED_MERCHANT: i`Merchant either banned or not qualified to run promotions`,
  MERCHANT_CANCELLED_WRONG_CAMPAIGN_INFO: i`Cancelled by merchant due to invalid promotion information`,
  WRONG_PRODUCTS: i`Cancelled by merchant due to invalid promotion product information`,
  OTHER: i`Other`,
};

export const isCampaignCancellable = (
  campaign: Pick<MfpCampaignSchema, "state"> & {
    readonly endTime: Pick<Datetime, "unix">;
  }
): boolean => {
  const campaignEnd = moment(campaign.endTime.unix * 1000);
  const now = moment();

  if (now.isAfter(campaignEnd)) {
    return false;
  }

  return campaign.state == "APPROVED" || campaign.state == "PENDING";
};

export const isCampaignRestartable = (
  campaign: Pick<MfpCampaignSchema, "state"> & {
    readonly endTime: Pick<Datetime, "unix">;
  }
): boolean => {
  const campaignEnd = moment(campaign.endTime.unix * 1000);
  const now = moment();

  if (now.isAfter(campaignEnd)) {
    return true;
  }

  return campaign.state == "CANCELLED";
};

export const isCampaignEditable = (
  campaign: Pick<MfpCampaignSchema, "state"> & {
    readonly endTime: Pick<Datetime, "unix">;
  }
): boolean => {
  const campaignEnd = moment(campaign.endTime.unix * 1000);
  const now = moment();

  if (now.isAfter(campaignEnd)) {
    return false;
  }

  return campaign.state != "CANCELLED";
};

export type PickedMfpConstantsPerformance = {
  readonly mfp: {
    readonly discountCampaign: Pick<
      MfpDiscountCampaignConstantsSchema,
      | "minimumProductRatingRequired"
      | "minimumProductSaleRequired"
      | "minimumProductHistoryDays"
      | "productAndShippingPriceDays"
      | "minimumCooldownDays"
      | "minimumPercentageRequired"
      | "minDiscountPercentage"
      | "maxDiscountPercentage"
    > & {
      readonly minStartTimeForLaunch: {
        readonly inTimezone: Pick<Datetime, "unix">;
      };
    };
    readonly flashSaleCampaign: Pick<
      MfpFlashSaleConstantsSchema,
      | "minimumProductRatingRequired"
      | "minimumProductSaleRequired"
      | "minimumProductHistoryDays"
      | "productAndShippingPriceDays"
      | "minimumCooldownDays"
      | "minimumPercentageRequired"
      | "minDiscountPercentage"
      | "maxDiscountPercentage"
      | "minDealQuantityPercentage"
    > & {
      readonly minStartTimeForLaunch: {
        readonly inTimezone: Pick<Datetime, "unix">;
      };
    };
  };
};

export const getMfpVariationRejectionReasonDisplayNames = ({
  promotionType,
  constants,
}: {
  readonly promotionType: ExcludeStrict<
    MfpCampaignPromotionType,
    "SPEND_MORE_AND_SAVE_MORE"
  >;
  readonly constants: PickedMfpConstantsPerformance;
}): {
  readonly [T in MfpVariationUnqualifiedReason]: string;
} => {
  const {
    mfp: { discountCampaign, flashSaleCampaign },
  } = constants;

  const getSaleHistoryString = ({
    minimumProductSaleRequired,
    minimumProductHistoryDays,
  }: {
    readonly minimumProductSaleRequired: number;
    readonly minimumProductHistoryDays: number;
  }): string =>
    minimumProductSaleRequired == 1
      ? i`No product sales in the last ${minimumProductHistoryDays} days`
      : i`Less than ${minimumProductSaleRequired} sales in the last ${minimumProductHistoryDays} days`;
  const saleHistoryStringMap: {
    readonly [T in ExcludeStrict<
      MfpCampaignPromotionType,
      "SPEND_MORE_AND_SAVE_MORE"
    >]: string;
  } = {
    PRICE_DISCOUNT: getSaleHistoryString({
      minimumProductSaleRequired: discountCampaign.minimumProductSaleRequired,
      minimumProductHistoryDays: discountCampaign.minimumProductHistoryDays,
    }),
    FLASH_SALE: getSaleHistoryString({
      minimumProductSaleRequired: flashSaleCampaign.minimumProductSaleRequired,
      minimumProductHistoryDays: flashSaleCampaign.minimumProductHistoryDays,
    }),
  };

  const getProductPriceString = ({
    productAndShippingPriceDays,
  }: {
    readonly productAndShippingPriceDays: number;
  }): string =>
    i`Product price is not the lowest it has been during the last ${productAndShippingPriceDays} days`;
  const productPriceStringMap: {
    readonly [T in ExcludeStrict<
      MfpCampaignPromotionType,
      "SPEND_MORE_AND_SAVE_MORE"
    >]: string;
  } = {
    PRICE_DISCOUNT: getProductPriceString({
      productAndShippingPriceDays: discountCampaign.productAndShippingPriceDays,
    }),
    FLASH_SALE: getProductPriceString({
      productAndShippingPriceDays:
        flashSaleCampaign.productAndShippingPriceDays,
    }),
  };

  const getCampaignLimitString = ({
    minimumCooldownDays,
  }: {
    readonly minimumCooldownDays: number;
  }): string =>
    i`Products cannot be on conflicting campaigns at the same time, conflicting ` +
    i`promotion types: Discount/Flash Sale. Products can only enroll in campaign of ` +
    i`the same type ${minimumCooldownDays} days after the previous one ends`;
  const campaignLimitStringMap: {
    readonly [T in ExcludeStrict<
      MfpCampaignPromotionType,
      "SPEND_MORE_AND_SAVE_MORE"
    >]: string;
  } = {
    PRICE_DISCOUNT: getCampaignLimitString({
      minimumCooldownDays: discountCampaign.minimumCooldownDays,
    }),
    FLASH_SALE: getCampaignLimitString({
      minimumCooldownDays: flashSaleCampaign.minimumCooldownDays,
    }),
  };

  const getMinVariationPercentageString = ({
    minimumPercentageRequired,
  }: {
    readonly minimumPercentageRequired: number;
  }): string =>
    minimumPercentageRequired == 100
      ? i`All of a product's variations should be included for this promotion type`
      : `A minimum of ${minimumPercentageRequired}% of a product's variations should be included for this promotion type`;
  const minVariationStringMap: {
    readonly [T in ExcludeStrict<
      MfpCampaignPromotionType,
      "SPEND_MORE_AND_SAVE_MORE"
    >]: string;
  } = {
    PRICE_DISCOUNT: getMinVariationPercentageString({
      minimumPercentageRequired: discountCampaign.minimumPercentageRequired,
    }),
    FLASH_SALE: getMinVariationPercentageString({
      minimumPercentageRequired: flashSaleCampaign.minimumPercentageRequired,
    }),
  };

  const getProductListedDaysString = ({
    minimumProductHistoryDays,
  }: {
    readonly minimumProductHistoryDays: number;
  }): string =>
    i`Product must be listed on the platform more than ${minimumProductHistoryDays} days`;
  const productListedDaysStringMap: {
    readonly [T in ExcludeStrict<
      MfpCampaignPromotionType,
      "SPEND_MORE_AND_SAVE_MORE"
    >]: string;
  } = {
    PRICE_DISCOUNT: getProductListedDaysString({
      minimumProductHistoryDays: discountCampaign.minimumProductHistoryDays,
    }),
    FLASH_SALE: getProductListedDaysString({
      minimumProductHistoryDays: flashSaleCampaign.minimumProductHistoryDays,
    }),
  };

  return {
    NOT_IN_STOCK: i`Product out of stock`,
    LOW_RATING:
      i`Product rating is too low (Minimum of ` +
      i`${discountCampaign.minimumProductRatingRequired} for Discount promotions, ` +
      i`or ${flashSaleCampaign.minimumProductRatingRequired} for Flash Sale ` +
      i`promotions)`,
    SALE_HISTORY: saleHistoryStringMap[promotionType],
    PRODUCT_PRICE: productPriceStringMap[promotionType],
    PRODUCT_SHIPPING_PRICE: i`Product shipping price cannot be increased before promotion starts`,
    PRODUCT_CATEGORY: i`Some product categories are not eligible for the promotion type`,
    CAMPAIGN_LIMIT: campaignLimitStringMap[promotionType],
    MININUM_VARIATION_PERCENTAGE: minVariationStringMap[promotionType],
    FLASH_SALE_MINIMUM_DEAL_QUANTITY:
      i`A minimum of ${flashSaleCampaign.minDealQuantityPercentage}% of each variation ` +
      i`inventory, or ${1} quantity (whichever is bigger) is required for ` +
      i`Flash Sale promotions`,
    VARIATIONS_PRICING_GAMING:
      i`Variations' discounts have a steep difference, with most discounts at ` +
      i`the lower end of the range`,
    PRODUCT_LISTED_DAYS: productListedDaysStringMap[promotionType],
    MERCHANT_ELIGIBILITY: i`Merchant is not eligible to participate in the promotions platform`,
    NOT_OWNED_BY_MERCHANT: i`Each variation must be owned by the merchant`,
  };
};

export const MAX_PERFORMANCE_DAYS_DELTA = 30;
