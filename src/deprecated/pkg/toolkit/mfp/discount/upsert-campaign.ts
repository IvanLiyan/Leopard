import gql from "graphql-tag";
import {
  UpsertDiscountCampaignMutation,
  MfpServiceMutationsUpsertDiscountCampaignArgs,
} from "@schema/types";

export const UPSERT_DISCOUNT_CAMPAIGN_MUTATION = gql`
  mutation Mfp_UpsertDiscountCampaignMutation(
    $input: UpsertDiscountCampaignInput!
  ) {
    mfp {
      upsertDiscountCampaign(input: $input) {
        ok
        message
      }
    }
  }
`;

export type UpsertDiscountCampaignResponseType = {
  readonly mfp: {
    readonly upsertDiscountCampaign: Pick<
      UpsertDiscountCampaignMutation,
      "ok" | "message"
    >;
  };
};

export type UpsertDiscountCampaignRequestType =
  MfpServiceMutationsUpsertDiscountCampaignArgs;
