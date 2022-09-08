import gql from "graphql-tag";
import {
  UpsertFlashSaleCampaignMutation,
  MfpServiceMutationsUpsertFlashSaleCampaignArgs,
} from "@schema/types";

export const UPSERT_FLASH_SALE_CAMPAIGN_MUTATION = gql`
  mutation Mfp_UpsertFlashSaleCampaignMutation(
    $input: UpsertFlashSaleCampaignInput!
  ) {
    mfp {
      upsertFlashSaleCampaign(input: $input) {
        ok
        message
      }
    }
  }
`;

export type UpsertFlashSaleCampaignResponseType = {
  readonly mfp: {
    readonly upsertFlashSaleCampaign: Pick<
      UpsertFlashSaleCampaignMutation,
      "ok" | "message"
    >;
  };
};

export type UpsertFlashSaleCampaignRequestType =
  MfpServiceMutationsUpsertFlashSaleCampaignArgs;
