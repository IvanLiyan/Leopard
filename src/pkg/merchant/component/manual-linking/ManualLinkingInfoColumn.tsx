import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { Card, Layout, Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import Link from "@next-toolkit/Link";

/**
 * Manual linking info column - include FAQs about store linking
 * WARNING: this file is being used in legacy page account_settings.js, hence TSC will
 * be skipped. Pay extra attention to API changes etc. that may break the code and do
 * not rely on tsc for picking up errors.
 */
const ManualLinkingInfoColumn: React.FC<BaseProps> = ({
  style,
  className,
}: BaseProps) => {
  const styles = useStylesheet();

  return (
    <Card style={[styles.root, className, style]}>
      <Layout.FlexColumn style={styles.textContainer}>
        <Text style={styles.title} weight="semibold">
          Why should you link your stores?
        </Text>
        <Markdown
          text={
            i`Linking your stores helps keep you compliant with [Wish Policy](${"/policy#1.2"}), ` +
            i`helps ensure your account stays active, helps foster a healthy ecosystem ` +
            i`on Wish, and helps build trust with our global merchant and consumer base.`
          }
          style={styles.content}
          openLinksInNewTab
        />
        <Link
          href={zendeskURL("4712758736923")}
          style={styles.link}
          openInNewTab
        >
          Learn more
        </Link>
      </Layout.FlexColumn>
    </Card>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        textContainer: {
          gap: 4,
        },
        title: {
          fontSize: 16,
          color: textBlack,
        },
        content: {
          fontSize: 14,
          color: textDark,
        },
        link: {
          fontSize: 14,
        },
      }),
    [textBlack, textDark]
  );
};

export default ManualLinkingInfoColumn;
