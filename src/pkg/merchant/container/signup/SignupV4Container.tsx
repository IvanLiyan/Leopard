import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import SignupBasicInfo from "@merchant/component/signup/SignupBasicInfo";
import LandingNavigation from "@merchant/component/landing/LandingNavigation";
import { ReferralDetails } from "@merchant/model/RevShareState";

/* Merchant Plus Components */
import SiteFooter from "@plus/component/nav/SiteFooter";

/* Merchant API */
import * as onboardingApi from "@merchant/api/onboarding";
import { getReferralApp } from "@merchant/api/merchant-apps";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { ThemeWrapper, useTheme } from "@merchant/stores/ThemeStore";
import ERPPromoProgramV2 from "@merchant/model/external/erp-promo-program/ERPPromoProgramV2";

/* Toolkit */
import { AuthenticationServiceSchema } from "@schema/types";
import {
  MerchantInviteInfoPick,
  SalesforceLeadInfoPick,
  BdSignupCodeInfoPick,
} from "@toolkit/signup/signup-types";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import NavigationStore from "@merchant/stores/NavigationStore";

export type Props = {
  readonly initialData: {
    readonly authentication: Pick<
      AuthenticationServiceSchema,
      "showCaptchaOnSignup"
    > & {
      merchantInviteInfo?: MerchantInviteInfoPick;
      salesforceLeadInfo?: SalesforceLeadInfoPick;
      bdSignupCodeInfo?: BdSignupCodeInfoPick;
    };
  };
};

const SignupV4Container: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const {
    authentication: {
      showCaptchaOnSignup,
      merchantInviteInfo,
      salesforceLeadInfo,
      bdSignupCodeInfo,
    },
  } = initialData;

  const [paypalMerchantId, setPaypalMerchantId] = useState<
    string | undefined | null
  >(undefined);
  const [formContext, setFormContext] = useState({});
  const [partnerApp, setPartnerApp] = useState<ReferralDetails | null>(null);

  const {
    routeStore,
    toastStore,
    promotionStore: { nonErpReferral, discountedRevShare },
  } = useStore();
  const {
    referral_id: referralId,
    referrer,
    code,
    utm_source: utmSource,
  } = routeStore.queryParams;

  const showCaptcha = showCaptchaOnSignup ?? true;

  const isPaypalReferral = referrer && referrer === "paypal";
  const isShopify = utmSource === "Shopify";
  const isPreorder = utmSource === "preorder_email";

  useEffect(() => {
    document.title = i`Sign up for Wish for Merchants`;
  }, []);

  // Initial Load for Referred Sign Up
  useEffect(() => {
    if (referralId) {
      const fetchData = async () => {
        const referralAppResponse = await getReferralApp({
          referral_id: referralId,
        }).call();
        const resp = referralAppResponse?.data;
        if (resp) {
          setPartnerApp({
            name: resp.partner_app.name,
            logoSource: resp.partner_app.logo_source,
            promoProgram: new ERPPromoProgramV2(resp),
          });
        }
      };
      fetchData();
    }
  }, [referralId]);

  // Initial Load for Paypal Sign Up
  useEffect(() => {
    if (isPaypalReferral) {
      const paypalToastError = () => {
        toastStore.negative(
          i`We encountered a problem authorizing your account with Paypal. ` +
            i`You may continue opening your store, but you will not be eligible ` +
            i`for the ${discountedRevShare}% revenue share promotion.`
        );
      };

      const payerIdAlreadyUsedToastError = () => {
        toastStore.negative(
          i`It looks like you already have a Wish for Merchants account associated` +
            i` with your PayPal account. You may continue opening your store, but you` +
            i` will not be eligible for the ${discountedRevShare}% revenue share promotion.`
        );
      };

      const fetchData = async () => {
        try {
          const response = await onboardingApi
            .getPaypalMerchantDetails({
              paypal_code: code,
            })
            .call();

          const paypalMerchant = response?.data?.paypal_merchant;
          const payerIdAlreadyUsed = response?.data?.payer_id_already_used;
          const paypalAccountUntrusted = response?.data?.untrusted_account;
          if (payerIdAlreadyUsed) {
            payerIdAlreadyUsedToastError();
            setPartnerApp(null);
          } else if (paypalAccountUntrusted) {
            new ConfirmationModal(
              i`Your paypal account is not eligible to register in Wish for Merchants.` +
                i` We will redirect you to our home page. `
            )
              .setHeader({
                title: i`Oops...`,
              })
              .setAction(i`OK`, async () => {
                const navigationStore = NavigationStore.instance();
                navigationStore.navigate(`/`);
              })
              .render();
          } else if (paypalMerchant) {
            const {
              business_name: storeName,
              email,
              access_token: accessToken,
              id: paypalId,
            } = paypalMerchant;
            if (accessToken && referrer in nonErpReferral) {
              setFormContext({
                storeName,
                email,
              });
              setPaypalMerchantId(paypalId);
              setPartnerApp(nonErpReferral[referrer]);
            } else {
              paypalToastError();
              setPartnerApp(null);
            }
          }
        } catch (e) {
          paypalToastError();
          setPartnerApp(null);
        }
      };
      fetchData();
    }
  }, [
    referrer,
    code,
    isPaypalReferral,
    toastStore,
    discountedRevShare,
    nonErpReferral,
  ]);

  const bdSignupCode = routeStore.queryParams.r;
  const salesforceLeadId = routeStore.queryParams.l;
  const { currentPath } = routeStore;
  const isExpressFlow = currentPath == "/open-express";
  const useMerchantPlus = currentPath == "/open-plus";

  return (
    <ThemeWrapper overrideThemeAs={useMerchantPlus ? "PLUS" : undefined}>
      <div className={css(styles.root)}>
        <LandingNavigation
          className={css(styles.navigation)}
          showSignupButton={false}
        />
        {(referralId && partnerApp === undefined) ||
        (isPaypalReferral && partnerApp === undefined) ? (
          <LoadingIndicator className={css(styles.loading)} />
        ) : (
          <SignupBasicInfo
            className={css(styles.content)}
            showCaptcha={showCaptcha}
            bdSignupCode={bdSignupCode}
            salesforceLeadId={salesforceLeadId}
            referralId={referralId}
            partnerApp={partnerApp}
            isExpressFlow={isExpressFlow}
            isMerchantPlusFlow={useMerchantPlus}
            formContext={formContext}
            paypalMerchantId={paypalMerchantId}
            showTOS={isShopify || isPreorder}
            inviteDetails={merchantInviteInfo}
            salesforceLeadInfo={salesforceLeadInfo}
            bdSignupCodeInfo={bdSignupCodeInfo}
          />
        )}

        {useMerchantPlus && (
          <div className={css(styles.footerContainer)}>
            <SiteFooter showCopyright />
          </div>
        )}
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
        loading: {
          marginTop: "40vh",
        },
      }),
    [pageBackground]
  );
};

export default observer(SignupV4Container);
