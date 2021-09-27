import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { EmailInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { DefaultLocaleFormProps } from "@merchant/component/external/merchant-apps/form/DefaultLocaleForm";

const UserContactForm = ({
  globalFormState,
  ...restProps
}: DefaultLocaleFormProps) => {
  const styles = useStylesheet();
  const { requiredValidator } = globalFormState.mainForm.validators;

  return (
    <>
      <div className={css(styles.subtitle)}>
        <div className={css(styles.bold)}>User Support Contact</div>
        <p>
          Will be displayed to users so that they can reach you for support.
        </p>
      </div>
      <HorizontalField
        titleWidth={"30%"}
        title={i`Email`}
        popoverContent={i`An email address that merchants can use to reach you for support.`}
        className={css(styles.field)}
        required
        centerContentVertically
      >
        <EmailInput
          className={css(styles.input)}
          value={globalFormState.mainForm.supportEmail}
          onChange={({ text }) => {
            globalFormState.mainForm.supportEmail = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Phone number`}
        titleWidth={"30%"}
        centerContentVertically
      >
        <TextInput
          className={css(styles.input)}
          value={globalFormState.mainForm.supportPhone}
          onChange={({ text }) => {
            globalFormState.mainForm.supportPhone = text;
          }}
          validators={[requiredValidator]}
          onValidityChanged={(isValid) => {
            globalFormState.mainForm.supportEmailIsValid = isValid;
          }}
        />
      </HorizontalField>
      {globalFormState.isFromCN && (
        <HorizontalField
          className={css(styles.field)}
          title={i`Wechat`}
          titleWidth={"30%"}
          centerContentVertically
        >
          <TextInput
            className={css(styles.input)}
            value={globalFormState.mainForm.supportWechat}
            onChange={({ text }) => {
              globalFormState.mainForm.supportWechat;
            }}
          />
        </HorizontalField>
      )}
    </>
  );
};
export default observer(UserContactForm);

const useStylesheet = () => {
  const { dimenStore } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        bold: {
          fontWeight: fonts.weightBold,
        },
        subtitle: {
          padding: `20px ${dimenStore.pageGuideX}`,
        },
        field: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        input: {
          maxWidth: "570px",
        },
      }),
    [dimenStore.pageGuideX]
  );
};
