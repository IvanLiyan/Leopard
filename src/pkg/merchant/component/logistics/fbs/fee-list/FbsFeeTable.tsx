import React, { useState, useEffect, useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import FbsFeeTableExpandedRow from "./FbsFeeTableExpandedRow";

import { Fee } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SortOrder } from "@ContextLogic/lego";
import { FBSFeeTableAdditionalDetails } from "./FbsFeeTableExpandedRow";

export type FBSFeeTableRowDetails = {
  readonly date: number;
  readonly amount: number;
  readonly type: ReactNode;
  readonly status: ReactNode;
  readonly invoiceId: ReactNode;
  readonly additionalInfo?: FBSFeeTableAdditionalDetails;
};

//timeFromAPI has format YYYY-MM-DD HH:MM:SS
const convertTimeFormat = (timeFromApi: string): number => {
  const date = new Date(timeFromApi);
  return date.getTime() / 1000;
};

export type FBSFeeTableProp = BaseProps & {
  readonly fbsFees: ReadonlyArray<Fee>;
  readonly renderFeeTypeByValue: (arg0: number) => ReactNode;
  readonly renderFeeStatusByValue: (arg0: number) => ReactNode;
  readonly sortByAmountOrder: SortOrder;
  readonly sortByDateOrder: SortOrder;
  readonly onSortByAmountClicked: (arg0: SortOrder) => unknown;
  readonly onSortByDateClicked: (arg0: SortOrder) => unknown;
};

const FbwFeeTable = (props: FBSFeeTableProp) => {
  const styles = useStyleSheet();
  const {
    fbsFees,
    renderFeeTypeByValue,
    renderFeeStatusByValue,
    sortByAmountOrder,
    sortByDateOrder,
    onSortByAmountClicked,
    onSortByDateClicked,
  } = props;
  // expand detail component
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  useEffect(() => {
    setExpandedRows(new Set([]));
  }, [fbsFees]);
  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };
  const feeRows = useMemo((): Array<FBSFeeTableRowDetails> => {
    const rows = fbsFees.map((fee) => {
      const weightUnit = fee.weight_unit ? fee.weight_unit : "g";
      const additionalInfo: FBSFeeTableAdditionalDetails = {
        ...(fee.skus ? { skus: fee.skus } : {}),
        ...(fee.weight ? { weight: fee.weight.toString() + weightUnit } : {}),
        ...(fee.order_id ? { orderId: fee.order_id } : {}),
        ...(fee.shipping_plan_id
          ? { shippingPlanId: fee.shipping_plan_id }
          : {}),
        ...(fee.fbw_shipping_plan_id
          ? { fbwShippingPlanId: fee.fbw_shipping_plan_id }
          : {}),
      };
      let status = renderFeeStatusByValue(fee.invoice_status);
      if (status instanceof Function) {
        status = status();
      }
      const row: FBSFeeTableRowDetails = {
        date: convertTimeFormat(fee.created_time),
        amount: fee.amount,
        type: renderFeeTypeByValue(fee.fee_type),
        status,
        invoiceId: fee.invoice_id ? fee.invoice_id : "",
        additionalInfo,
      };
      return row;
    });
    return rows;
  }, [fbsFees, renderFeeStatusByValue, renderFeeTypeByValue]);
  return (
    <Table
      className={css(styles.root)}
      data={feeRows}
      maxVisibleColumns={9}
      noDataMessage={i`No fees found`}
      rowExpands={() => true}
      renderExpanded={(row) => (
        <FbsFeeTableExpandedRow {...row.additionalInfo} />
      )}
      highlightRowOnHover
      expandedRows={Array.from(expandedRows)}
      onRowExpandToggled={onRowExpandToggled}
    >
      <Table.DatetimeColumn
        title={i`Date`}
        columnKey="date"
        width={90}
        sortOrder={sortByDateOrder}
        onSortToggled={onSortByDateClicked}
        format={"YYYY-MM-DD"}
      />
      <Table.Column title={i`Fee type`} columnKey="type" width={200} />
      <Table.CurrencyColumn
        title={i`Fee amount (USD)`}
        columnKey="amount"
        currencyCode="USD"
        width={150}
        sortOrder={sortByAmountOrder}
        onSortToggled={onSortByAmountClicked}
      />
      <Table.Column title={i`Fee status`} columnKey="status" width={170} />
      <Table.LinkColumn
        title={i`Invoice`}
        columnKey="invoiceId"
        width={400}
        text={(cell) => cell.row.invoiceId || i`N/A`}
        href={(cell) =>
          cell.row.invoiceId ? `/fbw/invoice/view/${cell.row.invoiceId}` : ""
        }
        openInNewTab
      />
    </Table>
  );
};

export default observer(FbwFeeTable);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    []
  );
};
