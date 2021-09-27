/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";
import { WarehouseType, LowInventorySKU } from "@toolkit/fbw";

export type ShippingPlanState =
  | 1 // "SELECT_WAREHOUSE"
  | 2 // "SELECT_SKUS"
  | 3 // "PREPARE_SKUS"
  | 4 // "PRINT_LABELS"
  | 5 // "PREPARE_SHIPMENT_BOX_COUNT"
  | 6 // "SUBMIT"
  | 7 // "SUBMITTED"
  | 8 // "SHIPPED"
  | 9 // "IN_TRANSIT"
  | 10 // "DELIVERED"
  | 11 // "DELIVERY_CONFIRMED"
  | 12 // "DELIVERY_MISMATCH"
  | 13 // "COMPLETE"
  | 14 // "CANCELLED"
  | 15 // "EXPIRED"
  | 16 // "SCHEDULE_PICKUP"
  | 17 // "PROCESSING"
  | 18 // "PREPARE_SHIPMENT_CASE_LABEL"
  | 19; // "SUBMISSION_FAIL";

export type ShippingPlanType =
  | 1 // "FBW"
  | 2; // "FBS"

export type Region = "FBW-US" | "FBW-EU-TLL" | "FBW-EU-AMS";

export type BlacklistReason =
  | undefined
  | "POOR_PERF"
  | "HIGH_PRICE"
  | "LOW_PRICE"
  | "NOT_BLACKLISTED";

export type FBWTopVariation = {
  readonly variation_id: string;
  readonly product_id: string;
  readonly sku: string;
  readonly gmv: number;
  readonly is_recommended: boolean;
  readonly top_warehouse: string;
  readonly product_name: string;
  readonly parent_sku: string;
  readonly size: string | null | undefined;
  readonly color: string | null | undefined;
};

export type FBSTopVariation = {
  readonly variation_id: string;
  readonly product_id: string;
  readonly quantity: number;
  readonly total_gmv: number;
  readonly variation_sku: string;
  readonly warehouse_id: string;
};

export type ShippingPlanSKU = {
  readonly sku: string | null | undefined;
  readonly quantity?: number;
  readonly source?: number;
  readonly selected?: number;
  readonly product_id?: string;
  readonly product_name?: string;
  readonly parent_sku?: string;
  readonly size?: string;
  readonly color?: string;
  readonly label_single?: Readonly<MerchantFile>;
  readonly label?: Readonly<MerchantFile>;
};

export type ShippingPlan = {
  readonly id: string;
  readonly fbw_shipping_id: string;
  readonly date_created: string;
  readonly state: ShippingPlanState;
  readonly warehouse: WarehouseType;
  readonly warehouse_id: string;
  readonly delivery_option: Readonly<DeliveryOption>;
  readonly label: Readonly<MerchantFile>;
  readonly invoice: Readonly<MerchantFile>;
  readonly skus: ReadonlyArray<Readonly<ShippingPlanSKU>>;
  readonly shipment_type: Readonly<ShippingPlanType>;
  readonly sku_labels_generated: boolean;
  readonly case_labels_generated: boolean;
  readonly invoice_file_id?: string;
  readonly label_file_id?: string;
};

export type Product = {
  readonly name: string;
  readonly color: string;
  readonly size: string;
  readonly variation_id: string;
  readonly product_id: string;
  readonly product_name: string;
  readonly parent_sku: string;
  readonly quantity: number;
  readonly is_recommended: boolean;
  readonly source: number;
  readonly gmv: number;
  readonly distribution: {
    [key: string]: Readonly<DistributionItem>;
  };
  readonly key: string;
  readonly sku: string;
  readonly small_picture: string;
  readonly sold_quantity: number;
  readonly estimate_out_of_stock_days: number;
  readonly estimate_out_of_stock_warehouse: string;
};

export type MerchantFile = {
  readonly id: string;
  readonly url: string;
};

export type DeliveryOption = {
  readonly method: number;
  readonly address: Readonly<WarehouseAddress>;
};

