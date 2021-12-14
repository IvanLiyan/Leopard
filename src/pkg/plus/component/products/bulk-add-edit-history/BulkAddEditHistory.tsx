/*
 *
 * BulkAddEditHistory.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/24/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

/* Lego Components */
import {
  LoadingIndicator,
  PageIndicator,
  SimpleSelect,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { BulkAddEditHistoryInitialData } from "@plus/container/products/BulkAddEditHistoryContainer";
import { CsvProductJobType } from "@toolkit/products/bulk-add-edit-history";

import BulkAddEditHistoryTable from "./BulkAddEditHistoryTable";
import { ProductCatalogSchemaBulkCsvProductImportJobsArgs } from "@schema/types";

const GET_BULK_ADD_EDIT_JOBS = gql`
  query BulkAddEditHistory_GetBulkAddEditJobs($offset: Int!, $limit: Int!) {
    productCatalog {
      bulkCsvProductImportJobs(offset: $offset, limit: $limit) {
        id
        startTime {
          mmddyyyy
        }
        status
        csvUrl
        totalRows
        errorCount
        addedCount
        updatedCount
        processedCount
        fileName
      }
    }
  }
`;

type Props = BaseProps & {
  readonly initialData: BulkAddEditHistoryInitialData;
};

const BulkAddEditHistory: React.FC<Props> = (props: Props) => {
  const { className, style, initialData } = props;
  const styles = useStylesheet();

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const totalJobCount = initialData.productCatalog.csvProductImportJobsCount;

  type ResponseType = {
    readonly productCatalog: {
      readonly bulkCsvProductImportJobs: ReadonlyArray<CsvProductJobType>;
    };
  };

  const { data, loading: isLoadingJobs } = useQuery<
    ResponseType,
    ProductCatalogSchemaBulkCsvProductImportJobsArgs
  >(GET_BULK_ADD_EDIT_JOBS, {
    variables: {
      offset,
      limit,
    },
  });

  const jobs = data?.productCatalog.bulkCsvProductImportJobs || [];
  const loadedJobCount = jobs.length;

  const onPageChange = (nextPage: number) => {
    setOffset(limit * nextPage);
  };

  const body = (
    <>
      <div className={css(styles.pagination)}>
        <PageIndicator
          rangeStart={offset + 1}
          rangeEnd={
            totalJobCount
              ? Math.min(totalJobCount, offset + loadedJobCount)
              : offset + loadedJobCount
          }
          hasNext={
            totalJobCount
              ? offset + loadedJobCount < totalJobCount
              : loadedJobCount <= limit
          }
          hasPrev={offset > 0}
          currentPage={Math.ceil(offset / limit)}
          totalItems={totalJobCount}
          onPageChange={onPageChange}
        />
        <SimpleSelect
          options={[10, 20, 50].map((v) => ({
            value: v.toString(),
            text: v.toString(),
          }))}
          className={css(styles.limitSelect)}
          onSelected={(value: string) => setLimit(parseInt(value))}
          selectedValue={limit.toString()}
        />
      </div>
      {isLoadingJobs ? (
        <LoadingIndicator />
      ) : (
        <BulkAddEditHistoryTable jobs={jobs} />
      )}
    </>
  );

  return <div className={css(styles.root, className, style)}>{body}</div>;
};

const paginationHeight = 32;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 25,
        },
        pagination: {
          flexGrow: 1,
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 25,
          height: paginationHeight,
        },
        limitSelect: {
          height: paginationHeight,
          flex: 0,
          marginLeft: 12,
          minWidth: 40, // hack for Safari, which is having flexbox issues. TODO (lliepert): figure out the root cause
          textAlignLast: "center", // `last` required for <select>, see https://stackoverflow.com/questions/45215504/text-align-not-working-on-select-control-on-chrome/45215594
        },
      }),
    [],
  );
};

export default BulkAddEditHistory;
