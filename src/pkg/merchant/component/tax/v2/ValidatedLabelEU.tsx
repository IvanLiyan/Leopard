import React from "react";

/* Lego Components */
import { Theme, ThemedLabel, ThemedLabelProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { ValidatedStateEU } from "@toolkit/tax/types-v2";

export type ValidatedLabelEUProps = Omit<ThemedLabelProps, "theme"> & {
  readonly state: ValidatedStateEU;
};

const ValidatedThemesEU: {
  readonly [status in ValidatedStateEU]: {
    readonly theme: Theme;
    readonly title: string;
  };
} = {
  VALIDATED: {
    theme: "LightWishBlue",
    title: i`Validated`,
  },
  NOT_STARTED: {
    theme: `Yellow`,
    title: i`Not Started`,
  },
  NOT_ESTABLISHED: {
    theme: `Yellow`,
    title: i`Not Established`,
  },
  PENDING_REVIEW: {
    theme: `LightGrey`,
    title: i`Pending Review`,
  },
  REJECTED: {
    theme: `Red`,
    title: i`Rejected`,
  },
};

const ValidatedLabelEU: React.FC<ValidatedLabelEUProps> = ({
  className,
  style,
  state,
  ...otherProps
}: ValidatedLabelEUProps) => {
  const { theme, title } = ValidatedThemesEU[state];

  return (
    <ThemedLabel
      className={css(className, style)}
      theme={theme}
      {...otherProps}
    >
      {title}
    </ThemedLabel>
  );
};

export default ValidatedLabelEU;