export type WarehouseAddress = {
  readonly street_address1: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly country: string;
};

export type Tracking = {
  readonly provider: string;
  readonly tracking_id: string;
  readonly provider_name: string;
};

export type BlacklistItem = {
  readonly blacklisted: boolean;
  readonly reason: string;
};

export type DistributionItem = {
  readonly sku: string;
  readonly warehouse_code: string;
  readonly quantity: number;
  readonly blacklisted: boolean;
  readonly reason: BlacklistReason;
  readonly min?: number;
  readonly max?: number;
  readonly initial_total_quantity: number;
  readonly last_90_days_sold: number;
  readonly estimated_days_until_out_of_stock: number;
};

export type ShippingPlanCreationParams = {
  readonly variation_ids: string;
  readonly shipment_type: string;
};

export type ShippingPlanCreationResponse = {
  readonly merchantOrigin: string;
  readonly warehouses: ReadonlyArray<Readonly<WarehouseType>>;
  readonly regions: ReadonlyArray<Region>;
  readonly country_mapping: {
    [key: string]: CountryCode;
  };
  readonly warehouse_classification: {
    [key: string]: ReadonlyArray<string>;
  };
  readonly whitelisted_warehouses: ReadonlyArray<string>;
  readonly url_param_variations:
    | ReadonlyArray<Readonly<Product>>
    | null
    | undefined;
  readonly fbw_recommended_variations?:
    | ReadonlyArray<Readonly<Product>>
    | null
    | undefined;
  readonly fbs_recommended_variations?:
    | ReadonlyArray<Readonly<Product>>
    | null
    | undefined;
  readonly show_fbw_tos: boolean;
  readonly fbw_pb_incentive: boolean;
};

export type GetShippingPlanByBatchIdParams = {
  readonly batch_id: string | null | undefined;
  readonly shipping_plan_ids: string | null | undefined;
};

export type GetShippingPlanByBatchIdResponse = {
  readonly shipping_plans:
    | ReadonlyArray<Readonly<ShippingPlan>>
    | null
    | undefined;
  readonly SKUMap: {
    [key: string]: Product;
  };
};

export type GetShippingPlanByIdParams = {
  readonly shipping_plan_id: string;
};

export type GetShippingPlanByIdResponse = {
  readonly shipping_plan: ShippingPlan;
  readonly shipping_plan_trackings: {
    [key: string]: Readonly<Tracking>;
  };
  readonly SKUMap: {
    [key: string]: Product;
  };
  readonly shipping_providers: {
    [key: string]: string;
  };
  readonly fbw_pb_incentive: boolean;
};

export type SubmitShippingPlanParams = {
  readonly shipping_plans: string | null | undefined;
  readonly shipment_type: string;
  readonly source: number;
};

export type SubmitShippingPlanResponse = {
  readonly shipping_plans:
    | ReadonlyArray<Readonly<ShippingPlan>>
    | null
    | undefined;
  readonly batch_id: string | null | undefined;
};

export type UpdateShippingPlanParams = {
  readonly id: string;
  readonly state: ShippingPlanStateText;
  readonly tracking_numbers?: string;
};

export type UpdateShippingPlanResponse = {};

export type DeleteShippingPlanParams = {
  readonly id: string;
  readonly skus: string;
};

export type DeleteShippingPlanResponse = {};

export type FetchInboundGuidanceParams = {
  readonly skus: string;
  readonly quantities: string;
  readonly variation_ids: string;
  readonly product_ids: string;
  readonly warehouse_ids: string;
  readonly shipment_type: string;
};

export type FetchInboundGuidanceResponse = {
  readonly distribution_map: {
    [key: string]: {
      [key: string]: DistributionItem;
    };
  };
};

export type SearchSKUParams = {
  readonly query: string;
  readonly search_type: string;
  readonly warehouse_ids: string;
};

export type SearchSKUResponse = {
  readonly results: ReadonlyArray<Readonly<Product>> | null | undefined;
};

