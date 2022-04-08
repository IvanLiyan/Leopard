import gql from "graphql-tag";
import {
  Country,
  CountryCode,
  MerchantTaxIdentificationBusinessType,
  MerchantTaxIdentificationRejectReson,
  MerchantTaxIdentificationSchema,
  UpsertMerchantTaxIdentificationMutation,
} from "@schema/types";

// TODO: temporary type, remove when api is ready
export type ChapterThreeStatusEntityType =
  | "SIMPLE_TRUST"
  | "CENTRAL_BANK"
  | "GRANTOR_TRUST"
  | "TAX_EXEMPT_ORG"
  | "PRIVATE_FOUNDATION"
  | "DISREGARDED_ENTITY"
  | "CORP"
  | "COMPLEX_TRUST"
  | "ESTATE"
  | "INTL_ORG"
  | "PARTNERSHIP"
  | "FOREIGN_GOVT_CONTROLLED_ENTITY"
  | "FOREIGN_GOVT_INTEGRAL_PART";

// TODO: temporary type, remove when api is ready
export type BenefitProvisionLimitationType =
  | "GOVT"
  | "TAX_EXEMPT_TRUST_FUND"
  | "OTHER_TAX_EXEMPT_ORG"
  | "PUB_TRADED_CORP"
  | "SUB_PUB_TRADED_CORP"
  | "COMP_EROSION_TEST"
  | "COMP_DERIVATIVE_BENEFITS_TEST"
  | "COMP_TRADE_BUSINESS_TEST"
  | "FAVORABLE_DISCRETIONARY"
  | "NO_LOB"
  | "OTHER";

// TODO: temporary type, remove when api is ready
export type LLCTaxClassificationType = "C_CORP" | "S_CORP" | "PARTNERSHIP";

export type UpsertMerchantTaxIdentificationResponseType = {
  readonly currentUser?: {
    readonly merchant?: {
      readonly merchantTaxIdentification: {
        readonly upsertMerchantTaxIdentification: Pick<
          UpsertMerchantTaxIdentificationMutation,
          "ok" | "errorMessage"
        >;
      };
    };
  };
};

export type TaxIdentificationInitialData = {
  readonly currentMerchant?: {
    readonly countryOfDomicile?: Pick<Country, "code"> | null;
    readonly taxIdentification?: Pick<
      MerchantTaxIdentificationSchema,
      "status"
    > | null;
  };
};

export type TaxTreatyBenefitErrorType = {
  residenceCountryError: string | null;
  withholdingRateError: string | null;
  otherBenefitProvisionLimitationTypeError: string | null;
};

export type MerchantAddressErrorType = {
  streetAddress1Error: string | null;
  cityError: string | null;
  stateError: string | null;
  countryCodeError: string | null;
  zipcodeError: string | null;
};

export type IdentificationErrorType = {
  residenceAddressError: MerchantAddressErrorType;
  mailingAddressError: MerchantAddressErrorType;
  firstNameError: string | null;
  lastNameError: string | null;
  businessNameError: string | null;
  taxIDError: string | null;
  foreignTaxIDError: string | null;
  chapterThreeStatusError: string | null;
};

export type TaxFormErrorType = {
  identificationError: IdentificationErrorType;
  taxTreatyBenefitError: TaxTreatyBenefitErrorType;
  signDateError: string | null;
  signNameError: string | null;
  canSignOnbehalfOfEntityError: string | null;
  businessTypeError: string | null;
  llcTaxClassificationTypeError: string | null;
  otherBusinessTypeError: string | null;
  beneficialOwnerResidentCountryError: string | null;
  domicileExplanationError: string | null;
};

export const ENTITIES_REQUIRE_TAX_TREATY_BENEFITS_FORM: ReadonlyArray<ChapterThreeStatusEntityType> =
  ["DISREGARDED_ENTITY", "PARTNERSHIP", "SIMPLE_TRUST", "GRANTOR_TRUST"];

export const CHAPTER_THREE_ENTITY_OPTIONS: Record<
  ChapterThreeStatusEntityType,
  string
