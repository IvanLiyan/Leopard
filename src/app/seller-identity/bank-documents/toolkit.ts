import { gql } from "@apollo/client";
import {
  UploadBankAccountDocument,
  UploadBankAccountDocumentInput,
} from "@schema";

export type UploadBankDocumentsResponse = {
  readonly currentMerchant?: {
    readonly bankAccountVerification?: {
      readonly uploadDocument?: Pick<
        UploadBankAccountDocument,
        "ok" | "message"
      >;
    };
  };
};
export type UploadBankDocumentsRequest = {
  readonly input: UploadBankAccountDocumentInput;
};

export const UploadBankDocumentsMutation = gql`
  mutation SellerIdentity_UploadBankDocuments(
    $input: UploadBankAccountDocumentInput!
  ) {
    currentMerchant {
      bankAccountVerification {
        uploadDocument(input: $input) {
          ok
          message
        }
      }
    }
  }
`;
