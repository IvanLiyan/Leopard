import React from "react";

/* Merchant Components */
import UnderReviewMerchantStanding from "@merchant/component/widget/merchant-standing/UnderReviewMerchantStanding";
import ActiveMerchantStanding from "@merchant/component/widget/merchant-standing/ActiveMerchantStanding";
import SilverMerchantStanding from "@merchant/component/widget/merchant-standing/SilverMerchantStanding";
import GoldMerchantStanding from "@merchant/component/widget/merchant-standing/GoldMerchantStanding";
import PlatinumMerchantStanding from "@merchant/component/widget/merchant-standing/PlatinumMerchantStanding";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type MerchantStandingProps = BaseProps & {
  readonly standing: "UNDER_REVIEW" | "ACTIVE" | "SILVER" | "GOLD" | "PLATINUM";
};

export default ({ standing }: MerchantStandingProps) => {
  switch (standing) {
    case "UNDER_REVIEW":
      return <UnderReviewMerchantStanding />;
    case "ACTIVE":
      return <ActiveMerchantStanding />;
    case "SILVER":
      return <SilverMerchantStanding />;
    case "GOLD":
      return <GoldMerchantStanding />;
    case "PLATINUM":
      return <PlatinumMerchantStanding />;
  }
};
