import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { CurrencyInput } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import ModalHeader from "@merchant/component/core/modal/ModalHeader";
import { StaggeredFadeIn } from "@ContextLogic/lego";
import { StaggeredScaleIn } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import BonusBudgetForm from "@merchant/component/product-boost/BonusBudgetForm";
import BudgetBreakDownTable from "@merchant/component/product-boost/BudgetBreakDownTable";
import ScheduledBudgetCheckbox from "@merchant/component/product-boost/ScheduledBudgetCheckbox";
import ScheduledBudgetForm from "@merchant/component/product-boost/ScheduledBudgetForm";
import FlexibleBudgetForm from "@merchant/component/product-boost/FlexibleBudgetForm";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Type Import */
import { MarketingFlexibleBudgetType } from "@schema/types";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import AddBudgetValidator from "@toolkit/product-boost/validators/AddBudgetValidator";
import { CampaignFlexibleBudgetHelper } from "@toolkit/product-boost/utils/campaign-flexible-budget";

/* SVGs */
import CheckMark from "@assets/img/cyan-checkmark.svg";

import { OnTextChangeEvent } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SaveRunningCampaignParams } from "@merchant/api/product-boost";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import UserStore from "@merchant/stores/UserStore";
import DimenStore from "@merchant/stores/DimenStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ToastStore from "@merchant/stores/ToastStore";

//From AddBudgetNotificationSource
const NewListCampaignPageSource = 7;

export type AddBudgetModalContentProps = BaseProps & {
  readonly campaignId: string;
  readonly campaignName: string;
  readonly maxBudget: number;
  readonly onCampaignUpdated?: () => unknown;
  readonly onUpdateAllowedSpending?: () => unknown;
  readonly onClose?: () => unknown;
  readonly maxAllowedSpending: number;
  readonly maxSpendingBreakdown: any;
  readonly isPayable: boolean;
  readonly showSuggestedBudget: boolean | undefined;
  readonly suggestedBudget: number;
  readonly flexibleBudgetEnabled: boolean;
  readonly flexibleBudgetType?: MarketingFlexibleBudgetType;
  readonly fromNoti?: number | null | undefined;
};

@observer
class AddBudgetModalContent extends Component<AddBudgetModalContentProps> {
  @observable
  budgetToAdd: string = this.props.showSuggestedBudget
    ? this.props.suggestedBudget.toString()
    : "0";

  @observable
  validBudget = true;

  @observable
  validScheduledBudget = true;

  @observable
  budgetChanged: boolean | undefined = this.props.showSuggestedBudget;

  @observable
  scheduledChanged = false;

  @observable
  actionButtonLoading = false;

  @observable
  actionSucceed = false;

  oldScheduledEnabled = !!(
    this.campaign && this.campaign.scheduledAddBudgetEnabled
  );

  oldScheduledDays: ReadonlyArray<number> =
    (this.campaign &&
      this.campaign.scheduledAddBudgetDays &&
      this.campaign.scheduledAddBudgetDays.sort()) ||
    [];

