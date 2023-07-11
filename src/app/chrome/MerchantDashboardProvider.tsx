import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import {
  UserStoreProvider,
  USER_STORE_INITIAL_QUERY,
  UserStoreInitialQueryResponse,
} from "@core/stores/UserStore";
import { NavigationProvider } from "@core/stores/NavigationStore";
import { PersistenceStoreProvider } from "@core/stores/PersistenceStore";
import { ToastProvider } from "@core/stores/ToastStore";
import { DeviceStoreProvider } from "@core/stores/DeviceStore";
import {
  LocalizationStoreProvider,
  LOCALIZATION_STORE_INITIAL_QUERY,
  LocalizationStoreInitialQueryResponse,
} from "@core/stores/LocalizationStore";
import { ApolloProvider, client } from "@core/stores/ApolloStore";
import { ThemeStoreProvider } from "@core/stores/ThemeStore";
import {
  ChromeProvider,
  CHROME_STORE_INITIAL_QUERY,
  ChromeStoreInitialQueryResponse,
} from "@core/stores/ChromeStore";
import { LoadingIndicator } from "@ContextLogic/lego";
import { env } from "@core/stores/EnvironmentStore";
import { datadogRum } from "@datadog/browser-rum";
import FullPageError from "@core/components/FullPageError";
import SalesforceWidget, {
  MerchantSupportConfigQuery,
  MerchantSupportConfigQueryResponse,
} from "@chrome/components/SalesforceWidget";
import {
  AtlasThemeProvider,
  AtlasMuiThemeOptions,
} from "@ContextLogic/atlas-ui";
import { useRouter } from "next/router";
import { StepperTheme } from "@core/components/Stepper/Stepper";
import { StepLabelTheme } from "@core/components/Stepper/StepLabel";
import { useDeciderKey } from "@core/stores/ExperimentStore";

datadogRum.init({
  applicationId: "901bc1fd-28d9-4542-88ca-f109e88b2a43",
  clientToken: "pube9541dcd2f9d452ec72945ca9d34a0f5",
  site: "datadoghq.com",
  service: "merchant-web-leopard",
  // Specify a version number to identify the deployed version of your application in Datadog
  version: process.env.BUILD_ID || "local",
  env: env,
  sampleRate: 100,
  replaySampleRate: 25,
  trackInteractions: true,
  actionNameAttribute: "data-cy",
});

type MerchantDashboardProviderProps = {
  readonly isPublic?: boolean;
};

const LeopardThemeOptions = {
  components: {
    MuiStepLabel: StepLabelTheme,
    MuiStepper: StepperTheme,
  },
  typography: {
    caption: {
      fontSize: "14px",
    }, // avoid undefined fontSize error when rendering StepLabel
  },
} as typeof AtlasMuiThemeOptions;

