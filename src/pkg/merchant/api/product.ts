/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Merchant API */
import { GetSizeChartResponse } from "@merchant/api/size-chart";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type GetProductsAdminViewParams = {
  // comma-seperate list of pids
  readonly count?: number | null | undefined;
  readonly start?: number | null | undefined;
  readonly sort?: string | null | undefined;
  readonly pids?: string | null | undefined;
};

export type ReviewStatus = "APPROVED" | "REJECTED" | "PENDING";

export type GracePeriods = {
  readonly country_code: CountryCode;
  readonly expiry: number;
};

export type GetProductsAdminViewDict = {
  readonly product_id: string;
  readonly product_name: string;
  readonly main_image: string;
  readonly description: string;
  readonly review_status: ReviewStatus;
  readonly is_promoted?: string;
  readonly has_ac_grace_period?: string;
  readonly ac_grace_periods: ReadonlyArray<GracePeriods>;
};

export type GetProductsAdminViewResponse = {
  readonly num_results: number;
  readonly results: ReadonlyArray<GetProductsAdminViewDict>;
};

export type UpdateSingleProductAdminViewParams = {
  // a single pid
  readonly pid?: string | null | undefined;
  readonly review_status: string | null | undefined;
};

export type UpdateSingleProductAdminViewResponse = {
  readonly updated: boolean;
};

export type GetMultiLightPriceParams = {
  // comma-seperate list of pids
  readonly pids: string;
};

export type LightProductDict = {
  readonly id: string;
  readonly name: string;
  readonly is_promoted?: boolean;
  readonly parent_sku: string;
  readonly eligible_for_campaign?: boolean;
};

export type GetMultiLightPriceResponse = {
  readonly results: ReadonlyArray<LightProductDict>;
};

export type GetProductParams = {
  readonly product_id: string;
};

export type ProductDict = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
};

export type GetProductResponse = {
  readonly product: ProductDict;
};

export const getProductsAdminView = (
  args: GetProductsAdminViewParams
): MerchantAPIRequest<
  GetProductsAdminViewParams,
  GetProductsAdminViewResponse
> => {
  return new MerchantAPIRequest("product/get-multi-admin-view", args);
};

export const updateSingleProductAdminView = (
  args: UpdateSingleProductAdminViewParams
): MerchantAPIRequest<
  UpdateSingleProductAdminViewParams,
  UpdateSingleProductAdminViewResponse
> => {
  return new MerchantAPIRequest("product/update-single-admin-view", args);
};

export const getProduct = (
  args: GetProductParams
): MerchantAPIRequest<GetProductParams, GetProductResponse> => {
  return new MerchantAPIRequest("product/get", args);
};

export const getMultiLight = (
  args: GetMultiLightPriceParams
): MerchantAPIRequest<GetMultiLightPriceParams, GetMultiLightPriceResponse> => {
  return new MerchantAPIRequest("product/get-multi-light", args);
};

export type RemoveProductParams = {
  // comma-seperate list of pids
  readonly pid: string;
};

export type RemoveProductResponse = {};

export const removeProduct = (
  args: RemoveProductParams
): MerchantAPIRequest<RemoveProductParams, RemoveProductResponse> => {
  return new MerchantAPIRequest("remove-product", args);
};

export type GetMultiResponse = {
  readonly results: ReadonlyArray<LightProductDict>;
};

export type GetMultiInput = {
  readonly input: string;
  readonly type: string;
  readonly count: number;
};

export type GetMultiParams = {
  readonly count: number;
  readonly query: string;
  readonly search_type: string;
  readonly show_disabled: boolean;
  readonly show_enabled: boolean;
  readonly show_under_review: boolean;
  readonly show_accepted: boolean;
  readonly show_rejected: boolean;
  readonly filter_wish_express: boolean;
  readonly filter_all_star_badge: boolean;
  readonly order: string | null | undefined;
  readonly start: number;
  readonly sort: string;
};

export const getMulti = (
  args: GetMultiInput
): MerchantAPIRequest<GetMultiParams, GetMultiResponse> => {
  const params = {
    count: args.count,
    query: args.input.trim(),
    search_type: args.type,
    show_disabled: false,
    show_enabled: true,
    show_under_review: true,
    show_accepted: true,
    show_rejected: false,
    filter_wish_express: false,
    filter_all_star_badge: false,
    order: null,
    start: 0,
    sort: "num_sold",
  };
  return new MerchantAPIRequest("product/get-multi", params);
};

export type ProductVariation = {
  readonly id: string;
  readonly color: string;
  readonly size: string;
  readonly sku: string;
  readonly price: number;
  readonly cost: number;
  readonly inventory: number;
  readonly enabled: boolean;
};

export type ProductDetail = {
  readonly id: string;
  readonly name: string;
  readonly main_image: string;
  readonly extra_images: ReadonlyArray<string>;
  readonly clean_image: undefined | null | string;
  readonly variations: ReadonlyArray<ProductVariation>;
  readonly size_chart: undefined | null | GetSizeChartResponse;
  readonly size_chart_names: undefined | null | ReadonlyArray<string>;
  readonly variation_sizes: ReadonlyArray<string>;
  readonly description: string;
  readonly parent_sku: string;
  readonly tags: ReadonlyArray<string>;
  readonly all_brand_names: ReadonlyArray<string>;
  readonly brand_id: undefined | null | string;
  readonly brand_name: undefined | null | string;
  readonly brand_status: undefined | null | string;
  readonly upc: undefined | null | string;
  readonly landing_page_url: undefined | null | string;
  readonly max_quantity: undefined | null | number;
  readonly is_ltl?: undefined | null | string;
  readonly default_warehouse_id: string;
};

export const getProductDetail = (
  args: GetProductDetailParams
): MerchantAPIRequest<GetProductDetailParams, GetProductDetailParamsResponse> =>
  new MerchantAPIRequest("product/get-detail", args);

export type GetProductDetailParams = {
  readonly product_id: string;
};

export type GetProductDetailParamsResponse = {
  readonly product_detail: ProductDetail;
};

export const updateProductDetail = (
  args: UpdateProductDetailParams
): MerchantAPIRequest<
  UpdateProductDetailParams,
  UpdateProductDetailParamsResponse
> => new MerchantAPIRequest("product/update-detail", args);

export type ProductUpdateData = {
  name?: string;
  description?: string;
  parent_sku?: string;
  main_image_url?: string;
  extra_image_urls?: ReadonlyArray<string>;
  clean_image_url?: string;
  size_chart_name?: string;
  brand_id?: string;
  upc?: string;
  landing_page_url?: string;
  max_quantity?: number;
  tags?: ReadonlyArray<string>;
};

export type UpdateProductDetailParams = {
  readonly product_id: string;
  readonly update_data: string;
};

export type UpdateProductDetailParamsResponse = {};

export const addVariation = (
  args: AddVariationParams
): MerchantAPIRequest<AddVariationParams, AddVariationParamsResponse> =>
  new MerchantAPIRequest("product/add-variation", args);

export type AddVariationParams = {
  readonly cid: string;
  readonly data_json: string;
};

export type AddVariationParamsResponse = {};
