import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps;

const HeadersTable = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.header, styles.row)}
      >
        <Text weight="bold">HTTP Header</Text>
        <Text weight="bold">Description</Text>
        <Text weight="bold">Example</Text>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.row)}
      >
        <Text>Wish-Topic</Text>
        <Text>The subscribed topic.</Text>
        <Text>"ORDER_RELEASE"</Text>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.row)}
      >
        <Text>Wish-Hmac-Sha256</Text>
        <Text>Used for verifying webhooks.</Text>
        <Text>{'"8edf3bbd0bfafad0d03a0d696fce0b0fece4cb21"'}</Text>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.row)}
      >
        <Text>Wish-API-Version</Text>
        <Text>API version. Currently only V3 is supported.</Text>
        <Text>"V3"</Text>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.row)}
      >
        <Text>Wish-Merchant-ID</Text>
        <Text>ID of the merchant.</Text>
        <Text>{'"606315d295b32786d763e397"'}</Text>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.row)}
      >
        <Text>Wish-Subscription-ID</Text>
        <Text>ID of the webhook subscription.</Text>
        <Text>{'"606315bc95b32786d788d396"'}</Text>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        gap={5}
        className={css(styles.row)}
      >
        <Text>Wish-Retry-Attempt</Text>
        <Text>
          Number of times we have attempted to send this message. The integer
          value is between {"0"} to {"24"}.
        </Text>
        <Text>{'"0"'}</Text>
      </Layout.GridRow>
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack, textWhite, borderPrimary, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
          background: textWhite,
        },
        header: {
          background: borderPrimary,
        },
        // This is using display: grid
        /* eslint-disable local-rules/forgot-display-flex */
        row: {
          padding: 16,
          wordBreak: "break-word",
          borderBottom: `1px ${borderPrimaryDark} solid`,
          alignItems: "center",
        },
      }),
    [textBlack, textWhite, borderPrimary, borderPrimaryDark]
  );
};

export default observer(HeadersTable);
