import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { PageGuide } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import MerchantTrueBrandRequests from "@merchant/component/brand/branded-products/MerchantTrueBrandRequests";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BrandServiceSchema } from "@schema/types";

type InitialData = {
  readonly brand: Pick<BrandServiceSchema, "acceptedTrademarkCountries">;
};

type MerchantTrueBrandRequestsProps = {
  readonly initialData: InitialData;
};

const MerchantTrueBrandRequestsContainer = ({
  initialData,
}: MerchantTrueBrandRequestsProps) => {
  const styles = useStylesheet();
  const linkMarkdown = `[${i`Brand Directory`}](/branded-products/brand-directory)`;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Your Suggested Brands`}
        body={
          i`Brands that you have submitted for review from Wish will appear ` +
          i`here. Once your submission is complete, the brand will appear in the ${linkMarkdown} ` +
          i`and will be selectable as a brand when you are uploading products.`
        }
        illustration="merchantTrueBrandRequestsHeader"
      />
      <PageGuide>
        <MerchantTrueBrandRequests
          style={css(styles.trueBrandRequests)}
          acceptedTrademarkCountries={
            initialData.brand.acceptedTrademarkCountries
          }
        />
      </PageGuide>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        trueBrandRequests: {
          marginTop: 20,
        },
      }),
    [pageBackground]
  );
};

export default observer(MerchantTrueBrandRequestsContainer);
