import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, Layout, PrimaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { css } from "@core/toolkit/styling";

type ConnectWithUsProps = BaseProps & {
  readonly insetX: number;
  readonly onClickQuestionnaireButton: () => unknown;
};

const ConnectWithUs = (props: ConnectWithUsProps) => {
  const { style, className, onClickQuestionnaireButton } = props;
  const styles = useStylesheet(props);
  const { isSmallScreen } = useDeviceStore();

  return (
    <section className={css(styles.root, className, style)}>
      <Layout.FlexColumn alignItems={isSmallScreen ? "center" : "flex-start"}>
        <Text style={styles.title} weight="bold">
          Connect With Our Team
        </Text>
        <Text style={styles.secondary}>
          Tell us about your business, and we&#39;ll follow up with more
          information
        </Text>
      </Layout.FlexColumn>
      <PrimaryButton
        style={styles.cta}
        onClick={() => {
          onClickQuestionnaireButton();
        }}
      >
        Complete the Questionnaire
      </PrimaryButton>
    </section>
  );
};

export default observer(ConnectWithUs);

const useStylesheet = (props: ConnectWithUsProps) => {
  const { lightBlueSurface, textBlack, textDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          backgroundColor: lightBlueSurface,
          padding: `60px ${props.insetX}px`,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            justifyContent: "space-between",
            flexDirection: "row",
          },
        },
        title: {
          color: textBlack,
          marginBottom: 16,
          fontSize: 20,
          lineHeight: 1.14,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
        },
        secondary: {
          color: textDark,
          marginBottom: 32,
          fontSize: 16,
          maxWidth: 330,
          lineHeight: 1.14,
          "@media (max-width: 900px)": {
            textAlign: "center",
          },
        },
        cta: {
          "@media (max-width: 900px)": {
            marginLeft: 30,
          },
          margin: "0px 5px",
          lineHeight: 1.25,
          fontSize: 16,
          whiteSpace: "nowrap",
        },
      }),
    [props.insetX, textDark, textBlack, lightBlueSurface],
  );
};
