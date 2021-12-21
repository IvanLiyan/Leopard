import "../styles/global.css";

import { useState, useEffect } from "react";
import { AppProps } from "next/app";
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

function MerchantDashboard({ Component, pageProps }: AppProps): JSX.Element {
  // blocking SSR until we can properly test that path (mostly GQL queries and
  // stores)
  if (typeof window === "undefined") {
    <div>ssr mode, please wait...</div>;
  }

  // following forceLoading code is to force a render of the app with the stores
  // instantiated so the refs used to mock out the .instance behavior are
  // populated. without this logic any code that calls `.instance()` before a
  // render happens will throw a "Attempting to access reference to
  // un-instantiated *Store" error.  this logic will be revisited in the future
  const [forceLoading, setForceLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setForceLoading(false);
    }, 1000);
  });

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

  // simplify, currently for testing purposes
  if (userStoreLoading && localizationStoreLoading) {
    return <div>loading...</div>;
  }
  if (userStoreLoading && !localizationStoreLoading) {
    return <div>userStore loading...</div>;
  }
  if (!userStoreLoading && localizationStoreLoading) {
    return <div>localizationStore loading...</div>;
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

    <UserStoreProvider initialData={userStoreInitialData}>
      <ApolloProvider>
        <ToastProvider>
          <NavigationProvider>
            <PersistenceStoreProvider
              userId={userStoreInitialData.currentUser?.id || "none"}
            >
              <DeviceStoreProvider>
                <LocalizationStoreProvider
                  initialData={localizationStoreInitialData}
                >
                  <ThemeStoreProvider>
                    {forceLoading ? (
                      <div>loading forced</div>
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </ThemeStoreProvider>
                </LocalizationStoreProvider>
              </DeviceStoreProvider>
            </PersistenceStoreProvider>
          </NavigationProvider>
        </ToastProvider>
      </ApolloProvider>
    </UserStoreProvider>
  );
}

export default MerchantDashboard;
