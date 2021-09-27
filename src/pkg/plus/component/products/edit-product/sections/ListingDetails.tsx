/*
 *
 * ListingDetails.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import faker from "faker/locale/en";

import { Field, FormSelect, TextInput, Text, Layout } from "@ContextLogic/lego";
import { RequiredValidator } from "@toolkit/validators";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import { CommerceProductCondition } from "@schema/types";
import { ConditionDisplay } from "@toolkit/product-edit";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const ConditionOrder: ReadonlyArray<CommerceProductCondition> = [
  "NEW",
  "USED",
  "REFURBISHED",
];
const ConditionOptions: ReadonlyArray<Option<
  CommerceProductCondition
>> = ConditionOrder.map((value: CommerceProductCondition) => ({
  value,
  text: ConditionDisplay[value],
}));

const ListingDetails: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { negative, borderPrimary } = useTheme();
  const { style, className, editState, ...sectionProps } = props;

  const { forceValidation, isSubmitting, condition } = editState;

  const hasConditionError = condition == null && forceValidation;

  return (
    <Section
      className={css(style, className)}
      title={i`Listing details`}
      {...sectionProps}
    >
      <Field title={i`Title`} className={css(styles.field)}>
        <div className={css(styles.content)}>
          <TextInput
            value={editState.name}
            placeholder={i`Enter a title for your product listing`}
            className={css(styles.input)}
            onChange={({ text }) => (editState.name = text)}
            debugValue={faker.commerce.productName()}
            validators={[new RequiredValidator()]}
            forceValidation={forceValidation}
            disabled={isSubmitting}
          />
        </div>
      </Field>
      <Field
        title={i`Describe your product`}
        className={css(styles.field)}
        style={{ marginTop: 15 }}
      >
        <div className={css(styles.content)}>
          <TextInput
            placeholder={i`Add details about your product to increase sales`}
            className={css(styles.textArea)}
            rows={6}
            isTextArea
            value={editState.description}
            onChange={({ text }) => (editState.description = text)}
            debugValue={faker.lorem.paragraphs(2)}
            validators={[new RequiredValidator()]}
            forceValidation={forceValidation}
            disabled={isSubmitting}
          />
        </div>
      </Field>
      <Field
        title={i`Condition`}
        className={css(styles.field)}
        style={{ marginTop: 15 }}
      >
        <Layout.FlexColumn className={css(styles.conditionContent)}>
          <FormSelect
            className={css(styles.select)}
            selectedValue={condition}
            options={ConditionOptions}
            onSelected={(value?: CommerceProductCondition) => {
              editState.condition = value;
            }}
            placeholder={i`Select a product condition`}
            disabled={isSubmitting}
            error={hasConditionError}
            borderColor={hasConditionError ? negative : borderPrimary}
          />
          {hasConditionError && (
            <Text className={css(styles.errorText)} weight="semibold">
              This field is required
            </Text>
          )}
        </Layout.FlexColumn>
      </Field>
    </Section>
  );
};

export default observer(ListingDetails);

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
        },
        conditionContent: {
          flex: 1,
        },
        field: {
          alignSelf: "stretch",
        },
        input: {
          flex: 1,
        },
        textArea: {
          flex: 1,
        },
        select: {
          flex: 1,
          minHeight: 40,
        },
        errorText: {
          fontSize: 12,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          cursor: "default",
        },
      }),
    [negative]
  );
};
