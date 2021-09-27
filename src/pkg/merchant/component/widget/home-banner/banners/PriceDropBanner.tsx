import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import priceDropBannerImg from "@assets/img/price-drop/price_drop_wish_subsidy.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PriceDropBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const PriceDropBanner = (props: PriceDropBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`The Wish-subsidized Price Drop campaign was a success!`}
      body={
        i`We compared some of your products with similar ones on Wish and ran ` +
        i`a subsidized Price Drop campaign on your behalf, so your products ` +
        i`were competitively priced against other merchants’. Check out the ` +
        i`positive growth in product impressions now! `
      }
      bannerImg={priceDropBannerImg}
      cta={{
        text: i`Explore Now`,
        href: "/marketplace/price-drop/active",
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      logParams={{
        banner_key: "PriceDropBanner",
        ...logParams,
      }}
    />
  );
};

export default PriceDropBanner;
