import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Link, { LinkProps } from "@core/components/Link";
import { merchFeUrl } from "@core/toolkit/router";
import { css } from "@core/toolkit/styling";
import * as fonts from "@core/toolkit/fonts";
import { useTheme } from "@core/stores/ThemeStore";
import { useDeviceStore } from "@core/stores/DeviceStore";

export type SiteFooterProps = BaseProps & {
  readonly showCopyright?: boolean;
  readonly hideSitemap?: boolean;
  readonly ssoUrl?: string | null;
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
  const { className, style, showCopyright, hideSitemap, ssoUrl } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <FooterLink href={merchFeUrl("/terms-of-service")}>
        Terms of Service
      </FooterLink>
      <FooterDivider />
      <FooterLink href={merchFeUrl("/privacy-policy")}>
        Privacy Policy
      </FooterLink>
      {ssoUrl && (
        <>
          <FooterDivider />
          <FooterLink href={merchFeUrl(ssoUrl)}>Sign in with SSO</FooterLink>
        </>
      )}
      {!hideSitemap && (
        <>
          <FooterDivider />
          <FooterLink href={merchFeUrl("/plus/overview")}>Sitemap</FooterLink>
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
    [isSmallScreen, textLight, textBlack],
  );
};
