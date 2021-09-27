/* Lego Components */
import { Option } from "@ContextLogic/lego";

/* Merchant Components */
import { PaymentMessageProps } from "@merchant/component/payments/account-balance/AccountBalancePaymentMessage";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type AccountBalances = {
  readonly [currency: string]: {
    readonly CONFIRMED: string;
    readonly PENDING: string;
  };
};

export type Enum = { [key: string]: number };

export type BalanceData = PaymentMessageProps & {
  readonly id_types: ReadonlyArray<Option<string>>;
  readonly funds_frozen: boolean;
  readonly show_tfa_link: boolean;
  readonly show_set_payment_tip: boolean;
  readonly is_main_account: boolean;
  readonly account_balances: AccountBalances;
  readonly line_item_type_enum: any;
  readonly fine_type_enum: any;
  readonly line_item_filter_types: ReadonlyArray<Option<number>>;
};

export type LineItemsArgs = {
  readonly start: number;
  readonly count: number;
  readonly merchant_id: string;
  readonly confirmed: boolean;
  readonly currency: string;
  readonly item_types: string;
  readonly id_type: string;
  readonly id_val: string;
  readonly start_date: string;
  readonly end_date: string;
};

// Incomplete type for LineItem.to_dict()
// Only the fields required for LineItemTable
export type LineItem = {
  readonly amount: number;
  readonly item_type: number; // Enum
  readonly id: string;
  // Nullable properties
  readonly campaign_id: string | undefined;
  readonly dispute_id: string | undefined;
  readonly fbw_cost: number | undefined;
  readonly fbw_invoice_id: string | undefined;
  readonly fbw_quantity: number | undefined;
  readonly fbw_sku: string | undefined;
  readonly fine_id: string | undefined;
  readonly max_quantity: number | undefined;
  readonly merchant_oneoff_payment_id: string | undefined;
  readonly merchant_payment_id: string | undefined;
  readonly note: string | undefined;
  order_id: string;
  readonly rebate_end_time: string | undefined;
  readonly rebate_start_time: string | undefined;
  readonly refund_quantity: number | undefined;
  readonly return_detail_id: string | undefined;
  readonly warning_id: string | undefined;
  readonly withhold_reason: number | undefined;
  // Possibly void properties
  readonly start_date: string | undefined;
  readonly end_date: string | undefined;
  readonly logistic_provider_name: string | undefined;
  readonly logistic_option_name: string | undefined;
  readonly product_boost_product_id: string | undefined;
  readonly is_partial_reverse: boolean;
  readonly has_tracking_dispute: boolean;
};

// Incomplete type for MerchantFine.to_dict()
// Only the fields required for LineItemTable
type MerchantFine = {
  readonly order_id: string;
  readonly fine_type: number; // Enum
  readonly delayed_deduction_disbursement_date: string;
  readonly localized_amount: number;
  readonly plp_fee_start_date: string;
};

export type LineItemsResp = {
  readonly total_count: number;
  readonly results: ReadonlyArray<LineItem>;
  readonly has_more: boolean;
  readonly fines: {
    readonly [fineId: string]: MerchantFine | undefined;
  };
  readonly se_cash_order_info: {
    readonly [mtId: string]:
      | {
          readonly se_cashback_payment_id: string;
          readonly se_cashback_fine_id: string;
        }
      | undefined;
  };
};

export const getLineItems = (
  args: LineItemsArgs,
): MerchantAPIRequest<LineItemsArgs, LineItemsResp> =>
  new MerchantAPIRequest("line-item/get", args);

export const getAccountBalance = (): MerchantAPIRequest<any, BalanceData> =>
  new MerchantAPIRequest("get_account_balance");
