import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { TopBottomButton, Layout, LoadingIndicator } from "@ContextLogic/lego";
import { useBoolQueryParam } from "@core/toolkit/url";
import { merchFeURL, useRouter } from "@core/toolkit/router";
import QuestionnaireModal from "@landing-pages/welcome-mms/QuestionnaireModal";
import { useDeviceStore } from "@core/stores/DeviceStore";
import HeroBanner from "@landing-pages/welcome-mms/HeroBanner";
import Services from "@landing-pages/welcome-mms/Services";
import HowToJoin from "@landing-pages/welcome-mms/HowToJoin";
import LoggedOutChrome from "src/app/landing-pages/common/logged-out-chrome/LoggedOutChrome";
import Pricing from "@landing-pages/welcome-mms/Pricing";
import Footer from "@landing-pages/welcome-mms/Footer";
import { IS_SMALL_SCREEN } from "@core/toolkit/styling";
import { NextPage } from "next";
import { useUserStore } from "@core/stores/UserStore";

const MmsWelcomeContainer: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();
  const { isSmallScreen, screenInnerWidth } = useDeviceStore();
  const { loggedInMerchantUser } = useUserStore();
  const router = useRouter();

  const [renderForm] = useBoolQueryParam("renderModal", false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] =
    useState(false);

  const insetX = isSmallScreen ? 30 : 0.17 * screenInnerWidth;

  useEffect(() => {
    if (renderForm && firstLoad) {
      setIsQuestionnaireModalOpen(true);
    }
    setFirstLoad(false);
  }, [firstLoad, renderForm]);

  if (loggedInMerchantUser != null) {
    void router.push(merchFeURL("/"));
    return <LoadingIndicator style={styles.loadingIndicator} />;
  }

  return (
    <Layout.FlexColumn alignItems="stretch">
      <LoggedOutChrome
        style={styles.navigation}
        insetX={insetX}
        ctaText={i`Complete the Questionnaire`}
        onClickCta={() => setIsQuestionnaireModalOpen(true)}
      />
      <HeroBanner
        onOpenQuestionnaire={() => setIsQuestionnaireModalOpen(true)}
      />
      <Services style={styles.services} />
      <HowToJoin
        style={styles.howToJoin}
        onOpenQuestionnaire={() => setIsQuestionnaireModalOpen(true)}
      />
      <Pricing style={styles.pricing} />
      <Footer
        style={styles.footer}
        onOpenQuestionnaire={() => setIsQuestionnaireModalOpen(true)}
      />
      <TopBottomButton includedButtons="top" style={styles.topButton} />
      <QuestionnaireModal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => setIsQuestionnaireModalOpen(false)}
      />
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        navigation: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5,
        },
        services: {
          padding: "128px 217px 92px",
          [`@media ${IS_SMALL_SCREEN}`]: {
            padding: "88px 31px",
          },
        },
        howToJoin: {
          padding: "128px 179px 100px",
          [`@media ${IS_SMALL_SCREEN}`]: {
            padding: "88px 31px",
          },
        },
        pricing: {
          padding: "33px 179px",
          [`@media ${IS_SMALL_SCREEN}`]: {
            padding: "88px 31px",
          },
        },
        footer: {
          padding: "74px 179px",
          borderRadius: "100px 100px 0px 0px",
          [`@media ${IS_SMALL_SCREEN}`]: {
            borderRadius: "unset",
            padding: "88px 31px",
          },
        },
        topButton: {
          position: "fixed",
          right: 50,
          bottom: 45,
          zIndex: 10,
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
    [],
  );
};

export default observer(MmsWelcomeContainer);
