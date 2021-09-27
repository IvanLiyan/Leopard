/*
 * Logistics.tsx
 *
 * Created by Jonah Dlin on Thu Jun 10 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

import { Field, TextInput, NumericInput, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  CustomsHsCodeValidator,
  MinMaxValueValidator,
} from "@toolkit/validators";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const Logistics: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState, ...sectionProps } = props;

  const { forceValidation, isSubmitting } = editState;
  const variation = editState.variationsList[0];
  return (
    <Section
      className={css(style, className)}
      title={i`Logistics`}
      {...sectionProps}
    >
      <div className={css(styles.parent)}>
        <Field
          title={i`Customs HS Code`}
          description={i`Harmonization System Code used for customs declaration.`}
          className={css(styles.field)}
        >
          <div className={css(styles.content)}>
            <TextInput
              onChange={({ text }) => (variation.customsHsCode = text)}
              value={variation.customsHsCode}
              placeholder={i`Enter a unique identifier`}
              className={css(styles.input)}
              validators={[new CustomsHsCodeValidator({ allowBlank: true })]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              debugValue={"0000.00.0000"}
              hideCheckmarkWhenValid={
                variation.customsHsCode == null ||
                variation.customsHsCode.trim().length == 0
              }
            />
          </div>
        </Field>
        <Field
          title={i`Weight`}
          description={i`The weight of your product. Unit of measurement is in grams.`}
          className={css(styles.field)}
        >
          <div className={css(styles.content)}>
            <NumericInput
              value={variation.weight}
              placeholder="0"
              className={css(styles.input)}
              incrementStep={1}
              onChange={({ valueAsNumber }) => {
                variation.weight =
                  valueAsNumber == null
                    ? undefined
                    : Math.max(0, valueAsNumber);
              }}
              validators={[
                new MinMaxValueValidator({
                  minAllowedValue: 0,
                  customMessage: i`Enter a valid weight`,
                  allowBlank: true,
                }),
              ]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
            />
            <Text className={css(styles.unit)}>
              {ci18n("Abbreviation for 'grams'", "g")}
            </Text>
          </div>
        </Field>
      </div>
    </Section>
  );
};

export default observer(Logistics);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
        },
        field: {
          margin: 5,
          "@media (max-width: 900px)": {
            width: "calc(100% - 10px)",
          },
          "@media (min-width: 900px)": {
            width: "calc(50% - 10px)",
          },
        },
        input: {
          flex: 1,
        },
        parent: {
          margin: -5,
          display: "flex",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
          },
        },
        unit: {
          marginLeft: 8,
          alignSelf: "center",
        },
      }),
    []
  );
