import {
  Country,
  Datetime,
  UserSchema,
  TaxSetting,
  CountryCode,
  UsTaxConstants,
  CaTaxConstants,
  TaxSettingAuthority,
  TaxSettingMexicoDetails,
  SellerVerificationSchema,
  UsTaxMarketplaceMunicipalities,
  CommerceMerchantTaxInfoStatus,
  MerchantTaxSchema,
  ShippingOriginSettings,
  TaxSettingGermanyDetails,
  TaxLiabilitySchema,
  TaxSettingEuDetails,
  KycVerificationSchema,
  UpsertTaxSettingsMutation,
  TaxSettingsMutationsUpsertTaxSettingsArgs,
  EuvatTaxSchema,
  Union,
  ShippingSettingsSchema,
} from "@schema/types";

// Home Page

export type PickedDatetime = Pick<Datetime, "unix">;

export type AccountType = Pick<UserSchema, "entityType">["entityType"];

export type TaxConstants = USTaxConstants | CATaxConstants;

export type USTaxConstants = {
  readonly type: "US_TAX_CONSTANTS";
  readonly marketplaceStates: ReadonlyArray<string>;
  readonly marketplaceMunicipalities: ReadonlyArray<string>;
  readonly nomadStates: ReadonlyArray<string>;
  readonly homeRuleStates: ReadonlyArray<string>;
};

export const isUSTaxConstants = (arg: TaxConstants): arg is USTaxConstants => {
  return arg != null && arg.type == "US_TAX_CONSTANTS";
};

export type UsMpfDropdown = {
  readonly type: "US_MPF";
  readonly remitStates: ReadonlyArray<string>;
  readonly homeRuleStates: ReadonlyArray<
    Pick<
      UsTaxMarketplaceMunicipalities,
      "stateCode" | "cities" | "counties" | "districts"
    >
  >;
};

export const isUsMpfDropdown = (arg: DropdownData): arg is UsMpfDropdown => {
  return arg != null && arg.type == "US_MPF";
};

export type UsNonTaxDropdown = {
  readonly type: "US_NON_TAX";
  readonly stateCodes: ReadonlyArray<string>;
};

export const isUsNonTaxDropdown = (
  arg: DropdownData
): arg is UsNonTaxDropdown => {
  return arg != null && arg.type == "US_NON_TAX";
};

export type UsStateTaxInfo = {
  readonly code: string;
  readonly lastUpdated?: PickedDatetime;
  readonly taxId?: string | null;
  readonly subRegions?: ReadonlyArray<string>;
};

export type UsOtherDropdown = {
  readonly type: "US_OTHER";
  readonly statesInfo: ReadonlyArray<UsStateTaxInfo>;
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
};

export const isUsOtherDropdown = (
  arg: DropdownData
): arg is UsOtherDropdown => {
  return arg != null && arg.type == "US_OTHER";
};

export type CATaxConstants = {
  readonly type: "CA_TAX_CONSTANTS";
  readonly pstAndQstCaProvinceCodes: ReadonlyArray<string>;
  readonly mpfCaProvinceCodes: ReadonlyArray<string>;
  readonly hstCaProvinceCodes?: ReadonlyArray<string>;
  readonly otherCaProvinceCodes?: ReadonlyArray<string>;
};

export const isCATaxConstants = (arg: TaxConstants): arg is CATaxConstants => {
  return arg != null && arg.type == "CA_TAX_CONSTANTS";
};

export type CaMpfDropdown = {
  readonly type: "CA_MPF";
  readonly remitProvinces: ReadonlyArray<string>;
};

export const isCaMpfDropdown = (arg: DropdownData): arg is CaMpfDropdown => {
  return arg != null && arg.type == "CA_MPF";
};

export type CaPstQstDropdown = {
  readonly type: "CA_PST_QST";
  readonly provinceCodes: ReadonlyArray<string>;
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
};

export const isCaPstQstDropdown = (
  arg: DropdownData
): arg is CaPstQstDropdown => {
  return arg != null && arg.type == "CA_PST_QST";
};

export type ProvinceNumberMap = {
  readonly [provinceCode: string]: string;
};

export type CaDropdown = {
  readonly type: "CA";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly gstAccountNumber?: string | null | undefined;
  readonly lastUpdated: PickedDatetime;
  readonly provinceNumbers: ProvinceNumberMap;
};

export const isCaDropdown = (arg: DropdownData): arg is CaDropdown => {
  return arg != null && arg.type == "CA";
};

export type MxDropdown = {
  readonly type: "MX";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly rfcId?: string | null | undefined;
  readonly defaultShipFromIsMx?: boolean | null | undefined;
  readonly lastUpdated: PickedDatetime;
};

