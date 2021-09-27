import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseSectionProps } from "./SectionWrapper";

/* Merchant Components */
import { SecureFileInput } from "@merchant/component/core";

const BusinessSection = (props: BaseSectionProps) => {
  const styles = useStylesheet();
  const { state, className } = props;
  const { requiredValidator } = state;

  return (
    <div className={css(className)}>
      <HorizontalField
        className={css(styles.field)}
        title={i`Business License ID`}
        titleWidth={240}
        required={state.isFromCN}
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.licenseId}
          onChange={({ text }) => {
            state.licenseId = text;
          }}
          validators={state.isFromCN ? [requiredValidator] : undefined}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Business License`}
        titleWidth={240}
        required={state.isFromCN}
        centerTitleVertically
      >
        <SecureFileInput
          bucket="TEMP_UPLOADS_V2"
          className={css(styles.textInput)}
          accepts=".jpeg,.png,.pdf"
          onAttachmentsChanged={(attachments) => {
            state.attachments = attachments;
          }}
          maxSizeMB={5}
          maxAttachments={1}
        />
      </HorizontalField>
    </div>
  );
};
export default observer(BusinessSection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        field: {
          marginTop: 24,
        },
        textInput: {
          flex: 1,
          maxWidth: 648,
        },
      }),
    []
  );
