/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { CartesianGrid } from "@ContextLogic/lego";
import { LineChart } from "@ContextLogic/lego";
import { Line } from "@ContextLogic/lego";
import {
  RechartsTooltip as Tooltip,
  RechartsTooltipProps,
} from "@ContextLogic/lego";
import { XAxis } from "@ContextLogic/lego";
import { YAxis } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold, weightMedium } from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import FBSStatsDateRangeSelector from "@merchant/component/logistics/fbs/performance/FBSStatsDateRangeSelector";
import SimpleStatBox from "@merchant/component/logistics/fbs/performance/SimpleStatBox";

/* Merchant API */
import * as fbsApi from "@merchant/api/fbs";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import { TimePeriod } from "@toolkit/fbs";

export type FBSMerchantSalesGraphProps = BaseProps & {
  readonly currency: string;
  readonly setTimePeriod: (val: TimePeriod) => void;
  readonly timePeriod: TimePeriod;
  readonly dateRangeOptions: ReadonlyArray<Option<TimePeriod>>;
};

const FBSMerchantSalesGraph = (props: FBSMerchantSalesGraphProps) => {
  const {
    className,
    style,
    currency,
    dateRangeOptions,
    setTimePeriod,
    timePeriod,
  } = props;
  const styles = useStyleSheet();
  const request = fbsApi.getMerchantStats({ stat_type: timePeriod });
  const data = request.response?.data;

  if (data == null) {
    return (
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.header)}>
          <div className={css(styles.salesTitle)}>Sales Insights</div>
        </div>
        <LoadingIndicator />
      </div>
    );
  }

  const {
    results: graphData,
    total_gmv: totalGmv,
    total_orders: totalOrders,
    total_sold: totalSold,
  } = data;

  // eslint-disable-next-line local-rules/no-large-method-params
  const renderTooltip = (
    ...args: Parameters<NonNullable<RechartsTooltipProps["formatter"]>>
  ) => {
    const [, , entry] = args;
    return (
      <div className={css(styles.tooltipContainer)}>
        <div className={css(styles.tooltipTitle)}>{entry.payload.name}</div>
        <table>
          <tr>
            <td className={css(styles.tooltipDateRange)}>
              {entry.payload.range}
            </td>
          </tr>
          <tr>
            <td className={css(styles.tooltipLabel)}>Total GMV</td>
            <td className={css(styles.tooltipValue)}>
              {formatCurrency(entry.payload.gmv, currency)}
            </td>
          </tr>
          <tr>
            <td className={css(styles.tooltipLabel)}>Total orders</td>
            <td className={css(styles.tooltipValue)}>
              {numeral(entry.payload.orders).format("0,0").toString()}
            </td>
          </tr>
          <tr>
            <td className={css(styles.tooltipLabel)}>Total products sold</td>
            <td className={css(styles.tooltipValue)}>
              {numeral(entry.payload.quantity_sold).format("0,0").toString()}
            </td>
          </tr>
        </table>
      </div>
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.header)}>
        <div className={css(styles.salesTitle)}>Sales Insights</div>
        <FBSStatsDateRangeSelector
          setTimePeriod={setTimePeriod}
          timePeriod={timePeriod}
          dateRangeOptions={dateRangeOptions}
        />
      </div>
      <div className={css(styles.totals)}>
        <SimpleStatBox
          className={css(styles.statBox, styles.statBoxSeparator)}
          title={i`Total GMV`}
          value={totalGmv ? formatCurrency(totalGmv, currency) : totalGmv}
        />
        <SimpleStatBox
          className={css(styles.statBox, styles.statBoxSeparator)}
          title={i`Total Orders`}
          value={
            totalOrders
              ? numeral(totalOrders).format("0,0").toString()
              : totalOrders
          }
        />
        <SimpleStatBox
          className={css(styles.statBox)}
          title={i`Total product SKUs sold`}
          value={
            totalSold ? numeral(totalSold).format("0,0").toString() : totalSold
          }
        />
      </div>
      <div style={{ flex: 1, height: 300 }}>
        <LineChart data={graphData}>
          <CartesianGrid horizontal vertical={false} />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(i) =>
              numeral(i).format("$0,0a").toString().toUpperCase()
            }
            tick={{ textAnchor: "start" }}
            width={45}
            dx={-40}
            yAxisId={"left"}
            dataKey={"gmv"}
            orientation={"left"}
            tickCount={6}
            type={"number"}
          />
          <Tooltip imageFormatter={() => null} formatter={renderTooltip} />
          <Line yAxisId={"left"} dataKey={"gmv"} strokeWidth={4} />
        </LineChart>
      </div>
    </div>
  );
};

export default observer(FBSMerchantSalesGraph);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        salesTitle: {
          color: palettes.textColors.Ink,
          fontSize: 24,
          fontWeight: weightBold,
          lineHeight: 1.33,
        },
        dateRange: {
          display: "flex",
          flexDirection: "row",
          align: "center",
        },
        dateRangeLabel: {
          color: palettes.textColors.LightInk,
          fontSize: 16,
          fontWeight: weightMedium,
          marginRight: 8,
          padding: "10px 0px",
        },
        totals: {
          display: "flex",
          flexDirection: "row",
          marginTop: 24,
          marginBottom: 50,
        },
        statBox: {
          width: "calc(100% / 3)",
        },
        statBoxSeparator: {
          borderRadius: 4,
          borderRight: "1px dotted rgba(175, 199, 209, 0.5)",
          marginRight: 16,
        },
        tooltipContainer: {
          display: "flex",
          flexDirection: "column",
        },
        tooltipTitle: {
          color: palettes.coreColors.WishBlue,
          fontWeight: weightMedium,
          fontSize: 14,
          lineHeight: 1.43,
        },
        tooltipContent: {
          border: "none",
          width: "100%",
        },
        tooltipDateRange: {
          color: palettes.coreColors.DarkWishBlue,
          fontSize: 14,
          fontWeight: weightMedium,
          lineHeight: 1.43,
        },
        tooltipLabel: {
          color: palettes.textColors.LightInk,
          fontSize: 14,
          fontWeight: weightMedium,
          lineHeight: 1.43,
        },
        tooltipValue: {
          color: palettes.textColors.Ink,
          fontSize: 14,
          fontWeight: weightBold,
          lineHeight: 1.43,
          paddingLeft: 16,
        },
      }),
    []
  );
};
