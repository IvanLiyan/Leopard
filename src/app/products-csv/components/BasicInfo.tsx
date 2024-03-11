/*
 *
 * ProductCsvHistory.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/27/2024
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { ci18n } from "@core/toolkit/i18n";
import { ProductCsvJobTypeDisplayNames } from "./BulkAddEditHistory";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CsvProductImportJobDetailSchema } from "@schema";
import { formatDatetimeLocalized } from "@core/toolkit/datetime";
import moment from "moment/moment";

type ResponseType_JobDetail = CsvProductImportJobDetailSchema;

type Props = BaseProps & {
  readonly propData?: ResponseType_JobDetail;
};

const ProductCsvHistory: React.FC<Props> = (props: Props) => {
  const { className, style, propData } = props;
  const styles = useStylesheet();

  const body = (
    <>
      <Layout.FlexColumn>
        <Text style={styles.title}>
          {ci18n("card module title", "Basic Info")}
        </Text>
        <Layout.FlexRow>
          <Layout.FlexColumn style={styles.flexLeft}>
            <Text style={styles.text}>{ci18n("data title", "Job ID")}</Text>
            <Text style={styles.text}>{ci18n("data title", "File name")}</Text>
            <Text style={styles.text}>
              {ci18n("data title", "Submitted time")}
            </Text>
            <Text style={styles.text}>
              {ci18n("data title", "Completed time")}
            </Text>
            <Text style={styles.text}>{ci18n("data title", "Type")}</Text>
          </Layout.FlexColumn>
          <Layout.FlexColumn>
            <Layout.FlexRow>
              <Text style={styles.text}>{propData?.id}</Text>
            </Layout.FlexRow>
            <Layout.FlexRow>
              <Text style={styles.text}>{propData?.fileName}</Text>
            </Layout.FlexRow>
            <Layout.FlexRow>
              <Text style={styles.text}>
                {propData?.startTime?.unix &&
                  formatDatetimeLocalized(
                    moment.unix(propData?.startTime?.unix),
                    "LLL",
                  )}
              </Text>
            </Layout.FlexRow>
            <Layout.FlexRow>
              <Text style={styles.text}>
                {propData?.completedTime?.unix &&
                  formatDatetimeLocalized(
                    moment.unix(propData?.completedTime?.unix),
                    "LLL",
                  )}
              </Text>
            </Layout.FlexRow>
            <Layout.FlexRow>
              <Text style={styles.text}>
                {propData?.feedType &&
                  ProductCsvJobTypeDisplayNames[propData?.feedType]}
              </Text>
            </Layout.FlexRow>
          </Layout.FlexColumn>
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
          paddingTop: 56,
        },
        title: {
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 16,
        },
        flexLeft: {
          minWidth: 238,
          marginRight: 120,
        },
        text: {
          marginTop: 8,
        },
      }),
    [],
  );
};

export default ProductCsvHistory;
