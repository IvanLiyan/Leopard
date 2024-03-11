/*
 *
 * FullReportContainer.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/28/2023
 * Copyright © 2023-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { gql } from "@gql";
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Layout, Text, Breadcrumbs, RichTextBanner } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import FullReport from "./FullReport";
import PlusWelcomeHeader from "@core/components/PlusWelcomeHeader";
import { MerchantSchema } from "@schema";
import { newBulkCsvJobDetail } from "./BulkAddEditHistory";

import { ProductCatalogSchemaNewBulkCsvJobDetailArgs } from "@schema";

export type ProductCsvHistoryInitialData = {
  readonly currentMerchant?: Pick<MerchantSchema, "showFeedProcessing"> | null;
};

const GET_NEW_CSV_JOB_DETAIL = gql(`
  query ProductCsvHistory_GetNewBulkJobsDetail(
      $bulkCsvJobId: String!
    ) {
      productCatalog {
        newBulkCsvJobDetail(bulkCsvJobId: $bulkCsvJobId) {
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
          totalCount
          aliveCount
          errorsCount
          processingCount
          underReviewCount
          noChangesCount
        }
      }
    } 
`);

const FullReportContainer: React.FC = () => {
  const styles = useStylesheet();
  const [jobId, setJobId] = useState<string>("");

  type ResponseType = {
    readonly productCatalog: {
      readonly newBulkCsvJobDetail: Readonly<newBulkCsvJobDetail>;
    };
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const currentJobId = url.searchParams.get("jobid") || "";
    setJobId(currentJobId);
  }, []);

  const { data } = useQuery<
    ResponseType,
    ProductCatalogSchemaNewBulkCsvJobDetailArgs
  >(GET_NEW_CSV_JOB_DETAIL, {
    variables: {
      bulkCsvJobId: jobId,
    },
    skip: jobId === "",
  });

  const initialData = data?.productCatalog.newBulkCsvJobDetail;

  const descriptionNode = () => {
    return (
      <div>
        {i`There's an error in your submission. Download your full error report below for more information.`}
      </div>
    );
  };

  const STATUS_ENUM = {
    "In Progress": ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job is in progress",
      "In progress",
    ),
    Failed: ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job was stopped before it could complete",
      "Failed",
    ),
    "Completed with errors": ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job has finished but may have had errors",
      "Completed with errors",
    ),
    Completed: ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job has finished but may have had errors",
      "Completed",
    ),
  };

  type StatusEnum = keyof typeof STATUS_ENUM;

  const getStatusText = (status: string) =>
    STATUS_ENUM[status as StatusEnum] || "";

  const shouldRenderRichTextBanner =
    data?.productCatalog.newBulkCsvJobDetail.status === "Failed" ||
    data?.productCatalog.newBulkCsvJobDetail.status === "Completed with errors";

  return (
    <PageRoot>
      <PlusWelcomeHeader veryRelaxed>
        <Layout.FlexColumn alignItems="flex-start">
          <Breadcrumbs
            items={[
              {
                href: "/products/csv-history",
                name: i`Product Listing Feed Status`,
                style: {
                  color: "#0E161C",
                },
              },
              {
                href: "#",
                name: i`View full report`,
              },
            ]}
          />
          <Text style={styles.subtitle}>{i`Product Listing Status`}</Text>
          <Text style={styles.statusTitle}>
            {data &&
              getStatusText(data.productCatalog.newBulkCsvJobDetail.status)}
          </Text>
          {shouldRenderRichTextBanner && (
            <RichTextBanner
              buttonText=""
              description={descriptionNode}
              sentiment="warning"
              title={i`Data Upload Error`}
            />
          )}
        </Layout.FlexColumn>
      </PlusWelcomeHeader>
      <PageGuide veryRelaxed>
        <FullReport initialData={initialData} />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        subtitle: {
          maxWidth: 640,
          marginTop: 24,
        },
        statusTitle: {
          fontWeight: 700,
          fontSize: 28,
          marginBottom: 16,
        },
        button: {
          marginTop: 12,
        },
        squareButton: {
          height: 40,
          borderRadius: 4,
          marginTop: 12,
        },
      }),
    [],
  );

export default observer(FullReportContainer);
