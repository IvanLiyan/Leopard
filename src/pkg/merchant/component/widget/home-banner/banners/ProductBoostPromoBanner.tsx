import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import blackFridayBannerImg from "@assets/img/product-boost/seasonal-banner/black_friday_banner.png";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Merchant Store */
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";

/* Toolkit Imports */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import BannerResources from "@toolkit/product-boost/resources/banner-resources";

/* SVGs */
import defaultBannerImg from "@assets/img/product-boost/default_upsell_banner.svg";
import easterBannerImg from "@assets/img/product-boost/seasonal-banner/easter_banner.svg";
import mothersDayBannerImg from "@assets/img/product-boost/seasonal-banner/mothers_banner.svg";
import summerBannerImg from "@assets/img/product-boost/seasonal-banner/summer_banner.svg";
import julyBannerImg from "@assets/img/product-boost/seasonal-banner/july_fourth_banner.svg";
import preHolidayBannerImg from "@assets/img/product-boost/seasonal-banner/pre_holiday_banner.svg";
import halloweenBannerImg from "@assets/img/product-boost/seasonal-banner/halloween_banner.svg";
import singlesDayBannerImg from "@assets/img/product-boost/seasonal-banner/singles_day_banner.svg";
import thanksgivingBannerImg from "@assets/img/product-boost/seasonal-banner/thanksgiving_banner.svg";
import increaseBudgetBannerImg from "@assets/img/product-boost/seasonal-banner/increase_budget_banner.svg";
import chineseNewYearBannerImg from "@assets/img/product-boost/seasonal-banner/chinese_new_year_banner.svg";
import COVIDBannerImg from "@assets/img/product-boost/seasonal-banner/covid_banner.svg";
import mayHighDemandBannerImg from "@assets/img/product-boost/seasonal-banner/may_high_demand_banner.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PromoMessage = {
  key: string;
  title: string;
  body: ReadonlyArray<string>;
  button_link: string;
  button_text: string;
  background_color: string;
  banner_img: keyof typeof BannerImageMap;
  promotion_id: string;
  text_color: string;
};

export type ProductBoostPromoBannerProps = BaseProps & {
  readonly promoMessage: PromoMessage | null | undefined;
  readonly logParams: {
    [field: string]: string;
  };
};

const defaultPromoMessage: PromoMessage = {
  key: "DEFAULT",
  title: i`Drive more sales with ProductBoost`,
  body: [
    i`ProductBoost drove a 50% increase in revenue for our key merchants. ` +
      i`Time to boost your products!`,
  ],
  button_link: `/product-boost/create`,
  button_text: i`Create Campaign`,
  background_color: palettes.textColors.White,
  text_color: palettes.textColors.DarkInk,
  banner_img: `PRE_HOLIDAY`, // replace it back to DEFAULT after 2019 Holiday Season
  promotion_id: "",
};

const BannerImageMap = {
  DEFAULT: defaultBannerImg,
  EASTER: easterBannerImg,
  MOTHER: mothersDayBannerImg,
  SUMMER: summerBannerImg,
  JULY: julyBannerImg,
  PRE_HOLIDAY: preHolidayBannerImg,
  HALLOWEEN: halloweenBannerImg,
  SINGLES_DAY: singlesDayBannerImg,
  THANKSGIVING: thanksgivingBannerImg,
  INCREASE_BUDGET: increaseBudgetBannerImg,
  BLACK_FRIDAY: blackFridayBannerImg,
  CHINESE_NEW_YEAR: chineseNewYearBannerImg,
  COVID: COVIDBannerImg,
  MAY_HIGH_DEMAND: mayHighDemandBannerImg,
};

const ProductBoostPromoBanner = (props: ProductBoostPromoBannerProps) => {
  const {
    logParams,
    promoMessage: promoMessageProp = defaultPromoMessage,
  } = props;
  const promoMessage = promoMessageProp || defaultPromoMessage;
  const { locale } = useLocalizationStore();
  const { merchant } = ProductBoostStore.instance();
  let bannerTitle: string | null = null;
  let buttonText: string | null = null;
  let bannerBody: string | null = null;
  if (locale == "zh") {
    bannerTitle = promoMessage.title;
    buttonText = promoMessage.button_text;
    bannerBody = promoMessage.body[0];
  } else {
    const bannerText = merchant.daily_budget_enabled
      ? BannerResources.DAILY_BUDGET_DEFAULT
      : BannerResources[promoMessage.key];
    bannerTitle = bannerText.title;
    buttonText = bannerText.button_text;
    bannerBody = bannerText.body[0];
  }

  const buttonLink = promoMessage.button_link;
  const bannerImg = BannerImageMap[promoMessage.banner_img] || defaultBannerImg;
  const bannerTextColor = promoMessage.text_color;
  return (
    <SimpleBannerItem
      title={bannerTitle}
      body={bannerBody}
      bannerImg={bannerImg}
      cta={{
        text: buttonText,
        href: buttonLink,
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      logParams={{
        banner_key: "ProductBoostPromoBanner",
        ...logParams,
      }}
      textColor={bannerTextColor}
    />
  );
};

export default observer(ProductBoostPromoBanner);
