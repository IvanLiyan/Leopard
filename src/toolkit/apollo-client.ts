import {
  from,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { RetryLink } from "@apollo/client/link/retry";

import { MD_URL } from "@toolkit/context/constants";

export const createClient = (
  xsrfToken: string,
): ApolloClient<NormalizedCacheObject> => {
  const authLink = setContext((_, { headers }) => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      headers: {
        ...headers,
        authorization: process.env.STAGING_AUTH_HEADER || "",
        "x-xsrftoken": xsrfToken,
        cookie: `_xsrf=${xsrfToken}`,
      },
    };
  });

  const link = authLink.concat(
    from([
      new RetryLink(),
      new BatchHttpLink({
        uri: `${MD_URL}/api/graphql/batch`,
        batchMax: 50,
      }),
    ]),
  );

  const cache = new InMemoryCache();

  const client = new ApolloClient({
    ssrMode: true, // we currently only use gql during ssr; if client queries are desired, further setup is required
    link,
    cache,
  });

  return client;
};
