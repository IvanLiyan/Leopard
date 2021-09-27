import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PerformanceSentiment = "neutral" | "poor" | "positive" | "NA";

type FulfillmentTipProps = BaseProps & {
  readonly sentiment: PerformanceSentiment;
};

type Context = FulfillmentTipProps & {
  readonly text: string;
  readonly color: string;
};

const FulfillmentPerformanceTip = (props: FulfillmentTipProps) => {
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

export default FulfillmentPerformanceTip;

const useTipContext = (props: FulfillmentTipProps): Context => {
  const { sentiment } = props;
  const fulfillmentPolicyUrl = "/policy/fulfillment#5.5";
  let text =
    i`Confirmed Fulfillment Time measures the duration between ` +
    i`order released date and the date we receive your tracking ` + // eslint-disable-next-line local-rules/no-links-in-i18n
    i`number. [View policy](${fulfillmentPolicyUrl})`;
  let color = palettes.coreColors.WishBlue;

  if (sentiment == "poor") {
    color = palettes.reds.DarkRed;
  } else if (sentiment == "positive") {
    text =
      i`You have been staying on top of things and fulfilling orders ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`timely. [View policy](${fulfillmentPolicyUrl})`;
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
