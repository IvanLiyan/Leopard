/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";

/* Merchant API */
import {
  CommerceTransaction,
  CommerceTransactionRefund,
} from "@merchant/api/transactions";
import { TrackingDispute } from "@merchant/api/disputes";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type TransactionState =
  | "PENDING"
  | "APPROVED"
  | "ACKNOWLEDGED"
  | "SHIPPED"
  | "DECLINED"
  | "REFUNDED"
  | "C2C_ON_DELIVERY"
  | "C2C_DELIVERED"
  | "C2C_ACCEPTED"
  | "EXCEPTION"
  | "GIFT_WAITING_FOR_ACCEPT"
  | "REQUIRE_REVIEW"
  | "DELAYING"
  | "LABEL_GENERATED"
  | "LABEL_DOWNLOADED";

// Maps to ShippingDetails.to_dict().
// Add more attributes as needed
export type ShippingDetails = {
  readonly country_code: string;
  readonly name?: string | null | undefined;
  readonly street_address1: string;
  readonly street_address2?: string | null | undefined;
  readonly city: string;
  readonly state?: string | null | undefined;
  readonly zipcode?: string | null | undefined;
  readonly country: string;
  readonly phone_number?: string | null | undefined;
  readonly provider?: string | null | undefined;
  readonly tracking_id?: string | null | undefined;
  readonly neighborhood?: string | null | undefined;
  readonly is_delivered?: boolean;
  readonly tracking_confirmed?: boolean;
  readonly tracking_confirmed_time?: string | null | undefined;
  readonly is_tracking_valid?: boolean;
};

export type PaymentDetailDict = {
  readonly is_delivered: boolean;
  readonly carrier_tier: number | null | undefined;
  readonly show_carrier_tier?: boolean;
  readonly other_payment_deduction: boolean;
  readonly payment_state: number;
  readonly next_payment_date: string;
  readonly merchant_payment_id?: string;
};

// Maps to OrderTrackingInfo.to_dict().
// Add more attributes as needed
export type TrackingInfo = {
  readonly status: string;
  readonly tracking_id: string | null | undefined;
  readonly confirmed_fulfillment_date: string | null | undefined;
  readonly confirmed_fulfillment_days_ago: number | null | undefined;
  readonly delivered_date: string | null | undefined;
  readonly delivered_days_ago: number | null | undefined;
  readonly checkpoints: ReadonlyArray<AftershipCheckpoint> | null | undefined;
  readonly last_update: string | null | undefined;
  readonly days_since_update: number | null | undefined;
};

export type AftershipCheckpoint = {
  readonly aftership_state: number;
  readonly city?: string | null | undefined;
  readonly country?: string | null | undefined;
  readonly country_name?: string | null | undefined;
  readonly date: string;
  readonly date_utc_format: string;
  readonly days_ago: number;
  readonly is_translated: boolean;
  readonly latitude?: string | null | undefined;
  readonly longitude?: string | null | undefined;
  readonly message: string;
  readonly state?: string | null | undefined;
  readonly status: string;
  readonly zipcode?: string | null | undefined;
};

// Maps to PastTrackingInfo.to_dict().
// Add more attributes as needed
export type PastTrackingInfo = {
  old_tracking_id: string;
  old_provider_id: number | null | undefined;
  old_provider: string | null | undefined;
  last_updated_str: string;
  modified_after_lcf_fine: boolean;
};

// Maps to MerchantTransaction.to_dict().
// Add more attributes as needed
export type MerchantTransaction = {
  readonly id: string;
  readonly date: string;
  readonly state: TransactionState;
  readonly is_wish_express: boolean;
  readonly transaction_id: string;
  readonly shipping_details: ShippingDetails | null | undefined;
  readonly is_wish_express_late_arrival?: boolean;
  readonly confirmed_fulfillment_hours_requirement: number;
  readonly country_code: string | null | undefined;
  readonly total: number;
  readonly refunded_time?: string | null | undefined;
  readonly confirmed_fulfillment_hours?: number | null | undefined;
  readonly available_for_fulfillment_time?: string | null | undefined;
  readonly max_ttd?: number | null | undefined;
  readonly business_days_to_arrival?: number | null | undefined;
  readonly wish_express_extension_days?: number | null | undefined;
  readonly past_tracking_info: PastTrackingInfo;
  readonly localized_total: number;
  readonly localized_total_with_wishpost: number;
  readonly currency_code: CurrencyCode;
};

export type GetOrderStatusParams = {
  readonly mtid: string;
};

export type OrderStatusResponse = {
  readonly item: OrderStatusItemDict;
  readonly mtransaction: OrderStatusMTransaction;
  readonly ctransaction: OrderStatusCTransaction;
  readonly ctransaction_refund: CommerceTransactionRefund;
  readonly show_tax?: boolean;
  readonly show_refund_type?: boolean;
  readonly correct_final_price_switch: boolean;
};