  oldScheduledAmount: string =
    (this.campaign && this.campaign.scheduledAddBudgetAmount) || "0";

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        fontFamily: "Proxima",
      },
      addBudget: {
        margin: `${this.isSmallScreen ? 0 : 24}px 0px 24px 0px`,
      },
      addBudgetTitle: {
        fontSize: 20,
        marginLeft: this.tableSideMargin,
        marginRight: this.tableSideMargin,
        lineHeight: 1.4,
        color: palettes.textColors.Ink,
      },
      addBudgetSubTitle: {
        fontSize: 16,
        margin: `8px ${this.tableSideMargin} 0px ${this.tableSideMargin}`,
        lineHeight: 1.5,
        color: palettes.textColors.DarkInk,
      },
      addBudgetInput: {
        display: "flex",
        margin: `24px ${this.tableSideMargin} 0px ${this.tableSideMargin}`,
        alignItems: "flex-start",
        fontSize: 20,
        fontWeight: fonts.weightSemibold,
        lineHeight: 1.5,
        color: palettes.textColors.Ink,
      },
      dollarSign: {
        margin: "6px 8px 0px 0px",
      },
      campaignInfo: {
        display: "block",
        backgroundColor: palettes.greyScaleColors.LighterGrey,
        marginBottom: 24,
        padding: "24px 0px 8px 0px",
      },
      link: {
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",

        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      },
      rowContainer: {
        display: "flex",
        marginBottom: 16,
      },
      columnLeft: {
        lineHeight: 1.4,
        flex: 0.4,
        fontSize: this.tableFontSize,
        color: palettes.textColors.Ink,
        paddingLeft: this.tableSideMargin,
      },
      columnRight: {
        lineHeight: 1.4,
        flex: 0.6,
        fontSize: this.tableFontSize,
        paddingRight: this.tableSideMargin,
      },
      budgetBreakDownTable: {
        display: "block",
        width: "100%",
      },
      input: {
        "@media (max-width: 900px)": {
          width: "100%",
        },
        "@media (min-width: 900px)": {
          width: "60%",
        },
      },
      successSection: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: this.verticallyCenterPadding,
      },
      successSectionInner: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "0px 20px",
        textAlign: "center",
      },
      successImage: {
        width: 80,
      },
      successTitle: {
        marginTop: 50,
        fontSize: 20,
      },
      checkboxField: {
        marginLeft: this.tableSideMargin,
        marginBottom: 20,
      },
      flexibleBudgetInfo: {
        marginTop: 12,
        marginLeft: 20,
      },
    });
  }

  @computed
  get campaign(): Campaign | null | undefined {
    const productBoostStore = ProductBoostStore.instance();
    const { campaignId } = this.props;
    return productBoostStore.getCampaign(campaignId);
  }

  @computed
  get merchantId(): string {
    const userStore = UserStore.instance();
    return userStore.loggedInMerchantUser.merchant_id;
  }

  @computed
  get isSmallScreen(): boolean {
    const { isSmallScreen } = DimenStore.instance();
    return isSmallScreen;
  }

  @computed
  get verticallyCenterPadding(): string {
    const { screenInnerHeight } = DimenStore.instance();
    return `${0.2 * screenInnerHeight}px 0px ${0.3 * screenInnerHeight}px 0px`;
  }

  @computed
  get tableFontSize(): number {
    return this.isSmallScreen ? 14 : 16;
  }

  @computed
  get tableSideMargin(): string {
    return this.isSmallScreen ? "25px" : "40px";
  }

  @computed
  get addBudgetValidator() {
    if (!this.campaign) {
      return null;
    }
    const { maxAllowedSpending } = this.props;
    return new AddBudgetValidator({
      minAmount: this.campaign.minBudgetToAdd,
      maxAllowedSpending,
      currencyCode: this.campaign.localizedCurrency,
    });
  }

  @computed
  get increasedBudget(): number {
    const { maxBudget } = this.props;
    if (this.validBudget && parseFloat(this.budgetToAdd)) {
      return maxBudget + parseFloat(this.budgetToAdd);
    }
    return maxBudget;
  }

  @computed
  get isBonusBudgetCampaign(): boolean {
    const { campaign } = this;
    return campaign?.isBonusBudgetCampaign || false;
  }

  @computed
  get totalBudget(): number {
    const { flexibleBudgetEnabled, flexibleBudgetType } = this.props;
    if (this.isBonusBudgetCampaign) {
      const { campaign } = this;
      if (campaign) {
        return this.increasedBudget * (1 + campaign.bonusBudgetRate);
      }
    } else if (flexibleBudgetEnabled) {
      const flexibleBudget = new CampaignFlexibleBudgetHelper(
        this.increasedBudget,
        flexibleBudgetType
      );
      return flexibleBudget.getFinalSpend(false);
    }
    return this.increasedBudget;
  }

  @computed
  get campaignInfo() {
    if (!this.campaign) {
      return [];
    }
    const { maxAllowedSpending, campaignId, campaignName } = this.props;
    const currencyCode = this.campaign.localizedCurrency;

    return [
      {
        title: i`Maximum budget`,
        value: {
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.Ink,
          text: formatCurrency(maxAllowedSpending, currencyCode),
          link: null,
        },
      },
      {
        title: i`Total budget`,
        value: {
          fontWeight: fonts.weightSemibold,
          color: this.validBudget
            ? palettes.greens.CashGreen
            : palettes.textColors.Ink,
          text: formatCurrency(this.totalBudget, currencyCode),
          link: null,
        },
      },
      {
        title: i`Campaign ID`,
        value: {
          fontWeight: fonts.weightSemibold,
          color: palettes.coreColors.WishBlue,
          text: campaignId,
          link: `/product-boost/detail/${campaignId}`,
        },
      },
      {
        title: i`Campaign Name`,
        value: {
          fontWeight: fonts.weightMedium,
          color: palettes.textColors.Ink,
          text: campaignName,
          link: null,
        },
      },
    ];
  }

  @computed
  get doneButtonProps() {
    const { campaignId } = this.props;
    const navigationStore = NavigationStore.instance();

    return {
      text: i`Done`,
      onClick: () => {
        navigationStore.navigate(`/product-boost/detail/${campaignId}`);
      },
    };
  }

  @computed
  get updateButtonProps() {
    const { campaign } = this;
    if (!campaign) {
      return;
    }
    const {
      onCampaignUpdated,
      onUpdateAllowedSpending,
      onClose,
      campaignId,
      maxBudget,
    } = this.props;
    const change = this.budgetChanged || this.scheduledChanged;
    const validUpdate = change && this.validBudget && this.validScheduledBudget;
    return {
      style: this.isSmallScreen ? { flex: 1 } : null,
      isDisabled: !validUpdate,
      text: i`Update`,
      isLoading: this.actionButtonLoading,
      onClick: async () => {
        const toastStore = ToastStore.instance();
        const navigationStore = NavigationStore.instance();

        this.actionButtonLoading = true;
        const params: SaveRunningCampaignParams = {
          campaign_id: campaignId,
          max_budget: maxBudget + parseFloat(this.budgetToAdd),
          source: NewListCampaignPageSource,
          scheduled_add_budget_enabled:
            campaign.scheduledAddBudgetEnabled || false,
          scheduled_add_budget_days: campaign.scheduledAddBudgetDays || [],
          scheduled_add_budget_amount:
            parseFloat(campaign.scheduledAddBudgetAmount || "") || 0.0,
        };
        const response = await productBoostApi
          .saveRunningCampaign(params)
          .call();
        if (response.code === 0) {
          this.actionSucceed = true;
          //end of logging
          if (!this.isSmallScreen) {
            if (onCampaignUpdated) {
              onCampaignUpdated();
            }
            if (onUpdateAllowedSpending) {
              onUpdateAllowedSpending();
            } else {
              navigationStore.reload();
            }
            toastStore.positive(i`Budget was added successfully!`);
            if (onClose) {
              onClose();
            }
          }
        } else {
          if (response.msg) {
            toastStore.error(response.msg);
          }
          this.actionButtonLoading = false;
        }
      },
    };
  }

  @action
  setScheduledBudgetValidity = (isValid: boolean): void => {
    const { campaign } = this;
    if (!campaign || !campaign.scheduledAddBudgetDays) {
      return;
    }
    const enabledChanged =
      campaign.scheduledAddBudgetEnabled !== this.oldScheduledEnabled;
    const amountChanged =
      campaign.scheduledAddBudgetAmount !== this.oldScheduledAmount;
    let daysChanged =
      campaign.scheduledAddBudgetDays.length !== this.oldScheduledDays.length;
    if (!daysChanged) {
      const arr = campaign.scheduledAddBudgetDays.sort();
      arr.forEach((element, index) => {
        if (element !== this.oldScheduledDays[index]) {
          daysChanged = true;
        }
      });
    }
    this.scheduledChanged = enabledChanged || daysChanged || amountChanged;
    this.validScheduledBudget = isValid;
  };

  @computed
  get renderHeader() {
    const { onClose } = this.props;
    return (
      <div
        style={
          this.isSmallScreen
            ? { position: "fixed", top: 0, width: "100%" }
            : undefined
        }
      >
        <ModalHeader
          title={() => {
            return (
              <div style={{ fontSize: this.isSmallScreen ? 18 : 20 }}>
                Add budget to your campaign
              </div>
            );
          }}
          onClose={onClose}
        />
      </div>
    );
  }

  @computed
  get renderCampaignInfo() {
    let uniqueKey = 0;
    return (
      <div className={css(this.styles.campaignInfo)}>
        {this.campaignInfo.map((row, index) => {
          uniqueKey += 1;

          let value: ReactNode = row.value.text;
          if (row.value.link) {
            value = (
              <Link
                className={css(this.styles.link)}
                openInNewTab
                href={row.value.link}
              >
                {row.value.text}
              </Link>
            );
          }

          return (
            <div key={uniqueKey} className={css(this.styles.rowContainer)}>
              <Text weight="medium" className={css(this.styles.columnLeft)}>
                {row.title}
              </Text>
              <div
                className={css(this.styles.columnRight)}
                style={{
                  color: row.value.color,
                  fontWeight: row.value.fontWeight,
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  @computed
  get renderSuccessContent() {
    return (
      <div className={css(this.styles.successSection)}>
        <StaggeredFadeIn
          className={css(this.styles.successSectionInner)}
          animationDurationMs={400}
        >
          <StaggeredScaleIn animationDurationMs={800}>
            <img src={CheckMark} className={css(this.styles.successImage)} />
          </StaggeredScaleIn>

          <Text weight="bold" className={css(this.styles.successTitle)}>
            Budget updated successfully!
          </Text>
        </StaggeredFadeIn>
      </div>
    );
  }

  @computed
  get renderAddBudgetInput() {
    const { flexibleBudgetEnabled, flexibleBudgetType } = this.props;
    if (!this.campaign) {
      return <LoadingIndicator />;
    }
    const currencyCode = this.campaign.localizedCurrency;
    const showBonusBudget = this.campaign.isBonusBudgetCampaign;
    const { bonusBudgetRate, bonusBudgetType } = this.campaign;

    return (
      <div className={css(this.styles.addBudget)}>
        <Text weight="medium" className={css(this.styles.addBudgetTitle)}>
          How much budget would you like to add?
        </Text>
        <Text weight="medium" className={css(this.styles.addBudgetSubTitle)}>
          Please note that your total budget cannot exceed your maximum budget.
        </Text>
        <div className={css(this.styles.addBudgetInput)}>
          <CurrencyInput
            currencyCode={currencyCode}
            value={this.budgetToAdd}
            validators={[this.addBudgetValidator]}
            onChange={({ text, textAsNumber }: OnTextChangeEvent) => {
              this.budgetChanged = textAsNumber !== 0;
              this.budgetToAdd = text;
            }}
            onValidityChanged={(
              isValid: boolean,
              errorMessage: string | null | undefined
            ) => {
              this.validBudget = isValid;
            }}
          />
          {flexibleBudgetEnabled && (
            <Info
              text={() => {
                return (
                  <FlexibleBudgetForm
                    merchantBudget={this.increasedBudget.toString()}
                    localizedCurrency={currencyCode}
                    edit={false}
                    flexibleBudgetType={flexibleBudgetType}
                  />
                );
              }}
              popoverMaxWidth={200}
              sentiment="success"
              className={css(this.styles.flexibleBudgetInfo)}
            />
          )}
          {showBonusBudget && (
            <Info
              text={() => {
                return (
                  <BonusBudgetForm
                    merchantBudget={this.budgetToAdd}
                    localizedCurrency={currencyCode}
                    bonusBudgetRate={bonusBudgetRate}
                    bonusBudgetType={bonusBudgetType}
                    showPromoMessage
                    style={{ maxWidth: 700 }}
                  />
                );
              }}
              sentiment="success"
              className={css(this.styles.flexibleBudgetInfo)}
            />
          )}
        </div>
      </div>
    );
  }

  @computed
  get renderInputContent() {
    const { campaign } = this;
    if (!campaign) {
      return null;
    }

    const { isPayable, maxAllowedSpending, maxSpendingBreakdown } = this.props;
    return (
      <div>
        {this.renderAddBudgetInput}
        <div className={css(this.styles.checkboxField)}>
          <ScheduledBudgetCheckbox
            campaign={campaign}
            setValidity={this.setScheduledBudgetValidity}
          />
        </div>
        {campaign.scheduledAddBudgetEnabled && (
          <ScheduledBudgetForm
            campaign={campaign}
            setValidity={this.setScheduledBudgetValidity}
          />
        )}
        {this.renderCampaignInfo}
        <div className={css(this.styles.budgetBreakDownTable)}>
          <BudgetBreakDownTable
            maxAllowedSpending={maxAllowedSpending}
            maxSpendingBreakdown={maxSpendingBreakdown}
            isPayable={isPayable}
            expended={this.isSmallScreen}
          />
        </div>
      </div>
    );
  }

  @computed
  get renderFooter() {
    const { onClose } = this.props;
    return (
      <div
        style={
          this.isSmallScreen
            ? { position: "fixed", bottom: 0, width: "100%" }
            : undefined
        }
      >
        <ModalFooter
          layout={this.isSmallScreen ? "vertical" : "horizontal"}
          action={
            this.actionSucceed ? this.doneButtonProps : this.updateButtonProps
          }
          cancel={
            this.isSmallScreen
              ? null
              : {
                  disabled: this.actionButtonLoading,
                  children: i`Close`,
                  onClick: () => {
                    if (onClose) {
                      onClose();
                    }
                  },
                }
          }
        />
      </div>
    );
  }

  render() {
    return (
      <div className={css(this.styles.root)}>
        {this.renderHeader}
        {this.actionSucceed
          ? this.renderSuccessContent
          : this.renderInputContent}
        {this.renderFooter}
      </div>
    );
  }
}
export default AddBudgetModalContent;
