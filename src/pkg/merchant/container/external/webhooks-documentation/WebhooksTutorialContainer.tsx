import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PartnerDeveloperSiteNavbar from "@merchant/component/nav/chrome/partner-developer/PartnerDeveloperSiteNavbar";
import Navbar from "@merchant/component/external/webhooks/Navbar";
import BasePage from "@merchant/component/external/webhooks/BasePage";

/* Merchant Store */
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const DefaultNavWidth = 260;

const WebhooksTutorialContainer = ({ className, style }: Props) => {
  const styles = useStylesheet();
  const { surfaceLightest } = useTheme();

  return (
    <div className={css(className, style)}>
      <PartnerDeveloperSiteNavbar background={surfaceLightest} />

      <div className={css(styles.content)}>
        <Navbar className={css(styles.nav)} />
        <BasePage />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { isVerySmallScreen } = useDimenStore();

  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          marginTop: 80,
        },
        // We are still using flex, but it's behind a ternary expression
        /* eslint-disable local-rules/forgot-display-flex */
        nav: {
          position: "sticky",
          top: 80,
          width: isVerySmallScreen ? 0 : DefaultNavWidth,
          height: "100%",
          display: isVerySmallScreen ? "none" : "flex",
          flexDirection: "column",
        },
      }),
    [isVerySmallScreen],
  );
};

export default observer(WebhooksTutorialContainer);
