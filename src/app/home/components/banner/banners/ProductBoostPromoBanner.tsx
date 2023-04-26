import React from "react";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "@core/components/Illustration";
import Banner from "../Banner";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import { formatCurrency } from "@core/toolkit/currency";
import { PbBannerImage, PromoBannerMessage } from "@home/toolkit/product-boost";
import { merchFeURL } from "@core/toolkit/router";

export type ProductBoostPromoBannerProps = BaseProps & {
  readonly promoMessage: PromoBannerMessage | null | undefined;
};

const BannerImageMap: { readonly [T in PbBannerImage]: IllustrationName } = {
  DEFAULT: "bannerPbSeasonalDefault",
  EASTER: "bannerPbSeasonalEaster",
  MOTHER: "bannerPbSeasonalMothersDay",
  SUMMER: "bannerPbSeasonalSummer",
  JULY: "bannerPbSeasonalJuly",
  PRE_HOLIDAY: "bannerPbSeasonalPreHoliday",
  HALLOWEEN: "bannerPbSeasonalHalloween",
  SINGLES_DAY: "bannerPbSeasonalSinglesDay",
  THANKSGIVING: "bannerPbSeasonalThanksgiving",
  INCREASE_BUDGET: "bannerPbSeasonalIncreaseBudget",
  BLACK_FRIDAY: "bannerPbSeasonalBlackFriday",
  CHINESE_NEW_YEAR: "bannerPbSeasonalChineseNewYear",
  COVID: "bannerPbSeasonalCovid",
  MAY_HIGH_DEMAND: "bannerPbSeasonalMayHighDemand",
};

type ProductBoostPromoBannerText = {
  title: string;
  body: ReadonlyArray<string>;
  button_text: string;
};

const ProductBoostPromoBanner: React.FC<ProductBoostPromoBannerProps> = ({
  className,
  style,
  promoMessage: promoMessageProp,
}) => {
  const bannerResources: {
    readonly [key: string]: ProductBoostPromoBannerText;
  } = {
    DEFAULT: {
      title: i`Drive more sales with ProductBoost`,
      body: [
        i`ProductBoost drove a 50% increase in revenue for our key merchants. ` +
          i`Time to boost your products!`,
      ],
      button_text: i`Create Campaign`,
    },
    DAILY_BUDGET_DEFAULT: {
      title: i`Drive more sales with ProductBoost`,
      body: [
        i`ProductBoost drove a ${50}% increase in revenue for our key merchants. ` +
          i`Time to boost your products!`,
      ],
      button_text: i`Promote Products`,
    },
    BLACK_FRIDAY: {
      title: i`Get ready for Black Friday and Cyber Monday with ProductBoost!`,
      body: [
        i`Black Friday and Cyber Monday mark the beginning of the busy ` +
          i`holiday shopping season. Consider promoting giftable items such as tech, ` +
          i`accessories, and toys for the week spanning both days.`,
      ],
      button_text: i`Create Campaign`,
    },
    BLACK_FRIDAY_ROUND_TWO: {
      title: i`Boost your products NOW for Black Friday and Cyber Monday!`,
      body: [
        i`The biggest shopping holidays, Black Friday and Cyber Monday are ` +
          i`finally here! Boost more products, increase budget by at least ${30}% ` +
          i`to get the best result!`,
      ],
      button_text: i`Create Campaign`,
    },
    CHINESE_NEW_YEAR: {
      title:
        i`Limited time only! Increase your ProductBoost budgets ` +
        i`to get up to ${formatCurrency(500)} credit back!`,
      body: [
        i`If you spend ${formatCurrency(
          100,
        )} more from January 18th to 31st than what you spent ` +
          i`from January 1st to 13th, you will receive ${formatCurrency(
            30,
          )} PB credit. If you spend ` +
          i`${formatCurrency(1000)}  more, you will receive ${formatCurrency(
            500,
          )} PB credit!`,
      ],
      button_text: i`Manage Campaigns`,
    },
    COVID: {
      title: i`Boost product categories in high demand right now!`,
      body: [
        i`Tablets, smartphones, and speakers are experiencing the highest ad ` +
          i`return on ProductBoost. Demande for home improvement, ` +
          i`headsets, and fitness accessories grew the most.`,
      ],
      button_text: i`Download the full list`,
    },
    MAY_HIGH_DEMAND: {
      title: i`Double your budget in ProductBoost and add more new products!`,
      body: [
        i`Electronics, fitness, home improvements, and respiratory categories ` +
          i`are all experiencing growth.  Increase your sales with ProductBoost` +
          i` by investing more in high ad return categories!`,
      ],
      button_text: i`Download the full list`,
    },
  };
  const { wishBlue, surfaceLightest, textDark } = useTheme();

  const defaultPromoBannerMessage: PromoBannerMessage = {
    key: "DEFAULT",
    title: i`Drive more sales with ProductBoost`,
    body: [
      i`ProductBoost drove a 50% increase in revenue for our key merchants. ` +
        i`Time to boost your products!`,
    ],
    button_link: merchFeURL(`/product-boost/create`),
    button_text: i`Create Campaign`,
    background_color: surfaceLightest,
    text_color: textDark,
    banner_img: `PRE_HOLIDAY`, // replace it back to DEFAULT after 2019 Holiday Season
    promotion_id: "",
  };

  const promoMessage = promoMessageProp ?? defaultPromoBannerMessage;
  const { locale } = useLocalizationStore();
  let bannerTitle: string | null = null;
  let buttonText: string | null = null;
  let bannerBody: string | null = null;
  if (locale == "zh") {
    bannerTitle = promoMessage.title;
    buttonText = promoMessage.button_text;
    bannerBody = promoMessage.body[0];
  } else {
    const bannerText = bannerResources[promoMessage.key];
    bannerTitle = bannerText.title;
    buttonText = bannerText.button_text;
    bannerBody = bannerText.body[0];
  }

  const buttonLink = promoMessage.button_link;
  const bannerImg: IllustrationName =
    BannerImageMap[promoMessage.banner_img] ?? "bannerPbSeasonalDefault";
  const bannerTextColor = promoMessage.text_color;
  return (
    <Banner
      className={className}
      style={style}
      title={bannerTitle ?? ""}
      body={bannerBody ?? ""}
      bannerImg={bannerImg}
      cta={{
        text: buttonText,
        href: merchFeURL(buttonLink),
        style: {
          backgroundColor: wishBlue,
        },
      }}
      textColor={bannerTextColor}
    />
  );
};

export default observer(ProductBoostPromoBanner);
