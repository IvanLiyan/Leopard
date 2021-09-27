import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type NewTrueBrandRequestConfirmationProps = BaseProps & {
  isMerchantPlus?: boolean;
};

const IS_MERCHANT_PLUS_DEFAULT = false;

const NewTrueBrandRequestConfirmation = ({
  style,
  isMerchantPlus = IS_MERCHANT_PLUS_DEFAULT,
}: NewTrueBrandRequestConfirmationProps) => {
  const styles = useStylesheet();
  const brandSuggestionLink = `[${i`Brand Suggestions`}](/my-brand-requests)`;
  const text = isMerchantPlus
    ? i`Your suggestion has been submitted and will be reviewed by Wish ` +
      i`before your brand appears on this list. You will receive an email ` +
      i`once your request has been approved.`
    : i`Your suggestion has been submitted and will be reviewed by Wish ` +
      i`before your brand appears on this list. To check the status of ` +
      i`your pending suggestion, go to the ${brandSuggestionLink} page.`;

  return (
    <div className={css(styles.container, style)}>
      <Illustration
        style={css(styles.illustration)}
        name={"submitTrueBrandRequestConfirmation"}
        alt={"success"}
      />
      <Markdown style={css(styles.text)} text={text} />
    </div>
  );
};

export default NewTrueBrandRequestConfirmation;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: "60px 128px 93px 128px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        illustration: {
          height: "12.5em",
          width: "12.5em",
        },
        text: {
          marginTop: 35,
          textAlign: "center",
          fontSize: 16,
          lineHeight: 1.5,
        },
      }),
    []
  );
