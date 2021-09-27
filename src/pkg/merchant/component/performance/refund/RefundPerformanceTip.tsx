import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PerformanceSentiment = "neutral" | "poor" | "positive" | "NA";

type RefundTipProps = BaseProps & {
  readonly sentiment: PerformanceSentiment;
};

type Context = RefundTipProps & {
  readonly text: string;
  readonly color: string;
};

const RefundPerformanceTip = (props: RefundTipProps) => {
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

export default RefundPerformanceTip;

const useTipContext = (props: RefundTipProps): Context => {
  const { sentiment } = props;
  const refundPolicyUrl = "/policy/refunds#7.19";
  let text =
    i`Refund Rate measures the percentage of total transactions ` + // eslint-disable-next-line local-rules/no-links-in-i18n
    i`that are refunded. [View policy](${refundPolicyUrl})`;
  let color = palettes.coreColors.WishBlue;

  if (sentiment == "poor") {
    text =
      i`You will be ineligible to receive payments from ` +
      i`refunded orders if your store has a high refund ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`rate. [View policy](${refundPolicyUrl})`;
    color = palettes.reds.DarkRed;
  } else if (sentiment == "positive") {
    text =
      i`Great work! On-time delivery and high-quality products ` +
      i`correlate with low refunds and more returning ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`customers. [View policy](${refundPolicyUrl})`;
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
