import { PaymentCurrencyCode } from "@schema";

export const PER_PAGE_LIMIT = 20;

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
