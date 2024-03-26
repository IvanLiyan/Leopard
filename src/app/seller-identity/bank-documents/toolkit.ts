import { gql } from "@gql";
import {
  UploadBankAccountDocument,
  UploadBankAccountDocumentInput,
  UploadMerchantIdentityDocumentInput,
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

export const UploadBankDocumentsMutation = gql(`
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
`);

export type UploadTaxDocumentsResponse = {
  readonly currentMerchant?: {
    readonly merchantIdentityVerification?: {
      readonly uploadDocument?: Pick<
        UploadBankAccountDocument,
        "ok" | "message"
      >;
    };
  };
};

export type UploadTaxDocumentsRequest = {
  readonly input: UploadMerchantIdentityDocumentInput;
};

export const UploadTaxDocumentsMutation = gql(`
mutation uploadMerchantIdentityDocument($input:UploadMerchantIdentityDocumentInput!) {
  currentMerchant {
      merchantIdentityVerification {
          uploadDocument(input: $input) {
              ok
              message
          }
      }
  }
}
`);
