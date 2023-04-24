import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { useTheme } from "@core/stores/ThemeStore";
import {
  ErrorText,
  Field,
  FormSelect,
  Layout,
  PrimaryButton,
  TextInput,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AddEditProductState, {
  parseVariationTokens,
  UniqueVariationTokensValidator,
} from "@add-edit-product/AddEditProductState";
import SearchableMultiselect, {
  SearchableMultiselectOption,
} from "@core/components/SearchableMultiselect";
import { ci18n } from "@core/toolkit/i18n";
import { css, IS_SMALL_SCREEN, IS_LARGE_SCREEN } from "@core/toolkit/styling";
import {
  LEGACY_COLOR_DISPLAY_TEXT,
  LEGACY_COLOR_ID,
  LEGACY_SIZE_DISPLAY_TEXT,
  LEGACY_SIZE_ID,
} from "@add-edit-product/toolkit";

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const VariationOptionsInput: React.FC<Props> = ({
  style,
  className,
  state,
}: Props) => {
  const styles = useStylesheet();
  const { surface } = useTheme();
  const {
    isNewProduct,
    taxonomyVariationOptions,
    selectedVariationOptionNames,
    selectVariationOption,
    selectedVariationOptionValueTexts,
    selectVariationOptionValues,
    variationOptionsErrorMessage,
    updateVariationsFromOptionsForm,
    updateVariationOptionsFromOptionsForm,
    isSubmitting,
  } = state;
  const [showError, setShowError] = useState<boolean>(false);
  const [textInputHasError, setTextInputHasError] = useState<
    Record<number, boolean>
  >({});

  const formattedOptions = useMemo(() => {
    const taxonomyOptions = taxonomyVariationOptions.map((option) => {
      return {
        value: option.name,
        text: option.name,
      };
    });

    return [
      ...taxonomyOptions,
      {
        value: LEGACY_COLOR_ID,
        text: LEGACY_COLOR_DISPLAY_TEXT,
      },
      {
        value: LEGACY_SIZE_ID,
        text: LEGACY_SIZE_DISPLAY_TEXT,
      },
    ];
  }, [taxonomyVariationOptions]);

  const optionToFormattedValues: Record<
    string,
    ReadonlyArray<SearchableMultiselectOption<string>>
  > = useMemo(() => {
    // option value select not needed for edit flow
    if (!isNewProduct) {
      return {};
    }

    let optionToValueMap = {
      LEGACY_COLOR_ID: [],
      LEGACY_SIZE_ID: [],
    };

    taxonomyVariationOptions.forEach((option) => {
      const formattedValues = option.values
        ? option.values.map((value) => {
            return { key: value.value, value: value.value };
          })
        : [];

      optionToValueMap = {
        ...optionToValueMap,
        [`${option.name}`]: formattedValues,
      };
    });

    return optionToValueMap;
  }, [isNewProduct, taxonomyVariationOptions]);

  const renderFreeTextInput = (index: number) => {
    return (
      <TextInput
        placeholder={ci18n("Text input placeholder text", "Input value")}
        isTextArea
        tokenize
        value={selectedVariationOptionValueTexts[index]?.join(",") ?? ""}
        onChange={({ text }) => {
          const valuelist: ReadonlyArray<string> = parseVariationTokens(text);
          selectVariationOptionValues(index, valuelist);
        }}
        height={100}
        disabled={isSubmitting}
        validators={[
          new UniqueVariationTokensValidator({
            customMessage: i`No duplicate values`,
          }),
        ]}
        onValidityChanged={(isValid) =>
          setTextInputHasError({ ...textInputHasError, [index]: !isValid })
        }
        tokenColor={surface}
        data-cy={`input-variation-value-${index}`}
      />
    );
  };

  const renderVariationOptionSelect = (index: number) => {
    return (
      <FormSelect
        options={formattedOptions}
        selectedValue={selectedVariationOptionNames[index]}
        onSelected={(value: string | undefined) => {
          if (
            value == undefined ||
            selectedVariationOptionNames[index] !== value
          ) {
            // reset variation option values
            selectVariationOptionValues(index, []);
          }

          selectVariationOption(index, value);
        }}
        disabled={isSubmitting}
        placeholder={ci18n(
          "Dropdown placeholder text, means to select a variation type",
          "Select type",
        )}
        error={showError && variationOptionsErrorMessage != null}
        data-cy={`select-variation-type-${index}`}
        showArrow
      />
    );
  };

  const renderVariationOptionValueSelect = (index: number) => {
    return (
      <SearchableMultiselect
        options={
          selectedVariationOptionNames[index]
            ? optionToFormattedValues[
                selectedVariationOptionNames[index] as string
              ] ?? []
            : []
        }
        onSelectionChange={(selection) => {
          selectVariationOptionValues(index, selection);
        }}
        selectedOptions={selectedVariationOptionValueTexts[index] ?? []}
        disabled={selectedVariationOptionNames[index] == null || isSubmitting}
        placeholder={ci18n(
          "Dropdown placeholder text, means to select a value",
          "Select value",
        )}
        tokenColor={surface}
        data-cy={`multiselect-variation-value-${index}`}
      />
    );
  };

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <div className={css(styles.optionsContainer)}>
        <Field
          style={styles.field}
          title={ci18n(
            "Form title, means to specify variation info",
            "Variation",
          )}
        >
          <Layout.FlexColumn style={styles.optionContainer}>
            {renderVariationOptionSelect(0)}
            {isNewProduct &&
              (selectedVariationOptionNames[0] === LEGACY_COLOR_ID ||
              selectedVariationOptionNames[0] === LEGACY_SIZE_ID
                ? renderFreeTextInput(0)
                : renderVariationOptionValueSelect(0))}
          </Layout.FlexColumn>
        </Field>
        <div className={css(styles.line)} />
        <Field
          style={styles.field}
          title={ci18n(
            "Form title, means to specify info for an additional variation",
            "Additional variation",
          )}
        >
          <Layout.FlexColumn style={styles.optionContainer}>
            {renderVariationOptionSelect(1)}
            {isNewProduct &&
              (selectedVariationOptionNames[1] === LEGACY_COLOR_ID ||
              selectedVariationOptionNames[1] === LEGACY_SIZE_ID
                ? renderFreeTextInput(1)
                : renderVariationOptionValueSelect(1))}
          </Layout.FlexColumn>
        </Field>
      </div>
      {showError && variationOptionsErrorMessage && (
        <ErrorText>{variationOptionsErrorMessage}</ErrorText>
      )}
      <PrimaryButton
        style={styles.button}
        onClick={() => {
          if (
            variationOptionsErrorMessage != null ||
            Object.values(textInputHasError).find((hasError) => hasError)
          ) {
            setShowError(true);
            return;
          }

          if (isNewProduct) {
            updateVariationsFromOptionsForm();
          } else {
            updateVariationOptionsFromOptionsForm();
          }
        }}
        data-cy="button-apply-variation"
      >
        {ci18n("Form button, meaning apply changes", "Apply")}
      </PrimaryButton>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 16,
        },
        optionsContainer: {
          display: "flex",
          alignItems: "stretch",
          gap: 16,
          [`@media ${IS_SMALL_SCREEN}`]: {
            flexDirection: "column",
          },
          [`@media ${IS_LARGE_SCREEN}`]: {
            flexDirection: "row",
          },
        },
        optionContainer: {
          gap: 16,
          minWidth: 0,
        },
        line: {
          [`@media ${IS_SMALL_SCREEN}`]: {
            borderTop: `1px solid ${borderPrimary}`,
          },
          [`@media ${IS_LARGE_SCREEN}`]: {
            borderLeft: `1px solid ${borderPrimary}`,
          },
        },
        field: {
          flex: 1,
          minWidth: 0,
        },
        button: {
          alignSelf: "flex-end",
        },
      }),
    [borderPrimary],
  );
};

export default observer(VariationOptionsInput);
