/*
 * form-options.tsx
 *
 * Created by Don Sirivat on Mon Jan 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import CountryNames, { CountryCode } from "@toolkit/countries";
import { getCountryName } from "@toolkit/countries";
import {
  MerchantLeadNumberOfSkUs,
  MerchantLeadYearlyRevenue,
  MerchantLeadSellingYearsRange,
  MerchantLeadProductCategory,
} from "@schema/types";

export type SelectOption = {
  readonly value: string;
  readonly text: string;
};

export type ProductCategoryOption = {
  readonly value: MerchantLeadProductCategory;
  readonly text: string;
};

// select option types
export type SkuOption = {
  readonly value: SkuKeys;
  readonly text: string;
};
export type YearOption = {
  readonly value: YearKeys;
  readonly text: string;
};
export type RevenueOption = {
  readonly value: RevenueKeys;
  readonly text: string;
};

export const getCountryCodes = (): ReadonlyArray<SelectOption> => {
  const countryCodes = Object.keys(CountryNames) as CountryCode[];
  const countryCodeOptions = countryCodes.map((code) => {
    return { value: code, text: getCountryName(code) };
  });

  return countryCodeOptions;
};

// keys used for selection
export enum YearKeys {
  oneYear = "ONE_YEAR",
  threeYear = "THREE_YEAR",
  fiveYear = "FIVE_YEAR",
  tenYear = "TEN_YEAR",
}

export enum RevenueKeys {
  zero = "ZERO",
  fiftyThousand = "FIFTY_THOUSAND",
  twoHundredThousand = "TWO_HUNDRED_THOUSAND",
  fiveHundredThousand = "FIVE_HUNDRED_THOUSAND",
  oneMillion = "ONE_MILLION",
  cantSay = "CANT_SAY",
}

export enum SkuKeys {
  one = "ONE",
  fifty = "FIFTY",
  oneHundred = "ONE_HUNDRED",
  fiveHundred = "FIVE_HUNDRED",
  oneThousand = "ONE_THOUSAND",
}

// invite-only signup form select options
/* eslint-disable local-rules/unwrapped-i18n */
/* eslint-disable local-rules/use-formatCurrency */
export const numYearsSellingOptions: ReadonlyArray<YearOption> = [
  {
    value: YearKeys.oneYear,
    text: i`1 - 3 years`,
  },
  {
    value: YearKeys.threeYear,
    text: i`3 - 5 years`,
  },
  {
    value: YearKeys.fiveYear,
    text: i`5 - 10 years`,
  },
  {
    value: YearKeys.tenYear,
    text: i`10+ years`,
  },
];

export const yearsSellingMap: {
  [key in YearKeys]: MerchantLeadSellingYearsRange;
} = {
  ONE_YEAR: { start: 1, end: 3 },
  THREE_YEAR: { start: 3, end: 5 },
  FIVE_YEAR: { start: 5, end: 10 },
  TEN_YEAR: { start: 10, end: 0 },
};

export const yearlyRevenueOptions: ReadonlyArray<RevenueOption> = [
  {
    value: RevenueKeys.zero,
    text: i`$0 - $50,000`,
  },
  {
    value: RevenueKeys.fiftyThousand,
    text: i`$50,000 - $200,000`,
  },
  {
    value: RevenueKeys.twoHundredThousand,
    text: i`$200,000 - $500,000`,
  },
  {
    value: RevenueKeys.fiveHundredThousand,
    text: i`$500,000 - $1,000,000`,
  },
  {
    value: RevenueKeys.oneMillion,
    text: i`$1,000,000+`,
  },
  {
    value: RevenueKeys.cantSay,
    text: i`Can't say at this time`,
  },
];

export const revenueMap: { [key in RevenueKeys]: MerchantLeadYearlyRevenue } = {
  ZERO: {
    start: { amount: 0, currencyCode: "USD" },
    end: { amount: 50000, currencyCode: "USD" },
  },
  FIFTY_THOUSAND: {
    start: { amount: 50000, currencyCode: "USD" },
    end: { amount: 200000, currencyCode: "USD" },
  },
  TWO_HUNDRED_THOUSAND: {
    start: { amount: 200000, currencyCode: "USD" },
    end: { amount: 500000, currencyCode: "USD" },
  },
  FIVE_HUNDRED_THOUSAND: {
    start: { amount: 500000, currencyCode: "USD" },
    end: { amount: 1000000, currencyCode: "USD" },
  },
  ONE_MILLION: {
    start: { amount: 1000000, currencyCode: "USD" },
    end: { amount: 0, currencyCode: "USD" },
  },
  CANT_SAY: {
    start: { amount: 0, currencyCode: "USD" },
    end: { amount: 0, currencyCode: "USD" },
  },
};

