import {
  ProductCsvImportColumnSchema,
  ProductCsvJobType,
  IsRequiredEnum,
  ColumnCategorySchema,
} from "@schema";

export type PickedProductCsvImportColumnSchema = Pick<
  ProductCsvImportColumnSchema,
  "columnId" | "name"
> & {
  readonly upsertProductsRequired: IsRequiredEnum;
  readonly addProductRequired: IsRequiredEnum;
  readonly editShippingRequired: IsRequiredEnum;
  readonly updateProductsRequired: IsRequiredEnum;
  readonly addSizeColorRequired: IsRequiredEnum;
  readonly shopifyCreateProductsRequired: IsRequiredEnum;
  readonly category?: Pick<ColumnCategorySchema, "id" | "name">;
};

const shopifyDisplayName = i`Import Shopify Products`;

// Merchant dashboard actions
export type ActionType = ExtractStrict<
  ProductCsvJobType,
  | "ADD_PRODUCTS"
  | "ADD_SIZE_COLOR"
  | "EDIT_SHIPPING"
  | "UPDATE_PRODUCTS"
  | "SHOPIFY_CREATE_PRODUCTS"
>;

export const ActionTypeDisplayNames: { [action in ActionType]: string } = {
  ADD_PRODUCTS: i`Add products`,
  ADD_SIZE_COLOR: i`Add variations to existing products`,
  EDIT_SHIPPING: i`Edit shipping`,
  UPDATE_PRODUCTS: i`Edit products`,
  SHOPIFY_CREATE_PRODUCTS: shopifyDisplayName,
};

// Merchant plus actions
export type PlusActionType = ExtractStrict<
  ProductCsvJobType,
  "UPSERT_PRODUCTS" | "SHOPIFY_CREATE_PRODUCTS"
>;
export const PlusActionTypeDisplayNames: {
  readonly [action in PlusActionType]: string;
} = {
  UPSERT_PRODUCTS: i`Add/edit products`,
  SHOPIFY_CREATE_PRODUCTS: shopifyDisplayName,
};
