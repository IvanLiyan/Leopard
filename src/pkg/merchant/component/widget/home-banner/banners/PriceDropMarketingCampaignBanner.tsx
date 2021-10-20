import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* SVGs */
import priceDropBannerImg from "@assets/img/price-drop/price_drop_lto_branding.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PriceDropMarketingCampaignBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const PriceDropMarketingCampaignBanner = (
  props: PriceDropMarketingCampaignBannerProps,
) => {
  const { logParams } = props;
  const { textBlack, textWhite, primaryLight } = useTheme();

  return (
    <SimpleBannerItem
      title={i`Create Limited Time Offers to feature your products in Weekly Deals and more!`}
      body={
        i`Increase product exposure during the holidays by creating ` +
        i`Limited Time Offers with Price Drop. Products will be shown ` +
        i`in Weekly Deals and receive distinctive badges!`
      }
      bannerImg={priceDropBannerImg}
      cta={{
        text: i`Get more sales`,
        href: "/marketplace/price-drop/create-campaign",
        style: {
          color: textBlack,
          backgroundColor: primaryLight,
        },
      }}
      textColor={textWhite}
      logParams={{
        banner_key: "PriceDropMarketingCampaignBanner",
        ...logParams,
      }}
    />
  );
};

export default PriceDropMarketingCampaignBanner;
