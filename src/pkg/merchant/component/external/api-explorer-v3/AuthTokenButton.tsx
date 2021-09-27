import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { getTempAccessToken } from "@merchant/api/v3-api-explorer";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useUserStore } from "@merchant/stores/UserStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

export type AuthTokenButtonProps = BaseProps & {
  readonly onTokenGet: (token: string) => unknown;
  readonly isDisabled?: boolean;
  readonly isStoreOrMerchantUser: boolean | undefined;
};

const AuthTokenButton = (props: AuthTokenButtonProps) => {
  const {
    className,
    children,
    onTokenGet,
    isDisabled,
    isStoreOrMerchantUser,
  } = props;
  const { isLoggedIn } = useUserStore();
  const { currentPath } = useRouteStore();
  const navigationStore = useNavigationStore();

  const onClick = async () => {
    if (isLoggedIn && isStoreOrMerchantUser) {
      const resp = await getTempAccessToken().call();
      if (resp && resp.data) {
        onTokenGet(resp.data.access_token);
      }
    } else if (isLoggedIn) {
      new ConfirmationModal(() => (
        <Markdown
          text={
            i`This account cannot generate a temporary access token. ` +
            i`Please log in as a merchant.`
          }
        />
      ))
        .setAction(i`OK`, () => {})
        .setHeader({ title: i`Error` })
        .setWidthPercentage(50)
        .render();
    } else {
      new ConfirmationModal(() => (
        <Markdown
          text={
            i`To generate a temporary token you must be logged in. ` +
            i`Do you want to leave this page and log in?`
          }
        />
      ))
        .setAction(i`OK`, () => {
          navigationStore.navigate(`/login?next=${currentPath || ""}`);
        })
        .setCancel(i`Cancel`)
        .setHeader({ title: i`Log In?` })
        .setWidthPercentage(50)
        .render();
    }
  };

  return (
    <PrimaryButton
      className={css(className)}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      {children}
    </PrimaryButton>
  );
};

export default observer(AuthTokenButton);
