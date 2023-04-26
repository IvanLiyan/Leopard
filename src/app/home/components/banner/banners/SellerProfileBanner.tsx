import React from "react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";
import { useTheme } from "@core/stores/ThemeStore";
import { merchFeURL } from "@core/toolkit/router";

export type SellerProfileBannerProps = BaseProps & {
  readonly title: string;
  readonly body: string;
};

const SellerProfileBanner: React.FC<SellerProfileBannerProps> = ({
  title,
  body,
  className,
  style,
}) => {
  const { primary } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={title}
      body={body}
      bannerImg="bannerSellerProfile"
      cta={{
        text: i`Validate my store`,
        href: merchFeURL("/settings#seller-profile"),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default SellerProfileBanner;
