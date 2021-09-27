import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import nonCNPoductUploadBannerImg from "@assets/img/product-upload-non-cn-header.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type NonCNProductUploadBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const NonCNProductUploadBanner = (props: NonCNProductUploadBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={
        i`Upload new products now to take advantage of the current ` +
        i`impression boost!`
      }
      body={
        i`Your products are currently receiving additional free ` +
        i`impressions! Take advantage now by uploading more new products for ` +
        i`an opportunity to potentially receive even more impressions and ` +
        i`related sales.`
      }
      bannerImg={nonCNPoductUploadBannerImg}
      cta={{
        text: i`Add new products`,
        href: "/feed-upload",
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      textColor={palettes.textColors.White}
      logParams={{
        banner_key: "NonCNProductUploadBanner",
        ...logParams,
      }}
    />
  );
};

export default NonCNProductUploadBanner;
