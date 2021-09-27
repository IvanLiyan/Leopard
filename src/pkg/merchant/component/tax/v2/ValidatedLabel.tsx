import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Theme, ThemedLabel, ThemedLabelProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { ValidatedState } from "@toolkit/tax/types-v2";

export type ValidatedLabelProps = Omit<ThemedLabelProps, "theme"> & {
  readonly state: ValidatedState;
};

const ValidatedThemes: {
  [status in ValidatedState]: {
    readonly theme: Theme;
    readonly title: string;
  };
} = {
  VALIDATED: {
    theme: "LightWishBlue",
    title: i`Validated`,
  },
  INCOMPLETE: {
    theme: `Yellow`,
    title: i`Incomplete`,
  },
  NOT_VALIDATED: {
    theme: "LightGrey",
    title: ci18n(
      "Means the merchant has not completed seller verification, a process some merchants must do to verify parts of their information",
      "Not Validated"
    ),
  },
};

const ValidatedLabel: React.FC<ValidatedLabelProps> = ({
  className,
  style,
  state,
  ...otherProps
}: ValidatedLabelProps) => {
  const styles = useStylesheet();

  const { theme, title } = ValidatedThemes[state];

  return (
    <ThemedLabel
      className={css(styles.root, className, style)}
      theme={theme}
      {...otherProps}
    >
      {title}
    </ThemedLabel>
  );
};

export default ValidatedLabel;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    []
  );
};
