/* Merchant API */
import { MerchantTransaction, PastTrackingInfo } from "@merchant/api/orders";
import { MerchantFine } from "@merchant/api/fines";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type TrackingDisputeState =
  | "AWAITING_ADMIN"
  | "AWAITING_MERCHANT"
  | "APPROVED"
  | "DECLINED"
  | "CANCELLED";

export type TrackingDispute = {
  id: string;
  state_name: TrackingDisputeState;
};

// BE handler require diff format
type NormalTrackingDisputeParams = {
  readonly dispute_type: "lcp";
  readonly order_id: string;
  readonly link: string;
  // JSON string of upload data
  readonly screenshot_file: string;

  readonly reported_fulfillment_date: string;
  readonly reported_delivered_date: string;
  readonly reported_country?: string | null | undefined;
  readonly reported_state?: string | null | undefined;
  readonly request_wfp?: boolean;
};

type WETrackingDisputeParams = {
  readonly dispute_type: "we";
  readonly order_id: string;
  readonly link: string;
  // JSON string of upload data
  readonly screenshot_file: string;
  readonly new_we_reason: string;
  readonly new_we_disaster_timepoint?: string | null | undefined;
  readonly extra_notes: string;
  readonly request_wfp?: boolean;
};

type FakeTrackingFineDisputeParams = {
  readonly link: string;
  readonly order_id: string;
  // JSON string of upload data
  readonly screenshot_file: string;
  readonly request_fine_reverse?: boolean | null | undefined;
  readonly request_fine_uc?: boolean | null | undefined;
  // JSON string
  readonly shipping_label: string;
  // JSON string
  readonly log_invoice: string;
  // JSON string
  readonly package_pic: string;
  // JSON string
  readonly support_doc?: string | null | undefined;
};

type OrderCancellationFineDisputeParams = {
  readonly order_id: string;
  readonly request_cancel_fine_dispute: boolean;
  // JSON string
  readonly customer_addr_proof: string;
  // JSON string
  readonly invalid_address_proof: string;
  readonly cancel_reason: string;
  readonly other_reason?: string | null | undefined;

  // back-compatible with BE handler params
  readonly customer_street1: string;
  readonly customer_street2: string | null | undefined;
  readonly customer_city: string;
  readonly customer_state: string | null | undefined;
  readonly customer_country: string;
  readonly customer_zipcode: string | null | undefined;
};

export type SubmitTrackingDisputeParams =
  | NormalTrackingDisputeParams
  | WETrackingDisputeParams
  | FakeTrackingFineDisputeParams
  | OrderCancellationFineDisputeParams;

export type SubmitTrackingDisputeResponse = {
  readonly tracking_dispute_id: string;
};

export type MisleadingVariationDisputeParams = {
  readonly warning_id: string;
  readonly product_category: string | null | undefined;
  readonly product_subcategory: string | null | undefined;
  readonly variation_belong_reason: string | null | undefined;
  readonly variation_policy_reason: string | null | undefined;
  // JSON string
  readonly support_files_str: string;
};

export type SubmitMisleadingVariationDisputeParamsResponse = {
  readonly warning_id: string;
};

export const submitTrackingDispute = (
  args: SubmitTrackingDisputeParams
): MerchantAPIRequest<
  SubmitTrackingDisputeParams,
  SubmitTrackingDisputeResponse
> => new MerchantAPIRequest("tracking-dispute-form/submit", args);

export const submitMisleadingVariationDispute = (
  args: MisleadingVariationDisputeParams
): MerchantAPIRequest<
  MisleadingVariationDisputeParams,
  SubmitMisleadingVariationDisputeParamsResponse
> => new MerchantAPIRequest("misleading-variation-dispute/submit", args);

export type GetTrackingDisputeFormParams = {
  readonly order_id: string;
  readonly dispute_type: string;
};

export type TrackingDisputeDetail = {
  readonly id: string;
  readonly state: number;
  readonly state_name: string;
  readonly merchant_id: string;
  readonly order_id: string;
  readonly create_date: string;
  readonly claimed: string;
  readonly claimed_time: string;
  readonly link: string;
  readonly reported_fulfillment_date: string;
  readonly reported_delivered_date: string;
  readonly reported_state: string;
  readonly reported_country: string;
  readonly wish_express_dispute_reason: string;
  readonly wish_express_disaster_timepoint: string;
  readonly extra_notes: string;
  readonly is_wish_express_late: boolean;
  readonly request_fine_reverse: boolean;
  readonly request_cancel_fine_dispute: boolean;
  readonly tracking_id: string;
  readonly state_before_approve: string;
  readonly country_before_approve: string;
  readonly last_update: string;
  readonly is_closed: boolean;
  readonly date_since_awaiting_admin: string;
};

export type TrackingDisputeFormInfo = {
  readonly tracking_dispute_enable_time: string | null | undefined;
  readonly deliver_expected_deadline: string;
  readonly wish_express_expected_delivered_date: string;
  readonly confirm_exptected_deadline: string;
  readonly wish_express_fine_dict: {
    readonly localized_amount: number;
    readonly localized_currency: string;
  };
  readonly order_id: string;
  readonly transaction: MerchantTransaction;
  readonly previous_dispute: TrackingDisputeDetail;
  readonly has_fake_tracking_id: boolean;
  readonly reason_for_fake_number: string;
  readonly states: {
    readonly [country: string]: {
      readonly [state: string]: string;
    };
  };
  readonly countries: {
    readonly [country: string]: string;
  };
  readonly number_older_than_txn: boolean;
  readonly is_we_new_policy: boolean;
  readonly tracking_number_modified_after_fine: boolean;
  readonly past_tracking_info_dict: PastTrackingInfo;
  readonly cancellation_reason_enum: {
    [type: string]: number;
  };
  readonly cancellation_reason_text_dict: {
    [type: string]: string;
  };
  readonly wish_express_reason_dict: {
    [type: string]: number;
  };
  readonly wish_express_late_reason_text_dict: {
    [type: string]: string;
  };
  readonly disaster_timepoints_dict: {
    [type: string]: number;
  };
  readonly disaster_timepoints_text_dict: {
    [type: string]: string;
  };
  readonly has_merchant_cancellation_fine: boolean;
  readonly wish_fulfillment_time: string;
  readonly wish_delivered_time: string;
  readonly tracking_number_modfied_time: string;
  readonly tracking_number_modified_time: string;
  readonly has_late_confirmed_fulfillment_fine: boolean;
  readonly has_fake_tracking_fine: boolean;
  readonly fine_dicts: ReadonlyArray<MerchantFine>;
  readonly show_fake_track_dispute: boolean;
  readonly we_withhold_deadline: string;
  readonly we_late_order_deadline: string;
  readonly we_dispute_day: number;
  readonly wfp_required_delivery_date: string;
};
export type GetTrackingDisputeFormParamsResponse = {
  readonly redirect: boolean;
  readonly redirect_link: string;
  readonly page_info: TrackingDisputeFormInfo | null | undefined;
};

export const getTrackingDisputeForm = (
  args: GetTrackingDisputeFormParams
): MerchantAPIRequest<
  GetTrackingDisputeFormParams,
  GetTrackingDisputeFormParamsResponse
> => new MerchantAPIRequest("tracking-dispute-form/get", args);
