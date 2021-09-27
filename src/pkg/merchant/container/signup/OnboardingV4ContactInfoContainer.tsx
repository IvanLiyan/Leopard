import React, { useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Lego Components */
import { TopBarHeight } from "@merchant/component/nav/chrome/ChromeTopBar"; // eslint-disable-line local-rules/no-lego-direct-import

/* Merchant Components */
import SignupContactInfo from "@merchant/component/signup/SignupContactInfo";

/* Merchant Plus Components */
import SiteFooter from "@plus/component/nav/SiteFooter";

/* Toolkit */
import { OnboardingV4ContactInfoInitialData } from "@toolkit/signup/signup-types";
import { useLoggedInUser } from "@merchant/stores/UserStore";

/* Merchant Store */
import { useToastStore } from "@merchant/stores/ToastStore";
import { CountryCode } from "@schema/types";

type Props = {
  readonly initialData: OnboardingV4ContactInfoInitialData;
};

const OnboardingV4ContactInfoContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();

  const {
    phone_number: phoneNumber,
    from_signup_express: fromSignupExpress,
    is_paypal_merchant: usePreApprovedPhoneNumber,
    utm_source: utmSource,
    back_to_onboarding_reason_name: backToOnboardingReasonName,
  } = useLoggedInUser();

  const isShopify = utmSource === "Shopify";
  const isPreorder = utmSource === "preorder_email";
  const isFakeNonCN = backToOnboardingReasonName === "FAKE_NON_CN_NO_REAL_NAME";
  const lockCountry = isFakeNonCN ? "CN" : null;
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

  return (
    <div className={css(styles.root)}>
      <SignupContactInfo
        className={css(styles.content)}
        preApprovedPhoneNumber={
          usePreApprovedPhoneNumber ? phoneNumber : undefined
        }
        hideTOS={(isShopify || isPreorder) && fromSignupExpress}
        showCNOptions={(isShopify || isPreorder) && fromSignupExpress}
        lockCountry={lockCountry}
        interselectablePhoneCountryCodes={interselectablePhoneCountryCodes}
      />
      <div className={css(styles.footerContainer)}>
        <SiteFooter showCopyright />
      </div>
    </div>
  );
};

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "column",
      backgroundColor: colors.pageBackground,
      minHeight: `calc(100vh - ${TopBarHeight}px)`,
    },
    content: {
      flexShrink: 0, // prevent content from being cut-off in safari https://stackoverflow.com/questions/43682851/flex-box-cuts-off-long-content-on-ios
      margin: "50px 50px 0px 50px",
      "@media (min-width: 900px)": {
        width: 530,
      },
    },
    footerContainer: {
      alignSelf: "stretch",
    },
  });

export default observer(OnboardingV4ContactInfoContainer);
