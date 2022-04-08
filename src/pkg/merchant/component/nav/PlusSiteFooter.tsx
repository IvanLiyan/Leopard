/* moved from
 * @plus/component/nav/SiteFooter.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

/*
 *
 * SiteFooter.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/15/2020, 7:41:30 PM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import "@ContextLogic/lego";
import { LinkProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Link from "@next-toolkit/Link";

export type SiteFooterProps = BaseProps & {
  readonly showCopyright?: boolean;
  readonly hideSitemap?: boolean;
};

type FooterLinkProps = Pick<LinkProps, "href" | "children">;
const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
}: FooterLinkProps) => {
  const styles = useStylesheet();

  return (
    <Link
      href={href}
      className={css(styles.link)}
      style={{ ...styles.text }} // must use style instead of class name to properly override color in Link
      fadeOnHover={false}
    >
      {children}
    </Link>
  );
};

const FooterDivider = () => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();

  if (isSmallScreen) {
    return null;
  }

  return <div className={css(styles.dot)} />;
};

const SiteFooter = (props: SiteFooterProps) => {
  const { className, style, showCopyright, hideSitemap } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
      <FooterDivider />
      <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
      {!hideSitemap && (
        <>
          <FooterDivider />
          <FooterLink href="/plus/overview">Sitemap</FooterLink>
        </>
      )}
      {showCopyright && (
        <>
          <FooterDivider />
          <div className={css(styles.text)}>
            © {new Date().getFullYear()} ContextLogic Inc.
          </div>
        </>
      )}
    </div>
  );
};

export default observer(SiteFooter);

const useStylesheet = () => {
  const { isSmallScreen } = useDeviceStore();
  const { textLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          alignItems: isSmallScreen ? "flex-end" : "center",
          justifyContent: isSmallScreen ? undefined : "flex-start",
          padding: "200px calc(35px - 12px) 15px calc(35px - 12px)", // account for item padding, matching PlusTopBar
        },
        text: {
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: fonts.weightMedium,
          color: textLight,
          margin: "0px 12px",
          transition: "color 0.3s linear",
        },
        link: {
          ":hover": {
            color: textBlack,
          },
        },
        dot: {
          flexShrink: 0,
          height: 2,
          width: 2,
          backgroundColor: textLight,
          borderRadius: "50%",
        },
      }),
    [isSmallScreen, textLight, textBlack]
  );
};
