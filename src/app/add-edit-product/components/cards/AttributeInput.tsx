import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ci18n } from "@core/toolkit/i18n";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedTaxonomyAttribute } from "@core/taxonomy/toolkit";
import {
  ErrorText,
  FormSelect,
  Layout,
  NumericInput,
  TextInput,
} from "@ContextLogic/lego";
import { RequiredValidator } from "@ContextLogic/lego/toolkit/forms/validators";
import SearchableMultiselect from "@core/components/SearchableMultiselect";
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly attribute: PickedTaxonomyAttribute;
  readonly value: ReadonlyArray<string> | undefined;
  readonly onChange: (value: ReadonlyArray<string> | undefined) => unknown;
  readonly forceValidation?: boolean | undefined;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly acceptNegative?: boolean;
  readonly selectPlaceholder?: string;
  readonly inputPlaceholder?: string;
};

const AttributeInput: React.FC<Props> = ({
  style,
  className,
  attribute,
  value,
  forceValidation,
  onChange,
  selectPlaceholder,
  inputPlaceholder,
  required,
  disabled,
  acceptNegative = true,
}: Props) => {
  const styles = useStylesheet();
  const validators = required ? [new RequiredValidator()] : undefined;
  const [multiSelectError, setMultiSelectError] = useState<string | undefined>(
    undefined,
  );
  const { negative } = useTheme();

  useEffect(() => {
    if (
      attribute.mode === "ATTRIBUTE_MODE_MULTI_SELECTION_ONLY" &&
      attribute.maxMultiSelect &&
      value?.length != null &&
      value.length > attribute.maxMultiSelect
    ) {
      setMultiSelectError(
        i`Select no more than ${attribute.maxMultiSelect} values`,
      );
    } else if (attribute.mode === "ATTRIBUTE_MODE_MULTI_SELECTION_ONLY") {
      setMultiSelectError(undefined);
    }
  }, [attribute.maxMultiSelect, attribute.mode, value?.length]);

  if (
    attribute.mode === "ATTRIBUTE_MODE_FREE_TEXT" &&
    attribute.dataType === "ATTRIBUTE_DATA_TYPE_NUMBER"
  ) {
    return (
      <NumericInput
        style={[className, style]}
        value={value && value.length > 0 ? parseInt(value[0]) : 0}
        onChange={({ valueAsString }) => {
          if (
            parseInt(valueAsString) >= 0 ||
            (parseInt(valueAsString) < 0 && acceptNegative)
          ) {
            onChange([valueAsString]);
          }
        }}
        validators={validators}
        forceValidation={forceValidation}
        disabled={disabled}
        data-cy={`input-attribute-${attribute.id}`}
      />
    );
  } else if (attribute.mode === "ATTRIBUTE_MODE_SINGLE_SELECTION_ONLY") {
    return (
      <FormSelect
        style={[className, style]}
        options={
          attribute.values?.map((v) => {
            return {
              text: v.value,
              value: v.value,
            };
          }) || []
        }
        placeholder={
          selectPlaceholder ||
          ci18n("Dropdown placeholder, select a value", "Select")
        }
        selectedValue={value && value.length > 0 ? value[0] : undefined}
        onSelected={(value: string | undefined) => {
          onChange(value ? [value] : undefined);
        }}
        disabled={disabled}
        data-cy={`select-attribute-${attribute.id}`}
        showArrow
      />
    );
  } else if (attribute.mode === "ATTRIBUTE_MODE_MULTI_SELECTION_ONLY") {
    return (
      <Layout.FlexColumn>
        <SearchableMultiselect
          style={[className, style]}
          options={
            attribute.values?.map((v) => {
              return {
                key: v.value,
                value: v.value,
              };
            }) || []
          }
          onSelectionChange={(selection) => {
            onChange(selection);
          }}
          selectedOptions={value ?? []}
          disabled={disabled}
          searchable={false}
          placeholder={
            selectPlaceholder ||
            ci18n("Dropdown placeholder, select a value", "Select")
          }
          borderColor={multiSelectError ? negative : undefined}
          data-cy={`multiselect-attribute-${attribute.id}`}
        />
        {multiSelectError && (
          <ErrorText style={styles.error}>{multiSelectError}</ErrorText>
        )}
      </Layout.FlexColumn>
    );
  }

  return (
    <TextInput
      style={[className, style]}
      placeholder={
        inputPlaceholder ||
        ci18n("Text input placeholder, input a value", "Input")
      }
      value={value && value.length > 0 ? value[0] : undefined}
      onChange={({ text }) => {
        onChange(text.trim().length > 0 ? [text] : undefined);
      }}
      validators={validators}
      forceValidation={forceValidation}
      disabled={disabled}
      data-cy={`input-attribute-${attribute.id}`}
    />
  );
};

export default observer(AttributeInput);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        error: {
          marginTop: 8,
        },
      }),
    [],
  );