export const isMxDropdown = (arg: DropdownData): arg is MxDropdown => {
  return arg != null && arg.type == "MX";
};

export type DeDropdown = {
  readonly type: "DE";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly taxId?: string | null;
  readonly ustSt1T1Number?: string | null;
  readonly taxCertificateUrl?: string | null;
  readonly lastUpdated: PickedDatetime;
  readonly defaultShipFromLocation?: CountryCode;
};

export const isDeDropdown = (arg: DropdownData): arg is DeDropdown => {
  return arg != null && arg.type == "DE";
};

export type NonGbMerchantDropdown = {
  readonly type: "GB_NON_GB_MERCHANT";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly defaultShipFromLocation?: CountryCode;
  readonly lastUpdated?: PickedDatetime;
};

export const isNonGbMerchantDropdown = (
  arg: DropdownData
): arg is NonGbMerchantDropdown => {
  return arg != null && arg.type == "GB_NON_GB_MERCHANT";
};

export type GbMerchantDropdown = {
  readonly type: "GB_GB_MERCHANT";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly taxId?: string | null;
  readonly taxNumberType?: TaxSetting["taxNumberType"] | null;
  readonly defaultShipFromLocation?: CountryCode;
  readonly lastUpdated?: PickedDatetime;
};

export const isGbMerchantDropdown = (
  arg: DropdownData
): arg is GbMerchantDropdown => {
  return arg != null && arg.type == "GB_GB_MERCHANT";
};

export type GbDropdown = NonGbMerchantDropdown | GbMerchantDropdown;

export const isGbDropdown = (arg: DropdownData): arg is GbDropdown => {
  return isNonGbMerchantDropdown(arg) || isGbMerchantDropdown(arg);
};

export type EuMpfDropdown = {
  readonly type: "EU_MPF";
  readonly countryCodes: ReadonlyArray<CountryCode>;
};

export const isEuMpfDropdown = (arg: DropdownData): arg is EuMpfDropdown => {
  return arg != null && arg.type == "EU_MPF";
};

export type EuDropdown = {
  readonly type: "EU";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly taxId?: string | null;
  readonly taxNumberType?: TaxSetting["taxNumberType"] | null;
  readonly countryOfOssRegistration?: CountryCode | null;
  readonly euCountriesSettings: ReadonlyArray<V2PickedTaxSetting>;
};

export const isEuDropdown = (arg: DropdownData): arg is EuDropdown => {
  return arg != null && arg.type == "EU";
};

export type TaxDropdown = {
  readonly type: "OTHER";
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly taxId?: string | null;
  readonly taxNumberType?: TaxSetting["taxNumberType"] | null;
  readonly lastUpdated?: PickedDatetime | null;
  readonly defaultShipFromLocation?: CountryCode;
};

export const isTaxDropdown = (arg: DropdownData): arg is TaxDropdown => {
  return arg != null && arg.type == "OTHER";
};

export type DropdownData =
  | UsMpfDropdown
  | UsNonTaxDropdown
  | UsOtherDropdown
  | CaMpfDropdown
  | CaPstQstDropdown
  | CaDropdown
  | MxDropdown
  | DeDropdown
  | NonGbMerchantDropdown
  | GbMerchantDropdown
  | GbDropdown
  | EuMpfDropdown
  | EuDropdown
  | TaxDropdown;

export type UnionCode = "EU";

export type TaxRow = {
  readonly countryCode: CountryCode | UnionCode;
  readonly standardTaxRate?: number | boolean;
  readonly taxLiability: string | ReadonlyArray<PickedTaxLiability>;
  readonly isMpf?: boolean;
  readonly mpfLaunchDate?: PickedDatetime | null;
  readonly deprecationDate?: PickedDatetime | null;
  readonly status: CommerceMerchantTaxInfoStatus | null;
  readonly dropdown?: DropdownData;
  readonly postfix?: string;
  readonly canUserEdit?: boolean;
};

export type PickedTaxLiability = Pick<
  TaxLiabilitySchema,
  "remitPercentage" | "remitType" | "userEntityTypeForRemit"
>;

export type V2PickedTaxSetting = Pick<
  TaxSetting,
  | "id"
  | "authority"
  | "status"
  | "reviewStatus"
  | "taxNumber"
  | "taxNumberType"
  | "certificateFileUrl"
  | "lastUpdated"
  | "status"
  | "reviewStatus"
  | "certificateFileUrl"
  | "taxCertificateFile"
