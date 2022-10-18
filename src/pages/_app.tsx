import "../styles/global.css";

import { AppProps } from "next/app";
import MerchantDashboardProvider from "@chrome/MerchantDashboardProvider";

const MerchantDashboard = ({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element => {
  const independentSubpaths = ["/dev-login", "/hello-world", "/go"];
  const foundIndependentSubpath = independentSubpaths.some((element) =>
    router.pathname.includes(element),
  );

  if (foundIndependentSubpath) return <Component {...pageProps} />;

  return (
    <MerchantDashboardProvider>
      <Component {...pageProps} />
    </MerchantDashboardProvider>
  );
};

const App = (props: AppProps): JSX.Element => {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : <MerchantDashboard {...props} />}
    </div>
  );
};
export default App;
