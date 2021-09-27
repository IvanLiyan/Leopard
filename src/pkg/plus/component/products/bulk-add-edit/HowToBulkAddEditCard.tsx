/*
 *
 * HowToBulkAddEditCard.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Checkpoint } from "@ContextLogic/lego";
import { YoutubeVideo } from "@merchant/component/core";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BulkCard from "@plus/component/orders/bulk-fulfill/BulkCard";

type Props = BaseProps & {};

const HowToBulkAddEditCard: React.FC<Props> = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();

  return (
    <BulkCard
      className={css(styles.root, className, style)}
      title={i`How to add/edit products with CSV`}
      contentContainerStyle={css(styles.container)}
    >
      <Checkpoint>
        <Checkpoint.Point>
          Prepare your CSV file with a row for each product listing by
          downloading a template (recommended for adding products) or your
          existing products (recommended for editing products).
        </Checkpoint.Point>
        <Checkpoint.Point>
          Upload your formatted CSV file and check the column mapping.
        </Checkpoint.Point>
        <Checkpoint.Point>
          Select “Submit” to upload all the listings from your CSV file.
        </Checkpoint.Point>
        <Checkpoint.Point>
          Check the file status page to track the status of your file.
        </Checkpoint.Point>
      </Checkpoint>
      <YoutubeVideo videoId="UVedUP15rK8" className={css(styles.video)} />
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
        },
        video: {
          marginTop: 15,
          height: 240,
        },
      }),
    []
  );
};

export default observer(HowToBulkAddEditCard);
