import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import Chrome from "@merchant/component/nav/chrome/Chrome";

import { Popover } from "@merchant/component/core";
import { SideMenu } from "@ContextLogic/lego";
import { PrimaryButton, PrimaryButtonProps } from "@ContextLogic/lego";
import DrawerButton from "@merchant/component/nav/drawer/DrawerButton";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import AppLocaleSelector from "@merchant/component/AppLocaleSelector";

/* Merchant Store */
import { ThemeWrapper } from "@merchant/stores/ThemeStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import PartnerDeveloperSiteNavBarStore, {
  NavItem,
} from "@merchant/stores/partner-developer/PartnerDeveloperSiteNavBarStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import WishForDevelopers from "@merchant/component/nav/WishForDevelopers";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PartnerDeveloperSiteNavBarProps = BaseProps & {
  background?: string;
};

export default observer(({ background }: PartnerDeveloperSiteNavBarProps) => {
  const styles = useStylesheet();
  const { topbarBackground, textDark } = useTheme();
  const { isLargeScreen } = useDimenStore();
  const [navbarStore] = useState(() => new PartnerDeveloperSiteNavBarStore());

  const renderDropdownList = (items: ReadonlyArray<NavItem>) => {
    return (
      <div className={css(styles.dropdownWrapper)}>
        {items.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className={css(styles.dropdownLink)}
            style={{ color: textDark }}
          >
            {item.text}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <ThemeWrapper overrideThemeAs="PLUS">
      <Chrome.TopBar
        renderLogo={() => (
          <Link href="/partner-developer">
            <WishForDevelopers mode="ink" />
          </Link>
        )}
        backgroundColor={background ? background : topbarBackground}
        style={{ height: "80px", padding: "0 40px" }}
      >
        <div className={css(styles.navContent)}>
          {isLargeScreen ? (
            <>
              {navbarStore.visibleNavItems?.map(
                ({ url, text, inverted, items, linkPropsOverride }) => {
                  if (inverted) {
                    const buttonProps = {
                      ...linkPropsOverride,
                    } as PrimaryButtonProps;
                    return (
                      <PrimaryButton
                        {...buttonProps}
                        className={css(styles.navItem)}
                      >
                        {text}
                      </PrimaryButton>
                    );
                  } else if (items) {
                    return (
                      <Popover
                        popoverContent={() => renderDropdownList(items)}
                        position="bottom center"
                        contentWidth={211}
                      >
                        <Link
                          {...linkPropsOverride}
                          key={url}
                          className={css(styles.navItem)}
                        >
                          {text} &#x25BE;
                        </Link>
                      </Popover>
                    );
                  }
                  return (
                    <Link
                      {...linkPropsOverride}
                      className={css(styles.navItem)}
                    >
                      {text}
                    </Link>
                  );
                }
              )}
              <AppLocaleSelector />
            </>
          ) : (
            <>
              <AppLocaleSelector />
              <DrawerButton>
                {navbarStore.visibleNavItems
                  ?.filter((item) => !item.inverted)
                  .map(({ url, text, items }) =>
                    items ? (
                      items.map(({ url, text }) => (
                        <SideMenu.Item key={url} title={text} href={url} />
                      ))
                    ) : (
                      <SideMenu.Item key={url} title={text} href={url} />
                    )
                  )}
              </DrawerButton>
            </>
          )}
        </div>
      </Chrome.TopBar>
    </ThemeWrapper>
  );
});

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 80,
          padding: "0 40px",
          "@media (max-width: 900px)": {
            padding: "0 20px",
          },
        },
        navContent: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        },
        navItem: {
          "@media (max-width: 1000px)": {
            fontSize: 14,
          },
          fontSize: 18,
          height: 28,
          marginRight: 20,
        },
        dropdownWrapper: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          margin: 5,
          padding: "16px 32px",
          fontFamily: fonts.proxima,
        },
        dropdownLink: {
          ":not(:first-child)": {
            marginTop: 16,
          },
        },
      }),
    []
  );
};
