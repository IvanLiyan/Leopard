/*
 *
 * BulkFulfill.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/14/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout } from "@ContextLogic/lego";
import DownloadPrepareCard from "./DownloadPrepareCard";
import UploadCsvCard from "./UploadCsvCard";
import HowToFulfillCard from "./HowToFulfillCard";
import ColumnMappingCard from "./ColumnMappingCard";
import BulkFulfillState from "@plus/model/BulkFulfillState";

export type CsvColumnHeader = {
  readonly name: string;
  readonly description?: string; // optional info in tooltip next to name, markdown supported
};

export type CsvColumnHeaders = {
  readonly requiredColumns: ReadonlyArray<CsvColumnHeader>;
  readonly optionalColumns: ReadonlyArray<CsvColumnHeader>;
};

export type CsvColumnHeaderWithSelect = {
  readonly name: string;
  readonly selectionId?: string;
  readonly duplicateError?: boolean;
};

export type CsvColumnHeadersWithSelect = {
  readonly requiredColumns: ReadonlyArray<CsvColumnHeaderWithSelect>;
  readonly optionalColumns: ReadonlyArray<CsvColumnHeaderWithSelect>;
};

export type Category = "REQUIRED" | "OPTIONAL";
export type FullSelectionUpdate = {
  readonly category: Category;
  readonly index: number;
  readonly selectionId?: string;
};

type Props = BaseProps & {
  readonly state: BulkFulfillState;
};

const BulkFulfill: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <Layout.FlexColumn alignItems="stretch">
        <DownloadPrepareCard className={css(styles.card)} state={state} />
        <UploadCsvCard className={css(styles.card)} state={state} />
        {state.isFileUploaded && <ColumnMappingCard state={state} />}
      </Layout.FlexColumn>
      <Layout.FlexColumn>
        <HowToFulfillCard />
      </Layout.FlexColumn>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          paddingTop: 20,
          display: "grid",
          gridGap: 20,
          gridTemplateColumns: "2fr 1fr",
        },
        card: {
          width: "100%",
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
      }),
    []
  );
};

export default observer(BulkFulfill);
