import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import Color from "color";
import posed from "react-pose";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import {
  palettes,
  pageBackground,
} from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import DrawerButton from "@merchant/component/nav/drawer/DrawerButton";
import WishForMerchants from "@merchant/component/nav/WishForMerchants";
import AppLocaleSelector from "@merchant/component/AppLocaleSelector";

/* Relative Imports */
import SignupButton from "./SignupButton";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WishForMerchantsMode } from "@merchant/component/nav/WishForMerchants";

type LandingNavigationProps = BaseProps & {
  readonly insetX?: number;
  readonly showLoginButton?: boolean;
  readonly showSignupButton?: boolean;
  readonly expansionThreshold?: number;
  readonly expansionEnabled?: boolean;
  readonly wishLogoColor?: WishForMerchantsMode;
  readonly wishLogoText?: string;
  readonly backgroundColor?: string;
  readonly textColor?: string;
};

type Context = LandingNavigationProps & {
  readonly isExpanded: boolean;
  readonly renderLoginButton: boolean;
  readonly renderSignupButton: boolean;
};

const LandingNavigation = (props: LandingNavigationProps) => {
  const ctx = useContext(props);
  const styles = useStylesheet(ctx);
  const { renderLoginButton, renderSignupButton, isExpanded } = ctx;
  const {
    style,
    className,
    wishLogoColor = "default",
    wishLogoText,
    textColor,
  } = props;

  const { routeStore, dimenStore } = AppStore.instance();

  return (
    <ExpansionAnimation
      className={css(styles.root, className, style)}
      pose={isExpanded ? "expanded" : "normal"}
    >
      <Link className={css(styles.logo)} href="/">
        <WishForMerchants text={wishLogoText} mode={wishLogoColor} />
      </Link>

      <div className={css(styles.rightSection)}>
        {!dimenStore.isSmallScreen && (
          <div className={css(styles.rightSectionLinks)}>
            {renderLoginButton && (
              <Link
                className={css(styles.link)}
                style={{ color: palettes.textColors.DarkInk }}
                href={
                  routeStore.queryParams.next
                    ? `/login?next=${routeStore.queryParams.next}`
                    : "/login"
                }
              >
                Login
              </Link>
            )}
            {renderSignupButton && (
              <SignupButton
                className={css(styles.link)}
                style={{
                  padding: "5px 20px",
                }}
              >
                Sign up
              </SignupButton>
            )}
          </div>
        )}
        <AppLocaleSelector textColor={textColor} />
        {dimenStore.isSmallScreen && (
          <DrawerButton className={css(styles.drawerButton)} />
        )}
      </div>
    </ExpansionAnimation>
  );
};

const useContext = (props: LandingNavigationProps): Context => {
  const {
    showLoginButton = true,
    showSignupButton = true,
    expansionThreshold = 30,
    expansionEnabled = true,
  } = props;
  const { dimenStore, userStore } = AppStore.instance();

  const renderLoginButton = !userStore.isLoggedIn && showLoginButton;
  const renderSignupButton = !userStore.isLoggedIn && showSignupButton;
  const isExpanded =
    expansionEnabled && dimenStore.pageYOffset > expansionThreshold;
  return { ...props, isExpanded, renderLoginButton, renderSignupButton };
};

export default observer(LandingNavigation);

const ExpansionAnimation = posed.div({
  normal: { height: 60, transition: { duration: 300 } },
  expanded: { height: 70, transition: { duration: 300 } },
});

const useStylesheet = (ctx: Context) => {
  const { dimenStore } = AppStore.instance();
  const defaultInset = dimenStore.isSmallScreen ? 50 : 100;
  const { insetX = defaultInset, isExpanded, backgroundColor } = ctx;
  const borderColor = isExpanded
    ? new Color(pageBackground).darken(0.1).toString()
    : pageBackground;
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          padding: `0px ${insetX}px`,
          backgroundColor: backgroundColor || pageBackground,
          border: `1px solid ${borderColor}`,
          transition: "border 0.3 linear",
        },
        logo: {
          marginRight: 30,
          maxWidth: "60%",
        },
        link: {
          margin: "0px 5px",
          lineHeight: 1.25,
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
        rightSectionLinks: {
          marginRight: 30,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        rightSection: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        drawerButton: {
          marginLeft: 15,
        },
      }),
    [insetX, borderColor, backgroundColor],
  );
};
