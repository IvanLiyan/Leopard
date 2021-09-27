import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed, action } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { DayPickerInput } from "@ContextLogic/lego";

/* Merchant Store */
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type CampaignDateInputProps = BaseProps & {
  readonly campaignId: string;
  readonly currentDate: string;
  readonly onCampaignUpdated?: () => unknown;
  readonly fieldDisabled: boolean;
  readonly isStartDate: boolean;
  readonly isRunningState?: boolean;
  readonly timeDiff?: number; // for StartDate only
  readonly minStartDate: Date;
  readonly maxStartDate: Date;
  readonly maxNumWeeks: number;
};

@observer
class CampaignDateInput extends Component<CampaignDateInputProps> {
  @computed
  get dayPickerProps() {
    const { productBoostStore } = AppStore.instance();
    const {
      campaignId,
      currentDate,
      isStartDate,
      maxStartDate,
      minStartDate,
      maxNumWeeks,
    } = this.props;
    const campaign = productBoostStore.getCampaign(campaignId);
    const disabledBefore =
      isStartDate || campaign?.startDate == null
        ? minStartDate
        : moment(campaign?.startDate).add(1, "day").toDate();
    const disabledAfter =
      isStartDate || campaign?.startDate == null
        ? maxStartDate
        : moment(campaign?.startDate)
            .add(7 * maxNumWeeks, "day")
            .toDate();
    return {
      selectedDays: new Date(currentDate),
      disabledDays: [
        {
          before: disabledBefore,
        },
        {
          after: disabledAfter,
        },
      ],
    };
  }

  @action
  onDayChange = async (date: Date) => {
    const { toastStore, productBoostStore } = AppStore.instance();
    const {
      campaignId,
      currentDate,
      onCampaignUpdated,
      isStartDate,
    } = this.props;

    const campaign = productBoostStore.getCampaign(campaignId);
    if (!campaign) {
      return;
    }
    const currentDateObject = new Date(currentDate);
    if (moment(date).isSame(currentDateObject, "day")) {
      return;
    }
    toastStore.info(i`Date is being updated.`);
    if (isStartDate) {
      const currentEndDate = campaign.endDate;
      try {
        campaign.startDate = date;
        campaign.endDate = moment(date)
          .add(this.props.timeDiff, "milliseconds")
          .toDate();
        await productBoostStore.commitCampaign(campaignId);
      } catch (e) {
        campaign.startDate = currentDateObject;
        campaign.endDate = currentEndDate;
        return;
      }
    } else {
      try {
        campaign.endDate = date;
        if (this.props.isRunningState) {
          await productBoostStore.commitRunningCampaign(campaignId);
        } else {
          await productBoostStore.commitCampaign(campaignId);
        }
      } catch (e) {
        campaign.endDate = currentDateObject;
        return;
      }
    }
    if (onCampaignUpdated) {
      // prevent reading from the secondary db before it updates
      setTimeout(onCampaignUpdated, 500);
    }
    toastStore.positive(i`Date updated successfully!`);
  };

  render() {
    const productBoostStore: ProductBoostStore = AppStore.instance()
      .productBoostStore;
    const { campaignId, fieldDisabled, isStartDate } = this.props;
    const campaign: Campaign | null | undefined = productBoostStore.getCampaign(
      campaignId
    );
    if (!campaign) {
      // Should never happen.
      return null;
    }

    const value = isStartDate ? campaign.startDate : campaign.endDate;

    const { locale } = LocalizationStore.instance();

    if (!value) {
      return null;
    }

    return (
      <DayPickerInput
        value={value}
        style={{ minWidth: 95 }}
        noEdit
        alignRight={!isStartDate}
        displayFormat={"MM/DD/YYYY"}
        dayPickerProps={this.dayPickerProps}
        onDayChange={this.onDayChange}
        disabled={fieldDisabled}
        locale={locale}
      />
    );
  }
}
export default CampaignDateInput;
