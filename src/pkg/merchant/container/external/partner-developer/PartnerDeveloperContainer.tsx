import React, { useRef } from "react";
import { observer } from "mobx-react";

/* Merchant Components */
import PartnerDeveloperLandingPage from "@merchant/component/external/partner-developer/PartnerDeveloperLandingPage";

/* Merchant Model */
import PartnerDeveloperGlobalState from "@merchant/model/external/partner-developer/PartnerDeveloperGlobalState";

const PartnerDeveloperContainer = () => {
  const { current: partnerDeveloperState } = useRef(
    new PartnerDeveloperGlobalState(),
  );
  return (
    <PartnerDeveloperLandingPage
      partnerDeveloperState={partnerDeveloperState}
    />
  );
};

export default observer(PartnerDeveloperContainer);
