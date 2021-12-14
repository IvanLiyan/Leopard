import "../styles/global.css";

import NoSSR from "react-no-ssr";
import { AppProps } from "next/app";
import UserStore, {
  UserStoreContext,
  USER_STORE_INITIAL_QUERY,
  UserStoreInitialQueryResponse,
  defaultUserStoreArgs,
} from "@stores/UserStore";
import { NavigationProvider } from "@stores/NavigationStore";
import PersistenceStore, {
  PersistenceStoreContext,
} from "@stores/PersistenceStore";
import { ToastProvider } from "@stores/ToastStore";
import DeviceStore, { DeviceStoreContext } from "@stores/DeviceStore";
import LocalizationStore, {
  LocalizationStoreContext,
  LOCALIZATION_STORE_INITIAL_QUERY,
  LocalizationStoreInitialQueryResponse,
  defaultLocalizationStoreArgs,
} from "@stores/LocalizationStore";
import { ApolloProvider } from "@stores/ApolloStore";
import ThemeStore, {
  ThemeStoreContext,
  ThemeWrapper,
} from "@stores/ThemeStore";

function MerchantDashboard({ Component, pageProps }: AppProps): JSX.Element {
  // TODO [lliepert]: temp commenting out while gql isn't working
  // const { data: userStoreInitialData } =
  //   useQuery<UserStoreInitialQueryResponse>(USER_STORE_INITIAL_QUERY);
  // const { data: localizationStoreInitialData } =
  //   useQuery<LocalizationStoreInitialQueryResponse>(
  //     LOCALIZATION_STORE_INITIAL_QUERY,
  //   );

  // if (
  //   userStoreInitialData == null ||
  //   localizationStoreInitialData == null ||
  // ) {
  //   return <div>error</div>;
  // }

  const userStoreInitialData = defaultUserStoreArgs;
  const localizationStoreInitialData = defaultLocalizationStoreArgs;

  if (typeof window !== "undefined") {
    const userStore = new UserStore(userStoreInitialData);
    const persistenceStore = new PersistenceStore({ userStore });
    const deviceStore = new DeviceStore();
    const localizationStore = new LocalizationStore(
      localizationStoreInitialData,
    );
    const themeStore = new ThemeStore({ userStore });

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

      <NoSSR onSSR={<div>loading...</div>}>
        <ToastProvider>
          <UserStoreContext.Provider value={userStore}>
            <NavigationProvider>
              <PersistenceStoreContext.Provider value={persistenceStore}>
                <DeviceStoreContext.Provider value={deviceStore}>
                  <LocalizationStoreContext.Provider value={localizationStore}>
                    <ApolloProvider>
                      <ThemeStoreContext.Provider value={themeStore}>
                        <ThemeWrapper>
                          <Component {...pageProps} />
                        </ThemeWrapper>
                      </ThemeStoreContext.Provider>
                    </ApolloProvider>
                  </LocalizationStoreContext.Provider>
                </DeviceStoreContext.Provider>
              </PersistenceStoreContext.Provider>
            </NavigationProvider>
          </UserStoreContext.Provider>
        </ToastProvider>
      </NoSSR>
    );
  }

  return <div>loading...</div>;
}

export default MerchantDashboard;
