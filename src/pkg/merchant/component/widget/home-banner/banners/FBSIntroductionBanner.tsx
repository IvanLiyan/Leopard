/* eslint-disable filenames/match-regex */
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { fbsIntroductionBanner } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBSIntroductionBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const FBSIntroductionBanner = (props: FBSIntroductionBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`Introducing Fulfillment By Store (FBS)`}
      body={
        i`Our new FBS program allows you to stock products ` +
        i`not only in FBW warehouses but also in our partner pickup stores ` +
        i`in close proximity to your customers!`
      }
      bannerImg={fbsIntroductionBanner}
      cta={{
        text: i`Learn More`,
        href: "/fbs/overview",
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      textColor={palettes.textColors.White}
      logParams={{
        banner_key: "FBSIntroductionBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(FBSIntroductionBanner);
