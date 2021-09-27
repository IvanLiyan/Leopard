//  TaxEnrollmentV2State.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/17/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* External Libraries */
import React from "react";
import { observable, computed, action } from "mobx";
import _ from "lodash";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { ConfirmationModal } from "@merchant/component/core/modal";

/* Lego Toolkit */
import { states } from "@ContextLogic/lego/toolkit/states";

/* Toolkit */
import {
  UpsertTaxSettingsResponseType,
  UpsertTaxSettingsRequestType,
  PickedTaxMarketplaceUnion,
} from "@toolkit/tax/types-v2";
import { UPSERT_TAX_SETTINGS } from "@toolkit/tax/enrollment";

/* Merchant API */
import {
  TaxSettingAuthorityLevel,
  TaxSettingsInput,
  UpsertTaxSettingsInput,
  CommerceMerchantEuEntityStatus,
} from "@schema/types";

/* Merchant Store */
import RouteStore from "@merchant/stores/RouteStore";
import ApolloStore from "@merchant/stores/ApolloStore";

/* Merchant Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";

import {
  FlowStep,
  PickedUSMarketplaceMunicipalities,
} from "@toolkit/tax/enrollment";

/* Relative Imports */
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import { CountryCode, UserEntityType, UsTaxConstants } from "@schema/types";

import {
  PickedEnrollableCountry,
  PickedShippingOriginSettings,
  CATaxConstants,
} from "@toolkit/tax/types-v2";

export type OrderTaxAuthority = {
  id: string;
  name: string;
  type: string;
  official_name: string;
  category: string;
};

export type TaxableAddress = {
  city: string;
  county: string;
  state: string;
  zipcode: string;
  country: string;
};

export type RemitType = "NO_REMIT" | "WISH_REMIT" | "MERCHANT_REMIT";

export type OrderTaxItem = {
  id: string;
  created_time: number;
  transaction_id: string;
  variation_id: string;
  merchant_transaction_id: string;
  merchant_id: string;
  refund_item_id?: string | null | undefined;
  tax_type: string;
  event_type:
    | "SALE_PRICE"
    | "SALE_SHIPPING"
    | "REFUND_PRICE"
    | "REFUND_SHIPPING";
  remit_type: RemitType;
  is_refund: boolean;
  is_sale: boolean;
  taxable_address: any;
  currency_code: string;
  quantity: number;
  gross_amount: number;
  taxable_amount: number;
  tax_rate: number;
  tax_amount: number;
  authority: OrderTaxAuthority;
  exempt_amount: number;

  tax_amount_in_merchant_currency: number;
  gross_amount_in_merchant_currency: number;
  taxable_amount_in_merchant_currency: number;
};

export type OrderTaxInfo = {
  net_tax: number;
  sales_tax: number;
  tax_items: ReadonlyArray<OrderTaxItem>;
  refund_tax: number;

  net_tax_in_merchant_currency: number;
  sales_tax_in_merchant_currency: number;
  refund_tax_in_merchant_currency: number;

  remit_type: RemitType;
  authority_country_code: CountryCode;
  authority_currency_code: string;
  merchant_currency_code: string;
  is_redacted?: boolean;
};

export default class TaxEnrollmentV2State {
  @observable
  savedTaxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;

  @observable
  pendingTaxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;

  @observable
  enrollableCountries: ReadonlyArray<PickedEnrollableCountry>;

  @observable
  selectedCountries: Set<CountryCode> = new Set();

  @observable
  submittedSettings = false;

  @observable
  countryOfDomicile: CountryCode | null | undefined;

  @observable
  euStandardShipFromCountryCode: CountryCode | undefined;

  @observable
  euWishExpressShipFromCountryCode: CountryCode | undefined;

  @observable
  usMarketplaceStates: ReadonlyArray<string>;

  @observable
  usMarketplaceMunicipalities: ReadonlyArray<PickedUSMarketplaceMunicipalities>;

  @observable
  usNoStateLevelTaxIDRequiredStates: ReadonlyArray<string>;

  @observable
  marketplaceUnions: ReadonlyArray<PickedTaxMarketplaceUnion>;

  @observable
  caPstQstProvinces: ReadonlyArray<string>;

