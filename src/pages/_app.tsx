import "../styles/global.css";

import NoSSR from "react-no-ssr";
import { AppProps } from "next/app";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import EnvironmentStore, {
  EnvironmentStoreContext,
} from "@stores/EnvironmentStore";
import UserStore, {
  UserStoreContext,
  USER_STORE_INITIAL_QUERY,
  UserStoreInitialQueryResponse,
  defaultUserStoreArgs,
} from "@stores/UserStore";
import NavigationStore, {
  NavigationStoreContext,
} from "@stores/NavigationStore";
import PersistenceStore, {
  PersistenceStoreContext,
} from "@stores/PersistenceStore";
import ToastStore, {
  ToastStoreContext,
  TOAST_STORE_INITIAL_QUERY,
  ToastStoreInitialQueryResponse,
  defaultToastStoreArgs,
} from "@stores/ToastStore";
import DeviceStore, { DeviceStoreContext } from "@stores/DeviceStore";
import LocalizationStore, {
  LocalizationStoreContext,
  LOCALIZATION_STORE_INITIAL_QUERY,
  LocalizationStoreInitialQueryResponse,
  defaultLocalizationStoreArgs,
} from "@stores/LocalizationStore";
import ApolloStore, { ApolloStoreContext } from "@stores/ApolloStore";
import ExperimentStore, {
  ExperimentStoreContext,
  EXPERIMENT_STORE_INITIAL_QUERY,
  ExperimentStoreInitialQueryResponse,
  defaultExperimentStoreArgs,
} from "@stores/ExperimentStore";
import ThemeStore, {
  ThemeStoreContext,
  ThemeWrapper,
} from "@stores/ThemeStore";

function MerchantDashboard({ Component, pageProps }: AppProps): JSX.Element {
  // TODO [lliepert]: temp commenting out while gql isn't working
  // const { data: userStoreInitialData } =
  //   useQuery<UserStoreInitialQueryResponse>(USER_STORE_INITIAL_QUERY);
  // const { data: toastStoreInitialData } =
  //   useQuery<ToastStoreInitialQueryResponse>(TOAST_STORE_INITIAL_QUERY);
  // const { data: localizationStoreInitialData } =
  //   useQuery<LocalizationStoreInitialQueryResponse>(
  //     LOCALIZATION_STORE_INITIAL_QUERY,
  //   );
  // const { data: experimentStoreInitialData } =
  //   useQuery<ExperimentStoreInitialQueryResponse>(
  //     EXPERIMENT_STORE_INITIAL_QUERY,
  //   );

  // if (
  //   userStoreInitialData == null ||
  //   toastStoreInitialData == null ||
  //   localizationStoreInitialData == null ||
  //   experimentStoreInitialData == null
  // ) {
  //   return <div>error</div>;
  // }

  const userStoreInitialData = defaultUserStoreArgs;
  const toastStoreInitialData = defaultToastStoreArgs;
  const localizationStoreInitialData = defaultLocalizationStoreArgs;
  const experimentStoreInitialData = defaultExperimentStoreArgs;

  if (typeof window !== "undefined") {
    const environmentStore = new EnvironmentStore({ env: "stage" });
    const userStore = new UserStore(userStoreInitialData);
    const navigationStore = new NavigationStore();
    const persistenceStore = new PersistenceStore({ userStore });
    const toastStore = new ToastStore({
      // persistenceStore,
      ...toastStoreInitialData,
    });
    const deviceStore = new DeviceStore();
    const localizationStore = new LocalizationStore(
      localizationStoreInitialData,
    );
    const apolloStore = new ApolloStore({ toastStore, environmentStore });
    const experimentStore = new ExperimentStore({
      // apolloStore,
      // userStore,
      // navigationStore,
      // environmentStore,
      ...experimentStoreInitialData,
    });
    const themeStore = new ThemeStore({ userStore, environmentStore });

    return (
      <NoSSR onSSR={<div>loading...</div>}>
        <EnvironmentStoreContext.Provider value={environmentStore}>
          <UserStoreContext.Provider value={userStore}>
            <NavigationStoreContext.Provider value={navigationStore}>
              <PersistenceStoreContext.Provider value={persistenceStore}>
                <ToastStoreContext.Provider value={toastStore}>
                  <DeviceStoreContext.Provider value={deviceStore}>
                    <LocalizationStoreContext.Provider
                      value={localizationStore}
                    >
                      <ApolloStoreContext.Provider value={apolloStore}>
                        <ApolloProvider client={apolloStore.client}>
                          <ExperimentStoreContext.Provider
                            value={experimentStore}
                          >
                            <ThemeStoreContext.Provider value={themeStore}>
                              <ThemeWrapper>
                                <Component {...pageProps} />
                              </ThemeWrapper>
                            </ThemeStoreContext.Provider>
                          </ExperimentStoreContext.Provider>
                        </ApolloProvider>
                      </ApolloStoreContext.Provider>
                    </LocalizationStoreContext.Provider>
                  </DeviceStoreContext.Provider>
                </ToastStoreContext.Provider>
              </PersistenceStoreContext.Provider>
            </NavigationStoreContext.Provider>
          </UserStoreContext.Provider>
        </EnvironmentStoreContext.Provider>
      </NoSSR>
    );
  }

  return <div>loading...</div>;
}

export default MerchantDashboard;
