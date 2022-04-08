/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

/* Type Imports */
import { TrademarkCountryCode } from "@schema/types";
import { TrademarkType } from "@merchant/model/brand/branded-products/IntellectualPropertyInfoState";

// submitTrueBrandRequest is used by merchants to request Wish to add a new new brand

export type SellerType = "BRAND_OWNER" | "RESELLER";

export type SubmitTrueBrandRequestParams = {
  readonly brand_name: string;
  readonly brand_logo_url: string;
  readonly product_packaging_images: string;
  readonly brand_url: string;
  readonly merchant_notes?: string;
  readonly has_registered_trademark: boolean | undefined;
  readonly seller_type: SellerType | undefined;
};

export type SubmitTrueBrandRequestResponse = {
  readonly success: boolean;
};

export const submitTrueBrandRequest = (
  args: SubmitTrueBrandRequestParams
): MerchantAPIRequest<
  SubmitTrueBrandRequestParams,
  SubmitTrueBrandRequestResponse
> => new MerchantAPIRequest("brand-request/submit", args);

export type IntellectualPropertyInfo = {
  readonly trademark_type: TrademarkType | null;
  readonly trademark_number: string | null;
  readonly trademark_office: TrademarkCountryCode | null;
  readonly trademark_doc_url: string | null;
  readonly trademark_url: string | null;
};

export type SubmitIntellectualPropertyInfoParams = IntellectualPropertyInfo & {
  readonly request_id: string;
};

export type SubmitIntellectualPropertyInfoResponse = {
  readonly success: boolean;
};

export const submitIntellectualPropertyInfo = (
  args: SubmitIntellectualPropertyInfoParams
): MerchantAPIRequest<
  SubmitIntellectualPropertyInfoParams,
  SubmitIntellectualPropertyInfoResponse
> =>
  new MerchantAPIRequest(
    "brand-request/intellectual-property-info/submit",
    args
  );

// merchantGetTrueBrandRequests is used by merchants to view their existing / historical true brand requests
export type FileSchema = {
  readonly url: string;
  readonly filename: string;
};

export type MerchantGetTrueBrandRequestsParams = {
  readonly count: number;
  readonly offset: number;
};
export type TrueBrandRequestState =
  | "PENDING_REVIEW"
  | "COMPLETED"
  | "REJECTED"
  | "RESUBMIT"
  | "RESUBMIT_PENDING_REVIEW";
export type MerchantTrueBrandRequestObject = {
  readonly id: string;
  readonly date_requested: number;
  readonly date_resubmitted: number | null | undefined;
  readonly brand_name: string;
  readonly brand_url: string;
  readonly brand_logo_url: string | null | undefined;
  readonly product_packaging_images: ReadonlyArray<FileSchema>;
  readonly merchant_notes: string;
  readonly state: TrueBrandRequestState;
  readonly admin_notes?: string;
  readonly brand_id?: string;
  readonly approved_brand_name?: string;
  readonly approved_brand_logo_url?: string;
  readonly brand_logo_file_url: string | null | undefined;
};
export type MerchantGetTrueBrandRequestsResponse = {
  readonly requests: ReadonlyArray<MerchantTrueBrandRequestObject>;
  readonly total: number;
};

export const merchantGetTrueBrandRequests = (
  args: MerchantGetTrueBrandRequestsParams
): MerchantAPIRequest<
  MerchantGetTrueBrandRequestsParams,
  MerchantGetTrueBrandRequestsResponse
> => new MerchantAPIRequest("my-brand-requests/get", args);

// getABSBrands is used by merchants to get the list of authentic brands

export type GetABSBrandsResp = {
  readonly brands: ReadonlyArray<string>;
};

export const getABSBrands = (): MerchantAPIRequest<{}, GetABSBrandsResp> =>
  new MerchantAPIRequest("brand-directory/abs-brands/get");
