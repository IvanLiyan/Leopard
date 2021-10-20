import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Link } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";
import PartnerDeveloperCodeSection from "@merchant/component/external/partner-developer/PartnerDeveloperCodeSection";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

const infoMessageData = [
  {
    message: i`Build a **public app** that any of our 1,000,000+ merchants could use. `,
    linkMessage: i`Learn more`,
    href: zendeskURL("360025301354"),
  },
  {
    message:
      i`Want to build an app exclusively for your needs? ` +
      i`Sign up to develop a **private app**.`,
    linkMessage: i`View our guide`,
    href: zendeskURL("360034132014"),
  },
  {
    message: i`Want to experiment before committing?`,
    linkMessage: i`Check out our API Explorer`,
    href: "/documentation/api/v3/explorer",
  },
];

const PartnerDeveloperCodeExampleContent = () => {
  const styles = useStylesheet();
  return (
    <PartnerDeveloperSection className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.contentPanel)}>
          <div className={css(styles.title)}>Get started with the Wish API</div>
          <div className={css(styles.contentRow)}>
            {infoMessageData.map(({ message, linkMessage, href }) => (
              <div className={css(styles.infoWrapper)} key={href}>
                <Markdown text={message} />
                <Link
                  className={css(styles.infoLinkRow)}
                  href={href}
                  openInNewTab
                >
                  <div className={css(styles.infoLinkMessage)}>
                    {linkMessage}
                  </div>
                  <Icon name="arrowRightDarkBlue" />
                </Link>
              </div>
            ))}
          </div>
          <div className={css(styles.contentRow)}>
            <Link
              className={css(styles.infoLinkRow)}
              href="/documentation/api/v3/oauth"
            >
              <div className={css(styles.infoLinkMessage)}>
                Check out our OAuth tutorial
              </div>
              <Icon name="arrowRightDarkBlue" />
            </Link>
          </div>
          <div className={css(styles.contentRow)}>
            <Link
              className={css(styles.infoLinkRow)}
              href="/documentation/webhooks"
            >
              <div className={css(styles.infoLinkMessage)}>
                Check out our Webhooks Tutorial
              </div>
              <Icon name="arrowRightDarkBlue" />
            </Link>
          </div>
        </div>
        <PartnerDeveloperCodeSection />
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { textBlack, primary, surfaceLightest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
        },
        content: {
          display: "flex",
          padding: "0 40px",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            padding: "0 20px",
          },
        },
        contentPanel: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 750,
          margin: "0 40px 0 0",
          "@media (max-width: 1000px)": {
            maxWidth: "100%",
            margin: 20,
            alignItems: "center",
          },
        },
        contentRow: {
          width: "100%",
          display: "flex",
          "@media (max-width: 1000px)": {
            flexWrap: "wrap",
            justifyContent: "center",
          },
          margin: "0 0 40px 0",
        },
        title: {
          fontSize: "48px",
          textAlign: "start",
          lineHeight: 1.2,
          marginBottom: 60,
          fontWeight: weightBold,
          color: textBlack,
          "@media (max-width: 1000px)": {
            fontSize: "32px",
            textAlign: "center",
            marginBottom: 30,
          },
        },
        infoWrapper: {
          display: "flex",
          flexDirection: "column",
          marginRight: 60,
          maxWidth: 230,
          width: "100%",
          "@media (max-width: 1000px)": {
            margin: "0 10px",
            fontSize: "18px",
          },
        },
        infoLinkRow: {
          display: "flex",
          "@media (max-width: 1000px)": {
            marginBottom: 32,
            fontSize: "18px",
            marginTop: 12,
          },
        },
        infoLinkMessage: {
          color: primary,
          fontWeight: weightBold,
          marginRight: 16,
          fontSize: "16px",
        },
      }),
    [textBlack, primary, surfaceLightest],
  );
};

export default PartnerDeveloperCodeExampleContent;
