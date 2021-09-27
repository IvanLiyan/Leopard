import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import productUploadBannerImg from "@assets/img/product-upload-header.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductUploadBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const ProductUploadBanner = (props: ProductUploadBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`Upload new products and enjoy free impressions`}
      body={
        i`As a reward for uploading fresh and unique products, your new ` +
        i`listings may receive free impressions, not to mention reach more ` +
        i`customers around the globe, and ultimately gain more potential sales.`
      }
      bannerImg={productUploadBannerImg}
      cta={{
        text: i`Add new products`,
        href: "/feed-upload",
        style: {
          backgroundColor: palettes.coreColors.WishBlue,
        },
      }}
      logParams={{
        banner_key: "ProductUploadBanner",
        ...logParams,
      }}
    />
  );
};

export default ProductUploadBanner;
