import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import moment from "moment/moment";
import queryString from "query-string";

/* Lego Components */
import { CellInfo, TextInput } from "@ContextLogic/lego";
import { DownloadButton } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant Model */
import CampaignModel from "@merchant/model/product-boost/Campaign";
import CampaignPerformanceFilterSetting from "@merchant/model/product-boost/CampaignPerformanceFilterSetting";

/* Toolkit */
import { BonusBudgetPromotionExplanations } from "@toolkit/product-boost/resources/bonus-budget-tooltip";
import { CampaignPerformanceStats } from "@toolkit/product-boost/utils/campaign-stats";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  CampaignDetailStats,
  CampaignDetailByDateStats,
} from "@merchant/api/product-boost";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { PerformanceDailyStats } from "@toolkit/product-boost/utils/campaign-stats";
import { DataRow } from "@ContextLogic/lego";
import { CurrencyCode } from "@toolkit/currency";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

type PerformanceSectionTableProps = BaseProps;

type SectionKey = "BEFORE_CAMPAIGN" | "DURING_CAMPAIGN" | "AFTER_CAMPAIGN";

@observer
class PerformanceSectionTable extends Component<PerformanceSectionTableProps> {
  @observable
  expandedRowBeforeCampaignStarts: Map<number, boolean> = new Map();

  @observable
  expandedRowCampaignInProgress: Map<number, boolean> = new Map();

