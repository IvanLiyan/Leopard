/* Lego Components */
import { SortOrder } from "@ContextLogic/lego";

/* Merchant Components */
import { TableData } from "@merchant/component/payments/details/PaymentDetailsTable";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

type TransactionReq = {
  readonly page: number;
  readonly type: string;
  readonly pid: string;
  readonly order: SortOrder;
  readonly sort: string;
  readonly date_from?: string;
  readonly date_to?: string;
  readonly ids_to_filter?: string;
  readonly refund_perc_from: number | null | undefined;
  readonly refund_perc_to: number | null | undefined;
};

export type TransactionRow = {
  readonly date: string;
  readonly id: string;
  readonly quantity: number;
  readonly currency_code: string;
  readonly price: string;
  readonly shipping: string;
  readonly cost: string;
  readonly shipping_cost: string;
  readonly total: string;
  readonly is_new_refund: boolean;
  readonly refunded_amount: number;
  readonly refunded_amount_with_wishpost: number;
  readonly cost_of_refund: number;
  readonly responsibility: number;
  readonly refund_percent: number;
  readonly responsible_amount: number;
  readonly responsible_amount_with_wishpost: number;
  readonly refund_cost: number;
  readonly wish_express_rebate: number;
  readonly show_tax: boolean;
  readonly paid_tax_amount: number;
  readonly deducted_tax_amount: number;
  readonly paid_amount: number;
  readonly deducted_amount: number;
  readonly state: string;
  readonly is_partial_quantity_refunded: boolean;
  readonly refunded_quantity: number;
  readonly is_partial_amount_refunded: boolean;
  readonly refunded_percentage_formatted: string;
  readonly eligible_for_epc_fast_payment: boolean;
  readonly advanced_logistics: boolean;
  readonly is_unity_order: boolean;
  readonly unity_wishpost_shipping: number;
  readonly original_rev_share?: number | null | undefined;
  readonly updated_rev_share?: number | null | undefined;
  readonly calculated_rev_share?: number | null | undefined;
};

type WithheldReq = {
  readonly page: number;
  readonly type: string;
  readonly pid: string;
  readonly order: SortOrder;
  readonly sort: string;
};

export type WithheldRow = {
  readonly date: string;
  readonly id: string;
  readonly withhold_reason: string | null | undefined;
  readonly currency_code: string;
  readonly withheld_amount: number;
  readonly withheld_tax_amount: number;
  readonly show_tax: boolean;
};

type ReleasedReq = {
  readonly page: number;
  readonly type: string;
  readonly pid: string;
  readonly order: SortOrder;
  readonly sort: string;
};

export type ReleasedRow = {
  readonly date: string;
  readonly id: string;
  readonly withhold_reason: string | null | undefined;
  readonly currency_code: string;
  readonly withheld_released_amount: number;
  readonly withheld_released_tax_amount: number;
  readonly show_tax: boolean;
};

type OneoffReq = {
  readonly pid: string;
};

export type OneoffRow = {
  readonly date: string;
  readonly id: string;
  readonly reason: string;
  readonly currency: string;
  readonly localized_amount: number;
};

type FineReq = {
  readonly pid: string;
};

type FineData = {
  readonly results_fee: ReadonlyArray<FineRow>;
  readonly results_fine: ReadonlyArray<FineRow>;
  readonly show_local_currency: boolean;
  readonly num_results: number;
};

export type FineRow = {
  readonly date: string;
  readonly id: string;
  readonly reason: string;
  readonly currency: string;
  readonly localized_amount: number;
};

export const getFines = (
  args: FineReq
): MerchantAPIRequest<FineReq, FineData> =>
  new MerchantAPIRequest("fine-detail/get", args);

export const getOneoff = (
  args: OneoffReq
): MerchantAPIRequest<OneoffReq, TableData<OneoffRow>> =>
  new MerchantAPIRequest("oneoff-payment-detail/get", args);

export const getReleased = (
  args: ReleasedReq
): MerchantAPIRequest<ReleasedReq, TableData<ReleasedRow>> =>
  new MerchantAPIRequest("transaction-payment-detail/get", args);

export const getWithheld = (
  args: WithheldReq
): MerchantAPIRequest<WithheldReq, TableData<WithheldRow>> =>
  new MerchantAPIRequest("transaction-payment-detail/get", args);

export const getTransactions = (
  args: TransactionReq
): MerchantAPIRequest<TransactionReq, TableData<TransactionRow>> =>
  new MerchantAPIRequest("transaction-payment-detail/get", args);
