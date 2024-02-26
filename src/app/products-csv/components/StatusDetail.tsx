/*
 *
 * ProductCsvHistory.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/29/2024
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Layout, Text, Popover } from "@ContextLogic/lego";

import Icon from "@core/components/Icon";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";

import { CsvProductImportJobDetailSchema } from "@schema";

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
        <Text style={styles.title}>{ci18n("card title", "Status Detail")}</Text>
        <Layout.FlexRow>
          <Layout.FlexColumn style={styles.flexLeft}>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>
                {ci18n("type of job count", "Total")}
              </Text>
              <Popover
                popoverContent={i`Total rows in the CSV file`}
                position="top center"
              >
                <Icon name="info" size="small" />
              </Popover>
            </Layout.FlexRow>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>
                {ci18n("type of job count", "Processing - CSV")}
              </Text>
              <Popover
                popoverContent={i`Number of rows in CSV being processed`}
                position="top center"
              >
                <Icon name="info" size="small" />
              </Popover>
            </Layout.FlexRow>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>
                {ci18n("type of job count", "Processing - Product review")}
              </Text>
              <Popover
                popoverContent={i`Number of rows in product reviewing`}
                position="top center"
              >
                <Icon name="info" size="small" />
              </Popover>
            </Layout.FlexRow>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>
                {ci18n("type of job count", "No changes detected")}
              </Text>
              <Popover
                popoverContent={i`Number of rows where no changes are found`}
                position="top center"
              >
                <Icon name="info" size="small" />
              </Popover>
            </Layout.FlexRow>
          </Layout.FlexColumn>
          <Layout.FlexColumn>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>{propData?.totalCount}</Text>
              <Text>{ci18n("quantity unit", "rows")}</Text>
            </Layout.FlexRow>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>{propData?.processingCount}</Text>
              <Text>{ci18n("quantity unit", "rows")}</Text>
            </Layout.FlexRow>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>{propData?.underReviewCount}</Text>
              <Text>{ci18n("quantity unit", "rows")}</Text>
            </Layout.FlexRow>
            <Layout.FlexRow style={styles.textCell}>
              <Text style={styles.text}>{propData?.noChangesCount}</Text>
              <Text>{ci18n("quantity unit", "rows")}</Text>
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
        textCell: {
          marginTop: 8,
        },
        text: {
          marginRight: 8,
          fontWeight: 700,
        },
      }),
    [],
  );
};

export default ProductCsvHistory;
