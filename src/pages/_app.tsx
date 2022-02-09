import "../styles/global.css";

import { AppProps } from "next/app";
import MerchantDashboardProvider from "@next-toolkit/MerchantDashboardProvider";

function MerchantDashboard({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element {
  // /dev-login is a edge case that initializes cookies required for _app
  // skip _app in that case

  const independentSubpaths = ["/dev-login", "/hello-world", "/go"];
  const foundValidSubpath = independentSubpaths.some((element) =>
    router.pathname.includes(element),
  );

  if (foundValidSubpath) return <Component {...pageProps} />;

  return (
    <MerchantDashboardProvider>
      <Component {...pageProps} />
    </MerchantDashboardProvider>
  );
}

export default MerchantDashboard;
