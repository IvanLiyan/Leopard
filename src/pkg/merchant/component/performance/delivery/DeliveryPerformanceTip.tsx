import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PerformanceSentiment = "neutral" | "poor" | "positive" | "NA";

type DeliveryTipProps = BaseProps & {
  readonly sentiment: PerformanceSentiment;
};

type Context = DeliveryTipProps & {
  readonly text: string;
  readonly color: string;
};

const DeliveryPerformanceTip = (props: DeliveryTipProps) => {
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

export default DeliveryPerformanceTip;

const useTipContext = (props: DeliveryTipProps): Context => {
  const { sentiment } = props;
  const deliveryPolicyUrl = "/policy/fulfillment#5.4";
  let text =
    i`Confirmed Delivery Rate measures the percentage of orders ` + // eslint-disable-next-line local-rules/no-links-in-i18n
    i`that are confirmed delivered. [View policy](${deliveryPolicyUrl})`;
  let color = palettes.coreColors.WishBlue;

  if (sentiment == "poor") {
    text =
      i`${"95%"} or more of your relevant orders should be confirmed delivered ` +
      i`by a qualified carrier within ${30} days of the order being available ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`for fulfillment. [View policy](${deliveryPolicyUrl})`;
    color = palettes.reds.DarkRed;
  } else if (sentiment == "positive") {
    text =
      i`Keep it up! The majority of your orders are confirmed ` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i`delivered on time! [View policy](${deliveryPolicyUrl})`;
    color = palettes.cyans.LightCyan;
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
