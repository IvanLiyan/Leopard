import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Illustration } from "@merchant/component/core";
import { TextInput } from "@ContextLogic/lego";
import { PalaceBluePrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";
import {
  EmailValidator,
  NoWishEmailsValidator,
  RequiredValidator,
} from "@toolkit/validators";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useUserStore } from "@merchant/stores/UserStore";

/* Merchant Model */
import PartnerDeveloperGlobalState from "@merchant/model/external/partner-developer/PartnerDeveloperGlobalState";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { PrimaryButtonProps } from "@ContextLogic/lego";

const signUpUrl = "/erp-partner/signup";

type PartnerDeveloperIntroContentProps = {
  readonly confirmLogoutModal: () => void;
  readonly partnerDeveloperState: PartnerDeveloperGlobalState;
};

const PartnerDeveloperIntroContent = ({
  confirmLogoutModal,
  partnerDeveloperState,
}: PartnerDeveloperIntroContentProps) => {
  const styles = useStylesheet();

  const { isLoggedIn, loggedInMerchantUser } = useUserStore();

  let buttonProps: PrimaryButtonProps = {
    href: undefined,
    onClick: undefined,
  };

  if (!loggedInMerchantUser?.is_api_user && isLoggedIn) {
    buttonProps = {
      ...buttonProps,
      onClick: confirmLogoutModal,
    };
  } else {
    buttonProps = {
      ...buttonProps,
      href: partnerDeveloperState.introEmail
        ? `${signUpUrl}?email=${partnerDeveloperState.introEmail}`
        : signUpUrl,
    };
  }

  return (
    <PartnerDeveloperSection className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.contentPanel)}>
          <div className={css(styles.title)}>
            Help merchants make life affordable for 500 million customers
          </div>
          <div className={css(styles.message)}>
            Develop apps that tap into a global market of merchants, earn
            revenue, and make an impact.
          </div>
          {!loggedInMerchantUser?.is_api_user && (
            <div className={css(styles.contentRow)}>
              <TextInput
                style={styles.emailInput}
                validators={[
                  new RequiredValidator(),
                  new EmailValidator(),
                  new NoWishEmailsValidator(),
                ]}
                placeholder={i`Your email`}
                onChange={({ text }: OnTextChangeEvent) => {
                  partnerDeveloperState.introEmail = text.trim();
                }}
                onValidityChanged={(valid) => {
                  partnerDeveloperState.isIntroEmailValid = valid;
                }}
                value={partnerDeveloperState.introEmail}
              />
              <PalaceBluePrimaryButton
                className={css(styles.signUpButton)}
                {...buttonProps}
              >
                Get Started
              </PalaceBluePrimaryButton>
            </div>
          )}
        </div>
        <div className={css(styles.contentPanel)}>
          <Illustration
            className={css(styles.illustration)}
            name="developerLandingIllustration"
            alt="developer landing illustration"
          />
        </div>
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { textBlack, textLight, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
        },
        signUpButton: {
          fontSize: 18,
          marginLeft: 15,
          height: 30,
          "@media (max-width: 900px)": {
            height: 26,
          },
        },
        emailInput: {
          width: "100%",
          maxWidth: 350,
          "@media (max-width: 900px)": {
            maxWidth: "100%",
          },
        },
        content: {
          display: "flex",
          padding: "0 40px",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 900px)": {
            flexDirection: "column-reverse",
            padding: "0 20px",
          },
        },
        contentPanel: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 900px)": {
            flexDirection: "column",
            margin: 20,
          },
          ":first-child": {
            maxWidth: 650,
            margin: "20px 100px 20px 0",
          },
        },
        contentRow: {
          display: "flex",
          width: "100%",
        },
        title: {
          fontSize: "60px",
          lineHeight: 1.2,
          marginBottom: 16,
          fontWeight: weightBold,
          color: textBlack,
          "@media (max-width: 900px)": {
            fontSize: "32px",
          },
        },
        message: {
          fontSize: "24px",
          lineHeight: 1.5,
          marginBottom: 24,
          color: textLight,
          "@media (max-width: 900px)": {
            fontSize: "18px",
          },
        },
        illustration: {
          "@media (max-width: 900px)": {
            maxWidth: 300,
          },
        },
      }),
    [textBlack, textLight, surfaceLightest]
  );
};

export default observer(PartnerDeveloperIntroContent);
