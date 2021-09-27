/* External Libraries */
import { computed, observable, action } from "mobx";

/* Lego Components */
import { CountryCode } from "@toolkit/countries";
import { AttachmentInfo } from "@ContextLogic/lego";

/* Lego Toolkit */
import {
  RequiredValidator,
  UrlValidator,
  MatchValueValidator,
} from "@toolkit/validators";
import CountryNames from "@toolkit/countries";
import { CountryType } from "@merchant/component/core/CountrySelect";

/* Merchant Components */
import CompanySection from "@merchant/component/signup/erp-signup/sections/CompanySection";
import BusinessSection from "@merchant/component/signup/erp-signup/sections/BusinessSection";
import GeneralSection from "@merchant/component/signup/erp-signup/sections/GeneralSection";
import ContactSection from "@merchant/component/signup/erp-signup/sections/ContactSection";
import AccountSection from "@merchant/component/signup/erp-signup/sections/AccountSection";

/* Merchant API */
import { ErpSignupParams } from "@merchant/api/erp-signup";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type Contact = {
  name: string | null | undefined;
  jobTitle: string | null | undefined;
  phoneNumber: string | null | undefined;
  email: string | null | undefined;
  wechat: string | null | undefined;
};

export type AppType = {
  readonly value: number;
  readonly text: string;
};

export type ErpSignupSection = {
  readonly id: string;
  readonly title: string;
  readonly sectionTitle: string;
  readonly reactNode:
    | typeof CompanySection
    | typeof BusinessSection
    | typeof GeneralSection
    | typeof ContactSection;
};

export type ErpSignupSections = ReadonlyArray<ErpSignupSection>;

const generalStr = i`General`;

export default class ErpSignupState {
  @observable companyName: string | undefined;
  @observable websiteURL: string | undefined;
  @observable addressLine1: string | null | undefined;
  @observable addressLine2: string | null | undefined;
  @observable city: string | null | undefined;
  @observable state: string | null | undefined;
  @observable country: CountryCode | undefined;
  @observable zipcode: string | null | undefined;
  @observable licenseId: string | undefined;
  @observable partnerRole: number;
  @observable technicalContact: Contact;
  @observable username: string | undefined;
  @observable password: string | undefined;
  @observable confirmPassword: string | undefined;
  @observable email: string | undefined;
  @observable attachments: ReadonlyArray<AttachmentInfo> = [];
  @observable termAgreed: boolean;

  partnerRoleOptions: ReadonlyArray<AppType> = [
    {
      value: 9,
      text: `${generalStr} (ERP)`,
    },
    {
      value: 17,
      text: i`Insurance`,
    },
    {
      value: 51,
      text: i`Loans`,
    },
    {
      value: 29,
      text: i`Payments`,
    },
  ];

  sections: ErpSignupSections = [
    {
      id: "company",
      title: i`Company Information`,
      sectionTitle: i`Company Information`,
      reactNode: CompanySection,
    },
    {
      id: "business",
      title: i`Business License`,
      sectionTitle: i`Business License Information`,
      reactNode: BusinessSection,
    },
    {
      id: "general",
      title: i`General Information`,
      sectionTitle: i`General Information`,
      reactNode: GeneralSection,
    },
    {
      id: "contact",
      title: i`Contact Information`,
      sectionTitle: i`Contact Information`,
      reactNode: ContactSection,
    },
    {
      id: "api",
      title: i`Wish API Account`,
      sectionTitle: i`Wish API Account Information`,
      reactNode: AccountSection,
    },
  ];

  constructor() {
    this.partnerRole = this.partnerRoleOptions[0].value;
    this.technicalContact = this.newContact();
    this.termAgreed = false;
  }

  newContact(): Contact {
    return {
      email: null,
      jobTitle: null,
      name: null,
      phoneNumber: null,
      wechat: null,
    };
  }

