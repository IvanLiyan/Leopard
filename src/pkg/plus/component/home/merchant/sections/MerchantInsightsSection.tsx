import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import HomeSection from "@plus/component/home/HomeSection";
import InsightsCard from "@plus/component/home/cards/InsightsCard";
import VideoTutorialCard from "@plus/component/home/cards/VideoTutorialCard";
import WishExpressIntroCard from "@plus/component/home/cards/WishExpressIntroCard";
import { PickedSellerVerification } from "@toolkit/home";
import SellerValidationCard from "@plus/component/home/cards/SellerVerificationCard";

type Props = BaseProps & {
  readonly sellerVerification: PickedSellerVerification;
};

const MerchantInsightsSection: React.FC<Props> = ({
  style,
  className,
  sellerVerification,
}: Props) => {
  const styles = useStylesheet();

  // Note: if the merchant can complete the seller profile verification and
  // this GMV cap has been reached, then the corresponding card is shown in
  // the "things to do" section
  const { actionRequired, gmvCapReached } = sellerVerification;
  const canShowSellerVerification = actionRequired && !gmvCapReached;
  return (
    <HomeSection
      title={i`Insights and advice`}
      className={css(style, className)}
    >
      <div className={css(styles.root)}>
        <InsightsCard isStoreMerchant={false} />
        <VideoTutorialCard />
        <WishExpressIntroCard />
        {canShowSellerVerification && (
          <SellerValidationCard sellerVerification={sellerVerification} />
        )}
      </div>
    </HomeSection>
  );
};

export default observer(MerchantInsightsSection);

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
