import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import uniq from "lodash/uniq";

import Modal, { ModalProps } from "@core/components/modal/Modal";
import {
  Field,
  TextInput,
  NumericInput,
  CurrencyInput,
  Layout,
  FormSelect,
  ErrorText,
} from "@ContextLogic/lego";
import { NonZeroValidator, RequiredValidator } from "@core/toolkit/validators";
import { zendeskURL } from "@core/toolkit/url";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import ToastStore from "@core/stores/ToastStore";
import { Weight, Length, Volume, Area, Count } from "@schema";
import AddEditProductState, {
  createVariation,
  VariationOptions,
} from "@add-edit-product/AddEditProductState";
import { ci18n } from "@core/toolkit/i18n";
import {
  unitDisplayName,
  LEGACY_COLOR_DISPLAY_TEXT,
  LEGACY_SIZE_DISPLAY_TEXT,
  variationOptionsEqual,
} from "@add-edit-product/toolkit";
import ModalTitle from "@core/components/modal/ModalTitle";

export type AddVariationModalV2Props = Pick<ModalProps, "open"> & {
  readonly state: AddEditProductState;
  readonly onClose: () => unknown;
};

const AddVariationModalV2: React.FC<AddVariationModalV2Props> = ({
  open,
  state,
  onClose,
}: AddVariationModalV2Props) => {
  const styles = useStylesheet();
  const toastStore = ToastStore.instance();
  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [optionValues, setOptionValues] = useState<
    Record<string, string | undefined>
  >({});
  const [sku, setSku] = useState<string | undefined>(undefined);
  const [priceText, setPriceText] = useState<string | undefined>(undefined);
  const [inventory, setInventory] = useState<number | null | undefined>(
    undefined,
  );
  const [quantityValue, setQuantityValue] = useState<number | null | undefined>(
    undefined,
  );
  const [forceValidation, setForceValidation] = useState(false);
  const [colorIsValid, setColorIsValid] = useState(false);
  const [sizeIsValid, setSizeIsValid] = useState(false);
  const [optionsAreValid, setOpionsAreValid] = useState<
    Record<string, boolean>
  >({});
  const [skuIsValid, setSkuIsValid] = useState(false);
  const [priceIsValid, setPriceIsValid] = useState(false);
  const [inventoryIsValid, setInventoryIsValid] = useState(false);
  const [quantityValueIsValid, setQuantityValueIsValid] = useState(false);

  const {
    primaryCurrency,
    variations,
    standardWarehouseId,
    colorVariations,
    sizeVariations,
    hasColors,
    hasSizes,
    hasOptions,
    optionNames,
    optionNameToValueOptions,
    showUnitPrice,
    unitPriceUnit,
    measurementType,
  } = state;

  const canSubmit =
    skuIsValid &&
    priceIsValid &&
    inventoryIsValid &&
    (!showUnitPrice || quantityValueIsValid) &&
    (!hasColors || colorIsValid) &&
    (!hasSizes || sizeIsValid);

  const onSubmit = () => {
    setForceValidation(true);
    if (!canSubmit) {
      return;
    }

    if (priceText == null) {
      return;
    }

    if (variations.find((variation) => variation.sku === sku)) {
      toastStore.negative(i`A variation of the same sku already exists`);
      return;
    }

    optionNames.forEach((name) => {
      if (optionValues[name] == null) {
        optionsAreValid[name] = false;
      }
    });
    if (!Object.values(optionsAreValid).every((valid) => valid)) {
      toastStore.negative(
        i`You must specify a value for all variation option(s)`,
      );
      return;
    }

    const options = optionNames.reduce<VariationOptions>((acc, optionName) => {
      const value = optionValues[optionName];
      if (value != null) {
        return {
          ...acc,
          [optionName]: [value],
        };
      }

      return acc;
    }, {});

    const variationExists = variations.some(
      ({
        size: existingSize,
        color: existingColor,
        options: existingOptions,
      }) =>
        existingSize == size &&
        existingColor == color &&
        variationOptionsEqual(existingOptions, options),
    );

    if (variationExists) {
      toastStore.negative(
        i`Please make sure each variation has unique variation option`,
      );
      return;
    }

    if (inventory == null) {
      toastStore.negative(i`Please provide an inventory`);
      return;
    }

    if (showUnitPrice && (quantityValue == null || !quantityValueIsValid)) {
      toastStore.negative(i`Please provide a quantity value`);
      return;
    }

    const quantityValueInput: {
      readonly quantityWeight?: Pick<Weight, "value"> | null | undefined;
      readonly quantityLength?: Pick<Length, "value"> | null | undefined;
      readonly quantityVolume?: Pick<Volume, "value"> | null | undefined;
      readonly quantityArea?: Pick<Area, "value"> | null | undefined;
      readonly quantityUnit?: Pick<Count, "value"> | null | undefined;
    } =
      showUnitPrice && quantityValue != null
        ? {
            quantityArea:
              measurementType === "AREA"
                ? {
                    value: quantityValue,
                  }
                : undefined,
            quantityLength:
              measurementType === "LENGTH"
                ? {
                    value: quantityValue,
                  }
                : undefined,
            quantityUnit:
              measurementType === "COUNT"
                ? {
                    value: quantityValue,
                  }
                : undefined,
            quantityVolume:
              measurementType === "VOLUME"
                ? {
                    value: quantityValue,
                  }
                : undefined,
            quantityWeight:
              measurementType === "WEIGHT"
                ? {
                    value: quantityValue,
                  }
                : undefined,
          }
        : {
            quantityArea: null,
            quantityLength: null,
            quantityUnit: null,
            quantityVolume: null,
            quantityWeight: null,
          };

    const newVariation = createVariation({
      initialState: {
        sku,
        size,
        color,
        price: {
          amount: parseFloat(priceText),
          currencyCode: primaryCurrency,
        },
        inventory: [
          {
            warehouseId: standardWarehouseId,
            shippingType: "REGULAR",
            count: inventory,
          },
        ],
        ...quantityValueInput,
      },
      options,
    });
    onClose();
    state.replaceVariations([newVariation, ...variations]);
  };

  const colorAutocomplete =
    colorVariations.length > 0
      ? uniq(colorVariations.map((v) => v.color || ""))
      : undefined;
  const sizeAutocomplete =
    sizeVariations.length > 0
      ? uniq(sizeVariations.map((v) => v.size || ""))
      : undefined;
  const learnMoreLink = zendeskURL("4405383834267");

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ModalTitle title={i`Add a variation`} onClose={onClose} />
      <Layout.FlexColumn style={styles.root}>
        <Layout.FlexColumn style={styles.content}>
          <Layout.GridRow
            templateColumns="1fr 1fr"
            smallScreenTemplateColumns="1fr"
            gap={10}
          >
            {hasColors && (
              <Field title={LEGACY_COLOR_DISPLAY_TEXT}>
                <TextInput
                  placeholder={i`Enter a color`}
                  value={color}
                  onChange={({ text }) => setColor(text.trim())}
                  hideCheckmarkWhenValid
                  autoCompleteDatalist={colorAutocomplete}
                  validators={[new RequiredValidator()]}
                  forceValidation={forceValidation}
                  onValidityChanged={(isValid) => setColorIsValid(isValid)}
                  data-cy="input-variation-custom-color"
                />
              </Field>
            )}
            {hasSizes && (
              <Field title={LEGACY_SIZE_DISPLAY_TEXT}>
                <TextInput
                  placeholder={i`Enter a value`}
                  value={size}
                  onChange={({ text }) => setSize(text.trim())}
                  hideCheckmarkWhenValid
                  autoCompleteDatalist={sizeAutocomplete}
                  validators={[new RequiredValidator()]}
                  forceValidation={forceValidation}
                  onValidityChanged={(isValid) => setSizeIsValid(isValid)}
                  data-cy="input-variation-custom-variation"
                />
              </Field>
            )}
            {hasOptions &&
              optionNames.map((name) => (
                <Field title={name} key={name}>
                  <FormSelect
                    options={optionNameToValueOptions[name]}
                    selectedValue={optionValues[name]}
                    onSelected={(value: string | undefined) => {
                      if (value == null) {
                        setOpionsAreValid({
                          ...optionsAreValid,
                          [name]: false,
                        });
                      } else {
                        setOpionsAreValid({
                          ...optionsAreValid,
                          [name]: true,
                        });
                      }
                      setOptionValues({ ...optionValues, [name]: value });
                    }}
                    placeholder={ci18n("Select a dropdown option", "Select")}
                    error={forceValidation && !optionsAreValid[name]}
                    data-cy={`select-variation-${name}`}
                  />
                  {forceValidation && !optionsAreValid[name] && (
                    <ErrorText style={styles.errorMsg}>
                      This field is required
                    </ErrorText>
                  )}
                </Field>
              ))}
            <Field title={ci18n("Field title, means product price", "Price")}>
              <CurrencyInput
                value={priceText}
                placeholder="0.00"
                currencyCode={primaryCurrency}
                hideCheckmarkWhenValid
                onChange={({ text }) => setPriceText(text)}
                validators={[new RequiredValidator()]}
                forceValidation={forceValidation}
                onValidityChanged={(isValid) => setPriceIsValid(isValid)}
                data-cy="input-variation-price"
              />
            </Field>
            <Field
              title={ci18n("Field title, means product inventory", "Inventory")}
            >
              <NumericInput
                value={inventory}
                onChange={({ valueAsNumber }) => {
                  setInventory(
                    valueAsNumber == null
                      ? valueAsNumber
                      : Math.max(valueAsNumber, 0),
                  );
                }}
                validators={[new RequiredValidator()]}
                onValidityChanged={({ isValid }) =>
                  setInventoryIsValid(isValid)
                }
                forceValidation={forceValidation}
                data-cy="input-variation-inventory"
              />
            </Field>
            <Field title={ci18n("Field title, means product SKU", "SKU")}>
              <TextInput
                placeholder={i`Enter a SKU`}
                value={sku}
                onChange={({ text }) => setSku(text)}
                validators={[new RequiredValidator()]}
                forceValidation={forceValidation}
                hideCheckmarkWhenValid
                onValidityChanged={(isValid) => setSkuIsValid(isValid)}
                data-cy="input-variation-sku"
              />
            </Field>
            {showUnitPrice && (
              <Field
                title={ci18n(
                  "Field title, the total quantity of the product variant (in the given unit) that is used to calculate the price per unit of a product.",
                  "Quantity value",
                )}
                description={
                  i`The total quantity of the product variant (in the given unit) ` +
                  i`that is used to calculate the price per unit of a product. Note ` +
                  i`that if a product has multiple product variants, you will need ` +
                  i`to set quantity values for each product variant. ` +
                  i`[Learn More](${learnMoreLink}).`
                }
              >
                <Layout.FlexRow alignItems="flex-start">
                  <NumericInput
                    value={quantityValue}
                    onChange={({ valueAsNumber }) => {
                      setQuantityValue(
                        valueAsNumber == null
                          ? undefined
                          : Math.max(0, valueAsNumber),
                      );
                    }}
                    placeholder="0"
                    validators={[
                      new NonZeroValidator({
                        customMessage: i`Enter a non-zero value`,
                        allowBlank: false,
                      }),
                    ]}
                    forceValidation={forceValidation}
                    onValidityChanged={({ isValid }) =>
                      setQuantityValueIsValid(isValid)
                    }
                    data-cy="input-variation-quantity-value"
                  />
                  {unitPriceUnit != null && (
                    <Layout.FlexRow
                      alignItems="flex-start"
                      style={{ margin: "11px 0px 0px 8px" }}
                    >
                      {unitDisplayName(unitPriceUnit).symbol}
                    </Layout.FlexRow>
                  )}
                </Layout.FlexRow>
              </Field>
            )}
          </Layout.GridRow>
        </Layout.FlexColumn>
        <Layout.FlexRow
          style={styles.footer}
          justifyContent="space-between"
          alignItems="center"
        >
          <Button onClick={onClose} data-cy="button-add-variation-cancel">
            {ci18n("CTA Button", "Cancel")}
          </Button>
          <PrimaryButton
            onClick={onSubmit}
            isDisabled={!canSubmit}
            data-cy="button-add-variation-save"
          >
            {ci18n("CTA Button", "Save")}
          </PrimaryButton>
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Modal>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          "@media (max-width: 900px)": {
            alignItems: "stretch",
          },
        },
        content: {
          padding: "10px 20px",
        },
        errorMsg: {
          marginTop: 7,
        },
        footer: {
          alignSelf: "stretch",
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
        },
      }),
    [borderPrimary],
  );
};

export default observer(AddVariationModalV2);
