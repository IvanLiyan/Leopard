import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Field, FormSelect, TextInput } from "@ContextLogic/lego";
import { RequiredValidator } from "@core/toolkit/validators";
import Section, { SectionProps } from "./Section";
import { CommerceProductCondition } from "@schema";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { zendeskURL } from "@core/toolkit/url";
import { ci18n } from "@core/toolkit/i18n";
import { Stack } from "@ContextLogic/atlas-ui";
import { ConditionOptions } from "@add-edit-product/toolkit";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ListingDetailsV2: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;

  const { forceValidation, isSubmitting, condition, setSingleVariationSku } =
    state;

  const attributesLearnMoreLink = zendeskURL("1260805100070");

  return (
    <Section
      style={[style, className]}
      title={i`Listing details`}
      {...sectionProps}
    >
      <Stack direction="column" alignItems="stretch" sx={{ gap: "16px" }}>
        <Field
          title={ci18n("Field name, means product name", "Name*")}
          description={
            i`Product names must be a clear, accurate description of the product being ` +
            i`sold. Use the following template to build your product names: Main brand + ` +
            i`Sub-brand, family or product name + Up to 3 key attributes + Generic ` +
            i`product type. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <TextInput
            value={state.name}
            placeholder={i`Be clear, concise, and descriptive of the product being sold`}
            style={styles.input}
            onChange={({ text }) => (state.name = text)}
            validators={[new RequiredValidator()]}
            forceValidation={forceValidation}
            disabled={isSubmitting}
            data-cy="input-name"
          />
        </Field>
        <Stack direction="row" sx={{ gap: "8px" }} alignItems="flex-start">
          <Field
            title={ci18n(
              "Field name, means product's parent sku",
              "Parent SKU*",
            )}
            description={
              i`Provide a unique alpha numeric Parent SKU to identify this item. For ` +
              i`future updates, please keep this SKU.`
            }
            style={styles.input}
          >
            <TextInput
              value={state.parentSku}
              placeholder={i`Enter a unique identifier to group variations`}
              onChange={({ text }) => setSingleVariationSku(text)}
              validators={[new RequiredValidator()]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              data-cy="input-parent-sku"
            />
          </Field>
          <Field
            title={i`Condition`}
            style={styles.input}
            description={
              i`Please provide this information so that orders bound for the European ` +
              i`Union can pass through customs smoothly. [Learn more](${attributesLearnMoreLink})`
            }
          >
            <FormSelect
              style={styles.select}
              selectedValue={condition}
              options={ConditionOptions}
              onSelected={(value?: CommerceProductCondition) => {
                state.condition = value;
              }}
              placeholder={i`Select a product condition`}
              disabled={isSubmitting}
              data-cy="select-condition"
            />
          </Field>
        </Stack>
        <Field
          title={ci18n("Field name, means product description", "Description*")}
          description={
            i`Limit of 4,000 characters. Do not include any HTML code, details about` +
            i`store policies, other store-specific language.`
          }
        >
          <TextInput
            placeholder={i`Add details about your product to increase sales`}
            rows={6}
            isTextArea
            value={state.description}
            onChange={({ text }) => (state.description = text)}
            validators={[new RequiredValidator()]}
            forceValidation={forceValidation}
            disabled={isSubmitting}
            data-cy="input-description"
          />
        </Field>
      </Stack>
    </Section>
  );
};

export default observer(ListingDetailsV2);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          flex: 1,
        },
        select: {
          flex: 1,
          minHeight: 40,
        },
      }),
    [],
  );
};
