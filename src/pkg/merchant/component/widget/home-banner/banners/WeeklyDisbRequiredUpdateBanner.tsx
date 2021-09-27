import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weeklyDisbBannerImage } from "@assets/illustrations";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WeeklyDisbRequiredUpdateBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const WeeklyDisbRequiredUpdateBanner = (
  props: WeeklyDisbRequiredUpdateBannerProps
) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`Update payment provider for weekly payments`}
      body={
        i`You are enrolled in the Weekly Payment program. ` +
        i`Please update your provider to Paypal or Payoneer, ` +
        i`or contact your account manager to opt out.`
      }
      bannerImg={weeklyDisbBannerImage}
      cta={{
        text: i`Update provider`,
        href: "/payment-settings",
        style: {},
      }}
      logParams={{
        banner_key: "WeeklyDisbRequiredUpdateBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(WeeklyDisbRequiredUpdateBanner);