const MerchantDashboardProvider: React.FC<MerchantDashboardProviderProps> = ({
  children,
  isPublic = false,
}) => {
  const [xsrfCheckLoading, setXsrfCheckLoading] = useState(true);
  const [xsrfCheckError, setXsrfCheckError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const effect = async () => {
      try {
        // below code checks to see if we have an XSRF token from merch-fe yet;
        // if we don't, all GQL queries will fail.
        const xsrf = Cookies.get("_xsrf");
        if (xsrf == undefined) {
          // we don't have one - make a trivial GET call to merch-fe to set the
          // cookie. hacky method :(, wastes a round trip to merch-fe, but
          // should only be required on the first load of the site ever (or
          // if cookies are cleared)
          await fetch("/", { redirect: "manual" });
        }
      } catch {
        setXsrfCheckError(true);
      } finally {
        setXsrfCheckLoading(false);
      }
    };

    void effect();
  }, []);

  // NOTE: we perform the queries here instead of in the providers so we don't
  // have to wait for the previous query to finish and children are rendered
  // to kick of the next provider / query, but instead can perform them all
  // in parallel
  const {
    data: userStoreInitialData,
    loading: userStoreLoading,
    error: userStoreError,
  } = useQuery<UserStoreInitialQueryResponse>(USER_STORE_INITIAL_QUERY, {
    client,
    skip: xsrfCheckLoading,
    errorPolicy: isPublic ? "ignore" : undefined,
  });
  const {
    data: localizationStoreInitialData,
    loading: localizationStoreLoading,
    error: localizationStoreError,
  } = useQuery<LocalizationStoreInitialQueryResponse>(
    LOCALIZATION_STORE_INITIAL_QUERY,
    {
      client,
      skip: xsrfCheckLoading,
    },
  );
  const {
    data: chromeStoreInitialData,
    loading: chromeStoreLoading,
    error: chromeStoreError,
  } = useQuery<ChromeStoreInitialQueryResponse>(CHROME_STORE_INITIAL_QUERY, {
    client,
    skip: isPublic || xsrfCheckLoading,
  });

  // Customer support widget API calls
  const { decision: showWidget, isLoading: showWidgetLoading } = useDeciderKey(
    "md_salesforce_widget",
    { skip: isPublic || xsrfCheckLoading },
  );
  const { decision: showWidgetCN, isLoading: showWidgetCNLoading } =
    useDeciderKey("md_salesforce_widget_cn", {
      skip: isPublic || xsrfCheckLoading,
    });
  const { decision: forceCnMailTo, isLoading: forceCnMailToLoading } =
    useDeciderKey("md_zendesk_widget_cn_hide", {
      skip: isPublic || xsrfCheckLoading,
    });

  const {
    data: merchantSupportConfigInitialData,
    loading: merchantSupportConfigLoading,
  } = useQuery<MerchantSupportConfigQueryResponse, never>(
    MerchantSupportConfigQuery,
    {
      client,
      skip: isPublic || xsrfCheckLoading,
    },
  );
  const widgetQueriesLoading =
    showWidgetLoading ||
    showWidgetCNLoading ||
    forceCnMailToLoading ||
    merchantSupportConfigLoading;

  if (
    xsrfCheckLoading ||
    userStoreLoading ||
    localizationStoreLoading ||
    chromeStoreLoading ||
    widgetQueriesLoading
  ) {
    return (
      <LoadingIndicator
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
        }}
      />
    );
  }

  if (
    (!isPublic && (userStoreInitialData == null || userStoreError)) ||
    localizationStoreError ||
    (!isPublic && (chromeStoreInitialData == null || chromeStoreError)) ||
    xsrfCheckError
  ) {
    const isLoggedOutError =
      userStoreInitialData == null &&
      userStoreError?.message.includes("HTTP 403");

    if (!isPublic && isLoggedOutError) {
      const currentPath = router.pathname;
      if (currentPath != null && currentPath.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`/login?next=${encodeURIComponent(`/md${currentPath}`)}`);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`/login`);
      }
      return null;
    }
    return <FullPageError error="500" />;
  }

  // TODO [lliepert]: clean up userStore file now that we aren't using it here

  return (
    <AtlasThemeProvider themeOptions={LeopardThemeOptions}>
      <NavigationProvider>
        <UserStoreProvider initialData={userStoreInitialData}>
          <ApolloProvider>
            <ToastProvider>
              <PersistenceStoreProvider
                userId={userStoreInitialData?.currentUser?.id ?? "none"}
              >
                <DeviceStoreProvider>
                  <LocalizationStoreProvider
                    initialData={localizationStoreInitialData}
                  >
                    <SalesforceWidget
                      showWidget={showWidget}
                      showWidgetCN={showWidgetCN}
                      forceCnMailTo={forceCnMailTo}
                      merchantSupportConfigInitialData={
                        merchantSupportConfigInitialData
                      }
                    >
                      <ThemeStoreProvider>
                        <ChromeProvider initialData={chromeStoreInitialData}>
                          {children}
                        </ChromeProvider>
                      </ThemeStoreProvider>
                    </SalesforceWidget>
                  </LocalizationStoreProvider>
                </DeviceStoreProvider>
              </PersistenceStoreProvider>
            </ToastProvider>
          </ApolloProvider>
        </UserStoreProvider>
      </NavigationProvider>
    </AtlasThemeProvider>
  );
};

export default MerchantDashboardProvider;
