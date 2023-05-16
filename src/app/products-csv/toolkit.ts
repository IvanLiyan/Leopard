import { ci18n } from "@core/toolkit/i18n";

export type UploadTemplateType =
  | "ADD_PRODUCT"
  | "EDIT_EXISTING_PRODUCT"
  | "ADD_VARIATIONS"; // TODO: replace with BE typpe

export const UPLOAD_TEMPLATE_NAMES: Record<UploadTemplateType, string> = {
  ADD_PRODUCT: i`CSV file for adding new products`,
  EDIT_EXISTING_PRODUCT: i`CSV file for editing existing products`,
  ADD_VARIATIONS: i`CSV file for adding new variations`,
};

export type UpdateActionType = "ADD" | "EDIT";

export const UPDATE_ACTION_NAMES: Record<UpdateActionType, string> = {
  ADD: i`Add new products`,
  EDIT: i`Edit existing products`,
};

export type DownloadTemplateType =
  | "ADD_PRODUCT"
  | "EDIT_PRICE_INVENTORY"
  | "EDIT_BASIC_INFO"
  | "EDIT_SHIPPING"
  | "EDIT_BY_CATEGORY"
  | "EDIT_ALL"
  | "ADD_VARIATIONS";

export type EditDownloadTemplateType = Exclude<
  DownloadTemplateType,
  "ADD_PRODUCT"
>;

export const EDIT_DOWNLOAD_TEMPLATE_NAMES: Record<
  EditDownloadTemplateType,
  string
> = {
  EDIT_PRICE_INVENTORY: ci18n("Product edit type", "Edit price and inventory"),
  EDIT_BASIC_INFO: ci18n(
    "Product edit type",
    "Edit title, images and description",
  ),
  EDIT_SHIPPING: ci18n("Product edit type", "Edit shipping info and TTDs"),
  EDIT_BY_CATEGORY: ci18n("Product edit type", "Edit by category"),
  EDIT_ALL: ci18n("Product edit type", "Edit all fields"),
  ADD_VARIATIONS: ci18n(
    "Product edit type",
    "Add variations to existing products",
  ),
};

export const EDIT_DOWNLOAD_TEMPLATE_INFOS: Record<
  EditDownloadTemplateType,
  {
    readonly title: string;
    readonly description: string;
    readonly fieldNames: ReadonlyArray<string>;
  }
> = {
  EDIT_PRICE_INVENTORY: {
    title: i`Edit price and inventory `,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Inventory"),
      ci18n("Product field", "Price"),
      ci18n("Product field", "Shipping Price"),
    ],
  },
  EDIT_BASIC_INFO: {
    title: i`Edit title, images, and description`,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Name"),
      ci18n("Product field", "Description"),
      ci18n("Product field", "Images"),
      ci18n("Product field", "Videos"),
    ],
  },
  EDIT_SHIPPING: {
    title: i`Edit shipping info and TTDs`,
    description: i`Download your catalog or a template with the following fields:`,
    fieldNames: [
      ci18n("Product field", "Shipping price"),
      ci18n("Product field", "Warehouse"),
      ci18n("Product field", "Handling time"),
      ci18n("Product field", "TTD (time to door)"),
    ],
  },
  EDIT_BY_CATEGORY: {
    title: i`Edit by category`,
    description:
      i`Download your catalog or a template by category. ` +
      i`We recommend this option to edit or add category ` +
      i`specific attributes to your listings.`,
    fieldNames: [],
  },
  EDIT_ALL: {
    title: i`Edit all fields`,
    description:
      i`Download your entire catalog. This is a great option to ` +
      i`edit multiple fields of existing listings. `,
    fieldNames: [],
  },
  ADD_VARIATIONS: {
    title: i`Add variations to existing products`,
    description:
      i`Download your catalog or a template. This is the only option ` +
      i`that will allow you to add variations to existing listings. `,
    fieldNames: [],
  },
};
