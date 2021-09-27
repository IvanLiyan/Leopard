import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Checkbox } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { DayPickerInput } from "@ContextLogic/lego";
import { Tip } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightMedium } from "@toolkit/fonts";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Merchant Store */
import { ProductBoostPropertyContext } from "@merchant/stores/product-boost/ProductBoostContextStore";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import DimenStore from "@merchant/stores/DimenStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import CampaignNameValidator from "@toolkit/product-boost/validators/CampaignNameValidator";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { DayPickerProps } from "react-day-picker/types/Props";

type CampaignBasicsProps = BaseProps & {
  readonly notFocusOnMount?: boolean;
};

const formatDate = (date: Date): string => {
  return i`${date.toISOString().slice(0, 10)} 00:00 Pacific Time`;
};

@observer
class CampaignBasics extends Component<CampaignBasicsProps> {
  static contextType = ProductBoostPropertyContext;
  context!: React.ContextType<typeof ProductBoostPropertyContext>;

  @computed
  get campaign(): Campaign | null | undefined {
    const { currentCampaign } = ProductBoostStore.instance();
    return currentCampaign;
  }

  @computed
  get styles() {
    const { isSmallScreen } = DimenStore.instance();

    return StyleSheet.create({
      input: {
        width: !isSmallScreen ? "60%" : "100%",
      },
      topMargin: {
        marginTop: 20,
      },
      leftMargin: {
        marginLeft: 10,
      },
      verticalMargin: {
        margin: "10px 0",
      },
      text: {
        color: palettes.textColors.Ink,
        fontSize: 16,
        fontWeight: weightMedium,
      },
      greyText: {
        color: palettes.textColors.LightInk,
        fontSize: 16,
        fontWeight: weightMedium,
      },
      flexRow: {
        display: "flex",
        alignItems: "center",
      },
      intenseBoostContent: {
        display: "flex",
        flexDirection: "row",
      },
      createCampaignTip: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
      },
      createCampaignTipText: {
        fontSize: 14,
        color: palettes.textColors.Ink,
      },
    });
  }

  @computed
  get campaignNameValidator() {
    const {
      campaignProperty: { maxCampaignNameLength },
    } = this.context;
    return new CampaignNameValidator({
      maxLength: maxCampaignNameLength,
    });
  }

  @computed
  get renderCampaignName() {
    const { notFocusOnMount } = this.props;
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    return (
      <HorizontalField
        title={i`Campaign Name`}
        centerTitleVertically
        className={css(this.styles.topMargin)}
      >
        <TextInput
          value={campaign.name}
          placeholder={i`Enter a campaign name`}
          onChange={({ text }: OnTextChangeEvent) => {
            campaign.name = text;
          }}
          validators={[this.campaignNameValidator]}
          disabled={!campaign.isNewState}
          focusOnMount={!notFocusOnMount}
          className={css(this.styles.input)}
        />
      </HorizontalField>
    );
  }

  onStartDateChange = (date: Date) => {
    const { campaign } = this;
    if (!campaign || !campaign.startDate || !campaign.endDate) {
      return;
    }
    const newStartDate = date;
    const duration = campaign.endDate.getTime() - campaign.startDate.getTime();
    const mDuration = moment.duration(duration);
    const newEndDate = moment(newStartDate).add(mDuration).toDate();
    campaign.startDate = newStartDate;
    campaign.endDate = newEndDate;
  };

  @computed
  get renderStartDate() {
    const { campaign } = this;
    const {
      campaignProperty: { minStartDate, maxStartDate },
    } = this.context;
    if (!campaign) {
      return;
    }

    const dayPickerProps: DayPickerProps = {
      selectedDays: campaign.startDate || undefined,
      disabledDays: [
        { before: new Date(minStartDate.unix * 1000) },
        { after: new Date(maxStartDate.unix * 1000) },
      ],
    };

    const { locale } = LocalizationStore.instance();

    return (
      <HorizontalField
        title={i`Start Date`}
        centerTitleVertically
        className={css(this.styles.verticalMargin)}
      >
        <DayPickerInput
          value={campaign.startDate ? new Date(campaign.startDate) : undefined}
          noEdit
          disabled={!campaign.isNewState}
          formatDate={formatDate}
          dayPickerProps={dayPickerProps}
          onDayChange={this.onStartDateChange}
          className={css(this.styles.input)}
          locale={locale}
        />
      </HorizontalField>
    );
  }

  @computed
  get renderEndDate() {
    const { campaign } = this;
    const {
      campaignProperty: { maxNumWeeks },
    } = this.context;
    if (!campaign || !campaign.startDate) {
      return;
    }
    const disabled = !campaign.isNewState && campaign.isEvergreen;
    const mStartDate = moment(campaign.startDate);
    const minDuration = moment.duration(1, "days");
    const maxDuration = moment.duration(maxNumWeeks, "weeks");
    const minEndDate = mStartDate.clone().add(minDuration).toDate();
    const maxEndDate = mStartDate.clone().add(maxDuration).toDate();
    const dayPickerProps: DayPickerProps = {
      selectedDays: campaign.endDate || undefined,
      disabledDays: [{ before: minEndDate }, { after: maxEndDate }],
    };
    const { locale } = LocalizationStore.instance();
    return (
      <HorizontalField
        title={i`End Date`}
        centerTitleVertically
        className={css(this.styles.verticalMargin)}
      >
        <DayPickerInput
          value={campaign.endDate || undefined}
          noEdit
          disabled={!!disabled}
          formatDate={formatDate}
          dayPickerProps={dayPickerProps}
          onDayChange={(date: Date) => {
            campaign.endDate = date;
          }}
          className={css(this.styles.input)}
          locale={locale}
        />
      </HorizontalField>
    );
  }

  @computed
  get renderEvergreen() {
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    return (
      <HorizontalField
        title={i`Auto Renew`}
        centerTitleVertically
        className={css(this.styles.verticalMargin)}
      >
        <div className={css(this.styles.flexRow)}>
          <Checkbox
            checked={!!campaign.isEvergreen}
            onChange={(checked: boolean) => {
              campaign.isEvergreen = checked;
            }}
          />
          <span className={css(this.styles.text, this.styles.leftMargin)}>
            <span>Auto renew this campaign after completion</span>
            <Link
              href={zendeskURL("360020530033")}
              openInNewTab
              className={css(this.styles.leftMargin)}
            >
              Learn more
            </Link>
          </span>
        </div>
      </HorizontalField>
    );
  }

  @computed
  get renderIntenseBoost() {
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    // Only support new campaign edit
    const checkboxEnabled = campaign.isNewState;
    return (
      <HorizontalField
        title={i`IntenseBoost`}
        className={css(this.styles.verticalMargin)}
        popoverContent={
          i`IntenseBoost can help you maximize your product visibility and reach more ` +
          i` customers faster.  This new feature allows your products to receive` +
          i` more impressions in a shorter period of time at a higher cost,` +
          i` which can be beneficial for newly uploaded products.`
        }
      >
        <div className={css(this.styles.intenseBoostContent)}>
          <Checkbox
            checked={!!campaign.intenseBoost}
            onChange={(checked: boolean) => {
              campaign.intenseBoost = checked;
            }}
            disabled={!checkboxEnabled}
          />
          <span className={css(this.styles.text, this.styles.leftMargin)}>
            <span>Quickly increasing your advertising impressions</span>
          </span>
        </div>
      </HorizontalField>
    );
  }

  @computed
  get simpleBoostLabel() {
    return () => (
      <div className={css(this.styles.flexRow, this.styles.text)}>
        <span style={{ marginRight: 4 }}>Simple Boost</span>
        <span className={css(this.styles.greyText)}>
          (Keywords & bids not required)
        </span>
      </div>
    );
  }

  @computed
  get classicBoostLabel() {
    return () => (
      <div className={css(this.styles.flexRow, this.styles.text)}>
        <span>Classic Boost</span>
      </div>
    );
  }

  @computed
  get renderProductTrainingTip() {
    return (
      <Tip
        className={css(this.styles.createCampaignTip)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        <div className={css(this.styles.createCampaignTipText)}>
          <Markdown
            text={
              i`To get your product in front of the right customers, it takes` +
              i` 28 days on average to train our algorithm on a newly boosted` +
              i` product. For best results, consider running a campaign for ` +
              i`**four weeks** or having the campaign autorenew for a month.`
            }
          />
        </div>
      </Tip>
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(className)}>
        {this.renderCampaignName}
        <hr />
        <p className={css(this.styles.text)}>
          You can set a campaign to run for up to 4 weeks. Start and end dates
          are in Pacific Time.
        </p>
        {this.renderProductTrainingTip}
        {this.renderStartDate}
        {this.renderEndDate}
        {this.renderEvergreen}
        {this.renderIntenseBoost}
      </div>
    );
  }
}
export default CampaignBasics;
