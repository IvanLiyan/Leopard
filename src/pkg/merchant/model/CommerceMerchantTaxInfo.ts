/* External Libraries */
import { observable, computed } from "mobx";

/* Lego Toolkit */
import { getCountryName } from "@toolkit/countries";
import {
  CountryCode,
  CommerceMerchantReviewStatus,
  TaxSettingAuthorityLevel,
  CommerceMerchantTaxInfoStatus,
  CommerceMerchantTaxInfoGermanyNoNumberReason,
  TaxSetting,
  TaxSettingUkDetails,
  UserEntityType,
  TaxSettingTaxNumberType,
} from "@schema/types";

/* Merchant API */
import { CommerceMerchantTaxInfoJson } from "@merchant/api/tax";
import {
  V2PickedTaxSetting,
  GBMerchantCompanyNumberOptions,
  GBMerchantIndividualNumberOptions,
} from "@toolkit/tax/types-v2";

export type GermanyRegistrationSelection = "have-vat" | "no-vat";

export default class CommerceMerchantTaxInfo {
  @observable
  id: string | undefined;

  @observable
  stateCode: string | undefined;

  @observable
  taxNumber: string | undefined | null;

  @observable
  countryCode: CountryCode;

  @observable
  ossRegistrationCountryCode: CountryCode | undefined | null;

  @observable
  status: CommerceMerchantTaxInfoStatus | undefined;

  @observable
  reviewStatus: CommerceMerchantReviewStatus | undefined | null;

  @observable
  authorityLevel: TaxSettingAuthorityLevel;

  @observable
  lastUpdated: number | undefined;

  @observable
  displayName: string | undefined | null;

  @observable
  deNoVATReason:
    | CommerceMerchantTaxInfoGermanyNoNumberReason
    | null
    | undefined;

  @observable
  certificateFileUrl: string | null | undefined;

  @observable
  mxDefaultShipFromIsMX: boolean | null | undefined;

  //Client-side only
  @observable
  numberIsInvalid: boolean;

  @observable
  deRegistrationSelection: GermanyRegistrationSelection = "have-vat";

  @observable
  deUstSt1T1Number: V2PickedTaxSetting["euDetails"]["ustSt1T1Number"];

  @observable
  deUstSt1T1NumberIsValid: boolean;

  // For GB merchants
  @observable
  gbShipFromLocation: CountryCode | undefined;

  @observable
  gbVatEntity: TaxSettingUkDetails["gbVatEntity"];

  // For GB merchants account type individual
  @observable
  gbIndividualState: GBIndividualEnrollmentState | undefined;

  // For GB merchants account type company
  @observable
  gbMerchantState: GBCompanyEnrollmentState | undefined;

  @observable
  euVatCountryCodes: ReadonlySet<CountryCode> | null | undefined;

  constructor(
    args: Partial<
      CommerceMerchantTaxInfoJson & {
        numberIsInvalid?: boolean;
        taxNumberType?: TaxSetting["taxNumberType"];
        gbShipFromLocation?: CountryCode;
        euDetails: V2PickedTaxSetting["euDetails"];
        gbVatEntity: TaxSettingUkDetails["gbVatEntity"];
      }
    >
  ) {
    this.id = args.id;
    this.status = args.status;
    this.stateCode = args.state_code;
    this.taxNumber = args.tax_number;
    this.countryCode = args.country_code || "US";
    this.ossRegistrationCountryCode =
      args.oss_registration_country_code || null;
    this.reviewStatus = args.review_status;
    this.authorityLevel = args.authority_level || "COUNTRY";

    this.deNoVATReason = args.de_no_number_reason;
    this.certificateFileUrl = args.certificate_file_url;

    this.mxDefaultShipFromIsMX = args.mx_default_ship_from_is_mx;

    this.deRegistrationSelection =
      this.deNoVATReason != null && this.id != null ? "no-vat" : "have-vat";

    this.numberIsInvalid = !!args.numberIsInvalid;
    this.euVatCountryCodes = args.eu_vat_country_codes;

    this.lastUpdated = args.last_updated;
    this.displayName = args.display_name;
    this.deUstSt1T1Number = args.euDetails?.ustSt1T1Number;
    this.gbVatEntity = args.gbVatEntity;
    this.deUstSt1T1NumberIsValid =
      args.euDetails?.ustSt1T1Number != null &&
      args.euDetails?.ustSt1T1Number.length > 0;

    this.gbShipFromLocation = args.gbShipFromLocation || undefined;
    if (this.countryCode == "GB") {
      this.gbIndividualState = new GBIndividualEnrollmentState({
        type: args.taxNumberType,
        number: args.tax_number,
      });
      this.gbMerchantState = new GBCompanyEnrollmentState({
        type: args.taxNumberType,
        number: args.tax_number,
      });
    }
  }

  @computed
  get isPending(): boolean {
    return this.id == null;
  }

  @computed
  get authorityDisplayName(): string | null | undefined {
    const { displayName } = this;
    if (displayName != null) {
      return displayName;
    }

    switch (this.authorityLevel) {
      case "STATE":
        return this.stateCode;
      default:
        return getCountryName(this.countryCode);
    }
  }