> & {
  readonly taxLiability: ReadonlyArray<PickedTaxLiability>;
  readonly businessAddress: {
    readonly country: Pick<Country, "code">;
  };
  readonly ossRegistrationCountry: Pick<Country, "code" | "name">;
  readonly lastUpdated: Pick<Datetime, "unix">;
  readonly euDetails: Pick<TaxSettingEuDetails, "ustSt1T1Number">;
  readonly germanyDetails: Pick<
    TaxSettingGermanyDetails,
    "noNumberReason"
  > | null;
  readonly mexicoDetails: Pick<
    TaxSettingMexicoDetails,
    "defaultShipFromIsMx"
  > | null;
};

export type PickedUSMarketplaceMunicipalities = Pick<
  UsTaxMarketplaceMunicipalities,
  "stateCode" | "cities" | "counties" | "districts"
>;

export type PickedAccountManagerSchema = Pick<UserSchema, "name" | "email">;

export type PickedEuVatCountry = Pick<Country, "code" | "name" | "isInEurope">;

export type TaxSettingsInitialDataType = {
  readonly currentUser: Pick<UserSchema, "entityType" | "accountManager">;
  readonly currentMerchant: {
    readonly businessAddress: {
      readonly country: Pick<Country, "code">;
    };
    readonly countryOfDomicile: Pick<Country, "code">;
    readonly shippingOrigins: ReadonlyArray<PickedShippingOriginSettings>;
    readonly shippingSettings: ReadonlyArray<PickedShippingSettings>;
    readonly tax: Pick<MerchantTaxSchema, "hasConfiguredTaxesBefore"> & {
      readonly settings: ReadonlyArray<V2PickedTaxSetting> | null;
    };
    readonly euVatTax: Pick<
      EuvatTaxSchema,
      "euVatSelfRemittanceEligible" | "euVatEntityStatus"
    >;
    readonly sellerVerification: Pick<
      SellerVerificationSchema,
      "hasCompleted" | "canStart" | "isKycVerification"
    > & {
      readonly kycVerification: Pick<KycVerificationSchema, "canStart">;
    };
  };
  readonly platformConstants: {
    readonly euVatCountries: ReadonlyArray<PickedEuVatCountry>;
    readonly tax: {
      readonly us: Pick<UsTaxConstants, "marketplaceStates" | "nomadStates"> & {
        readonly marketplaceMunicipalities: ReadonlyArray<
          PickedUSMarketplaceMunicipalities
        >;
      };
      readonly ca: Pick<
        CaTaxConstants,
        "pstQstProvinces" | "marketplaceProvinces"
      > & {
        readonly marketplaceMunicipalities: ReadonlyArray<
          PickedUSMarketplaceMunicipalities
        >;
      };
      readonly marketplaceUnions: ReadonlyArray<PickedTaxMarketplaceUnion>;
      readonly marketplaceCountries: ReadonlyArray<{
        readonly country: Pick<Country, "code">;
        readonly launchDate: PickedDatetime | null;
      }>;
    };
  };
};

export type ValidatedState = "VALIDATED" | "INCOMPLETE" | "NOT_VALIDATED";
export type ValidatedStateEU =
  | "VALIDATED"
  | "REJECTED"
  | "PENDING_REVIEW"
  | "NOT_STARTED"
  | "NOT_ESTABLISHED";

export const AccountTypeDisplayNames: {
  [type in Exclude<AccountType, null | undefined>]: string;
} = {
  INDIVIDUAL: i`Individual`,
  COMPANY: i`Business`,
};

export type PickedShippingOriginSettings = Pick<
  ShippingOriginSettings,
  "destinationRegion" | "originCountryCode" | "shippingType"
>;

export type PickedShippingSettings = Pick<ShippingSettingsSchema, "enabled"> & {
  readonly country: Pick<Country, "code">;
};

export type PickedTaxSetting = Pick<
  TaxSetting,
  "id" | "status" | "reviewStatus" | "taxNumber" | "certificateFileUrl"
> & {
  readonly lastUpdated: Pick<Datetime, "unix">;
  readonly authority: Pick<
    TaxSettingAuthority,
    "level" | "stateCode" | "displayName"
  > & {
    readonly country: Pick<Country, "name" | "code">;
  };
  readonly germanyDetails: Pick<
    TaxSettingGermanyDetails,
    "noNumberReason"
  > | null;
  readonly mexicoDetails: Pick<
    TaxSettingMexicoDetails,
    "defaultShipFromIsMx"
  > | null;
};

export type PickedEnrollableCountry = Pick<
  Country,
  "code" | "name" | "isInEurope"
>;

type PickedUnionCountry = Pick<Country, "code">;

