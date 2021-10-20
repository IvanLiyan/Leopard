import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Card, Markdown, PrimaryButton } from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";
import { SecureFileInput } from "@merchant/component/core";

import StorePhotoSettingsState from "@plus/model/StorePhotoSettingsState";
import { useToastStore } from "@stores/ToastStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AttachmentInfo } from "@ContextLogic/lego";

type Props = BaseProps & {
  readonly state: StorePhotoSettingsState;
};

const SetStorePhoto: React.FC<Props> = ({ className, style, state }: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const upload = async (attachments: ReadonlyArray<AttachmentInfo>) => {
    if (attachments.length === 0) {
      toastStore.negative(i`No attachments found.`);
      return;
    }

    const file = attachments[0];

    state.photoUrl = file.url;
  };

  return (
    <div className={css(styles.wrapper, className, style)}>
      <Card className={css(styles.content)}>
        <Markdown
          className={css(styles.heading)}
          text={i`**Add a photo clearly showing the front of your location**`}
        />
        <span>Help customers identify your storefront.</span>
        <div className={css(styles.fileInput)}>
          <SecureFileInput
            accepts=".jpg,.jpeg,.png"
            onAttachmentsChanged={upload}
            bucket="TEMP_UPLOADS_V2"
            maxSizeMB={5}
          />
        </div>
        <div className={css(styles.button)}>
          <PrimaryButton
            style={{ borderRadius: 2, padding: "11px 0" }}
            onClick={async () => await state.submit()}
          >
            Submit for review
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
};

export default observer(SetStorePhoto);

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          marginTop: 40,
          flex: 1,
          display: "grid",
          gridGap: 18,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        },
        content: {
          padding: 24,
          color: textDark,
        },
        heading: {
          color: textBlack,
        },
        button: {
          marginTop: 18,
          fontSize: 14,
        },
        fileInput: {
          marginTop: 12,
          marginBottom: 40,
          display: "grid",
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        },
      }),
    [textBlack, textDark],
  );
};