  canSubmit(): boolean {
    const numberIsValid = !this.numberIsInvalid;
    return numberIsValid;
  }

  copy(): CommerceMerchantTaxInfo {
    return new CommerceMerchantTaxInfo({
      ...this.toJson(),
      numberIsInvalid: this.numberIsInvalid,
    });
  }

  getTaxNumberType(
    entityType: UserEntityType,
    isOss?: boolean | null | undefined
  ): TaxSettingTaxNumberType | undefined {
    const { countryCode } = this;
    if (countryCode == "GB") {
      return this.getTaxNumberTypeForGB(entityType);
    }
    if (
      this.euVatCountryCodes != null &&
      this.euVatCountryCodes.has(countryCode)
    ) {
      if (isOss === true) return "OSS";
    }
    return entityType === "INDIVIDUAL"
      ? "TAX_IDENTIFICATION_NUMBER"
      : "VALUE_ADDED_TAX";
  }

  getTaxNumberTypeForGB(
    entityType: UserEntityType
  ): TaxSettingTaxNumberType | undefined {
    const { countryCode } = this;
    if (countryCode != "GB") {
      return;
    }

    const { gbIndividualState, gbMerchantState } = this;
    if (gbIndividualState == null || gbMerchantState == null) {
      // Shouldn't happen, just here to clear TS checks.
      return;
    }

    if (entityType === "COMPANY") {
      const { selectedValue } = gbMerchantState;
      return selectedValue === "CRN"
        ? "COMPANY_REGISTRITION_NUMBER"
        : "VALUE_ADDED_TAX";
    }

    if (entityType === "INDIVIDUAL") {
      const { selectedValue } = gbIndividualState;

      if (selectedValue === "VAT") {
        return "VALUE_ADDED_TAX";
      }

      return selectedValue === "TIN"
        ? "TAX_IDENTIFICATION_NUMBER"
        : "NATIONAL_INSURANCE_NUMBER";
    }
  }

  toJson(): Partial<
    CommerceMerchantTaxInfoJson & { last_update: number | null }
  > {
    return {
      id: this.id,
      status: this.status,
      state_code: this.stateCode,
      tax_number: this.taxNumber,
      country_code: this.countryCode,
      display_name: this.displayName,
      review_status: this.reviewStatus,
      last_update: this.lastUpdated,
      authority_level: this.authorityLevel,
      de_no_number_reason: this.deNoVATReason,
      certificate_file_url: this.certificateFileUrl,
      mx_default_ship_from_is_mx: this.mxDefaultShipFromIsMX,
      oss_registration_country_code: this.ossRegistrationCountryCode,
    };
  }
}

export class GBIndividualEnrollmentState {
  @observable
  selectedValue: GBMerchantIndividualNumberOptions;

  @observable
  vatNumber: string | undefined;

  @observable
  isVatValid = false;

  @observable
  tinNumber: string | undefined;

  @observable
  isTinValid = false;

  @observable
  ninNumber: string | undefined;

  @observable
  isNinValid = false;

  constructor({
    type,
    number,
  }: {
    type: TaxSetting["taxNumberType"];
    number: TaxSetting["taxNumber"];
  }) {
    if (number == null) {
      this.selectedValue = "VAT";
      return;
    }

    if (type === "TAX_IDENTIFICATION_NUMBER") {
      this.tinNumber = number;
      this.isTinValid = true;
      this.selectedValue = "TIN";
      return;
    }

    if (type === "NATIONAL_INSURANCE_NUMBER") {
      this.ninNumber = number;
      this.isNinValid = true;
      this.selectedValue = "NIN";
      return;
    }

    if (type === "VALUE_ADDED_TAX") {
      this.vatNumber = number;
      this.isVatValid = true;
      this.selectedValue = "VAT";
      return;
    }

    this.selectedValue = "TIN";
    this.tinNumber = number == null ? undefined : number;
  }

  canSubmit(): boolean {
    return this.isNinValid || this.isTinValid || this.isVatValid;
  }
}

export class GBCompanyEnrollmentState {
  @observable
  selectedValue: GBMerchantCompanyNumberOptions;

  @observable
  vatNumber: string | undefined;

  @observable
  isVatValid = false;

  @observable
  crnNumber: string | undefined;

  @observable
  isCrnValid = false;

  constructor({
    type,
    number,
  }: {
    type: TaxSetting["taxNumberType"];
    number: string | null | undefined;
  }) {
    if (number == null) {
      this.selectedValue = "VAT";
      return;
    }

    if (type === "COMPANY_REGISTRITION_NUMBER") {
      this.crnNumber = number;
      this.isCrnValid = true;
      this.selectedValue = "CRN";
      return;
    }

    if (type === "VALUE_ADDED_TAX") {
      this.vatNumber = number;
      this.isVatValid = true;
      this.selectedValue = "VAT";
      return;
    }

    this.selectedValue = "VAT";
    this.vatNumber = number == null ? undefined : number;
  }

  canSubmit(): boolean {
    return this.isCrnValid || this.isVatValid;
  }
}
