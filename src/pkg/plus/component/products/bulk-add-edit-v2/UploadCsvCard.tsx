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
import BulkCard from "@plus/component/orders/bulk-fulfill/BulkCard";
import { SecureFileInput } from "@merchant/component/core";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import { Text } from "@ContextLogic/lego";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
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
      {state.openCards.has("UPLOAD_CSV") ? (
        <SecureFileInput
          bucket="TEMP_UPLOADS_V2"
          accepts=".csv"
          prompt={i`Drag and drop a CSV file here to upload`}
          className={css(styles.fileUpload)}
          attachments={state.attachments}
          onAttachmentsChanged={state.uploadCsv}
          maxSizeMB={50}
          maxAttachments={1}
        />
      ) : (
        <Text className={css(styles.closedCardText)}>
          Upload your formatted CSV file after selecting the type of action you
          would like to take.
        </Text>
      )}
    </BulkCard>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        closedCardText: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
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
    [textDark]
  );
};

export default observer(UploadCsvCard);
