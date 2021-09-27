/*
 *
 * BulkAddEdit.tsx
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
import BulkAddEditProductState from "@plus/model/BulkAddEditProductState";
import HowToBulkAddEditCard from "./HowToBulkAddEditCard";
import DownloadPrepareCard from "./DownloadPrepareCard";
import UploadCsvCard from "./UploadCsvCard";
import ColumnMappingCard from "./ColumnMappingCard";

export type Category = "REQUIRED" | "OPTIONAL";
export type FullSelectionUpdate = {
  readonly category: Category;
  readonly index: number;
  readonly selectionId?: string;
};

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
};

const BulkAddEdit: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <DownloadPrepareCard className={css(styles.downloadCard)} state={state} />
      <UploadCsvCard className={css(styles.uploadCard)} state={state} />
      {state.isFileUploaded && (
        <ColumnMappingCard className={css(styles.mappingCard)} state={state} />
      )}
      <HowToBulkAddEditCard className={css(styles.howToCard)} />
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
          alignItems: "flex-start",
          gap: "20px 20px",
          gridTemplateColumns: "2fr 1fr",
          "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
          },
        },
        downloadCard: {
          gridColumn: 1,
          gridRow: 1,
        },
        uploadCard: {
          gridColumn: 1,
          gridRow: 2,
        },
        mappingCard: {
          gridColumn: 1,
          gridRow: 3,
        },
        howToCard: {
          gridColumn: 2,
          gridRow: "1 / span 2",
          "@media (max-width: 900px)": {
            gridColumn: 1,
            gridRow: 4,
          },
        },
      }),
    []
  );
};

export default observer(BulkAddEdit);
