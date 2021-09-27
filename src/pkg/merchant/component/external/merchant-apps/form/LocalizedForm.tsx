/* eslint-disable local-rules/no-empty-link */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { RequiredValidator, CharacterLength } from "@toolkit/validators";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { LocalizedFormState } from "@merchant/model/external/merchant-apps/MerchantAppGlobalState";

export type LocalizedFormProps = BaseProps & {
  readonly isLoading: boolean;
  readonly localizedFormState: LocalizedFormState;
};

const LocalizedForm = (props: LocalizedFormProps) => {
  const styles = useStylesheet(props);
  const { isLoading, localizedFormState } = props;

  return (
    <>
      <HorizontalField
        title={i`Value proposition`}
        popoverContent={i`A short introduction about what your app can do.`}
        className={css(styles.field)}
        titleWidth={"30%"}
      >
        <TextInput
          disabled={isLoading}
          validators={[new CharacterLength({ maximum: 150 })]}
          onChange={({ text }) => {
            localizedFormState.intro = text;
          }}
          onValidityChanged={(isValid) => {
            localizedFormState.introIsValid = isValid;
          }}
          isTextArea
          rows={3}
          height={200}
          className={css(styles.input)}
          value={localizedFormState.intro}
        />
      </HorizontalField>
      <HorizontalField
        title={() => (
          <div className={css(styles.fieldTitle)}>
            <span>Description</span>{" "}
            <span className={css(styles.asterisk)}>*</span>
          </div>
        )}
        popoverContent={i`A detailed description about your app.`}
        className={css(styles.field)}
        titleWidth={"30%"}
      >
        <TextInput
          disabled={isLoading}
          validators={[
            new RequiredValidator(),
            new CharacterLength({ maximum: 500 }),
          ]}
          onChange={({ text }) => {
            localizedFormState.description = text;
          }}
          onValidityChanged={(isValid) => {
            localizedFormState.descriptionIsValid = isValid;
          }}
          isTextArea
          rows={5}
          height={200}
          className={css(styles.input)}
          value={localizedFormState.description}
        />
      </HorizontalField>
    </>
  );
};

export default observer(LocalizedForm);

const useStylesheet = (props: LocalizedFormProps) => {
  const { dimenStore } = AppStore.instance();

  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          maxWidth: "570px",
        },
        title: {
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          marginBottom: 25,
          fontSize: 25,
          lineHeight: 1.33,
        },
        form: {
          display: "flex",
          flexDirection: "column",
        },
        field: {
          ":not(:last-child)": {
            marginBottom: 20,
          },
        },
        fieldTitle: {
          fontSize: 16,
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightSemibold,
          cursor: "default",
          lineHeight: 1.5,
          textAlign: !dimenStore.isSmallScreen ? "right" : "center",
        },
        asterisk: {
          color: palettes.reds.DarkestRed,
        },
      }),
    [dimenStore.isSmallScreen]
  );
};
