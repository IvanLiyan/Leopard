import {
  AuthenticationMutationsMmsLeadSubmissionArgs,
  MerchantLeadProductCategory,
  MmsLeadSubmissionMutation,
  MmsLeadYearlyRevenue,
} from "@schema";
import gql from "graphql-tag";
import { ci18n } from "@core/toolkit/i18n";

export const SUBMIT_MMS_MERCHANT_LEAD_MUTATION = gql`
  mutation MmsWelcome_SubmitMmsMerchantLeadMutation(
    $input: MMSLeadSubmissionInput!
  ) {
    authentication {
      mmsLeadSubmission(input: $input) {
        ok
        message
      }
    }
  }
`;

export type SubmitMmsMerchantLeadRequestType =
  AuthenticationMutationsMmsLeadSubmissionArgs;
export type SubmitMmsMerchantLeadResponseType = {
  readonly authentication?: {
    readonly mmsLeadSubmission?: Pick<
      MmsLeadSubmissionMutation,
      "message" | "ok"
    > | null;
  } | null;
};

export const MmsCompanyRevenues = [
  "0_50000",
  "50000_200000",
  "200000_500000",
  "500000_1000000",
  "1000000_PLUS",
  "CANT_SAY",
] as const;

export type MmsCompanyRevenue = typeof MmsCompanyRevenues[number];

const generateRevenueRange = (
  start: number,
  end: number,
): MmsLeadYearlyRevenue => ({
  start: {
    currencyCode: "USD",
    amount: start,
  },
  end: {
    currencyCode: "USD",
    amount: end,
  },
});

export const MmsCompanyRevenueRanges: {
  readonly [T in MmsCompanyRevenue]: MmsLeadYearlyRevenue;
} = {
  "0_50000": generateRevenueRange(0, 50000),
  "50000_200000": generateRevenueRange(50000, 200000),
  "200000_500000": generateRevenueRange(200000, 500000),
  "500000_1000000": generateRevenueRange(500000, 1000000),
  "1000000_PLUS": generateRevenueRange(1000000, 0),
  CANT_SAY: generateRevenueRange(0, 0),
};

export const MmsCompanyRevenueDisplay: {
  readonly [T in MmsCompanyRevenue]: string;
} = {
  /* eslint-disable local-rules/use-formatCurrency */
  "0_50000": `$0 - $50,000`,
  "50000_200000": `$50,000 - $200,000`,
  "200000_500000": `$200,000 - $500,000`,
  "500000_1000000": `$500,000 - $1,000,000`,
  "1000000_PLUS": `$1,000,000+`,
  /* eslint-enable local-rules/use-formatCurrency */
  CANT_SAY: i`Can't say at this time`,
};

export const MmsCompanyProductCategoriesOrder: ReadonlyArray<MerchantLeadProductCategory> =
  [
    "ARTS_CRAFTS_AND_SEWING",
    "BABY_AND_TODDLER",
    "BOOKS",
    "CARS_AND_AUTOMOTIVE",
    "CLOTHING_SHOES_AND_ACCESSORIES",
    "COLLECTABLES_AND_MEMORABILIA",
    "ELECTRONICS_AND_TECHNOLOGY",
    "FOOD_AND_DRINK",
    "HEALTH_AND_BEAUTY",
    "HOME_GARDEN_AND_PETS",
    "HOUSEHOLD_SUPPLIES",
    "JEWELLERY_AND_WATCHES",
    "MOVIES_VIDEO_GAMES_AND_MUSIC",
    "MUSICAL_INSTRUMENTS_AND_DJ",
    "REFURBISHED_ELECTRONICS",
    "SPORTS_AND_OUTDOORS",
    "TOOLS_AND_DIY",
    "TOYS_AND_GAMES",
    "OTHER",
  ];

export const MmsCompanyProductCategoriesDisplay: {
  readonly [T in MerchantLeadProductCategory]: string;
} = {
  ARTS_CRAFTS_AND_SEWING: ci18n("A product category", "Arts, Crafts & Sewing"),
  BABY_AND_TODDLER: ci18n("A product category", "Baby & Toddler"),
  BOOKS: ci18n("A product category", "Books"),
  CARS_AND_AUTOMOTIVE: ci18n("A product category", "Cars & Automotive"),
  CLOTHING_SHOES_AND_ACCESSORIES: ci18n(
    "A product category",
    "Clothing, Shoes & Accessories",
  ),
  COLLECTABLES_AND_MEMORABILIA: ci18n(
    "A product category",
    "Collectables & Memorabilia",
  ),
  ELECTRONICS_AND_TECHNOLOGY: ci18n(
    "A product category",
    "Electronics & Technology",
  ),
  FOOD_AND_DRINK: ci18n("A product category", "Food & Drink"),
  HEALTH_AND_BEAUTY: ci18n("A product category", "Health & Beauty"),
  HOME_GARDEN_AND_PETS: ci18n("A product category", "Home, Garden & Pets"),
  HOUSEHOLD_SUPPLIES: ci18n("A product category", "Household Supplies"),
  JEWELLERY_AND_WATCHES: ci18n("A product category", "Jewellery & Watches"),
  MOVIES_VIDEO_GAMES_AND_MUSIC: ci18n(
    "A product category",
    "Movies, Video Games & Music",
  ),
  MUSICAL_INSTRUMENTS_AND_DJ: ci18n(
    "A product category",
    "Musical Instruments & DJ",
  ),
  REFURBISHED_ELECTRONICS: ci18n(
    "A product category",
    "Refurbished Electronics",
  ),
  SPORTS_AND_OUTDOORS: ci18n("A product category", "Sports & Outdoors"),
  TOOLS_AND_DIY: ci18n("A product category", "Tools & DIY"),
  TOYS_AND_GAMES: ci18n("A product category", "Toys & Games"),
  OTHER: ci18n("A product category", "Other"),
};
