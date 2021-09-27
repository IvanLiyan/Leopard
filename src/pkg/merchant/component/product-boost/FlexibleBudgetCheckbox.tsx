import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxField } from "@ContextLogic/lego";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Merchant Store */
import { useProductBoostFlexibleBudgetInfo } from "@merchant/stores/product-boost/ProductBoostContextStore";

/* Type Import */
import { MarketingFlexibleBudgetType } from "@schema/types";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FlexibleBudgetCheckboxProps = BaseProps & {
  readonly campaign: Campaign;
  readonly flexibleBudgetType: MarketingFlexibleBudgetType;
  readonly disable?: boolean;
};

const FlexibleBudgetCheckbox = (props: FlexibleBudgetCheckboxProps) => {
  const { campaign, flexibleBudgetType, disable } = props;
  const flexibleBudgetInfo = useProductBoostFlexibleBudgetInfo();
  if (!flexibleBudgetInfo || flexibleBudgetType === "DISABLED") {
    return null;
  }

  const {
    currentUser: {
      gating: { allowFlexibleBudgetSuggestBudget },
    },
  } = flexibleBudgetInfo;

  let flexibleBudgetDescription = "";
  if (allowFlexibleBudgetSuggestBudget) {
    flexibleBudgetDescription =
      i`You may be eligible for the Reward Budget discount after setting ` +
      i`your campaign budget above a threshold amount. Input a budget ` +
      i`amount above and click this checkbox for more details.`;
  } else {
    flexibleBudgetDescription =
      flexibleBudgetType === "SILVER_TIER"
        ? i`Thank you for being a valuable member of Wish. As a token of appreciation, ` +
          i`you are eligible to claim the Reward Budget. ` +
          i`You will be eligible for more rewards when you have a higher Merchant Standing. ` +
          i`Please click the checkbox and find out the detail.`
        : i`Thank you for being a valuable member of Wish with high Merchant Standing. ` +
          i`As a token of appreciation, you are eligible to claim the Reward Budget. ` +
          i`Please click the checkbox and find out the detail.`;
  }

  return (
    <CheckboxField
      title={i`I would like to receive the Reward Budget`}
      description={flexibleBudgetDescription}
      checked={!!campaign.flexibleBudgetEnabled}
      disabled={!campaign.isNewState || disable}
      onChange={(checked: boolean) => {
        campaign.flexibleBudgetEnabled = checked;
      }}
    />
  );
};

export default observer(FlexibleBudgetCheckbox);