  @observable
  caMarketplaceProvinces: ReadonlyArray<string>;

  @observable
  entityType: UserEntityType;

  @observable
  hasCompletedSellerVerification: boolean;

  @observable
  euVatSelfRemittanceEligible: boolean | null | undefined;

  @observable
  euVatEntityStatus: CommerceMerchantEuEntityStatus | null | undefined;

  @observable
  isEuVatLaunched: boolean | null | undefined;

  @observable
  isOss: boolean | null | undefined;

  @observable
  ossCountryCode: CountryCode | null | undefined;

  @observable
  ossNumber: string | null | undefined;

  @observable
  euVatCountryCodes: ReadonlySet<CountryCode>;

  shippingOrigins:
    | ReadonlyArray<PickedShippingOriginSettings>
    | null
    | undefined;

  usNomadStates: UsTaxConstants["nomadStates"];

  usHomeRuleStates: UsTaxConstants["homeRuleStates"];

  constructor(params: {
    savedTaxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
    savedCountryOfDomicile: CountryCode | null | undefined;
    entityType: UserEntityType | null | undefined;
    usMarketplaceStates: ReadonlyArray<string>;
    usMarketplaceMunicipalities: ReadonlyArray<PickedUSMarketplaceMunicipalities>;
    usNoStateLevelTaxIDRequiredStates: ReadonlyArray<string>;
    marketplaceUnions: ReadonlyArray<PickedTaxMarketplaceUnion>;
    shippingOrigins: ReadonlyArray<PickedShippingOriginSettings>;
    usNomadStates: UsTaxConstants["nomadStates"];
    usHomeRuleStates: UsTaxConstants["homeRuleStates"];
    caPstQstProvinces: ReadonlyArray<string>;
    caMarketplaceProvinces: ReadonlyArray<string>;
    hasCompletedSellerVerification: boolean;
    enrollableCountries: ReadonlyArray<PickedEnrollableCountry>;
    euVatSelfRemittanceEligible: boolean | null | undefined;
    euVatEntityStatus: CommerceMerchantEuEntityStatus | null | undefined;
    isEuVatLaunched: boolean | null | undefined;
    isOss: boolean | null | undefined;
    euVatCountryCodes: ReadonlySet<CountryCode>;
  }) {
    this.savedTaxInfos = [...params.savedTaxInfos] || [];
    this.pendingTaxInfos = [...params.savedTaxInfos] || [];
    this.countryOfDomicile = params.savedCountryOfDomicile;
    this.usMarketplaceStates = params.usMarketplaceStates;
    this.usMarketplaceMunicipalities = params.usMarketplaceMunicipalities;
    this.usNoStateLevelTaxIDRequiredStates =
      params.usNoStateLevelTaxIDRequiredStates;
    this.marketplaceUnions = params.marketplaceUnions;
    this.shippingOrigins = params.shippingOrigins;
    this.entityType = params.entityType || "COMPANY";
    this.usNomadStates = params.usNomadStates;
    this.usHomeRuleStates = params.usHomeRuleStates;
    this.caPstQstProvinces = params.caPstQstProvinces;
    this.caMarketplaceProvinces = params.caMarketplaceProvinces;
    this.entityType = params.entityType || "COMPANY";
    this.hasCompletedSellerVerification = params.hasCompletedSellerVerification;
    this.enrollableCountries = params.enrollableCountries;
    this.euVatSelfRemittanceEligible = params.euVatSelfRemittanceEligible;
    this.euVatEntityStatus = params.euVatEntityStatus;
    this.isEuVatLaunched = params.isEuVatLaunched;
    this.isOss = params.isOss;
    this.euVatCountryCodes = params.euVatCountryCodes;

    if (params.shippingOrigins) {
      const euOriginExpress = params.shippingOrigins.find(
        (origin) =>
          origin.destinationRegion == "EU" && origin.shippingType == "1",
      );
      this.euWishExpressShipFromCountryCode = <CountryCode>(
        euOriginExpress?.originCountryCode
      );
      const euOriginStandard = params.shippingOrigins.find(
        (origin) =>
          origin.destinationRegion == "EU" && origin.shippingType == "0",
      );
      this.euStandardShipFromCountryCode = <CountryCode>(
        euOriginStandard?.originCountryCode
      );
    }

    for (const info of this.savedTaxInfos) {
      const enrollableCountriesSet = new Set(
        this.enrollableCountries.map(({ code }) => code),
      );
      if (enrollableCountriesSet.has(info.countryCode)) {
        this.setCountrySelected(info.countryCode, true);
      }
    }
  }

