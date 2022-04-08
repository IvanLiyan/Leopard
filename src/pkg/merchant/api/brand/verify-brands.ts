/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type ProductBrandDetectionInfoObject = {
  readonly product_id: string;
  readonly product_name: string;
  readonly brand_id: string;
  readonly brand_name: string;
  readonly days_left_to_verify: number | null | undefined;
  readonly brand_logo_url: string | null | undefined;
  readonly fine_amount_text: string;
};

/* ================== Get list ====================== */

export type GetProductBrandDetectionInfoParams = {
  readonly limit?: number;
  readonly offset?: number;
  readonly query_type?: string | null | undefined;
  readonly query?: string | null | undefined;
  readonly days_left?: string | null | undefined;
  readonly fetch_count_only?: boolean;
};

export type GetProductBrandDetectionInfoResponse = {
  readonly detection_infos: ReadonlyArray<ProductBrandDetectionInfoObject>;
  readonly total_count: number;
};

export const getProductBrandDetectionInfoList = (
  args: GetProductBrandDetectionInfoParams
): MerchantAPIRequest<
  GetProductBrandDetectionInfoParams,
  GetProductBrandDetectionInfoResponse
> => new MerchantAPIRequest("product-brand-detection-info/get", args);

/* ================== Verify or ignore brands ====================== */

export type VerifyOrIgnoreBrandsParams = {
  readonly product_ids: ReadonlyArray<string>;
  readonly is_verify: boolean;
};

export const verifyOrIgnoreBrands = (
  args: VerifyOrIgnoreBrandsParams
): MerchantAPIRequest<VerifyOrIgnoreBrandsParams, void> => {
  return new MerchantAPIRequest<VerifyOrIgnoreBrandsParams, void>(
    "product-brand-detection-info/verify-or-ignore",
    args
  );
};

/* ================== Delete product ====================== */

export type DeleteProductParams = {
  readonly product_id: string;
};

export const deleteProduct = (
  args: DeleteProductParams
): MerchantAPIRequest<DeleteProductParams, void> => {
  return new MerchantAPIRequest<DeleteProductParams, void>(
    "product-brand-detection-info/delete-product",
    args
  );
};
