import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import numeral from "numeral";
import moment from "moment/moment";

/* Lego Components */
import { IllustratedMetric } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import PerformanceSectionGraph from "@merchant/component/product-boost/campaign-detail/PerformanceSectionGraph";
import PerformanceSectionTable from "@merchant/component/product-boost/campaign-detail/PerformanceSectionTable";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import { BonusBudgetPromotionExplanations } from "@toolkit/product-boost/resources/bonus-budget-tooltip";
import { CampaignPerformanceStats } from "@toolkit/product-boost/utils/campaign-stats";
import { ProductBoostCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { CampaignDetailStats } from "@merchant/api/product-boost";
import { PerformanceStats } from "@toolkit/product-boost/utils/campaign-stats";
import { CurrencyCode } from "@toolkit/currency";

type PerformanceSectionProps = BaseProps;

@observer
class PerformanceSection extends Component<PerformanceSectionProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      metricsCard: {},
      metricsSection: {
        display: "flex",
        flexDirection: "row",
        // When the screen gets too small, wrap the
        // content around and potentially align them vertically
        flexWrap: "wrap",
        backgroundColor: palettes.textColors.White,
      },
      performanceMetric: {
        margin: "24px 24px 24px 24px",
        padding: "0px 50px",
      },
      graphTableCard: {
        margin: "50px 0px 0px 0px",
      },
      graphTableSection: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: palettes.textColors.White,
      },
    });
  }

  @computed
  get campaign(): CampaignModel | null | undefined {
    const { productBoostStore } = AppStore.instance();
    return productBoostStore.currentCampaign;
  }

  @computed
  get campaignStats(): CampaignDetailStats | null | undefined {
    const { productBoostStore } = AppStore.instance();
    return productBoostStore.currentPerformanceStats;
  }

  @computed
  get isSimpleBoost(): boolean {
    const { campaign } = this;
    if (campaign != null && campaign.isV2 != null) {
      return campaign.isV2;
    }
    return false;
  }

  @computed
  get isMaxBoost(): boolean {
    const { campaign } = this;
    if (campaign != null && campaign.hasMaxboostProduct != null) {
      return campaign.hasMaxboostProduct;
    }
    return false;
  }

  @computed
  get isBonusBudgetCampaign(): boolean {
    const { campaign } = this;
    if (campaign != null) {
      return campaign.isBonusBudgetCampaign;
    }
    return false;
  }

  @computed
  get bonusBudgetRate(): number {
    const { campaign } = this;
    if (campaign != null) {
      return campaign.bonusBudgetRate;
    }
    return 0;
  }

  @computed
  get startDate() {
    const { campaign } = this;
    if (campaign?.startDate != null) {
      return moment(campaign.startDate);
    }
  }

  @computed
  get endDate() {
    const { campaign } = this;
    if (campaign?.endDate != null) {
      return moment(campaign.endDate);
    }
  }

  @computed
  get localizedCurrency(): CurrencyCode {
    const { campaign } = this;
    return campaign?.localizedCurrency || "USD";
  }

  @computed
  get campaignPerformanceStats() {
    const {
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      startDate,
      endDate,
    } = this;
    return new CampaignPerformanceStats({
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      startDate,
      endDate,
    });
  }

  @computed
  get cumulativeStats(): PerformanceStats {
    const { campaignPerformanceStats } = this;
    return campaignPerformanceStats.getCumulativeStats();
  }

  @computed
  get totalCampaignSpend(): string {
    const { campaignStats, cumulativeStats, localizedCurrency } = this;
    if (campaignStats != null) {
      const { spend } = cumulativeStats;
      if (spend != null) {
        return formatCurrency(spend, localizedCurrency);
      }
    }
    return i`No data`;
  }

  @computed
  get totalBonusBudgetSpend(): string {
    const {
      campaignStats,
      cumulativeStats,
      localizedCurrency,
      bonusBudgetRate,
    } = this;
    if (campaignStats != null) {
      const { spend } = cumulativeStats;
      if (spend != null) {
        const bonusBudgetSpend =
          (spend / (1 + bonusBudgetRate)) * bonusBudgetRate;
        return formatCurrency(bonusBudgetSpend, localizedCurrency);
      }
    }
    return i`No data`;
  }

  @computed
  get totalMaxBoostSpend(): string {
    const { isMaxBoost, cumulativeStats, localizedCurrency } = this;
    const spend = cumulativeStats.external_spend;
    if (isMaxBoost && spend != null) {
      return formatCurrency(spend, localizedCurrency);
    }
    return i`No data`;
  }

  @computed
  get spendOverGMV(): string {
    const { campaignStats, cumulativeStats } = this;
    if (campaignStats != null) {
      const { gmv, spend } = cumulativeStats;
      if (gmv != null && spend != null && gmv !== 0) {
        return numeral(spend / gmv).format("0.00%");
      }
    }
    return i`No data`;
  }

  @computed
  get totalCampaignImpressions(): string {
    const { campaignStats, cumulativeStats } = this;
    if (campaignStats != null) {
      const { impressions } = cumulativeStats;
      if (impressions != null) {
        return numeral(impressions).format("0,0");
      }
    }
    return i`No data`;
  }

  @computed
  get totalCampaignOrders(): string {
    const { campaignStats, cumulativeStats } = this;
    if (campaignStats != null) {
      const { sales } = cumulativeStats;
      if (sales != null) {
        return numeral(sales).format("0,0");
      }
    }
    return i`No data`;
  }

  @computed
  get totalCampaignGMV(): string {
    const { campaignStats, cumulativeStats } = this;
    if (campaignStats != null) {
      const { gmv } = cumulativeStats;
      if (gmv != null) {
        return formatCurrency(gmv);
      }
    }
    return i`No data`;
  }

  @computed
  get renderMetrics() {
    const {
      totalCampaignSpend,
      totalMaxBoostSpend,
      spendOverGMV,
      totalBonusBudgetSpend,
      isBonusBudgetCampaign,
    } = this;
    return (
      <>
        <IllustratedMetric
          className={css(this.styles.performanceMetric)}
          illustration="productBoostCampaignSpend"
          title={i`Total Spend`}
          popoverContent={ProductBoostCampaignExplanations.SPEND}
        >
          {totalCampaignSpend}
        </IllustratedMetric>
        {isBonusBudgetCampaign && (
          <IllustratedMetric
            className={css(this.styles.performanceMetric)}
            illustration="productBoostBonusBudget"
            title={i`Total Bonus Budget Spend`}
            popoverContent={
              BonusBudgetPromotionExplanations.BONUS_BUDGET_DEFINITION
            }
          >
            {totalBonusBudgetSpend}
          </IllustratedMetric>
        )}
        {this.isMaxBoost && (
          <IllustratedMetric
            className={css(this.styles.performanceMetric)}
            illustration="productBoostMaxBoost"
            title={i`MaxBoost Spend`}
            popoverContent={ProductBoostCampaignExplanations.EXTERNAL_SPEND}
          >
            {totalMaxBoostSpend}
          </IllustratedMetric>
        )}
        <IllustratedMetric
          className={css(this.styles.performanceMetric)}
          illustration="productBoostSpendToGMV"
          title={i`Spend / GMV`}
          popoverContent={ProductBoostCampaignExplanations.SPEND_OVER_GMV}
        >
          {spendOverGMV}
        </IllustratedMetric>
      </>
    );
  }

  render() {
    const { renderMetrics } = this;

    return (
      <div className={css(this.styles.root)}>
        <Card
          className={css(this.styles.metricsCard)}
          contentContainerStyle={css(this.styles.metricsSection)}
        >
          {renderMetrics}
        </Card>
        <Card
          className={css(this.styles.graphTableCard)}
          contentContainerStyle={css(this.styles.graphTableSection)}
        >
          <PerformanceSectionGraph />
          <PerformanceSectionTable />
        </Card>
      </div>
    );
  }
}
export default PerformanceSection;
