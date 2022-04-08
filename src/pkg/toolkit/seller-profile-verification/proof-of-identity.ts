import { useMemo } from "react";
import gql from "graphql-tag";

/* Toolkit */
import {
  CheckBoxRequiredValidator,
  DatetimeInputValidator,
  RequiredValidator,
  UploadFileRequiredValidator,
  Validator,
} from "@toolkit/validators";

/* Merchant Stores */
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";

/* Types Imports */
import { SellerProfileVerificationInitialData } from "./initial-data";
import {
  SellerIdentitySetProofOfBizIdentityMutation,
  SellerIdentitySetProofOfBizIdentityInput,
  SellerIdentitySetProofOfIndividualIdentityMutation,
  SellerIdentitySetProofOfIndividualIdentityInput,
  IdDocTypes,
  SellerIdentityIdProof,
  EntityTypes,
  SellerIdentityBusinessInfoIndividual,
  SellerIdentityBusinessInfo,
  SellerIdentityLegalBizRep,
  DatetimeInput,
  BusinessDocTypes,
} from "@schema/types";

export const SET_PROOF_OF_BIZ_IDENTITY_MUTATION = gql`
  mutation SellerIdentity_SetProofOfBizIdentity(
    $input: SellerIdentitySetProofOfBizIdentityInput!
  ) {
    currentMerchant {
      sellerIdentityVerification {
        setProofOfIdentityBiz(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type SetProofOfBizIdentityResponseType = {
  readonly currentMerchant?: {
    readonly sellerIdentityVerification: {
      readonly setProofOfIdentityBiz?: Pick<
        SellerIdentitySetProofOfBizIdentityMutation,
        "ok" | "message"
      >;
    };
  };
};

export const setProofOfBizIdentity = async (
  input: SellerIdentitySetProofOfBizIdentityInput
) => {
  const { client } = ApolloStore.instance();
  const toastStore = ToastStore.instance();
  const { data } = await client.mutate<
    SetProofOfBizIdentityResponseType,
    { input: SellerIdentitySetProofOfBizIdentityInput }
  >({
    mutation: SET_PROOF_OF_BIZ_IDENTITY_MUTATION,
    variables: { input },
  });
  const { ok, message } =
    data?.currentMerchant?.sellerIdentityVerification.setProofOfIdentityBiz ||
    {};
  if (!ok) {
    toastStore.negative(message || i`Something went wrong`);
  }
  return ok;
};

export const SET_PROOF_OF_INDIVIDUAL_IDENTITY_MUTATION = gql`
  mutation SellerIdentity_SetProofOfIndividualIdentity(
    $input: SellerIdentitySetProofOfIndividualIdentityInput!
  ) {
    currentMerchant {
      sellerIdentityVerification {
        setProofOfIdentityIndividual(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

type SetProofOfIndivIdentityResponseType = {
  readonly currentMerchant?: {
    readonly sellerIdentityVerification: {
      readonly setProofOfIdentityIndividual?: Pick<
        SellerIdentitySetProofOfIndividualIdentityMutation,
        "ok" | "message"
      >;
    };
  };
};

export const setProofOfIndivIdentity = async (
  input: SellerIdentitySetProofOfIndividualIdentityInput
) => {
  const { client } = ApolloStore.instance();
  const toastStore = ToastStore.instance();
  const { data } = await client.mutate<
    SetProofOfIndivIdentityResponseType,
    { input: SellerIdentitySetProofOfIndividualIdentityInput }
  >({
    mutation: SET_PROOF_OF_INDIVIDUAL_IDENTITY_MUTATION,
    variables: { input },
  });
  const { ok, message } =
    data?.currentMerchant?.sellerIdentityVerification
      .setProofOfIdentityIndividual || {};
  if (!ok) {
    toastStore.negative(message || i`Something went wrong`);
  }
  return ok;
};

export const idDocTypeOptions: ReadonlyArray<{
  value: IdDocTypes;
  text: string;
}> = [
  { value: "DRIVER_LICENSE", text: i`Driver's license` },
  { value: "PASSPORT", text: i`Passport` },
  { value: "GOVERNMENT_ISSUED_STATE_ID", text: i`Government-issued state ID` },
];

export const bizDocTypeMap = {
  GOVERNMENT_ISSUED_BUSINESS_LICENSE: {
    image: "GIBLImage",
    expiry: "GIBLExpiry",
  },
  OFFICIAL_BANK_STATEMENT: {
    image: "OBSImage",
    expiry: "OBSExpiry",
  },
  ARTICLES_OF_INCORPORATION: {
    image: "AOIImage",
    expiry: "AOIExpiry",
  },
  CERTIFICATE_OF_INCORPORATION: {
    image: "COIImage",
    expiry: "COIExpiry",
  },
  RECENT_BUSINESS_RETURNS: {
    image: "RBRImage",
    expiry: "RBRExpiry",
  },
  ENTITY_TRADING_NAME: {
    image: "ETNImage",
    expiry: "ETNExpiry",
  },
  PRODUCT_LICENSING: {
    image: "PLImage",
    expiry: "PLExpiry",
  },
  SHARE_ALLOCATION_CERTIFICATE: {
    image: "SACImage",
    expiry: "SACExpiry",
  },
} as const;

export type BizDocType = keyof typeof bizDocTypeMap;

export const bizDocTypeOptions: ReadonlyArray<{
  value: BizDocType;
  text: string;
}> = [
  { value: "ARTICLES_OF_INCORPORATION", text: i`Articles of incorporation` },
  {
    value: "CERTIFICATE_OF_INCORPORATION",
    text: i`Certificate of incorporation`,
  },
  { value: "RECENT_BUSINESS_RETURNS", text: i`Recent business returns` },
  { value: "ENTITY_TRADING_NAME", text: i`Entity trading name` },
  { value: "PRODUCT_LICENSING", text: i`Product licensing` },
  {
    value: "SHARE_ALLOCATION_CERTIFICATE",
    text: i`Share allocation certificate`,
  },
];

export type IndivDocType = Extract<
  BusinessDocTypes,
  "CREDIT_CARD_STATEMENT" | "OFFICIAL_BANK_STATEMENT"
>;

export const indivDocTypeOptions: ReadonlyArray<{
  value: IndivDocType;
  text: string;
}> = [
  { value: "CREDIT_CARD_STATEMENT", text: i`Credit card statement` },
  { value: "OFFICIAL_BANK_STATEMENT", text: i`Official bank statement` },
];

export type IndivForm = Partial<
  SellerIdentityBusinessInfoIndividual &
    SellerIdentityIdProof & {
      indivDocType: IndivDocType;
      indivDocImageListStr: string;
      indivDocExpiry: DatetimeInput;
    }
>;

export type IndivFields = keyof IndivForm;

export type BizForm = Partial<
  SellerIdentityBusinessInfo &
    SellerIdentityLegalBizRep &
    SellerIdentityIdProof & {
      birthDate: DatetimeInput;
      [bizDocTypeMap.GOVERNMENT_ISSUED_BUSINESS_LICENSE.image]: string;
      [bizDocTypeMap.GOVERNMENT_ISSUED_BUSINESS_LICENSE.expiry]: DatetimeInput;
      [bizDocTypeMap.OFFICIAL_BANK_STATEMENT.image]: string;
      [bizDocTypeMap.OFFICIAL_BANK_STATEMENT.expiry]: DatetimeInput;
      [bizDocTypeMap.ARTICLES_OF_INCORPORATION.image]: string;
      [bizDocTypeMap.ARTICLES_OF_INCORPORATION.expiry]: DatetimeInput;
      [bizDocTypeMap.CERTIFICATE_OF_INCORPORATION.image]: string;
      [bizDocTypeMap.CERTIFICATE_OF_INCORPORATION.expiry]: DatetimeInput;
      [bizDocTypeMap.RECENT_BUSINESS_RETURNS.image]: string;
      [bizDocTypeMap.RECENT_BUSINESS_RETURNS.expiry]: DatetimeInput;
      [bizDocTypeMap.PRODUCT_LICENSING.image]: string;
      [bizDocTypeMap.PRODUCT_LICENSING.expiry]: DatetimeInput;
      [bizDocTypeMap.ENTITY_TRADING_NAME.image]: string;
      [bizDocTypeMap.ENTITY_TRADING_NAME.expiry]: DatetimeInput;
      [bizDocTypeMap.SHARE_ALLOCATION_CERTIFICATE.image]: string;
      [bizDocTypeMap.SHARE_ALLOCATION_CERTIFICATE.expiry]: DatetimeInput;
    }
>;

export type BizFields = keyof BizForm;

export const defaultFormData = (
  currentUser: SellerProfileVerificationInitialData["currentUser"],
  entityType: EntityTypes
) => {
  const { firstName, lastName } = currentUser || {};
  const common = {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    middleName: undefined,
    birthDate: undefined,
    proofOfIdDocType: undefined,
    idNumber: undefined,
    proofOfIdExpirationDate: undefined,
    frontOfImageListStr: undefined,
    backOfImageListStr: undefined,
    selfieImageListStr: undefined,
  };
  if (entityType === "INDIVIDUAL") {
    return {
      ...common,
      indivDocType: undefined,
      indivDocImageListStr: undefined,
      indivDocExpiry: undefined,
    };
  }
  return {
    ...common,
    regBusinessName: undefined,
    regBusinessNum: undefined,
    isLegalRepAndConsentToElectronicSig: false,
    [bizDocTypeMap.GOVERNMENT_ISSUED_BUSINESS_LICENSE.image]: undefined,
    [bizDocTypeMap.GOVERNMENT_ISSUED_BUSINESS_LICENSE.expiry]: undefined,
    [bizDocTypeMap.OFFICIAL_BANK_STATEMENT.image]: undefined,
    [bizDocTypeMap.OFFICIAL_BANK_STATEMENT.expiry]: undefined,
    [bizDocTypeMap.ARTICLES_OF_INCORPORATION.image]: undefined,
    [bizDocTypeMap.ARTICLES_OF_INCORPORATION.expiry]: undefined,
    [bizDocTypeMap.CERTIFICATE_OF_INCORPORATION.image]: undefined,
    [bizDocTypeMap.CERTIFICATE_OF_INCORPORATION.expiry]: undefined,
    [bizDocTypeMap.RECENT_BUSINESS_RETURNS.image]: undefined,
    [bizDocTypeMap.RECENT_BUSINESS_RETURNS.expiry]: undefined,
    [bizDocTypeMap.PRODUCT_LICENSING.image]: undefined,
    [bizDocTypeMap.PRODUCT_LICENSING.expiry]: undefined,
    [bizDocTypeMap.ENTITY_TRADING_NAME.image]: undefined,
    [bizDocTypeMap.ENTITY_TRADING_NAME.expiry]: undefined,
    [bizDocTypeMap.SHARE_ALLOCATION_CERTIFICATE.image]: undefined,
    [bizDocTypeMap.SHARE_ALLOCATION_CERTIFICATE.expiry]: undefined,
  };
};

export const useValidators = () => {
  return useMemo<{ [P in IndivFields | BizFields]: Validator<any>[] }>(
    () => ({
      firstName: [new RequiredValidator()],
      lastName: [new RequiredValidator()],
      middleName: [],
      birthDate: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          required: true,
          cannotSelectFuture: true,
        }),
      ],
      proofOfIdDocType: [new RequiredValidator()],
      idNumber: [new RequiredValidator()],
      proofOfIdExpirationDate: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      frontOfImageListStr: [new UploadFileRequiredValidator()],
      backOfImageListStr: [new UploadFileRequiredValidator()],
      selfieImageListStr: [new UploadFileRequiredValidator()],
      regBusinessName: [new RequiredValidator()],
      regBusinessNum: [new RequiredValidator()],
      isLegalRepAndConsentToElectronicSig: [new CheckBoxRequiredValidator()],
      layoutTag: [],
      [bizDocTypeMap.GOVERNMENT_ISSUED_BUSINESS_LICENSE.image]: [
        new UploadFileRequiredValidator(),
      ],
      [bizDocTypeMap.GOVERNMENT_ISSUED_BUSINESS_LICENSE.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
          required: true,
        }),
      ],
      [bizDocTypeMap.OFFICIAL_BANK_STATEMENT.image]: [
        new UploadFileRequiredValidator(),
      ],
      [bizDocTypeMap.OFFICIAL_BANK_STATEMENT.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      [bizDocTypeMap.ARTICLES_OF_INCORPORATION.image]: [],
      [bizDocTypeMap.ARTICLES_OF_INCORPORATION.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      [bizDocTypeMap.CERTIFICATE_OF_INCORPORATION.image]: [],
      [bizDocTypeMap.CERTIFICATE_OF_INCORPORATION.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      [bizDocTypeMap.RECENT_BUSINESS_RETURNS.image]: [],
      [bizDocTypeMap.RECENT_BUSINESS_RETURNS.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      [bizDocTypeMap.PRODUCT_LICENSING.image]: [],
      [bizDocTypeMap.PRODUCT_LICENSING.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      [bizDocTypeMap.ENTITY_TRADING_NAME.image]: [],
      [bizDocTypeMap.ENTITY_TRADING_NAME.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      [bizDocTypeMap.SHARE_ALLOCATION_CERTIFICATE.image]: [],
      [bizDocTypeMap.SHARE_ALLOCATION_CERTIFICATE.expiry]: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
      indivDocType: [new RequiredValidator()],
      indivDocImageListStr: [new UploadFileRequiredValidator()],
      indivDocExpiry: [
        new DatetimeInputValidator({
          format: "MM/DD/YYYY",
          cannotSelectPast: true,
        }),
      ],
    }),
    []
  );
};
