import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useDeviceStore } from "@stores/DeviceStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type StandardsPageSectionProps = BaseProps;

const StandardsPageSection: React.FC<StandardsPageSectionProps> = (
  props: StandardsPageSectionProps
) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet();
  const { style, className } = props;

  const StandardsBox = isSmallScreen ? Layout.FlexColumn : Layout.FlexRow;

  return (
    <StandardsBox
      style={[styles.root, className, style]}
      justifyContent="center"
      alignItems="center"
    >
      <Layout.FlexRow style={styles.section} justifyContent="center">
        <div className={css(styles.textSection)}>
          <Text style={styles.title} weight="bold">
            Wish Standards page
          </Text>
          <Text style={styles.subtitle}>
            View details on your tier, and how you can improve, under the
            Merchant Dashboard’s Performance tab.
          </Text>
        </div>
      </Layout.FlexRow>
      <Illustration
        name="wssScreenshot"
        alt={i`Wish Standards page`}
        style={styles.screenshot}
      />
    </StandardsBox>
  );
};

const useStylesheet = () => {
  const { isSmallScreen, isVeryLargeScreen } = useDeviceStore();
  const { textDark, textBlack, surfaceDarker } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: isSmallScreen ? "56px 16px 72px 16px" : "84px 0 112px",
        },
        section: {
          flex: isVeryLargeScreen ? undefined : 1,
        },
        textSection: {
          maxWidth: isSmallScreen ? undefined : 480,
          margin: isSmallScreen ? undefined : 80,
        },
        header: {
          fontSize: isSmallScreen ? 14 : 16,
          color: surfaceDarker,
        },
        title: {
          fontSize: isSmallScreen ? 20 : 28,
          color: textBlack,
          margin: isSmallScreen ? "14px 0" : "24px 0",
        },
        subtitle: {
          fontSize: 16,
          color: textDark,
        },
        screenshot: {
          position: "relative",
          right: -5,
          maxWidth: isSmallScreen ? 400 : 702,
          width: isSmallScreen ? "100%" : "50%",
          marginTop: isSmallScreen ? 24 : undefined,
        },
      }),
    [textDark, textBlack, surfaceDarker, isSmallScreen, isVeryLargeScreen]
  );
};

export default observer(StandardsPageSection);
