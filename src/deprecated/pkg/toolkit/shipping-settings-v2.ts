import { ProductSchema, ShippingProfileSchema } from "@schema/types";

export type PickedShippingProfileSchema = Pick<
  ShippingProfileSchema,
  "id" | "name" | "description" | "linkedProductCount"
>;

export type PickedProductType = Pick<
  ProductSchema,
  "id" | "sku" | "name" | "variationCount" | "enabled" | "reviewStatus"
>;

export type ShippingSettingsInitialData = {};
