import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { zendeskURL } from "@toolkit/url";
import { restrictedProduct } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

export type RestrictedProductBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const RestrictedProductBanner = (props: RestrictedProductBannerProps) => {
  const { logParams } = props;

  const learnMoreLink = zendeskURL("360055998653");

  const { primary } = useTheme();

  return (
    <SimpleBannerItem
      title={i`Unlock New Product Categories`}
      body={
        i`If you are interested in selling products from restricted categories, ` +
        i`such as vitamins, food, child car seats, and more, you can apply to be ` +
        i`an authorized seller. [Learn more](${learnMoreLink})`
      }
      bannerImg={restrictedProduct}
      cta={{
        text: i`Apply`,
        href: "/product-authorization",
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "RestrictedProductBanner",
        ...logParams,
      }}
    />
  );
};

export default RestrictedProductBanner;