  @observable
  expandedRowAfterCampaignEnds: Map<number, boolean> = new Map();

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      tableTopControl: {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "stretch",
        justifyContent: "space-between",
        margin: "20px 0px 20px 25px",
        backgroundColor: palettes.textColors.White,
      },
      tableTopButtons: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        margin: "5px 0px",
      },
      pageIndicator: {
        marginRight: 25,
        alignSelf: "stretch",
      },
      searchInput: {
        visibility: "collapse",
        // eslint-disable-next-line local-rules/no-frozen-width
        minWidth: 320,
        margin: "5px 0px",
      },
      downloadCSVButton: {
        alignSelf: "stretch",
        marginRight: 25,
        padding: "4px 15px",
      },
      extendedRows: {
        backgroundColor: "#f0f5f7",
      },
      sectionHeader: {
        color: palettes.textColors.Ink,
        fontSize: 12,
        fontWeight: weightBold,
        padding: "2px 25px",
        cursor: "default",
        backgroundColor: palettes.yellows.LighterYellow,
      },
      expandedContainer: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#efefef",
      },
      expandedTable: {
        margin: "10px",
      },
      image: {
        width: 70,
        height: 70,
        marginRight: 15,
        borderRadius: 4,
      },
      icon: {
        width: 24,
        height: 16,
      },
    });
  }

  @computed
  get campaign(): CampaignModel | null | undefined {
    const { currentCampaign } = ProductBoostStore.instance();
    return currentCampaign;
  }

  @computed
  get campaignStats(): CampaignDetailStats | null | undefined {
    const { currentPerformanceStats } = ProductBoostStore.instance();
    return currentPerformanceStats;
  }

  @computed
  get campaignDetailByDateStats():
    | CampaignDetailByDateStats
    | null
    | undefined {
    const { currentCampaignDetailByDateStats } = ProductBoostStore.instance();
    return currentCampaignDetailByDateStats;
  }

  @computed
  get isAvailableBudget(): boolean {
    const { campaignDetailByDateStats } = this;
    if (
      campaignDetailByDateStats != null &&
      Object.keys(campaignDetailByDateStats).length > 0
    ) {
      return true;
    }
    return false;
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
    const { campaignsPerformanceFilters } = ProductBoostStore.instance();
    return campaignsPerformanceFilters;
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
      campaignDetailByDateStats,
      startDate,
      endDate,
      filteredIds,
    } = this;
    return new CampaignPerformanceStats({
      isMaxBoost,
      isSimpleBoost,
      campaignStats,
      campaignDetailByDateStats,
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
  get tableInProgressRows(): ReadonlyArray<PerformanceDailyStats> {
    return this.dailyStats.slice(7, -7);
  }

  @computed
  get tableBeforeRows(): ReadonlyArray<PerformanceDailyStats> {
    return this.dailyStats.slice(0, 7);
  }

  @computed
  get tableAfterRows(): ReadonlyArray<PerformanceDailyStats> {
    return this.dailyStats.slice(-7);
  }

  @computed
  get renderSearchBar() {
    const { onSearchFieldChanged } = this;
    return (
      <TextInput
        disabled
        className={css(this.styles.searchInput)}
        icon="search"
        placeholder={i`Search`}
        height={28}
        onChange={onSearchFieldChanged}
        value={""}
      />
    );
  }

  @action
  onSearchFieldChanged = ({ text }: OnTextChangeEvent) => {};

  @computed
  get renderPageIndicator() {
    const { dateCount } = this;
    return (
      <PageIndicator
        className={css(this.styles.pageIndicator)}
        totalItems={dateCount}
        rangeStart={1}
        rangeEnd={dateCount}
        hasNext={false}
        hasPrev={false}
        currentPage={1}
        onPageChange={() => {}}
      />
    );
  }

  @action
  downloadPerformanceCSV = () => {
    const navigationStore = NavigationStore.instance();
    const campaignId = this.campaign?.id;
    const { filteredIds } = this;
    if (campaignId != null) {
      const exportUrl = "/product-boost/export-campaign-detail-performance";
      const queryParams = {
        campaign_id: campaignId,
        product_ids: filteredIds.join(","),
      };
      navigationStore.download(
        `${exportUrl}?${queryString.stringify(queryParams)}`
      );
    }
  };

  @computed
  get renderTableTopBar() {
    return (
      <div className={css(this.styles.tableTopControl)}>
        {this.renderSearchBar}
        <div className={css(this.styles.tableTopButtons)}>
          {this.renderPageIndicator}
          <DownloadButton
            style={this.styles.downloadCSVButton}
            onClick={this.downloadPerformanceCSV}
          />
        </div>
      </div>
    );
  }

  @computed
  get dateCount() {
    return this.dailyStats.length;
  }

  @computed
  get extendedRowStyle() {
    return (params: { readonly row: DataRow; readonly index: number }) => {
      return this.styles.extendedRows;
    };
  }

  renderExpandedCampaign = (stats: PerformanceDailyStats) => {
    const {
      campaignPerformanceStats,
      isMaxBoost,
      isSimpleBoost,
      localizedCurrency,
    } = this;
    const { dateKey } = stats;
    const productStats = campaignPerformanceStats.getProductsStatsForDate(
      dateKey
    );
    return (
      <div className={css(this.styles.expandedContainer)}>
        <Table className={css(this.styles.expandedTable)} rowHeight={88}>
          <ProductColumn
            hideText
            showDetailsInPopover
            popoverPosition={"right"}
            imageSize={70}
            title={i`Product`}
            columnKey={"pid"}
            width={300}
          />
          <Table.NumeralColumn
            title={i`Impressions`}
            columnKey={"impressions"}
            noDataMessage={"\u2014"}
            numeralFormat={"0a"}
            align={"right"}
          />
          {!isSimpleBoost && (
            <Table.NumeralColumn
              columnKey={"paid_impressions"}
              noDataMessage={"\u2014"}
              numeralFormat={"0a"}
              align={"right"}
              renderHeader={() => (
                <Illustration
                  className={css(this.styles.icon)}
                  name={"paidImpressionIcon"}
                  alt={i`Sponsored Impressions`}
                />
              )}
              description={i`Sponsored Impressions`}
            />
          )}
          {!isSimpleBoost && isMaxBoost && (
            <Table.NumeralColumn
              columnKey={"external_impressions"}
              noDataMessage={"\u2014"}
              numeralFormat={"0a"}
              align={"right"}
              renderHeader={() => (
                <Illustration
                  className={css(this.styles.icon)}
                  name={"maxBoostImpressionIcon"}
                  alt={i`MaxBoost Impressions`}
                />
              )}
              description={i`MaxBoost Impressions`}
            />
          )}
          <Table.CurrencyColumn
            title={i`Total Spend`}
            columnKey={"spend"}
            noDataMessage={"\u2014"}
            currencyCode={localizedCurrency}
            align={"right"}
            multiline
          />
          {isMaxBoost && (
            <Table.CurrencyColumn
              title={i`MaxBoost Spend`}
              columnKey={"external_spend"}
              noDataMessage={"\u2014"}
              currencyCode={localizedCurrency}
              align={"right"}
              multiline
            />
          )}
          <Table.NumeralColumn
            title={i`Orders`}
            columnKey={"sales"}
            noDataMessage={"\u2014"}
            align={"right"}
          />
          <Table.CurrencyColumn
            title={i`GMV`}
            columnKey={"gmv"}
            noDataMessage={"\u2014"}
            currencyCode={localizedCurrency}
            align={"right"}
          />
          <Table.PercentageColumn
            title={i`Spend/GMV`}
            columnKey={"spend_per_gmv"}
            noDataMessage={"\u2014"}
            align={"right"}
            multiline
          />
          <Table.NumeralColumn
            title={i`Orders/1k Impressions`}
            columnKey={"sales_per_1k_impressions"}
            noDataMessage={"\u2014"}
            numeralFormat="0.0000"
            align={"right"}
            multiline
          />
          <Table.CurrencyColumn
            title={i`GMV/1k Impressions`}
            columnKey={"gmv_per_1k_impressions"}
            noDataMessage={"\u2014"}
            currencyCode={localizedCurrency}
            align={"right"}
            multiline
          />
          <Table.Section
            data={productStats}
            sectionKey={"product_stats_for_day"}
          />
        </Table>
      </div>
    );
  };

  getExpandedIndexMap(
    sectionKey: SectionKey
  ): Map<number, boolean> | null | undefined {
    switch (sectionKey) {
      case "BEFORE_CAMPAIGN":
        return this.expandedRowBeforeCampaignStarts;
      case "DURING_CAMPAIGN":
        return this.expandedRowCampaignInProgress;
      case "AFTER_CAMPAIGN":
        return this.expandedRowAfterCampaignEnds;
    }
    return null;
  }

  @action
  onRowExpandToggled(sectionKey: SectionKey) {
    const expandedIndexMap = this.getExpandedIndexMap(sectionKey);
    const toggleFunction = (index: number, shouldExpand: boolean) => {
      if (expandedIndexMap != null) {
        expandedIndexMap.set(index, shouldExpand);
      }
    };
    return toggleFunction;
  }

  expandedRowsForSection(sectionKey: SectionKey): ReadonlyArray<number> {
    const expandedIndexMap = this.getExpandedIndexMap(sectionKey);
    if (expandedIndexMap != null) {
      return Array.from(expandedIndexMap.keys())
        .filter((row) => expandedIndexMap.get(row))
        .map((row) => Math.round(row));
    }
    return [];
  }

  @computed
  get renderTable() {
    const {
      isMaxBoost,
      isSimpleBoost,
      localizedCurrency,
      isBonusBudgetCampaign,
      bonusBudgetRate,
    } = this;
    return (
      <Table>
        <Table.Column title={i`Date`} columnKey={"date"} />
        <Table.NumeralColumn
          title={i`Impressions`}
          columnKey={"impressions"}
          noDataMessage={"\u2014"}
          numeralFormat={"0a"}
          align={"right"}
        />
        {!isSimpleBoost && (
          <Table.NumeralColumn
            columnKey={"paid_impressions"}
            noDataMessage={"\u2014"}
            numeralFormat={"0a"}
            align={"right"}
            renderHeader={() => (
              <Illustration
                className={css(this.styles.icon)}
                name={"paidImpressionIcon"}
                alt={i`Sponsored Impressions`}
              />
            )}
            description={i`Sponsored Impressions`}
          />
        )}
        {!isSimpleBoost && isMaxBoost && (
          <Table.NumeralColumn
            columnKey={"external_impressions"}
            noDataMessage={"\u2014"}
            numeralFormat={"0a"}
            align={"right"}
            renderHeader={() => (
              <Illustration
                className={css(this.styles.icon)}
                name={"maxBoostImpressionIcon"}
                alt={i`MaxBoost Impressions`}
              />
            )}
            description={i`MaxBoost Impressions`}
          />
        )}
        <Table.CurrencyColumn
          title={i`Total Spend`}
          columnKey={"spend"}
          noDataMessage={"\u2014"}
          currencyCode={localizedCurrency}
          multiline
          align={"right"}
        />
        {this.isAvailableBudget && (
          <Table.CurrencyColumn
            title={i`Available Budget`}
            columnKey={"available_budget"}
            noDataMessage={"\u2014"}
            currencyCode={localizedCurrency}
            multiline
            align={"right"}
          />
        )}
        {isMaxBoost && (
          <Table.CurrencyColumn
            title={i`MaxBoost Spend`}
            columnKey={"external_spend"}
            noDataMessage={"\u2014"}
            currencyCode={localizedCurrency}
            multiline
            align={"right"}
          />
        )}
        {isBonusBudgetCampaign && (
          <Table.Column
            title={i`Bonus Budget Spend`}
            columnKey={"spend"}
            align={"right"}
            noDataMessage={"\u2014"}
            description={
              BonusBudgetPromotionExplanations.BONUS_BUDGET_DEFINITION
            }
          >
            {({
              row: { spend },
            }: CellInfo<PerformanceDailyStats, PerformanceDailyStats>) => {
              if (spend == null) {
                return null;
              }
              const bonusBudgetSpend =
                (spend / (1.0 + bonusBudgetRate)) * bonusBudgetRate;
              return (
                <div>{formatCurrency(bonusBudgetSpend, localizedCurrency)}</div>
              );
            }}
          </Table.Column>
        )}
        <Table.NumeralColumn
          title={i`Orders`}
          columnKey={"sales"}
          noDataMessage={"\u2014"}
          align={"right"}
        />
        <Table.CurrencyColumn
          title={i`GMV`}
          columnKey={"gmv"}
          noDataMessage={"\u2014"}
          currencyCode={localizedCurrency}
          align={"right"}
        />
        <Table.PercentageColumn
          title={i`Spend/GMV`}
          columnKey={"spend_per_gmv"}
          noDataMessage={"\u2014"}
          multiline
          align={"right"}
        />
        <Table.NumeralColumn
          title={i`Orders/1k Impressions`}
          columnKey={"sales_per_1k_impressions"}
          noDataMessage={"\u2014"}
          numeralFormat="0.0000"
          multiline
          align={"right"}
        />
        <Table.CurrencyColumn
          title={i`GMV/1k Impressions`}
          columnKey={"gmv_per_1k_impressions"}
          noDataMessage={"\u2014"}
          currencyCode={localizedCurrency}
          multiline
          align={"right"}
        />
        <Table.Section
          rowStyle={this.extendedRowStyle}
          data={this.tableBeforeRows}
          sectionKey={"before_campaign_starts"}
          rowExpands={() => true} // all rows expand
          expandedRows={this.expandedRowsForSection("BEFORE_CAMPAIGN")}
          renderExpanded={this.renderExpandedCampaign}
          onRowExpandToggled={this.onRowExpandToggled("BEFORE_CAMPAIGN")}
        />
        <Table.Section
          data={this.tableInProgressRows}
          sectionKey={"campaign_in_progress"}
          header={() => (
            <div className={css(this.styles.sectionHeader)}>
              Campaign Starts
            </div>
          )}
          rowExpands={() => true} // all rows expand
          expandedRows={this.expandedRowsForSection("DURING_CAMPAIGN")}
          renderExpanded={this.renderExpandedCampaign}
          onRowExpandToggled={this.onRowExpandToggled("DURING_CAMPAIGN")}
        />
        <Table.Section
          data={this.tableAfterRows}
          rowStyle={this.extendedRowStyle}
          sectionKey={"after_campaign_ends"}
          header={() => (
            <div className={css(this.styles.sectionHeader)}>Campaign Ends</div>
          )}
          rowExpands={() => true} // all rows expand
          expandedRows={this.expandedRowsForSection("AFTER_CAMPAIGN")}
          renderExpanded={this.renderExpandedCampaign}
          onRowExpandToggled={this.onRowExpandToggled("AFTER_CAMPAIGN")}
        />
      </Table>
    );
  }

  render() {
    const { renderTableTopBar, renderTable } = this;

    return (
      <div className={css(this.styles.root)}>
        {renderTableTopBar}
        {renderTable}
      </div>
    );
  }
}

export default PerformanceSectionTable;
