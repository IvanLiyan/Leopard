/* eslint-disable filenames/match-regex */
import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { earlyPaymentEligibleBannerImg } from "@assets/illustrations";
import { earlyPaymentNotEligibleBannerImg } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type EarlyPaymentBannerProps = BaseProps & {
  readonly hasPolicy: boolean;
  readonly logParams: {
    [field: string]: string;
  };
};

const EarlyPaymentBanner = (props: EarlyPaymentBannerProps) => {
  const { hasPolicy, logParams } = props;
  const buttonColor = "#326BEE";
  if (hasPolicy) {
    return (
      <SimpleBannerItem
        title={i`You're eligible to request an Early Payment!`}
        body={i`Accelerate your cash flow in your next payment and grow your business faster`}
        bannerImg={earlyPaymentEligibleBannerImg}
        cta={{
          text: i`Request Early Payment`,
          href: "/merchant-early-payment",
          style: {
            backgroundColor: buttonColor,
          },
        }}
        logParams={{
          banner_key: "EarlyPaymentBanner",
          ...logParams,
        }}
      />
    );
  }

  return (
    <SimpleBannerItem
      title={i`Introducing Early Payment`}
      body={
        i`This new feature allows eligible merchants to receive a portion of ` +
        i`their payments earlier. Interested? Join the waitlist now to get access.`
      }
      bannerImg={earlyPaymentNotEligibleBannerImg}
      cta={{
        text: i`Learn More`,
        href: "/merchant-early-payment",
        style: {
          backgroundColor: buttonColor,
        },
      }}
      logParams={{
        banner_key: "EarlyPaymentBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(EarlyPaymentBanner);
