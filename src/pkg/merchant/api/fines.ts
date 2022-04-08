/* Merchant API */
import { ShippingDetails, MerchantTransaction } from "@merchant/api/orders";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type FineDisputeStatus =
  | "SUBMITTED"
  | "APPROVED"
  | "DECLINED"
  | "CANCELLED";

export type GetOrderFinesParams = {
  readonly count?: number | null | undefined;
  readonly offset?: number | null | undefined;
  readonly fine_types?: string | null | undefined;
  readonly transaction_id?: string | null | undefined;
  readonly dispute_statuses?: string | null | undefined;
};

export type FineSpec = {
  readonly id: string;
  readonly name: string;
  readonly enum_name: string;
  readonly disputable: boolean;
  readonly days_to_dispute: number | null | undefined;
  readonly is_wish_express: boolean;
  readonly policy_explanation: string;
  readonly is_transaction_fine: boolean;
};

export type MerchantFine = {
  readonly is_exempt: boolean | null | undefined;
  readonly fine_exempt_paragraphs: ReadonlyArray<string> | null | undefined;
  readonly fine_exempt_info_link_dict:
    | {
        readonly info_link: string;
        readonly link_type: string;
      }
    | null
    | undefined;
  readonly is_late_confirmed_fulfillment_fine: boolean | null | undefined;
  readonly localized_initial_amount: number | null | undefined;
  readonly localized_amount: number | null | undefined;
  readonly currency: string;
  readonly dispute_open_deadline: string;
  // Field name comes from API.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly is_fake_tracking_fine: boolean | null | undefined;
  readonly is_cancellation_fine: boolean | null | undefined;
};

export type FineDisplayItem = {
  readonly fine_amount: number;
  readonly message: string;
  readonly reason: number;
  readonly fine_spec: FineSpec;
  readonly transaction: MerchantTransaction;
  readonly transaction_id: string;
  readonly transaction_release_time: string;
  readonly shipping_details?: ShippingDetails | null | undefined;
  readonly localized_currency: string;
  readonly is_reversed?: boolean;
  readonly localized_amount: number;
  readonly is_tracking_fine: boolean;
  readonly dispute_deadline: number | null | undefined;
  readonly create_dispute_url: string | null | undefined;
  readonly dispute_id: string | null | undefined;
  readonly merchant_fine?: MerchantFine | null | undefined;
  // Date in format MM-DD-YYYY
  readonly dispute_approved_deadline?: string | null | undefined;
};

export type OrderFinesResponse = {
  readonly has_more: boolean;
  readonly total_count: number;
  readonly end: number;
  readonly results: ReadonlyArray<FineDisplayItem>;
};

export type GetFinesMetadataParams = {};

export type GetFinesMetadataResponse = {
  readonly fine_types: ReadonlyArray<FineSpec>;
};

export const getOrderFines = (
  args: GetOrderFinesParams
): MerchantAPIRequest<GetOrderFinesParams, OrderFinesResponse> =>
  new MerchantAPIRequest("fines/orders", args);

export const getFinesMetadata = (
  args: GetFinesMetadataParams
): MerchantAPIRequest<GetFinesMetadataParams, GetFinesMetadataResponse> =>
  new MerchantAPIRequest("fines/metadata", args);