export type PickedTaxMarketplaceUnion = {
  readonly launchDate: Pick<Datetime, "unix" | "hasPassed" | "formatted">;
  readonly union: Pick<Union, "code" | "name"> & {
    readonly countries: ReadonlyArray<PickedUnionCountry>;
  };
};

export type TaxEnrollmentV2InitialData = {
  readonly platformConstants: {
    readonly euVatCountries: ReadonlyArray<PickedEuVatCountry>;
    readonly tax: {
      readonly us: Pick<
        UsTaxConstants,
        "marketplaceStates" | "nomadStates" | "homeRuleStates"
      > & {
        readonly marketplaceMunicipalities: ReadonlyArray<
          PickedUSMarketplaceMunicipalities
        >;
      };
      readonly ca: Pick<
        CaTaxConstants,
        "marketplaceProvinces" | "pstQstProvinces"
      >;
      readonly marketplaceUnions: ReadonlyArray<PickedTaxMarketplaceUnion>;
    };
  };
  readonly currentUser: Pick<UserSchema, "entityType">;
  readonly currentMerchant: {
    readonly countryOfDomicile: Pick<Country, "code"> | null;
    readonly shippingOrigins: ReadonlyArray<PickedShippingOriginSettings>;
    readonly tax: {
      readonly settings: ReadonlyArray<V2PickedTaxSetting> | null;
      readonly enrollableCountries: ReadonlyArray<PickedEnrollableCountry>;
    };
    readonly euVatTax: Pick<
      EuvatTaxSchema,
      "euVatSelfRemittanceEligible" | "euVatEntityStatus"
    >;
    readonly sellerVerification: Pick<SellerVerificationSchema, "hasCompleted">;
  };
};

export type GBMerchantIndividualNumberOptions = "TIN" | "NIN";

export type GBMerchantCompanyNumberOptions = "VAT" | "CRN";

type GBNumberDisplayNameInfoType = {
  [numberType in
    | GBMerchantIndividualNumberOptions
    | GBMerchantCompanyNumberOptions]: {
    readonly title: string;
    readonly desc: string;
  };
};

export type DataRow = {
  readonly countryCode: CountryCode;
  readonly countryName: () => React.ReactNode;
  readonly taxNumber?: string | null | undefined;
  readonly status?: CommerceMerchantTaxInfoStatus | null | undefined;
  readonly lastUpdated: number | undefined;
  readonly ustSt1T1Number?: string | null | undefined;
  readonly certificateFileUrl?: string | null | undefined;
};

export const GBNumberDisplayNameInfo: GBNumberDisplayNameInfoType = {
  TIN: {
    title: i`Tax Identification Number (TIN)`,
    desc:
      i`The taxpayer identification number (TIN) is the unique ` +
      i`identifier assigned to the account holder by the tax ` +
      i`administration in the account holder’s jurisdiction of tax ` +
      i`residence.`,
  },
  NIN: {
    title: i`National Insurance Number`,
    desc:
      i`The National Insurance Number is a unique personal account ` +
      i`number issued to you by the government of United Kingdom. It ` +
      i`makes sure that the National Insurance contributions and tax ` +
      i`you pay are properly recorded against your name. It also acts ` +
      i`as a reference number when communicating with the Department ` +
      i`of Work and Pensions and HM Revenue & Customs (HMRC). Your ` +
      i`National Insurance Number remains unchanged during your life ` +
      i`time.`,
  },
  VAT: {
    title: i`Value Added Tax (VAT)`,
    desc:
      i`Value Added Tax is an indirect tax on the consumption of goods ` +
      i`and services collected at each stage of the production and ` +
      i`distribution process (i.e. a transactional tax), but ` +
      i`ultimately borne by the end consumer as the tax is effectively ` +
      i`passed down along the supply chain. VAT is commonly, subject ` +
      i`to exceptions, payable in the country where the customer is ` +
      i`located or the ultimate destination of the goods.`,
  },
  CRN: {
    title: i`Company Registration Number`,
    desc:
      i`The Company Registration Number (also known as the company ` +
      i`number, registration number, or simply, CRN) is used to ` +
      i`identify your company and verify the fact that it is a Great ` +
      i`Britain-based entity registered with Companies House.`,
  },
};

export type UpsertTaxSettingsResponseType = {
  readonly currentUser?: {
    readonly merchant?: {
      readonly taxSettings: {
        readonly upsertTaxSettings: Pick<
          UpsertTaxSettingsMutation,
          "ok" | "errorMessage"
        >;
      };
    };
  };
};

export type UpsertTaxSettingsRequestType = TaxSettingsMutationsUpsertTaxSettingsArgs;