  @computed
  get hasTaxSettings(): boolean {
    return this.savedTaxInfos.some((info) => info.id != null);
  }

  @computed
  get currentCountries(): ReadonlyArray<CountryCode> {
    return this.selectedCountries ? Array.from(this.selectedCountries) : [];
  }

  @computed
  get currentNonEuCountries(): ReadonlyArray<CountryCode> {
    return this.currentCountries.filter(
      (cc) => this.euVatCountryCodes != null && !this.euVatCountryCodes.has(cc),
    );
  }

  @computed
  get currentEUCountries(): ReadonlyArray<CountryCode> {
    return this.currentCountries.filter(
      (cc) => this.euVatCountryCodes != null && this.euVatCountryCodes.has(cc),
    );
  }

  @computed
  get taxConstantsCA(): CATaxConstants {
    const { CA } = states;
    const allCAProvinces = Object.keys(CA);
    const pstAndQstCaProvinceCodes = this.caPstQstProvinces;
    const mpfCaProvinceCodes = this.caMarketplaceProvinces;
    const hstCaProvinceCodes = ["NB", "NL", "NS", "ON", "PE"];
    return {
      type: "CA_TAX_CONSTANTS",
      pstAndQstCaProvinceCodes,
      mpfCaProvinceCodes,
      hstCaProvinceCodes,
      otherCaProvinceCodes: allCAProvinces.filter(
        (province) =>
          ![
            ...pstAndQstCaProvinceCodes,
            ...mpfCaProvinceCodes,
            ...hstCaProvinceCodes,
          ].includes(province),
      ),
    };
  }

  @computed
  get nonEuCountriesList(): ReadonlyArray<CountryCode> {
    return this.enrollableCountries
      .filter(
        ({ code }) =>
          this.euVatCountryCodes != null && !this.euVatCountryCodes.has(code),
      )
      .map(({ code }) => code);
  }

  @computed
  get euCountriesList(): ReadonlyArray<CountryCode> {
    return this.enrollableCountries
      .filter(
        ({ code }) =>
          this.euVatCountryCodes != null && this.euVatCountryCodes.has(code),
      )
      .map(({ code }) => code);
  }

  @computed
  get countrySteps(): ReadonlyArray<FlowStep> {
    const nonEuSteps = this.nonEuCountriesList.map((countryCode) => ({
      countryCode,
      required: this.currentCountries.includes(countryCode),
    }));

    const ossSteps =
      this.ossCountryCode === "DE"
        ? [
            ...nonEuSteps,
            ...this.euCountriesList
              .filter((countryCode) => countryCode === "DE")
              .map((countryCode) => ({
                countryCode,
                required: this.currentEUCountries.includes(countryCode),
              })),
          ]
        : nonEuSteps;

    const steps: ReadonlyArray<FlowStep> = this.isOss
      ? ossSteps
      : [
          ...nonEuSteps,
          ...this.euCountriesList.map((countryCode) => ({
            countryCode,
            required: this.currentEUCountries.includes(countryCode),
          })),
        ];

    return steps.filter((step) => step.required);
  }

  @computed
  get currentCountryCode(): string | null | undefined {
    const routeStore = RouteStore.instance();
    const { countryCode } = routeStore.pathParams(
      "/tax/v2-enroll/:countryCode",
    );

    if (countryCode) {
      return countryCode;
    }

    return routeStore.pathParams("/tax/v2-enroll/:countryCode/:substep")
      .countryCode;
  }

  @computed
  get currentIndex(): number {
    const countryCode = this.currentCountryCode;
    return _.findIndex(this.countrySteps, { countryCode } as any);
  }

