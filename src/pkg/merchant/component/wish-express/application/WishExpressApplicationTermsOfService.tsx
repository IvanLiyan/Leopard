import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { arrowLeft, scroll, closeIcon } from "@assets/icons";

/* Merchant Components */
import WishExpressTermsOfService from "@merchant/component/wish-express/terms/WishExpressTermsOfService";

/* Merchant API */
import * as wishExpressApi from "@merchant/api/wish-express";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

/* eslint-disable local-rules/use-markdown */

export type WishApplicationTermsOfServiceProps = BaseProps & {
  readonly closeModal: () => unknown;
  readonly onComplete: (str: ApplicationStep) => unknown;
  readonly onBack: (str: ApplicationStep) => unknown;
};

type ApplicationStep =
  | "WishExpressApplicationRequirements"
  | "WishExpressApplicationTermsOfService"
  | "WishExpressApplicationCompletedSignUp";

const WishExpressApplicationTermsOfService = (
  props: WishApplicationTermsOfServiceProps,
) => {
  const styles = useStylesheet(props);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const zoom = (window.outerWidth - 10) / window.innerWidth;
    const target = e.target as HTMLDivElement;
    const bottomOfTerms =
      target.scrollHeight - target.scrollTop - zoom < target.clientHeight;
    if (bottomOfTerms) {
      setIsDisabled(false);
    }
  };

  return (
    <div className={css(styles.contentContainer)}>
      <div className={css(styles.root)}>
        <div
          className={css(styles.backArrowContainer)}
          onClick={() => props.onBack("WishExpressApplicationRequirements")}
        >
          <img src={arrowLeft} alt="back" className={css(styles.backArrow)} />
        </div>
        <img src={scroll} alt="scroll" className={css(styles.scroll)} />
        <div
          className={css(styles.exitButton)}
          onClick={() => props.closeModal()}
        >
          <img src={closeIcon} alt="close" />
        </div>
        <Illustration
          name="wishExpressWithText"
          alt="wish-express-logo"
          className={css(styles.wishLogo)}
        />
        <div className={css(styles.modalHeader)}>
          Wish Express Qualifications and Terms
        </div>
        <div className={css(styles.termsOfService)} onScroll={handleScroll}>
          <WishExpressTermsOfService />
        </div>
      </div>
      <div className={css(styles.footerContainer)}>
        <div className={css(styles.footer)}>
          <div className={css(styles.footerText)}>
            By clicking on I Agree, you understand and agree to Wish Express
            Qualifications and Terms
          </div>
          <PrimaryButton
            isDisabled={isDisabled}
            className={css(styles.actionButton)}
            popoverContent={
              isDisabled
                ? i`Please review the terms of service in full, ` +
                  i`before proceeding to the next step`
                : null
            }
            popoverPosition="top center"
            onClick={async () => {
              await wishExpressApi.enrollMerchant().call();
              props.onComplete("WishExpressApplicationCompletedSignUp");
            }}
          >
            I Agree
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default observer(WishExpressApplicationTermsOfService);

const useStylesheet = (props: WishApplicationTermsOfServiceProps) => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingLeft: 52,
          paddingRight: 52,
        },
        termsOfService: {
          height: "250px",
          overflowY: "auto",
        },
        modalHeader: {
          display: "flex",
          fontSize: "24px",
          fontWeight: fonts.weightSemibold,
          fontStyle: "normal",
          fontStretch: "normal",
          lineHeight: 1.17,
          color: textBlack,
          paddingTop: 20,
          marginBottom: 40,
        },
        exitButton: {
          position: "absolute",
          right: 0,
          top: 0,
          paddingTop: 16,
          paddingRight: 24,
          width: 24,
          backgroundColor: "ffffff",
          cursor: "pointer",
        },
        wishLogo: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 192,
          objectFit: "contain",
          paddingTop: 64,
        },
        actionButton: {
          margin: "10px 0px",
        },
        footer: {
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "4px",
          boxShadow: "inset 0 1px 0 0 #c4cdd5",
          backgroundColor: "#f8fafb",
          paddingBottom: 10,
        },
        footerText: {
          paddingTop: 20,
        },
        footerContainer: {
          display: "block",
        },
        contentContainer: {
          display: "inline-block",
          borderRadius: "4px",
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          backgroundColor: "#ffffff",
        },
        scroll: {
          paddingTop: 90,
          paddingRight: 52,
          width: 96,
          top: 0,
          right: 0,
          position: "absolute",
          paddingBottom: 10,
        },
        backArrow: {
          width: 24,
          backgroundColor: "ffffff",
          cursor: "pointer",
        },
        backArrowContainer: {
          position: "absolute",
          left: 0,
          top: 0,
          paddingTop: 16,
          paddingLeft: 16,
        },
      }),
    [textBlack],
  );
};
