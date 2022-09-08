/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

type RequestSuccess = {
  readonly success: boolean;
};

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
