import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInput } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PalaceBluePrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import {
  EmailValidator,
  NoWishEmailsValidator,
  RequiredValidator,
} from "@toolkit/validators";
import { css } from "@toolkit/styling";

/* Merchant Components */
import PartnerDeveloperSection from "@merchant/component/external/partner-developer/PartnerDeveloperSection";

/* Merchant Model */
import PartnerDeveloperGlobalState from "@merchant/model/external/partner-developer/PartnerDeveloperGlobalState";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useUserStore } from "@stores/UserStore";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { PrimaryButtonProps } from "@ContextLogic/lego";

const signUpUrl = "/erp-partner/signup";

type PartnerDeveloperGetStartedContentProps = {
  readonly confirmLogoutModal: () => void;
  readonly partnerDeveloperState: PartnerDeveloperGlobalState;
};

const PartnerDeveloperGetStartedContent = ({
  confirmLogoutModal,
  partnerDeveloperState,
}: PartnerDeveloperGetStartedContentProps) => {
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
      href: partnerDeveloperState.getStartedEmail
        ? `${signUpUrl}?email=${partnerDeveloperState.getStartedEmail}`
        : signUpUrl,
    };
  }

  return (
    <PartnerDeveloperSection className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.contentPanel)}>
          <Illustration
            name="developerDeskIllustration"
            alt={i`Developer desk illustration`}
          />
        </div>
        <div className={css(styles.contentPanel)}>
          <div className={css(styles.title)}>Ready to get started?</div>
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
                partnerDeveloperState.getStartedEmail = text.trim();
              }}
              onValidityChanged={(valid) => {
                partnerDeveloperState.isGetStartedEmailValid = valid;
              }}
              value={partnerDeveloperState.getStartedEmail}
            />
            <PalaceBluePrimaryButton
              className={css(styles.signUpButton)}
              {...buttonProps}
            >
              Sign up
            </PalaceBluePrimaryButton>
          </div>
        </div>
      </div>
    </PartnerDeveloperSection>
  );
};

const useStylesheet = () => {
  const { textBlack, surfaceLightest } = useTheme();
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
          padding: 40,
          justifyContent: "center",
          alignItems: "center",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            padding: "0 20px",
          },
        },
        contentPanel: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 100px 0 0",
          "@media (max-width: 1000px)": {
            flexDirection: "column",
            maxWidth: "100%",
            margin: 20,
          },
        },
        contentRow: {
          display: "flex",
          justifyContent: "center",
          width: "100%",
        },
        title: {
          fontSize: "40px",
          lineHeight: 1.4,
          marginBottom: 48,
          fontWeight: weightBold,
          color: textBlack,
          "@media (max-width: 900px)": {
            fontSize: "32px",
            textAlign: "center",
            marginBottom: 30,
          },
        },
      }),
    [textBlack, surfaceLightest],
  );
};

export default observer(PartnerDeveloperGetStartedContent);
