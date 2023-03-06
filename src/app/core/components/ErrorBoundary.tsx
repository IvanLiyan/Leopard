/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
// based on https://beta.reactjs.org/reference/react/Component#catching-rendering-errors-with-an-error-boundary
import React from "react";
import { isDev } from "@core/stores/EnvironmentStore";

class ErrorBoundary extends React.Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: { componentStack: any }) {
    if (isDev) {
      // gated to only appear on dev
      // eslint-disable-next-line no-console
      console.log(error, info.componentStack);
    }
  }

  render() {
    // @ts-ignore copied from JS React code, will fix if we keep
    if (this.state.hasError) {
      // You can render any custom fallback UI
      // @ts-ignore copied from JS React code, will fix if we keep
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