export const searchSKU = (
  args: SearchSKUParams
): MerchantAPIRequest<SearchSKUParams, SearchSKUResponse> => {
  return new MerchantAPIRequest("fbw/shipping-plan/search-sku", args);
};

export type FetchRecommendedSKUsParams = {
  readonly warehouse_ids: string;
};

export type FetchRecommendedSKUsResponse = {
  readonly results: ReadonlyArray<Readonly<Product>>;
};

export type GetFBWStatsParams = {
  readonly start_date: string;
  readonly end_date: string;
};

export type GetFBWStatsResponse = {
  readonly results: {
    readonly rows: {
      readonly inventory: number;
      readonly refund_reasons_count: number;
      readonly sp_completed: number;
      readonly sp_created: number;
      readonly sp_delivered: number;
      readonly sp_shipped: number;
      readonly txn_cost: number;
      readonly txn_count: number;
      readonly txn_gmv: number;
      readonly txn_qty: number;
    };
  };
};

export type GetNumLowInventoryParams = {};

export type GetNumLowInventoryResponse = {
  num_low_inventory: number;
  merchant_id: string;
  low_inventory: ReadonlyArray<LowInventorySKU>;
  warehouses: ReadonlyArray<WarehouseType>;
};

export type GetNumActionRequiredShippingPlansParams = {};

export type GetNumActionRequiredShippingPlansResponse = {
  readonly num_action_required_shipping_plans: number;
};

export type GetWarehousesParams = {
  readonly express_only?: boolean;
};

export type GetWarehousesResponse = {
  readonly warehouses: ReadonlyArray<WarehouseType>;
};

export type GetFBWTopVariationsParams = {};

export type GetFBWTopVariationsResponse = {
  readonly results: ReadonlyArray<FBWTopVariation>;
};

export type GetFBSTopVariationsResponse = {
  readonly results: ReadonlyArray<FBSTopVariation>;
};

export type GetFBWRecentlySoldVariationsParams = {
  readonly limit: number;
  readonly num_days: number;
  readonly warehouse_ids: string;
};

export const getNumActionRequiredShippingPlans = (
  args: GetNumActionRequiredShippingPlansParams
): MerchantAPIRequest<
  GetNumActionRequiredShippingPlansParams,
  GetNumActionRequiredShippingPlansResponse
> => new MerchantAPIRequest("fbw/num-action-required-shipping-plans", args);

export const getWarehouses = (
  args: GetWarehousesParams
): MerchantAPIRequest<GetWarehousesParams, GetWarehousesResponse> =>
  new MerchantAPIRequest("fbw/warehouses", args);

export const getFBWTopVariations = (
  args: GetFBWTopVariationsParams
): MerchantAPIRequest<GetFBWTopVariationsParams, GetFBWTopVariationsResponse> =>
  new MerchantAPIRequest("fbw/top-variations", args);

export const getFBSTopVariations = (
  args: GetFBWTopVariationsParams
): MerchantAPIRequest<GetFBWTopVariationsParams, GetFBSTopVariationsResponse> =>
  new MerchantAPIRequest("fbs/top-variations", args);

export const fetchInboundGuidance = (
  args: FetchInboundGuidanceParams
): MerchantAPIRequest<
  FetchInboundGuidanceParams,
  FetchInboundGuidanceResponse
> => new MerchantAPIRequest("fbw/shipping-plan/get-inbound-guidance", args);

export const getFBWRecentlySoldVariations = (
  args: GetFBWRecentlySoldVariationsParams
): MerchantAPIRequest<
  GetFBWRecentlySoldVariationsParams,
  FetchRecommendedSKUsResponse
> =>
  new MerchantAPIRequest(
    "fbw/shipping-plan/get-recently-sold-variations",
    args
  );

export const submitShippingPlan = (
  args: SubmitShippingPlanParams
): MerchantAPIRequest<SubmitShippingPlanParams, SubmitShippingPlanResponse> =>
  new MerchantAPIRequest("fbw/multi-shipping-plans/create", args);

