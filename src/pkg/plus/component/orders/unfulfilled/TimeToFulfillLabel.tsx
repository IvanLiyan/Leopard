import React, { useMemo } from "react";
import moment from "moment-timezone";
import { ci18n } from "@legacy/core/i18n";

import { Popover } from "@merchant/component/core";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";
import { relativeTimeFormat } from "@toolkit/datetime";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TimeToFulfillLabelProps = BaseProps & {
  readonly hoursLeftToFulfill: number;
};

const TimeToFulfillLabel = (props: TimeToFulfillLabelProps) => {
  const { style, className, hoursLeftToFulfill } = props;
  const { theme, text } = useLabel(props);

  const deadline = moment().add(hoursLeftToFulfill, "hours");
  return (
    <Popover
      popoverContent={
        hoursLeftToFulfill > 1
          ? ci18n(
              "Placeholder is the time left to ship the order",
              "You have %1$s to fulfill this order.",
              relativeTimeFormat(deadline)
            )
          : undefined
      }
      position="top center"
    >
      <ThemedLabel className={css(style, className)} theme={theme}>
        {text}
      </ThemedLabel>
    </Popover>
  );
};

const useLabel = ({
  hoursLeftToFulfill,
}: TimeToFulfillLabelProps): {
  readonly text: string;
  readonly theme: Theme;
} => {
  return useMemo(() => {
    /* eslint-disable local-rules/unwrapped-i18n */
    const daysLeftToFulfill = Math.floor(hoursLeftToFulfill / 24);
    if (daysLeftToFulfill >= 15) {
      return { text: i`${15}+ days`, theme: "Grey" };
    }

    if (daysLeftToFulfill > 1) {
      return {
        text: i`${daysLeftToFulfill} days`,
        theme: daysLeftToFulfill > 2 ? "Grey" : "Yellow",
      };
    }

    return { text: i`1 day`, theme: "Red" };
  }, [hoursLeftToFulfill]);
};

export default TimeToFulfillLabel;
