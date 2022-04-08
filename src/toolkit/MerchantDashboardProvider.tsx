import { useQuery } from "@apollo/client";
import {
  UserStoreProvider,
  USER_STORE_INITIAL_QUERY,
  UserStoreInitialQueryResponse,
} from "@stores/UserStore";
import { NavigationProvider } from "@stores/NavigationStore";
import { PersistenceStoreProvider } from "@stores/PersistenceStore";
import { ToastProvider } from "@stores/ToastStore";
import { DeviceStoreProvider } from "@stores/DeviceStore";
import {
  LocalizationStoreProvider,
  LOCALIZATION_STORE_INITIAL_QUERY,
  LocalizationStoreInitialQueryResponse,
} from "@stores/LocalizationStore";
import { ApolloProvider, client } from "@stores/ApolloStore";
import { ThemeStoreProvider } from "@stores/ThemeStore";
import {
  ChromeProvider,
  CHROME_STORE_INITIAL_QUERY,
  ChromeStoreInitialQueryResponse,
} from "@stores/ChromeStore";
import { env } from "@stores/EnvironmentStore";
import { datadogRum } from "@datadog/browser-rum";

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
});

const MerchantDashboardProvider: React.FC = ({ children }) => {
  // blocking SSR until we can properly test that path (mostly GQL queries and
  // stores)
  const ssr = typeof window === "undefined";
  if (ssr) {
    <div>ssr mode, please wait...</div>;
  }

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
  });
  const {
    data: localizationStoreInitialData,
    loading: localizationStoreLoading,
    error: localizationStoreError,
  } = useQuery<LocalizationStoreInitialQueryResponse>(
    LOCALIZATION_STORE_INITIAL_QUERY,
    { client },
  );
  const {
    data: chromeStoreInitialData,
    loading: chromeStoreLoading,
    error: chromeStoreError,
  } = useQuery<ChromeStoreInitialQueryResponse>(CHROME_STORE_INITIAL_QUERY, {
    client,
  });

  // simplify, currently for testing purposes
  if (userStoreLoading || localizationStoreLoading || chromeStoreLoading) {
    return <div>loading...</div>;
  }

  if (userStoreInitialData == null || userStoreError) {
    /* eslint-disable no-console */
    console.log("userStoreInitialData", userStoreInitialData);
    console.log("userStoreError", userStoreError);
    /* eslint-enable no-console */
    return <div>error loading userStore (see console for details)</div>;
  }

  if (localizationStoreInitialData == null || localizationStoreError) {
    /* eslint-disable no-console */
    console.log("localizationStoreInitialData", localizationStoreInitialData);
    console.log("localizationStoreError", localizationStoreError);
    /* eslint-enable no-console */
    return <div>error loading localizationStore (see console for details)</div>;
  }

  if (chromeStoreInitialData == null || chromeStoreError) {
    /* eslint-disable no-console */
    console.log("chromeStoreInitialData", chromeStoreInitialData);
    console.log("chromeStoreError", chromeStoreError);
    /* eslint-enable no-console */
    return <div>error loading chromeStore (see console for details)</div>;
  }

  // TODO [lliepert]: clean up userStore file now that we aren't using it here

  return (
    // TODO [lliepert]: this is used to set the title. move to <Head /> in _app.tsx
    // reaction(
    //   () => this.pageSearchResult,
    //   (pageSearchResult) => {
    //     const { isPlusUser, loggedInMerchantUser, isStoreUser } =
    //       UserStore.instance();
    //     const productName = isStoreUser ? i`Wish Local` : i`Wish for Merchants`;
    //     const appName = isPlusUser
    //       ? loggedInMerchantUser.display_name
    //       : productName;
    //     if (pageSearchResult == null) {
    //       document.title = appName;
    //       return;
    //     }

    //     const { title } = pageSearchResult;
    //     document.title = `${title} | ${appName}`;
    //   },
    //   { fireImmediately: true },
    // );

    <NavigationProvider>
      <UserStoreProvider initialData={userStoreInitialData}>
        <ApolloProvider>
          <ToastProvider>
            <PersistenceStoreProvider
              userId={userStoreInitialData.currentUser?.id || "none"}
            >
              <DeviceStoreProvider>
                <LocalizationStoreProvider
                  initialData={localizationStoreInitialData}
                >
                  <ThemeStoreProvider>
                    <ChromeProvider initialData={chromeStoreInitialData}>
                      {children}
                    </ChromeProvider>
                  </ThemeStoreProvider>
                </LocalizationStoreProvider>
              </DeviceStoreProvider>
            </PersistenceStoreProvider>
          </ToastProvider>
        </ApolloProvider>
      </UserStoreProvider>
    </NavigationProvider>
  );
};

export default MerchantDashboardProvider;
