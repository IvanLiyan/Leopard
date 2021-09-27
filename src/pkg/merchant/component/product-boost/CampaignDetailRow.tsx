import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { ObjectId } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { ProductBoostCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

/* Merchant Components */
import CampaignTrainingProcess from "@merchant/component/product-boost/CampaignTrainingProcess";
import ProductsTable from "@merchant/component/product-boost/ProductsTable";
import CampaignDiscountIndicator from "@merchant/component/product-boost/CampaignDiscountIndicator";

/* Merchant API */
import { getProductBoostCampaignProductStats } from "@merchant/api/product-boost";
import { Campaign } from "@merchant/api/product-boost";
import { CampaignProductStatsEntry } from "@merchant/api/product-boost";

/* Type Imports */
import { CurrencyCode } from "@toolkit/currency";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { ThemeContext } from "@merchant/stores/ThemeStore";

export type CampaignDetailRowProps = BaseProps & {
  readonly campaign: Campaign;
};

@observer
class CampaignDetailRow extends Component<CampaignDetailRowProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  tooltips = {
    sales: ProductBoostCampaignExplanations.SALES,
    capped_paid_impressions: ProductBoostCampaignExplanations.PAID_IMPRESSIONS,
  };

  @computed
  get styles() {
    const { textBlack } = this.context;
    return StyleSheet.create({
      root: {
        display: "block",
      },
      content: {
        margin: "24px 24px 0px 24px",
      },
      table: {
        backgroundColor: palettes.textColors.White,
        width: "100%",
        border: `1px solid ${palettes.greyScaleColors.DarkGrey}`,
      },
      cell: {
        width: "50%",
      },
      cellBorder: {
        border: `1px solid ${palettes.greyScaleColors.DarkGrey}`,
      },
      noCellBorder: {
        border: "none",
      },
      detailRow: {
        display: "flex",
        flexDirection: "column",
        background: "#F6F8F9",
      },
      container: {
        display: "flex",
        height: 48,
        alignContent: "center",
      },
      column: {
        flex: "50%",
        alignContent: "center",
      },
      text: {
        fontSize: 14,
        fontWidth: fonts.weightNormal,
        lineHeight: 1.43,
        color: textBlack,
      },
      titleText: {
        fontSize: 16,
        fontWidth: fonts.weightSemibold,
        lineHeight: 1.25,
        color: palettes.textColors.DarkInk,
        top: "30%",
        left: "6%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      valueText: {
        verticalAlign: "middle",
        top: "30%",
        left: "6%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      campaignIdText: {
        verticalAlign: "middle",
        top: "10%",
        left: "6%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      campaignNameText: {
        verticalAlign: "middle",
        top: "30%",
        left: "6%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        maxWidth: "90%",
      },
      campaignNameSection: {
        maxWidth: 300,
      },
      tab: {
        marginLeft: 4,
      },
      budgetDiscountRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      },
    });
  }

  @computed
  get currency(): CurrencyCode {
    const { campaign } = this.props;
    return campaign.localized_currency || "USD";
  }

  renderDays(days: ReadonlyArray<number>) {
    const numberToDays = new Map([
      [0, i`Monday`],
      [1, i`Tuesday`],
      [2, i`Wednesday`],
      [3, i`Thursday`],
      [4, i`Friday`],
      [5, i`Saturday`],
      [6, i`Sunday`],
    ]);
    const daysString = days.map((d) => numberToDays.get(d));
    return daysString.join(", ");
  }

  get renderScheduledAddBudget() {
    const { campaign } = this.props;
    const { currency } = this;
    const enabled = campaign.scheduled_add_budget_enabled;
    const scheduledAddBudgetAmount = Number(
      campaign.scheduled_add_budget_amount
    );
    const amount = campaign.is_bonus_budget_campaign
      ? (1 + campaign.bonus_budget_rate) * scheduledAddBudgetAmount
      : scheduledAddBudgetAmount;
    const days = campaign.scheduled_add_budget_days;

    if (!enabled) {
      return (
        <div className={css(this.styles.text)}>
          This campaign is not scheduled to add budget automatically.
        </div>
      );
    }
    return (
      <div className={css(this.styles.text)}>
        This campaign is scheduled to add
        {formatCurrency(amount, currency)} of budget on every
        {this.renderDays(days)} Pacific time.
      </div>
    );
  }

  get renderBonusBudget() {
    const { campaign } = this.props;
    const msg =
      i`The initial budget you set is ${formatCurrency(
        campaign.merchant_budget,
        campaign.localized_currency
      )}, and Wish granted you ` +
      i`additional ${formatCurrency(
        campaign.localized_bonus_budget,
        campaign.localized_currency
      )} as bonus budget.`;
    return (
      <div className={css(this.styles.text, this.styles.content)}>{msg}</div>
    );
  }

  get renderAddBugetAndDiscountIndicator() {
    const { campaign } = this.props;
    if (campaign.source === 5 && campaign.discount_factor) {
      const discountFactor = campaign.discount_factor || 0;
      return (
        <div
          className={css(this.styles.budgetDiscountRow, this.styles.content)}
        >
          {this.renderScheduledAddBudget}
          <CampaignDiscountIndicator
            style={{ borderRadius: 16 }}
            fontSize={16}
            discount={discountFactor}
          />
        </div>
      );
    }
    return (
      <div className={css(this.styles.content)}>
        {this.renderScheduledAddBudget}
      </div>
    );
  }

  get renderMinSpend() {
    const { campaign } = this.props;
    const { min_spend: minSpend } = campaign;
    const { currency } = this;
    if (minSpend != null && minSpend >= 0.01) {
      return (
        <div className={css(this.styles.text, this.styles.content)}>
          This campaign has minimum spending. The current estimated minimum
          spend for this campaign is
          {formatCurrency(minSpend, currency)}
        </div>
      );
    }
    return null;
  }

  get renderIntenseBoost() {
    const { campaign } = this.props;
    const { intense_boost: intenseBoost } = campaign;
    if (intenseBoost) {
      return (
        <div className={css(this.styles.text, this.styles.content)}>
          Intense Boost is enabled for this campaign.
        </div>
      );
    }
    return null;
  }

  getTooltip(key: string): string | null | undefined {
    // if you find this please fix the any types (legacy)
    return (this.tooltips as any)[key];
  }

  renderToolTip(key: string) {
    const tooltip = this.getTooltip(key);
    if (!tooltip) {
      return null;
    }
    return (
      <Info
        className={css(this.styles.tab)}
        text={tooltip}
        position={"bottom center"}
        popoverMaxWidth={360}
      />
    );
  }

  get renderCampaignId() {
    const { campaign } = this.props;
    return (
      <div className={css(this.styles.campaignIdText, this.styles.text)}>
        <ObjectId id={campaign.campaign_id} showFull copyOnBodyClick />
      </div>
    );
  }

  get renderCampaignName() {
    const { campaign } = this.props;
    return (
      <div className={css(this.styles.campaignNameText, this.styles.text)}>
        <CopyButton
          text={campaign.campaign_name}
          copyOnBodyClick
          className={css(this.styles.campaignNameSection)}
        >
          {campaign.campaign_name}
        </CopyButton>
      </div>
    );
  }

  get renderProductCount() {
    const { campaign } = this.props;
    return (
      <div className={css(this.styles.valueText, this.styles.text)}>
        {campaign.products.length}
      </div>
    );
  }

  get renderPaidImpressions() {
    const { campaign } = this.props;
    const paidImpressions = campaign.capped_paid_impressions || i`No data`;
    return (
      <div className={css(this.styles.valueText, this.styles.text)}>
        {paidImpressions}
        {this.renderToolTip("capped_paid_impressions")}
      </div>
    );
  }

  get renderTrainingProgress() {
    const { campaign } = this.props;
    return (
      <div className={css(this.styles.valueText, this.styles.text)}>
        <CampaignTrainingProcess
          trainingProgress={campaign.training_progress}
        />
      </div>
    );
  }

  get renderExtraStat() {
    const { campaign } = this.props;
    let component: ReactNode = null;
    if (campaign.training_progress && campaign.training_progress !== -1) {
      component = this.renderStats(
        i`Training Progress`,
        this.renderTrainingProgress
      );
    } else if (!campaign.is_v2) {
      component = this.renderStats(
        i`Total Paid Impressions`,
        this.renderPaidImpressions
      );
    }
    const borderStyle = component
      ? this.styles.cellBorder
      : this.styles.noCellBorder;

    return <td className={css(borderStyle, this.styles.cell)}>{component}</td>;
  }

  renderStats(title: string, component: ReactNode) {
    return (
      <div className={css(this.styles.container)}>
        <div className={css(this.styles.column)}>
          <div className={css(this.styles.titleText)}>{title}</div>
        </div>
        <div className={css(this.styles.column)}>{component}</div>
      </div>
    );
  }

  @computed
  get renderTable() {
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.content)}>
          <table className={css(this.styles.table)}>
            <tbody>
              <tr>
                <td className={css(this.styles.cellBorder, this.styles.cell)}>
                  {this.renderStats(i`Campaign Name`, this.renderCampaignName)}
                </td>
                <td className={css(this.styles.cellBorder, this.styles.cell)}>
                  {this.renderStats(i`Campaign ID`, this.renderCampaignId)}
                </td>
              </tr>
              <tr>
                <td className={css(this.styles.noCellBorder, this.styles.cell)}>
                  {this.renderStats(i`Total Products`, this.renderProductCount)}
                </td>
                {this.renderExtraStat}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  @computed
  get request() {
    const { campaign } = this.props;
    return getProductBoostCampaignProductStats({
      campaign_id: campaign.campaign_id,
    });
  }

  @computed
  get aggregateData(): ReadonlyArray<CampaignProductStatsEntry> {
    return this.request?.response?.data?.aggregate_data || [];
  }

  @computed
  get finishedLoadingAPI(): boolean {
    const { request } = this;
    return request?.isSuccessful === true;
  }

  @computed
  get renderProductsTable() {
    const { campaign } = this.props;
    const { aggregateData, currency } = this;
    return (
      <ProductsTable
        aggregateData={aggregateData}
        campaignId={campaign.campaign_id}
        isV2={campaign.is_v2}
        currency={currency}
        noDataMessage={undefined}
      />
    );
  }

  @computed
  get isBonusBudgetCampaign() {
    const { campaign } = this.props;
    return campaign.is_bonus_budget_campaign;
  }

  render() {
    const { finishedLoadingAPI, isBonusBudgetCampaign } = this;
    return (
      <div className={css(this.styles.detailRow)}>
        {isBonusBudgetCampaign && this.renderBonusBudget}
        {this.renderAddBugetAndDiscountIndicator}
        {this.renderMinSpend}
        {this.renderIntenseBoost}
        {this.renderTable}
        <LoadingIndicator loadingComplete={finishedLoadingAPI}>
          {this.renderProductsTable}
        </LoadingIndicator>
      </div>
    );
  }
}
export default CampaignDetailRow;
