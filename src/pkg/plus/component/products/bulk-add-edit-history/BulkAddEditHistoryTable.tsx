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
import { CsvProductJobType } from "@toolkit/products/bulk-add-edit-history";
import BulkJobStateLabel from "@plus/component/orders/bulk-fulfill-history/BulkJobStateLabel";

type Props = BaseProps & {
  readonly jobs: ReadonlyArray<CsvProductJobType>;
};

const BulkAddEditHistoryTable: React.FC<Props> = (props: Props) => {
  const { className, style, jobs } = props;
  const styles = useStylesheet();

  return (
    <Table
      className={css(styles.root, className, style)}
      data={jobs || []}
      cellPadding="8px 60x"
      rowHeight={60}
      noDataMessage={i`You haven't started any product jobs`}
    >
      <Table.Column
        title={i`Date`}
        columnKey="startTime.mmddyyyy"
        align="left"
      />

      <Table.LinkColumn
        title={i`File name`}
        columnKey="fileName"
        href={({ row }) => `/uploads/job/${row.id}`}
        text={({ row }) => row.fileName}
        align="left"
        width={170}
      />

      <Table.Column title={i`Status`} columnKey="status" align="center">
        {({ row: state }: CellInfo<CsvProductJobType, CsvProductJobType>) => (
          <BulkJobStateLabel status={state.status} />
        )}
      </Table.Column>
      <Table.Column title={i`Total rows`} columnKey="totalRows" align="right">
        {({ row }: CellInfo<CsvProductJobType, CsvProductJobType>) =>
          numeral(row.totalRows).format("0,0").toString()
        }
      </Table.Column>
      <Table.Column
        title={i`Products added`}
        columnKey="addedCount"
        align="right"
      >
        {({ row }: CellInfo<CsvProductJobType, CsvProductJobType>) =>
          numeral(row.addedCount).format("0,0").toString()
        }
      </Table.Column>
      <Table.Column
        title={i`Products edited`}
        columnKey="updatedCount"
        align="right"
      >
        {({ row }: CellInfo<CsvProductJobType, CsvProductJobType>) =>
          numeral(row.updatedCount).format("0,0").toString()
        }
      </Table.Column>
      <Table.NumeralColumn
        title={i`Processed`}
        columnKey="processedCount"
        align="right"
      />
      <Table.LinkColumn
        title={i`Errors`}
        columnKey="errorCount"
        href={({ row }) => `/uploads/job/${row.id}`}
        text={({ row }) =>
          row.errorCount
            ? numeral(row.errorCount).format("0,0").toString()
            : i`No errors`
        }
        align="right"
      />
      <Table.Column title={i`CSV`} columnKey="csvUrl" align="center">
        {({ row: state }: CellInfo<CsvProductJobType, CsvProductJobType>) => (
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

export default BulkAddEditHistoryTable;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    []
  );
};
