import React, { useMemo } from "react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ci18n } from "@legacy/core/i18n";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  Text,
  Table,
  CellInfo,
  SortOrder,
  TableAction,
} from "@ContextLogic/lego";

import TimeToRespondLabel from "./TimeToRespondLabel";
import { TicketSortFieldType, CustomerSupportTicketState } from "@schema/types";
import { StateLabels, PickedCustomerSupportTicket } from "@toolkit/cs/center";

const MaxColumnWidth = 280;

type Props = BaseProps & {
  readonly state: CustomerSupportTicketState;
  readonly tickets: ReadonlyArray<PickedCustomerSupportTicket> | undefined;
  readonly lastUpdatedSortOrder?: SortOrder;
  readonly createdTimeSortOrder?: SortOrder;
  readonly onSortOrderChange: (
    sortField: TicketSortFieldType,
    sortOrder: SortOrder
  ) => void;
};

const TicketsTable: React.FC<Props> = (props: Props) => {
  const {
    state,
    style,
    tickets,
    className,
    lastUpdatedSortOrder,
    createdTimeSortOrder,
    onSortOrderChange,
  } = props;

  const tableActions = useTableActions(props);

  return (
    <Table
      className={css(className, style)}
      data={tickets || []}
      actions={tableActions}
      cellPadding="8px 14px"
      highlightRowOnHover
      rowHeight={78}
      actionColumnWidth={120}
      noDataMessage={i`No support tickets found with this criteria.`}
    >
      <Table.Column
        title={i`Creation Date`}
        columnKey="createdTime.mmddyyyy"
        align="left"
        sortOrder={createdTimeSortOrder}
        onSortToggled={(newOrder) =>
          onSortOrderChange("CREATED_TIME", newOrder)
        }
        width={80}
      />

      <Table.ObjectIdColumn
        title={i`Ticket ID`}
        columnKey="id"
        align="center"
        copyOnBodyClick
        width={MaxColumnWidth}
      />
      <Table.Column
        title={i`Last Updated`}
        columnKey="lastUpdateTime.formatted"
        align="left"
        sortOrder={lastUpdatedSortOrder}
        onSortToggled={(newOrder) => onSortOrderChange("LAST_UPDATE", newOrder)}
        multiline
        width={70}
      >
        {({
          row: order,
        }: CellInfo<
          PickedCustomerSupportTicket["lastUpdateTime"],
          PickedCustomerSupportTicket
        >) => (
          <Text>
            {order.lastUpdateTime.formatted} {order.lastUpdateTime.timezone}
          </Text>
        )}
      </Table.Column>

      {state == "AWAITING_MERCHANT" && (
        <Table.Column
          title={ci18n(
            "Label that indicates how much time the merchant has left to respond to the ticket",
            "Time left"
          )}
          columnKey="timeToRespond"
          align="center"
        >
          {({
            value: timeToRespond,
            row: order,
          }: CellInfo<
            PickedCustomerSupportTicket["timeToRespond"],
            PickedCustomerSupportTicket
          >) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {timeToRespond != null && (
                <TimeToRespondLabel
                  delta={timeToRespond}
                  style={{ margin: "0px 5px" }}
                />
              )}
            </div>
          )}
        </Table.Column>
      )}

      <Table.Column title={i`User`} columnKey="user.name" align="left" />

      <Table.Column
        title={i`Issue Type`}
        columnKey="issueType.label"
        align="left"
        width={MaxColumnWidth}
        multiline
      />

      <Table.Column
        title={i`Status`}
        columnKey="state"
        align="left"
        width={120}
        multiline
      >
        {({ row }: CellInfo<string, PickedCustomerSupportTicket>) => (
          <Text>{StateLabels[row.state]}</Text>
        )}
      </Table.Column>
    </Table>
  );
};

export default TicketsTable;

const useTableActions = (props: Props): ReadonlyArray<TableAction> => {
  return useMemo((): ReadonlyArray<TableAction> => {
    const actions: ReadonlyArray<TableAction> = [
      {
        key: "view",
        name: i`Details`,
        canBatch: false,
        canApplyToRow: () => true,
        href: ([ticket]: ReadonlyArray<PickedCustomerSupportTicket>) =>
          `/ticket/${ticket.id}`,
      },
    ];

    return actions;
  }, []);
};
