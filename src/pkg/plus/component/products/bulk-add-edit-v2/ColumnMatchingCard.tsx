/*
 * ColumnMatchingCard.tsx
 *
 * Created by Jonah Dlin on Thu Apr 01 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Legacy */
import { cni18n, ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Card, Layout, SimpleSelect, Text } from "@ContextLogic/lego";
import { weightMedium } from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import { PickedProductCsvImportColumnSchema } from "@toolkit/products/bulk-add-edit-v2";
import { Illustration } from "@merchant/component/core";

export enum ColumnCategory {
  "required",
  "optional",
}

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
  readonly type: ColumnCategory;
};

const ColumnMatchingCard: React.FC<Props> = ({
  className,
  style,
  state,
  type,
}: Props) => {
  const {
    requiredColumns,
    optionalColumns,
    columnMapping,
    userColumnOptions,
    errorMessage,
    getSelectedUserColumnIndex,
    updateColumnMapping,
  } = state;

  const [isViewingExactlyMapped, setIsViewingExactlyMapped] = useState(false);

  const styles = useStylesheet({ isViewingExactlyMapped });

  const columns =
    type === ColumnCategory.required ? requiredColumns : optionalColumns;
  const title =
    type === ColumnCategory.required
      ? cni18n(
          "'Attribute' here refers to a column in a spreadsheet",
          requiredColumns.length,
          "Required attribute",
          "Required attributes"
        )
      : cni18n(
          "'Attribute' here refers to a column in a spreadsheet",
          optionalColumns.length,
          "Optional attribute",
          "Optional attributes"
        );

  const expandRowTitle =
    type === ColumnCategory.required
      ? ci18n(
          "'Attribute' here refers to a column in a spreadsheet",
          "View all mapped required attributes"
        )
      : ci18n(
          "'Attribute' here refers to a column in a spreadsheet",
          "View all mapped optional attributes"
        );

  const [exactlyMappedColumns, otherColumns] = useMemo(
    () =>
      _.partition(columns, ({ columnId }) => {
        const isExactMatch = columnMapping.get(columnId)?.isExactMatch;
        return isExactMatch != null && isExactMatch;
      }),
    [columns, columnMapping]
  );

  const Row: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <Layout.GridRow
      className={css(styles.row)}
      templateColumns="30% minmax(calc(70% - 8px), 310px)"
      gap="0px 8px"
    >
      {children}
    </Layout.GridRow>
  );

  const renderColumns = (
    columnList: ReadonlyArray<PickedProductCsvImportColumnSchema>
  ) =>
    columnList.map(({ name, columnId }) => {
      const selectedIndex = getSelectedUserColumnIndex(columnId);
      const errorMsg = errorMessage({
        columnId,
        allowMissing: type === ColumnCategory.optional,
      });

      return (
        <Row key={columnId}>
          <Text className={css(styles.columnName)}>{name}</Text>
          <Layout.FlexColumn>
            <SimpleSelect
              className={css(
                styles.columnSelect,
                errorMsg != null && styles.selectError
              )}
              options={userColumnOptions}
              placeholder="--"
              selectedValue={selectedIndex?.toString()}
              onSelected={(value: string) =>
                updateColumnMapping({
                  index: value == null ? undefined : parseInt(value),
                  columnId,
                })
              }
            />
            {errorMsg != null && (
              <div className={css(styles.errorMessage)}>{errorMsg}</div>
            )}
          </Layout.FlexColumn>
        </Row>
      );
    });

  return (
    <div className={css(styles.root, className, style)}>
      <Text className={css(styles.title)} weight="semibold">
        {title}
      </Text>
      <Card
        title={() => (
          <Row>
            <Text className={css(styles.cardTitle)} weight="semibold">
              Wish attribute
            </Text>
            <Text className={css(styles.cardTitle)} weight="semibold">
              CSV column header
            </Text>
          </Row>
        )}
      >
        <Layout.FlexColumn className={css(styles.content)}>
          {otherColumns.length > 0 ? (
            renderColumns(otherColumns)
          ) : (
            <Text className={css(styles.allMappedText)}>
              All columns have been mapped.
            </Text>
          )}
        </Layout.FlexColumn>
        {isViewingExactlyMapped && (
          <div className={css(styles.exactlyMappedColumns)}>
            {renderColumns(exactlyMappedColumns)}
          </div>
        )}
        {exactlyMappedColumns.length > 0 && (
          <div
            className={css(styles.expandRow)}
            onClick={() => setIsViewingExactlyMapped(!isViewingExactlyMapped)}
          >
            <Illustration
              className={css(styles.expandIcon)}
              name="chevronRightBlue"
              alt={isViewingExactlyMapped ? "collapse" : "expand"}
            />
            <Text className={css(styles.expandText)} weight="semibold">
              {expandRowTitle}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

const useStylesheet = ({
  isViewingExactlyMapped,
}: {
  isViewingExactlyMapped: boolean;
}) => {
  const { negative, textBlack, textDark, borderPrimary, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        title: {
          color: textDark,
          fontSize: 16,
          lineHeight: 1.5,
          marginBottom: 12,
        },
        content: {
          padding: "8px 24px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        row: {
          width: "100%",
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
        cardTitle: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        allMappedText: {
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          margin: "6px 0px",
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        columnName: {
          fontSize: 14,
          lineHeight: "20px",
          fontWeight: weightMedium,
          margin: "10px 0px",
        },
        columnSelect: {
          width: "100%",
          height: 40,
        },
        selectError: {
          border: `1px solid ${negative}`,
        },
        errorMessage: {
          fontSize: 12,
          color: negative,
          fontWeight: weightMedium,
          lineHeight: "16px",
          marginTop: 4,
        },
        exactlyMappedColumns: {
          padding: "8px 24px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        expandRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "14px 28px",
          opacity: 1,
          transition: "opacity 0.3s linear",
          cursor: "pointer",
          userSelect: "none",
          ":hover": {
            opacity: 0.3,
          },
        },
        expandIcon: {
          marginRight: 12,
          maxHeight: 14,
          transform: isViewingExactlyMapped ? "rotate(-90deg)" : undefined,
        },
        expandText: {
          ontSize: 14,
          lineHeight: "20px",
          color: primary,
        },
      }),
    [
      negative,
      textBlack,
      textDark,
      borderPrimary,
      isViewingExactlyMapped,
      primary,
    ]
  );
};

export default observer(ColumnMatchingCard);
