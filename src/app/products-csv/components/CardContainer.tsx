/* eslint-disable @typescript-eslint/no-misused-promises */
/*
 *
 * ProductCsvHistory.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/28/2024
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import {
  DOWNLOAD_CSV_MUTATION,
  DownloadCsvResponseType,
  DownloadCsvRequestType,
} from "@all-products/toolkit";
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { Card, Layout, Text, Link } from "@ContextLogic/lego";

import Icon from "@core/components/Icon";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import {
  CsvProductImportJobDetailSchema,
  DownloadBulkCsvFileType,
} from "@schema";

type ResponseType_JobDetail = CsvProductImportJobDetailSchema;

type Props = BaseProps & {
  readonly propData?: ResponseType_JobDetail;
};

const ProductCsvHistory: React.FC<Props> = (props: Props) => {
  const toastStore = useToastStore();
  const { className, style, propData } = props;
  const styles = useStylesheet();

  const [downloadDisabled, setDownloadDisabled] = useState(false);

  useEffect(() => {
    if (propData?.status === "In Progress") {
      setDownloadDisabled(true);
    }
  }, [propData?.status]);

  const [downloadCsvMutation] = useMutation<
    DownloadCsvResponseType,
    DownloadCsvRequestType
  >(DOWNLOAD_CSV_MUTATION);

  const onDownload = async (fileType: DownloadBulkCsvFileType) => {
    const response = await downloadCsvMutation({
      variables: {
        input: {
          bulkCsvJobId: propData?.id || "",
          fileType: fileType,
        },
      },
    });

    const ok = response.data?.productCatalog?.downloadBulkCsvProducts?.ok;
    const errMessage: Maybe<string | ReactNode> | undefined =
      response.data?.productCatalog?.downloadBulkCsvProducts?.errorMessage;
    const downloadUrl: Maybe<string | undefined> =
      response.data?.productCatalog?.downloadBulkCsvProducts?.downloadUrl;
    const processedDownloadUrl: string | undefined = downloadUrl ?? undefined;
    if (!ok) {
      toastStore.negative(errMessage ?? `Something went wrong`);
      return;
    } else {
      window.open(processedDownloadUrl);
    }
  };
  const body = (
    <>
      <Layout.FlexColumn>
        {/* Card */}
        <Layout.FlexRow>
          <Card style={styles.card}>
            <Layout.FlexColumn style={styles.cardContainer}>
              <Layout.FlexRow justifyContent="flex-start">
                <Text style={styles.cardTitle}>
                  {ci18n("title of success jobs in card ", "Successful")}
                </Text>
                <Icon name="checkCircle" color="#49e37e" size="medium" />
              </Layout.FlexRow>
              <Layout.FlexRow style={styles.cardInnerContainer}>
                <Text style={styles.cardCount}>{propData?.aliveCount}</Text>
                <Text style={styles.cardSubtitle}>
                  {ci18n("quantity unit", "rows")}
                </Text>
              </Layout.FlexRow>
              <Link
                onClick={() => onDownload("LIVE")}
                style={
                  downloadDisabled
                    ? [
                        styles.cardDownloadButton,
                        styles.disabled,
                        styles.disableUserInteraction,
                      ]
                    : styles.cardDownloadButton
                }
              >
                {ci18n("text in download button", "Download rows")}
              </Link>
            </Layout.FlexColumn>
          </Card>
          <Card style={styles.card}>
            <Layout.FlexColumn style={styles.cardContainer}>
              <Layout.FlexRow justifyContent="flex-start">
                <Text style={styles.cardTitle}>
                  {ci18n("title of fail jobs in card ", "Errors")}
                </Text>
                <Icon name="x" color="#c8402a" size="medium" />
              </Layout.FlexRow>
              <Layout.FlexRow style={styles.cardInnerContainer}>
                <Text style={styles.cardCount}>{propData?.errorsCount}</Text>
                <Text style={styles.cardSubtitle}>
                  {ci18n("quantity unit", "rows")}
                </Text>
              </Layout.FlexRow>
              <Link
                onClick={() => onDownload("ERROR")}
                style={
                  downloadDisabled
                    ? [
                        styles.cardDownloadButton,
                        styles.disabled,
                        styles.disableUserInteraction,
                      ]
                    : styles.cardDownloadButton
                }
              >
                {ci18n("text in download button", "Download rows")}
              </Link>
            </Layout.FlexColumn>
          </Card>
        </Layout.FlexRow>
      </Layout.FlexColumn>
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
          paddingTop: 0,
        },
        card: {
          minWidth: 300,
          marginRight: 24,
        },
        cardContainer: {
          padding: 24,
          borderRadius: 8,
        },
        cardInnerContainer: {
          paddingTop: 16,
        },
        cardTitle: {
          fontWeight: 700,
          fontSize: 20,
          marginRight: 8,
        },
        cardSubtitle: {
          marginLeft: 8,
          verticalAlign: "bottom",
        },
        cardCount: {
          fontWeight: 700,
          fontSize: 34,
        },
        cardDownloadButton: {
          marginTop: 16,
        },
        disabled: {
          opacity: 0.6, // taken from Lego
        },
        disableUserInteraction: {
          pointerEvents: "none",
        },
      }),
    [],
  );
};

export default ProductCsvHistory;
