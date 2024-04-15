/*
 *
 * ProductCsvHistory.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/28/2024
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { useQuery } from "@apollo/client";
import { gql } from "@gql";
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import {
  LoadingIndicator,
  PageIndicator,
  FormSelect,
  Card,
  Layout,
  Text,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ProductCsvJobTypeOrder,
  ProductCsvJobTypeDisplayNames,
  newBulkCsvJobs,
} from "./BulkAddEditHistory";

import {
  ProductCatalogSchemaNewBulkCsvJobsArgs,
  ProductCsvJobType,
  ProductCatalogSchema,
} from "@schema";
import ProductFeedHistoryTable from "./ProductFeedHistoryTable";

const GET_BULK_ADD_EDIT_JOBS_V2 = gql(`
  query ProductCsvHistory_GetNewBulkAddEditJobsV2(
      $offset: Int!,
      $limit: Int!,
      $feedType: ProductCSVJobType
    ) {
      productCatalog {
        newBulkCsvJobs(offset: $offset, limit: $limit, feedType: $feedType) {
          id
          startTime {
            unix
          }
          completedTime {
            unix
          }
          fileName
          feedType
          status
          version
        }
        newBulkCsvJobsCount(feedType: $feedType)
      }
    } 
`);

type Props = BaseProps & {
  readonly showNewProductCsvStatusPage?: boolean | null;
};

const ProductCsvHistory: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [feedType, setFeedType] = useState<ProductCsvJobType | "">("");
  const [loadingComplete, setLoadingComplete] = useState(true);

  type ResponseTypeV2 = {
    readonly productCatalog: {
      readonly newBulkCsvJobs: ReadonlyArray<newBulkCsvJobs>;
      readonly newBulkCsvJobsCount: ProductCatalogSchema["csvProductImportJobsCount"];
    };
  };
  const { data, loading } = useQuery<
    ResponseTypeV2,
    ProductCatalogSchemaNewBulkCsvJobsArgs
  >(GET_BULK_ADD_EDIT_JOBS_V2, {
    variables: {
      offset,
      limit,
      feedType: feedType == "" ? undefined : feedType,
    },
    onCompleted: () => setLoadingComplete(true),
  });
  const jobs = data?.productCatalog.newBulkCsvJobs || [];
  const totalJobCount = data?.productCatalog.newBulkCsvJobsCount || 0;
  const loadedJobCount = jobs.length;

  const onPageChange = (nextPage: number) => {
    setOffset(limit * nextPage);
  };

  useEffect(() => {
    if (loading) {
      setLoadingComplete(false);
    }
  }, [loading]);

  const body = (
    <>
      <Layout.FlexRow justifyContent="flex-start">
        <Layout.FlexRow>
          <Text style={styles.filterTitle}>
            {ci18n("filter module title", "Filter by")}
          </Text>
          <FormSelect
            style={[styles.filterSelect, styles.tableControl]}
            options={[
              { value: "", text: ci18n("An option in select", "All") },
              ...ProductCsvJobTypeOrder.map((type: ProductCsvJobType) => ({
                value: type,
                text: ProductCsvJobTypeDisplayNames[type],
              })),
            ]}
            selectedValue={feedType}
            onSelected={setFeedType}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>
      <Card style={styles.card}>
        <LoadingIndicator loadingComplete={loadingComplete}>
          <ProductFeedHistoryTable jobs={jobs} />
        </LoadingIndicator>
      </Card>
      <Layout.FlexRow justifyContent="flex-end" style={styles.header}>
        <Layout.FlexRow justifyContent="flex-end">
          <PageIndicator
            style={styles.tableControl}
            rangeStart={offset + 1}
            rangeEnd={
              totalJobCount
                ? Math.min(totalJobCount, offset + loadedJobCount)
                : offset + loadedJobCount
            }
            hasNext={offset + loadedJobCount < totalJobCount}
            hasPrev={offset > 0}
            currentPage={Math.ceil(offset / limit)}
            totalItems={totalJobCount}
            onPageChange={onPageChange}
          />
          <FormSelect
            options={[10, 20, 50].map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            style={[styles.limitSelect, styles.tableControl]}
            onSelected={(value: string) => setLimit(parseInt(value))}
            selectedValue={limit.toString()}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>
    </>
  );

  return <div className={css(styles.root, className, style)}>{body}</div>;
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingTop: 25,
        },
        filterTitle: {
          fontWeight: 400,
          fontSize: 14,
          marginRight: 14,
        },
        header: {
          padding: "17px 24px",
        },
        card: {
          marginTop: 16,
        },
        filterSelect: {
          minWidth: 240,
          marginLeft: 8,
        },
        limitSelect: {
          flex: 0,
          marginLeft: 12,
          minWidth: 40, // hack for Safari, which is having flexbox issues. TODO (lliepert): figure out the root cause
          textAlignLast: "center", // `last` required for <select>, see https://stackoverflow.com/questions/45215504/text-align-not-working-on-select-control-on-chrome/45215594
        },
        tableControl: {
          height: 40,
        },
      }),
    [],
  );
};

export default ProductCsvHistory;
