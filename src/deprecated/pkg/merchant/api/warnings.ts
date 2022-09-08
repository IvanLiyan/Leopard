/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

export type InfractionSortKeySpec = "_id" | "fine_amount" | "last_update";

export type InfractionSortOrderSpec = 1 | -1;

export type GetInfractionsParams = {
  readonly count?: number | null | undefined;
  readonly start?: number | null | undefined;
  readonly merchant_id?: string | null | undefined;
  readonly product_id?: string | null | undefined;
  readonly infraction_id?: string | null | undefined;
  readonly query?: string | null | undefined;
  readonly "reason[]"?: ReadonlyArray<number> | null | undefined;
  readonly "infraction_fine_types[]"?: ReadonlyArray<string> | null | undefined;
  readonly reason?: number | null | undefined;
  sortKey?: string | null | undefined;
  sortDir?: number | null | undefined;
  readonly "state[]"?: ReadonlyArray<number> | null | undefined;
  readonly "has_penalties[]": ReadonlyArray<number> | null | undefined;
};

export type InfractionReasonSpec = {
  readonly name: string;
  readonly reason: string;
  readonly count: number;
};

export type InfractionDisputeSpec = {
  readonly name: string;
  readonly dispute_status: string;
};

export type InfractionFinesSpec = {
  readonly name: string;
  // +reasons: ReadonlyArray<number>
};

export type InfractionStatesSpec = {
  readonly name: string;
  readonly state: ReadonlyArray<number>;
};

export type Proof = {
  readonly dispute_status: number;
  readonly proof_type: number;
};

export type Infraction = {
  readonly fine_amount: number | null | undefined;
  readonly initial_fine_amount: number | null | undefined;
  readonly fine_currency: string;
  readonly message: string;
  readonly reason: number;
  readonly id: string;
  readonly product_id: string | null | undefined;
  readonly is_misleading_listing: boolean | null | undefined;
  readonly fine_reduction_per_proof: number | null | undefined;
  readonly fine_is_exempt: boolean;
  readonly fine_exempt_paragraphs: ReadonlyArray<string> | null | undefined;
  readonly fine_exempt_info_link_dict:
    | {
        readonly info_link: string;
        readonly link_type: string;
      }
    | null
    | undefined;
  readonly reason_shortname_mapping: string | null | undefined;
  readonly merchant_reason: string;
  readonly disputable: boolean | null | undefined;
  readonly disputable_proofs: ReadonlyArray<Proof> | null | undefined;
  readonly dispute_failed_proofs: ReadonlyArray<Proof> | null | undefined;
  readonly disputed_proofs: ReadonlyArray<Proof> | null | undefined;
  readonly proof: ReadonlyArray<Proof> | null | undefined;
  readonly undisputed_proofs: ReadonlyArray<Proof> | null | undefined;
  readonly counterfeit_reason_text: string | null;
};

export type InfractionsResponse = {
  readonly results: {
    readonly feed_ended: boolean;
    readonly next_offset: number;
    readonly num_results: number;
    readonly rows: ReadonlyArray<Infraction>;
  };
};

export type GetInfractionsMetadataResponse = {
  readonly reasons: ReadonlyArray<InfractionReasonSpec>;
  readonly dispute_dict: {
    [key: string]: number;
  };
  readonly warning_fines: ReadonlyArray<InfractionFinesSpec>;
  readonly infraction_states: ReadonlyArray<InfractionStatesSpec>;
  readonly show_infractions_tab: boolean;
};

export type GetInfractionsMetadataParams = {};

export const getInfractions = (
  args: GetInfractionsParams
): MerchantAPIRequest<GetInfractionsParams, InfractionsResponse> =>
  new MerchantAPIRequest("warning/get", args);

export const getWarningMetadata = (
  args: GetInfractionsMetadataParams
): MerchantAPIRequest<
  GetInfractionsMetadataParams,
  GetInfractionsMetadataResponse
> => new MerchantAPIRequest("warning/metadata", args);
