import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { PagerHeader, WelcomeHeader } from "@merchant/component/core";

/* Merchant Components */
import RestrictedProductTab from "@merchant/component/policy/restricted-product/RestrictedProductTab";
import FinalSaleTab from "@merchant/component/policy/restricted-product/FinalSaleTab";
import {
  RestrictedProductRequestType,
  CountryAndRegionType,
} from "@merchant/component/policy/restricted-product/RestrictedProduct";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

/* Type Imports */
import {
  Scalars,
  MerchantSchema,
  RestrictedProductRegionCode,
  SellerVerificationSchema,
  RestrictedProductCountryCode,
} from "@schema/types";

/* Legacy */
import { zendeskURL } from "@legacy/core/url";

type InitialData = {
  readonly currentMerchant: {
    readonly sellerVerification: Pick<
      SellerVerificationSchema,
      "hasCompleted" | "isKycVerification"
    >;
    readonly restrictedProductDefaultCountry: {
      readonly code: RestrictedProductCountryCode;
      readonly restrictedProductRegion: CountryAndRegionType;
    };
    readonly canAccessFinalSale: Pick<MerchantSchema, "canAccessFinalSale">;
    readonly canAccessRestrictedProduct: Pick<
      MerchantSchema,
      "canAccessRestrictedProduct"
    >;
    readonly id: Scalars["ObjectIdType"];
  };
  readonly policy: {
    readonly restrictedProduct: {
      readonly restrictedProductRequests: ReadonlyArray<
        RestrictedProductRequestType
      >;
    };
  };
};

type AuthenticRestrictedProductSellerContainerProps = {
  readonly initialData: InitialData;
};

const AuthenticRestrictedProductSellerContainer = ({
  initialData,
}: AuthenticRestrictedProductSellerContainerProps) => {
  const styles = useStylesheet();
  const faqLink = zendeskURL("360055998653");
  const { pageGuideXForPageWithTable } = useDimenStore();

  const [currentTab, setCurrentTab] = useState<string>(
    window.location.hash ? window.location.hash.substr(1) : "restricted-product"
  );

  const handleTabChange = (tabKey: string) => {
    setCurrentTab(tabKey);
  };

  const {
    currentMerchant: {
      sellerVerification: {
        hasCompleted: hasCompletedSellerVerification,
        isKycVerification,
      },
      restrictedProductDefaultCountry: {
        code: suspectedCountry,
        restrictedProductRegion,
      },
      canAccessFinalSale,
      canAccessRestrictedProduct,
      id,
    },
    policy: {
      restrictedProduct: { restrictedProductRequests },
    },
  } = initialData;

  const merchantVerified = hasCompletedSellerVerification || isKycVerification;

  const regionCode: RestrictedProductRegionCode = useMemo(() => {
    if (
      restrictedProductRequests == null ||
      restrictedProductRequests.length == 0
    ) {
      return restrictedProductRegion.regionCode;
    }
    return restrictedProductRequests[0].region.regionCode;
  }, [restrictedProductRegion, restrictedProductRequests]);

  const hasExistingRequests: Boolean = useMemo(() => {
    if (
      restrictedProductRequests == null ||
      restrictedProductRequests.length == 0
    ) {
      return false;
    }
    return true;
  }, [restrictedProductRequests]);

  const welcomeText: string = useMemo(() => {
    let text = ``;
    if (canAccessRestrictedProduct) {
      text =
        text +
        i`Based on your store's country or region, certain product categories need ` +
        i`approval in order to be sold on Wish. To sell these restricted products, ` +
        i`apply below before adding your listings to your Wish store. ` +
        i`[Learn more](${faqLink}).`;
    }
    if (canAccessRestrictedProduct && canAccessFinalSale) {
      text = text + `  \n`;
    }
    if (canAccessFinalSale) {
      text =
        text +
        i`You may apply a Final Sale Policy to certain categories below.`;
    }
    return text;
  }, [canAccessRestrictedProduct, canAccessFinalSale, faqLink]);

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Product Authorizations`}
        illustration="restrictedProduct"
        body={() => (
          <div className={css(styles.row)}>
            <Markdown
              style={css(styles.welcomeText)}
              openLinksInNewTab
              text={welcomeText}
            />
          </div>
        )}
      />
      {canAccessRestrictedProduct && canAccessFinalSale && (
        <PagerHeader
          headerProps={{
            paddingX: pageGuideXForPageWithTable,
          }}
          pagerProps={{
            equalSizeTabs: true,
            onTabChange: handleTabChange,
            selectedTabKey: currentTab,
            tabAlignment: "center",
            tabsPadding: `0px ${pageGuideXForPageWithTable}`,
          }}
        >
          <PagerHeader.Content
            tabKey="restricted-product"
            titleValue={i`Restricted Product Categories`}
          >
            <RestrictedProductTab
              suspectedCountry={suspectedCountry}
              merchantVerified={merchantVerified}
              hasExistingRequests={hasExistingRequests}
              restrictedProductRequests={restrictedProductRequests}
              regionCode={regionCode}
            />
          </PagerHeader.Content>
          <PagerHeader.Content
            tabKey="final-sale"
            titleValue={i`Final Sale Policy`}
          >
            <FinalSaleTab merchantId={id} />
          </PagerHeader.Content>
        </PagerHeader>
      )}

      {canAccessRestrictedProduct && !canAccessFinalSale && (
        <RestrictedProductTab
          suspectedCountry={suspectedCountry}
          merchantVerified={merchantVerified}
          hasExistingRequests={hasExistingRequests}
          restrictedProductRequests={restrictedProductRequests}
          regionCode={regionCode}
        />
      )}

      {!canAccessRestrictedProduct && canAccessFinalSale && (
        <FinalSaleTab merchantId={id} />
      )}
    </div>
  );
};
export default observer(AuthenticRestrictedProductSellerContainer);

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
          paddingBottom: 45,
        },
        welcomeText: {
          fontSize: 16,
          color: textBlack,
          marginTop: 8,
          marginBottom: 20,
        },
        row: {
          display: "flex",
        },
      }),
    [pageBackground, textBlack]
  );
};
