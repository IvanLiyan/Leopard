//
//  stores/TaxStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/17/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* External Libraries */
import { computed, action } from "mobx";

/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";
import { getCountryName } from "@toolkit/countries";
import { StateCode } from "@ContextLogic/lego/toolkit/states";
import { EuropeanCountries } from "@toolkit/countries";
import { USStatesNoTerritories } from "@ContextLogic/lego/toolkit/states";

/* Merchant API */
import * as taxApi from "@merchant/api/tax";

/* Toolkit */
import * as logger from "@toolkit/logger";

/* Relative Imports */
import ToastStore from "../../stores/ToastStore";
import UserStore from "../../stores/UserStore";
import TodoStore from "./TodoStore";
import NavigationStore from "../../stores/NavigationStore";

import { TaxNonEUCountries, TaxEUCountries } from "@toolkit/tax/enrollment";
import { UserEntityType } from "@schema/types";

/* Model */
import {
  TaxConstants,
  isCATaxConstants,
  UnionCode,
  DropdownData,
  isEuDropdown,
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
export default class TaxStore {
  @computed
  get availableCountries(): ReadonlyArray<CountryCode> {
    return [...this.availableEUCountries, ...this.availableNonEUCountries];
  }

  @computed
  get availableEUCountries(): ReadonlyArray<CountryCode> {
    return TaxEUCountries;
  }

  @computed
  get availableNonEUCountries(): ReadonlyArray<CountryCode> {
    return TaxNonEUCountries;
  }

  @computed
  get availableUSStates(): ReadonlyArray<StateCode> {
    return USStatesNoTerritories;
  }

  getTaxNumberName({
    countryCode,
    stateCode,
    entityType,
    taxConstants,
    isOss,
  }: {
    countryCode: CountryCode;
    stateCode?: string | null | undefined;
    entityType?: UserEntityType | null;
    taxConstants?: TaxConstants | undefined;
    isOss?: boolean | null | undefined;
  }): string {
    if (EuropeanCountries.has(countryCode)) {
      if (isOss && countryCode !== "MC") {
        return i`One-Stop Shop (OSS)`;
      }

      if (entityType === "INDIVIDUAL") {
        return i`Tax Identification Number (TIN)`;
      }
      return i`Value Added Tax (VAT)/Goods and Services Tax (GST)`;
    }

    if (countryCode === "US") {
      return i`Tax Identification Number (TIN)`;
    }

    if (countryCode === "CA") {
      if (stateCode == null) {
        return i`Goods and Services Tax (GST)`;
      }

      if (stateCode === "QC") {
        return i`Québec Sales Tax (QST)`;
      }

      if (taxConstants && isCATaxConstants(taxConstants)) {
        const { hstCaProvinceCodes } = taxConstants;

        if (hstCaProvinceCodes && hstCaProvinceCodes.includes(stateCode)) {
          return i`Harmonized Sales Tax (HST)`;
        }
      }

      return i`Provincial Sales Taxes (PST)`;
    }

    if (countryCode === "MX") {
      return i`Mexico tax identification number (RFC ID)`;
    }

    return i`Tax ID`;
  }

  getTaxDescription({
    countryCode,
    stateCode,
    entityType,
    taxConstants,
    isOss,
  }: {
    countryCode: CountryCode;
    stateCode?: string | null | undefined;
    entityType?: UserEntityType | null;
    taxConstants?: TaxConstants | undefined;
    isOss?: boolean | null | undefined;
  }): string | null | undefined {
    if (EuropeanCountries.has(countryCode)) {
      const learnMoreLink = `https://ec.europa.eu/taxation_customs/business/vat/oss_en`;
      if (isOss && countryCode !== "MC") {
        return (
          i`The One-Stop Shop (OSS) registration enables VAT collection from all EU ` +
          i`countries at once. ` +
          i`[Learn more](${learnMoreLink})`
        );
      }
      if (entityType === "INDIVIDUAL") {
        return (
          i`The taxpayer identification number (TIN) is the unique ` +
          i`identifier assigned to the account holder by the tax ` +
          i`administration in the account holder’s jurisdiction of tax ` +
          i`residence.`
        );
      }
      return (
        i`Value Added Tax is an indirect tax on the consumption of ` +
        i`goods and services collected at each stage of the production and ` +
        i`distribution process (i.e. a transactional tax), but ultimately ` +
        i`borne by the end consumer as the tax is effectively passed down ` +
        i`along the supply chain. VAT is commonly, subject to exceptions, ` +
        i`payable in the country where the customer is located or the ultimate ` +
        i`destination of the goods.`
      );
    }

    if (countryCode === "US") {
      return (
        i`Tax Identity Number (TIN) is commonly used term in ` +
        i`the USA (“TIN”), but may also be found in foreign jurisdictions ` +
        i`as well (“foreign TIN”). From a USA perspective, A Taxpayer ` +
        i`Identification Number (TIN) is an identification number used ` +
        i`by the Internal Revenue Service (IRS) in the administration ` +
        i`of tax laws. A USA TIN must be furnished on returns, statements, ` +
        i`and other tax related documents.`
      );
    }

    if (countryCode === "CA") {
      if (stateCode == null) {
        return (
          i`Goods and Services Tax is similar to Value-Added ` +
          i`Tax and is an indirect tax on the consumption of goods ` +
          i`and services collected at each stage of the production and ` +
          i`distribution process (i.e. a transactional tax), but ultimately ` +
          i`borne by the end consumer as the tax is effectively passed down ` +
          i`along the supply chain. VAT is commonly imposed and payable in ` +
          i`the country where the customer is located or the ultimate ` +
          i`destination of the goods, subject to exceptions.`
        );
      }

      if (stateCode === "QC") {
        return (
          i`Quebec Sales Tax is a separate provincial sales tax, ` +
          i`specific to Canada, for the collection of most property ` +
          i`and services in Quebec, Canada.`
        );
      }

      if (taxConstants && isCATaxConstants(taxConstants)) {
        const { mpfCaProvinceCodes, hstCaProvinceCodes } = taxConstants;
        if (mpfCaProvinceCodes.includes(stateCode)) {
          return (
            i`PST (Provincial Sales Tax) will be collected and remitted by ` +
            i`Wish. The merchant is still responsible for remitting GST ` +
            i`(Goods and Services Tax).`
          );
        }

        if (hstCaProvinceCodes && hstCaProvinceCodes.includes(stateCode)) {
          return (
            i`Harmonized Sales tax is a consumption / transactional ` +
            i`tax, specific to Canada. It is used in provinces where ` +
            i`both the federal goods and services tax (GST) and the ` +
            i`regional provincial sales tax (PST) have been combined ` +
            i`into a single value added sales tax.`
          );
        }
      }

      return (
        i`Provincial Sales Tax is a form of sales tax, ` +
        i`specific to Canada, and applied to goods and particular ` +
        i`services in some Canadian provinces.`
      );
    }

    if (countryCode === "MX") {
      const part1 =
        i`Please provide a valid tax ID (Registro Federal ` +
        i`Contribuyentes ID, i.e. RFC ID) for your registered ` +
        i`business in Mexico to proceed further.`;
      const part2 =
        i`If your account type is Individual (persona fisica), ` +
        i`your RFC ID is **${13} characters long** and is made ` +
        i`up of letters and numbers.`;
      const part3 =
        i`If your account type is Business (persona moral), ` +
        i`your RFC ID is **${12} characters long** and is made ` +
        i`up of letters and numbers.`;
      return `${part1}${"\n\n"}&nbsp;${"\n\n"}${part2}${"\n\n"}&nbsp;${"\n\n"}${part3}`;
    }

    return null;
  }

  async deleteCountry(
    countryCode: CountryCode | UnionCode,
    dropdown?: DropdownData,
  ) {
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();

    const countryName = getCountryName(countryCode);
    const displayName =
      countryCode === "EU" ? `the ${countryName}` : countryName;
    const thisCountry =
      countryCode === "EU" ? "these EU countries" : "this country";

    new ConfirmationModal(
      i`Are you sure you want to delete tax settings ` +
        i`for ${displayName}? Please note that this may ` +
        i`stop sales tax collection in ${thisCountry}.`,
    )
      .setHeader({
        title: i`Remove ${displayName}`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Yes, remove ${displayName}`, async () => {
        if (
          countryCode === "EU" &&
          dropdown != null &&
          isEuDropdown(dropdown)
        ) {
          await Promise.all(
            (dropdown?.euCountriesSettings || []).map(
              async ({
                authority: {
                  country: { code },
                },
              }) => {
                if (code != null) {
                  await taxApi
                    .deleteCountrySettings({ country_code: code })
                    .call();
                }
              },
            ),
          );
        } else {
          await taxApi
            .deleteCountrySettings({ country_code: countryCode })
            .call();
        }

        await navigationStore.reload();

        toastStore.positive(
          i`Tax settings for ${displayName} have been deleted`,
          {
            deferred: !navigationStore.isNavyBlueNav,
          },
        );
      })
      .render();
  }

  async declineFromTodoItem(todoId: string) {
    const toastStore = ToastStore.instance();
    await this.declineSetup(todoId, () => {
      toastStore.info(
        i`Tax enrollment will be available under ` +
          i`tax settings. Account > Tax Settings`,
        {
          link: {
            url: "/tax/settings",
            title: i`View tax settings`,
          },
          timeoutMs: 12000,
        },
      );
    });
  }

  @action
  async declineSetup(todoItemId: string, onDecline?: () => unknown) {
    const todoStore = TodoStore.instance();
    const { loggedInMerchantUser } = UserStore.instance();

    new ConfirmationModal(
      i`By declining to configure Tax Settings, you indicate that you do ` +
        i`not elect to provide any tax information to Wish for your store. ` +
        i`Merchants are still ultimately responsible and liable for the ` +
        i`accuracy and remittance of applicable VAT/GST and Sales Taxes due.`,
    )
      .setHeader({
        title: i`Decline configuring Tax Settings`,
      })
      .setIllustration("calculating")
      .setCancel(i`Cancel`)
      .setAction(i`Yes, decline`, async () => {
        await todoStore.markCompleted({
          id: todoItemId,
          declined: true,
        });

        logger.log("TAX_DECLINE_ENROLLMENT", {
          user_id: loggedInMerchantUser.id,
          merchant_id: loggedInMerchantUser.merchant_id,
        });

        if (onDecline) {
          onDecline();
        }
      })
      .render();
  }

  static instance(): TaxStore {
    let { taxStore } = window as any;
    if (taxStore == null) {
      taxStore = new TaxStore();
      (window as any).taxStore = taxStore;
    }
    return taxStore;
  }
}

export const useTaxStore = (): TaxStore => {
  return TaxStore.instance();
};
