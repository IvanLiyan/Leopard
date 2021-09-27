import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { H4 } from "@ContextLogic/lego";

/* SellerProfileVerification Imports */
import CardHeader from "@merchant/component/seller-profile-verification/CardHeader";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type DnBRedirectPageProps = BaseProps & {
  readonly onBack: () => unknown;
  readonly url: string;
};

const DnBRedirectPage = (props: DnBRedirectPageProps) => {
  const { className, style, url, onBack } = props;

  const styles = useStylesheet();

  const info =
    i`Up next, you will leave merchant.wish.com and continue your validation process` +
    i`by filling up a **Know Your Customer (KYC) questionnaire.**`;

  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={onBack}
        displayType={"back"}
      />
      <H4>Validate your business merchant account type</H4>
      <Markdown className={css(styles.content)} text={info} />
      <div className={css(styles.buttonResizer)}>
        <PrimaryButton href={url} openInNewTab>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

export default DnBRedirectPage;

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        header: {
          marginTop: 24,
        },
        back: {
          cursor: "pointer",
        },
        content: {
          margin: "16px 16% 0 16%",
          color: textDark,
          textAlign: "center",
        },
        buttonResizer: {
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          margin: "20px 30% 40px 30%",
        },
      }),
    [textDark]
  );
};
