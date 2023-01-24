import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Layout, Text } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@core/stores/ThemeStore";

type LoginCardProps = BaseProps & {
  readonly title: string;
  readonly subtitle?: string;
};

const LoginCard: React.FC<LoginCardProps> = (props: LoginCardProps) => {
  const { className, style, title, subtitle, children } = props;
  const styles = useStylesheet();

  return (
    <Card className={className} style={style}>
      <Layout.FlexColumn style={styles.root} alignItems="center">
        <Text style={styles.title} weight="bold">
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Layout.FlexColumn style={styles.content} alignItems="stretch">
          {children}
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(LoginCard);

const useStylesheet = () => {
  const { textBlack, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 25,
          backgroundColor: surfaceLightest,
        },
        title: {
          fontSize: 24,
          lineHeight: 1.33,
          color: textBlack,
          alignSelf: "center",
          textAlign: "center",
          padding: "15px 0px 8px",
          cursor: "default",
        },
        subtitle: {
          maxWidth: 280,
          fontSize: 14,
        },
        content: {
          marginTop: 24,
          alignSelf: "stretch",
        },
      }),
    [textBlack, surfaceLightest],
  );
};
