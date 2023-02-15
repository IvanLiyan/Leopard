import { gql, useQuery } from "@apollo/client";
import Config from "@chrome/salesforce";
import { Text } from "@ContextLogic/lego";
import Link from "@core/components/Link";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import { UserSchema } from "@schema";
import { StyleSheet } from "aphrodite";
import Script from "next/script";
import { useMemo } from "react";

declare global {
  interface Window {
    // Disabling because Salesforce doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    embedded_svc: any;
  }
}

const SalesforceWidget: React.FC<{ isPublic: boolean }> = ({
  children,
  isPublic,
}) => {
  const styles = useStylesheet();

  const { localeProper } = useLocalizationStore();
  const { decision: showWidget, isLoading: showWidgetLoading } = useDeciderKey(
    "md_salesforce_widget",
  );
  const { decision: showWidgetCN, isLoading: showWidgetCNLoading } =
    useDeciderKey("md_salesforce_widget_cn");

  const { data, loading: loggedInUserLoading } = useQuery<
    MerchantSupportConfigQueryResponse,
    never
  >(MerchantSupportConfigQuery, {
    skip: isPublic,
  });
  const loggedInUser = data?.currentUser;

  if (
    loggedInUserLoading ||
    !loggedInUser ||
    showWidgetLoading ||
    showWidgetCNLoading
  ) {
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
    return <>{children}</>;
  }

  if (loggedInUser?.supportConfig?.isNonEnBd) {
    if (showWidgetCN) {
      return chatScript(Config.salesforceCN);
    }
    return <>{children}</>;
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

const MerchantSupportConfigQuery = gql`
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

type MerchantSupportConfigQueryResponse = {
  readonly currentUser?:
    | ({ readonly accountManager?: Pick<UserSchema, "email"> | null } & Pick<
        UserSchema,
        "supportConfig" | "displayName" | "email"
      >)
    | null;
};

export default SalesforceWidget;