  @computed
  get previousStepPath(): string | null | undefined {
    const routeStore = RouteStore.instance();
    const { currentIndex, currentCountryCode, countryOfDomicile } = this;

    if (countryOfDomicile == null || currentCountryCode == null) {
      return "/tax/v2-enroll";
    }

    if (routeStore.currentPath === "/tax/v2-enroll/review") {
      const step = this.countrySteps[this.countrySteps.length - 1];
      return `/tax/v2-enroll/${step.countryCode}`;
    }

    if (currentIndex <= 0 || currentIndex > this.countrySteps.length) {
      return "/tax/v2-enroll";
    }

    const step = this.countrySteps[currentIndex - 1];
    return `/tax/v2-enroll/${step.countryCode}`;
  }

  @computed
  get nextStepPath(): string | null | undefined {
    const routeStore = RouteStore.instance();
    const { countrySteps } = this;
    const nextCountry = () => {
      if (countrySteps.length > 0) {
        const nextStep = countrySteps[0];
        return `/tax/v2-enroll/${nextStep.countryCode}`;
      }

      return null;
    };

    if (routeStore.currentPath === "/tax/v2-enroll") {
      if (this.countrySteps.length === 0) {
        return null;
      }

      return nextCountry();
    }

    if (routeStore.currentPath === "/tax/v2-enroll/review") {
      return null;
    }

    const { currentIndex } = this;
    if (currentIndex < 0) {
      return "/tax/v2-enroll";
    }

    if (currentIndex >= this.countrySteps.length - 1) {
      if (routeStore.currentPath !== "/tax/v2-enroll/review") {
        return "/tax/v2-enroll/review";
      }

      return null;
    }

    const nextStep = this.countrySteps[currentIndex + 1];
    return `/tax/v2-enroll/${nextStep.countryCode}`;
  }

  @computed
  get currentSubStep(): number {
    const routeStore = RouteStore.instance();
    if (routeStore.currentPath === "/tax/v2-enroll") {
      return 1;
    }

    return this.currentIndex + 2 + (this.currentEUCountries.length > 0 ? 1 : 0);
  }

  @computed
  get totalSubSteps(): number {
    return (
      this.countrySteps.length +
      (this.currentEUCountries.length > 0 ? 1 : 0) +
      1
    );
  }

  @computed
  get readyToSave(): boolean {
    return this.nextStepPath == null;
  }

  @computed
  get needStateTaxIdsFromUS(): boolean {
    return this.pendingTaxInfos.some(
      (info) =>
        info.countryCode === "US" &&
        info.authorityLevel !== "COUNTRY" &&
        info.stateCode != null &&
        (info.stateCode === "AK" ||
          !this.usNoStateLevelTaxIDRequiredStates.includes(info.stateCode)),
    );
  }

  @action
  pushNext = () => {
    const { nextStepPath } = this;
    const routeStore = RouteStore.instance();

    if (nextStepPath != null) {
      routeStore.push(nextStepPath, routeStore.queryParams);
    } else {
      new ConfirmTaxSettingsModal({ editState: this }).render();
    }
  };

  @action
  pushPrevious = () => {
    const { previousStepPath } = this;
    const routeStore = RouteStore.instance();
    if (previousStepPath != null) {
      routeStore.push(previousStepPath, routeStore.queryParams);
    } else {
      new ConfirmTaxSettingsModal({ editState: this }).render();
    }
  };

  currentStates = (countryCode: CountryCode): ReadonlyArray<string> => {
    const stateCodes = this.pendingTaxInfos
      .filter(
        (info) => info.countryCode === countryCode && info.stateCode != null,
      )
      .map((info) => info.stateCode) as ReadonlyArray<string>;

    return Array.from(new Set(stateCodes));
  };

