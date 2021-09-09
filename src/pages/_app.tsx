import "../styles/global.css"; // eslint-disable-line local-rules/no-relative-import

import App, { AppProps, AppContext } from "next/app";
import parser from "accept-language-parser";
import { RiptideProvider } from "@riptide/toolkit/provider";
import { LocalizationProvider } from "@toolkit/context/localization";

function MyApp({
  Component,
  locale,
  pageProps,
}: AppProps & { locale: string | undefined }): JSX.Element {
  return (
    <LocalizationProvider locale={locale}>
      <RiptideProvider>
        <Component {...pageProps} />
      </RiptideProvider>
    </LocalizationProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const acceptLanguageHeader = appContext.ctx.req?.headers["accept-language"];
  const locale = acceptLanguageHeader
    ? parser.parse(acceptLanguageHeader)[0].code
    : undefined;

  const appProps = await App.getInitialProps(appContext);

  return { locale, ...appProps };
};

export default MyApp;
