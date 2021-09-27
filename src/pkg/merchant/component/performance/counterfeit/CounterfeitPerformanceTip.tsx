import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type PerformanceSentiment = "neutral" | "poor" | "positive" | "NA";

type CounterfeitTipProps = BaseProps & {
  readonly sentiment: PerformanceSentiment;
};

type Context = CounterfeitTipProps & {
  readonly text: string;
  readonly color: string;
};

const CounterfeitPerformanceTip = (props: CounterfeitTipProps) => {
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

export default CounterfeitPerformanceTip;

const useTipContext = (props: CounterfeitTipProps): Context => {
  const { sentiment } = props;
  const counterfeitPolicyUrl = "/policy/ip";
  let text =
    i`Counterfeit Rate measures the weekly percentage of Wish-reviewed ` +
    i`products that infringe on the intellectual property of ` + // eslint-disable-next-line local-rules/no-links-in-i18n
    i`others. [View policy](${counterfeitPolicyUrl})`;
  let color = palettes.coreColors.WishBlue;

  if (sentiment == "poor") {
    text =
      i`Take proactive measures such as conducting an IP clearance ` +
      i`check before listing products to avoid IP-related fines and ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`product removal. [View policy](${counterfeitPolicyUrl})`;
    color = palettes.reds.DarkRed;
  } else if (sentiment == "positive") {
    text =
      i`Your product listings are accurate, descriptive, and in ` +
      i`compliance with Wish's intellectual property ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`policies. [View policy](${counterfeitPolicyUrl})`;
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
  });
