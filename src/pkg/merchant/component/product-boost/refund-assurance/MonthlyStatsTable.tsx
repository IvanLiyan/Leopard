/*
 * RefundAssurance.tsx
 *
 * Created by Jonah Dlin on Tue Mar 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Lego Components */
import { css } from "@toolkit/styling";

import { useTheme } from "@merchant/stores/ThemeStore";
import {
  LearnMoreLink,
  PickedMonthlyRefundAssuranceStats,
} from "@toolkit/product-boost/refund-assurance";
import { Table, ThemedLabel } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { RefundAssuranceTooltip } from "@toolkit/product-boost/refund-assurance";

export type MonthlyStatsTableColumn =
  | "MONTH"
  | "PB_SPEND"
  | "GMV"
  | "REFUND_GMV"
  | "ORDERS"
  | "REFUND_ORDERS"
  | "REFUND_RATE"
  | "CREDIT_RECEIVED";

type Props = BaseProps & {
  readonly monthlyStats: ReadonlyArray<PickedMonthlyRefundAssuranceStats>;
  readonly hiddenColumns?: ReadonlyArray<MonthlyStatsTableColumn>;
  readonly spendDiscountFactor: number;
  readonly guaranteedRefundRate: number;
};

const RefundAssurance: React.FC<Props> = ({
  className,
  style,
  monthlyStats,
  hiddenColumns = [],
  spendDiscountFactor,
  guaranteedRefundRate,
}: Props) => {
  const styles = useStylesheet();

  const creditReceivedDesc =
    i`ProductBoost Credit received for the specified month, based on monthly` +
    i` GMV and refund rate. Specifically, ProductBoost Credit = monthly ` +
    i`GMV * (monthly refund rate - ${guaranteedRefundRate * 100}%), ` +
    i`up to ${spendDiscountFactor * 100}% of monthly ProductBoost spend. ` +
    i`[Learn more](${LearnMoreLink})`;

  return (
    <div className={css(styles.root, className, style)}>
      <Table className={css(styles.table)} data={monthlyStats}>
        {!hiddenColumns.includes("MONTH") && (
          <Table.Column
            title={i`Month`}
            columnKey="month.formatted"
            align="left"
          />
        )}

        {!hiddenColumns.includes("PB_SPEND") && (
          <Table.Column
            title={i`ProductBoost spend`}
            columnKey="spend.display"
            align="left"
            description={RefundAssuranceTooltip.MONTHLY_LEVEL_SPEND_COLUMN}
          />
        )}

        {!hiddenColumns.includes("GMV") && (
          <Table.Column
            title={i`GMV`}
            columnKey="advancedLogisticsGmv.display"
            align="left"
            description={RefundAssuranceTooltip.MONTHLY_LEVEL_GMV_COLUMN}
          />
        )}

        {!hiddenColumns.includes("REFUND_GMV") && (
          <Table.Column
            title={i`Refund GMV`}
            columnKey="refundAdvancedLogisticsGmv.display"
            align="left"
            description={RefundAssuranceTooltip.MONTHLY_LEVEL_REFUND_GMV_COLUMN}
          />
        )}

        {!hiddenColumns.includes("ORDERS") && (
          <Table.NumeralColumn
            title={i`Orders`}
            columnKey="advancedLogisticsOrdersCount"
            align="left"
            description={RefundAssuranceTooltip.MONTHLY_LEVEL_ORDERS_COLUMN}
          />
        )}
        {!hiddenColumns.includes("REFUND_ORDERS") && (
          <Table.NumeralColumn
            title={i`Refund orders`}
            columnKey="refundedAdvancedLogisticsOrdersCount"
            align="left"
            description={
              RefundAssuranceTooltip.MONTHLY_LEVEL_REFUND_ORDERS_COLUMN
            }
          />
        )}

        {!hiddenColumns.includes("REFUND_RATE") && (
          <Table.Column
            title={i`Refund rate`}
            columnKey="refundRate"
            align="left"
            description={
              RefundAssuranceTooltip.MONTHLY_LEVEL_REFUND_RATE_COLUMN
            }
          >
            {({
              row: { refundRate },
            }: {
              row: PickedMonthlyRefundAssuranceStats;
            }) =>
              refundRate != null
                ? `${_.round(refundRate * 100, 1)}%`
                : i`No Data`
            }
          </Table.Column>
        )}

        {!hiddenColumns.includes("CREDIT_RECEIVED") && (
          <Table.Column
            title={i`ProductBoost credit received`}
            columnKey="creditIssued.display"
            align="left"
            description={creditReceivedDesc}
          >
            {({
              row: {
                creditIssued: { display },
                creditIssuedStatus,
              },
            }: {
              row: PickedMonthlyRefundAssuranceStats;
            }) =>
              creditIssuedStatus === "PENDING" ? (
                <ThemedLabel theme="LightGrey" text={i`Pending`} />
              ) : (
                display
              )
            }
          </Table.Column>
        )}
      </Table>
    </div>
  );
};

export default observer(RefundAssurance);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          backgroundColor: pageBackground,
        },
        table: {
          margin: 16,
          flex: 1,
        },
      }),
    [pageBackground]
  );
};
