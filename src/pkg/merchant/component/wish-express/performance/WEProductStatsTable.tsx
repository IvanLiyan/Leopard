// @noflow
/* eslint-disable local-rules/use-markdown */

/* React, Mobx and Aphrodite */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* External Libraries */
import numeral from "numeral";
import moment, { unitOfTime } from "moment/moment";

/* Deprecated */
import Fetcher from "@merchant/component/__deprecated__/Fetcher";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Toolkit */
import { isGMVEstimated } from "@toolkit/wish-express/gmv-currency-conversion";

/* Relative Imports */
import WECurrencyDisplayButtons from "./WECurrencyDisplayButtons";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { WEMerchantPerformanceType } from "./WEMerchantStats";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import { formatDatetimeLocalized } from "@toolkit/datetime";

const TablePageSize = 10;
type WeekRange = { start: number; end: number; text: string };
type SeriesEntry = {
  [metricKey: string]: any;
};

export type WEProductPerformanceType = {
  readonly gmv: number | null | undefined;
  readonly dateRange: string;
  readonly cashBack: number | null | undefined;
  readonly totalOrders: number | null | undefined;
  readonly refundRatio30: number | null | undefined;
  readonly lateArrivalRate: number | null | undefined;
  readonly confirmedDeliveryRate: number | null | undefined;
  readonly shippingRefundRate30: number | null | undefined;
  readonly prefCancellationRate: number | null | undefined;
  readonly workingDaysTillArrival95: number | null | undefined;
  readonly avgWorkingDaysTillArrival: number | null | undefined;
  readonly avgConfirmedFulfillmentTime: number | null | undefined;
  readonly aggregateSeries: ReadonlyArray<SeriesEntry>;
  readonly defaultTimestamp: number;
};

export type WEProductStatsTableProps = BaseProps & {
  readonly onExportCSV?: (week: number) => unknown;
  readonly aggregateSeries: ReadonlyArray<SeriesEntry>;
  readonly defaultTimestamp: number;
  readonly merchantSourceCurrency: string;
  readonly selectedCurrency?: string;
  readonly showCurrencyButtons?: boolean;
  readonly merchantCurrencyMigrationDate?: number;
  readonly currencyConversionRate?: number;
  readonly changeProdSelectedCurrency?: (currency: string) => unknown;
};

@observer
export default class WEProductStatsTable extends Component<
  WEProductStatsTableProps
