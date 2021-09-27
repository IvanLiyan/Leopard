/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type CaseStatus = "ONGOING" | "SETTLED" | "DISMISSED" | "DEFAULTED";
export type AdminResponseStatus = "NEW" | "RESOLVED" | "FOLLOWUP";

export type RestrictionType =
  | "suspended_store"
  | "frozen_payment"
  | "both"
  | "no_restriction";

export type VisibilityFilterType = "true" | "false";

export type ReplyType = "HIRED_LAWYER" | "RESOLVED" | "NORMAL_REPLY";
export type BulkAction =
  | "NOOP"
  | "CHANGESTATUS"
  | "SUSPENDSTORE"
  | "FROZENPAYMENT"
  | "UNSUSPENDSTORE"
  | "UNFROZENPAYMENT"
  | "MAKEVISIBILITY";
export type LegalInjunction = {
  readonly plaintiff_name: string;
  readonly case_number: string;
  readonly plaintiff_counsel: string;
  readonly plaintiff_counsel_email: string;
  readonly plaintiff_counsel_phone: string;
  readonly court_name: string;
  readonly ip_at_issue: string;
  readonly state_name: string;
  readonly merchant_case_status: CaseStatus;
  readonly tro_received_date: string;
  readonly tro_entered_date: string;
  readonly id: string;
};

export type InjunctionProduct = {
  readonly id: string;
  readonly name: string;
  readonly gmv: string;
};
export type InjunctionApplyAction = {
  readonly action: number;
  readonly action_str: string;
  readonly timestamp: string;
  readonly message: string;
};
export type MerchantInjunction = {
  readonly tro_number: string;
  readonly is_visible_by_merchant: boolean;
  readonly defendant_number: string;
  readonly merchant_id: string;
  readonly state_name: string;
  readonly plaintiff_name: string;
  readonly restrictions: ReadonlyArray<string>;
  readonly merchant_first_msg_date: string;
  readonly merchant_last_msg_date: string;
  readonly restrictions_str: string;
  readonly amount_earmarked: number;
  readonly merchant_case_status: CaseStatus;
  readonly admin_response_status: AdminResponseStatus | null | undefined;
  readonly merchant_name: string;
  readonly merchant_gmv: number;
  readonly total_account_balance_impact: number;
  readonly plaintiff_counsel: string;
  readonly bd_name: string;
  readonly account_balance_cny: number;
  readonly account_balance_usd: number;
  readonly products: ReadonlyArray<InjunctionProduct>;
  readonly payments: ReadonlyArray<InjunctionPayment>;
  readonly other_tros: ReadonlyArray<number>;
  readonly conversations: ReadonlyArray<InjunctionConversation>;
  readonly applied_actions: ReadonlyArray<InjunctionApplyAction>;
  readonly message: string;
  readonly id: string;
};

export type InjunctionPayment = {
  readonly type_name: string;
  readonly amount: number;
  readonly date: string;
  readonly currency: string;
  readonly id: string;
};
export type InjunctionLawyerInfo = {
  readonly firm_name: string;
  readonly lawyer_name: string;
  readonly lawyer_email: string;
};
export type SupportDoc = {
  readonly filename: string;
  readonly url: string;
  readonly id: string;
};
export type InjunctionMerchantReply = {
  readonly date: string;
  readonly lawyer_info: InjunctionLawyerInfo;
  readonly message: string;
  readonly message_en: string | null | undefined;
  readonly reply_type: ReplyType;
  readonly support_doc: SupportDoc;
};
export type InjunctionAdminReply = {
  readonly date: string;
  readonly message: string;
};
export type InjunctionConversation = InjunctionMerchantReply & {
  readonly sender_type: "merchant" | "admin";
  readonly sender_name: string;
};
export type InjunctionResult = {
  readonly basic_info: LegalInjunction;
  readonly restrictions: ReadonlyArray<RestrictionType>;
  readonly products: ReadonlyArray<InjunctionProduct>;
  readonly payments: ReadonlyArray<InjunctionPayment>;
  readonly withhold_amount: number;
  readonly admin_replies: ReadonlyArray<InjunctionAdminReply>;
  readonly merchant_replies: ReadonlyArray<InjunctionMerchantReply>;
};

export type GetMerchantTrosParams = {};

export type GetMerchantInjunctionsParams = {
  readonly count: number | null | undefined;
  readonly offset: number | null | undefined;
  readonly restriction_types: string | null | undefined;
  readonly filter_id: string | null | undefined;
  readonly filter_type: string | null | undefined;
  readonly case_statuses: string | null | undefined;
  readonly admin_response_statuses: string | null | undefined;
  readonly sorted_field: string | null | undefined;
  readonly sorted_order: string | null | undefined;
  readonly visibility: string | null | undefined;
};

