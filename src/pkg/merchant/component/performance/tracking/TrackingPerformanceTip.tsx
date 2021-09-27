import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PerformanceSentiment = "neutral" | "poor" | "positive" | "NA";

type TrackingTipProps = BaseProps & {
  readonly sentiment: PerformanceSentiment;
};

type Context = TrackingTipProps & {
  readonly text: string;
  readonly color: string;
};

const TrackingPerformanceTip = (props: TrackingTipProps) => {
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

export default TrackingPerformanceTip;

const useTipContext = (props: TrackingTipProps): Context => {
  const { sentiment } = props;
  const trackingPolicyUrl = "/documentation/shippingproviders";
  let text =
    i`Valid Tracking Rate measures the percentage of orders that are ` +
    i`confirmed shipped. Start utilizing Wish-accepted high-quality ` + // eslint-disable-next-line local-rules/no-links-in-i18n
    i`shipping carriers. [View shipping carriers](${trackingPolicyUrl})`;
  let color = palettes.coreColors.WishBlue;

  if (sentiment == "poor") {
    text =
      i`Start utilizing Wish-accepted high-quality shipping carriers to ` +
      i`keep your Valid Tracking Rate above 95% and avoid risk of store ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`suspension. [View shipping carriers](${trackingPolicyUrl})`;
    color = palettes.reds.DarkRed;
  } else if (sentiment == "positive") {
    text =
      i`Congratulations! You are doing a great job keeping the Valid ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`Tracking Rate high. [View shipping carriers](${trackingPolicyUrl})`;
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
