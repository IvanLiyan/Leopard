import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

export type Event = {
  topic: string;
  condition: string | React.ReactNode;
};

type Props = BaseProps & {
  topics: ReadonlyArray<Event>;
  response: React.ReactNode;
};

const EventsTable = ({ response, topics, className, style }: Props) => {
  const styles = useStylesheet();
  const renderedTopics = topics.map(({ topic, condition }) => {
    const conditionRender =
      typeof condition === "string" ? <Text>{condition}</Text> : condition;

    return (
      <Layout.GridRow
        key={topic}
        templateColumns="1fr 1fr"
        alignItems="center"
        className={css(styles.row)}
      >
        <Text>{topic}</Text>
        {conditionRender}
      </Layout.GridRow>
    );
  });
  return (
    <div className={css(styles.root, className, style)}>
      <Layout.GridRow
        templateColumns="1fr 1fr 1fr"
        alignItems="center"
        className={css(styles.header, styles.row)}
      >
        <Text weight="bold">Webhook Topic</Text>
        <Text weight="bold">Firing Condition</Text>
        <Text weight="bold" style={{ paddingLeft: 16 }}>
          Response
        </Text>
      </Layout.GridRow>
      <Layout.GridRow templateColumns="2fr 1fr">
        <div>{renderedTopics}</div>
        <Layout.FlexColumn justifyContent="center" className={css(styles.col)}>
          {response}
        </Layout.FlexColumn>
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
        row: {
          wordBreak: "break-word",
          borderBottom: `1px ${borderPrimaryDark} solid`,
          padding: 16,
        },
        col: {
          wordBreak: "break-word",
          borderLeft: `1px ${borderPrimaryDark} solid`,
          borderBottom: `1px ${borderPrimaryDark} solid`,
          padding: 16,
        },
      }),
    [textBlack, textWhite, borderPrimary, borderPrimaryDark],
  );
};

export default observer(EventsTable);
