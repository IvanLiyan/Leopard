import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";
import { TableProps } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { Theme } from "@ContextLogic/lego";

import LocalizationStore from "@merchant/stores/LocalizationStore";

// make the default props optional
export type EarlyPaymentHistoryTableProps = Omit<TableProps, "noDataMessage">;

const EarlyPaymentHistoryTable = observer(
  (props: EarlyPaymentHistoryTableProps) => {
    const { locale } = LocalizationStore.instance();
    const isZh = locale === "zh";
    const getTheme = (status: string): Theme => {
      /* eslint-disable local-rules/unwrapped-i18n */
      switch (status) {
        case "To Be Processed":
        case "In Process":
          return "LightWishBlue";
        case "Open":
          return "CashGreen";
        case "Closed":
          return "WishBlue";
        case "Cancelled":
          return "DarkRed";
        default:
          return "LightGrey";
      }
    };
    const getStatusText = (status: string): string => {
      switch (status) {
        case "To Be Processed":
          return isZh ? "未处理" : i`To Be Processed`;
        case "In Process":
          return isZh ? "处理中" : i`In Process`;
        case "Cancelled":
          return isZh ? "已取消" : `Cancelled`;
        case "Open":
          return isZh ? "进行中" : `Open`;
        case "Closed":
          return isZh ? "已完成" : `Closed`;
        default:
          return status;
      }
    };

    /* eslint-enable local-rules/unwrapped-i18n */

    const styles = useStyleSheet();
    return (
      <Table {...props} noDataMessage={`No Early Payments`}>
        <Table.ObjectIdColumn
          title={`ID`}
          columnKey="id"
          align="left"
          showFull={false}
          copyOnBodyClick
        />
        <Table.Column
          title={isZh ? "状态" : `Status`}
          columnKey="status"
          minWidth={100}
          description={() => (
            <div className={css(styles.infoText)}>
              <p>
                {isZh
                  ? "“未处理”状态表示此项提前放款申请将在这付款周期后被处理。"
                  : i`To Be Processed: the Early Payment will be ` +
                    i`processed by the end of this payment cycle..`}
              </p>
              <p>
                {isZh
                  ? "“进行中”状态表示此项提前放款请求已经被提交。"
                  : `Open: the Early Payment has been requested.`}
              </p>
              <p>
                {isZh
                  ? "“已完成”表示此项提前放款的金额已被放款给商户，且所有还款已经扣除。"
                  : `Closed: the Early Payment amount has been disbursed and fully paid back.`}
              </p>
              <p>
                {isZh
                  ? "“已取消“表示此项提前放款请求已被取消。"
                  : `Cancelled: the Early Payment request has been cancelled.`}
              </p>
            </div>
          )}
        >
          {({ row }) => {
            return (
              <ThemedLabel theme={getTheme(row.status)} width={100}>
                {getStatusText(row.status)}
              </ThemedLabel>
            );
          }}
        </Table.Column>
        <Table.Column
          title={
            isZh ? "所请求的提前放款金额" : `Early Payment Amount Requested`
          }
          columnKey="payment_amount"
          minWidth={100}
          noDataMessage="0"
        >
          {({ row }) => {
            return formatCurrency(row.payment_amount, row.currency);
          }}
        </Table.Column>
        <Table.Column
          title={isZh ? "总还款金额" : `Total Repayment Amount`}
          columnKey="deduction_amount"
          minWidth={100}
          noDataMessage="0"
          description={
            isZh
              ? "这是此项提前放款请求所对应的总还款金额。"
              : `This is the total amount of repayment necessary for this Early Payment request.`
          }
        >
          {({ row }) => {
            return formatCurrency(row.deduction_amount, row.currency);
          }}
        </Table.Column>
        <Table.Column
          title={isZh ? "已扣除还款的次数" : `Number of Repayments Deducted`}
          columnKey="num_deducted"
          align="left"
          description={
            isZh
              ? "这是此项提前放款请求目前已经被扣除的还款次数。"
              : `The number of repayments already deducted.`
          }
        />
        <Table.Column
          title={isZh ? "总还款次数" : `Total Number of Repayments`}
          columnKey="num_repayments"
          minWidth={100}
          noDataMessage="0"
          description={
            isZh
              ? "这是此项提前放款请求所对应的总还款次数。"
              : `The total number of repayments necessary for this Early Payment.`
          }
        >
          {({ row }) => {
            return row.num_repayments;
          }}
        </Table.Column>
        <Table.DatetimeColumn
          title={
            isZh
              ? "提前放款请求时间（UTC）"
              : `Early Payment Request Time (UTC)`
          }
          columnKey="creation_time"
          minWidth={150}
          format={isZh ? "YYYY-MM-DD" : "dddd, MMMM DD, YYYY"}
          timezone={"UTC"}
          multiline
        />
        <Table.Column
          title={``}
          columnKey="view_detail"
          minWidth={50}
          handleEmptyRow
        >
          {({ row }) => {
            return (
              <SecondaryButton
                text={isZh ? "查看详情" : `View Detail`}
                href={`/merchant-early-payment-detail/${row.id}`}
              />
            );
          }}
        </Table.Column>
      </Table>
    );
  }
);

export default EarlyPaymentHistoryTable;

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        infoText: {
          fontSize: 12,
          lineHeight: 1.43,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightNormal,
          padding: 10,
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
        id: {
          fontSize: "14px",
        },
      }),
    []
  );
