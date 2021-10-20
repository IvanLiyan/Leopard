import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* SVGs */
import bannerImg from "@assets/img/boxes-in-front-of-earth.svg";

/* Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SellerProfileBannerProps = BaseProps & {
  readonly title: string;
  readonly body: string;
  readonly logParams: {
    [field: string]: string;
  };
};

const SellerProfileBanner = (props: SellerProfileBannerProps) => {
  const { title, body, logParams } = props;
  const theme = useTheme();

  return (
    <SimpleBannerItem
      title={title}
      body={body}
      bannerImg={bannerImg}
      cta={{
        text: i`Validate my store`,
        href: "/settings#seller-profile",
        style: {
          backgroundColor: theme.primary,
        },
      }}
      logParams={{
        banner_key: "SellerProfileBanner",
        ...logParams,
      }}
    />
  );
};

export default SellerProfileBanner;
