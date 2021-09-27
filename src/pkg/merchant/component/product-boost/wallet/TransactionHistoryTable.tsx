import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { ExplanationBanner } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ci18n } from "@legacy/core/i18n";

/* Merchant API */
import {
  PBBalanceTransactionRecord,
  PBCreditTransactionRecord,
} from "@merchant/api/product-boost";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TransactionHistoryRecord =
  | PBCreditTransactionRecord
  | PBBalanceTransactionRecord;

export type TransactionHistoryTableProps = BaseProps & {
  readonly currentTabKey: string;
  readonly data: ReadonlyArray<TransactionHistoryRecord>;
  readonly dailyBudgetEnabled: boolean;
};

const TransactionHistoryTable = (props: TransactionHistoryTableProps) => {
  const styles = useStyleSheet();
  const { currentTabKey, data, dailyBudgetEnabled, className } = props;
  const renderAmount = (record: TransactionHistoryRecord) => {
    const amount = record.transactionAmount?.display;
    if (!amount) {
      return null;
    }
    if (record.updatedReason === "ISSUING_CREDITS") {
      return <div className={css(styles.credit)}>{amount}</div>;
    }
    return <div className={css(styles.debit)}>{`-${amount}`}</div>;
  };

  const renderReceipt = (record: TransactionHistoryRecord) => {
    const { receiptId } = record;
    if (receiptId) {
      let receiptUrl;
      if (currentTabKey === "BALANCE") {
        receiptUrl = `/merchant-charge/${receiptId}`;
      } else if (currentTabKey === "CREDIT") {
        receiptUrl = `/warning/view/${receiptId}`;
      }
      return (
        <Link className={css(styles.receipt)} openInNewTab href={receiptUrl}>
          {receiptId}
        </Link>
      );
    }
    return null;
  };

  const renderDescription = (record: TransactionHistoryRecord) => {
    const { updateReasonDescription } = record;
    if (currentTabKey === "CREDIT") {
      // we can perform the cast safely
      const creditRecord: PBCreditTransactionRecord = record;
      const expiredDate = creditRecord.expiredDate;
      if (expiredDate && expiredDate.formatted) {
        return ci18n(
          "Placeholder 1 describes a thing that expires on the day given by Placeholder 2.",
          "%1$s (expires %2$s)",
          updateReasonDescription,
          expiredDate.formatted + " UTC"
        );
      }
    }
    return updateReasonDescription;
  };

  const renderProductId = (record: TransactionHistoryRecord) => {
    const { productId } = record;
    if (productId) {
      return <div className={css(styles.text)}>{productId}</div>;
    }
    return null;
  };

  const renderCampaignID = (record: TransactionHistoryRecord) => {
    const { campaignId } = record;
    if (campaignId) {
      const url = `/product-boost/detail/${campaignId}#invoice`;
      return (
        <Link className={css(styles.campaignId)} openInNewTab href={url}>
          {campaignId}
        </Link>
      );
    }
    return null;
  };

  return (
    <Table
      className={css(styles.root, className)}
      data={data}
      noDataMessage={() => (
        <ExplanationBanner>
          <ExplanationBanner.Item
            title={
              currentTabKey === "BALANCE"
                ? i`You have no available balance`
                : i`You have not received any ProductBoost credit yet`
            }
            illustration="productBoostTransaction"
            maxWidth={1000}
          >
            <Markdown
              className={css(styles.text)}
              openLinksInNewTab
              text={
                dailyBudgetEnabled
                  ? i`To promote and boost the impressions of your products, ` +
                    i`please recharge your ProductBoost balance. ` +
                    i`[Recharge balance](${"/buy-product-boost-credits"})`
                  : i`To create campaigns and boost the impressions of your products, ` +
                    i`please recharge your ProductBoost balance. ` +
                    i`[Recharge balance](${"/buy-product-boost-credits"})`
              }
            />
          </ExplanationBanner.Item>
        </ExplanationBanner>
      )}
      maxVisibleColumns={20}
    >
      <Table.Column
        title={i`Date`}
        columnKey="dateCreated.formatted"
        align="left"
        width={200}
        noDataMessage={""}
      />
      <Table.Column
        title={i`Receipt`}
        columnKey="receiptId"
        align="left"
        width={200}
        style={{ textOverflow: "ellipsis" }}
      >
        {({ row }) => renderReceipt(row)}
      </Table.Column>
      <Table.Column
        title={i`Description`}
        columnKey="updateReasonDescription"
        align="left"
        width={300}
        noDataMessage={""}
      >
        {({ row }) => renderDescription(row)}
      </Table.Column>
      {dailyBudgetEnabled && (
        <Table.Column
          title={i`Product ID`}
          columnKey="productId"
          align="left"
          width={200}
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderProductId(row)}
        </Table.Column>
      )}
      {!dailyBudgetEnabled && (
        <Table.Column
          title={i`Campaign ID`}
          columnKey="campaignId"
          align="left"
          width={200}
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderCampaignID(row)}
        </Table.Column>
      )}
      <Table.Column
        title={i`Amount`}
        columnKey="transactionAmount.display"
        align="left"
        noDataMessage=""
      >
        {({ row }) => renderAmount(row)}
      </Table.Column>
    </Table>
  );
};

const useStyleSheet = () => {
  const { positiveDark, negativeDark, primaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        credit: {
          color: positiveDark,
        },
        debit: {
          color: negativeDark,
        },
        receipt: {
          fontSize: 14,
          color: primaryDark,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
        campaignId: {
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        },
        text: {
          fontSize: 14,
          lineHeight: 1.5,
        },
      }),
    [positiveDark, negativeDark, primaryDark]
  );
};

export default observer(TransactionHistoryTable);
