import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { css } from "@toolkit/styling";

/* Relative Imports */
import WECurrencyDisplayButtons from "./WECurrencyDisplayButtons";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";

export type WEMerchantPerformanceType = {
  readonly gmv?: number | null | undefined;
  readonly gmvStr?: string | null | undefined;
  readonly startDateStr?: string | null | undefined;
  readonly cashBack?: number | null | undefined;
  readonly dateRange?: string | null | undefined;
  readonly productId?: string | null | undefined;
  readonly orderCount?: number | null | undefined;
  readonly refundRatio30?: number | null | undefined;
  readonly lateArrivalRate?: number | null | undefined;
  readonly validTrackingRate?: number | null | undefined;
  readonly prefCancellationRate?: number | null | undefined;
  readonly shippingRefundRate30?: number | null | undefined;
  readonly confirmedDeliveryRate?: number | null | undefined;
  readonly workingDaysTillArrival95?: number | null | undefined;
  readonly avgWorkingDaysTillArrival?: number | null | undefined;
  readonly avgConfirmedFulfillmentTime?: number | null | undefined;
};

export type WEMerchantStatsProps = BaseProps & {
  series: ReadonlyArray<WEMerchantPerformanceType>;
  onExportCSV?: () => unknown;
  showRebate?: boolean;
  merchantSourceCurrency?: string;
  selectedCurrency?: string;
  showCurrencyButtons?: boolean;
  currencyConversionRate?: number;
  changeMerchSelectedCurrency?: (currency: string) => unknown;
};

export type DisplayMode = "chart" | "table";

const TablePageSize = 10;

@observer
export default class WEMerchantStats extends Component<WEMerchantStatsProps> {
  @observable
  currentPage = 0;

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
      pageIndicator: {},
      exportCSV: {
        marginLeft: 20,
        padding: "4px 15px",
      },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      buttonsRight: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "flex-end",
      },
      radioGroup: {
        alignSelf: "flex-end",
        margin: "30px 0px",
      },
      pageIndicatorContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      tableContainer: {},
      currencyHelpText: {
        marginTop: "15px",
      },
    });
  }

  @computed
  get tableRows() {
    const { series } = this.props;
    const start = this.currentPage * TablePageSize;
    return series.slice(start, start + TablePageSize);
  }

  @computed
  get totalPages() {
    const { series } = this.props;
    return Math.ceil(series.length / TablePageSize);
  }

  render() {
    const {
      onExportCSV,
      changeMerchSelectedCurrency,
      className,
      merchantSourceCurrency,
      selectedCurrency,
      series,
      showCurrencyButtons,
      showRebate,
      currencyConversionRate,
    } = this.props;

    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.tableContainer)}>
          <div className={css(this.styles.buttonsRow)}>
            <div className={css(this.styles.buttonsLeft)}>
              <WECurrencyDisplayButtons
                merchantSourceCurrency={merchantSourceCurrency}
                handleCurrencyChange={changeMerchSelectedCurrency}
                selectedCurrency={selectedCurrency}
                showCurrencyButtons={showCurrencyButtons}
                currencyConversionRate={currencyConversionRate}
              />
            </div>
            <div className={css(this.styles.buttonsRight)}>
              <PageIndicator
                className={css(this.styles.pageIndicator)}
                hasNext={this.currentPage < this.totalPages - 1}
                hasPrev={this.currentPage > 0}
                totalItems={series.length}
                rangeStart={this.currentPage * TablePageSize + 1}
                rangeEnd={Math.min(
                  this.currentPage * TablePageSize + TablePageSize,
                  series.length
                )}
                onPageChange={(page) => (this.currentPage = page)}
                currentPage={this.currentPage}
              />
              {onExportCSV && (
                <Button
                  className={css(this.styles.exportCSV)}
                  onClick={onExportCSV}
                >
                  Export CSV
                </Button>
              )}
            </div>
          </div>
          <Table data={this.tableRows} maxVisibleColumns={9}>
            <Table.Column title={i`Date Range`} columnKey="dateRange" />
            <Table.NumeralColumn
              title={i`Orders`}
              columnKey="orderCount"
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
              description={i`Percentage of orders delivered after the delivery deadline`}
              align="center"
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
            {showRebate && (
              <Table.CurrencyColumn
                title={i`Wish Express Cash Back (Pending Refunds)`}
                columnKey="cashBack"
                currencyCode="USD"
                description={i`Estimated cash back from Wish Express Cash Back Program`}
                align="center"
              />
            )}

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
              title={i`Avg. Confirmed Fulfillment Time`}
              columnKey="avgConfirmedFulfillmentTime"
              description={
                i`Average time from order placed to the time our system ` +
                i`confirmed the tracking number`
              }
              align="center"
            >
              {({ value }: CellInfo<number, any>) =>
                `${numeral(value).format("0.00")} days`
              }
            </Table.Column>

            <Table.Column
              title={i`Avg. Working Days Until Arrival`}
              columnKey="avgWorkingDaysTillArrival"
              description={
                i`Average number of working days from placing order to ` +
                i`receiving order`
              }
              align="center"
            >
              {({ value }: CellInfo<number, any>) =>
                `${numeral(value).format("0.00")} days`
              }
            </Table.Column>

            <Table.Column
              title={i`95th Percentile Working Days Until Arrival`}
              columnKey="workingDaysTillArrival95"
              description={
                i`95th Percentile of number of working days from placing ` +
                i`order to customer receiving order`
              }
              align="center"
            >
              {({ value }: CellInfo<number, any>) =>
                `${numeral(value).format("0.00")} days`
              }
            </Table.Column>

            <Table.NumeralColumn
              title={i`Refund Ratio 30 Day`}
              columnKey="refundRatio30"
              numeralFormat="0,0.00"
              description={
                i`Number of orders refunded divided by the number of ` +
                i`orders made 0 to 30 days ago`
              }
              align="center"
            />

            <Table.PercentageColumn
              title={i`30 Day Shipping Refund Rate`}
              columnKey="shippingRefundRate30"
              description={
                i`Percentage of orders refunded from the past 30 days due to ` +
                i`shipping reasons`
              }
              align="center"
            />
          </Table>
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
      </div>
    );
  }
}
