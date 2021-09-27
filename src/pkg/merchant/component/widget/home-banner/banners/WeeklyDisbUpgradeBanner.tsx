import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weeklyDisbBannerImage } from "@assets/illustrations";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WeeklyDisbUpgradeBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const WeeklyDisbUpgradeBanner = (props: WeeklyDisbUpgradeBannerProps) => {
  const { logParams } = props;
  return (
    <SimpleBannerItem
      title={i`You've been upgraded to a weekly payment cycle`}
      body={
        i`Congratulations, you have been invited to a beta program for weekly ` +
        i`payments! You will automatically receive payments on a weekly basis ` +
        i`from now on.`
      }
      bannerImg={weeklyDisbBannerImage}
      cta={{
        text: i`View payment settings`,
        href: "/payment-settings",
        style: {},
      }}
      logParams={{
        banner_key: "WeeklyDisbUpgradeBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(WeeklyDisbUpgradeBanner);
