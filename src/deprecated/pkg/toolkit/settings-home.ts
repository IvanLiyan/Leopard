import {
  CurrencyValue,
  KycVerificationSchema,
  SellerVerificationSchema,
} from "@schema/types";
import { IconName } from "@ContextLogic/zeus";

type PickedSellerVerificationSchema = Pick<
  SellerVerificationSchema,
  "status" | "isKycVerification" | "gmvCapReached" | "canStart" | "numSalesCap"
> & {
  readonly kycVerification: Pick<KycVerificationSchema, "canStart">;
  readonly gmvCap: Pick<CurrencyValue, "display" | "amount"> | null;
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
  overview_products: "tag",
  overview_orders: "shoppingCartArrow",
  overview_support_tickets: "comment",
  overview_performance: "barChart",
  overview_advertising: "bullhorn",
  overview_promotions: "ticket",
  overview_payments: "wallet",
  overview_infractions: "warning",
  overview_disputes: "gavel",
  overview_fulfillment_services: "inbound",
  overview_help: "help",
  overview_settings: "gear",
  overview_notifications: "bell",
  overview_videos: "camera",
};
