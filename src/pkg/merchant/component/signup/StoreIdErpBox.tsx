import React from "react";

/* Merchant Model */
import { PartnerState } from "@merchant/model/PartnerState";

/* Relative Imports */
import StoreIdBox from "./StoreIdBox";
import StoreIdErpModal from "./StoreIdErpModal";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type StoreIdErpBoxProps = BaseProps & {
  readonly partnerState: PartnerState;
};

const StoreIdErpBox = (props: StoreIdErpBoxProps) => {
  const { className, style, partnerState } = props;

  const topBannerText =
    i`**Limited time offer!**` +
    i` Connect a trusted API partner and share only 5% of your revenue for` +
    i` first 90 days. This regional promotion applies to merchants that are` +
    i` located in specific countries. `;
  return (
    <StoreIdBox
      style={style}
      className={className}
      topBannerText={topBannerText}
      illustrationName="apiPartner"
      title={i`API Partner`}
      subtitle={i`Choose from a list of trusted partners to connect to your store.`}
      onConnect={() => {
        new StoreIdErpModal(partnerState).render();
      }}
    />
  );
};

export default StoreIdErpBox;
