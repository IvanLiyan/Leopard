import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { ThemedLabel } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useIntQueryParam, useStringQueryParam } from "@toolkit/url";

/* Relative Imports */
import InfractionAmount from "./InfractionAmount";
import InfractionDetailRow from "./InfractionDetailRow";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo, SortOrder } from "@ContextLogic/lego";
import { TableAction } from "@ContextLogic/lego";
import { Infraction } from "@merchant/api/warnings";

export type InfractionsTableProps = BaseProps & {
  readonly fines: ReadonlyArray<Infraction>;
  readonly expandedRows?: ReadonlyArray<number> | null | undefined;
  readonly onRowExpandToggled?: (
    index: number,
    shouldExpand: boolean
  ) => unknown | null | undefined;
  readonly hideOrderStatusColumn?: boolean;
};

const InfractionsTable = (props: InfractionsTableProps) => {
  const { className, style, expandedRows, onRowExpandToggled, fines } = props;
  const styles = useStylesheet();
  const tableActions = useTableActions(props);
  const renderExpandedOrder = (fineItem: Infraction) => {
    return (
      <InfractionDetailRow
        fineItem={fineItem}
        className={css(styles.rowDetails)}
      />
    );
  };

  const [infractionSortKey, setInfractionSortKey] = useStringQueryParam(
    "infractions_sort_key"
  );

  const [infractionSortOrder, setInfractionSortOrder] = useIntQueryParam(
    "infractions_sort_order"
  );

  const onFieldSortToggled = (field: string) => {
    return (sortOrder: SortOrder) => {
      setInfractionSortKey(field);
      setInfractionSortOrder(sortOrder === "asc" ? 1 : -1);
    };
  };

  const getSortOrderForField = (field: string) => {
    if (infractionSortKey === field) {
      return infractionSortOrder === 1 ? "asc" : "desc";
    }
    return "not-applied";
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
      noDataMessage={i`No Infractions Found`}
      cellPadding="8px 14px"
      highlightRowOnHover
    >
      <Table.Column
        title={i`Created Date`}
        columnKey="creation_date"
        align="left"
        minWidth={70}
        sortOrder={getSortOrderForField("_id")}
        onSortToggled={onFieldSortToggled("_id")}
      />
      <Table.Column
        title={i`Last Updated`}
        columnKey="last_update"
        align="left"
        minWidth={70}
        sortOrder={getSortOrderForField("last_update")}
        onSortToggled={onFieldSortToggled("last_update")}
      />
      <Table.Column
        title={i`Amount`}
        columnKey="fine_amount"
        align="right"
        handleEmptyRow
        sortOrder={getSortOrderForField("fine_amount")}
        onSortToggled={onFieldSortToggled("fine_amount")}
      >
        {({ row }: CellInfo<Infraction["fine_amount"], Infraction>) => (
          <InfractionAmount fineItem={row} />
        )}
      </Table.Column>
      <Table.Column
        title={i`Infraction Reason`}
        columnKey="reason_shortname_mapping"
        align="left"
      />
      <Table.Column
        title={i`Description`}
        columnKey="merchant_reason"
        align="left"
        width="40%"
      >
        {({
          row,
          value,
        }: CellInfo<Infraction["merchant_reason"], Infraction>) =>
          row.counterfeit_reason_text
            ? `${value} - ${row.counterfeit_reason_text}`
            : value
        }
      </Table.Column>
      <Table.Column
        title={i`Infraction Status`}
        columnKey="state"
        align="left"
        minWidth={150}
      >
        {({ row, value }) => (
          <ThemedLabel theme={"LightGrey"} style={{ width: "120px" }}>
            {value}
          </ThemedLabel>
        )}
      </Table.Column>
    </Table>
  );
};

export default InfractionsTable;

const useTableActions = (
  props: InfractionsTableProps
): ReadonlyArray<TableAction> => {
  return useMemo((): ReadonlyArray<TableAction> => {
    let actions: ReadonlyArray<TableAction> = [];

    actions = [
      ...actions,
      {
        key: "view-infraction-status",
        name: i`View Infraction`,
        canApplyToRow: () => true,
        apply: ([fineItem]: ReadonlyArray<Infraction>) => {
          window.open(`/warning/view/${fineItem.id}`, "_blank");
        },
      },
    ];
    return actions;
  }, []);
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
          marginLeft: 16,
        },
        disputeTooltip: {
          marginLeft: 8,
        },
      }),
    []
  );
