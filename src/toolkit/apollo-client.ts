import { ApolloClient, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

const link = new BatchHttpLink({
  uri: `${process.env.NEXT_PUBLIC_MD_URL || ""}/api/graphql/batch`,
  credentials: "same-origin",
  batchMax: 50,
});

const cache = new InMemoryCache();

const client = new ApolloClient({ link, cache });

export default client;
