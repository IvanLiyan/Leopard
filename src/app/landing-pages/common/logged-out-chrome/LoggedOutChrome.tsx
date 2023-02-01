import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import Color from "color";
import posed from "react-pose";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Merchant Components */
import DrawerButton from "./DrawerButton";
import WishForMerchants from "@chrome/components/WishForMerchants";

/* Merchant Store */
import { useTheme } from "@core/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Type Imports */
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useUserStore } from "@core/stores/UserStore";
import AppLocaleSelector from "@chrome/components/AppLocaleSelector";
import { merchFeURL } from "@core/toolkit/router";
import Link from "@core/components/Link";

type NavigationProps = BaseProps & {
  readonly insetX?: number;
  readonly onClickCta?: () => unknown;
  readonly ctaText?: string;
  readonly showLoginButton?: boolean;
  readonly showTopBarCtaButton?: boolean;
  readonly backgroundColor?: string;
};

type Context = NavigationProps & {
  readonly isExpanded: boolean;
  readonly renderLoginButton: boolean;
};

const Navigation = (props: NavigationProps) => {
  const ctx = useContext(props);
  const styles = useStylesheet(ctx);
  const navigationStore = useNavigationStore();
  const { renderLoginButton, isExpanded } = ctx;
  const {
    style,
    className,
    children,
    ctaText,
    onClickCta,
    showTopBarCtaButton = true,
  } = props;

  const { textDark } = useTheme();
  const deviceStore = useDeviceStore();

  return (
    <ExpansionAnimation
      className={css(styles.root, className, style)}
      pose={isExpanded ? "expanded" : "normal"}
    >
      <Link
        className={css(styles.logo)}
        href={
          navigationStore.currentPath === "/open-express"
            ? "#"
            : merchFeURL("/")
        }
      >
        <WishForMerchants mode="default" />
      </Link>

      <div className={css(styles.rightSection)}>
        {!deviceStore.isSmallScreen && (
          <div className={css(styles.rightSectionLinks)}>
            {renderLoginButton && (
              <Link
                style={[styles.link, { color: textDark }]}
                href={
                  navigationStore.queryParams.next
                    ? merchFeURL(
                        `/login?next=${navigationStore.queryParams.next}`,
                      )
                    : merchFeURL("/login")
                }
              >
                Login
              </Link>
            )}
            {ctaText != null && showTopBarCtaButton && (
              <PrimaryButton
                onClick={
                  onClickCta == null
                    ? undefined
                    : () => {
                        onClickCta();
                      }
                }
              >
                {ctaText}
              </PrimaryButton>
            )}
            {children}
          </div>
        )}
        <AppLocaleSelector textColor={textDark} />
        {deviceStore.isSmallScreen && (
          <DrawerButton
            className={css(styles.drawerButton)}
            onClickCta={onClickCta}
            ctaText={ctaText}
          />
        )}
      </div>
    </ExpansionAnimation>
  );
};

const useContext = (props: NavigationProps): Context => {
  const { showLoginButton = true } = props;
  const expansionThreshold = 30;
  const deviceStore = useDeviceStore();
  const userStore = useUserStore();

  const renderLoginButton = !userStore.isLoggedIn && showLoginButton;
  const isExpanded = deviceStore.pageYOffset > expansionThreshold;
  return { ...props, isExpanded, renderLoginButton };
};

export default observer(Navigation);

const ExpansionAnimation = posed.div({
  normal: { height: 60, transition: { duration: 300 } },
  expanded: { height: 80, transition: { duration: 300 } },
});

const useStylesheet = (ctx: Context) => {
  const { pageBackground, textWhite } = useTheme();
  const deviceStore = useDeviceStore();
  const defaultInset = deviceStore.isSmallScreen ? 50 : 100;
  const { insetX = defaultInset, isExpanded, backgroundColor } = ctx;
  const borderColor = isExpanded
    ? new Color(pageBackground).darken(0.2).toString()
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
          backgroundColor: backgroundColor || textWhite,
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
          whiteSpace: "nowrap",
        },
        rightSectionLinks: {
          marginRight: 50,
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
    [insetX, backgroundColor, textWhite, borderColor],
  );
};
