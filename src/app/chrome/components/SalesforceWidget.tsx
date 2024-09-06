import { gql } from "@gql";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { UserSchema } from "@schema";
import Script from "next/script";

declare global {
  interface Window {
    // Disabling because Salesforce doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    embedded_svc: any;
    // Disabling because Zendesk doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zESettings: any;
    // Disabling because Zendesk doesn't provide typing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zE: any;
  }
}

const SalesforceWidget: React.FC<{
  showSaleForveWidget?: boolean | null;

  merchantSupportConfigInitialData?: MerchantSupportConfigQueryResponse | null;
}> = ({
  children,
  showSaleForveWidget,

  merchantSupportConfigInitialData,
}) => {
  const { localeProper } = useLocalizationStore();
  const loggedInUser = merchantSupportConfigInitialData?.currentUser;

  if (!loggedInUser) {
    return <>{children}</>;
  }

  const ZenLoad = (setting: boolean) => {
    // Legacy Zendesk config
    window.zE(function () {
      window.zE.setLocale(localeProper);
      window.zE.identify({
        name: loggedInUser.displayName,
        email: loggedInUser.email,
      });
    });
    if (setting) {
      window.zESettings = {
        webWidget: {
          color: {
            theme: "#022786",
            launcher: "#022786",
            launcherText: "#FFFFFF",
            header: "#DCE5E9",
            button: "#305BEF",
          },
        },
      };
    }
  };

  // zdassets can't work on dev local
  if (
    process.env.NEXT_PUBLIC_ENV === "fe_prod" &&
    loggedInUser.supportConfig?.isEnBd &&
    !showSaleForveWidget
  ) {
    return (
      <>
        <Script
          strategy="lazyOnload"
          id="ze-snippet"
          src="https://static.zdassets.com/ekr/snippet.js?key=a45697a9-912b-43e4-b6a7-b1c874344ad8"
          onLoad={() => ZenLoad(false)}
        />
        {children}
      </>
    );
  }
  // Otherwise, show nothing
  return <>{children}</>;
};

export const MerchantSupportConfigQuery = gql(`
  query MerchantSupportConfigQuery {
    currentUser {
      displayName
      email
      supportConfig {
        isEnBd
        isNonEnBd
      }
      accountManager {
        email
      }
    }
  }
`);

export type MerchantSupportConfigQueryResponse = {
  readonly currentUser?:
    | ({ readonly accountManager?: Pick<UserSchema, "email"> | null } & Pick<
        UserSchema,
        "supportConfig" | "displayName" | "email"
      >)
    | null;
};

export default SalesforceWidget;