> = {
  SIMPLE_TRUST: i`Simple trust`,
  CENTRAL_BANK: i`Central Bank of Issue`,
  GRANTOR_TRUST: i`Grantor trust`,
  TAX_EXEMPT_ORG: i`Tax-exempt organization`,
  PRIVATE_FOUNDATION: i`Private foundation`,
  DISREGARDED_ENTITY: i`Disregarded entity`,
  CORP: i`Corporation`,
  COMPLEX_TRUST: i`Complex trust`,
  ESTATE: i`Estate`,
  INTL_ORG: `International organization`,
  PARTNERSHIP: i`Partnership`,
  FOREIGN_GOVT_CONTROLLED_ENTITY: i`Foreign Government - Controlled Entity`,
  FOREIGN_GOVT_INTEGRAL_PART: i`Foreign Government - Integral Part`,
};

export const BENEFIT_PROVISION_LIMITATION_OPTIONS: Record<
  BenefitProvisionLimitationType,
  string
> = {
  GOVT: i`Government`,
  TAX_EXEMPT_TRUST_FUND: i`Tax-exempt pension trust or pension fund`,
  OTHER_TAX_EXEMPT_ORG: i`Other tax-exempt organization`,
  PUB_TRADED_CORP: i`Publicly traded corporation`,
  SUB_PUB_TRADED_CORP: i`Subsidiary of a publicly traded corporation`,
  COMP_EROSION_TEST: i`Company that meets the ownership and base erosion test`,
  COMP_DERIVATIVE_BENEFITS_TEST: i`Company that meets the derivative benefits test`,
  COMP_TRADE_BUSINESS_TEST: i`Company with an item of income that meets active trade or business test`,
  FAVORABLE_DISCRETIONARY: i`Favorable discretionary determination by the U.S. competent authority received`,
  NO_LOB: i`No LOB article in treaty`,
  OTHER: i`Other`,
};

// TODO : uncomment below after BE includes these new types
export const TAX_CLASSIFICATION_OPTIONS: Record<
  MerchantTaxIdentificationBusinessType,
  string
> = {
  // INDIVIDUAL: i`Individual/sole proprietor or single member LLC`,
  C_CORP: i`C Corporation`,
  S_CORP: i`S Corporation`,
  PARTNERSHIP: i`Partnership`,
  TRUST_OR_ESTATE: i`Trust/estate`,
  LCC: i`Limited liability company`,
  // OTHER: i`Other`,
};

export const LLC_CLASSIFICATION_OPTIONS: Record<
  LLCTaxClassificationType,
  string
> = {
  C_CORP: i`C Corporation`,
  S_CORP: i`S Corporation`,
  PARTNERSHIP: i`Partnership`,
};

export const REJECTED_REASONS: Record<
  MerchantTaxIdentificationRejectReson,
  string
> = {
  WRONG_DOC: i`Wrong document`,
  INVALID_TIN: i`Invalid TIN`,
};

/*
 * These values come from here. Add more countries as needed.
 * https://docs.google.com/spreadsheets/d/1Pn5enzL_-EZBWf2-TjbdEptprj9OUCSOQqQbSyHisWY/edit#gid=978019023
 */
