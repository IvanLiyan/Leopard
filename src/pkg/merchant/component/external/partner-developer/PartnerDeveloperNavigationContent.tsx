import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

const infoMessageData = [
  {
    message: i`With just a few lines of code, you can plug into the sprawling Wish ecosystem.`,
    linkMessage: i`View our API docs`,
    href: "/documentation/api/v3/reference",
  },
  {
    message: i`Not sure about something? We’ve got answers! Check out our FAQ or contact us.`,
    linkMessage: i`View our FAQ`,
    href: "/faq",
  },
];

const PartnerDeveloperNavigationContent = () => {
  const styles = useStylesheet();

  return (
    <PartnerDeveloperSection className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.contentPanel)}>
          <Illustration
            className={css(styles.illustration)}
            name="developerNavigationIllustration"
            alt="developer landing illustration"
          />
        </div>
        <div className={css(styles.contentPanel)}>
          <div className={css(styles.title)}>
            Build the future of affordable shopping
          </div>
          <div className={css(styles.contentRow)}>
            {infoMessageData.map(({ message, linkMessage, href }) => (
              <div className={css(styles.infoWrapper)} key={href}>
                <div className={css(styles.infoMessage)}>{message}</div>
                <Link
                  className={css(styles.infoLinkRow)}
                  href={href}
                  openInNewTab
                >
                  <div className={css(styles.infoLinkMessage)}>
                    {linkMessage}
                  </div>
                  <Icon name="arrowRightWhite" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { textWhite, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: textBlack,
        },
        content: {
          display: "flex",
          padding: "150px 40px",
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
          padding: "150px 40px",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            maxWidth: "100%",
            margin: "20px",
          },
          ":last-child": {
            maxWidth: 550,
          },
        },
        contentRow: {
          display: "flex",
          width: "100%",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          },
        },
        title: {
          color: textWhite,
          fontSize: "60px",
          fontWeight: weightBold,
          lineHeight: 1.2,
          marginBottom: 60,
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
          maxWidth: 225,
          width: "100%",
          "@media (max-width: 1000px)": {
            margin: "0 10px",
            fontSize: "18px",
          },
        },
        infoMessage: {
          fontSize: "16px",
          lineHeight: 1.5,
          marginBottom: 14,
          color: textWhite,
          "@media (max-width: 1000px)": {
            fontSize: "18px",
          },
        },
        infoLinkRow: {
          display: "flex",
          "@media (max-width: 1000px)": {
            marginBottom: 32,
            fontSize: "18px",
          },
        },
        infoLinkMessage: {
          color: textWhite,
          fontWeight: weightBold,
          marginRight: 16,
          fontSize: "16px",
        },
        illustration: {
          marginRight: 150,
          "@media (max-width: 1000px)": {
            maxWidth: 300,
            marginRight: 0,
          },
        },
      }),
    [textWhite, textBlack]
  );
};

export default PartnerDeveloperNavigationContent;
