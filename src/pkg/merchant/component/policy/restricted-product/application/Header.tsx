import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H4 } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import * as fonts from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const Header = ({ className, style }: BaseProps) => {
  const styles = useStylesheet();

  return (
    <div>
      <div className={css(styles.text, className, style)}>
        Products / Product Authorizations
      </div>
      <H4>Restricted Product Seller Application</H4>
    </div>
  );
};

export default observer(Header);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: textLight,
          fontWeight: fonts.weightMedium,
          fontSize: 16,
          lineHeight: 1.5,
        },
      }),
    [textLight]
  );
};
