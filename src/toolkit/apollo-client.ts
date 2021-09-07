import { from, ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { RetryLink } from "@apollo/client/link/retry";

import { MD_URL } from "@toolkit/context/constants";

const link = from([
  new RetryLink(),
  new BatchHttpLink({
    uri: `${MD_URL}/api/graphql/batch`,
    credentials: "same-origin",
    batchMax: 50,
  }),
]);

const cache = new InMemoryCache();

const client = new ApolloClient({ link, cache });

export default client;
