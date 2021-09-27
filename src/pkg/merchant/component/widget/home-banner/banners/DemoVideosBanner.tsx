import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { zendeskURL } from "@toolkit/url";

/* Merchant Components */
import DemoVideosExamples from "./DemoVideosExamples";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type DemoVideosBannerBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const DemoVideosBanner = (props: DemoVideosBannerBannerProps) => {
  const { logParams } = props;

  const learnMoreLink = zendeskURL("360056495994");

  const { primary, textWhite } = useTheme();

  return (
    <SimpleBannerItem
      title={i`Add Demo Videos to showcase your products`}
      body={
        i`Potentially drive more sales by adding high quality, ${9}:${16} ` +
        i`portrait style Demo Videos to active products in Fashion, ` +
        i`Accessories, Makeup & Beauty, Workout Equipment, and many more ` +
        i`categories. [Learn more](${learnMoreLink})`
      }
      textColor={textWhite}
      bannerImg={() => <DemoVideosExamples />}
      cta={{
        text: i`Get started`,
        href: "/demo-videos",
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "DemoVideosBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(DemoVideosBanner);
