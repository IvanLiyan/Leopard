import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { wishURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type SignupTOSTextProps = BaseProps & {
  readonly buttonText: string;
};

const StoreSignupTOSText = (props: SignupTOSTextProps) => {
  const styles = useStylesheet();
  const { className, style, buttonText } = props;

  const merchantTermsLink = "/terms-of-service";
  const retailTermsLink = wishURL("/local/terms");

  return (
    <Markdown
      className={css(styles.tosLink, style, className)}
      text={
        i`By clicking "${buttonText}", you agree to the ` +
        i`[Retailer Terms of Service](${retailTermsLink}) and ` +
        i`[Merchant Terms of Service](${merchantTermsLink})`
      }
      openLinksInNewTab
    />
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        tosLink: {
          fontSize: 14,
          color: textDark,
          fontWeight: fonts.weightSemibold,
          marginBottom: 8,
        },
      }),
    [textDark],
  );
};

export default StoreSignupTOSText;
