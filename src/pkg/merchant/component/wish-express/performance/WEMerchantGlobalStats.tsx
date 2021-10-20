/* React, Mobx and Aphrodite */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";

/* Merchant Components */
import Pager from "@merchant/component/wish-express/OldPager";
import { CountryType } from "@merchant/component/wish-express/CountryPager";

/* Relative Imports */
import WEMerchantStats from "./WEMerchantStats";
import PercentageStatBox from "./PercentageStatBox";
import WEProductStatsTable from "./WEProductStatsTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WEMerchantPerformanceType } from "./WEMerchantStats";
import { PercentageStatBoxDisplayMode } from "./PercentageStatBox";
import DeviceStore from "@stores/DeviceStore";
import UserStore from "@stores/UserStore";
import NavigationStore from "@stores/NavigationStore";

type SeriesEntry = {
  [metricKey: string]: any;
};

export type WEMerchantGlobalStatsProps = BaseProps & {
  country: CountryType;
  series: ReadonlyArray<WEMerchantPerformanceType>;
  showRebate?: boolean;
  merchCsvDate: number;
  aggregateSeries: ReadonlyArray<SeriesEntry>;
  defaultTimestamp: number;
  showRemovedProductsTab?: boolean;
  merchantSourceCurrency: string;
  merchSelectedCurrency: string;
  prodSelectedCurrency: string;
  showCurrencyButtons?: boolean;
  merchantCurrencyMigrationDate?: number;
  currencyConversionRate?: number;
  changeMerchSelectedCurrency?: (currency: string) => void;
  changeProdSelectedCurrency?: (currency: string) => unknown;
};

