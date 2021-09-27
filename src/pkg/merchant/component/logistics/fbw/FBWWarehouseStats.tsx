import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import numeral from "numeral";
import moment from "moment/moment";

/* Deprecated */
import Fetcher from "@merchant/component/__deprecated__/Fetcher";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import * as illustrations from "@assets/illustrations";

/* Merchant Components */
import FBWWarehousePerfStats from "@merchant/component/logistics/fbw/FBWWarehousePerfStats";
import FBWProductPerfStats from "@merchant/component/logistics/fbw/FBWProductPerfStats";
import StatBox from "@merchant/component/logistics/fbw/StatBox";
import DateRange from "@merchant/component/logistics/fbw/DateRange";

import { WarehouseType, FBWPerformanceState } from "@toolkit/fbw";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type BaseProps = any;

export type FBWWarehouseStatsProps = BaseProps & {
  readonly warehouse: WarehouseType;
  readonly merchantId: string;
  readonly performanceState: FBWPerformanceState;
};

@observer
class FBWWarehouseStats extends Component<FBWWarehouseStatsProps> {
  @observable
  gmv = 0;

  @observable
  orders: number | null | undefined = 0;

  @observable
  refunds: number | null | undefined = 0;

  @observable
  sold: number | null | undefined = 0;

  @computed
  get styles() {
    const { statsColumns } = this.props;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.white,
        paddingTop: 25,
      },
      statsBoxes: {
        display: "flex",
        flexDirection: "row",
        margin: "25px 0px 0px 0px",
        justifyContent: "space-between",
        flexWrap: "wrap",
      },
      statsBox: {
        display: "flex",
        flexGrow: 1,
        flexBasis: 0,
      },
      statsTable: {
        minHeight: 600,
        margin: "0px 20px 20px 20px",
      },
      alerts: {},
      tabBar: {
        margin: "0px 20px",
      },
      column: {
        lineHeight: 1.4,
        flex: statsColumns ? 1.0 / statsColumns.length : 1.0,
      },
      textStatsTitle: {
        fontSize: 16,
        fontWeight: fonts.weightMedium,
        color: palettes.textColors.LightInk,
      },
      textStatsBody: {
        fontSize: 20,
        fontWeight: fonts.weightBold,
        color: palettes.textColors.Ink,
      },
    });
  }

  @action
  onDateRangeChange = (from: Date, to: Date) => {
    const { performanceState } = this.props;
    performanceState.startDate = from;
    performanceState.endDate =
      performanceState.startDate <= performanceState.endDate ? to : from;
  };

  renderGMV() {
    const { currency } = this.props;
    return (
      <StatBox
        title={i`GMV`}
        value={formatCurrency(this.gmv, currency)}
        imgUrl={illustrations.gmv}
      />
    );
  }

  renderOrders() {
    return (
      <StatBox
        title={i`Orders`}
        value={numeral(this.orders).format("0,0").toString()}
        imgUrl={illustrations.order}
      />
    );
  }

  renderSold() {
    return (
      <StatBox
        title={i`Products sold`}
        value={numeral(this.sold).format("0,0").toString()}
        imgUrl={illustrations.sold}
      />
    );
  }

  renderRefunds() {
    return (
      <StatBox
        title={i`Refunds`}
        value={numeral(this.refunds).format("0,0").toString()}
        imgUrl={illustrations.refund}
      />
    );
  }

  renderDateRange() {
    const { performanceState } = this.props;
    return (
      <DateRange
        selectedStartDate={performanceState.startDate}
        selectedEndDate={performanceState.endDate}
        maxEndDate={moment().toDate()}
        onDateRangeChange={this.onDateRangeChange}
      />
    );
  }

  @computed
  get fetcherParams() {
    const { warehouse, performanceState } = this.props;
    const params = {
      start_date: performanceState.startDate.toISOString().slice(0, 10),
      end_date: performanceState.endDate.toISOString().slice(0, 10),
      warehouse_id: warehouse.id,
    };

    return params;
  }

  @action
  onResponse = (response: any) => {
    if (response.code !== 0) {
      return;
    }
    const gmv = response.data.results.rows.txn_gmv;
    this.gmv = gmv === undefined ? 0 : gmv;
    this.orders = response.data.results.rows.txn_count;
    this.refunds = response.data.results.rows.refund_reasons_count;
    this.sold = response.data.results.rows.txn_qty;
  };

  @computed
  get selectedTab(): string {
    const { warehouse } = this.props;
    const { routeStore } = AppStore.instance();
    return (
      routeStore.pathParams(
        `/fbw-performance/${warehouse.name.toLowerCase()}/:tab`,
      ).tab || "warehouse-performance"
    );
  }

  render() {
    const { currency, merchantId, tracking, warehouse } = this.props;
    const { routeStore } = AppStore.instance();
    const { fetcherParams, onResponse } = this;
    return (
      <Fetcher
        request_DEP={{
          apiPath: "fbw/warehouse-summary/get",
          params: fetcherParams,
        }}
        onResponse_DEP={onResponse}
      >
        <div className={css(this.styles.root)}>
          {this.renderDateRange()}
          <div className={css(this.styles.statsBoxes)}>
            <div className={css(this.styles.statsBox)}>{this.renderGMV()}</div>
            <div className={css(this.styles.statsBox)}>
              {this.renderOrders()}
            </div>
            <div className={css(this.styles.statsBox)}>{this.renderSold()}</div>
            <div className={css(this.styles.statsBox)}>
              {this.renderRefunds()}
            </div>
          </div>
          <Pager
            className={css(this.styles.tabBar)}
            hideHeaderBorder={false}
            onTabChange={(tabKey: string) => {
              routeStore.pushPath(
                `/fbw-performance/${warehouse.name.toLowerCase()}/${tabKey}`,
              );
            }}
            selectedTabKey={this.selectedTab}
          >
            <Pager.Content
              titleValue={i`Warehouse Performance`}
              tabKey="warehouse-performance"
            >
              <FBWWarehousePerfStats
                tracking={tracking}
                className={css(this.styles.statsTable)}
                warehouse={warehouse}
                merchantId={merchantId}
                currency={currency}
              />
            </Pager.Content>
            <Pager.Content
              titleValue={i`Product Performance`}
              tabKey="product-performance"
            >
              <FBWProductPerfStats
                tracking={tracking}
                className={css(this.styles.statsTable)}
                warehouse={warehouse}
                merchantId={merchantId}
              />
            </Pager.Content>
          </Pager>
        </div>
      </Fetcher>
    );
  }
}

export default FBWWarehouseStats;
