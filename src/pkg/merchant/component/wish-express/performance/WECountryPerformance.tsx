/* React, Mobx and Aphrodite */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { AlertList } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import countries from "@toolkit/countries";

/* Relative Imports */
import WEMerchantStats from "./WEMerchantStats";
import PercentageStatBox from "./PercentageStatBox";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { WEMerchantPerformanceType } from "./WEMerchantStats";
import { PercentageStatBoxDisplayMode } from "./PercentageStatBox";
import { CountryType } from "@merchant/component/wish-express/CountryPager";
import { AlertType } from "@ContextLogic/lego";
import { formatDatetimeLocalized } from "@toolkit/datetime";

export type WECountryPerformanceProps = BaseProps & {
  series: ReadonlyArray<WEMerchantPerformanceType>;
  country: CountryType;
  showRebate?: boolean;
  countryBlock?: any | null | undefined;
};

@observer
class WECountryPerformance extends Component<WECountryPerformanceProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.white,
        paddingTop: 25,
      },
      statsBoxes: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        margin: "25px 0px",
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
        margin: "0px 20px 20px 20px",
      },
      alerts: {},
    });
  }

  @computed
  get statBoxWidth(): number {
    const { dimenStore } = AppStore.instance();
    return 0.135 * dimenStore.screenInnerWidth;
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

    const displayMode: PercentageStatBoxDisplayMode = (() => {
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
      return week.lateArrivalRate != null;
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
        description={
          i`Percentage of orders delivered after the delivery ` + `deadline`
        }
        target="<= 5%"
      />
    );
  }

  renderAlertList() {
    const { countryBlock } = this.props;
    if (!countryBlock) {
      return null;
    }

    let message = i`Your store has been blocked from shipping Wish Express to ${
      // if you find this please fix the any types (legacy)
      (countries as any)[countryBlock.country]
    }`;

    if (countryBlock.can_reapply && countryBlock.end_time) {
      const unblockDate = formatDatetimeLocalized(
        moment.unix(countryBlock.end_time),
        "YYYY-MM-DD"
      );
      // eslint-disable-next-line local-rules/use-string-interpolation
      message += " " + i` You are eligible to reapply after ${unblockDate}`;
    }

    const alerts: ReadonlyArray<AlertType> = [
      {
        text: message,
        sentiment: "negative",
        link: {
          text: i`View Infraction`,
          url: `/warning/view/${countryBlock.infraction_id}`,
        },
      },
    ];
    return <AlertList className={css(this.styles.alerts)} alerts={alerts} />;
  }

  render() {
    const { series, showRebate } = this.props;
    return (
      <div className={css(this.styles.root)}>
        {this.renderAlertList()}
        <div className={css(this.styles.statsBoxes)}>
          {this.renderConfirmedDeliveryStat()}
          {this.renderValidTrackingStat()}
          {this.renderLateRateRateStat()}
        </div>
        <WEMerchantStats
          series={series}
          className={css(this.styles.statsTable)}
          showRebate={showRebate}
        />
      </div>
    );
  }
}

export default WECountryPerformance;
