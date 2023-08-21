import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import Banner from "../home/components/banner/Banner";

export type MerchantSummitBannerProps = BaseProps;

const MerchantSummitBanner: React.FC<MerchantSummitBannerProps> = ({
  className,
  style,
}) => {
  const { primary, textDark } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={i`2023 Wish Merchant Summit`}
      body={i`Sign up now for this exciting event in Shenzhen on September 19, 2023!`}
      textColor={textDark}
      bannerImg="bannerMerchantSummit"
      cta={{
        text: ci18n(
          "Text on a button, to register for merchant summit",
          "Click to sign up",
        ),
        href: "https://u4156976.viewer.maka.im/k/A69XPCYJW4156976",
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(MerchantSummitBanner);
