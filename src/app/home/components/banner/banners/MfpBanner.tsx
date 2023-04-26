import React from "react";
import { observer } from "mobx-react";

import { Markdown } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";
import { useTheme } from "@core/stores/ThemeStore";
import { merchFeURL } from "@core/toolkit/router";

export type MfpBannerProps = BaseProps;

const MfpBanner: React.FC<MfpBannerProps> = ({
  className,
  style,
}: MfpBannerProps) => {
  const { primary } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={i`Merchant Promotions`}
      body={() => (
        <Markdown
          text={
            i`Introducing our new suite of promotional tools that will help ` +
            i`you boost your sales. Build promotions, track their performance, ` +
            i`and harness valuable data.`
          }
        />
      )}
      bannerImg="bannerMfp"
      cta={{
        text: i`Get started`,
        href: merchFeURL("/merchant-promotions"),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(MfpBanner);
