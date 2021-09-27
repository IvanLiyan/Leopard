import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { CheckboxField } from "@ContextLogic/lego";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ScheduledBudgetCheckboxProps = BaseProps & {
  campaign: Campaign;
  setValidity?: (arg0: boolean) => void;
};

@observer
class ScheduledBudgetCheckbox extends Component<ScheduledBudgetCheckboxProps> {
  @computed
  get suggestedScheduledAmount(): number {
    const { campaign } = this.props;
    if (!campaign) {
      // Should never happen.
      return 3;
    }

    const { endDate, startDate } = campaign;
    if (endDate == null || startDate == null) {
      return 3;
    }

    const start = moment(startDate);
    const end = moment(endDate);
    const duration = Math.floor(moment.duration(end.diff(start)).asDays());
    let suggestedAmount = parseFloat(campaign.budget || "") / duration;
    suggestedAmount = Math.round(suggestedAmount * 100) / 100;
    return suggestedAmount > 3 ? suggestedAmount : 3;
  }

  render() {
    const { campaign, setValidity } = this.props;
    return (
      <CheckboxField
        title={i`I would like to set up a schedule to add budget automatically`}
        description={
          i`You will automatically add the specified amount ` +
          i`of budget each week on the selected days.`
        }
        checked={!!campaign.scheduledAddBudgetEnabled}
        onChange={(checked: boolean) => {
          campaign.scheduledAddBudgetEnabled = checked;
          if (checked) {
            campaign.scheduledAddBudgetDays = [0, 1, 2, 3, 4, 5, 6];
            campaign.scheduledAddBudgetAmount = this.suggestedScheduledAmount.toString();
          } else {
            campaign.scheduledAddBudgetDays = [];
            campaign.scheduledAddBudgetAmount = "0";
            if (setValidity) {
              setValidity(true);
            }
          }
        }}
      />
    );
  }
}
export default ScheduledBudgetCheckbox;
