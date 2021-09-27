/* eslint-disable local-rules/no-container-import */
/* eslint-disable local-rules/no-internal-import */
import React from "react";
import { observer } from "mobx-react";
import { Router } from "react-router";

/* External Libraries */
import { ApolloProvider } from "@apollo/react-hooks";

import LoadablePlusContainer from "@plus/container/LoadablePlusContainer";
import LoadableInternalContainer from "@internal/container/LoadableInternalContainer";
import LoadableMerchantContainer from "@merchant/container/LoadableMerchantContainer";

// This is the brandpartner entry point
// eslint-disable-next-line  local-rules/no-brandpartner-import
import LoadableBrandPartnerContainer from "@brandpartner/container/LoadableBrandPartnerContainer";

/* Type Imports */
import {
  useNavigationStore,
  BuildPackage,
} from "@merchant/stores/NavigationStore";
import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import ErrorBoundary from "@merchant/component/ErrorBoundary";
import { LoadableContainerProps } from "./loadable-utils";

const LoadableContainers: {
  [buildPackage in BuildPackage]: React.ComponentType<LoadableContainerProps>;
} = {
  plus: LoadablePlusContainer,
  internal: LoadableInternalContainer,
  merchant: LoadableMerchantContainer,
  shopifyapp: () => null,
  brandpartner: LoadableBrandPartnerContainer, // not used as we gate at app.tsx
};

export const NavigationDrivenContainer = observer(() => {
  const { client } = useApolloStore();
  const { currentContainer, refreshTick } = useNavigationStore();
  const { history } = useRouteStore();

  if (currentContainer == null) {
    return null;
  }
  const { name, buildPackage, initialData } = currentContainer;
  const { [buildPackage]: LoadableContainer } = LoadableContainers;

  return (
    <Router history={history}>
      <ErrorBoundary>
        <ApolloProvider client={client}>
          <LoadableContainer
            key={refreshTick}
            container={name}
            initialData={initialData}
          />
        </ApolloProvider>
      </ErrorBoundary>
    </Router>
  );
});
