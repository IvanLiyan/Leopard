import React from "react";
import { observer } from "mobx-react";
import Banner from "../Banner";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { merchFeURL } from "@core/toolkit/router";

export type CustomerServiceProgramBannerProps = BaseProps;

const CustomerServiceProgramBanner: React.FC<
  CustomerServiceProgramBannerProps
> = ({ className, style }) => {
  const { primary } = useTheme();

  return (
    <Banner
      className={className}
      style={style}
      title={i`New Customer Service Program`}
      body={
        i`Wish is building a new Customer Service Program! Fill out a short ` +
        i`survey to join the waitlist today.`
      }
      bannerImg="bannerCustomerSupport"
      cta={{
        text: i`Join the waitlist`,
        href: merchFeURL("/customer-service"),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

export default observer(CustomerServiceProgramBanner);
