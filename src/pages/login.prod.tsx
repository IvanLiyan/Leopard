import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { StyleSheet } from "aphrodite";

import { LoadingIndicator } from "@ContextLogic/lego";
import { merchFeUrl, useRouter } from "@core/toolkit/router";
import { useUserStore } from "@core/stores/UserStore";
import LoginContainer from "@landing-pages/authentication/LoginContainer";

const LoginPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();
  const { loggedInMerchantUser } = useUserStore();
  const router = useRouter();

  if (loggedInMerchantUser != null) {
    void router.push(merchFeUrl("/"));

    return <LoadingIndicator style={styles.loadingIndicator} />;
  }

  return <LoginContainer />;
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        loadingIndicator: {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
        },
      }),
    [],
  );
};

export default observer(LoginPage);
