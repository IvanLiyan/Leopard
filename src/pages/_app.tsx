import "../styles/global.css"; // eslint-disable-line local-rules/no-relative-import

import type { AppProps } from "next/app";
import { RiptideProvider } from "@riptide/toolkit/provider";
import { LocalizationProvider } from "@toolkit/context/localization";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <LocalizationProvider>
      <RiptideProvider>
        <Component {...pageProps} />
      </RiptideProvider>
    </LocalizationProvider>
  );
}
export default MyApp;
