/*
 *
 * ColumnMappingCard.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/16/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BulkCard from "./BulkCard";
import { weightMedium } from "@toolkit/fonts";
import HeaderDropdowns, { ColumnCategory } from "./HeaderDropdowns";
import BulkFulfillState from "@plus/model/BulkFulfillState";

type Props = BaseProps & {
  readonly state: BulkFulfillState;
};

export type SelectionUpdate = {
  readonly index: number;
  readonly selectionId?: string;
};

const ColumnMappingCard: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  return (
    <BulkCard
      className={css(styles.root, className, style)}
      title={i`Column mapping`}
      contentContainerStyle={css(styles.container)}
    >
      <div className={css(styles.description)}>
        {" "}
        Check that your column headers match the required fulfillment
        information.
      </div>
      <div className={css(styles.headersContainer)}>
        <HeaderDropdowns state={state} type={ColumnCategory.required} />
        <HeaderDropdowns state={state} type={ColumnCategory.optional} />
      </div>
    </BulkCard>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        container: {
          padding: 24,
          display: "flex",
          flexDirection: "column",
        },
        description: {
          fontSize: 16,
          lineHeight: "24px",
          fontWeight: weightMedium,
          marginBottom: 24,
        },
        headersContainer: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "16px",
        },
      }),
    []
  );
};

export default observer(ColumnMappingCard);