export const numSkuOptions: ReadonlyArray<SkuOption> = [
  {
    value: SkuKeys.one,
    text: i`1 - 50`,
  },
  {
    value: SkuKeys.fifty,
    text: i`50 - 100`,
  },
  {
    value: SkuKeys.oneHundred,
    text: i`100 - 500`,
  },
  {
    value: SkuKeys.fiveHundred,
    text: i`500 - 1000`,
  },
  {
    value: SkuKeys.oneThousand,
    text: i`1,000+`,
  },
];

export const skuMap: { [key in SkuKeys]: MerchantLeadNumberOfSkUs } = {
  ONE: { start: 1, end: 50 },
  FIFTY: { start: 50, end: 100 },
  ONE_HUNDRED: { start: 100, end: 500 },
  FIVE_HUNDRED: { start: 500, end: 1000 },
  ONE_THOUSAND: { start: 1000, end: 0 },
};

export const productCategoryOptions: ReadonlyArray<ProductCategoryOption> = [
  {
    value: "ARTS_CRAFTS_AND_SEWING",
    text: i`Arts, Crafts & Sewing`,
  },
  {
    value: "BABY_AND_TODDLER",
    text: i`Baby & Toddler`,
  },
  {
    value: "BOOKS",
    text: i`Books`,
  },
  {
    value: "CARS_AND_AUTOMOTIVE",
    text: i`Cars & Automotive`,
  },
  {
    value: "CLOTHING_SHOES_AND_ACCESSORIES",
    text: i`Clothing, Shoes & Accessories`,
  },
  {
    value: "COLLECTABLES_AND_MEMORABILIA",
    text: i`Collectables & Memorabilia`,
  },
  {
    value: "ELECTRONICS_AND_TECHNOLOGY",
    text: i`Electronics & Technology`,
  },
  {
    value: "FOOD_AND_DRINK",
    text: i`Food & Drink`,
  },
  {
    value: "HEALTH_AND_BEAUTY",
    text: i`Health & Beauty`,
  },
  {
    value: "HOUSEHOLD_SUPPLIES",
    text: i`Household Supplies`,
  },
  {
    value: "HOME_GARDEN_AND_PETS",
    text: i`Home, Garden & Pets`,
  },
  {
    value: "JEWELLERY_AND_WATCHES",
    text: i`Jewellery & Watches`,
  },
  {
    value: "MOVIES_VIDEO_GAMES_AND_MUSIC",
    text: i`Movies, Video Games & Music`,
  },
  {
    value: "MUSICAL_INSTRUMENTS_AND_DJ",
    text: i`Musical Instruments & DJ`,
  },
  {
    value: "REFURBISHED_ELECTRONICS",
    text: i`Refurbished Electronics`,
  },
  {
    value: "SPORTS_AND_OUTDOORS",
    text: i`Sports & Outdoors`,
  },
  {
    value: "TOOLS_AND_DIY",
    text: i`Tools & DIY`,
  },
  {
    value: "TOYS_AND_GAMES",
    text: i`Toys & Games`,
  },
  {
    value: "OTHER",
    text: i`Other`,
  },
];

export const QuestionPrompts = {
  COMPANY_LEGAL_NAME: i`Legal Company name`,
  FIRST_NAME: i`First name`,
  LAST_NAME: i`Last name`,
  BUSINESS_EMAIL: i`Business email`,
  BUSINESS_PHONE: i`Business phone`,
  COUNTRY: i`Country/Region`,
  YEARS_SELLING: i`How long have you been selling products?`,
  REVENUE: i`What is your current yearly revenue?`,
  SKU: i`How many SKUs do you currently sell?`,
  CATEGORY: i`What is your primary product category?`,
  WEBSITE: i`Company Website or store profile`,
  PARTNER:
    i`Are you currently using ` +
    i`a 3rd party channel integration to manage your marketplace listings?`,
  PLATFORM: i`List the platforms you use to help manage your business below`,
};
