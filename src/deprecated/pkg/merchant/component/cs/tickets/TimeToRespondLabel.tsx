import React, { useMemo } from "react";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";
import { Timedelta } from "@schema/types";
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly delta: Pick<Timedelta, "hours" | "minutes" | "days">;
};

const TimeToRespondLabel = (props: Props) => {
  const { style, className } = props;
  const { theme, text } = useLabel(props);

  return (
    <ThemedLabel className={css(style, className)} theme={theme}>
      {text}
    </ThemedLabel>
  );
};

const useLabel = ({
  delta,
}: Props): {
  readonly text: string;
  readonly theme: Theme;
} => {
  return useMemo(() => {
    /* eslint-disable local-rules/unwrapped-i18n */
    if (delta.days > 1) {
      const days = Math.floor(delta.days).toString();
      const text = ni18n(days, "1 day", "{%1=number of days} days");
      return { text, theme: delta.days < 3 ? "Yellow" : "LighterCyan" };
    }

    if (delta.hours > 1) {
      const hours = Math.floor(delta.hours).toString();
      const text = ni18n(hours, "1 hour", "{%1=number of hours} hours");
      return { text, theme: "Red" };
    }

    if (delta.minutes > 1) {
      const minutes = Math.floor(delta.minutes).toString();
      const text = ni18n(minutes, "1 minute", "{%1=number of minutes} minutes");
      return { text, theme: "Red" };
    }

    return { text: i`Respond Now!`, theme: "Red" };
  }, [delta]);
};

export default TimeToRespondLabel;