export const getShippingPlanById = (
  args: GetShippingPlanByIdParams
): MerchantAPIRequest<GetShippingPlanByIdParams, GetShippingPlanByIdResponse> =>
  new MerchantAPIRequest("fbw/single-shipping-plan/get", args);

export const shippingPlanCreation = (
  args: ShippingPlanCreationParams
): MerchantAPIRequest<
  ShippingPlanCreationParams,
  ShippingPlanCreationResponse
> => new MerchantAPIRequest("fbw/multi-shipping-plans-creation", args);

export const acceptTermsOfService = (): MerchantAPIRequest<{}, {}> =>
  new MerchantAPIRequest("fbw/tos/accept");

export const getShippingPlanByBatchId = (
  args: GetShippingPlanByBatchIdParams
): MerchantAPIRequest<
  GetShippingPlanByBatchIdParams,
  GetShippingPlanByBatchIdResponse
> => new MerchantAPIRequest("fbw/multi-shipping-plans/get", args);

export const updateShippingPlan = (
  args: UpdateShippingPlanParams
): MerchantAPIRequest<UpdateShippingPlanParams, UpdateShippingPlanResponse> =>
  new MerchantAPIRequest("fbw/shipping-plan/update", args);

export const deleteShippingPlan = (
  args: DeleteShippingPlanParams
): MerchantAPIRequest<DeleteShippingPlanParams, DeleteShippingPlanResponse> =>
  new MerchantAPIRequest("fbw/shipping-plan/delete", args);

export const fetchRecommendedSKUs = (
  args: FetchRecommendedSKUsParams
): MerchantAPIRequest<
  FetchRecommendedSKUsParams,
  FetchRecommendedSKUsResponse
> => new MerchantAPIRequest("fbw/shipping-plan/get-recommended-skus", args);

export const getFBWStats = (
  args: GetFBWStatsParams
): MerchantAPIRequest<GetFBWStatsParams, GetFBWStatsResponse> =>
  new MerchantAPIRequest("fbw/all-summary/get", args);

export const getNumLowInventory = (
  args: GetNumLowInventoryParams
): MerchantAPIRequest<GetNumLowInventoryParams, GetNumLowInventoryResponse> =>
  new MerchantAPIRequest("fbw/num-low-inventory", args);

export type FBWWarehousePriority = {
  country_code: CountryCode;
  default_priorities: ReadonlyArray<string>;
  state_priorities: ReadonlyArray<FBWWarehouseStatePriority>;
};

export type FBWWarehouseStatePriority = {
  state_code: string;
  priorities: ReadonlyArray<string>;
};

export type GetFBWWarehousePrioritiesParams = {};

export type GetFBWWarehousePrioritiesResponse = {
  results: ReadonlyArray<FBWWarehousePriority>;
};

export const getFBWWarehousePriorities = (
  args: GetFBWWarehousePrioritiesParams
): MerchantAPIRequest<
  GetFBWWarehousePrioritiesParams,
  GetFBWWarehousePrioritiesResponse
> => {
  return new MerchantAPIRequest("fbw/priorities", args);
};

export type UpdateFBWWarehousePriorityParams = {
  country_priority: string;
};

export type UpdateFBWWarehousePriorityResponse = {};

export const updateFBWWarehousePriority = (
  args: UpdateFBWWarehousePriorityParams
): MerchantAPIRequest<
  UpdateFBWWarehousePriorityParams,
  UpdateFBWWarehousePriorityResponse
> => {
  return new MerchantAPIRequest("fbw/priority/update", args);
};

export type GetSeenFBSIntroductionParams = {};

export type GetSeenFBSIntroductionResponse = {
  readonly seen_fbs_intro: boolean;
};

export const getSeenFBSIntroduction = (
  args: GetSeenFBSIntroductionParams
): MerchantAPIRequest<
  GetSeenFBSIntroductionParams,
  GetSeenFBSIntroductionResponse
