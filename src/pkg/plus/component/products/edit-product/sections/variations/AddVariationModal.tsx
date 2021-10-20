import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import _ from "lodash";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

import faker from "faker/locale/en";

import {
  Field,
  TextInput,
  NumericInput,
  CurrencyInput,
  Layout,
} from "@ContextLogic/lego";
import { NonZeroValidator, RequiredValidator } from "@toolkit/validators";
import { zendeskURL } from "@toolkit/url";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import ToastStore from "@stores/ToastStore";

import ProductEditState, {
  UniqueSkuValidator,
  VariationEditState,
} from "@plus/model/ProductEditState";
import { unitDisplayName } from "@toolkit/product-edit";

import { Weight, Length, Volume, Area, Count } from "@schema/types";

export type AddVariationModalProps = {
  readonly editState: ProductEditState;
  readonly onClose: () => unknown;
};

const AddVariationModalContent: React.FC<AddVariationModalProps> = observer(
  ({ editState, onClose }: AddVariationModalProps) => {
    const [size, setSize] = useState<string | undefined>(undefined);
    const [sku, setSku] = useState<string | undefined>(undefined);
    const [color, setColor] = useState<string | undefined>(undefined);
    const [priceText, setPriceText] = useState<string | undefined>(undefined);
    const [forceValidation, setForceValidation] = useState(false);
    const [skuIsValid, setSkuIsValid] = useState(false);
    const [priceIsValid, setPriceIsValid] = useState(false);
    const [inventoryIsValid, setInventoryIsValid] = useState(false);
    const [inventory, setInventory] = useState<number | undefined | null>(
      undefined,
    );
    const [quantityValue, setQuantityValue] = useState<number | undefined>();
    const [quantityValueIsValid, setQuantityValueIsValid] = useState(false);

    const {
      hasSizes,
      hasColors,
      primaryCurrency,
      variationsList,
      standardWarehouseId,
      colorVariations,
      sizeVariations,
      showUnitPrice,
      unitPriceUnit,
      measurementType,
    } = editState;

    const canSubmit =
      skuIsValid &&
      priceIsValid &&
      inventoryIsValid &&
      (!showUnitPrice || quantityValueIsValid);
    const toastStore = ToastStore.instance();

    const styles = useStylesheet();
    const onSubmit = async () => {
      setForceValidation(true);
      if (!canSubmit) {
        return;
      }

      if (priceText == null) {
        return;
      }

      let colorValue: string | undefined = (color || "").trim();
      let sizeValue: string | undefined = (size || "").trim();
      colorValue = colorValue.length > 0 ? colorValue : undefined;
      sizeValue = sizeValue.length > 0 ? sizeValue : undefined;

      if (!colorValue && !sizeValue) {
        toastStore.negative(i`Please provide a color and/or size`);
        return;
      }

      if (editState.hasVariation({ size: sizeValue, color: colorValue })) {
        if (!sizeValue) {
          toastStore.negative(i`A variation of this size already exists`);
        } else if (!colorValue) {
          toastStore.negative(i`A variation of this color already exists`);
        } else {
          toastStore.negative(
            i`A variation of this size and color already exists`,
          );
        }
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

      const newVariation = new VariationEditState({
        initialState: {
          sku,
          size: sizeValue,
          color: colorValue,
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
        editState,
      });
      onClose();
      editState.setVariations([newVariation, ...variationsList]);
    };

    const colorAutocomplete =
      hasColors && hasSizes
        ? _.uniq(colorVariations.map((v) => v.color || ""))
        : undefined;
    const sizeAutocomplete =
      hasColors && hasSizes
        ? _.uniq(sizeVariations.map((v) => v.size || ""))
        : undefined;
    const learnMoreLink = zendeskURL("4405383834267");
    return (
      <div className={css(styles.root)}>
        <div className={css(styles.content)}>
          <div className={css(styles.sideBySide)}>
            {hasColors && (
              <Field title={i`Color`} className={css(styles.field)}>
                <TextInput
                  placeholder={i`Enter a color`}
                  value={color}
                  onChange={({ text }) => setColor(text)}
                  debugValue={faker.commerce.color()}
                  className={css(styles.input)}
                  hideCheckmarkWhenValid
                  autoCompleteDatalist={colorAutocomplete}
                />
              </Field>
            )}
            {hasSizes && (
              <Field title={i`Size`} className={css(styles.field)}>
                <TextInput
                  placeholder={i`Enter a size`}
                  value={size}
                  onChange={({ text }) => setSize(text)}
                  debugValue="medium"
                  hideCheckmarkWhenValid
                  autoCompleteDatalist={sizeAutocomplete}
                />
              </Field>
            )}
          </div>
          <div className={css(styles.sideBySide)}>
            <Field title={i`Price`} className={css(styles.field)}>
              <CurrencyInput
                value={priceText}
                placeholder="0.00"
                currencyCode={primaryCurrency}
                hideCheckmarkWhenValid
                onChange={({ text }) => setPriceText(text)}
                debugValue={(Math.random() * 10).toFixed(2).toString()}
                validators={[new RequiredValidator()]}
                className={css(styles.input)}
                forceValidation={forceValidation}
                onValidityChanged={(isValid) => setPriceIsValid(isValid)}
              />
            </Field>
            <Field title={i`Inventory`} className={css(styles.field)}>
              <NumericInput
                value={inventory}
                incrementStep={1}
                onChange={({ valueAsNumber }) => setInventory(valueAsNumber)}
                validators={[new RequiredValidator()]}
                onValidityChanged={({ isValid }) =>
                  setInventoryIsValid(isValid)
                }
                forceValidation={forceValidation}
              />
            </Field>
          </div>
          <div className={css(styles.sideBySide)}>
            <Field title={i`SKU`} className={css(styles.field)}>
              <TextInput
                style={styles.input}
                placeholder={i`Enter a SKU`}
                value={sku}
                onChange={({ text }) => setSku(text)}
                debugValue={faker.finance.iban().substring(0, 5)}
                validators={[
                  new RequiredValidator(),
                  new UniqueSkuValidator({
                    editState,
                    isNewVariationForm: true,
                  }),
                ]}
                forceValidation={forceValidation}
                hideCheckmarkWhenValid
                onValidityChanged={(isValid) => setSkuIsValid(isValid)}
              />
            </Field>
            {showUnitPrice && (
              <Field
                title={i`Quantity value`}
                className={css(styles.field)}
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
                    incrementStep={1}
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
          </div>
        </div>
        <div className={css(styles.footer)}>
          <Button onClick={onClose}>Cancel</Button>
          <PrimaryButton onClick={onSubmit} isDisabled={!canSubmit}>
            Save
          </PrimaryButton>
        </div>
      </div>
    );
  },
);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          padding: "10px 20px",
        },
        input: {
          marginRight: 15,
        },
        field: {
          "@media (min-width: 900px)": {
            maxWidth: "50%",
          },
        },
        sideBySide: {
          display: "flex",
          alignSelf: "stretch",
          margin: "10px 0px",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "column",
            ":nth-child(1n) > div": {
              marginBottom: 20,
            },
          },
          "@media (min-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
            },
          },
        },
        footer: {
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
        },
        footerButton: {
          height: 80,
          width: 100,
        },
      }),
    [borderPrimary],
  );
};
export default class AddVariationModal extends Modal {
  constructor(props: Omit<AddVariationModalProps, "onClose">) {
    super((onClose) => (
      <AddVariationModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Add a variation`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
  }
}
