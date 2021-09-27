/*
 *
 * UploadCsvCard.tsx
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
import { DEPRECATEDFileInput } from "@merchant/component/core";
import BulkFulfillState from "@plus/model/BulkFulfillState";

type Props = BaseProps & {
  readonly state: BulkFulfillState;
};

const UploadCsvCard: React.FC<Props> = (props: Props) => {
  const { className, style, state } = props;
  const styles = useStylesheet();

  return (
    <BulkCard
      className={css(styles.root, className, style)}
      title={i`Upload your formatted CSV file`}
      contentContainerStyle={css(styles.container)}
    >
      <DEPRECATEDFileInput
        bucket="TEMP_UPLOADS"
        accepts=".csv"
        prompt={i`Drag and drop a CSV file here to upload`}
        className={css(styles.fileUpload)}
        attachments={state.attachments}
        onAttachmentsChanged={state.uploadCsv}
        maxSizeMB={50}
        maxAttachments={1}
      />
    </BulkCard>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        fileUpload: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 160,
        },
        container: {
          padding: 24,
        },
      }),
    []
  );
};

export default observer(UploadCsvCard);
