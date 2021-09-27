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
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import * as illustrations from "@assets/illustrations";

/* Merchant Components */
import FBWAllWarehousePerfStats from "@merchant/component/logistics/fbw/FBWAllWarehousePerfStats";
import StatBox from "@merchant/component/logistics/fbw/StatBox";
import MiniStatBox from "@merchant/component/logistics/fbw/MiniStatBox";
import DateRange from "@merchant/component/logistics/fbw/DateRange";

import {
  WarehouseType,
  LowInventorySKU,
  FBWPerformanceState,
} from "@toolkit/fbw";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBWAllStatsProps = BaseProps & {
  readonly warehouse: WarehouseType;
  readonly allWarehouses: ReadonlyArray<WarehouseType>;
  readonly lowInvNum: number;
  readonly lowInv: ReadonlyArray<LowInventorySKU> | null | undefined;
  readonly merchantId: string;
  readonly subpager: any;
  readonly focusOnLowInv: boolean;
  readonly scrollToLowInv: () => unknown;
  readonly currency: string;
  readonly performanceState: FBWPerformanceState;
};

@observer
class FBWAllStats extends Component<FBWAllStatsProps> {
  @observable
  gmv = 0;

  @observable
  orders: number | null | undefined = 0;

  @observable
  refunds: number | null | undefined = 0;

  @observable
  sold: number | null | undefined = 0;

  @observable
  spCreated: number | null | undefined = 0;

  @observable
  spShipped: number | null | undefined = 0;

  @observable
  spDelivered: number | null | undefined = 0;

  @observable
  spCompleted: number | null | undefined = 0;

  @observable
  dataFetched = false;

  @observable
  selectedWarehouses: Array<WarehouseType> | null = null;

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
      doubleStatsBox: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 2,
        flexBasis: 0,
      },
      miniBox: {
        display: "flex",
        flexDirection: "row",
      },
      shippingStats: {
        fontWeight: fonts.weightMedium,
        margin: "0px 0px",
      },
      statsTable: {
        minHeight: 600,
        margin: "0px 20px 20px 20px",
      },
      tabBar: {
        margin: "0px 20px",
      },
      statsContainer: {
        display: "flex",
        maxWidth: 600,
        transform: "translateZ(0)",
        marginTop: 16,
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
      miniStatsBody: {
        color: colors.black,
      },
      pager: {},
    });
  }

  componentDidUpdate() {
    const { focusOnLowInv, scrollToLowInv } = this.props;
    if (this.dataFetched && focusOnLowInv) {
      scrollToLowInv();
    }
  }

  renderGMV() {
    const { currency } = this.props;
    return (
      <StatBox
        title={i`Total GMV`}
        value={formatCurrency(this.gmv, currency)}
        imgUrl={illustrations.gmv}
      />
    );
  }

  renderOrders() {
    return (
      <StatBox
        title={i`Total orders`}
        value={numeral(this.orders).format("0,0").toString()}
        imgUrl={illustrations.order}
      />
    );
  }

  renderSold() {
    return (
      <StatBox
        title={i`Total products sold`}
        value={numeral(this.sold).format("0,0").toString()}
        imgUrl={illustrations.sold}
      />
    );
  }

  renderRefunds() {
    return (
      <StatBox
        title={i`Total refunds`}
        value={numeral(this.refunds).format("0,0").toString()}
        imgUrl={illustrations.refund}
      />
    );
  }

  @computed
  get totalShippingPlan() {
    return (
      <div className={css(this.styles.miniBox)}>
        <MiniStatBox
          title={i`Created`}
          value={numeral(this.spCreated).format("0,0").toString()}
        />
        <MiniStatBox
          title={i`Shipped`}
          value={numeral(this.spShipped).format("0,0").toString()}
        />
        <MiniStatBox
          title={i`Delivered`}
          value={numeral(this.spDelivered).format("0,0").toString()}
        />
        <MiniStatBox
          title={i`Completed`}
          value={numeral(this.spCompleted).format("0,0").toString()}
        />
      </div>
    );
  }

  renderShippingPlan() {
    return (
      <StatBox
        title={i`Current status of shipping plans`}
        value={this.totalShippingPlan}
        description={
          i`This section shows data on ` +
          i`shipping plans as of the current time, not the selected date range.`
        }
        imgUrl={illustrations.fbw}
        className={this.styles.shippingStats}
      />
    );
  }

  renderLowInStock() {
    const { lowInvNum } = this.props;
    return (
      <StatBox
        title={i`Low in stock`}
        value={numeral(lowInvNum).format("0,0").toString()}
        footer={i`Selling out soon`}
        imgUrl={illustrations.lowInStock}
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

  @action
  onDateRangeChange = (from: Date, to: Date) => {
    const { performanceState } = this.props;
    performanceState.startDate = from;
    performanceState.endDate =
      performanceState.startDate <= performanceState.endDate ? to : from;
  };

  @computed
  get fetcherParams(): any {
    const { performanceState } = this.props;
    const params = {
      start_date: performanceState.startDate.toISOString().slice(0, 10),
      end_date: performanceState.endDate.toISOString().slice(0, 10),
    };

    return params;
  }

  @computed
  get selectedWarehouseFilters() {
    const { allWarehouses } = this.props;
    if (this.selectedWarehouses == null) {
      return allWarehouses;
    }
    return this.selectedWarehouses;
  }

  @action
  onWarehouseFilterToggled = (value: string) => {
    const { allWarehouses } = this.props;
    const typeSet = new Set(
      this.selectedWarehouseFilters.map((w) => {
        return w.id;
      })
    );

    if (typeSet.has(value)) {
      typeSet.delete(value);
    } else {
      typeSet.add(value);
    }

    const newSelected = allWarehouses.filter((w) => typeSet.has(w.id));

    this.selectedWarehouses = newSelected;
  };

  @action
  onFiltersDeselected = () => {
    this.selectedWarehouses = [];
  };

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
    this.spCreated = response.data.results.rows.sp_created;
    this.spShipped = response.data.results.rows.sp_shipped;
    this.spDelivered = response.data.results.rows.sp_delivered;
    this.spCompleted = response.data.results.rows.sp_completed;
    this.dataFetched = true;
  };

  @computed
  get selectedTab(): string {
    const { routeStore } = AppStore.instance();
    return (
      routeStore.pathParams("/fbw-performance/all/:tab").tab || "low-inventory"
    );
  }

  render() {
    const { currency, merchantId, subpager } = this.props;
    const { fetcherParams, onResponse } = this;
    return (
      <Fetcher
        request_DEP={{
          apiPath: "fbw/all-summary/get",
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
          <div className={css(this.styles.statsBoxes)}>
            <div className={css(this.styles.doubleStatsBox)}>
              {this.renderShippingPlan()}
            </div>
            <div className={css(this.styles.doubleStatsBox)}>
              {this.renderLowInStock()}
            </div>
          </div>
          <div ref={subpager}>
            <Card title={i`Warehouse Performance`}>
              <FBWAllWarehousePerfStats
                className={css(this.styles.statsTable)}
                merchantId={merchantId}
                currency={currency}
              />
            </Card>
          </div>
        </div>
      </Fetcher>
    );
  }
}
export default FBWAllStats;
