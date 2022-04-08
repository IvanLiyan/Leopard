/* Merchant API */
import { ShippingDetails } from "@merchant/api/orders";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

// Maps to CommerceTransactionRefund.to_dict().
// Add more attributes as needed
export type CommerceTransactionRefund = {
  readonly is_partial_amount_refunded: boolean;
  readonly refunded_quantity: number;
  readonly refunded_percentage: number;
};

export type LocalizedAmount = {
  readonly localized_value: number;
  readonly currency_code: string;
};

// Maps to CommerceTransaction.to_dict().
// Add more attributes as needed
export type CommerceTransaction = {
  readonly id: string;
  readonly items: ReadonlyArray<CommerceTransactionItem>;
  readonly ticket_id: string | null | undefined;
  readonly ticket_label_color: string | null | undefined;
  readonly ticket_label_text: string | null | undefined;
  readonly time: string;
  readonly released_date: string;
  readonly total: number;
  readonly currency_code: string;
  readonly user_id: string;
  readonly payment_type: string;
  readonly payment_id: string;
  readonly state: string;
  readonly subtotal: number;
  readonly shipping: number;
  readonly shipping_details: ShippingDetails;
  readonly localized_subtotal: LocalizedAmount;
  readonly localized_shipping: LocalizedAmount;
  readonly localized_total: LocalizedAmount;
};

// Maps to CommerceTransactionItem.to_dict().
// Add more attributes as needed
export type CommerceTransactionItem = {
  readonly variation_id: string;
  readonly product_id: string;
  readonly name: string;
  readonly shipping_details: ShippingDetails;
  readonly store_id: string;
  readonly is_blue_fusion: boolean;
  readonly is_wish_express: boolean;
  readonly is_fbw: boolean;
  readonly pickup_now_inventory_type: string;
  readonly is_ltd_product: boolean;
  readonly item_total: number;
  readonly quantity: number;
  readonly size: string;
  readonly color: string;
  readonly merchant_transaction_id: string;
  readonly merchant_display_name: string;
  readonly state: string;
};

export type GetTransactionStatusParams = {
  readonly tid: string;
};

// Maps to return type of CommerceTicket.get_tickets_info().
// Add more attributes as needed
export type CommerceTicket = {
  readonly id: string;
  readonly subject: string;
  readonly close_date: string;
  readonly closed_by: string;
  readonly replies: ReadonlyArray<{
    readonly message: string;
    readonly sender: string;
    readonly date: string;
  }>;
  readonly label: string;
  readonly is_closed: string;
  readonly open_date: string;
};

export type TransactionStatusResponse = {
  readonly transaction: CommerceTransaction;
  readonly tickets: ReadonlyArray<CommerceTicket>;
  readonly user: {
    readonly verified: boolean;
    readonly login_method: string;
  };
};

export const getTransactionStatus = (
  args: GetTransactionStatusParams
): MerchantAPIRequest<GetTransactionStatusParams, TransactionStatusResponse> =>
  new MerchantAPIRequest("full-transaction/detail", args);

export type RequestAddressVerificationParams = {
  readonly mtid: string; // merchant transaction ID (order ID)
};

export type RequestAddressVerificationResponse = {};

export const requestAddressVerification = (
  args: RequestAddressVerificationParams
): MerchantAPIRequest<
  RequestAddressVerificationParams,
  RequestAddressVerificationResponse
> => new MerchantAPIRequest("transaction/edit-verification-state", args);
