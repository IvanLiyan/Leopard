import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";

/* Lego Components */
import { DownloadButton } from "@ContextLogic/lego";
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { CsvFulfillmentJobType } from "@toolkit/orders/bulk-fulfill-history";
import BulkJobStateLabel from "./BulkJobStateLabel";

type Props = BaseProps & {
  readonly jobs: ReadonlyArray<CsvFulfillmentJobType>;
};

const BulkFulfillHistoryTable: React.FC<Props> = (props: Props) => {
  const { className, style, jobs } = props;
  const styles = useStylesheet();

  return (
    <Table
      className={css(styles.root, className, style)}
      data={jobs || []}
      cellPadding="8px 60x"
      rowHeight={60}
      noDataMessage={i`You haven't started any bulk fulfillment jobs`}
    >
      <Table.Column
        title={i`Date`}
        columnKey="startTime.mmddyyyy"
        align="left"
      />

      <Table.LinkColumn
        title={i`File name`}
        columnKey="fileName"
        href={({ row }) => `/fulfillment-uploads/job/${row.id}`}
        text={({ row }) => row.fileName}
        align="left"
        width={170}
      />

      <Table.Column title={i`Status`} columnKey="status" align="center">
        {({
          row: state,
        }: CellInfo<CsvFulfillmentJobType, CsvFulfillmentJobType>) => (
          <BulkJobStateLabel status={state.status} />
        )}
      </Table.Column>
      <Table.Column title={i`Total rows`} columnKey="totalRows" align="right">
        {({ row }: CellInfo<CsvFulfillmentJobType, CsvFulfillmentJobType>) =>
          numeral(row.totalRows).format("0,0").toString()
        }
      </Table.Column>
      <Table.Column
        title={i`Orders fulfilled`}
        columnKey="fulfilledCount"
        align="right"
      >
        {({ row }: CellInfo<CsvFulfillmentJobType, CsvFulfillmentJobType>) =>
          numeral(row.fulfilledCount).format("0,0").toString()
        }
      </Table.Column>
      <Table.LinkColumn
        title={i`Errors`}
        columnKey="errorCount"
        href={({ row }) => `/fulfillment-uploads/job/${row.id}`}
        text={({ row }) =>
          row.errorCount
            ? numeral(row.errorCount).format("0,0").toString()
            : i`No errors`
        }
        align="right"
      />
      <Table.Column title={i`CSV`} columnKey="csvUrl" align="center">
        {({
          row: state,
        }: CellInfo<CsvFulfillmentJobType, CsvFulfillmentJobType>) => (
          <DownloadButton
            href={state.csvUrl}
            hideBorder
            hideText
            popoverContent={null}
          />
        )}
      </Table.Column>
    </Table>
  );
};

export default BulkFulfillHistoryTable;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    []
  );
};
