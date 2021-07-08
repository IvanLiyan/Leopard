import "../styles/global.css"; // eslint-disable-line local-rules/no-relative-import

import type { AppProps } from "next/app";
import { RiptideProvider } from "@riptide/toolkit/provider";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RiptideProvider>
      <Component {...pageProps} />
    </RiptideProvider>
  );
}
export default MyApp;
