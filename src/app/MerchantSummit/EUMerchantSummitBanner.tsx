import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import Banner from "../home/components/banner/Banner";
import { merchFeUrl } from "@core/toolkit/router";

export type EUMerchantSummitBannerProps = BaseProps;

const EUMerchantSummitBanner: React.FC<EUMerchantSummitBannerProps> = ({
  className,
  style,
}) => {
  const { primary, textDark } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={"2023 EU Merchant Summit!"}
      body={
        "We are inviting you for our upcoming event - the 2023 EU Merchant Summit! Learn about our business plans and changes to elevate your success. Limited spots available. See you there!"
      }
      textColor={textDark}
      bannerImg="bannerEUMerchantSummit"
      cta={{
        text: "Register now",
        href: merchFeUrl("/md/summit"),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(EUMerchantSummitBanner);
