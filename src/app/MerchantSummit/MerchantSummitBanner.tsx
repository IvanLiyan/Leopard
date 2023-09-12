import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n, i18n } from "@core/toolkit/i18n";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import Banner from "../home/components/banner/Banner";

export type MerchantSummitBannerProps = BaseProps;

const MerchantSummitBanner: React.FC<MerchantSummitBannerProps> = ({
  className,
  style,
}) => {
  const { primary, textDark } = useTheme();

  const { decision: MerchantBannerLive } = useDeciderKey(
    "merchant_summit_live",
  );

  const bannerContent = MerchantBannerLive
    ? "September 19, 2023, Spotlight on Wish's Strategy, New Projects, User Growth… Watch Now!"
    : "Sign up now for this exciting event in Shenzhen on September 19, 2023!";
  const bannerButtonText = MerchantBannerLive
    ? "Watch the summit"
    : "Click to sign up";
  const bannerLink = MerchantBannerLive
    ? "https://live.vhall.com/v3/lives/watch/382203263"
    : "https://u4156976.viewer.maka.im/k/A69XPCYJW4156976";

  return (
    <Banner
      className={className}
      style={style}
      title={i`2023 Wish Merchant Summit`}
      body={i18n(bannerContent)}
      textColor={textDark}
      bannerImg="bannerMerchantSummit"
      cta={{
        text: ci18n(
          "Text on a button, to register for merchant summit",
          `${bannerButtonText}`,
        ),
        href: bannerLink,
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(MerchantSummitBanner);
