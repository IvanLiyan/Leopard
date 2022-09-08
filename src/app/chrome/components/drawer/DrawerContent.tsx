import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { SideMenu } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { PrimaryButtonProps } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
// import SignupButton from "@merchant/component/landing/SignupButton";
import AppLocaleSelector from "@merchant/component/AppLocaleSelector";

/* Merchant API */
import { logout } from "@merchant/api/authentication";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useUserStore } from "@stores/UserStore";

import { useNavigationStore } from "@stores/NavigationStore";

const LoggedOutItems = observer(() => {
  const navigationStore = useNavigationStore();
  return (
    <>
      <SideMenu.Item
        title={i`Log In`}
        href={
          navigationStore.queryParams.next
            ? `/login?next=${navigationStore.queryParams.next}`
            : "/login"
        }
      />
    </>
  );
});

const LoggedInItems = () => (
  <>
    <SideMenu.Item title={i`Logout`} href="/logout" />
  </>
);

const erpSignupUrl = "/erp-partner/signup";

type DrawerContentProps = BaseProps & {
  readonly closeDrawer?: () => void;
};

const DrawerContent = (props: DrawerContentProps) => {
  const { style, className } = props;
  const { loggedInMerchantUser, isLoggedIn } = useUserStore();
  const navigationStore = useNavigationStore();
  const styles = useStylesheet();

  let signUpComponent: ReactNode | null = null;

  const confirmLogoutModal = () => {
    new ConfirmationModal(
      i`In order to sign up, we'll need to log you out of your account. ` +
        i`Would you like to continue?`,
    )
      .setHeader({
        title: i`Confirm sign up and logout`,
      })
      .setCancel(i`Cancel`)
      .setAction(i`Continue`, async () => {
        await logout({}).call();
        navigationStore.navigate(erpSignupUrl);
      })
      .render();
  };

  if (navigationStore.currentPath === "/partner-developer") {
    let buttonProps: PrimaryButtonProps = {
      href: undefined,
      className: css(styles.signupButton),
      onClick: undefined,
    };

    if (!loggedInMerchantUser?.isApiUser && isLoggedIn) {
      buttonProps = {
        ...buttonProps,
        onClick: () => {
          if (props.closeDrawer) {
            props.closeDrawer();
          }
          confirmLogoutModal();
        },
      };
    } else if (!isLoggedIn) {
      buttonProps = { ...buttonProps, href: erpSignupUrl };
    }

    if ((!loggedInMerchantUser?.isApiUser && isLoggedIn) || !isLoggedIn) {
      signUpComponent = (
        <PrimaryButton {...buttonProps}>Get Started</PrimaryButton>
      );
    }
  } else if (navigationStore.currentPath !== "/signup") {
    return null; // [lliepert] will bring back later signUpComponent = <SignupButton className={css(styles.signupButton)} />;
  }

  const { children } = props;
  const defaultItems = isLoggedIn ? <LoggedInItems /> : <LoggedOutItems />;

  return (
    <section className={css(styles.root, className, style)}>
      <SideMenu hideOnSmallScreen={false} className={css(styles.menu)}>
        {children || defaultItems}
      </SideMenu>
      {signUpComponent}
      <div className={css(styles.bottomSection)}>
        <AppLocaleSelector compressOnSmallScreen={false} />
      </div>
    </section>
  );
};

export default observer(DrawerContent);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        menu: {
          marginBottom: 10,
        },
        signupButton: {
          margin: "0px 10px 10px 10px",
        },
        bottomSection: {
          borderTop: "1px solid rgba(196, 205, 213, 0.5)",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }),
    [],
  );
};
