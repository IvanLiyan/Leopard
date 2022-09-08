//
//  toolkit/util/util.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable local-rules/use-fragment */
/* eslint-disable filenames/match-regex */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { Component, ComponentType } from "react";

import { Router, withRouter } from "react-router";

/* Merchant Components */
import ErrorBoundary from "@merchant/component/ErrorBoundary";
import RouteStore from "@merchant/stores/RouteStore";

const extendStaticAttributes = (from: any, to: any): ComponentType<any> => {
  to.demoProps = from.demoProps;
  to.demoRender = from.demoRender;
  to.propDoc = from.propDoc;
  to.discussion = from.discussion;
  return to;
};

// `WrappedComponent` is a component, should be PascalCase.
// eslint-disable-next-line @typescript-eslint/naming-convention
export const merchantpage_DEPRECATED: any = (
  WrappedComponent: ComponentType<any>
) => {
  return extendStaticAttributes(
    WrappedComponent,
    class extends Component<any> {
      root: HTMLElement | null | undefined;
      render() {
        const { history } = RouteStore.instance();
        const WrappedComponentWithRouter = withRouter(WrappedComponent);
        return (
          <ErrorBoundary>
            <Router history={history}>
              <div>
                <WrappedComponentWithRouter {...this.props} />
              </div>
            </Router>
          </ErrorBoundary>
        );
      }
    }
  );
};
