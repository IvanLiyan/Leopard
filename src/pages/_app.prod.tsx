import "../styles/global.css";

import { AppProps } from "next/app";
import Head from "next/head";
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

  // if a page is in this array, any queries made for setting up stores that
  // require a logged in user (e.g. navigation graph) will be skipped
  const publicSubpaths = ["/welcome-mms"];
  const isPublic = publicSubpaths.some((element) => {
    return router.asPath.includes(element);
  });

  if (foundIndependentSubpath) return <Component {...pageProps} />;

  return (
    <MerchantDashboardProvider isPublic={isPublic}>
      <Component {...pageProps} />
    </MerchantDashboardProvider>
  );
};

const App = (props: AppProps): JSX.Element => {
  return (
    <div suppressHydrationWarning>
      <Head>
        <title>Wish for Merchants</title>
      </Head>
      {typeof window === "undefined" ? null : <MerchantDashboard {...props} />}
    </div>
  );
};
export default App;
