import { gql } from "@gql";
import {
  BankAccountVerificationSchema,
  BankAccountDocumentSchema,
  MerchantSchemaMerchantIdentityVerificationArgs,
  MerchantIdentityVerificationSchema,
  MerchantSchema,
  Country,
  UserEntityType,
} from "@schema";

export const GET_MERCHANT_BANK_VERIFICATION_STATE_REASON = gql(`
  query getMerchantBankVerificationStateReason {
    currentMerchant {
      bankAccountVerification {
        state
        stateReason
        dueDate{
          formatted(fmt:"%m/%d/%Y")
        }
        bankAccountDocuments{
          id
          state
          comment
        }
      }
    }
  }
`);

export type BankAccountDocumentsObject = Pick<
  BankAccountDocumentSchema,
  "id" | "state" | "comment"
>;

export type BankStatusResponseData = {
  readonly currentMerchant: {
    readonly bankAccountVerification: Pick<
      BankAccountVerificationSchema,
      "state" | "stateReason" | "dueDate" | "bankAccountDocuments"
    >;
  };
};

export const GET_MERCHANT_TAX_VERIFICATION_STATE = gql(`
  query getMerchantTaxIdentityVerificationState($verificationType: MerchantIdentityVerificationType) {
    currentMerchant {
      id
      countryOfDomicile {
        code
      }
      merchantIdentityVerification(verificationType: $verificationType) {
        state
        latestMerchantIdentityDocument {
          id
          state
          stateReason
          comment
        }
        stateReason
        dueDate{
          formatted(fmt:"%m/%d/%Y")
        }
      }
    }
    currentUser{
      entityType
    }
  }
`);

export type TaxStatusRequestData =
  MerchantSchemaMerchantIdentityVerificationArgs;

export type TaxStatusResponseData = {
  readonly currentMerchant: {
    readonly id: Pick<MerchantSchema, "id">;
    readonly countryOfDomicile: Maybe<Country>;
    readonly merchantIdentityVerification: Pick<
      MerchantIdentityVerificationSchema,
      "state" | "latestMerchantIdentityDocument" | "dueDate" | "stateReason"
    >;
  };
  readonly currentUser: {
    readonly entityType: Maybe<UserEntityType>;
  };
};
