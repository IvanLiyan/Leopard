import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4Markdown } from "@ContextLogic/lego";
import { H5Markdown } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const EmptyBrandPerformanceOverview = ({ className }: BaseProps) => {
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className)}>
      <H4Markdown text={i`Brand Performance Overview`} />
      <Card className={css(styles.card)}>
        <Illustration
          name="fbsEmptyState"
          alt={i`illustration`}
          className={css(styles.illustration)}
        />
        <H5Markdown
          text={i`Register your branded products to view performance`}
          className={css(styles.title)}
        />
        <Markdown
          className={css(styles.content)}
          text={
            i`Branded products receive more exposure on Wish. If you are ` +
            i`interested in selling authentic branded products, properly ` +
            i`tag your products with the correct brand names.`
          }
          openLinksInNewTab
        />
      </Card>
    </div>
  );
};

export default observer(EmptyBrandPerformanceOverview);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        headerContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        },
        card: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          minHeight: 500,
        },
        title: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 24,
          fontWeight: fonts.weightBold,
        },
        content: {
          fontSize: 16,
          color: textBlack,
          marginTop: 8,
          marginBottom: 20,
          maxWidth: 560,
          textAlign: "center",
        },
        illustration: {
          height: 160,
        },
      }),
    [textBlack],
  );
};
