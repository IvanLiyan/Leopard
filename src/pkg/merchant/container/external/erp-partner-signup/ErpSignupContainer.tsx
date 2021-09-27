import React from "react";
import { StyleSheet } from "aphrodite";
import { observer, useLocalStore } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes, text } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import LandingNavigation from "@merchant/component/landing/LandingNavigation";
import ErpSignupInfo from "@merchant/component/signup/erp-signup/ErpSignupInfo";
import ErpSignupSideMenu from "@merchant/component/signup/erp-signup/ErpSignupSideMenu";

/* External Models */
import ErpSignupState from "@merchant/model/external/erp-signup/ErpSignupState";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const ErpSignupContainer = () => {
  const styles = useStylesheet();
  const erpSignUpState = useLocalStore(() => new ErpSignupState());
  const wishLogoText = ci18n(
    "placed beside a 'Wish' logo to display 'Wish for ERPs'.",
    "for ERPs"
  );
  return (
    <div className={css(styles.root)}>
      <LandingNavigation
        className={css(styles.navigation)}
        showSignupButton={false}
        showLoginButton={false}
        wishLogoColor="white"
        wishLogoText={wishLogoText}
        backgroundColor={palettes.coreColors.DarkerWishBlue}
        expansionEnabled={false}
        style={{ padding: "0px 48px 0px 328px" }}
      />
      <div className={css(styles.content)}>
        <ErpSignupSideMenu
          className={css(styles.sideMenu)}
          titles={erpSignUpState.sections}
        />
        <ErpSignupInfo
          className={css(styles.pageContent)}
          state={erpSignUpState}
        />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const {
    dimenStore: { isVerySmallScreen, screenInnerHeight },
  } = AppStore.instance();
  return StyleSheet.create({
    root: {
      display: "flex",
      alignItems: "stretch",
      flexDirection: "column",
      color: text,
    },
    navigation: {
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      backgroundColor: palettes.coreColors.DarkerWishBlue,
    },
    sideMenu: {
      position: "fixed",
      width: isVerySmallScreen ? 0 : 280,
      top: 62,
      left: 0,
      height: screenInnerHeight,
      display: "flex",
      flexDirection: "column",
      zIndex: 3,
      boxShadow:
        "0 1px 3px 0 rgba(63, 63, 68, 0.15), 1px 0 5px 0 rgba(63, 63, 68, 0.05)",
    },
    content: {
      display: "flex",
    },
    pageContent: {
      flex: 1,
      marginLeft: isVerySmallScreen ? 0 : 280,
    },
  });
};

export default observer(ErpSignupContainer);
