import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import numeral from "numeral";
import moment from "moment/moment";

/* Lego Components */
import {
  Line,
  XAxis,
  YAxis,
  Popover,
  LineChart,
  FilterButton,
  CartesianGrid,
  ReferenceArea,
  RechartsTooltip,
  DayRangePickerInput,
} from "@ContextLogic/lego";

/* Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import {
  formatCurrency,
  getCurrencySymbol,
} from "@ContextLogic/lego/toolkit/currency";
import {
  impressionIcon,
  paidImpressionIcon,
  maxBoostImpressionIcon,
  orderIcon,
  dollarIcon,
  calendarIcon,
} from "@assets/illustrations";
import { weightBold } from "@toolkit/fonts";

/* Merchant Components */
import LineChartMetric from "@merchant/component/product-boost/campaign-detail/LineChartMetric";
import CampaignPerformanceFilter from "@merchant/component/product-boost/campaign-detail/CampaignPerformanceFilter";
import ProductImage from "@merchant/component/products/ProductImage";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";
import CampaignPerformanceFilterSetting from "@merchant/model/product-boost/CampaignPerformanceFilterSetting";

/* Toolkit */
import { CampaignPerformanceStats } from "@toolkit/product-boost/utils/campaign-stats";
import { ProductBoostCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { CampaignDetailStats } from "@merchant/api/product-boost";
import {
  PerformanceDailyStats,
  PerformanceStats,
} from "@toolkit/product-boost/utils/campaign-stats";
import { CurrencyCode } from "@toolkit/currency";
import { LineChartSubMetric } from "@merchant/component/products/price-drop/LineChartMetric";
import { TooltipPayload } from "recharts";

type PerformanceSectionGraphProps = BaseProps;

const PerformanceFilterWidth = 430;

@observer
class PerformanceSectionGraph extends Component<PerformanceSectionGraphProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      graphTopControl: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-between",
        margin: "0px 24px 9px 25px",
        backgroundColor: palettes.textColors.White,
      },
      filterContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        overflow: "hidden",
        alignItems: "stretch",
        justifyContent: "center",
        padding: "9px 0px 10px 4px",
      },
      filterText: {
        height: 28,
        minWidth: 97,
        fontSize: 20,
        fontColor: palettes.textColors.Ink,
        fontWeight: weightBold,
        padding: "36px 25px 36px 20px",
      },
      filterImage: {
        display: "flex",
        width: 70,
        height: 70,
        padding: "15px 15px 15px 0px",
      },
      graphRangePicker: {
        visibility: "collapse",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      filterProductButton: {
        alignSelf: "flex-end",
      },
      performanceFilter: {
        width: PerformanceFilterWidth,
      },
      graph: {
        height: "350px",
      },
      graphMetrics: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "25px 0px 25px 25px",
      },
      graphMetric: {
        margin: "0px 25px 0px 0px",
        flex: 1,
      },
    });
  }

  @computed
  get campaign(): Campaign | null | undefined {
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
  get performanceFilter(): CampaignPerformanceFilterSetting {
    const { productBoostStore } = AppStore.instance();
    return productBoostStore.campaignsPerformanceFilters;
  }

  @computed
  get filteredIds(): ReadonlyArray<string> {
    return this.performanceFilter.productIds;
  }

  @computed
  get campaignPerformanceStats() {
    const {
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      startDate,
      endDate,
      filteredIds,
    } = this;
    return new CampaignPerformanceStats({
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      startDate,
      endDate,
      productIds: filteredIds,
    });
  }

  @computed
  get dailyStats(): ReadonlyArray<PerformanceDailyStats> {
    const { campaignPerformanceStats } = this;
    return campaignPerformanceStats.getDailyStats();
  }

  @computed
  get cumulativeStats(): PerformanceStats {
    const { campaignPerformanceStats } = this;
    return campaignPerformanceStats.getCumulativeStats();
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
  get totalCampaignPaidImpressions(): string {
    const { campaignStats, cumulativeStats } = this;
    if (campaignStats != null) {
      const paidImpressions = cumulativeStats.paid_impressions;
      if (paidImpressions != null) {
        return numeral(paidImpressions).format("0,0");
      }
    }
    return i`No data`;
  }

  @computed
  get totalCampaignMaxBoostImpressions(): string {
    const { campaignStats, cumulativeStats } = this;
    if (campaignStats != null) {
      const maxBoostImpressions = cumulativeStats.external_impressions;
      if (maxBoostImpressions != null) {
        return numeral(maxBoostImpressions).format("0,0");
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
    const { campaignStats, cumulativeStats, localizedCurrency } = this;
    if (campaignStats != null) {
      const { gmv } = cumulativeStats;
      if (gmv != null) {
        return formatCurrency(gmv, localizedCurrency);
      }
    }
    return i`No data`;
  }

  @computed
  get showFilterButton(): boolean {
    const { campaign } = this;
    return !(
      campaign == null ||
      campaign.products == null ||
      campaign.products.length <= 1
    );
  }

  @computed
  get renderPerformanceFilterSelection() {
    const { performanceFilter } = this;
    const { hasActiveFilters } = performanceFilter;
    if (!hasActiveFilters) {
      return <div className={css(this.styles.filterContainer)} />;
    }
    const { filteredIds } = this;
    return (
      <div className={css(this.styles.filterContainer)}>
        <div className={css(this.styles.filterText)}>Filtered by</div>
        {filteredIds.map((id) => (
          <ProductImage
            key={`performance_filter_selection_${id}`}
            className={css(this.styles.filterImage)}
            productId={id}
          />
        ))}
      </div>
    );
  }

  @computed
  get dataStartDate() {
    return moment(this.startDate).subtract(7, "d");
  }

  @computed
  get dataEndDate() {
    return moment(this.endDate).add(6, "d");
  }

  @computed
  get renderGraphRangePicker() {
    const { startDate, endDate } = this;
    const dataStartDate = this.dataStartDate.toDate();
    const dataEndDate = this.dataEndDate.toDate();
    return (
      <div className={css(this.styles.graphRangePicker)}>
        {startDate != null && endDate != null && (
          <DayRangePickerInput
            noEdit
            disabled
            onDayRangeChange={() => {}}
            dayPickerProps={{
              disabledDays: [
                {
                  before: dataStartDate,
                },
                {
                  after: dataEndDate,
                },
              ],
            }}
            fromDate={dataStartDate}
            toDate={dataEndDate}
          />
        )}
      </div>
    );
  }

  @computed
  get renderCampaignPerformanceFilter() {
    const { performanceFilter } = this;
    const { hasActiveFilters } = performanceFilter;
    return (
      <Popover
        position="bottom right"
        on="click"
        contentWidth={PerformanceFilterWidth}
        popoverContent={() => (
          <CampaignPerformanceFilter
            className={css(this.styles.performanceFilter)}
          />
        )}
      >
        <FilterButton
          style={[
            this.styles.filterProductButton,
            {
              textColor: hasActiveFilters
                ? palettes.coreColors.WishBlue
                : palettes.textColors.Ink,
            },
          ]}
          isActive={hasActiveFilters}
          borderColor={
            hasActiveFilters
              ? palettes.coreColors.WishBlue
              : palettes.greyScaleColors.DarkGrey
          }
        >
          Filter by product
        </FilterButton>
      </Popover>
    );
  }

  @computed
  get renderGraphTopBar() {
    const { showFilterButton } = this;
    if (!showFilterButton) {
      return null;
    }
    return (
      <>
        {this.renderPerformanceFilterSelection}
        <div className={css(this.styles.graphTopControl)}>
          {this.renderGraphRangePicker}
          {this.renderCampaignPerformanceFilter}
        </div>
      </>
    );
  }

  @computed
  get renderGraphMetrics() {
    const {
      totalCampaignImpressions,
      totalCampaignPaidImpressions,
      totalCampaignMaxBoostImpressions,
      totalCampaignOrders,
      totalCampaignGMV,
      isSimpleBoost,
      isMaxBoost,
    } = this;
    const impressionSubMetric: LineChartSubMetric[] = [];
    if (!isSimpleBoost) {
      impressionSubMetric.push({
        title: i`Sponsored`,
        content: totalCampaignPaidImpressions,
        color: palettes.coreColors.WishBlue,
        strokeDasharray: "4 4",
        icon: "paidImpressionIcon",
      });
    }
    if (!isSimpleBoost && isMaxBoost) {
      impressionSubMetric.push({
        title: i`MaxBoost`,
        content: totalCampaignMaxBoostImpressions,
        color: "#a7228d",
        strokeDasharray: "8 4",
        icon: "maxBoostImpressionIcon",
      });
    }
    return (
      <div className={css(this.styles.graphMetrics)}>
        <LineChartMetric
          className={css(this.styles.graphMetric)}
          icon="impressionIcon"
          color={palettes.coreColors.WishBlue}
          title={i`Impressions`}
          subMetric={impressionSubMetric}
          popoverContent={ProductBoostCampaignExplanations.TOTAL_IMPRESSIONS}
        >
          {totalCampaignImpressions}
        </LineChartMetric>
        <LineChartMetric
          className={css(this.styles.graphMetric)}
          color={palettes.purples.DarkPurple}
          strokeDasharray="4"
          icon="orderIcon"
          title={i`Orders`}
          popoverContent={ProductBoostCampaignExplanations.SALES}
        >
          {totalCampaignOrders}
        </LineChartMetric>
        <LineChartMetric
          className={css(this.styles.graphMetric)}
          color={palettes.cyans.Cyan}
          strokeDasharray="1"
          icon="dollarIcon"
          title={i`GMV`}
          popoverContent={ProductBoostCampaignExplanations.GMV}
        >
          {totalCampaignGMV}
        </LineChartMetric>
      </div>
    );
  }

  tooltipImageFormatter(name: string | number) {
    switch (name) {
      case "impressions":
        return impressionIcon;
      case "paid_impressions":
        return paidImpressionIcon;
      case "external_impressions":
        return maxBoostImpressionIcon;
      case "sales":
        return orderIcon;
      case "gmv":
        return dollarIcon;
      case "date":
        return calendarIcon;
      default:
        return null;
    }
  }

  // Disabled to satisfy recharts API
  // eslint-disable-next-line local-rules/no-large-method-params
  tooltipFormatter(
    value: string | number | Array<string | number>,
    name: string,
    entry: TooltipPayload,
    index: number
  ): React.ReactNode {
    if (name === "gmv") {
      if (typeof value === "number") {
        return formatCurrency(value);
      }
    } else if (name === "date") {
      return value;
    }
    return numeral(value).format("0,0");
  }

  @computed
  get renderGraph() {
    const {
      dailyStats,
      formatTickThousand,
      formatTickThousandCurrency,
      isMaxBoost,
      isSimpleBoost,
      tooltipImageFormatter,
      tooltipFormatter,
      startDate,
      endDate,
      dataStartDate,
      dataEndDate,
    } = this;
    return (
      <div className={css(this.styles.graph)}>
        <LineChart data={dailyStats}>
          <CartesianGrid vertical horizontal />
          <ReferenceArea
            x1={dataStartDate.format("M/D")}
            x2={startDate ? startDate.format("M/D") : ""}
            fill="#afc7d1"
            fillOpacity={0.1}
            xAxisId={0}
            yAxisId={i`Impressions`}
          />
          <ReferenceArea
            x1={endDate ? endDate.format("M/D") : ""}
            x2={dataEndDate.format("M/D")}
            fill="#afc7d1"
            fillOpacity={0.1}
            xAxisId={0}
            yAxisId={i`Impressions`}
          />
          <XAxis dataKey="date" />
          <RechartsTooltip
            imageFormatter={tooltipImageFormatter}
            formatter={tooltipFormatter}
            payloadFormatter={(payload) => {
              if (payload && payload.length && payload[0]) {
                const value = payload[0].payload.date;
                return [
                  {
                    name: "date",
                    value,
                    color: "#EF8D2E",
                  },
                  ...payload,
                ];
              }
              return payload;
            }}
          />
          <YAxis
            yAxisId={i`Impressions`}
            dataKey="impressions"
            orientation="left"
            tickCount={10}
            tickFormatter={formatTickThousand}
            type="number"
            stroke={palettes.coreColors.WishBlue}
          />
          <Line
            yAxisId={i`Impressions`}
            dataKey="impressions"
            strokeWidth={4}
            stroke={palettes.coreColors.WishBlue}
          />
          {!isSimpleBoost && (
            <Line
              yAxisId={i`Impressions`}
              dataKey="paid_impressions"
              strokeWidth={4}
              strokeDasharray="4 4"
              stroke={palettes.coreColors.WishBlue}
            />
          )}
          {!isSimpleBoost && isMaxBoost && (
            <Line
              yAxisId={i`Impressions`}
              dataKey="external_impressions"
              strokeWidth={4}
              strokeDasharray="8 4"
              stroke="#a7228d"
            />
          )}
          <YAxis
            yAxisId={i`Orders`}
            dataKey="sales"
            orientation="right"
            dx={25}
            tickCount={10}
            tickFormatter={formatTickThousand}
            type="number"
            stroke={palettes.purples.DarkPurple}
          />
          <Line
            yAxisId={i`Orders`}
            dataKey="sales"
            strokeWidth={4}
            type="linear"
            strokeDasharray="4 4"
            stroke={palettes.purples.DarkPurple}
          />
          <YAxis
            yAxisId={i`GMV`}
            dataKey="gmv"
            orientation="right"
            tickCount={10}
            tickFormatter={formatTickThousandCurrency}
            type="number"
            stroke={palettes.cyans.Cyan}
          />
          <Line
            yAxisId={i`GMV`}
            dataKey="gmv"
            strokeWidth={4}
            strokeDasharray="1 1"
            stroke={palettes.cyans.Cyan}
          />
        </LineChart>
      </div>
    );
  }

  formatTickThousand(value: string | number) {
    return numeral(value).format("0a");
  }

  formatTickThousandCurrency = (value: string | number) => {
    if (typeof value === "number") {
      const { localizedCurrency } = this;
      const currencySymbol = getCurrencySymbol(localizedCurrency);
      return currencySymbol + numeral(value).format("0a");
    }
    return value;
  };

  render() {
    const { renderGraphMetrics, renderGraph, renderGraphTopBar } = this;

    return (
      <div className={css(this.styles.root)}>
        {renderGraphTopBar}
        {renderGraphMetrics}
        {renderGraph}
      </div>
    );
  }
}

export default PerformanceSectionGraph;
