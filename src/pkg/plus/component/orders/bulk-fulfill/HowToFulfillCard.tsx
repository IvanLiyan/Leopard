/*
 *
 * HowToFulfillCard.tsx
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
import BulkCard from "./BulkCard";
import { Checkpoint } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

type Props = BaseProps & {};

const HowToFulfillCard: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  const link = "/plus/orders/unfulfilled";

  return (
    <BulkCard
      className={css(styles.root, className, style)}
      title={i`How to bulk fulfill with CSV`}
      contentContainerStyle={css(styles.container)}
    >
      <Checkpoint>
        <Checkpoint.Point>
          <Markdown
            text={
              i`Download unfilled orders here, or on ` +
              i`[Unfulfilled Orders](${link}).`
            }
          />
        </Checkpoint.Point>
        <Checkpoint.Point>
          Prepare a CSV file with a row for each order you need to fulfill.
        </Checkpoint.Point>
        <Checkpoint.Point>
          Upload your formatted CSV file and check the column mapping.
        </Checkpoint.Point>
        <Checkpoint.Point>
          Select “Fulfill” to fulfill all the orders from your CSV file.
        </Checkpoint.Point>
        <Checkpoint.Point>
          Check the file status page to track the status of your orders.
        </Checkpoint.Point>
      </Checkpoint>
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
          alignItems: "stretch",
        },
        video: {
          marginTop: 15,
          height: 240,
        },
      }),
    []
  );
};

export default observer(HowToFulfillCard);
