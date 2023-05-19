import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TopBottomButton, Layout, LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import InviteOnlySection from "src/app/landing-pages/welcome-invite-only/InviteOnlySection";
import SellingOnWishV2 from "src/app/landing-pages/welcome-invite-only/SellingOnWishV2";
import ConnectWithUs from "src/app/landing-pages/welcome-invite-only/ConnectWithUs";
import MerchantCommunity from "src/app/landing-pages/welcome-invite-only/MerchantCommunity";
import LoggedOutChrome from "src/app/landing-pages/common/logged-out-chrome/LoggedOutChrome";
import { NextPage } from "next";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useBoolQueryParam } from "@core/toolkit/url";
import { merchFeUrl, useRouter } from "@core/toolkit/router";
import SiteFooter from "@landing-pages/common/logged-out-chrome/SiteFooter";
import { useTheme } from "@core/stores/ThemeStore";
import SignupQuestionnaireModal from "src/app/landing-pages/welcome-invite-only/questionnaire/SignupQuestionnaireModal";
import { useUserStore } from "@core/stores/UserStore";

const WelcomeInviteOnlyContainer: NextPage<Record<string, never>> = () => {
  const { isSmallScreen, screenInnerWidth } = useDeviceStore();
  const insetX = isSmallScreen ? 30 : 0.17 * screenInnerWidth;
  const styles = useStylesheet({ insetX });
  const { loggedInMerchantUser } = useUserStore();
  const router = useRouter();

  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] =
    useState(false);
  const [renderForm] = useBoolQueryParam("renderModal", false);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (renderForm && firstLoad) {
      setIsQuestionnaireModalOpen(true);
    }
    setFirstLoad(false);
  }, [firstLoad, renderForm]);

  if (loggedInMerchantUser != null) {
    void router.push(merchFeUrl("/"));
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }

  return (
    <Layout.FlexColumn alignItems="stretch">
      <SignupQuestionnaireModal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => setIsQuestionnaireModalOpen(false)}
      />
      <LoggedOutChrome
        style={styles.navigation}
        insetX={insetX}
        ctaText={i`Complete the Questionnaire`}
        onClickCta={() => setIsQuestionnaireModalOpen(true)}
      />
      <InviteOnlySection
        style={styles.inviteOnly}
        onClickQuestionnaireButton={() => setIsQuestionnaireModalOpen(true)}
      />
      <MerchantCommunity style={styles.community} insetX={insetX} />
      <SellingOnWishV2 insetX={insetX} />
      <ConnectWithUs
        insetX={insetX}
        style={styles.readyToGrow}
        onClickQuestionnaireButton={() => setIsQuestionnaireModalOpen(true)}
      />
      <SiteFooter style={styles.footer} />
      <TopBottomButton includedButtons="top" style={styles.topButton} />
    </Layout.FlexColumn>
  );
};

const useStylesheet = ({ insetX }: { readonly insetX: number }) => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        navigation: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        },
        inviteOnly: {
          marginTop: 10,
        },
        readyToGrow: {
          backgroundColor: textWhite,
        },
        topButton: {
          position: "fixed",
          right: 50,
          bottom: 45,
          zIndex: 1000,
        },
        community: {
          marginTop: 50,
        },
        footer: {
          paddingLeft: insetX,
          paddingRight: insetX,
        },
        loadingIndicator: {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
        },
      }),
    [textWhite, insetX],
  );
};

export default observer(WelcomeInviteOnlyContainer);
