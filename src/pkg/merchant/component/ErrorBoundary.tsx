import React, { Component } from "react";
import { observer } from "mobx-react";

/* External Libraries */
import Raven from "raven-js";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

@observer
class ErrorBoundary extends Component<BaseProps> {
  componentDidCatch(error: any, errorInfo: any) {
    Raven.captureException(error, { extra: errorInfo });
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

export default ErrorBoundary;
