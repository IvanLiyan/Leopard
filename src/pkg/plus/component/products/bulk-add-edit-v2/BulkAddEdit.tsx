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
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import HowToBulkAddEditCard from "./HowToBulkAddEditCard";
import SelectActionCard from "./SelectActionCard";
import UploadCsvCard from "./UploadCsvCard";
import ColumnMappingCard from "./ColumnMappingCard";
import { Checkpoint } from "@ContextLogic/lego";

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
      <Checkpoint numbered pointsMargin={16}>
        <Checkpoint.Point>
          <SelectActionCard state={state} className={css(styles.card)} />
        </Checkpoint.Point>
        <Checkpoint.Point>
          <UploadCsvCard state={state} className={css(styles.card)} />
        </Checkpoint.Point>
        <Checkpoint.Point>
          <ColumnMappingCard state={state} className={css(styles.card)} />
        </Checkpoint.Point>
      </Checkpoint>
      <HowToBulkAddEditCard className={css(styles.howToCard)} state={state} />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridTemplateColumns: "2.5fr minmax(290px, 1fr)",
          columnGap: "32px",
          "@media (max-width: 900px)": {
            display: "flex",
            flexDirection: "column",
          },
        },
        card: {
          flex: 1,
        },
        howToCard: {
          height: "fit-content",
          "@media (max-width: 900px)": {
            marginTop: 16,
          },
        },
      }),
    [],
  );
};

export default observer(BulkAddEdit);