  @action
  setCountrySelected(countryCode: CountryCode, selected: boolean) {
    if (!this.selectedCountries) this.selectedCountries = new Set();
    if (selected) {
      this.selectedCountries.add(countryCode);

      if (countryCode !== "US") {
        const index = _.findIndex(this.pendingTaxInfos, {
          countryCode,
          authorityLevel: "COUNTRY",
        });
        if (index < 0) {
          const infoToAdd = new CommerceMerchantTaxInfo({
            country_code: countryCode,
            authority_level: "COUNTRY",
            numberIsInvalid: true,
            display_name: countryCode,
            eu_vat_country_codes: this.euVatCountryCodes,
          });
          if (!this.pendingTaxInfos) {
            this.pendingTaxInfos = [infoToAdd];
          } else {
            this.pendingTaxInfos = [...this.pendingTaxInfos, infoToAdd];
          }
        }
      }
    } else {
      this.selectedCountries.delete(countryCode);

      // Remove pending settings.
      this.pendingTaxInfos = this.pendingTaxInfos.filter(
        (info) => info.countryCode !== countryCode,
      );
    }
  }

  @computed
  get validateOssNumber(): boolean {
    return this.ossNumber != null;
  }

  @action
  setOssSelected(countryCode: CountryCode, selected: boolean) {
    if (!this.selectedCountries) this.selectedCountries = new Set();
    if (
      selected &&
      this.euVatCountryCodes != null &&
      this.euVatCountryCodes.has(countryCode)
    ) {
      this.selectedCountries.add(countryCode);

      const index = _.findIndex(this.pendingTaxInfos, {
        countryCode,
        authorityLevel: "COUNTRY",
      });
      const ossPendingTaxInfo = new CommerceMerchantTaxInfo({
        country_code: countryCode,
        authority_level: "COUNTRY",
        tax_number: this.ossNumber,
        oss_registration_country_code: this.ossCountryCode,
        numberIsInvalid: this.validateOssNumber === false,
        display_name: countryCode,
        eu_vat_country_codes: this.euVatCountryCodes,
      });
      if (index < 0) {
        this.pendingTaxInfos = [...this.pendingTaxInfos, ossPendingTaxInfo];
      } else {
        this.pendingTaxInfos = [
          ...this.pendingTaxInfos.filter(
            (info) => info.countryCode !== countryCode,
          ),
          ossPendingTaxInfo,
        ];
      }
    } else if (!selected) {
      this.selectedCountries.delete(countryCode);
      this.pendingTaxInfos = this.pendingTaxInfos.filter(
        (info) => info.countryCode !== countryCode,
      );
    }
  }

  @action
  addCountry(info: CommerceMerchantTaxInfo) {
    this.pendingTaxInfos = [...this.pendingTaxInfos, info];
  }

  static debugValue(countryCode: string): string | null | undefined {
    const values: {
      [countryCode: string]: string;
    } = {
      FR: "FRA1123456789",
      DE: "DE123456789",
      ES: "ESA1234567A",
      GB: "GB123456789",
      SE: "SE123456789012",
      IT: "IT12345678901",
      AL: "K12345678B",
      AT: "ATU12345678",
      BE: "BE1234567890",
      BA: "123456789012",
      BG: "1234567890",
      HR: "HR12345678912",
      CY: "CY12345678A",
      CZ: "CZ123456789",
      DK: "DK12345678",
      EE: "EE123456789",
      FI: "FI12345678",
      GR: "EL123456789",
      HU: "HU12345678",
      IE: "IE1234567A",
      LV: "LV12345678901",
      LI: "12 123",
      LT: "LT123456789012",
      LU: "LU12345678",
      MK: "MK1234567890123",
      NL: "NL123456789B12",
      NO: "NO 123123123 MVA",
      PL: "123-12-12-123",
      PT: "PT123456789",
      RO: "RO123456",
      RU: "123456789012",
      RS: "123456789",
      SK: "SK1234567890",
      SI: "SI12345678",
      TR: "123 123 1234",
      UA: "123123123123",
      MC: "FRA1123456789",
      CH: "CHE542.083.206RCTVA",
      OSS: "1234788699",
    };
    return values[countryCode];
  }

