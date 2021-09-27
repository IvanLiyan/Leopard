import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TopBottomButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import SiteFooter from "@merchant/component/nav/SiteFooter";
import MainSection from "@merchant/component/landing/MainSection";
import SellingOnWish from "@merchant/component/landing/SellingOnWish";
import LandingNavigation from "@merchant/component/landing/LandingNavigation";
import ReadyToGrowYourBusiness from "@merchant/component/landing/ReadyToGrowYourBusiness";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const LandingContainer = () => {
  const styles = useStylesheet();
  const {
    dimenStore: { isSmallScreen, screenInnerWidth },
  } = useStore();

  const insetX = isSmallScreen ? 30 : 0.17 * screenInnerWidth;

  useEffect(() => {
    if ((window as any).fbq) {
      (window as any).fbq("trackCustom", "NewSiteVisit");
    }
  }, []);

  return (
    <div className={css(styles.root)}>
      <LandingNavigation
        className={css(styles.navigation)}
        insetX={insetX}
        expansionThreshold={640}
      />
      <MainSection />
      <SellingOnWish insetX={insetX} />
      <ReadyToGrowYourBusiness
        className={css(styles.readyToGrow)}
        insetX={insetX}
      />
      <SiteFooter insetX={insetX} />
      <TopBottomButton
        includedButtons="top"
        className={css(styles.topButton)}
      />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        navigation: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
        },
        readyToGrow: {
          backgroundColor: palettes.textColors.White,
        },
        topButton: {
          position: "fixed",
          right: 50,
          bottom: 45,
          zIndex: 1000,
        },
      }),
    []
  );
};

export default observer(LandingContainer);
