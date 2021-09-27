import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";
import { Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { houseWithFlag } from "@assets/illustrations";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Toolkit */
import { useLogger } from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type EmailAlreadySentProp = BaseProps & {
  readonly email: string;
  readonly emailConfirmationURL: string;
  readonly onTryAnotherEmail: () => unknown;
};

const EmailAlreadySent = (props: EmailAlreadySentProp) => {
  const {
    email,
    emailConfirmationURL,
    onTryAnotherEmail,
    className,
    style,
  } = props;

  const navigationStore = useNavigationStore();

  const [resendDisabled, setResendDisabled] = useState(false);
  const logger = useLogger("CLICK_CHECK_MY_MAIL");

  const emailMap = {
    "gmail.com": "https://gmail.com",
    "hotmail.com": "https://outlook.live.com",
    "outlook.com": "https://outlook.live.com",
    "icloud.com": "https://www.icloud.com",
    "me.com": "https://www.icloud.com",
  };

  const tryAnotherEmailLink = `[${i`try another email address`}](#).`;

  const getMailbox = () => {
    const postfix = email.replace(/.*@/, "").toLowerCase();
    if (!postfix) {
      return null;
    }
    const mailbox = (emailMap as any)[postfix]; // any required for legacy style
    if (!mailbox) {
      return null;
    }
    return mailbox;
  };

  const onResendEmail = async () => {
    if (resendDisabled) {
      return;
    }

    setResendDisabled(true);
    await onboardingApi
      .sendConfirmEmail({
        email,
        regenerate_code: false,
      })
      .call();
    const { toastStore } = AppStore.instance();
    toastStore.positive(i`Email has been resent!`);
    setResendDisabled(false);
  };

  const onCheckMyMail = () => {
    logger.info({
      current_email: email,
    });
    const mailbox = getMailbox();
    navigationStore.navigate(mailbox, {
      openInNewTab: true,
    });
  };

  const onVerifyEmail = () => {
    logger.info({
      confirm_email_path: emailConfirmationURL,
    });
    navigationStore.navigate(emailConfirmationURL, {
      openInNewTab: true,
    });
  };

  const styles = useStylesheets();
  const { negative } = useTheme();

  return (
    <div className={css(styles.root, style, className)}>
      <img className={css(styles.img)} src={houseWithFlag} />
      <Text weight="bold" className={css(styles.title)}>
        Verify your email
      </Text>
      <div className={css(styles.text)}>We have sent an email to</div>
      <Text weight="bold" className={css(styles.email)}>
        {email}
      </Text>
      {getMailbox() && (
        <PrimaryButton className={css(styles.button)} onClick={onCheckMyMail}>
          Go check my email
        </PrimaryButton>
      )}
      <Link style={styles.resend} onClick={onResendEmail}>
        <Text weight="regular">Resend email</Text>
      </Link>
      {emailConfirmationURL && (
        <Layout.FlexColumn alignItems="center">
          <Text weight="bold" className={css(styles.warningText)}>
            {`Warning: The below link is for internal use only.`}
          </Text>
          <Text className={css(styles.descriptionText)}>
            {`This will redirect you to verify your email in a new tab.`}
          </Text>
          <SecondaryButton
            color={negative}
            className={css(styles.warningButton)}
            onClick={onVerifyEmail}
          >
            {`Verify my email`}
          </SecondaryButton>
        </Layout.FlexColumn>
      )}
      <div className={css(styles.footer)}>
        <div className={css(styles.footerText)}>
          Only after we review your store, you can start getting sales.
        </div>
        <Markdown
          className={css(styles.footerText)}
          onLinkClicked={onTryAnotherEmail}
          text={
            i`Did not receive the email? Check your spam folder,` +
            i` or ${tryAnotherEmailLink}.`
          }
        />
      </div>
    </div>
  );
};

export default EmailAlreadySent;

const useStylesheets = () => {
  const { textDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          fontSize: 16,
        },
        img: {
          alignSelf: "stretch",
        },
        title: {
          marginTop: 40,
          fontSize: 24,
          lineHeight: 1.5,
          color: palettes.textColors.DarkInk,
        },
        text: {
          lineHeight: "24px",
          marginTop: 24,
        },
        email: {
          lineHeight: "24px",
        },
        button: {
          marginTop: 24,
        },
        resend: {
          marginTop: 24,
        },
        footer: {
          marginTop: 34,
          padding: 16,
          backgroundColor: palettes.greyScaleColors.LighterGrey,
          alignSelf: "stretch",
        },
        footerText: {
          fontSize: 14,
          lineHeight: "20px",
        },
        warningText: {
          marginTop: 24,
          lineHeight: "24px",
          color: negative,
        },
        descriptionText: {
          lineHeight: "24px",
          color: textDark,
        },
        warningButton: {
          marginTop: 12,
        },
      }),
    [textDark, negative]
  );
};
