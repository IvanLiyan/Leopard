import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import OrderFineAmount from "./OrderFineAmount";
import OrderFineDisputeLabel from "./OrderFineDisputeLabel";
import TransactionFineDetailRow from "./TransactionFineDetailRow";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import { TableAction } from "@ContextLogic/lego";
import { FineDisplayItem } from "@merchant/api/fines";

export type OrderFinesTableProps = BaseProps & {
  readonly fines: ReadonlyArray<FineDisplayItem>;
  readonly expandedRows?: ReadonlyArray<number> | null | undefined;
  readonly onRowExpandToggled?: (
    index: number,
    shouldExpand: boolean
  ) => unknown | null | undefined;
  readonly hideOrderStatusColumn?: boolean;
};

const OrderFinesTable = (props: OrderFinesTableProps) => {
  const { className, style, expandedRows, onRowExpandToggled, fines } = props;
  const styles = useStylesheet();
  const tableActions = useTableActions(props);
  const renderExpandedOrder = (fineItem: FineDisplayItem) => {
    return (
      <TransactionFineDetailRow
        fineItem={fineItem}
        className={css(styles.rowDetails)}
      />
    );
  };

  return (
    <Table
      className={css(styles.root, className, style)}
      data={fines}
      rowExpands={() => true} // all rows expand
      expandedRows={expandedRows}
      renderExpanded={renderExpandedOrder}
      onRowExpandToggled={onRowExpandToggled}
      actions={tableActions}
      noDataMessage={i`No Order Penalties Found`}
      cellPadding="8px 14px"
      highlightRowOnHover
    >
      <Table.Column
        title={i`Penalty Date`}
        columnKey="created_time"
        align="left"
        minWidth={70}
      />

      <Table.ObjectIdColumn
        title={i`Order ID`}
        columnKey="transaction_id"
        minWidth={100}
        align="left"
        showFull={false}
        copyOnBodyClick
      />

      <Table.Column title={i`Penalty`} columnKey="fine_amount" align="left">
        {({ row }: CellInfo<number, FineDisplayItem>) => (
          <OrderFineAmount fineItem={row} />
        )}
      </Table.Column>

      <Table.Column title={i`Policy`} columnKey="fine_spec.name" align="left">
        {({ row, value }) => (
          <div className={css(styles.reasonColumn)}>
            <Popover
              className={css(styles.reasonText)}
              position="top center"
              popoverMaxWidth={250}
              popoverContent={row.fine_spec.policy_explanation}
            >
              {value}
            </Popover>
          </div>
        )}
      </Table.Column>

      <Table.Column
        title={i`Reason`}
        columnKey="message"
        align="left"
        width="50%"
      >
        {({ row, value }) => (
          <span
            style={{
              textDecoration: row.is_reversed ? "line-through" : undefined,
            }}
          >
            {value}
          </span>
        )}
      </Table.Column>

      <Table.Column
        title={i`Dispute Status`}
        columnKey="dispute_state"
        width="15%"
        handleEmptyRow
        minWidth={105}
      >
        {({ row, value }) => (
          <OrderFineDisputeLabel currentDisputeStatus={value} fineItem={row} />
        )}
      </Table.Column>
    </Table>
  );
};

export default OrderFinesTable;

const useTableActions = (
  props: OrderFinesTableProps
): ReadonlyArray<TableAction> => {
  const { hideOrderStatusColumn } = props;

  return useMemo((): ReadonlyArray<TableAction> => {
    let actions: ReadonlyArray<TableAction> = [];

    if (!hideOrderStatusColumn) {
      actions = [
        ...actions,
        {
          key: "view-order-status",
          name: i`View Order`,
          canApplyToRow: () => true,
          href: ([fineItem]: ReadonlyArray<FineDisplayItem>) =>
            `/order/${fineItem.transaction_id}`,
        },
      ];
    }

    actions = [
      ...actions,
      {
        key: "dispute",
        name: i`Dispute`,
        canBatch: false,
        canApplyToRow: (fineItem: FineDisplayItem) =>
          fineItem.create_dispute_url != null,
        href: ([fineItem]: ReadonlyArray<FineDisplayItem>) =>
          fineItem.create_dispute_url,
      },
      {
        key: "view-dispute",
        name: i`View Dispute`,
        canBatch: false,
        canApplyToRow: (fineItem: FineDisplayItem) =>
          fineItem.dispute_id != null,
        href: ([fineItem]: ReadonlyArray<FineDisplayItem>) => {
          const disputeId = fineItem.dispute_id;
          if (disputeId == null) {
            return null;
          }

          if (fineItem.is_tracking_fine) {
            return `/tracking-dispute/${disputeId}`;
          }
          return `/dispute/${disputeId}`;
        },
      },
    ];

    return actions;
  }, [hideOrderStatusColumn]);
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {},
        rowDetails: {
          padding: "15px 20px",
          background: "#F6F8F9",
        },
        detailTab: {
          padding: 20,
        },
        reasonColumn: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        reasonText: {
          textDecoration: "underline",
          cursor: "default",
        },
        tooltip: {
          marginLeft: 15,
        },
        disputeTooltip: {
          marginLeft: 8,
        },
      }),
    []
  );
