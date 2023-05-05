import { createContext } from "react";
import { ApolloQueryResult } from "@apollo/client";
import { EprQueryResponse } from "@product-compliance-center/api/eprQuery";

export const RefetchEprQueryContext = createContext<
  () => Promise<ApolloQueryResult<EprQueryResponse> | void>
>(async () => Promise.resolve());
