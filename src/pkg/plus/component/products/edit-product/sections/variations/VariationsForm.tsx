/*
 *
 * VariationsForm.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/24/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import _ from "lodash";

import faker from "faker/locale/en";
import { useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Field, TextInput } from "@ContextLogic/lego";

import ProductEditState from "@plus/model/ProductEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const VariationsForm: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState } = props;
  const { variationFormState: state, isSubmitting } = editState;

  return (
    <section className={css(styles.root, style, className)}>
      <div className={css(styles.column)}>
        <Field title={i`Color (optional)`}>
          <TextInput
            placeholder={i`Separate colors with a comma`}
            className={css(styles.textArea)}
            isTextArea
            tokenize
            value={state.colorsText}
            onChange={({ text }) => (state.colorsText = text)}
            onTokensChanged={() => {
              state.regenerateVariations();
            }}
            height={100}
            debugValue={_.uniq([
              faker.commerce.color(),
              faker.commerce.color(),
            ]).join(",")}
            disabled={isSubmitting}
          />
        </Field>
      </div>
      <div className={css(styles.column)}>
        <Field title={i`Size (optional)`}>
          <TextInput
            placeholder={i`Separate sizes with a comma`}
            className={css(styles.textArea)}
            isTextArea
            tokenize
            value={state.sizesText}
            onChange={({ text }) => (state.sizesText = text)}
            onTokensChanged={() => {
              state.regenerateVariations();
            }}
            height={100}
            debugValue={["small", "medium", "large"].join(",")}
            disabled={isSubmitting}
          />
        </Field>
      </div>
    </section>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          "@media (max-width: 900px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
        },
        column: {
          "@media (min-width: 900px)": {
            flexGrow: 1,
            flexBasis: 0,
            ":first-child": {
              marginRight: 10,
            },
          },
          display: "flex",
          flexDirection: "column",
        },
        textArea: {
          marginTop: 10,
        },
        checkbox: {
          padding: 10,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
      }),
    [borderPrimary],
  );
};

export default observer(VariationsForm);