  @computed
  get countryComparator() {
    // sort the country in current locale
    const { locale } = LocalizationStore.instance();
    const compareFn = new Intl.Collator(locale, { sensitivity: "base" })
      .compare;
    const countryCompareFn = (code1: CountryCode, code2: CountryCode) => {
      const name1 = CountryNames[code1];
      const name2 = CountryNames[code2];
      return compareFn(name1, name2);
    };
    return countryCompareFn;
  }

  @computed
  get countryOptions(): ReadonlyArray<CountryType> {
    // Country order: current IP, then top countries, then remaining countries
    const { countryCodeByIp } = AppStore.instance();
    const topCountries: ReadonlyArray<CountryCode> = [
      "US",
      "DE",
      "FR",
      "BR",
      "CA",
      "GB",
      "ES",
    ];
    const remainingCountryCodes = (Object.keys(CountryNames) as ReadonlyArray<
      CountryCode
    >)
      .filter((cc) => !topCountries.includes(cc))
      .sort(this.countryComparator);

    let countryCodes: ReadonlyArray<CountryCode> = [
      ...topCountries,
      ...remainingCountryCodes,
    ];
    if (countryCodeByIp) {
      countryCodes = [
        countryCodeByIp,
        ...countryCodes.filter((value) => value !== countryCodeByIp),
      ];
    }

    return countryCodes.map(
      (countryCode: CountryCode): CountryType => {
        const countryName = CountryNames[countryCode];
        return {
          name: countryName,
          cc: countryCode,
        };
      }
    );
  }

  @action.bound
  changeCountry(countryCode: CountryCode | undefined) {
    if (this.country && this.country !== countryCode) {
      this.city = null;
      this.state = null;
      this.addressLine1 = null;
      this.addressLine2 = null;
      this.zipcode = null;
    }
    this.country = countryCode;
  }

  @computed
  get licenseDocString(): string | null | undefined {
    if (this.attachments && this.attachments[0]) {
      return JSON.stringify(this.attachments[0].serverParams);
    }
  }

  @computed
  get isFromCN(): boolean {
    return this.country === "CN";
  }

  @computed
  get requestParams(): ErpSignupParams {
    return {
      username: this.username || "",
      email: this.email || "",
      password: this.password || "",
      confirm_password: this.confirmPassword || "",
      company_name: this.companyName || "",
      website: this.websiteURL || "",
      street_address1: this.addressLine1,
      street_address2: this.addressLine2,
      city: this.city,
      state: this.state,
      zipcode: this.zipcode,
      country: this.country,
      partner_role: this.partnerRole,
      tech_contact_name: this.technicalContact.name,
      tech_contact_email: this.technicalContact.email,
      tech_contact_phone: this.technicalContact.phoneNumber,
      tech_contact_job_title: this.technicalContact.jobTitle,
      tech_contact_wechat: this.technicalContact.wechat,
      business_id_doc: this.licenseDocString,
      license_id: this.licenseId,
    };
  }

  @computed
  get optionalFields(): ReadonlyArray<string> {
    let optionalFields = [
      "street_address2",
      "user_contact_wechat",
      "user_contact_job_title",
      "tech_contact_job_title",
      "tech_contact_wechat",
    ];
    if (this.country !== "CN") {
      optionalFields = [...optionalFields, "business_id_doc", "license_id"];
    }
    return optionalFields;
  }

  @computed
  get canSubmit(): boolean {
    const requiredFieldsNonEmpty = Object.keys(this.requestParams)
      .filter((key) => !this.optionalFields.includes(key))
      // if you find this please fix the any types (legacy)
      .every((key) => !!(this.requestParams as any)[key]);
    const pwdMatch = this.password === this.confirmPassword;
    return requiredFieldsNonEmpty && pwdMatch && this.termAgreed;
  }

  @computed
  get confirmPwdValidator() {
    return new MatchValueValidator({
      customMessage: i`Passwords do not match.`,
      matchedString: this.password,
    });
  }

  @computed
  get requiredValidator() {
    return new RequiredValidator();
  }

  @computed
  get urlValidator() {
    return new UrlValidator();
  }
}
