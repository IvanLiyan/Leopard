import React from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* SVGs */
import bannerImg from "@assets/img/store-not-approved.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type BackToOnboardingBannerProps = BaseProps;

const BackToOnboardingBanner = (props: BackToOnboardingBannerProps) => {
  return (
    <SimpleBannerItem
      title={i`Please complete the following steps to reactivate your store`}
      body={
        i`Your store has been updated to Pending Review status due to` +
        i` inactivity. To continue doing business on Wish and reactivate` +
        i` your store, please complete the required store onboarding steps to` +
        i` re-submit your store for review. Thank you for your cooperation.`
      }
      bannerImg={bannerImg}
    />
  );
};

export default BackToOnboardingBanner;
