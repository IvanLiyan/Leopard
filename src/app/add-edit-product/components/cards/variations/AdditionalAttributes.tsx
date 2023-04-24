/*
 * AdditionalAttributes.tsx
 *
 * Created by Jonah Dlin on Thu Nov 04 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

import faker from "faker/locale/en";

import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { Field, Layout, NumericInput, TextInput } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Section from "@add-edit-product/components/cards/Section";
import AddEditProductState from "@add-edit-product/AddEditProductState";

export type AdditionalAttributesProps = BaseProps & {
  readonly state: AddEditProductState;
};

const AdditionalAttributes = (props: AdditionalAttributesProps) => {
  const { className, style, state } = props;
  const { isSubmitting, maxQuantity, parentSku } = state;

  const styles = useStylesheet();

  return (
    <Section
      className={css(className, style)}
      title={i`Additional attributes`}
      alwaysOpen
    >
      <Layout.FlexColumn alignItems="stretch">
        <Field title={i`**Parent SKU**`} style={styles.field}>
          <TextInput
            value={parentSku}
            placeholder={i`Enter a unique identifier to group variations`}
            onChange={({ text }) => (state.parentSku = text)}
            debugValue={faker.random.alphaNumeric(6).toUpperCase()}
            hideCheckmarkWhenValid
            disabled={isSubmitting}
            data-cy="input-parent-sku"
          />
        </Field>

        <Field title={i`**Max quantity** (optional)`} style={styles.field}>
          <NumericInput
            value={maxQuantity}
            placeholder="0"
            onChange={({ valueAsNumber }) =>
              (state.maxQuantity = valueAsNumber)
            }
            disabled={isSubmitting}
            data-cy="input-max-quantity"
          />
        </Field>
      </Layout.FlexColumn>
    </Section>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        field: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
      }),
    [],
  );

export default observer(AdditionalAttributes);