  @action
  setStateSelected = (params: {
    countryCode: CountryCode | null | undefined;
    stateCode: string | null | undefined;
    selected: boolean;
  }) => {
    const { countryCode, stateCode, selected } = params;

    if (countryCode == null || stateCode == null) {
      return;
    }

    if (selected) {
      const hasState = this.pendingTaxInfos.some(
        (info) =>
          info.countryCode === countryCode &&
          info.stateCode === stateCode &&
          info.authorityLevel === "STATE",
      );
      if (hasState) {
        return;
      }

      const needNumber =
        this.usNoStateLevelTaxIDRequiredStates.includes(stateCode) === false;
      this.pendingTaxInfos = [
        ...this.pendingTaxInfos,
        new CommerceMerchantTaxInfo({
          state_code: stateCode,
          country_code: countryCode,
          authority_level: "STATE",
          numberIsInvalid: needNumber,
          display_name: stateCode,
          eu_vat_country_codes: this.euVatCountryCodes,
        }),
      ];
    } else {
      this.pendingTaxInfos = this.pendingTaxInfos.filter(
        (info) =>
          !(info.countryCode === countryCode && info.stateCode === stateCode),
      );
    }
  };

  @action
  getCountryLevelSettings = (
    countryCode: string,
  ): CommerceMerchantTaxInfo | null | undefined => {
    return _.find(this.pendingTaxInfos, {
      countryCode,
      authorityLevel: "COUNTRY",
    } as any);
  };

  @action
  setLocalAuthoritySelected = (
    params: {
      countryCode: CountryCode;
      stateCode: string;
      displayName: string;
      authorityLevel: TaxSettingAuthorityLevel;
    },
    selected: boolean,
  ) => {
    if (selected) {
      const index = _.findIndex(this.pendingTaxInfos, params);
      if (index >= 0) {
        return;
      }

      this.pendingTaxInfos = [
        ...this.pendingTaxInfos,
        new CommerceMerchantTaxInfo({
          country_code: params.countryCode,
          state_code: params.stateCode,
          display_name: params.displayName,
          authority_level: params.authorityLevel,
          eu_vat_country_codes: this.euVatCountryCodes,
        }),
      ];
    } else {
      let index = _.findIndex(this.pendingTaxInfos, params);
      if (index < 0) {
        return;
      }

      const infos = [...this.pendingTaxInfos];
      while (index >= 0) {
        infos.splice(index, 1);
        index = _.findIndex(infos, params);
      }
      this.pendingTaxInfos = infos;
    }
  };

  isLocalAuthoritySelected = (params: {
    countryCode: string;
    stateCode: string;
    displayName: string;
    authorityLevel: TaxSettingAuthorityLevel;
  }): boolean => {
    return _.find(this.pendingTaxInfos, params) != null;
  };

  hasStartedSettingsForCountry = (countryCode: string): boolean => {
    const countryInfos: ReadonlyArray<CommerceMerchantTaxInfo> =
      this.pendingTaxInfos.filter((info) => info.countryCode === countryCode);
    return (
      countryInfos.length > 1 ||
      (countryInfos.length === 1 && !_.isEmpty(countryInfos[0].taxNumber))
    );
  };

  @computed
  get hasStartedEdits(): boolean {
    return this.currentCountries.some((countryCode) =>
      this.hasStartedSettingsForCountry(countryCode),
    );
  }

  countryIsReadyForSubmission = (countryCode: string): boolean => {
    return this.pendingTaxInfos
      .filter((info) => info.countryCode === countryCode)
      .every((info) => !info.numberIsInvalid);
  };

  getSaveReadyTaxInfos = (): ReadonlyArray<CommerceMerchantTaxInfo> => {
    let readyTaxInfos: ReadonlyArray<CommerceMerchantTaxInfo> = [];
    for (const countryCode of this.currentCountries) {
      const countryLevelInfos = this.pendingTaxInfos.filter(
        (info) =>
          info.countryCode === countryCode && info.authorityLevel === "COUNTRY",
      );
      readyTaxInfos = [...readyTaxInfos, ...countryLevelInfos];

      for (const stateCode of this.currentStates(countryCode)) {
        const stateLevelInfos = this.pendingTaxInfos.filter(
          (info) =>
            info.countryCode === countryCode &&
            info.stateCode === stateCode &&
            info.authorityLevel === "STATE",
        );
        readyTaxInfos = [...readyTaxInfos, ...stateLevelInfos];

        const localLevelInfos = this.pendingTaxInfos.filter(
          (info) =>
            info.countryCode === countryCode &&
            info.stateCode === stateCode &&
            info.authorityLevel != null &&
            ["CITY", "DISTRICT", "COUNTY"].includes(info.authorityLevel),
        );

        readyTaxInfos = [...readyTaxInfos, ...localLevelInfos];
      }
    }

    return readyTaxInfos;
  };

