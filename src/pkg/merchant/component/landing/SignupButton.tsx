import React, { useCallback } from "react";
import { observer } from "mobx-react";

/* External Libraries */
import queryString from "query-string";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";

/* Merchant Store */
import { useEnvironmentStore } from "@merchant/stores/EnvironmentStore";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { PrimaryButtonProps } from "@ContextLogic/lego";

const SignupButton = (props: PrimaryButtonProps) => {
  const { children, ...buttonProps } = props;
  const { routeStore } = AppStore.instance();
  const { isSandbox } = useEnvironmentStore();

  const postFBPixel = useCallback(() => {
    if ((window as any).fbq) {
      (window as any).fbq("trackCustom", "NewSignUpButtonClick");
    }
  }, []);

  const queryParams = {
    ...routeStore.queryParams,
    landing_source: "v2",
  };
  const testSignupUrl = "/signup-testuser";
  const defaultSignupUrl = `/signup?${queryString.stringify(queryParams)}`;

  return (
    <PrimaryButton
      {...buttonProps}
      href={isSandbox ? testSignupUrl : defaultSignupUrl}
      onClick={postFBPixel}
    >
      {children || i`Sign up for free`}
    </PrimaryButton>
  );
};

export default observer(SignupButton);