> => {
  return new MerchantAPIRequest("fbw/fbs-introduction/seen", args);
};

export type DismissFBSIntroductionParams = {};

export type DismissFBSIntroductionResponse = {
  readonly seen_fbs_intro: boolean;
};

export const dismissFBSIntroduction = (
  args: DismissFBSIntroductionParams
): MerchantAPIRequest<
  DismissFBSIntroductionParams,
  DismissFBSIntroductionResponse
> => {
  return new MerchantAPIRequest("fbw/fbs-introduction/dismiss", args);
};

export type ProductLevelInventory = {
  readonly product_id: string;
  // Field name comes from API.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly product_SKU: string;
  readonly removed: boolean;
  readonly pending: number;
  readonly active: number;
  readonly to_store: number;
  readonly warehouse_id: string;
  readonly warehouse_code: string;
  readonly country_ship_to: ReadonlyArray<CountryCode>;
  readonly shipping_prices: ReadonlyArray<Readonly<ShippingPrice>>;
  readonly shipping_price_range: Readonly<ShippingPriceRange>;
  readonly variation_inventory: ReadonlyArray<VariationLevelInventory>;
};

export type VariationLevelInventory = {
  readonly variation_id: string;
  readonly variation_detail: string;
  // Field name comes from API.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly variation_SKU: string;
  readonly fbw_active: boolean;
  readonly pending: number;
  readonly active: number;
  readonly to_store: number;
  readonly warehouse_id: string;
  readonly warehouse_code: string;
  readonly warehouse_allow_selling: string;
  readonly country_ship_to: ReadonlyArray<string>;
  readonly shipping_prices: ReadonlyArray<Readonly<ShippingPrice>>;
  readonly shipping_price_range: Readonly<ShippingPriceRange>;
};

export type ShippingPrice = {
  readonly country_code: string;
  readonly price: number;
  readonly localized_price: number;
  readonly currency_code: string;
  readonly is_inherited: boolean;
};

export type ShippingPriceRange = {
  readonly min_price: number;
  readonly max_price: number;
  readonly min_localized_price: number;
  readonly max_localized_price: number;
};

export type GetFBWInventoryParams = {
  readonly product_type: string;
  readonly start: number;
  readonly page_size: number;
  readonly search_type?: string;
  readonly search_token?: string;
  readonly warehouses?: ReadonlyArray<string>;
  readonly inventory_status?: ReadonlyArray<string>;
  readonly product_status?: ReadonlyArray<string>;
};

export type GetFBWInventoryResponse = {
  readonly inventory: ReadonlyArray<ProductLevelInventory>;
  readonly merchant_currency: string;
  readonly localized_currency: string;
  readonly number_of_results: number;
};

export const getFBWInventory = (
  args: GetFBWInventoryParams
): MerchantAPIRequest<GetFBWInventoryParams, GetFBWInventoryResponse> => {
  return new MerchantAPIRequest("fbw/fbw-inventories", args);
};

export type GetFBSInventoryParams = {};

export type GetFBSInventoryResponse = {
  readonly inventory: ReadonlyArray<ProductLevelInventory>;
  readonly merchant_currency: string;
  readonly localized_currency: string;
};

export const getFBSInventory = (
  args: GetFBSInventoryParams
): MerchantAPIRequest<GetFBSInventoryParams, GetFBSInventoryResponse> => {
  return new MerchantAPIRequest("fbs/fbs-inventories", args, "GET");
};

export type GetFBWMerchantCurrencyParams = {};

export type GetFBWMerchantCurrencyResponse = {
  readonly merchant_currency: string;
  readonly localized_currency: string;
};

export const getFBWMerchantCurrency = (
  args: GetFBWMerchantCurrencyParams
): MerchantAPIRequest<
  GetFBWMerchantCurrencyParams,
  GetFBWMerchantCurrencyResponse