> {
  @observable
  hasNext = false;

  @observable
  weekIndex = 0;

  @observable
  series: ReadonlyArray<SeriesEntry> = [];

  @observable
  currentPage = 0;

  dispose: (() => void) | null | undefined;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
      },
      buttonsRow: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "30px 0px",
      },
      pageIndicator: {
        marginRight: 20,
      },
      buttonsRight: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
      },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      table: {},
      weekDropdown: {
        display: "flex",
        margin: 0,
        boxShadow: `0 1px 0 0 rgba(22, 29, 37, 0.05)`,
        border: "solid 1px #aaadad",
        opacity: 0.8,
        transition: "all 0.3s linear",
        userSelect: "none",
        ":hover": {
          opacity: 1,
          boxShadow: `0 1px 0 0 rgba(22, 29, 37, 0.1)`,
        },
        marginRight: 10,
      },
      currencyHelpText: {
        marginTop: "15px",
      },
    });
  }

  @computed
  get merchantId(): string | null | undefined {
    const {
      userStore: { loggedInMerchantUser },
    } = AppStore.instance();
    return loggedInMerchantUser.merchant_id;
  }

  @computed
  get tableRows(): ReadonlyArray<WEMerchantPerformanceType> {
    return this.series.map((product) =>
      this.convertToMerchantPerformance(product)
    );
  }

  @action
  onResponse = (response: any) => {
    if (response.code !== 0) {
      return;
    }

    this.series = response.data.series;
    if (!this.series || this.series.length == 0) {
      return;
    }
    this.hasNext = !response.data.feed_ended;
  };

  @computed
  get weekRanges(): WeekRange[] {
    const { aggregateSeries, defaultTimestamp } = this.props;
    const ranges: WeekRange[] = [];
    let startTime = defaultTimestamp;
    if (aggregateSeries && aggregateSeries.length > 0) {
      startTime = aggregateSeries[aggregateSeries.length - 1].epoch / 1000;
    }

    let currentWeek = moment
      .unix(startTime)
      .startOf("isoweek" as unitOfTime.StartOf);
    // eslint-disable-next-line local-rules/no-c-style-for-loop
    for (let i = 0; i < 10; i++) {
      const weekStart = currentWeek;
      const weekEnd = moment(weekStart).add(6, "days");
      ranges.push({
        start: weekStart.unix(),
        end: weekEnd.unix(),
        text: `${formatDatetimeLocalized(
          weekStart,
          "MM/DD"
        )} - ${formatDatetimeLocalized(weekEnd, "MM/DD")}`,
      });

      currentWeek = currentWeek.subtract(7, "days");
    }
    return ranges;
  }

  convertToMerchantPerformance(data: SeriesEntry): WEMerchantPerformanceType {
    const {
      selectedCurrency,
      showCurrencyButtons,
      merchantSourceCurrency,
      merchantCurrencyMigrationDate,
    } = this.props;
    const endDate = moment(data.end_date_str, "MM-DD-YYYY");

    // Show tracking after 7 days
    const showTracking = moment().diff(endDate, "days") >= 7;

    const dateRange = (() => {
      const startDate = data.start_date_str.substring(0, 5).replace("-", "/");
      const endate = data.end_date_str.substring(0, 5).replace("-", "/");
      return `${startDate} - ${endate}`;
    })();

    const orderCount = (() => {
      return data.wish_express_order_count || 0;
    })();

    const productId = data.product_id;

    const gmv = (() => {
      if (data.wish_express_cost && selectedCurrency != null) {
        return Math.min(
          data.wish_express_cost_currency_dict[selectedCurrency],
          data.total_m_txn_cost_currency_dict[selectedCurrency]
        );
      } else if (
        data.wish_express_total_m_txn_cost &&
        selectedCurrency != null
      ) {
        return Math.min(
          data.wish_express_total_m_txn_cost_currency_dict[selectedCurrency],
          data.total_m_txn_cost_currency_dict[selectedCurrency]
        );
      }
      return 0;
    })();

    let gmvStr = formatCurrency(gmv, selectedCurrency);
    if (
      showCurrencyButtons &&
      isGMVEstimated({
        startDateStr: data.start_date_str,
        merchantCurrencyMigrationDate,
        merchantSourceCurrency,
        selectedCurrency,
      })
    ) {
      gmvStr += "*";
    }

    const avgConfirmedFulfillmentTime = (() => {
      if (
        showTracking &&
        data.wish_express_confirm_time != null &&
        data.wish_express_valid_count > 0
      ) {
        return data.wish_express_confirm_time / data.wish_express_valid_count;
      }
    })();

    const validTrackingRate = (() => {
      if (
        showTracking &&
        data.wish_express_valid_count != null &&
        data.wish_express_shipped_count > 0
      ) {
        return data.wish_express_valid_count / data.wish_express_shipped_count;
      }
    })();

    const confirmedDeliveryRate = (() => {
      if (
        showTracking &&
        data.wish_express_delivered_count != null &&
        data.wish_express_shipped_count > 0
      ) {
        return (
          data.wish_express_delivered_count / data.wish_express_shipped_count
        );
      }
    })();

    const avgWorkingDaysTillArrival = (() => {
      if (
        showTracking &&
        data.wish_express_bus_day_time != null &&
        data.wish_express_delivered_count > 0
      ) {
        return (
          data.wish_express_bus_day_time / data.wish_express_delivered_count
        );
      }
    })();

    const workingDaysTillArrival95 = (() => {
      if (showTracking && data.wish_express_shipped_count != null) {
        return data.wish_express_bus_day_95;
      }
    })();

    const lateArrivalRate = (() => {
      if (showTracking && data.wish_express_shipped_count > 0) {
        return Math.min(
          (data.wish_express_late_count || 0) / data.wish_express_shipped_count,
          1
        );
      }
    })();

    const refundRatio30 = (() => {
      if (
        data.wish_express_refunds_30 != null &&
        data.wish_express_orders_30 > 0
      ) {
        return data.wish_express_refunds_30 / data.wish_express_orders_30;
      }
    })();

    const shippingRefundRate30 = (() => {
      if (
        data.wish_express_shipping_refunds_30 != null &&
        data.wish_express_orders_30 > 0
      ) {
        return (
          data.wish_express_shipping_refunds_30 / data.wish_express_orders_30
        );
      }
    })();

    const cashBack = (() => {
      return data.weekly_rebate_earned || 0;
    })();

    const prefCancellationRate = (() => {
      if (
        showTracking &&
        data.wish_express_order_count != null &&
        data.wish_express_order_count > 0
      ) {
        const cancelCount: number | null | undefined =
          data.wish_express_cancel_count ||
          data.wish_express_prefulfill_cancels;
        if (cancelCount != null) {
          return cancelCount / data.wish_express_order_count;
        }
      }
    })();

    return {
      gmv,
      gmvStr,
      cashBack,
      dateRange,
      productId,
      orderCount,
      refundRatio30,
      lateArrivalRate,
      validTrackingRate,
      prefCancellationRate,
      shippingRefundRate30,
      confirmedDeliveryRate,
      workingDaysTillArrival95,
      avgWorkingDaysTillArrival,
      avgConfirmedFulfillmentTime,
    };
  }

  @computed
  get queryOffset() {
    return this.currentPage * TablePageSize;
  }

  @action
  // if you find this please fix the any types (legacy)
  onWeekSelected = (event: any) => {
    this.weekIndex = event.target.value;
    this.currentPage = 0;
  };

  onExportCSV = () => {
    const {
      props: { onExportCSV },
      weekIndex,
      weekRanges,
    } = this;
    if (!onExportCSV) {
      return;
    }

    const week = weekRanges[weekIndex];
    onExportCSV(week.start);
  };

  render() {
    const {
      onExportCSV,
      className,
      merchantSourceCurrency,
      selectedCurrency,
      changeProdSelectedCurrency,
      showCurrencyButtons,
      currencyConversionRate,
    } = this.props;
    const currentWeek = this.weekRanges[this.weekIndex];

    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.buttonsRow)}>
          <div className={css(this.styles.buttonsLeft)}>
            <section>Week</section>
            &nbsp;&nbsp;
            <select
              className={css(this.styles.weekDropdown)}
              onChange={this.onWeekSelected}
            >
              {this.weekRanges.map((range, idx) => (
                <option key={range.text} value={idx}>
                  {range.text}
                </option>
              ))}
            </select>
            <WECurrencyDisplayButtons
              merchantSourceCurrency={merchantSourceCurrency}
              handleCurrencyChange={changeProdSelectedCurrency}
              selectedCurrency={selectedCurrency}
              showCurrencyButtons={showCurrencyButtons}
              currencyConversionRate={currencyConversionRate}
            />
          </div>
          <div className={css(this.styles.buttonsRight)}>
            <PageIndicator
              className={css(this.styles.pageIndicator)}
              hasNext={this.hasNext}
              hasPrev={this.currentPage > 0}
              rangeStart={this.currentPage * TablePageSize + 1}
              rangeEnd={this.currentPage * TablePageSize + TablePageSize}
              onPageChange={(page) => (this.currentPage = page)}
              currentPage={this.currentPage}
            />
            {onExportCSV && (
              <Button
                style={{ padding: "4px 15px" }}
                onClick={this.onExportCSV}
              >
                Export CSV
              </Button>
            )}
          </div>
        </div>

        <Fetcher
          request_DEP={{
            apiPath: "stats/product/weekly",
            params: {
              offset: this.queryOffset,
              limit: TablePageSize,
              merchant_id: this.merchantId,
              start: currentWeek.start,
              end: currentWeek.end,
              sort_key: "_wish_express_cost",
            },
          }}
          onResponse_DEP={this.onResponse}
          passResponseAsProps={false}
        >
          <Table
            data={this.tableRows}
            className={css(this.styles.table)}
            maxVisibleColumns={9}
          >
            <Table.Column title={i`Date Range`} columnKey="dateRange" />
            <ProductColumn
              title={i`Product`}
              columnKey="productId"
              minWidth={250}
              width={300}
            />
            <Table.NumeralColumn
              title={i`Orders`}
              columnKey="orderCount"
              width={180}
              description={i`Number of times your products were bought`}
            />
            <Table.Column
              title={i`GMV`}
              columnKey="gmvStr"
              description={i`Gross merchandising value`}
            />
            <Table.PercentageColumn
              title={i`Late Arrival Rate`}
              columnKey="lateArrivalRate"
              description={
                i`Percentage of orders delivered after the delivery ` +
                i`deadline`
              }
            />
            <Table.PercentageColumn
              title={i`Pre-fulfillment Cancellation Rate`}
              columnKey="prefCancellationRate"
              description={
                i`Percentage of orders that are refunded due to the ` +
                i`merchant being unable to fulfill the order `
              }
              align="center"
            />
            <Table.PercentageColumn
              title={i`Valid Tracking Rate`}
              columnKey="validTrackingRate"
              description={i`Percentage of orders confirmed shipped by the carrier`}
              align="center"
            />
            <Table.PercentageColumn
              title={i`Confirmed Delivery Rate`}
              columnKey="confirmedDeliveryRate"
              description={i`Percentage of orders confirmed delivered by the carrier`}
              align="center"
            />
            <Table.Column
              title={i`Avg. Working Days Until Arrival`}
              columnKey="avgWorkingDaysTillArrival"
              description={
                i`Average number of working days from placing order to ` +
                i`receiving order`
              }
              align="center"
            >
              {({
                value,
              }: CellInfo<
                WEProductPerformanceType["avgWorkingDaysTillArrival"],
                WEProductPerformanceType
              >) => i`${numeral(value).format("0,0.00").toString()} days`}
            </Table.Column>
            <Table.Column
              title={i`95th Percentile Working Days Until Arrival`}
              columnKey="workingDaysTillArrival95"
              description={
                i`95th Percentile of number of working days from placing order to ` +
                i`customer receiving order`
              }
              align="center"
            >
              {({
                value,
              }: CellInfo<
                WEProductPerformanceType["workingDaysTillArrival95"],
                WEProductPerformanceType
              >) => i`${numeral(value).format("0,0.00").toString()} days`}
            </Table.Column>

            <Table.Column
              title={i`Avg. Confirmed Fulfillment Time`}
              columnKey="avgConfirmedFulfillmentTime"
              description={
                i`Average time from order placed to the time our system ` +
                i`confirmed the tracking number`
              }
              align="center"
            >
              {({
                value,
              }: CellInfo<
                WEProductPerformanceType["avgConfirmedFulfillmentTime"],
                WEProductPerformanceType
              >) => i`${numeral(value).format("0,0.00").toString()} days`}
            </Table.Column>

            <Table.DecimalColumn
              title={i`Refund Ratio 30 Day`}
              columnKey="refundRatio30"
              description={
                i`Number of orders refunded divided by the number of ` +
                i`orders made 0 to 30 days ago`
              }
              align="center"
            />

            <Table.DecimalColumn
              title={i`30 Day Shipping Refund Rate`}
              columnKey="shippingRefundRate30"
              description={
                i`Percentage of orders refunded from the past 30 days due to ` +
                i`shipping reasons`
              }
              align="center"
            />
          </Table>
        </Fetcher>
        {showCurrencyButtons &&
          currencyConversionRate != null &&
          merchantSourceCurrency != "USD" && (
            <div className={css(this.styles.currencyHelpText)}>
              {i`USD values recorded prior to your ${merchantSourceCurrency} ` +
                i`migration date are being calculated at ` +
                i`${formatCurrency(1, "USD")} = ` +
                i`${formatCurrency(
                  currencyConversionRate,
                  merchantSourceCurrency
                )}, ` +
                i`in order to view full performance data in ${merchantSourceCurrency}.`}
            </div>
          )}
      </div>
    );
  }
}
