import { gql } from "@apollo/client";
import {
  CreateProductsDownloadJobInput,
  CreateProductsDownloadJobMutation,
} from "@schema";

export const CREATE_JOB_MUTATION = gql`
  mutation CreateProductDownloadsJobForMerchantPromotionsMutation(
    $input: CreateProductsDownloadJobInput!
  ) {
    mfp {
      createProductsDownloadJob(input: $input) {
        ok
        message
      }
    }
  }
`;

export type CreateJobMutationResponse = {
  readonly mfp?: {
    createProductsDownloadJob: Pick<
      CreateProductsDownloadJobMutation,
      "ok" | "message"
    >;
  };
};

export type CreateJobMutationVariables = {
  readonly input: CreateProductsDownloadJobInput;
};
