/*
 * ListingDetails.tsx
 *
 * Created by Jonah Dlin on Tue Nov 16 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import numeral from "numeral";
import faker from "faker/locale/en";

import { Field, FormSelect, TextInput, Layout } from "@ContextLogic/lego";
import { RequiredValidator } from "@core/toolkit/validators";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import Section, { SectionProps } from "./Section";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import { CommerceProductCondition } from "@schema";
import { ConditionDisplay } from "@add-edit-product/toolkit";
import { useTheme } from "@core/stores/ThemeStore";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { zendeskURL } from "@core/toolkit/url";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ConditionOrder: ReadonlyArray<CommerceProductCondition> = [
  "NEW",
  "USED",
  "REFURBISHED",
];
const ConditionOptions: ReadonlyArray<Option<CommerceProductCondition>> =
  ConditionOrder.map((value: CommerceProductCondition) => ({
    value,
    text: ConditionDisplay[value],
  }));

const ListingDetails: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;

  const { forceValidation, isSubmitting, condition } = state;

  const attributesLearnMoreLink = zendeskURL("1260805100070");

  return (
    <Section
      className={css(style, className)}
      title={i`Listing details`}
      {...sectionProps}
    >
      <Field
        title={i`Name`}
        className={css(styles.field)}
        description={
          i`Use the following template to build your product names: Main brand + ` +
          i`Sub-brand, family or product name + Up to ${3} key attributes + Generic ` +
          i`product type. Product Names must be clear and concise and should also be ` +
          i`descriptive of the product being sold. This template will help consumers ` +
          i`identifying your product. [Learn more](${attributesLearnMoreLink})`
        }
      >
        <Layout.FlexRow style={styles.content} alignItems="stretch">
          <TextInput
            value={state.name}
            placeholder={i`Be clear, concise, and descriptive of the product being sold`}
            className={css(styles.input)}
            onChange={({ text }) => (state.name = text)}
            debugValue={faker.commerce.productName()}
            validators={[new RequiredValidator()]}
            forceValidation={forceValidation}
            disabled={isSubmitting}
            data-cy="input-name"
          />
        </Layout.FlexRow>
      </Field>
      <Field
        title={i`Description`}
        className={css(styles.field)}
        style={{ marginTop: 15 }}
        description={
          i`A detailed description of your product. Limit of ` +
          i`${numeral(4000)
            .format("0,0")
            .toString()} characters, and only the first ` +
          i`${numeral(250)
            .format("0,0")
            .toString()} characters are displayed on the ` +
          i`initial search page. Do not include any HTML code, details about store ` +
          i`policies, other store-specific language or multiple lines. 'New line' ` +
          i`characters (such as 'enter' or 'return') will cause problems with your file. ` +
          i`Information about size, fit, and measurements are helpful for apparel items. ` +
          i`[Learn more](${attributesLearnMoreLink})`
        }
      >
        <Layout.FlexRow style={styles.content} alignItems="stretch">
          <TextInput
            placeholder={i`Add details about your product to increase sales`}
            className={css(styles.textArea)}
            rows={6}
            isTextArea
            value={state.description}
            onChange={({ text }) => (state.description = text)}
            debugValue={faker.lorem.paragraphs(2)}
            validators={[new RequiredValidator()]}
            forceValidation={forceValidation}
            disabled={isSubmitting}
            data-cy="input-description"
          />
        </Layout.FlexRow>
      </Field>
      <Field
        title={i`Condition`}
        className={css(styles.field)}
        style={{ marginTop: 15 }}
        description={
          i`Provide the condition of the product. You can choose "New", "Used", or ` +
          i`"Refurbished". NOTE: Make sure to provide this information so that the ` +
          i`product's European Union-bound orders may smoothly pass through customs. ` +
          i`[Learn more](${attributesLearnMoreLink})`
        }
      >
        <Layout.FlexColumn className={css(styles.conditionContent)}>
          <FormSelect
            className={css(styles.select)}
            selectedValue={condition}
            options={ConditionOptions}
            onSelected={(value?: CommerceProductCondition) => {
              state.condition = value;
            }}
            placeholder={i`Select a product condition`}
            disabled={isSubmitting}
            data-cy="select-condition"
          />
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
    [negative],
  );
};
