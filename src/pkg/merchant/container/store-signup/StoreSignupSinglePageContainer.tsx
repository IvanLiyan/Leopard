import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import LandingNavigation from "@merchant/component/landing/LandingNavigation";
import SignupForm from "@merchant/component/store-signup/SignupForm";

/* Merchant Plus Components */
import SiteFooter from "@plus/component/nav/SiteFooter";

/* Merchant Store */
import { ThemeWrapper, useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import {
  SideMargin,
  FieldMaxWidth,
  StoreSignupSinglePageInitialData,
} from "@toolkit/store-signup";

/* Lego Components */
import { H3 } from "@ContextLogic/lego";

/* Model */
import StoreSignupSinglePageState from "@merchant/model/StoreSignupSinglePageState";

export type StoreSignupSinglePageProps = {
  readonly initialData: StoreSignupSinglePageInitialData;
};

const StoreSignupSinglePageContainer: React.FC<StoreSignupSinglePageProps> = ({
  initialData,
}: StoreSignupSinglePageProps) => {
  const styles = useStylesheet();

  const [signupState] = useState(
    new StoreSignupSinglePageState({ ...initialData })
  );

  const { textDark } = useTheme();

  return (
    <ThemeWrapper overrideThemeAs="STORE">
      <div className={css(styles.root)}>
        <LandingNavigation
          className={css(styles.navigation)}
          showSignupButton={false}
          textColor={textDark}
        />
        <div className={css(styles.contentContainer)}>
          <div className={css(styles.headerContainer)}>
            <H3>Let's get started!</H3>
            <div className={css(styles.headerDescription)}>
              Signing up is quick, simple and free!
            </div>
            <div className={css(styles.headerDescription)}>
              Boost foot traffic • Drive sales • Earn extra revenue • Source top
              products
            </div>
          </div>
          <SignupForm
            className={css(styles.content)}
            signupState={signupState}
            prefillStoreInfo={false}
          />
          <div className={css(styles.footerContainer)}>
            <SiteFooter showCopyright />
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: `50px ${SideMargin}px 0px ${SideMargin}px`,
          minHeight: "calc(100vh - 50px)",
          backgroundColor: pageBackground,
        },
        contentContainer: {
          display: "flex",
          flexDirection: "column",
        },
        headerContainer: {
          marginTop: 6,
        },
        headerDescription: {
          marginTop: 12,
        },
        footerContainer: {
          margin: "0px -20px", // account for parent's margin
          alignSelf: "stretch",
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        },
        content: {
          marginTop: 50,
          "@media (min-width: 650px)": {
            maxWidth: FieldMaxWidth,
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
          zIndex: 999,
        },
        downloadApp: {
          maxWidth: 536,
        },
      }),
    [pageBackground]
  );
};

export default observer(StoreSignupSinglePageContainer);
