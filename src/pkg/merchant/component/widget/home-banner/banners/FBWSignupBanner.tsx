/* eslint-disable filenames/match-regex */
import React from "react";
import { observer } from "mobx-react";

/* External Libraries */
import fbsBannerGraphic from "@assets/img/fbw/banner-graphic.png";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBWSignupBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const FBWSignupBanner = (props: FBWSignupBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`Accelerate your business growth with FBW!`}
      body={
        i`More exposure to customers, hassle-free fulfillment, ` +
        i`and faster delivery! Join Fulfillment by Wish (FBW) ` +
        i`today to grow your business!`
      }
      bannerImg={fbsBannerGraphic}
      cta={{
        text: i`Learn More`,
        href: "/fbw",
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      logParams={{
        banner_key: "FBWSignupBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(FBWSignupBanner);
