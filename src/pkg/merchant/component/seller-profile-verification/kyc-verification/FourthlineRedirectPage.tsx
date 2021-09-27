import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Components */
import { Markdown, H4, H6 } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* SellerProfileVerification Imports */
import CardHeader from "@merchant/component/seller-profile-verification/CardHeader";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FourthlineRedirectProps = BaseProps & {
  readonly code: string;
  readonly onBack: () => unknown;
};

const FourthlineRedirectPage = (props: FourthlineRedirectProps) => {
  const { className, style, onBack, code } = props;

  const styles = useStylesheet();

  const info =
    i`Up next, you will leave merchant.wish.com and continue your ` +
    i`validation process within the **Fourthline mobile app**. `;

  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={onBack}
        displayType={"back"}
      />
      <H4>Validate your individual merchant account type</H4>
      <Markdown className={css(styles.info)} text={info} />
      <div className={css(styles.instructionSet)}>
        <div className={css(styles.step)}>
          <div className={css(styles.stepNumber)}>
            <H6>1</H6>
          </div>

          <div className={css(styles.instructions)}>
            <div className={css(styles.illustrationWrapper)}>
              <Illustration name="fourthlineLogoDark" alt="Fourthline" />
            </div>

            <Markdown
              text={i`Download the Fourthline app to your mobile device`}
            />
            <div className={css(styles.links)}>
              <Link
                openInNewTab
                href={
                  "https://apps.apple.com/nl/app/fourthline-kyc/id1515523663"
                }
              >
                Visit App Store
              </Link>
              <Link
                className={css(styles.googleLink)}
                openInNewTab
                href={
                  "https://play.google.com/store/apps/details?id=com.fourthline.fourthlinekyc"
                }
              >
                Visit Google Play
              </Link>
            </div>
          </div>
        </div>

        <div className={css(styles.step)}>
          <div className={css(styles.stepNumber)}>
            <H6>2</H6>
          </div>

          <div className={css(styles.instructions)}>
            <Markdown
              text={
                i`Enter the following ${8}-character access code ` +
                i`in the Fourthline mobile app to continue.`
              }
            />
            <H4 className={css(styles.code)}>{code}</H4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourthlineRedirectPage;

const useStylesheet = () => {
  const { pageBackground } = useTheme();
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
        info: {
          padding: "0 15%",
          textAlign: "center",
        },
        illustrationWrapper: {
          width: 128,
        },
        instructionSet: {
          alignSelf: "flex-start",
          marginLeft: "15%",
        },
        step: {
          marginTop: 30,
          display: "flex",
        },
        stepNumber: {
          borderRadius: "50%",
          height: 40,
          width: 40,
          backgroundColor: pageBackground,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "flex-start",
        },
        instructions: {
          flex: 1,
          margin: "4px 0 0 10px",
          maxWidth: 400,
        },
        links: {
          marginTop: 10,
        },
        googleLink: {
          marginLeft: 10,
        },
        code: {
          borderRadius: "10%",
          padding: "10px 20px",
          margin: "15px 0 40px 0",
          backgroundColor: pageBackground,
          display: "inline-block",
        },
      }),
    [pageBackground]
  );
};
