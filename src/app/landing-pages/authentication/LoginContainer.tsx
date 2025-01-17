import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { useIntQueryParam, useStringQueryParam } from "@core/toolkit/url";
import { useRouter } from "@core/toolkit/router";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import {
  SARDINE_FLOW,
  initAndUpdatedateSardineSDK,
} from "@core/toolkit/sardineSDK";

import {
  OKTA_OAUTH_URL_QUERY,
  OktaUrlQueryResponseType,
} from "@landing-pages/authentication/toolkit/okta-oauth";

/* Merchant Components */
import LoginForm from "@landing-pages/authentication/LoginForm";
import SiteFooter from "@core/components/SiteFooter";

/* Merchant Store */
import { useSardineConstants } from "@core/stores/SardineStore";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import LoggedOutChrome from "@landing-pages/common/logged-out-chrome/LoggedOutChrome";

const LoginContainer: React.FC = () => {
  const styles = useStylesheet();
  const router = useRouter();
  const { pageBackground } = useTheme();

  const [reset] = useIntQueryParam("reset");
  const [sessionExpired] = useStringQueryParam("session_expired");
  const [oktaErr] = useStringQueryParam("okta_err");

  const toastStore = useToastStore();

  const { data: oktaOauthUrlData } = useQuery<OktaUrlQueryResponseType, void>(
    OKTA_OAUTH_URL_QUERY,
  );

  const oktaUrl = oktaOauthUrlData?.platformConstants?.oktaOauthUri;

  const { sardineHost, sardineClientId, sardineSessionKey } =
    useSardineConstants();

  useEffect(() => {
    const effect = async () => {
      try {
        await initAndUpdatedateSardineSDK(
          SARDINE_FLOW.SIGNIN,
          sardineHost,
          sardineClientId,
          sardineSessionKey,
          null,
        );
      } catch (error) {
        // Want a console log here for debugging purpose
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    void effect();
  }, [sardineHost, sardineClientId, sardineSessionKey]);

  useMountEffect(() => {
    if (reset) {
      toastStore.positive(
        i`Your password has been successfully reset. ` +
          i`Please sign in with your new password.`,
      );
    }
    if (sessionExpired) {
      toastStore.negative(i`Your session has expired due to inactivity.`);
    }
    if (oktaErr) {
      toastStore.negative(i`Failed to login with Okta.`);
    }
  });

  return (
    <Layout.FlexColumn style={styles.root} justifyContent="space-between">
      <Layout.FlexColumn style={styles.topContainer} alignItems="center">
        <LoggedOutChrome
          style={styles.navigation}
          showLoginButton={false}
          ctaText={i`Complete the Questionnaire`}
          onClickCta={() =>
            router.push("/welcome-invite-only?renderModal=true")
          }
          showTopBarCtaButton={false}
          backgroundColor={pageBackground}
        />
        <LoginForm style={styles.content} />
      </Layout.FlexColumn>
      <SiteFooter hideSitemap ssoUrl={oktaUrl} />
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          minHeight: "100vh",
        },
        topContainer: {
          padding: "50px 20px 0px 20px",
          backgroundColor: pageBackground,
          minHeight: "calc(100% - 298px)",
        },
        content: {
          marginTop: 70,
          "@media (min-width: 650px)": {
            minWidth: 330,
          },
          "@media (max-width: 650px)": {
            alignSelf: "stretch",
          },
        },
        navigation: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        },
      }),
    [pageBackground],
  );
};

export default observer(LoginContainer);
