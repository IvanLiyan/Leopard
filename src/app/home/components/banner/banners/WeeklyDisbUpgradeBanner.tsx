import React from "react";
import { observer } from "mobx-react";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";
import { merchFeUrl } from "@core/toolkit/router";

export type WeeklyDisbUpgradeBannerProps = BaseProps;

const WeeklyDisbUpgradeBanner: React.FC<WeeklyDisbUpgradeBannerProps> = ({
  className,
  style,
}) => {
  return (
    <Banner
      className={className}
      style={style}
      title={i`Congratulations! You're now Getting Paid Weekly`}
      body={
        i`You will receive weekly payment from Wish because you've reached Platinum ` +
        i`tier in Wish Standards. Head to your Wish Standards page to learn more ` +
        i`about your tier, your metrics, and how you can keep up the good work.`
      }
      bannerImg="bannerWeeklyDisbUpgrade"
      cta={{
        text: i`Visit Wish Standards`,
        href: merchFeUrl("/performance-overview/wish-standards"),
        style: {},
      }}
    />
  );
};

export default observer(WeeklyDisbUpgradeBanner);
