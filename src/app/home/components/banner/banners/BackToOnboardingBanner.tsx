import React from "react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";

export type BackToOnboardingBannerProps = BaseProps;

const BackToOnboardingBanner: React.FC<BackToOnboardingBannerProps> = ({
  className,
  style,
}) => {
  return (
    <Banner
      className={className}
      style={style}
      title={i`Please complete the following steps to reactivate your store`}
      body={
        i`Your store has been updated to Pending Review status due to` +
        i` inactivity. To continue doing business on Wish and reactivate` +
        i` your store, please complete the required store onboarding steps to` +
        i` re-submit your store for review. Thank you for your cooperation.`
      }
      bannerImg="bannerBackToOnboarding"
    />
  );
};

export default BackToOnboardingBanner;
