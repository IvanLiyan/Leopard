import { gql } from "@gql";
import { UpsertMerchantWarning, UpsertMerchantWarningInput } from "@schema";

export const REQUEST_PAYMENT_RELEASE_MUTATION = gql(`
  mutation RequestPaymentReleaseMutation(
    $infractionId: ObjectIdType
    $idFiles: [FileInput!]
    $agreementFiles: [FileInput!]
  ) {
    policy {
      merchantWarning {
        upsertMerchantWarning(
          input: {
            action: REQUEST_PAYMENT_RELEASE
            warningId: $infractionId
            requestPaymentInput: {
              idFiles: $idFiles
              agreementFiles: $agreementFiles
            }
          }
        ) {
          ok
          message
        }
      }
    }
  }
`);

export type RequestPaymentReleaseMutationResponse = {
  readonly policy?: {
    readonly merchantWarning?: {
      readonly upsertMerchantWarning?: Pick<
        UpsertMerchantWarning,
        "ok" | "message"
      >;
    };
  };
};

export type RequestPaymentReleaseMutationVariables = {
  readonly infractionId: NonNullable<UpsertMerchantWarningInput["warningId"]>;
  readonly idFiles: NonNullable<
    NonNullable<UpsertMerchantWarningInput["requestPaymentInput"]>["idFiles"]
  >;
  readonly agreementFiles: NonNullable<
    NonNullable<
      UpsertMerchantWarningInput["requestPaymentInput"]
    >["agreementFiles"]
  >;
};