export type SendTroUpdateParams = {
  readonly injunction_id: string;
  readonly reply_type: ReplyType;
  readonly lawyer_name?: string | null | undefined;
  readonly lawyer_email?: string | null | undefined;
  readonly firm_name?: string | null | undefined;
  readonly message?: string | null | undefined;
  readonly screenshot_file?: string | null | undefined;
};

export type AdminSendTroMessageParams = {
  readonly merchant_injunction_ids: ReadonlyArray<string>;
  readonly message: string;
  readonly admin_response_status?: number;
};

export type AdminSendTroUpdateActionParams = {
  readonly merchant_injunction_ids: ReadonlyArray<string>;
};

export type AdminSendTroToggleVisibilityActionParams = {
  readonly merchant_injunction_ids: ReadonlyArray<string>;
  readonly make_visible: boolean;
};

export type AdminSendTroUpdateStateActionParams = {
  readonly merchant_injunction_ids: ReadonlyArray<string>;
  readonly to_state: number;
};

export type GetMerchantTrosResponse = {
  injunction_results: ReadonlyArray<InjunctionResult>;
};

export const getMerchantTros = (
  args: GetMerchantTrosParams
): MerchantAPIRequest<GetMerchantTrosParams, GetMerchantTrosResponse> => {
  return new MerchantAPIRequest("merchant-tros/get", args);
};

export const sendTroUpdate = (
  args: SendTroUpdateParams
): MerchantAPIRequest<SendTroUpdateParams, {}> => {
  return new MerchantAPIRequest<SendTroUpdateParams, {}>(
    "merchant-tros/send-update",
    args
  ).setOptions({
    failSilently: true,
  });
};

export type AdminSendTroUpdateResponse = {
  readonly success_merchant_ids: ReadonlyArray<string>;
  readonly failed_merchant_id_dict: {
    readonly [mid: string]: string;
  };
};

export const adminSendTroMessage = (
  args: AdminSendTroMessageParams
): MerchantAPIRequest<
  AdminSendTroMessageParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroMessageParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/send-message", args).setOptions({
    failSilently: true,
  });
};

export const adminSendTroUnsuspendStoreUpdate = (
  args: AdminSendTroUpdateActionParams
): MerchantAPIRequest<
  AdminSendTroUpdateActionParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroUpdateActionParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/unban-merchant", args).setOptions({
    failSilently: true,
  });
};

export const adminSendTroSuspendStoreUpdate = (
  args: AdminSendTroUpdateActionParams
): MerchantAPIRequest<
  AdminSendTroUpdateActionParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroUpdateActionParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/ban-merchant", args).setOptions({
    failSilently: true,
  });
};

export const adminSendTroFreezeFundsUpdate = (
  args: AdminSendTroUpdateActionParams
): MerchantAPIRequest<
  AdminSendTroUpdateActionParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroUpdateActionParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/freeze-funds", args).setOptions({
    failSilently: true,
  });
};

export const adminSendTroUnfreezeFundsUpdate = (
  args: AdminSendTroUpdateActionParams
): MerchantAPIRequest<
  AdminSendTroUpdateActionParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroUpdateActionParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/unfreeze-funds", args).setOptions({
    failSilently: true,
  });
};

export const adminSendTroToggleVisibilityUpdate = (
  args: AdminSendTroToggleVisibilityActionParams
): MerchantAPIRequest<
  AdminSendTroToggleVisibilityActionParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroToggleVisibilityActionParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/toggle-visibility", args).setOptions({
    failSilently: true,
  });
};

export const adminSendTroUpdateStateUpdate = (
  args: AdminSendTroUpdateStateActionParams
): MerchantAPIRequest<
  AdminSendTroUpdateStateActionParams,
  AdminSendTroUpdateResponse
> => {
  return new MerchantAPIRequest<
    AdminSendTroUpdateStateActionParams,
    AdminSendTroUpdateResponse
  >("injunction-merchant/update-merchant-injunction-state", args).setOptions({
    failSilently: true,
  });
};

export type MerchantInjunctionsResponse = {
  readonly has_more: boolean;
  readonly total_count: number;
  readonly end: number;
  readonly results: ReadonlyArray<MerchantInjunction>;
  readonly bd_name_dict: {
    readonly [mid: string]: string;
  };
};

export const getMerchantInjunctions = (
  args: GetMerchantInjunctionsParams
): MerchantAPIRequest<
  GetMerchantInjunctionsParams,
  MerchantInjunctionsResponse
> => {
  return new MerchantAPIRequest("get-admin-merchant-injunctions", args);
};

export const StateToEnum: { [status: string]: number } = {
  ONGOING: 1,
  DISMISSED: 2,
  SETTLED: 3,
  DEFAULTED: 4,
};