export const TAX_ID_MASKS_BY_COUNTRY: Record<CountryCode | string, RegExp> = {
  FR: /^FR[A-Z0-9]{2}\d{9}$|^EU/,
  DE: /^DE\d{9}$|^\d{11}$|^EU/,
  ES: /^(ES)?[A-Z0-9]\d{7}[A-Z0-9]$|^EU/,
  GB: /^GB\d{9}$|^GB\d{12}$|^GB[A-Z]{2}\d{3}$|^EU/,
  SE: /^SE\d{12}$|^EU/,
  AU: /^((ABN)\s)?\d{2}\s\d{3}\s\d{3}\s\d{3}(\s\d{3})?$|^(ABN)?\d{11}(\d{3})?$|^(ARN)?\d{12}$/,
  CA: /^\d{9}(RT(\d{4})?)?$|^\d{9}RR\d{4}$/,
  IT: /^(IT)?\d{11}$|^EU/,
  JP: /^\d{13}$/,
  AL: /^(J|K|L)\d{8}[A-Z]$/,
  AT: /^ATU\d{8}$|^AT U\d{8}$|^\d{2}\s\d{3}\/\d{4}$|^EU/,
  BE: /^BE\d{10}$|^BE\s0\d{9}$|^EU/,
  BA: /^\d{12}$/,
  BG: /^\d{9,10}$|^BG\d{9,10}$|^EU/,
  HR: /^(HR)?\d{11}$|^EU/,
  CY: /^CY\d{8}[A-Z]$|^EU/,
  CZ: /^CZ\d{8}$|^CZ\d{9}$|^CZ\d{10}$|^EU/,
  DK: /^(DK)?\d{8}$|^EU/,
  EE: /^EE\d{9}$|^EU/,
  FI: /^FI\d{8}$|^EU/,
  GR: /^EL\d{9}$|^EU/,
  HU: /^HU\d{8}$|^\d{8}-\d-\d{2}$|^EU/,
  IE: /^IE\d{7}[A-Z]{1,2}$|^IE\d[A-Z]\d{5}[A-Z]$|^IE\d\W\d{5}[A-Z]$|^EU/,
  LV: /^LV\d{11}$|^LV\s\d{4}\s\d{3}\s\d{4}$|^EU/,
  LI: /^\d{2}\s\d{3}$|^\d{5}$/,
  LT: /^LT\d{9}$|^LT\d{12}$|^LT\d{4}\s\d{3}\s\d{2}$|^EU/,
  LU: /^LU\d{8}$|^EU/,
  MK: /^MK\d{13}$/,
  MX: /^[A-Z&]{3,4}-?\d{6}-?\w{3}$/,
  NL: /^NL\d{9}B\d{2}$|^EU/,
  NO: /^(NO)?\s?\d{3}\s?\d{3}\s?\d{3}\s?MVA$/,
  PL: /^(PL)?\s?\d{10}$|^(PL)?\s?\d{3}-\d{2}-\d{2}-\d{3}$|^(PL)?\s?\d{3}-\d{3}-\d{2}-\d{2}$|^EU/,
  PT: /^PT\d{9}$|^EU/,
  RO: /^EU|^RO\d{2,10}$/,
  RU: /^\d{10}$|^\d{4}\s\d{5}\s\d{1}$|^\d{12}$/,
  RS: /^\d{9}$/,
  SK: /^SK\d{10}$|^SK\d{9}$|^EU/,
  SI: /^SI\d{8}$|^EU/,
  TR: /^\d{10}$|^\d{3}\s\d{3}\s\d{4}$|^\d{11}$/,
  UA: /^\d{3}\s?\d{3}\s?\d{3}\s?(\d{3})?$/,
  MC: /^FR[A-Z0-9]{2}\d{9}$|^EU/,
};

export const TAX_ID_MASKS_BY_STATE: Record<string, Record<string, RegExp>> = {
  CA: {
    BC: /^R\d{6}$|^(PST\-)?\d{4}\-\d{4}$/,
    MT: /^\d{6}\-\d$|^\d{7}$|^\d{9}MT|^\d{9}MC/,
    QC: /^\d{10}TQ(\d{4})?$/,
    SK: /^\d{7}$/,
    MB: /^\d{6}\-\d$|^\d{7}$|^\d{9}MT|^\d{9}MC/,
  },
};

export const TAX_IDENTIFICATION_ERRORS = {
  Required: i`This field is required`,
  NumberOnly: i`Value must be a whole number`,
  RequiredCheckbox: i`Please select this checkbox to proceed`,
  RequiredForeignTaxID: i`Please add a FTIN or select the checkbox below if FTIN is not legally required`,
  InvalidTaxID: i`You entered an invalid tax ID. Please check and try again`,
};

export const UPSERT_MERCHANT_TAX_IDENTIFICATION_MUTATION = gql`
  mutation UpsertMerchantTaxIdentification(
    $input: UpsertMerchantTaxIdentificationInput!
  ) {
    currentUser {
      merchant {
        merchantTaxIdentification {
          upsertMerchantTaxIdentification(input: $input) {
            ok
            errorMessage
          }
        }
      }
    }
  }
`;
