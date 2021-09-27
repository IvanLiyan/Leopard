import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Theme, ThemedLabel } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CommerceMerchantTaxInfoStatus } from "@schema/types";

const StatusThemes: {
  [status in CommerceMerchantTaxInfoStatus]: {
    readonly theme: Theme;
    readonly title: string;
  };
} = {
  PENDING_ONESOURCE_SETUP: {
    theme: "DarkYellow",
    title: i`Pending`,
  },
  PENDING_REVIEW: {
    theme: "DarkYellow",
    title: i`Pending`,
  },
  FAILED_REVIEW: {
    theme: "DarkRed",
    title: i`Failed`,
  },
  ACTIVE: {
    theme: "LightWishBlue",
    title: i`Active`,
  },
  OLD_ACTIVE_NEW_PENDING_REVIEW: {
    theme: "DarkYellow",
    title: i`Pending`,
  },
  INACTIVE: {
    theme: "DarkRed",
    title: i`Inactive`,
  },
};

export type TaxStatusLabelProps = BaseProps & {
  readonly status: CommerceMerchantTaxInfoStatus;
};

const TaxStatusLabel: React.FC<TaxStatusLabelProps> = ({
  className,
  style,
  status,
}: TaxStatusLabelProps) => {
  const styles = useStylesheet();

  if (status == null) return null;

  const { theme, title } = StatusThemes[status];

  return (
    <ThemedLabel className={css(styles.root, className, style)} theme={theme}>
      {title}
    </ThemedLabel>
  );
};

export default TaxStatusLabel;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontSize: 14,
        },
      }),
    []
  );
};
