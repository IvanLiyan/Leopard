/*
 * MerchantLeadSubmissionState.ts
 *
 * Created by Don Sirivat on Mon Jan 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
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
} from "@schema/types";

export default class MerchantLeadSubmissionState {
  @observable
  companyLegalName: string | null | undefined;

  @observable
  isCompanyLegalNameValid: boolean = true;

  @observable
  emailAddress: string | null | undefined;

  @observable
  isEmailAddressValid: boolean = true;

  @observable
  firstName: string | null | undefined;

  @observable
  isFirstNameValid: boolean = true;

  @observable
  lastName: string | null | undefined;

  @observable
  isLastNameValid: boolean = true;

  @observable
  phoneNumber: string | null | undefined;

  @observable
  websiteUrl: string | null | undefined;

  @observable
  isWebsiteUrlValid: boolean = true;

  @observable
  country: CountryCode | null | undefined;

  @observable
  isCountryValid: boolean = true;

  @observable
  howLongSelling: MerchantLeadSellingYearsRange | null | undefined;

  @observable
  isHowLongSellingValid: boolean = true;

  @observable
  merchantTypeCNOnly: MerchantType | null | undefined;

  @observable
  isMerchantTypeCNOnlyValid: boolean = true;

  @observable
  brandRegistrationCountryCNOnly: BrandRegistrationCountry | null | undefined;

  @observable
  isBrandRegistrationCountryCNOnlyValid: boolean = true;

  @observable
  registeredBeforeCNOnly: boolean = false;

  @observable
  annualRevenue: MerchantLeadYearlyRevenue | null | undefined;

  @observable
  isAnnualRevenueValid: boolean = true;

  @observable
  skuQuantity: MerchantLeadNumberOfSkUs | null | undefined;

  @observable
  isSkuQuantityValid: boolean = true;

  @observable
  productCategory: MerchantLeadProductCategory | null | undefined;

  @observable
  isProductCategoryValid: boolean = true;

  @observable
  isSubmissionSuccess: boolean = false;

  @observable
  merchantPartner: string | null | undefined;

  @observable
  mobileCountryCode: CountryCode | null | undefined;

  @computed
  get canSave() {
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
  get isCNMerchant() {
    return this.country === "CN";
  }
}
