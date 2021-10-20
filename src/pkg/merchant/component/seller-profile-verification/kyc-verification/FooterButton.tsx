import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { AppTheme, useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PrimaryButton } from "@ContextLogic/lego";

type FooterButtonProps = BaseProps & {
  readonly isDisabled: boolean;
  readonly isLoading: boolean;
  readonly text: string;
  readonly onClick: () => void;
};

const FooterButton = (props: FooterButtonProps) => {
  const { className, style, isDisabled, isLoading, onClick, text } = props;

  const theme = useTheme();
  const styles = useStylesheet(theme);

  return (
    <div className={css(styles.root, style, className)}>
      <PrimaryButton
        style={css(styles.buttonResizer)}
        onClick={onClick}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        {text}
      </PrimaryButton>
    </div>
  );
};

export default FooterButton;

const useStylesheet = (theme: AppTheme) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: "stretch",
          padding: 24,
          borderTop: `1px solid ${theme.borderPrimaryDark}`,
        },
        buttonResizer: {
          margin: "0 30%",
        },
      }),
    [theme],
  );
};
