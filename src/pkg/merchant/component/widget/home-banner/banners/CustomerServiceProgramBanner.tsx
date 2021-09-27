import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { customerSupport } from "@assets/illustrations";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type CustomerServiceProgramBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const CustomerServiceProgramBanner = (
  props: CustomerServiceProgramBannerProps
) => {
  const { logParams } = props;

  const { primary } = useTheme();

  return (
    <SimpleBannerItem
      title={i`New Customer Service Program`}
      body={
        i`Wish is building a new Customer Service Program! Fill out a short ` +
        i`survey to join the waitlist today.`
      }
      bannerImg={customerSupport}
      cta={{
        text: i`Join the waitlist`,
        href: "/customer-service",
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "CustomerServiceProgramBanner",
        ...logParams,
      }}
    />
  );
};

export default observer(CustomerServiceProgramBanner);
