import React from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import BoostTermsOfService from "@merchant/component/product-boost/terms/ProductBoostTermsOfService";

/* Merchant Plus Components */
import PageGuide from "@plus/component/nav/PageGuide";
import ProductBoostAcceptTermsOfServiceButton from "@merchant/component/product-boost/terms/ProductBoostAcceptTermsOfServiceButton";

/* Types */
import { MarketingMerchantPropertySchema, MerchantSchema } from "@schema/types";
import PageRoot from "@plus/component/nav/PageRoot";

type InitialData = {
  readonly marketing: {
    readonly currentMerchant: Pick<
      MarketingMerchantPropertySchema,
      "latestTosVersion" | "canAcceptTos"
    >;
  };
  readonly currentMerchant?: Pick<MerchantSchema, "isMerchantPlus">;
};

type TermsPageProps = {
  readonly initialData: InitialData;
};

const PlusBoostTermsContainer: React.FC<TermsPageProps> = ({
  initialData,
}: TermsPageProps) => {
  const {
    marketing: {
      currentMerchant: { latestTosVersion, canAcceptTos },
    },
    currentMerchant,
  } = initialData;

  return (
    <PageRoot>
      <PageGuide>
        <BoostTermsOfService />
        {canAcceptTos && (
          <ProductBoostAcceptTermsOfServiceButton
            tosVersion={latestTosVersion}
            isMerchantPlus={currentMerchant?.isMerchantPlus}
          />
        )}
      </PageGuide>
    </PageRoot>
  );
};

export default observer(PlusBoostTermsContainer);