@observer
export default class WEMerchantGlobalStats extends Component<WEMerchantGlobalStatsProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: "0px 0px 20px 0px",
        backgroundColor: colors.white,
      },
      statsBoxes: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        margin: "50px 0px",
        justifyContent: "space-between",
      },
      statsBox: {
        margin: "0px 20px",
        display: "flex",
        flexGrow: 1,
        flexBasis: 0,
      },
      statsTable: {
        minHeight: 600,
      },
      tabBar: {
        margin: "0px 20px",
      },
    });
  }

  @computed
  get statBoxWidth(): number {
    const { screenInnerWidth } = DeviceStore.instance();
    return 0.135 * screenInnerWidth;
  }

  @computed
  get merchantId(): string | null | undefined {
    const { loggedInMerchantUser } = UserStore.instance();
    return loggedInMerchantUser.merchant_id;
  }

  renderConfirmedDeliveryStat() {
    const { series } = this.props;
    const mostRecentData = series.find((week) => {
      return week.confirmedDeliveryRate != null;
    });

    const confirmedDelivery = (() => {
      if (mostRecentData) {
        return mostRecentData.confirmedDeliveryRate;
      }
    })();

    const mostRecentDateRange = (() => {
      if (mostRecentData) {
        return mostRecentData.dateRange;
      }
    })();

    const displayMode = ((): PercentageStatBoxDisplayMode => {
      if (confirmedDelivery == null) {
        return "neutral";
      }
      return confirmedDelivery >= 0.95 ? "positive" : "negative";
    })();

    return (
      <PercentageStatBox
        displayMode={displayMode}
        width={this.statBoxWidth}
        className={css(this.styles.statsBox)}
        title={i`Confirmed Delivery Rate`}
        value={confirmedDelivery}
        timeRange={mostRecentDateRange}
        description={i`Percentage of orders confirmed delivered by the carrier`}
        target=">= 95%"
      />
    );
  }

  exportMerchantCSV = () => {
    const navigationStore = NavigationStore.instance();
    const { merchCsvDate, merchSelectedCurrency } = this.props;
    navigationStore.download(
      `/stats/merchant/weekly/export?target_date=${merchCsvDate}` +
        `&stats_type=wish_express_overview&merchant_id=${this.merchantId}` +
        `&selected_currency=${merchSelectedCurrency}`,
    );
  };

  exportProductsCSV = (week: number) => {
    const navigationStore = NavigationStore.instance();
    const { prodSelectedCurrency } = this.props;
    navigationStore.download(
      `/stats/product/weekly/export?target_date=${week}` +
        `&stats_type=wish_express_overview&merchant_id=${this.merchantId}` +
        `&selected_currency=${prodSelectedCurrency}`,
    );
  };

  renderValidTrackingStat() {
    const { series } = this.props;
    const mostRecentData = series.find((week) => {
      return week.validTrackingRate != null;
    });

    const validTrackingRate = (() => {
      if (mostRecentData) {
        return mostRecentData.validTrackingRate;
      }
    })();

    const mostRecentDateRange = (() => {
      if (mostRecentData) {
        return mostRecentData.dateRange;
      }
    })();

    const displayMode: PercentageStatBoxDisplayMode = (() => {
      if (validTrackingRate == null) {
        return "neutral";
      }
      return validTrackingRate >= 0.95 ? "positive" : "negative";
    })();

    return (
      <PercentageStatBox
        width={this.statBoxWidth}
        displayMode={displayMode}
        className={css(this.styles.statsBox)}
        title={i`Valid Tracking Rate`}
        value={validTrackingRate}
        timeRange={mostRecentDateRange}
        description={i`Percentage of orders confirmed shipped by the carrier`}
        target=">= 95%"
      />
    );
  }

  renderLateRateRateStat() {
    const { series } = this.props;
    const mostRecentData = series.find((week) => {
      return week.validTrackingRate != null;
    });

    const lateArrivalRate = (() => {
      if (mostRecentData) {
        return mostRecentData.lateArrivalRate;
      }
    })();

    const mostRecentDateRange = (() => {
      if (mostRecentData) {
        return mostRecentData.dateRange;
      }
    })();

    const displayMode: PercentageStatBoxDisplayMode = (() => {
      if (lateArrivalRate == null) {
        return "neutral";
      }
      return lateArrivalRate <= 0.05 ? "positive" : "negative";
    })();

    return (
      <PercentageStatBox
        width={this.statBoxWidth}
        inversed
        displayMode={displayMode}
        className={css(this.styles.statsBox)}
        title={i`Late Arrival Rate`}
        value={lateArrivalRate}
        timeRange={mostRecentDateRange}
        description={i`Percentage of orders delivered after the delivery deadline`}
        target="<= 5%"
      />
    );
  }

  render() {
    const {
      series,
      aggregateSeries,
      changeMerchSelectedCurrency,
      changeProdSelectedCurrency,
      className,
      defaultTimestamp,
      merchSelectedCurrency,
      merchantCurrencyMigrationDate,
      merchantSourceCurrency,
      prodSelectedCurrency,
      showCurrencyButtons,
      showRebate,
      currencyConversionRate,
    } = this.props;

    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.statsBoxes)}>
          {this.renderConfirmedDeliveryStat()}
          {this.renderValidTrackingStat()}
          {this.renderLateRateRateStat()}
        </div>
        <Pager className={css(this.styles.tabBar)}>
          <Pager.Content
            titleValue={i`Weekly Performance`}
            tabKey="weekPerformance"
          >
            <WEMerchantStats
              className={css(this.styles.statsTable)}
              series={series}
              merchantSourceCurrency={merchantSourceCurrency}
              showRebate={showRebate}
              onExportCSV={this.exportMerchantCSV}
              changeMerchSelectedCurrency={changeMerchSelectedCurrency}
              selectedCurrency={merchSelectedCurrency}
              showCurrencyButtons={showCurrencyButtons}
              currencyConversionRate={currencyConversionRate}
            />
          </Pager.Content>
          <Pager.Content
            titleValue={i`Product Performance`}
            tabKey="productPerformance"
          >
            <WEProductStatsTable
              className={css(this.styles.statsTable)}
              onExportCSV={this.exportProductsCSV}
              defaultTimestamp={defaultTimestamp}
              aggregateSeries={aggregateSeries}
              merchantSourceCurrency={merchantSourceCurrency}
              changeProdSelectedCurrency={changeProdSelectedCurrency}
              selectedCurrency={prodSelectedCurrency}
              showCurrencyButtons={showCurrencyButtons}
              merchantCurrencyMigrationDate={merchantCurrencyMigrationDate}
              currencyConversionRate={currencyConversionRate}
            />
          </Pager.Content>
        </Pager>
      </div>
    );
  }
}
