import { KycVerificationSchema, SellerVerificationSchema } from "@schema/types";
import { IconName } from "@ContextLogic/zeus";

type PickedSellerVerificationSchema = Pick<
  SellerVerificationSchema,
  "status" | "isKycVerification" | "gmvCapReached" | "canStart"
> & {
  readonly kycVerification: Pick<KycVerificationSchema, "canStart">;
};

type PickedMerchantSchema = {
  readonly sellerVerification: PickedSellerVerificationSchema;
};

export type SettingsHomeInitialData = {
  readonly currentMerchant: PickedMerchantSchema;
};

export const OverviewCategoryIcons: {
  readonly [categoryId: string]: IconName;
} = {
  overview_admin: "globalLookup",
  overview_products: "tag",
  overview_orders: "shoppingCartArrow",
  overview_customer_experience: "comment",
  overview_brands: "shieldCheck",
  overview_notifications: "bell",
  overview_announcements: "mail",
  overview_product_boost: "productBoost",
  overview_price_drop: "hourglass",
  overview_collection_boost: "categories",
  overview_external_boost: "bullhorn",
  overview_fbw: "inbound",
  overview_fbs: "store",
  overview_sales_performance: "barChart",
  overview_shipping_performance: "truck",
  overview_infractions: "warning",
  overview_disputes: "gavel",
  overview_policy_help: "help",
  overview_payments: "wallet",
  overview_early_payment: "card",
  overview_settings: "gear",
  overview_apps: "newBox",
  overview_help: "help",
  overview_documentation: "doc",
  overview_reference: "info",
  overview_developers: "hammerWrench",
};
