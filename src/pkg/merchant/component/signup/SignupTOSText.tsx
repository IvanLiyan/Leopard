import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
type SignupTOSTextProps = BaseProps & {
  readonly buttonText: string;
};

const SignupTOSText = (props: SignupTOSTextProps) => {
  const styles = useStylesheet();
  const { className, style, buttonText } = props;

  const termLink = `[${i`Terms of Service`}](/terms-of-service)`;
  return (
    <Markdown
      className={css(styles.tosLink, style, className)}
      text={i`By clicking "${buttonText}", you agree to Wish's ${termLink}`}
      openLinksInNewTab
    />
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        tosLink: {
          fontSize: 14,
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightSemibold,
          marginBottom: 8,
        },
      }),
    []
  );

export default SignupTOSText;
