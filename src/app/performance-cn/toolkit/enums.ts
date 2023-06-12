import { PaymentCurrencyCode } from "@schema";

export const PER_PAGE_LIMIT = 20;
export const REQUEST_WEEKS = 20;

export const CURRENCY_CODE: {
  USD: PaymentCurrencyCode;
  CNY: PaymentCurrencyCode;
} = {
  USD: "USD",
  CNY: "CNY",
};

export const EXPORT_CSV_STATS_TYPE = {
  PRODUCT_OVERVIEW: "product_overview",
  CUSTOMER_SERVICE: "customer_service",
  RATING: "rating",
  REFUND_BREAKDOWN: "refund_breakdown",
  PRESALE: "presale",
  FULFILLMENT_SHIPPING: "fulfillment_shipping",
};

export const EXPORT_CSV_TYPE = {
  MERCHANT: "merchant",
  PRODUCT: "product",
};

export const RATING_TAB_TYPE = {
  AGGREGATE_RATING: 0,
  WEEKLY_STORE_RATING: 1,
  STORE_RATINGS_BREAKDOWN: 2,
  WEEKLY_PRODUCT_RATING: 3,
  PRODUCT_RATINGS_BREAKDOWN: 4,
  STORE_RATING: 5,
  PRODUCT_RATING: 6,
};
