import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import EmailAlreadySent from "@merchant/component/signup/EmailAlreadySent";
import AnotherEmailAddress from "@merchant/component/signup/AnotherEmailAddress";
import { PromotionCardBanner } from "@merchant/component/core";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Type Imports */
import { UserSchema } from "@schema/types";

type InitialData = {
  readonly currentUser: Pick<UserSchema, "confirmEmailPath">;
};

type InitialProps = {
  readonly initialData: InitialData;
};

const OnboardingVerifyEmailContainer: React.FC<InitialProps> = ({
  initialData,
}: InitialProps) => {
  const {
    currentUser: { confirmEmailPath },
  } = initialData;
  const styles = useStylesheet();
  const {
    userStore: { loggedInMerchantUser: mu },
  } = useStore();

  const { utm_source: source, preorder_gmv: preorderGMV } = mu;

  const [currentEmail, setCurrentEmail] = useState(mu.email);
  const [showAnotherEmailPage, setShowAnotherEmailPage] = useState(false);

  return (
    <div className={css(styles.root)}>
      {!showAnotherEmailPage && (
        <Card className={css(styles.content)}>
          {source === "preorder_email" && (
            <PromotionCardBanner
              defaultIllustration={"preorderOnboardingLogo"}
              title={i`Just one more step`}
              subtitle={i`Complete sign-up today to ship your orders and gain $${preorderGMV} of sales.`}
            />
          )}

          <EmailAlreadySent
            email={currentEmail}
            emailConfirmationURL={`/${confirmEmailPath}`}
            onTryAnotherEmail={() => setShowAnotherEmailPage(true)}
          />
        </Card>
      )}
      {showAnotherEmailPage && (
        <Card className={css(styles.content)}>
          <AnotherEmailAddress
            onEmailChanged={(newEmail) => setCurrentEmail(newEmail)}
            onGoBack={() => setShowAnotherEmailPage(false)}
          />
        </Card>
      )}
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "50px 50px 200px 50px",
          backgroundColor: colors.pageBackground,
        },
        content: {
          width: "100%",
          maxWidth: 650,
        },
      }),
    []
  );
};

export default observer(OnboardingVerifyEmailContainer);
