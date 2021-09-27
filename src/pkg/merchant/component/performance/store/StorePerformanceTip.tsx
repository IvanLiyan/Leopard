import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PerformanceSentiment = "neutral" | "poor" | "positive" | "NA";

type StoreTipProps = BaseProps & {
  readonly sentiment: PerformanceSentiment;
};

type Context = StoreTipProps & {
  readonly text: string;
  readonly color: string;
};

const StorePerformanceTip = (props: StoreTipProps) => {
  const context = useTipContext(props);
  const styles = useStyleSheet(context);
  const { text } = context;

  return (
    <div className={css(styles.tipContainer)}>
      <Text weight="bold" className={css(styles.tipLabel)}>
        How does this affect me?
      </Text>
      <Markdown text={text} openLinksInNewTab />
    </div>
  );
};

export default StorePerformanceTip;

const useTipContext = (props: StoreTipProps): Context => {
  const { sentiment } = props;
  const storePolicyUrl = "/policy/refunds#7.16";
  let text =
    i`Store Rating measures the average of all store ratings ` +
    i`you receive every week. Sell quality products to improve ` + // eslint-disable-next-line local-rules/no-links-in-i18n
    i`your Store Rating. [View policy](${storePolicyUrl})`;
  let color = palettes.coreColors.WishBlue;

  if (sentiment == "poor") {
    text =
      i`Maintain a high average store rating to avoid fines ` +
      i`due to extremely low rating and/or potential product ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`removal. [View policy](${storePolicyUrl})`;
    color = palettes.reds.DarkRed;
  } else if (sentiment == "positive") {
    text =
      i`Hooray! High-quality products and shipping service ` +
      i`help you maintain an excellent store ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`rating. [View policy](${storePolicyUrl})`;
    color = palettes.cyans.LightCyan;
  } else if (sentiment == "neutral") {
    color = palettes.textColors.LightInk;
  }

  return {
    ...props,
    text,
    color,
  };
};

const useStyleSheet = (ctx: Context) =>
  useMemo(
    () =>
      StyleSheet.create({
        tipContainer: {
          padding: "calc(7% - 4px) calc(7% - 4px)",
          borderTop: `1px solid rgba(175, 199, 209, 0.5)`,
          borderLeft: `4px solid ${ctx.color}`,
          height: 125,
        },
        tipLabel: {
          fontSize: 16,
          color: palettes.textColors.Ink,
          textAlign: "left",
          marginBottom: 5,
        },
      }),
    [ctx.color]
  );
