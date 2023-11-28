import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Store */
import { useTheme } from "@core/stores/ThemeStore";

/* Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WssSectionProps = BaseProps & {
  readonly title: string;
  readonly subtitle?: () => React.ReactNode;
};

const ListingFeesSection: React.FC<WssSectionProps> = (props) => {
  const { className, style, title, subtitle, children } = props;

  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Text style={styles.title} weight="bold">
        {title}
      </Text>
      {subtitle && (
        <Layout.FlexColumn style={styles.subtitle}>
          {subtitle()}
        </Layout.FlexColumn>
      )}
      <Layout.FlexColumn style={styles.children}>{children}</Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default ListingFeesSection;

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: 28,
          color: textBlack,
        },
        subtitle: {
          marginTop: 8,
        },
        children: {
          marginTop: 30,
          flexGrow: 1,
        },
      }),
    [textBlack],
  );
};
