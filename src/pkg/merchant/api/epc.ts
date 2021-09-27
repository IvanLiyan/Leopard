/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

type EmptyParams = {};

type RequestSuccess = {
  readonly success: boolean;
};

export type EPCRegionName = "EAST" | "SOUTH";
export const ALLEPCRegions: ReadonlyArray<EPCRegionName> = ["EAST", "SOUTH"];

export type ProductStateInEPC = "ACTIVE" | "QUEUED";
export const AllEPCProductStates: ReadonlyArray<ProductStateInEPC> = [
  "ACTIVE",
  "QUEUED",
];

export type ProductShippingMethod = "SELFDELIVERY" | "PICKUP";

// Product List API
type GetProductListParams = {
  readonly state: ProductStateInEPC;
  readonly warehouse: EPCRegionName;
  readonly offset: number;
  readonly count: number;
};

export type EPCProduct = {
  readonly active_time: null | string;
  readonly remove_time: null | string;
  readonly is_invited?: boolean;
  readonly product_id: string;
};

type GetProductListData = {
  readonly products: ReadonlyArray<EPCProduct>;
};

type EPCEnrollPromoState = {
  readonly show_epc_enroll_promo: boolean;
};

export const getProductList = (
  args: GetProductListParams
): MerchantAPIRequest<GetProductListParams, GetProductListData> =>
  new MerchantAPIRequest("epc/product/list", args);

// Product Counts API
type EPCRegionProductCount = { [region in EPCRegionName]: number };

type GetProductCountData = {
  readonly counts: { [state in ProductStateInEPC]: EPCRegionProductCount };
};

export const getProductCount = (): MerchantAPIRequest<
  EmptyParams,
  GetProductCountData
> => new MerchantAPIRequest("epc/product/count");

// Collection Info API
export type CarrierMap = { [n: number]: string };

type CollectionInfo = {
  [warehouse in EPCRegionName]: ParcelCollectionInfo;
};

export type ParcelCollectionInfo = {
  readonly carriers: ReadonlyArray<number>;
  readonly address: string;
  readonly city: string;
  readonly province: string;
  readonly self_delivery_warehouse: ReadonlyArray<EPCRegionName>;
  readonly warehouse: EPCRegionName;
};

type GetCollectionInfoData = {
  readonly collection_info: CollectionInfo;
  readonly carriers_dict: CarrierMap;
};

export const getCollectionInfo = (): MerchantAPIRequest<
  EmptyParams,
  GetCollectionInfoData
> => new MerchantAPIRequest("epc/collection-info/get");

type SetCollectionInfoParams = {
  readonly carriers: string;
  readonly address: string;
  readonly city: string;
  readonly province: string;
  readonly self_delivery_warehouse: string;
  readonly warehouse: EPCRegionName;
};

export const setCollectionInfo = (
  args: SetCollectionInfoParams
): MerchantAPIRequest<SetCollectionInfoParams, RequestSuccess> =>
  new MerchantAPIRequest("epc/collection-info/set", args);

// Enroll/Verify Products API

type UpdateProductsResponse = {
  readonly success: ReadonlyArray<string>;
  readonly failed: ReadonlyArray<string>;
};

type VerifyProductsParams = {
  readonly product_ids: string;
  readonly warehouse: EPCRegionName;
};

type VerifyProductsResponse = {
  readonly to_enroll: ReadonlyArray<string>;
  readonly active: ReadonlyArray<string>;
  readonly failed: ReadonlyArray<string>;
  readonly queued: ReadonlyArray<string>;
};

export const verifyProducts = (
  args: VerifyProductsParams
): MerchantAPIRequest<VerifyProductsParams, VerifyProductsResponse> =>
  new MerchantAPIRequest("epc/product/verify", args);

type EnrollProductsParams = {
  readonly product_ids: string;
  readonly warehouse: EPCRegionName;
};

export const enrollProducts = (
  args: EnrollProductsParams
): MerchantAPIRequest<EnrollProductsParams, UpdateProductsResponse> =>
  new MerchantAPIRequest("epc/product/enroll", args);

// Update Product State APIs
type UpdateProductStateParams = {
  readonly product_id: string;
  readonly warehouse: EPCRegionName;
  readonly remove_survey?: null | string;
};

export const removeProduct = (
  args: UpdateProductStateParams
): MerchantAPIRequest<UpdateProductStateParams, RequestSuccess> =>
  new MerchantAPIRequest("epc/product/remove", args);

export const undoRemoveProduct = (
  args: UpdateProductStateParams
): MerchantAPIRequest<UpdateProductStateParams, RequestSuccess> =>
  new MerchantAPIRequest("epc/product/remove/undo", args);

export const cancelEnrollProduct = (
  args: UpdateProductStateParams
): MerchantAPIRequest<UpdateProductStateParams, RequestSuccess> =>
  new MerchantAPIRequest("epc/product/enroll/cancel", args);

// EPC Benefit Banner API
export const removeEPCBenefitIcon = (): MerchantAPIRequest<
  EmptyParams,
  RequestSuccess
> => new MerchantAPIRequest("epc/hide-enroll-promo");

export const getEPCEnrollPromoState = (): MerchantAPIRequest<
  EmptyParams,
  EPCEnrollPromoState
> => new MerchantAPIRequest("epc/enroll-promo/state/get");

// uncombine
type UncombineOrderParams = {
  readonly reason?: UncombineReason;
  readonly merchant_transaction_id: string;
  readonly message?: string;
  readonly remove_product?: boolean;
};
// sweeper/merchant_dashboard/model/epc_combine_order/epc_product_filter.py
export type UncombineReason =
  | "OVERSEAS_INVENTORY"
  | "UNSUPPORTED"
  | "OVERWEIGHT"
  | "OVERSIZE"
  | "OTHER_INELIGIBLE";

export const uncombineAplusOrder = (
  args: UncombineOrderParams
): MerchantAPIRequest<UncombineOrderParams, RequestSuccess> =>
  new MerchantAPIRequest("transaction/uncombine-aplus-order", args);