> => {
  return new MerchantAPIRequest("fbw/merchant-currency", args, "GET");
};

export type GetFBWInventoryShippingPriceParams = {
  readonly warehouse_id: string;
  readonly product_id: string;
  readonly variation_id?: string;
};

export type GetFBWInventoryShippingPriceResponse = {
  readonly shipping_prices: ReadonlyArray<Readonly<ShippingPrice>>;
};

export const getFBWInventoryShippingPrice = (
  args: GetFBWInventoryShippingPriceParams
): MerchantAPIRequest<
  GetFBWInventoryShippingPriceParams,
  GetFBWInventoryShippingPriceResponse
> => {
  return new MerchantAPIRequest("fbw/fbw-inventories/get-shipping-price", args);
};

export type UpdateFBWInventoryShippingPriceParams = {
  readonly warehouse_id: string;
  readonly product_id: string;
  readonly variation_id?: string;
  readonly updates: string;
};

export type UpdateFBWInventoryShippingPriceResponse = {
  readonly updated_inventory: ProductLevelInventory;
};

export const updateFBWInventoryShippingPrice = (
  args: UpdateFBWInventoryShippingPriceParams
): MerchantAPIRequest<
  UpdateFBWInventoryShippingPriceParams,
  UpdateFBWInventoryShippingPriceResponse
> => {
  return new MerchantAPIRequest(
    "fbw/fbw-inventories/update-shipping-price",
    args
  );
};

export type UpdateVariationInventoryStatusParams = {
  readonly warehouse_id: string;
  readonly product_id: string;
  readonly variation_id: string;
  readonly active: boolean;
};

export type UpdateVariationInventoryStatusResponse = {
  readonly updated_inventory: ProductLevelInventory;
};

export const updateVariationInventoryStatus = (
  args: UpdateVariationInventoryStatusParams
): MerchantAPIRequest<
  UpdateVariationInventoryStatusParams,
  UpdateVariationInventoryStatusResponse
> => {
  return new MerchantAPIRequest(
    "fbw/fbw-inventories/update-variation-inventory-status",
    args
  );
};

export type Fee = {
  readonly created_time: string;
  readonly amount: number;
  readonly amount_usd: number;
  readonly fee_name: string;
  readonly fee_type: number;
  readonly warehouse_id: string;
  readonly invoice_status: number;
  readonly currency: string;
  readonly invoice_id?: string;
  readonly localized_currency?: string;
  readonly localized_amount?: number;
  readonly skus?: ReadonlyArray<string>;
  readonly warehouse_code?: string;
  readonly order_id?: string;
  readonly shipping_plan_id?: string;
  readonly fbw_shipping_plan_id?: string;
  readonly weight?: number;
  readonly weight_unit?: string;
};

export type GetFBWFeesParams = {
  start_date?: string;
  end_date?: string;
  order_id?: string;
  sku?: string;
  shipping_plan_id?: string;
  warehouse_code?: string;
  fee_types?: ReadonlyArray<number>;
  fee_statuses?: ReadonlyArray<number>;
  product_type: ProductType;
  start?: number;
  count?: number;
  sort_by_date?: number;
};

export type GetFBWFeesResponse = {
  readonly num_results: number;
  readonly results: ReadonlyArray<Fee>;
  readonly feed_ended: boolean;
  readonly next_offset: number;
};

export type WarehouseAddressForShippingPlan = {
  readonly en_street_address1: string;
  readonly en_city: string;
  readonly en_state: string;
  readonly zipcode: string;
  readonly country_code: string;
};

export type Warehouse = {
  readonly contact_name: string;
  readonly display_name: string;
  readonly phone_number: string;
};

export type Sku = {
  readonly sku: string;
  readonly fbw_sku: string;
  readonly quantity: number;
};

