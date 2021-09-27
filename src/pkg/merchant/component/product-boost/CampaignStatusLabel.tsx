import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Text, ThemedLabel } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Stores */
import UserStore from "@merchant/stores/UserStore";

/* Merchant Components */
import TrainingProgressBar from "@merchant/component/product-boost/TrainingProgressBar";

/* Type Imports */
import { ThemedLabelProps } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MarketingCampaignState } from "@schema/types";

export type CampaignStatusLabelProps = BaseProps & {
  readonly status: MarketingCampaignState | null | undefined;
  readonly maxAllowedSpending?: number | null | undefined;
  readonly maxBudget?: number | null | undefined;
  readonly automatedType?: number | null | undefined;
  readonly trainingProgress?: number;
  readonly discount?: number;
  readonly learningStatusThreshold?: number | null | undefined;
};

@observer
class CampaignStatusLabel extends Component<CampaignStatusLabelProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      popoverContainer: {
        maxWidth: "360px",
        padding: "0px 16px 16px 16px",
      },
      popoverText: {
        fontSize: "14px",
        marginTop: "15px",
      },
      popoverTitle: {
        fontSize: "16px",
        margin: "10px 0 10px 0",
      },
      labelStyle: {
        width: 112,
        height: 20,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: fonts.weightMedium,
      },
    });
  }

  @computed
  get onGoingLabelText() {
    const { trainingProgress } = this.props;
    const { loggedInMerchantUser } = UserStore.instance();
    if (loggedInMerchantUser.is_on_vacation) {
      return i`Not Delivering`;
    }
    if (trainingProgress != null && trainingProgress !== -1) {
      return i`On-going (Training)`;
    }
    return i`On-going`;
  }

  @computed
  get onGoingPopoverContent() {
    const { trainingProgress, automatedType, discount } = this.props;
    if (automatedType === 3 && discount === 1) {
      // TODO: one-off tooltip for FBW promotion, pending clean up
      return i`Enjoy the free ProductBoost campaign for this FBW product.`;
    } else if (trainingProgress != null && trainingProgress !== -1) {
      return this.renderTrainingPopoverContent;
    }
    return i`Campaign is active and your products are being promoted now.`;
  }

  renderTrainingPopoverContent = () => {
    const { trainingProgress, learningStatusThreshold } = this.props;
    if (
      trainingProgress === undefined ||
      learningStatusThreshold == undefined
    ) {
      return null;
    }
    const remainingTrainingDays = Math.round(
      (1 - trainingProgress) * learningStatusThreshold
    );
    return (
      <div className={css(this.styles.popoverContainer)}>
        <Text weight="bold" className={css(this.styles.popoverTitle)}>
          Campaign Training Progress
        </Text>
        <TrainingProgressBar progress={trainingProgress} />
        <Text weight="regular" className={css(this.styles.popoverText)}>
          This campaign is currently in training. In an estimated
          {remainingTrainingDays} more days, we will be able to consistently put
          your products in front of the right customers!
        </Text>
      </div>
    );
  };

  @computed
  get labelProps(): ThemedLabelProps | null | undefined {
    const { status, maxBudget, maxAllowedSpending, automatedType } = this.props;

    switch (status) {
      case "NEW": {
        let toolTipText = i`New campaign has been created and it can still be edited.`;
        if (automatedType === 1) {
          toolTipText = i`New campaign has been created.`;
        }
        return {
          text: i`New`,
          position: "top center",
          theme: "CashGreen",
          popoverContent: toolTipText,
          popoverMaxWidth: 300,
          popoverFontSize: 14,
        };
      }
      case "SAVED":
        return {
          text: i`Scheduled`,
          position: "top center",
          // Bypass a linter's error that treated THEME as a user visible string.
          // eslint-disable-next-line local-rules/unwrapped-i18n
          theme: "Cyan",
          popoverContent:
            i`Campaign has been submitted and will start as per scheduled ` +
            i`time period.`,
          popoverMaxWidth: 300,
          popoverFontSize: 14,
        };
      case "STARTED":
        return {
          text: this.onGoingLabelText,
          position: "top center",
          theme: "WishBlue",
          popoverContent: this.onGoingPopoverContent,
          popoverMaxWidth: 300,
          popoverFontSize: 14,
        };
      case "PENDING": {
        let pendingLabelText = i`Action required`;
        let toolTipText =
          i`Campaign needs to be enabled or balance needs ` +
          i`to be recharged.`;
        if (maxBudget != null && maxAllowedSpending != null) {
          const budgetMinusAllowedSpend = (
            maxBudget - maxAllowedSpending
          ).toFixed(2);
          const enoughBudget = parseFloat(budgetMinusAllowedSpend) < 0.01;

          if (enoughBudget) {
            pendingLabelText = i`Enable required`;
            toolTipText =
              i`Your campaign has been paused. To enable your campaign, ` +
              i`please click the Enable button.`;
            if (automatedType === 1) {
              toolTipText =
                i`Wish offers discount for this campaign. Click Enable to ` +
                i`start this campaign.`;
            } else if (automatedType === 3) {
              // TODO: one-off tooltip for FBW promotion, pending clean up
              toolTipText =
                i`Wish is offering a special 50% FBW discount for this campaign. ` +
                i`Enable the campaign to activate it.`;
            }
          } else {
            pendingLabelText = i`Recharge required`;
            toolTipText =
              i`You don't have enough balance to renew your campaign. Please ` +
              i`click the Recharge button to top up your balance.`;
            if (automatedType === 1) {
              toolTipText =
                i`You don't have enough balance to enable your automated ` +
                i`campaign. Please click the Recharge button on the right to ` +
                i`top up your balance.`;
            }
          }
        }
        return {
          text: pendingLabelText,
          position: "top center",
          theme: "DarkYellow",
          popoverContent: toolTipText,
          popoverMaxWidth: 300,
          popoverFontSize: 14,
        };
      }
      case "CANCELLED":
        return {
          text: i`Cancelled`,
          position: "top center",
          theme: "DarkRed",
          popoverContent:
            i`Campaign was stopped when it was in 'New' status. As the ` +
            i`campaign did not deliver, no daily performance data has been ` +
            i`collected. `,
          popoverMaxWidth: 300,
          popoverFontSize: 14,
        };
      case "ENDED":
        return {
          text: i`Ended`,
          position: "top center",
          theme: "DarkInk",
          popoverContent:
            i`Campaign has completed. Performance data is available and ` +
            i`campaign fees will be charged to your account.`,
          popoverMaxWidth: 300,
          popoverFontSize: 14,
        };
    }
  }

  render() {
    if (this.labelProps == null) {
      return null;
    }
    return (
      <ThemedLabel
        className={css(this.styles.labelStyle)}
        {...this.labelProps}
      />
    );
  }
}
export default CampaignStatusLabel;
