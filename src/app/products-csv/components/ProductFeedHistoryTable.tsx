/*
 * ProductCsvHistoryTable.tsx
 *
 * Created by Kay Wan on 01/28/2024
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Merchant Stores */
import { useNavigationStore } from "@core/stores/NavigationStore";

/* Lego Components */
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  newBulkCsvJobs,
  ProductCsvJobTypeDisplayNames,
} from "./BulkAddEditHistory";
import BulkJobStateLabel from "./BulkJobStateLabel";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly jobs: ReadonlyArray<newBulkCsvJobs>;
};
const JOB_VERSION_ENUM = {
  OLD_PAGE: 0,
  NEW_PAGE: 1,
};

const ProductCsvHistoryTable: React.FC<Props> = (props: Props) => {
  const { className, style, jobs } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const actions = [
    {
      key: "view",
      name: i`View full report`,
      apply: ([row]: ReadonlyArray<newBulkCsvJobs>) => {
        let path = "";
        if (row.version === JOB_VERSION_ENUM.OLD_PAGE) {
          path = `/uploads/job/${row.id}`;
        } else if (row.version === JOB_VERSION_ENUM.NEW_PAGE) {
          path = `/md/uploads/job?jobid=${row.id}`;
        }
        void navigationStore.navigate(path, {
          openInNewTab: true,
        });
      },
      canApplyToRow: () => true,
    },
  ];

  return (
    <Table
      className={css(styles.root, className, style)}
      data={jobs || []}
      cellPadding="8px 60x"
      rowHeight={60}
      actions={actions}
      hideBorder
    >
      <Table.Column
        _key={undefined}
        title={ci18n("A table column title", "Job ID")}
        columnKey="id"
        width={100}
      >
        {({ row }: CellInfo<newBulkCsvJobs, newBulkCsvJobs>) => (
          <span>{row.id}</span>
        )}
      </Table.Column>

      <Table.DatetimeColumn
        _key={undefined}
        title={ci18n("A table column title", "Submitted time")}
        format="M/D/YY hh:mm:ss"
        columnKey="startTime.unix"
        align="left"
        noDataMessage="-"
      />

      <Table.DatetimeColumn
        _key={undefined}
        title={ci18n("A table column title", "Completed time")}
        format="M/D/YY hh:mm:ss"
        columnKey="completedTime.unix"
        align="left"
        noDataMessage="-"
      />

      <Table.Column
        _key={undefined}
        title={ci18n("A table column title", "File name")}
        columnKey="fileName"
        align="left"
        width={150}
        noDataMessage="-"
      />

      <Table.Column
        _key={undefined}
        title={ci18n("A table column title", "Update type")}
        columnKey="feedType"
        align="center"
        width={180}
        noDataMessage="-"
      >
        {({ row }: CellInfo<newBulkCsvJobs, newBulkCsvJobs>) =>
          ProductCsvJobTypeDisplayNames[row.feedType]
        }
      </Table.Column>

      <Table.Column
        _key={undefined}
        title={ci18n("A table column title", "Status")}
        columnKey="status"
        align="center"
        width={180}
        noDataMessage="-"
      >
        {({ row: state }: CellInfo<newBulkCsvJobs, newBulkCsvJobs>) => (
          <BulkJobStateLabel status={state.status || ""} />
        )}
      </Table.Column>
    </Table>
  );
};

export default ProductCsvHistoryTable;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    [],
  );
};
