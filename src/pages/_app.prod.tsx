import "../styles/global.css";

import { useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import MerchantDashboardProvider from "@chrome/MerchantDashboardProvider";
import { isProd } from "@core/stores/EnvironmentStore";
import {
  sardineScriptId,
  useSardineConstants,
} from "@core/stores/SardineStore";

const TRUSTARC_DOMAIN = isProd ? "wish.com" : "wish-test.com";

const MerchantDashboard = ({
  Component,
  pageProps,
  router,
}: AppProps): JSX.Element => {
  const independentSubpaths = ["/dev-login", "/hello-world", "/go", "/data"];
  const foundIndependentSubpath = independentSubpaths.some((element) =>
    router.pathname.includes(element),
  );
  if (foundIndependentSubpath) return <Component {...pageProps} />;

  // if a page is in this array, any queries made for setting up stores that
  // require a logged in user (e.g. navigation graph) will be skipped
  const publicSubpaths = [
    "/welcome-mms",
    "/welcome-invite-only",
    "/login",
    "/notice-portal/intake",
  ];
  const isPublic = publicSubpaths.some((element) => {
    return router.asPath.includes(element);
  });

  return (
    <MerchantDashboardProvider isPublic={isPublic}>
      <Component {...pageProps} />
    </MerchantDashboardProvider>
  );
};

const App = (props: AppProps): JSX.Element => {
  const { sardineHost, sardineClientId, sardineSessionKey } =
    useSardineConstants();

  useEffect(() => {
    if (
      !window.sardineContext &&
      sardineHost &&
      sardineClientId &&
      sardineSessionKey
    ) {
      const scriptContent = `
      (function () {
        window.onSardineLoadedProm = new Promise(resolve => {
            window.onSardineLoaded = () => {
            try {
              if (!window.sardineContext) {
                  window.sardineContext = window._Sardine.createContext({
                  clientId: "${sardineClientId}",
                  sessionKey: "${sardineSessionKey}",
                  flow: "app",
                  environment: "${sardineHost}" === "api.sardine.ai" ? "production": "sandbox",
                  parentElement: document.body,
                  onDeviceResponse: function(data) {
                  }
                  });
              }
            } finally {
              resolve();
            }
            };
        });
        var loader = document.createElement('script');
        loader.type = 'text/javascript';
        loader.async = true;
        loader.src = 'https://${sardineHost}/assets/loader.min.js';
        loader.onload = window.onSardineLoaded
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(loader, s);
      })();
      `;

      // Dynamically insert the script
      const script = document.createElement("script");
      script.id = sardineScriptId;
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = scriptContent;
      document.head.appendChild(script);
    }
  }, [sardineHost, sardineClientId, sardineSessionKey]);

  return (
    <div suppressHydrationWarning>
      <Head>
        <title>Wish for Merchants</title>
      </Head>
      <Script
        id="ta-setup"
        src={`//consent.trustarc.com/notice?domain=${TRUSTARC_DOMAIN}&c=teconsent&text=true&js=nj&gtm=1&noticeType=bb`}
      />
      <Script id="gtm-setup">
        {`
          (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, "script", "dataLayer", "GTM-N7HNVP4");
        `}
      </Script>
      <Script id="ta-gtm-integration">
        {`
          var __dispatched__ = {}; //Map of previously dispatched preference levels
          /*
          First step is to register with the CM API to receive callbacks when a preference update
          occurs. You must wait for the CM API (PrivacyManagerAPI object) to exist on the page before
          registering.
          */
          var __i__ =
            self.postMessage &&
            setInterval(function () {
              if (self.PrivacyManagerAPI && __i__) {
                var apiObject = {
                  PrivacyManagerAPI: {
                    action: "getConsentDecision",
                    timestamp: new Date().getTime(),
                    self: self.location.host,
                  },
                };
                self.top.postMessage(JSON.stringify(apiObject), "*");
                __i__ = clearInterval(__i__);
              }
            }, 50);
          /*
          Callbacks will occur in the form of a PostMessage event. This code listens for the
          appropriately formatted PostMessage event, gets the new consent decision, and then pushes
          the events into the GTM framework. Once the event is submitted, that consent decision is
          marked in the 'dispatched' map so it does not occur more than once.
          */
          self.addEventListener("message", function (e, d) {
            try {
              if (
                e.data &&
                (d = JSON.parse(e.data)) &&
                (d = d.PrivacyManagerAPI) &&
                d.capabilities &&
                d.action == "getConsentDecision"
              ) {
                var newDecision = self.PrivacyManagerAPI.callApi(
                  "getGDPRConsentDecision",
                  self.location.host
                ).consentDecision;
                newDecision &&
                  newDecision.forEach(function (label) {
                    if (!__dispatched__[label]) {
                      self.dataLayer &&
                        self.dataLayer.push({ event: "GDPR Pref Allows " + label });
                      __dispatched__[label] = 1;
                    }
                  });
              }
            } catch (xx) {
              /** not a cm api message **/
            }
          });
        `}
      </Script>
      {/* GTM and TA required body html */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-N7HNVP4"
          height="0"
          width="0"
          className="gtm-noscript"
        ></iframe>
      </noscript>
      <div id="consent_blackbar"></div>
      <div id="teconsent"></div>
      {typeof window === "undefined" ? null : <MerchantDashboard {...props} />}
    </div>
  );
};
export default App;