export type OrderStatusItemDict = {
  readonly state: TransactionState;
  readonly merchant_id: string;
  readonly merchant_name: string;
  readonly payment_info: PaymentDetailDict;
  readonly return_detail_id: string | null | undefined;
  readonly tracking_info?: TrackingInfo | null | undefined;
  readonly return_label_fee_amount: number | null | undefined;
  readonly refunded_time: string | null | undefined;
  readonly reason: string | null | undefined;
  readonly refunded_state: string | null | undefined;
  readonly refund_reason_text: string | null | undefined;
  readonly refund_flavour_text: string | null | undefined;
  readonly dada_info: OrderStatusDadaInfo | null | undefined;
  readonly shipped_date: string | null | undefined;
  readonly shipped_days_ago: number | null | undefined;
  readonly wish_express_info: OrderStatusWishExpressInfoDict | null | undefined;
  readonly is_wish_express: boolean;
  readonly refunded_by: string | null | undefined;
  readonly days_to_door: number | null | undefined;
  readonly min_ship_time: number | null | undefined;
  readonly max_ship_time: number | null | undefined;
  readonly max_ship_date: string | null | undefined;
  readonly days_since_max_ship_date: string | null | undefined;
  readonly delivery_guarantee_date: string | null | undefined;
  readonly days_since_delivery_guarantee_date: string | null | undefined;
  readonly is_fbw: boolean | null | undefined;
  readonly provider_site: string | null | undefined;
  readonly provider: string | null | undefined;
  readonly provider_name: string | null | undefined;
  readonly shipping_details: ShippingDetails | null | undefined;
  readonly image_url: string;
  readonly name: string;
  readonly is_blue_fusion: boolean;
  readonly pickup_now_inventory_type: string | null | undefined;
  readonly is_ltd_product: boolean;
  readonly price: number;
  readonly shipping_total: number;
  readonly quantity: number;
  readonly merchant_price: number;
  readonly merchant_source_currency: string;
  readonly merchant_shipping: number;
  readonly manufacturer_id: string | null | undefined;
  readonly color: string | null | undefined;
  readonly size: string | null | undefined;
  readonly variation_id: string;
  readonly merchant_display_name: string;
  readonly store_id: string | null | undefined;
  readonly is_order_rerouted: boolean;
  readonly is_limbo_not_routed: boolean;
  readonly is_limbo_routed: boolean;
  readonly is_swap: boolean;
  readonly orig_order_id: string | null | undefined;
  readonly order_id: string | null | undefined;
};

// This oneoff dict is terrible and is a prime target
// for deprecation. The order status API should be
// returning mt.to_dict() which maps to the `MerchantTransaction` type
// instead of creating one oneoff.
export type OrderStatusMTransaction = {
  readonly id: string;
  readonly state: TransactionState;
  readonly tracking_dispute: TrackingDispute | null | undefined;
  readonly is_value_order: boolean;
  readonly wish_express_extension_days: number | null | undefined;
  readonly final_price_info?:
    | {
        readonly final_product_price: number;
        readonly final_shipping_price: number;
        readonly final_product_price_total: number;
        readonly final_shipping_price_total: number;
        readonly final_total: number;
        readonly final_price_currency: string;
        readonly final_price_currency_full: string;
      }
    | null
    | undefined;
  readonly requires_delivered_duty_paid: boolean;
  readonly routed: boolean;
  readonly is_norway_vat_order: boolean;
  readonly refunded_state: string | null | undefined;
  readonly norway_vat_number: string | null | undefined;
  readonly eligible_for_epc_fast_payment_if_arrive_on_time: boolean;
  readonly advanced_logistics: boolean;
  readonly combined_order_id: string | null | undefined;
  readonly combined_epc_warehouse_code: number | null | undefined;
  readonly combined_epc_warehouse_name: string | null | undefined;
  readonly in_refund_limbo: boolean;
};

export type OrderStatusCTransaction = CommerceTransaction & {
  readonly user_info:
    | {
        email: string;
        login_method: string | null | undefined;
      }
    | null
    | undefined;
  client: string | null | undefined;
};

export type OrderStatusWishExpressInfoDict = {
  readonly dest_country: string;
  readonly country_name: string;
  readonly confirmed_shipped: boolean;
  readonly is_shipped_in_time: boolean;
  readonly confirmed_delivered: boolean;
  readonly is_delivered_in_time: boolean;
  readonly ttd_working_days: number;
  readonly target_ttd_working_days: number;
};

export type OrderStatusDadaInfo = {
  readonly dest_country: string;
  readonly country_name: string;
  readonly merchant_total: number;
  readonly shipped: boolean;
  readonly provider_name: string | null | undefined;
  readonly is_qualified: boolean;
  readonly confirmed_shipped: boolean;
  readonly days_to_shipped: number | null | undefined;
  readonly is_shipped_in_time: boolean;
  readonly confirmed_delivered: boolean;
  readonly days_to_delivered: number | null | undefined;
  readonly is_delivered_in_time: boolean;
  readonly dada_incentive: boolean;
  readonly show_incentive_program: boolean;
  readonly policy_days_to_confirmed_shipped: number;
  readonly policy_days_to_confirmed_delivered: number;
};

export const getOrderStatus = (
  args: GetOrderStatusParams
): MerchantAPIRequest<GetOrderStatusParams, OrderStatusResponse> =>
  new MerchantAPIRequest("transaction/status", args);
