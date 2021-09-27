import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { sizeChartBannerImg } from "@assets/illustrations";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

export type SizeChartBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const SizeChartBanner = (props: SizeChartBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`New Size Chart Feature`}
      body={
        i`Apparel products with custom size charts may increase conversion, ` +
        i`reduce returns, and improve your customer’s experience. Learn how ` +
        i`to create your first chart!`
      }
      bannerImg={sizeChartBannerImg}
      cta={{
        text: i`Learn more`,
        href: zendeskURL("360048965333"),
        style: {},
      }}
      logParams={{
        banner_key: "SizeChartBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(SizeChartBanner);