export type ShippingPlanHistory = {
  readonly id: string;
  readonly fbw_shipping_id: string;
  readonly date_created: string;
  readonly delivery_option: DeliveryOption;
  readonly warehouse: Warehouse;
  readonly skus: Array<Sku>;
  readonly state_text: string;
  readonly merchant_next_step_text: string;
  readonly allow_submit_tracking_info: boolean;
  readonly total_quantity: number;
  readonly action_required: boolean;
  readonly processing: boolean;
  readonly submit_failed: boolean;
  readonly can_submit: boolean;
  readonly submitted: boolean;
  readonly time_to_expiry_text: string;
  readonly delivery_method: number;
  readonly delivery_method_name: ShippingPlanMethod;
  readonly tracking_numbers: Array<string>;
};

export type GetShippingPlanHistoryParams = {
  readonly query: string;
  readonly start: number;
  readonly count: number;
  readonly sortKey: string;
  readonly sortDir: number;
  readonly state_filter: string;
  readonly search_type?: string;
  readonly product_type: string;
  readonly created_before?: string;
  readonly id_offset?: string;
};

export type GetShippingPlanHistoryResponse = {
  readonly results: {
    readonly num_results: number;
    readonly rows: ReadonlyArray<ShippingPlanHistory>;
    readonly feed_ended: boolean;
    readonly next_offset: number;
  };
};

export const getFBWFees = (
  args: GetFBWFeesParams
): MerchantAPIRequest<GetFBWFeesParams, GetFBWFeesResponse> => {
  return new MerchantAPIRequest("fbw/view-fees/get", args);
};

export const getFBSFees = (
  args: GetFBWFeesParams
): MerchantAPIRequest<GetFBWFeesParams, GetFBWFeesResponse> => {
  return new MerchantAPIRequest("fbs/view-fees/get", args);
};

export type ExportFBWFeesParams = GetFBWFeesParams;

export type ExportFBWFeesResponse = {
  readonly num_rows: number;
  readonly download?: string;
};

export const exportFBWFees = (
  args: ExportFBWFeesParams
): MerchantAPIRequest<ExportFBWFeesParams, ExportFBWFeesResponse> => {
  return new MerchantAPIRequest("fbw/view-fees/export", args);
};

export const exportFBSFees = (
  args: ExportFBWFeesParams
): MerchantAPIRequest<ExportFBWFeesParams, ExportFBWFeesResponse> => {
  return new MerchantAPIRequest("fbs/view-fees/export", args);
};

export type GetFeeSumParams = {};

export type GetFeeSumResponse = {
  readonly currency_amount_dict: {
    [key: string]: number;
  };
};

export const getFeeSum = (
  args: GetFBWFeesParams
): MerchantAPIRequest<GetFBWFeesParams, GetFeeSumResponse> => {
  return new MerchantAPIRequest("view-fees/sum", args);
};

export const getShippingPlanHistory = (
  args: GetShippingPlanHistoryParams
): MerchantAPIRequest<
  GetShippingPlanHistoryParams,
  GetShippingPlanHistoryResponse
> => {
  return new MerchantAPIRequest("fbw/shipping-plans/get", args);
};

export type GetShippingPlanConstParams = {};

export type ShippingPlanStateText =
  | "DELIVERED"
  | "SCHEDULE_PICKUP"
  | "COMPLETE"
  | "IN_TRANSIT"
  | "DELIVERY_CONFIRMED"
  | "EXPIRED"
  | "DELIVERY_MISMATCH"
  | "PROCESSING"
  | "READY_TO_SHIP"
  | "PREPARE_CASE_LABELS"
  | "SUBMISSION_FAILED"
  | "CANCELLED"
  | "SELECT_SKUS"
  | "PREPARE_BOXES"
  | "READY_TO_SUBMIT"
  | "SHIPPED"
  | "SUBMITTED"
  | "PRINT_LABELS"
  | "SELECT_WAREHOUSE"
  | "PACKAGE_SKUS";

export type ShippingPlanMethod =
  | "DROP_OFF"
  | "PICK_UP"
  | "SHIP_BULK"
  | "SHIP_INDIVIDUAL";

export type ProductType = "FBW" | "FBS";
