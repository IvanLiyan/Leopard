import { computed, observable } from "mobx";

/* Schema Types */
import {
  CountryCode,
  MerchantLeadYearlyRevenue,
  MerchantLeadSellingYearsRange,
  MerchantLeadProductCategory,
  MerchantLeadNumberOfSkUs,
  MerchantType,
  BrandRegistrationCountry,
} from "@schema";

export default class MerchantLeadSubmissionState {
  @observable
  companyLegalName: string | null | undefined;

  @observable
  isCompanyLegalNameValid = true;

  @observable
  emailAddress: string | null | undefined;

  @observable
  isEmailAddressValid = true;

  @observable
  firstName: string | null | undefined;

  @observable
  isFirstNameValid = true;

  @observable
  lastName: string | null | undefined;

  @observable
  isLastNameValid = true;

  @observable
  phoneNumber: string | null | undefined;

  @observable
  websiteUrl: string | null | undefined;

  @observable
  isWebsiteUrlValid = true;

  @observable
  country: CountryCode | null | undefined;

  @observable
  isCountryValid = true;

  @observable
  howLongSelling: MerchantLeadSellingYearsRange | null | undefined;

  @observable
  isHowLongSellingValid = true;

  @observable
  merchantTypeCNOnly: MerchantType | null | undefined;

  @observable
  isMerchantTypeCNOnlyValid = true;

  @observable
  brandRegistrationCountryCNOnly: BrandRegistrationCountry | null | undefined;

  @observable
  isBrandRegistrationCountryCNOnlyValid = true;

  @observable
  registeredBeforeCNOnly = false;

  @observable
  annualRevenue: MerchantLeadYearlyRevenue | null | undefined;

  @observable
  isAnnualRevenueValid = true;

  @observable
  skuQuantity: MerchantLeadNumberOfSkUs | null | undefined;

  @observable
  isSkuQuantityValid = true;

  @observable
  productCategory: MerchantLeadProductCategory | null | undefined;

  @observable
  isProductCategoryValid = true;

  @observable
  isSubmissionSuccess = false;

  @observable
  merchantPartner: string | null | undefined;

  @observable
  mobileCountryCode: CountryCode | null | undefined;

  @computed
  get canSave(): boolean {
    return (
      this.isCompanyLegalNameValid &&
      this.isEmailAddressValid &&
      this.isFirstNameValid &&
      this.isLastNameValid &&
      this.isCountryValid &&
      this.isHowLongSellingValid &&
      this.isAnnualRevenueValid &&
      this.isSkuQuantityValid &&
      this.isProductCategoryValid &&
      this.isWebsiteUrlValid &&
      (this.isCNMerchant
        ? this.isMerchantTypeCNOnlyValid &&
          this.isBrandRegistrationCountryCNOnlyValid
        : true)
    );
  }

  @computed
  get isCNMerchant(): boolean {
    return this.country === "CN";
  }
}
