import CountryNames, { getCountryName } from "@core/toolkit/countries";
import { ci18n } from "@core/toolkit/i18n";
import {
  MerchantLeadNumberOfSkUs,
  MerchantLeadYearlyRevenue,
  MerchantLeadSellingYearsRange,
  MerchantLeadProductCategory,
  CountryCode,
} from "@schema";

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
    text: ci18n(
      "A response to how long has your store been selling",
      "1 - 3 year",
    ),
  },
  {
    value: YearKeys.threeYear,
    text: ci18n(
      "A response to how long has your store been selling",
      "3 - 5 year",
    ),
  },
  {
    value: YearKeys.fiveYear,
    text: ci18n(
      "A response to how long has your store been selling",
      "5 - 10 year",
    ),
  },
  {
    value: YearKeys.tenYear,
    text: ci18n(
      "A response to how long has your store been selling",
      "10+ year",
    ),
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
    text: ci18n("A product category", "Arts, Crafts & Sewing"),
  },
  {
    value: "BABY_AND_TODDLER",
    text: ci18n("A product category", "Baby & Toddler"),
  },
  {
    value: "BOOKS",
    text: ci18n("A product category", "Books"),
  },
  {
    value: "CARS_AND_AUTOMOTIVE",
    text: ci18n("A product category", "Cars & Automotive"),
  },
  {
    value: "CLOTHING_SHOES_AND_ACCESSORIES",
    text: ci18n("A product category", "Clothing, Shoes & Accessories"),
  },
  {
    value: "COLLECTABLES_AND_MEMORABILIA",
    text: ci18n("A product category", "Collectables & Memorabilia"),
  },
  {
    value: "ELECTRONICS_AND_TECHNOLOGY",
    text: ci18n("A product category", "Electronics & Technology"),
  },
  {
    value: "FOOD_AND_DRINK",
    text: ci18n("A product category", "Food & Drink"),
  },
  {
    value: "HEALTH_AND_BEAUTY",
    text: ci18n("A product category", "Health & Beauty"),
  },
  {
    value: "HOUSEHOLD_SUPPLIES",
    text: ci18n("A product category", "Household Supplies"),
  },
  {
    value: "HOME_GARDEN_AND_PETS",
    text: ci18n("A product category", "Home, Garden & Pets"),
  },
  {
    value: "JEWELLERY_AND_WATCHES",
    text: ci18n("A product category", "Jewellery & Watches"),
  },
  {
    value: "MOVIES_VIDEO_GAMES_AND_MUSIC",
    text: ci18n("A product category", "Movies, Video Games & Music"),
  },
  {
    value: "MUSICAL_INSTRUMENTS_AND_DJ",
    text: ci18n("A product category", "Musical Instruments & DJ"),
  },
  {
    value: "REFURBISHED_ELECTRONICS",
    text: ci18n("A product category", "Refurbished Electronics"),
  },
  {
    value: "SPORTS_AND_OUTDOORS",
    text: ci18n("A product category", "Sports & Outdoors"),
  },
  {
    value: "TOOLS_AND_DIY",
    text: ci18n("A product category", "Tools & DIY"),
  },
  {
    value: "TOYS_AND_GAMES",
    text: ci18n("A product category", "Toys & Games"),
  },
  {
    value: "OTHER",
    text: ci18n("A product category", "Other"),
  },
];

export const QuestionPrompts = {
  COMPANY_LEGAL_NAME: ci18n(
    "Question prompt for merchants to enter their legal company name",
    "Legal Company name",
  ),
  FIRST_NAME: ci18n(
    "Question prompt for merchants to enter their first name",
    "First name",
  ),
  LAST_NAME: ci18n(
    "Question prompt for merchants to enter their last name",
    "Last name",
  ),
  BUSINESS_EMAIL: ci18n(
    "Question prompt for merchants to enter their business email",
    "Business email",
  ),
  BUSINESS_PHONE: ci18n(
    "Question prompt for merchants to enter their business phone",
    "Business phone",
  ),
  COUNTRY: ci18n(
    "Question prompt for merchants to enter their country/region",
    "Country/Region",
  ),
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
