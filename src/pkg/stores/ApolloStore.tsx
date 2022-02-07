//
//  stores/ApolloStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 5/7/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, {
  useState,
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import Cookies from "js-cookie";
import moment from "moment/moment";
import {
  ApolloClient,
  ApolloProvider as _ApolloProvider,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

import { isProd } from "@stores/EnvironmentStore";
import { ToastStoreRef } from "@stores/ToastStore";

const apolloClientFactory = (
  terminatingLink: ApolloLink,
): ApolloClient<NormalizedCacheObject> => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        // TODO [lliepert]: need to get this set
        "X-XSRFToken": Cookies.get("_xsrf"),
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path, extensions }) => {
        if (extensions) {
          switch (extensions.code) {
            case "REQUIRE_SECURE_LOGIN": {
              // TODO [lliepert]: replace with logic in navigationStore that
              // can handle calls from both server side (using req) or client
              // side (using router)
              const currentPath = window.location.pathname;
              const reloginUrl = `/relogin-secure?next=${encodeURI(
                currentPath,
              )}`;
              // TODO [lliepert]: remove this method of triggering toasts. This prevents
              // us from using SSR since ToastStore must exist (instantiated on the
              // client in _app.tsx)
              ToastStoreRef.current?.error(message);
              window.location.href = reloginUrl;
              break;
            }
            case "UNAUTHORIZED_MUTATION": {
              ToastStoreRef.current?.error(
                `Cannot perform this action on behalf of the merchant`,
              );
              break;
            }
          }
          return undefined;
        }

        if (!isProd) {
          const errorMessage = `[GraphQL]: Message: ${message}, Location: ${locations}, Path: ${path}`;
          // Want a console log here for debugging in development
          // eslint-disable-next-line no-console
          console.log(errorMessage);
          ToastStoreRef.current?.error(errorMessage, {
            timeoutMs: 30 * 1000,
          });
        } else {
          ToastStoreRef.current?.error(i`Something went wrong`);
        }
        return undefined;
      });
      return;
    }

    if (networkError) {
      if (!isProd) {
        const errorMessage = `[Network error]: ${networkError}`;
        // Want a console log here for debugging in development
        // eslint-disable-next-line no-console
        console.log(errorMessage);
        ToastStoreRef.current?.error(errorMessage, {
          timeoutMs: 30 * 1000,
        });
      } else {
        ToastStoreRef.current?.error(i`Unable to connect to Wish`);
      }
    }
  });

  const cache = new InMemoryCache();

  return new ApolloClient({
    link: authLink.concat(errorLink).concat(terminatingLink),
    cache,
  });
};

export const client = apolloClientFactory(
  new BatchHttpLink({
    uri: `/api/graphql/batch`,
    credentials: "same-origin",
    batchMax: 50,
  }),
);

export const nonBatchingClient = apolloClientFactory(
  new HttpLink({
    uri: `/api/graphql`,
    credentials: "same-origin",
  }),
);

export const fileUploadClient = apolloClientFactory(
  createUploadLink({
    uri: "/api/graphql",
    credentials: "same-origin",
  }),
);

type ApolloStore = {
  client: ApolloClient<Record<string, unknown>>;
  nonBatchingClient: ApolloClient<Record<string, unknown>>;
  fileUploadClient: ApolloClient<Record<string, unknown>>;
  adminUpdatesAllowed: boolean;
  allowAdminUpdates: () => void;
  blockAdminUpdates: () => void;
};

const ApolloContext = createContext<ApolloStore>({
  client,
  nonBatchingClient,
  fileUploadClient,
  adminUpdatesAllowed: false,
  allowAdminUpdates: () => {
    throw "Hit Default ApolloStore";
  },
  blockAdminUpdates: () => {
    throw "Hit Default ApolloStore";
  },
});

// combined with the later useImperativeHandle, this allows us to access the
// ApolloStore outside of React
const ApolloStoreRef = createRef<ApolloStore>();

export const ApolloProvider: React.FC = ({ children }) => {
  const [adminUpdatesAllowed, setAdminUpdatesAllowed] = useState(false);

  const expirationTime = Cookies.get(
    "admin_merchant_prod_gql_mutation_override",
  );
  if (expirationTime != null) {
    setAdminUpdatesAllowed(
      parseInt(expirationTime) > new Date().getTime() / 1000,
    );
  }

  const allowAdminUpdates = (): void => {
    const leaseMinutes = 10;
    const now = moment();
    const expirationTime = Math.round(
      moment(now.clone()).add(leaseMinutes, "minutes").toDate().getTime() /
        1000,
    );
    Cookies.set(
      "admin_merchant_prod_gql_mutation_override",
      expirationTime.toString(),
    );
    ToastStoreRef.current?.warning(
      // Text below is not for merchants, its for admins.
      // eslint-disable-next-line local-rules/unwrapped-i18n
      `CAUTION: You are able to make changes to the this account for the next **${leaseMinutes} minutes**`,
      {
        timeoutMs: 7000,
      },
    );
    setAdminUpdatesAllowed(true);
  };

  const blockAdminUpdates = (): void => {
    Cookies.remove("admin_merchant_prod_gql_mutation_override");
    setAdminUpdatesAllowed(false);
  };

  const apolloStore = {
    client,
    nonBatchingClient,
    fileUploadClient,
    adminUpdatesAllowed,
    allowAdminUpdates,
    blockAdminUpdates,
  };
  useImperativeHandle(ApolloStoreRef, () => apolloStore);

  return (
    <ApolloContext.Provider value={apolloStore}>
      <_ApolloProvider client={client}>{children}</_ApolloProvider>
    </ApolloContext.Provider>
  );
};

export const useApolloStore = (): ApolloStore => {
  const apolloStore = useContext(ApolloContext);
  return apolloStore;
};

const LegacyApolloStoreAdapter = {
  instance: (): ApolloStore => {
    const ref = ApolloStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated ApolloStore";
    }
    return ref;
  },
};

export default LegacyApolloStoreAdapter;
