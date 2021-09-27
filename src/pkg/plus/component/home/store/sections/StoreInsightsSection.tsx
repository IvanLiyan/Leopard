import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import HomeSection from "@plus/component/home/HomeSection";
import InsightsCard from "@plus/component/home/cards/InsightsCard";
import SellerValidationCard from "@plus/component/home/cards/SellerVerificationCard";
import { PickedSellerVerification } from "@toolkit/home";

type Props = BaseProps & {
  readonly sellerVerification: PickedSellerVerification;
};
const StoreInsightsSection: React.FC<Props> = ({
  style,
  className,
  sellerVerification,
}: Props) => {
  const styles = useStylesheet();

  // Note: if the merchant can complete the KYC verification and
  // this GMV cap has been reached, then the corresponding card is shown in
  // the "things to do" section
  const { actionRequired, gmvCapReached } = sellerVerification;
  const canShowSellerVerification = actionRequired && !gmvCapReached;

  return (
    <HomeSection title={i`Store Insights`} className={css(style, className)}>
      <div className={css(styles.root)}>
        <InsightsCard isStoreMerchant />
        {canShowSellerVerification && (
          <SellerValidationCard sellerVerification={sellerVerification} />
        )}
      </div>
    </HomeSection>
  );
};

export default observer(StoreInsightsSection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "grid",
          gridGap: 18,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        },
      }),
    []
  );
