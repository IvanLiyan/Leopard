import { IconProps } from "@core/components/Icon";
import { WssMerchantLevelType } from "@schema";
import { zendeskURL } from "@core/toolkit/url";
import { ci18n } from "@core/toolkit/i18n";

export type Perk = {
  readonly icon: IconProps["name"];
  readonly text: string;
};
const learnMoreLink = zendeskURL("4419128653595");

export const PERKS_SUMMARY: {
  [K in WssMerchantLevelType]: Array<Perk>;
} = {
  BAN: [],
  UNASSESSED: [],
  BRONZE: [
    { icon: "eyeOff", text: i`Reduced impressions` },
    {
      icon: "increasedFees",
      text: i`Increased merchant commission fees`,
    },
  ],
  SILVER: [
    { icon: "eyeOn", text: i`Standard impressions` },
    {
      icon: "assignmentCheck",
      text: i`Eligible to use the Merchant Promotions Platform [Learn more](${learnMoreLink})`,
    },
  ],
  GOLD: [
    { icon: "impressionBoost", text: i`Impression boost` },
    {
      icon: "premierMerchant",
      text: i`'Premier Merchant' badge`,
    },
    {
      icon: "assignmentCheck",
      text: i`Eligible to use the Merchant Promotions Platform [Learn more](${learnMoreLink})`,
    },
    {
      icon: "reducedFees",
      text: i`Discounts on merchant commission fees on select orders`,
    },
  ],
  PLATINUM: [
    { icon: "impressionBoost", text: i`Impression boost` },
    {
      icon: "premierMerchant",
      text: i`'Premier Merchant' badge`,
    },
    {
      icon: "assignmentCheck",
      text: i`Eligible to use the Merchant Promotions Platform [Learn more](${learnMoreLink})`,
    },
    {
      icon: "reducedFees",
      text: i`Discounts on merchant commission fees on select orders`,
    },
  ],
};

export const PERKS_DETAILS: {
  [K in WssMerchantLevelType]: Array<Perk>;
} = {
  BAN: PERKS_SUMMARY.BAN,
  UNASSESSED: PERKS_SUMMARY.UNASSESSED,
  BRONZE: PERKS_SUMMARY.BRONZE,
  SILVER: PERKS_SUMMARY.SILVER,
  GOLD: PERKS_SUMMARY.GOLD,
  PLATINUM: [
    ...PERKS_SUMMARY.PLATINUM,
    {
      icon: "card",
      text: ci18n("Perk of WSS platinum tier", "Weekly payments"),
    },
  ],
};

export const getNewPerks = (
  data: Array<number>,
): { [K in WssMerchantLevelType]: Array<Perk> } => {
  return {
    BAN: PERKS_SUMMARY.BAN,
    UNASSESSED: PERKS_SUMMARY.UNASSESSED,
    BRONZE: [
      ...PERKS_SUMMARY.BRONZE,
      {
        icon: "gift",
        text: i`${data[2]} free product listings`,
      },
    ],
    SILVER: [
      ...PERKS_SUMMARY.SILVER,
      {
        icon: "gift",
        text: i`${data[3]} free product listings`,
      },
    ],
    GOLD: [
      ...PERKS_SUMMARY.GOLD,
      {
        icon: "gift",
        text: i`${data[4]} free product listings`,
      },
    ],
    PLATINUM: [
      ...PERKS_SUMMARY.PLATINUM,
      {
        icon: "card",
        text: ci18n("Perk of WSS platinum tier", "Weekly payments"),
      },
      {
        icon: "gift",
        text: i`${data[5]} free product listings`,
      },
    ],
  };
};
