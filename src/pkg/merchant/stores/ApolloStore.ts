//
//  stores/ApolloStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 5/7/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import Cookies from "js-cookie";
import moment from "moment/moment";
import ApolloClient from "apollo-client";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { createHttpLink } from "apollo-link-http";
import { observable } from "mobx";

/* Relative Imports */
import ToastStore from "./ToastStore";
import EnvironmentStore from "./EnvironmentStore";

import { useNavigationStore } from "@merchant/stores/NavigationStore";

export default class ApolloStore {
  client: ApolloClient<object>;
  nonBatchingClient: ApolloClient<object>;

  // Used for requests involving uploading files during a request.
  fileUploadClient: ApolloClient<object>;

  // Used to query merchant graph from inside the embedded Shopify app.
  shopifyAppClient: ApolloClient<object>;

  @observable
  adminUpdatesAllowed = false;

  constructor() {
    this.nonBatchingClient = this.apolloClientFactory(
      createHttpLink({
        uri: "/api/graphql",
        credentials: "same-origin",
      })
    );

    this.client = this.apolloClientFactory(
      new BatchHttpLink({
        uri: "/api/graphql/batch",
        credentials: "same-origin",
        batchMax: 50,
      })
    );

    this.shopifyAppClient = this.apolloClientFactory(
      new BatchHttpLink({
        uri: "/api/shopify/graphql-internal-batch",
        credentials: "same-origin",
      })
    );

    // `any` used here because of the type definition mismatch between
    // `apollo-upload-client` and `apollo-client`.
    this.fileUploadClient = this.apolloClientFactory(
      createUploadLink({
        uri: "/api/graphql",
        credentials: "same-origin",
      }) as any
    );
    const expirationTime = Cookies.get(
      "admin_merchant_prod_gql_mutation_override"
    );
    if (expirationTime != null) {
      this.adminUpdatesAllowed =
        parseInt(expirationTime) > new Date().getTime() / 1000;
    }
  }

  private apolloClientFactory(terminatingLink: ApolloLink) {
    const { isProd } = EnvironmentStore.instance();
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          "X-XSRFToken": Cookies.get("_xsrf"),
        },
      };
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      const toastStore = ToastStore.instance();
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path, extensions }) => {
          if (extensions) {
            switch (extensions.code) {
              case "REQUIRE_SECURE_LOGIN": {
                const navigationStore = useNavigationStore();
                const currentPath = navigationStore.currentPath;
                const reloginUrl = `/relogin-secure?next=${encodeURI(
                  currentPath
                )}`;
                toastStore.error(message);
                navigationStore.navigate(reloginUrl);
                break;
              }
              case "UNAUTHORIZED_MUTATION": {
                toastStore.error(
                  `Cannot perform this action on behalf of the merchant`
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
            toastStore.error(errorMessage, {
              timeoutMs: 30 * 1000,
            });
          } else {
            toastStore.error(i`Something went wrong`);
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
          toastStore.error(errorMessage, {
            timeoutMs: 30 * 1000,
          });
        } else {
          toastStore.error(i`Unable to connect to Wish`);
        }
      }
    });

    const cache = new InMemoryCache();

    return new ApolloClient({
      // Reason: this is not array
      // eslint-disable-next-line local-rules/prefer-spread
      link: authLink.concat(errorLink).concat(terminatingLink),
      cache,
    });
  }

  static instance(): ApolloStore {
    let { apolloStore } = window as any;
    if (apolloStore == null) {
      apolloStore = new ApolloStore();
      (window as any).apolloStore = apolloStore;
    }
    return apolloStore;
  }

  allowAdminUpdates() {
    const toastStore = ToastStore.instance();

    const leaseMinutes = 10;
    const now = moment();
    const expirationTime = Math.round(
      moment(now.clone()).add(leaseMinutes, "minutes").toDate().getTime() / 1000
    );
    Cookies.set(
      "admin_merchant_prod_gql_mutation_override",
      expirationTime.toString()
    );
    toastStore.warning(
      // Text below is not for merchants, its for admins.
      // eslint-disable-next-line local-rules/unwrapped-i18n
      `CAUTION: You are able to make changes to the this account for the next **${leaseMinutes} minutes**`,
      {
        timeoutMs: 7000,
      }
    );
    this.adminUpdatesAllowed = true;
  }

  blockAdminUpdates() {
    Cookies.remove("admin_merchant_prod_gql_mutation_override");
    this.adminUpdatesAllowed = false;
  }
}

export const useApolloStore = (): ApolloStore => {
  return ApolloStore.instance();
};

export const useShopifyAppClient = (): ApolloClient<object> => {
  const { shopifyAppClient } = useApolloStore();
  return shopifyAppClient;
};
