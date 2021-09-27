/*
 *
 * HeaderDropdowns.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { H6, SimpleSelect } from "@ContextLogic/lego";
import { weightMedium } from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductState";

export enum ColumnCategory {
  "required",
  "optional",
}

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
  readonly type: ColumnCategory;
};

const HeaderDropdowns: React.FC<Props> = (props: Props) => {
  const { className, style, state, type } = props;
  const styles = useStylesheet();

  const {
    requiredColumns,
    optionalColumns,
  } = state.initialData.platformConstants.productCsvImportColumns;

  const { optionalColumnsOverride } = state;

  const optionalColumnsToUse = optionalColumnsOverride.length
    ? optionalColumnsOverride
    : optionalColumns;

  const headers =
    type === ColumnCategory.required ? requiredColumns : optionalColumnsToUse;
  const title =
    type === ColumnCategory.required
      ? ni18n(requiredColumns.length, "Required column", "Required columns")
      : ni18n(
          optionalColumnsToUse.length,
          "Optional column",
          "Optional columns"
        );
  const options = state.userColumnOptions;

  const rows = headers.map((header) => {
    const { name } = header;
    const selectedValue = state.getSelectionIndex(name)?.toString();
    const errorMsg = state.errorMessage({
      columnName: name,
      allowMissing: type === ColumnCategory.optional,
    });

    let selectCss = css(styles.columnSelect);
    let errorMessage;
    if (errorMsg) {
      selectCss = css(styles.columnSelect, styles.selectError);
      errorMessage = <div className={css(styles.errorMessage)}>{errorMsg}</div>;
    }

    return (
      <div className={css(styles.row)} key={name}>
        <div className={css(styles.columnName)}>{name}</div>
        <SimpleSelect
          className={selectCss}
          options={options}
          placeholder="--"
          selectedValue={selectedValue}
          onSelected={(value: string) =>
            state.updateColumnMapping({
              index: value == null ? value : parseInt(value),
              columnName: name,
            })
          }
        />
        {errorMessage}
      </div>
    );
  });

  return (
    <div className={css(styles.root, className, style)}>
      <H6 className={css(styles.title)}>{title}</H6>
      <div className={css(styles.rowsContainer)}>{rows}</div>
    </div>
  );
};

const useStylesheet = () => {
  const { negativeDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        title: {
          marginBottom: 12,
        },
        rowsContainer: {
          maxWidth: 306,
        },
        row: {
          display: "flex",
          flexDirection: "column",
          fontSize: 16,
          lineHeight: "24px",
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        columnName: {
          fontSize: 14,
          lineHeight: "20px",
          fontWeight: weightMedium,
          marginBottom: 4,
        },
        columnSelect: {
          width: "100%",
          height: 40,
        },
        selectError: {
          border: `1px solid ${negativeDark}`,
        },
        errorMessage: {
          fontSize: 12,
          color: negativeDark,
          fontWeight: weightMedium,
          lineHeight: "16px",
          marginTop: 4,
        },
      }),
    [negativeDark]
  );
};

export default observer(HeaderDropdowns);
