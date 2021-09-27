import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Select } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { IllustratedMetric } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { weightBold, proxima } from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as api from "@merchant/api/fbw";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

@observer
class FBWStatsSummary extends Component<BaseProps> {
  thirtyDaysAgo: Date = moment().add(-30, "days").toDate();

  sixtyDaysAgo: Date = moment().add(-60, "days").toDate();

  ninetyDaysAgo: Date = moment().add(-90, "days").toDate();

  @observable
  selectedStartDate: Date = this.thirtyDaysAgo;

  @computed
  get gmv() {
    return this.request.response?.data?.results.rows.txn_gmv || 0;
  }

  @computed
  get orders() {
    return this.request.response?.data?.results.rows.txn_count || 0;
  }

  @computed
  get refunds() {
    return this.request.response?.data?.results.rows.refund_reasons_count || 0;
  }

  @computed
  get productsSold() {
    return this.request.response?.data?.results.rows.txn_qty || 0;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingBottom: 100,
      },
      statsBoxes: {
        backgroundColor: colors.white,
        display: "flex",
        flexDirection: "row",
        margin: "5px 0px 0px 0px",
        flexWrap: "wrap",
      },
      statsBox: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        flexBasis: 0,
      },
      header: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 18,
      },
      statsCard: {
        padding: 24,
        backgroundColor: colors.white,
      },
      headerLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      headerText: {
        fontSize: "24px",
        lineHeight: 1.33,
        fontFamily: proxima,
        fontWeight: weightBold,
        marginRight: "8px",
        color: palettes.textColors.Ink,
      },
    });
  }

  renderGMV() {
    return (
      <IllustratedMetric title={i`Total GMV`} illustration={"gmv"}>
        {formatCurrency(this.gmv, "USD")}
      </IllustratedMetric>
    );
  }

  renderOrders() {
    return (
      <IllustratedMetric title={i`Total orders`} illustration={"order"}>
        {this.orders.toString()}
      </IllustratedMetric>
    );
  }

  renderSold() {
    return (
      <IllustratedMetric title={i`Total products sold`} illustration={"sold"}>
        {this.productsSold.toString()}
      </IllustratedMetric>
    );
  }

  renderDateRange() {
    const dateRanges = [
      { value: this.thirtyDaysAgo, text: i`Last 30 days` },
      { value: this.sixtyDaysAgo, text: i`Last 60 days` },
      { value: this.ninetyDaysAgo, text: i`Last 90 days` },
    ];
    return (
      <Select
        options={dateRanges}
        onSelected={(value) => this.onDateRangeChange(value)}
        selectedValue={this.selectedStartDate}
        minWidth={200}
      />
    );
  }

  @action
  onDateRangeChange = (to: Date) => {
    this.selectedStartDate = to;
  };

  @computed
  get request() {
    const startDate = this.selectedStartDate.toISOString().slice(0, 10);
    const endDate = moment().toDate().toISOString().slice(0, 10);
    return api.getFBWStats({
      start_date: startDate,
      end_date: endDate,
    });
  }

  renderStats() {
    if (!this.request.response) {
      return <LoadingIndicator />;
    }
    return (
      <div className={css(this.styles.statsBoxes)}>
        <div className={css(this.styles.statsBox)}>{this.renderGMV()}</div>
        <div className={css(this.styles.statsBox)}>{this.renderOrders()}</div>
        <div className={css(this.styles.statsBox)}>{this.renderSold()}</div>
      </div>
    );
  }

  render() {
    const { className, style } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        <div className={css(this.styles.header)}>
          <div className={css(this.styles.headerLeft)}>
            <div className={css(this.styles.headerText)}>Performance</div>
            <Link href="/fbw-performance" openInNewTab>
              View Details
            </Link>
          </div>
          {this.renderDateRange()}
        </div>
        <Card className={css(this.styles.statsCard)}>{this.renderStats()}</Card>
      </div>
    );
  }
}

export default FBWStatsSummary;
