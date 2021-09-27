import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import BoostTermsOfService from "@merchant/component/product-boost/terms/ProductBoostTermsOfService";

/* Merchant Plus Components */
import PageGuide from "@plus/component/nav/PageGuide";
import { useTheme } from "@merchant/stores/ThemeStore";
import ProductBoostAcceptTermsOfServiceButton from "@merchant/component/product-boost/terms/ProductBoostAcceptTermsOfServiceButton";
import { MarketingMerchantPropertySchema } from "@schema/types";

type InitialData = {
  readonly marketing: {
    readonly currentMerchant: Pick<
      MarketingMerchantPropertySchema,
      "latestTosVersion" | "canAcceptTos"
    >;
  };
};

type TermsPageProps = {
  readonly initialData: InitialData | null;
};

const ProductBoostTermsOfServiceContainer = ({
  initialData,
}: TermsPageProps) => {
  const styles = useStylesheet();

  // render static terms page if initialData is null
  if (initialData == null) {
    return (
      <div className={css(styles.terms)}>
        <PageGuide>
          <BoostTermsOfService />
        </PageGuide>
      </div>
    );
  }

  const {
    marketing: {
      currentMerchant: { latestTosVersion, canAcceptTos },
    },
  } = initialData;

  return (
    <div className={css(styles.terms)}>
      <PageGuide>
        <BoostTermsOfService />
        {canAcceptTos && (
          <ProductBoostAcceptTermsOfServiceButton
            tosVersion={latestTosVersion}
          />
        )}
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        terms: {
          marginTop: 20,
          color: textBlack,
          marginBottom: 80,
          /* Extra bottom margin to take care of footer hiding the line */
        },
      }),
    [textBlack],
  );
};

export default observer(ProductBoostTermsOfServiceContainer);
