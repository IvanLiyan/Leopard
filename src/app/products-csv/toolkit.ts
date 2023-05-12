export type UploadTemplateType =
  | "ADD_PRODUCT"
  | "EDIT_EXISTING_PRODUCT"
  | "ADD_VARIATIONS"; // TODO: replace with BE typpe

export const UPLOAD_TEMPLATE_NAMES: Record<UploadTemplateType, string> = {
  ADD_PRODUCT: i`CSV file for adding new products`,
  EDIT_EXISTING_PRODUCT: i`CSV file for editing existing products`,
  ADD_VARIATIONS: i`CSV file for adding new variations`,
};

export type DownloadTemplateType = "ADD" | "EDIT";

export const DOWNLOAD_TEMPLATE_NAMES: Record<DownloadTemplateType, string> = {
  ADD: i`Add new products`,
  EDIT: i`Edit existing products`,
};
