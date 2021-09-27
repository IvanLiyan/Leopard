import React, { useEffect, useMemo } from "react";
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
import { useToastStore } from "@merchant/stores/ToastStore";

/* Toolkit */
import StoreSignupContactInfo from "@merchant/component/store-signup/StoreSignupContactInfo";
import { Country, CountryCode } from "@schema/types";
import { useLoggedInUser } from "@merchant/stores/UserStore";

export type StoreContactInfoInitialData = {
  readonly initialData: {
    readonly platformConstants: {
      readonly interselectablePhoneCountries: ReadonlyArray<
        Pick<Country, "code">
      >;
    };
  };
};

const StoreSignupContactInfoContainer: React.FC<StoreContactInfoInitialData> = ({
  initialData,
}: StoreContactInfoInitialData) => {
  const styles = useStylesheet();

  const {
    from_signup_express: fromSignupExpress,
    utm_source: utmSource,
    back_to_onboarding_reason_name: backToOnboardingReasonName,
  } = useLoggedInUser();

  const isShopify = utmSource === "Shopify";
  const isPreorder = utmSource === "preorder_email";
  const isFakeNonCN = backToOnboardingReasonName === "FAKE_NON_CN_NO_REAL_NAME";
  const toastStore = useToastStore();

  const {
    platformConstants: { interselectablePhoneCountries },
  } = initialData;
  const interselectablePhoneCountryCodes = interselectablePhoneCountries.map(
    ({ code }) => code as CountryCode
  );

  useEffect(() => {
    if (isFakeNonCN) {
      toastStore.negative(
        i`We detected you as a Chinese merchant. Please submit Chinese information again`,
        { timeoutMs: 10000 }
      );
    }
  }, [isFakeNonCN, toastStore]);

  const { textDark } = useTheme();

  return (
    <ThemeWrapper overrideThemeAs="STORE">
      <div className={css(styles.root)}>
        <LandingNavigation
          className={css(styles.navigation)}
          showSignupButton={false}
          textColor={textDark}
        />
        <StoreSignupContactInfo
          className={css(styles.content)}
          showCNOptions={(isShopify || isPreorder) && fromSignupExpress}
          interselectablePhoneCountryCodes={interselectablePhoneCountryCodes}
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

export default observer(StoreSignupContactInfoContainer);
