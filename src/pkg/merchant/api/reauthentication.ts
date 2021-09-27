/* Merchant Components */
import { MetaInfoData } from "@merchant/component/merchant-review/MetaInfo";
import { MerchantInfoData } from "@merchant/component/merchant-review/MerchantInfo";
import { MaterialSummaryData } from "@merchant/component/merchant-review/MaterialSummary";
import { DetectedDuplicateNameData } from "@merchant/component/merchant-review/DetectedDuplicateName";
import { ReviewMessagesData } from "@merchant/component/merchant-review/ReviewMessages";
import { ReplyData } from "@merchant/component/merchant-review/Reply";
import { TicketState } from "@merchant/component/merchant-review/StateLabel";

/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";
import {
  ReauthType,
  EntityProps,
  MaterialProps,
} from "@toolkit/merchant-review/material-types";

// Request disable

export type RequestDisableParams = {
  readonly ticketId: string;
};

export type RequestDisableResponse = {};

export const requestDisable = (
  args: RequestDisableParams
): MerchantAPIRequest<RequestDisableParams, RequestDisableResponse> =>
  new MerchantAPIRequest("reauthentication-request-disable", args);

// Fetch reauth detail data

export type ReauthDetailParam = {
  readonly ticketId?: string | null | undefined;
};

export type ReauthDetailResp = {
  readonly metaInfo: MetaInfoData;
  readonly merchantInfo: MerchantInfoData;
  readonly materialSummary: MaterialSummaryData;
  readonly reviewMessages: ReviewMessagesData;
  readonly detectedDuplicateName: DetectedDuplicateNameData;
  readonly reply: ReplyData;
  readonly state: TicketState;
  readonly isMerchant: boolean;
  readonly hasDetectedDuplicateName: boolean;
  readonly canReply: boolean;
  readonly reauthType: ReauthType;
};

export const requestReauthDetail = (
  args: ReauthDetailParam
): MerchantAPIRequest<ReauthDetailParam, ReauthDetailResp> =>
  new MerchantAPIRequest("reauthentication-detail", args);

// Fetch reqired entities for begin payment page

export type RequiredEntitiesParam = {
  readonly ticketId: string;
};

export type RequiredEntitiesResp = {
  readonly requiredEntities: ReadonlyArray<EntityProps>;
};

export const requestRequiredEntities = (
  args: RequiredEntitiesParam
): MerchantAPIRequest<RequiredEntitiesParam, RequiredEntitiesResp> =>
  new MerchantAPIRequest("reauthentication-required-entities", args);

// Submit begin payment info

export type BeginPaymentParam = {
  readonly ticketId: string;
  readonly imageMap: string;
  readonly choiceMap: string;
  readonly letterOfCommitParam: string;
};

export type BeginPaymentResp = {};

export const submitBeginPaymentInfo = (
  args: BeginPaymentParam
): MerchantAPIRequest<BeginPaymentParam, BeginPaymentResp> =>
  new MerchantAPIRequest("reauthentication-begin-payment", args);

// Fetch required materials to update

export type RequiredMaterialParam = {
  readonly ticketId: string;
};

export type MerchantMessageProps = {
  readonly username: string;
  readonly time: string;
};

export type AdminMessageProps = {
  readonly reason: string;
  readonly time: string;
};

export type RequiredMaterialProps = {
  readonly merchantMessage: MerchantMessageProps;
  readonly adminMessage: AdminMessageProps;
  readonly entityId: string;
  readonly entityName: string;
  readonly extraKey?: string;
  readonly extraValue?: string;
  readonly lastMaterial: MaterialProps;
};

export type RequiredMaterialResp = {
  readonly requiredMaterials: ReadonlyArray<RequiredMaterialProps>;
};

export const requestRequiredMaterials = (
  args: RequiredMaterialParam
): MerchantAPIRequest<RequiredMaterialParam, RequiredMaterialResp> =>
  new MerchantAPIRequest("reauthentication-required-materials", args);

// Update materials

export type UpdateMaterialsParam = {
  ticketId: string;
  imageMap: string;
  choiceMap: string;
  textMap: string;
  commentMap: string;
};

export type UpdateMaterialsResp = {};

export const updateMaterials = (
  args: UpdateMaterialsParam
): MerchantAPIRequest<UpdateMaterialsParam, UpdateMaterialsResp> =>
  new MerchantAPIRequest("reauthentication-update-materials", args);
