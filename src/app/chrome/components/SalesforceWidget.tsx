import { gql } from "@apollo/client";
import Config from "@chrome/salesforce";
import { Text } from "@ContextLogic/lego";
import Link from "@core/components/Link";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import { merchFeUrl } from "@core/toolkit/router";
import { UserSchema } from "@schema";
import { StyleSheet } from "aphrodite";
import Script from "next/script";
import { useMemo } from "react";

declare global {
  interface Window {
    // Disabling because Salesforce doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    embedded_svc: any;
    // Disabling because Zendesk doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zESettings: any;
    // Disabling because Zendesk doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zE: any;
  }
}
const CN_ZENDESK_PATH =
  "/zendesk-proxy/zendesk-widget-js?key=44aa0837-02db-42c8-acc2-d811f41218c8";

const SalesforceWidget: React.FC<{
  showWidget?: boolean | null;
  showWidgetCN?: boolean | null;
  merchantSupportConfigInitialData?: MerchantSupportConfigQueryResponse | null;
}> = ({
  children,
  showWidget,
  showWidgetCN,
  merchantSupportConfigInitialData,
}) => {
  const styles = useStylesheet();

  const { localeProper } = useLocalizationStore();

  const loggedInUser = merchantSupportConfigInitialData?.currentUser;

  if (!loggedInUser) {
    return <>{children}</>;
  }

  const chatScript = (
    config: typeof Config.salesforceCN | typeof Config.salesforceUS,
  ) => (
    <>
      <Script
        src="https://service.force.com/embeddedservice/5.0/esw.min.js"
        onLoad={() => {
          const initESW = function (gslbBaseURL: unknown) {
            window.embedded_svc.settings.displayHelpButton = true;
            window.embedded_svc.settings.language = localeProper;

            window.embedded_svc.settings.defaultMinimizedText = i`Chat with Us`;
            window.embedded_svc.settings.disabledMinimizedText = i`Agent Offline`;

            window.embedded_svc.settings.loadingText = i`Loading`;

            window.embedded_svc.settings.prepopulatedPrechatFields = {
              SuppliedName: loggedInUser.displayName,
              SuppliedEmail: loggedInUser.email,
            };
            window.embedded_svc.settings.offlineSupportMinimizedText = i`Contact Us`;

            window.embedded_svc.settings.enabledFeatures = ["LiveAgent"];
            window.embedded_svc.settings.entryFeature = "LiveAgent";

            window.embedded_svc.init(
              config.customSalesforceUrl,
              config.customWishUrl,
              gslbBaseURL,
              config.regionId,
              config.apiName,
              {
                baseLiveAgentContentURL: config.baseLiveAgentContentURL,
                deploymentId: config.deploymentId,
                buttonId: config.buttonId,
                baseLiveAgentURL: config.baseLiveAgentURL,
                eswLiveAgentDevName: config.eswBaseLiveAgentDevName,
                isOfflineSupportEnabled: true,
              },
            );
          };

          if (!window.embedded_svc) {
            const s = document.createElement("script");
            s.setAttribute(
              "src",
              `${config.customSalesforceUrl}/embeddedservice/5.0/esw.min.js`,
            );
            s.onload = function () {
              initESW(null);
            };
            document.body.appendChild(s);
          } else {
            initESW("https://service.force.com");
          }
        }}
      />
      {children}
    </>
  );

  // If merchant is in US or CN support group, show
  // Salesforce chat widget
  if (loggedInUser.supportConfig?.isEnBd) {
    if (showWidget) {
      return chatScript(Config.salesforceUS);
    }
    // Non-CN Zendesk is EOL, show nothing
    return <>{children}</>;
  }

  if (loggedInUser?.supportConfig?.isNonEnBd) {
    if (showWidgetCN) {
      return chatScript(Config.salesforceCN);
    }
    // CN Zendesk is still live, so show it
    return (
      <>
        <Script
          id="ze-snippet"
          src={merchFeUrl(CN_ZENDESK_PATH)}
          strategy="lazyOnload"
          onLoad={() => {
            // Legacy Zendesk config
            window.zE(function () {
              window.zE.setLocale(localeProper);
              window.zE.identify({
                name: loggedInUser.displayName,
                email: loggedInUser.email,
              });
            });
            window.zESettings = {
              webWidget: {
                color: {
                  theme: "#022786",
                  launcher: "#022786",
                  launcherText: "#FFFFFF",
                  header: "#DCE5E9",
                  button: "#305BEF",
                },
              },
            };
          }}
        />
        {children}
      </>
    );
  }

  // Otherwise, if merchant has a BD assigned specifically,
  // show a mailto: link
  if (loggedInUser.accountManager?.email) {
    return (
      <>
        <Link
          style={styles.fakeSupport}
          href={`mailto:${loggedInUser.accountManager.email}`}
          fadeOnHover={false}
        >
          <Text renderAsSpan style={styles.fakeQuestionMark}>{`?`}</Text>
          <Text weight="bold" renderAsSpan style={styles.fakeSupportText}>
            Support
          </Text>
        </Link>
        {children}
      </>
    );
  }

  // Otherwise, show nothing
  return <>{children}</>;
};

const useStylesheet = () => {
  const { textWhite, secondaryDarkest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        fakeSupport: {
          color: textWhite,
          width: 150,
          height: 50,
          position: "fixed",
          bottom: 10,
          right: 20,
          backgroundColor: secondaryDarkest,
          zIndex: 10000,
          borderRadius: "999rem",
          cursor: "pointer",
        },
        fakeQuestionMark: {
          marginLeft: 22,
          lineHeight: "3rem",
          borderRadius: "50%",
          border: `2px solid ${textWhite}`,
          paddingLeft: 6,
          paddingRight: 6,
          paddingTop: 1,
        },
        fakeSupportText: {
          marginLeft: 8,
        },
      }),
    [secondaryDarkest, textWhite],
  );
};

export const MerchantSupportConfigQuery = gql`
  query MerchantSupportConfigQuery {
    currentUser {
      displayName
      email
      supportConfig {
        isEnBd
        isNonEnBd
      }
      accountManager {
        email
      }
    }
  }
`;

export type MerchantSupportConfigQueryResponse = {
  readonly currentUser?:
    | ({ readonly accountManager?: Pick<UserSchema, "email"> | null } & Pick<
        UserSchema,
        "supportConfig" | "displayName" | "email"
      >)
    | null;
};

export default SalesforceWidget;
