/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export enum ActionType {
  add = "ADD",
  change = "CHANGE",
  delete = "DELETE",
}

export type DependencyInfo = {
  readonly raw_api_dependency: string;
  readonly api_dependency: string;
  readonly resource: string;
};

export type ReleaseNoteInfo = {
  readonly title: string;
  readonly subtitle: string;
  readonly release_note: ReleaseNoteDetail;
};

export type ReleaseNoteDetail = {
  readonly new_apis: ReadonlyArray<EndpointInfo>;
  readonly deleted_apis: ReadonlyArray<EndpointInfo>;
  readonly deprecated_apis: ReadonlyArray<EndpointInfo>;
  readonly changed_apis: ReadonlyArray<EndpointInfo>;
};

export type EndpointInfo = {
  readonly title: string;
  readonly method: string;
  readonly path: string;
  readonly detail?: EndpointDetail;
};

export type EndpointDetail = {
  readonly paths?: ReadonlyArray<ParamDetail>;
  readonly requests?: ReadonlyArray<ParamDetail>;
  readonly responses?: ReadonlyArray<ResponseDetail>;
};

export type ParamDetail = {
  readonly name: string;
  readonly type: ActionType;
  readonly prop_detail?: ReadonlyArray<PropDetail>;
};

export type PropDetail = {
  readonly action: ActionType;
  readonly type: string;
  readonly old_value: string | number | string[];
  readonly new_value: string | number | string[];
  readonly old_value_str: string;
  readonly new_value_str: string;
};

export type ResponseDetail = {
  readonly status_code: number;
  readonly property_list: ReadonlyArray<ParamDetail>;
  readonly required_properties?: RequiredPropDetail | null;
  readonly new_schema: boolean;
};

export type RequiredPropDetail = {
  readonly added: ReadonlyArray<string>;
  readonly removed: ReadonlyArray<string>;
};

export type ResultInfoItem = {
  readonly type: string;
  readonly name: string;
  readonly key: string;
  readonly formatted_type: string;
  readonly property: ResultInfo;
  readonly is_array: boolean;
};

export type ResultInfo = {
  readonly [key: string]: ResultInfoItem;
};

type GetApiReleaseNotesParams = {
  readonly api_resource_name: string;
};

type GetApiReleaseNotesResp = {
  readonly release_notes: ReadonlyArray<ReleaseNoteInfo>;
  readonly dependency_info: DependencyInfo;
};

export const getApiReleaseNotes = (
  args: GetApiReleaseNotesParams
): MerchantAPIRequest<GetApiReleaseNotesParams, GetApiReleaseNotesResp> =>
  new MerchantAPIRequest("external-api/release-notes", args);

type GetApiListParams = {};

type GetApiListResp = {
  readonly api_list: ReadonlyArray<DependencyInfo>;
};

export const getApiList = (
  args: GetApiListParams
): MerchantAPIRequest<GetApiListParams, GetApiListResp> =>
  new MerchantAPIRequest("external-api/api-list", args);