  submit = async (doNotRedirect?: boolean) => {
    const {
      entityType,
      countryOfDomicile,
      euStandardShipFromCountryCode,
      euWishExpressShipFromCountryCode,
    } = this;
    const { client } = ApolloStore.instance();

    const toastStore = ToastStore.instance();

    if (countryOfDomicile == null) {
      toastStore.error(
        i`We cannot detect your country of domicile. Please update it to continue.`,
      );
      return;
    }

    const canSubmit = this.pendingTaxInfos.every((info) => info.canSubmit());
    if (!canSubmit) {
      toastStore.error(i`Cannot submit tax information`);
      return;
    }

    const settings: ReadonlyArray<TaxSettingsInput> = this.pendingTaxInfos.map(
      (info) => ({
        stateCode: info.stateCode,
        taxNumber: info.taxNumber,
        countryCode: info.countryCode,
        displayName: info.displayName,
        authorityLevel: info.authorityLevel,
        certificateFileUrl: info.certificateFileUrl,
        mxDefaultShipFromIsMx: info.mxDefaultShipFromIsMX,
        ustSt1T1Number: info.deUstSt1T1Number,
        taxNumberType: info.getTaxNumberType(entityType, this.isOss),
        ossRegistrationCountryCode: info.ossRegistrationCountryCode,
      }),
    );

    const shipFromDict: {
      [countryCode: string]: string;
    } = {};

    if (euStandardShipFromCountryCode != null) {
      shipFromDict["EU-0"] = euStandardShipFromCountryCode;
    }

    if (euWishExpressShipFromCountryCode != null) {
      shipFromDict["EU-1"] = euWishExpressShipFromCountryCode;
    }

    const gbShipFromLocation = this.pendingTaxInfos.find(
      ({ countryCode }) => countryCode === "GB",
    )?.gbShipFromLocation;

    if (gbShipFromLocation != null) {
      shipFromDict["GB-0"] = gbShipFromLocation;
    }

    const input: UpsertTaxSettingsInput = {
      settings,
      countryOfDomicile,
      euStandardShipFromCc: euStandardShipFromCountryCode,
      euWishExpressShipFromCc: euWishExpressShipFromCountryCode,
    };

    const { data } = await client.mutate<
      UpsertTaxSettingsResponseType,
      UpsertTaxSettingsRequestType
    >({
      mutation: UPSERT_TAX_SETTINGS,
      variables: { input },
    });

    if (data == null || !data.currentUser?.merchant) {
      this.submittedSettings = false;
      toastStore.negative(i`Something went wrong`);
      return;
    }

    const {
      currentUser: {
        merchant: {
          taxSettings: {
            upsertTaxSettings: { ok, errorMessage },
          },
        },
      },
    } = data;

    this.submittedSettings = ok;

    if (!this.submittedSettings && errorMessage) {
      toastStore.error(errorMessage);
    }

    const updatedCountryCodes = this.pendingTaxInfos.map(
      (taxInfo) => taxInfo.countryCode,
    );
    const updatedCountryCodesParam = _.uniq(updatedCountryCodes).join(",");

    if (!doNotRedirect) {
      await NavigationStore.instance().navigate(
        `/tax/v2-settings?updated=${updatedCountryCodesParam}`,
      );
    }
  };
}

class ConfirmTaxSettingsModal extends ConfirmationModal {
  constructor({ editState }: { readonly editState: TaxEnrollmentV2State }) {
    super(() =>
      React.createElement(
        Markdown,
        {
          style: {
            maxWidth: 328,
            padding: 28,
            textAlign: "center",
          },
          text:
            i`Submit your tax settings if everything looks good. ` +
            i`You can update the taxes settings in the future.`,
        },
        null,
      ),
    );

    this.setHeader({
      title: i`Submit your Tax Settings`,
    });
    this.setIllustration("signature");
    this.setCancel(i`Cancel`);
    this.setAction(i`Confirm`, async () => {
      await editState.submit();
    });
  }
}
