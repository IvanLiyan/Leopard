import gql from "graphql-tag";
import {
  Country,
  Datetime,
  UserSchema,
  TaxSetting,
  CountryCode,
  UsTaxConstants,
  TaxSettingAuthority,
  ShippingOriginSettings,
  TaxSettingMexicoDetails,
  TaxSettingGermanyDetails,
  SellerVerificationSchema,
  UsTaxMarketplaceMunicipalities,
} from "@schema/types";
import { StateCode } from "@ContextLogic/lego/toolkit/states";

export type FlowSteps =
  | "select-dest-countries"
  | "setup-US"
  | "setup-CA"
  | "setup-EU"
  | "review";

export type FlowStep = {
  countryCode: CountryCode;
  required: boolean;
};

export const TaxEUCountries: ReadonlyArray<CountryCode> = [
  "AT", // Austria
  "BE", // Belgium
  "BG", // Bulgaria
  "HR", // Croatia
  "CY", // Cyprus
  "CZ", // Czech Republic
  "DK", // Denmark
  "EE", // Estonia
  "FI", // Finland
  "FR", // France
  "DE", // Germany
  "GR", // Greece
  "HU", // Hungary
  "IE", // Ireland
  "IT", // Italy
  "LV", // Latvia
  "LT", // Lithuania
  "LU", // Luxembourg
  "MT", // Malta
  "NL", // Netherlands
  "PL", // Poland
  "PT", // Portugal
  "RO", // Romania
  "SK", // Slovakia
  "SI", // Slovenia
  "ES", // Spain
  "SE", // Sweden
];

export const TaxNonEUCountries: ReadonlyArray<CountryCode> = [
  "US",
  "CA",
  "MX",
  "GB",
  "MC",
];

export const TaxCountries: ReadonlyArray<CountryCode> = [
  ...TaxNonEUCountries,
  ...TaxEUCountries,
];

export const USHomeRuleStates: ReadonlyArray<StateCode> = ["AK", "CO", "LA"];

// US States with no state-level taxes.
export const USNomadStates: ReadonlyArray<StateCode> = [
  "AK",
  "NH",
  "OR",
  "MT",
  "DE",
];

export type PickedUSMarketplaceMunicipalities = Pick<
  UsTaxMarketplaceMunicipalities,
  "stateCode" | "cities" | "counties" | "districts"
>;

export type PickedTaxSetting = Pick<
  TaxSetting,
  | "id"
  | "status"
  | "reviewStatus"
  | "taxNumber"
  | "taxNumberType"
  | "certificateFileUrl"
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

export type PickedShippingOriginSettings = Pick<
  ShippingOriginSettings,
  | "shippingType"
  | "destinationRegion"
  | "originCountryCode"
  | "originCountryName"
>;

export type TaxEnrollmentInitialData = {
  readonly platformConstants: {
    readonly tax: {
      readonly us: Pick<UsTaxConstants, "marketplaceStates"> & {
        readonly marketplaceMunicipalities: ReadonlyArray<
          PickedUSMarketplaceMunicipalities
        >;
      };
    };
  };
  readonly currentUser: Pick<UserSchema, "entityType">;
  readonly currentMerchant: {
    readonly countryOfDomicile: Pick<Country, "code"> | null;
    readonly shippingOrigins: ReadonlyArray<PickedShippingOriginSettings>;
    readonly tax: {
      readonly settings: ReadonlyArray<PickedTaxSetting> | null;
    };
    readonly sellerVerification: Pick<SellerVerificationSchema, "hasCompleted">;
  };
};

export const UPSERT_TAX_SETTINGS = gql`
  mutation TaxEnrollment_UpsertTaxSettings($input: UpsertTaxSettingsInput!) {
    currentUser {
      merchant {
        taxSettings {
          upsertTaxSettings(input: $input) {
            ok
            errorMessage
          }
        }
      }
    }
  }
`;
