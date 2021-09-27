import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import LandingNavigation from "@merchant/component/landing/LandingNavigation";

/* Merchant Plus Components */
import SiteFooter from "@plus/component/nav/SiteFooter";

/* Merchant Store */
import { ThemeWrapper, useTheme } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { AuthenticationServiceSchema } from "@schema/types";
import StoreSignupBasicInfo from "@merchant/component/store-signup/StoreSignupBasicInfo";

export type Props = {
  readonly initialData: {
    readonly authentication: Pick<
      AuthenticationServiceSchema,
      "showCaptchaOnSignup"
    >;
  };
};

const StoreSignupBasicInfoContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const {
    authentication: { showCaptchaOnSignup },
  } = initialData;

  const showCaptcha = showCaptchaOnSignup ?? true;

  const { textDark } = useTheme();

  return (
    <ThemeWrapper overrideThemeAs="STORE">
      <div className={css(styles.root)}>
        <LandingNavigation
          className={css(styles.navigation)}
          showSignupButton={false}
          textColor={textDark}
        />
        <StoreSignupBasicInfo
          className={css(styles.content)}
          showCaptcha={showCaptcha}
        />
        <div className={css(styles.footerContainer)}>
          <SiteFooter showCopyright />
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
          padding: "50px 20px 0px 20px",
          minHeight: "calc(100vh - 50px)",
          backgroundColor: pageBackground,
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
          marginTop: 70,
          "@media (min-width: 650px)": {
            maxWidth: 650,
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
      }),
    [pageBackground]
  );
};

export default observer(StoreSignupBasicInfoContainer);
