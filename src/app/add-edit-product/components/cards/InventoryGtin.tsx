import React from "react";
import { observer } from "mobx-react";
import { Field, TextInput, NumericInput } from "@ContextLogic/lego";
import {
  MinMaxValueValidator,
  RequiredValidator,
  UPCValidator,
} from "@core/toolkit/validators";
import { zendeskURL } from "@core/toolkit/url";
import Section, { SectionProps } from "./Section";
import { unitDisplayName } from "@add-edit-product/toolkit";
import AddEditProductState, {
  getVariationInventory,
} from "@add-edit-product/AddEditProductState";
import { Grid, Stack, Text } from "@ContextLogic/atlas-ui";
import { ci18n } from "@core/toolkit/i18n";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const InventoryGtin: React.FC<Props> = (props: Props) => {
  const { style, className, state, ...sectionProps } = props;

  const {
    forceValidation,
    isSubmitting,
    variations,
    standardWarehouseId,
    setSingleVariationInventory,
    setSingleVariationGtin,
    setSingleVariationQuantityValue,
    unitPriceUnit,
    showUnitPrice,
  } = state;

  const learnMoreLink = zendeskURL("4405383834267");
  const attributesLearnMoreLink = zendeskURL("1260805100070");

  const variation = variations[0];
  const inventory =
    variation == null
      ? undefined
      : getVariationInventory({ variation, warehouseId: standardWarehouseId });
  const gtin = variation == null ? undefined : variation.gtin;
  const quantityValue = variation == null ? undefined : variation.quantityValue;

  return (
    <Section
      style={[style, className]}
      title={ci18n("Section title", "Inventory and GTIN")}
      {...sectionProps}
    >
      <Grid container spacing={{ xs: 2 }}>
        <Grid item xs={6}>
          <Field
            title={ci18n(
              "Field title, the asterisk symbol means field is required",
              "Inventory*",
            )}
            description={
              i`Amount of stock for an SKU. Please use inventory buffering for Wish ` +
              i`specified inventory. Maximum 500,000. Larger inventories will be ` +
              i`automatically lowered. [Learn more](${attributesLearnMoreLink})`
            }
          >
            <NumericInput
              value={inventory}
              onChange={({ valueAsNumber }) =>
                setSingleVariationInventory(valueAsNumber)
              }
              validators={[
                new RequiredValidator(),
                new MinMaxValueValidator({
                  minAllowedValue: 0,
                  customMessage: i`Value cannot be negative`,
                  allowBlank: true,
                }),
              ]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              data-cy="input-inventory"
            />
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field
            title={i`GTIN (UPC, EAN, ISBN)`}
            description={
              i`A barcode symbology used for tracking trade items in stores and scanning ` +
              i`them at the point of sale. 8 to 14 digits GTIN (UPC, EAN, ISBN) that ` +
              i`contains no letters or other characters. [Learn more](${attributesLearnMoreLink})`
            }
          >
            <TextInput
              value={gtin || ""}
              placeholder={i`Enter the GTIN (UPC, EAN, ISBN) barcode`}
              onChange={({ text }) => setSingleVariationGtin(text)}
              validators={[new UPCValidator()]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              data-cy="input-gtin"
            />
          </Field>
        </Grid>
        {showUnitPrice && (
          <Grid item xs={6}>
            <Field
              title={i`Quantity value`}
              description={
                i`The total quantity of the product variant (in the given unit) ` +
                i`that is used to calculate the price per unit of a product. Note ` +
                i`that if a product has multiple product variants, you will need ` +
                i`to set quantity values for each product variant. ` +
                i`[Learn More](${learnMoreLink}).`
              }
            >
              <Stack direction="row" alignItems="center" sx={{ gap: "8px" }}>
                <NumericInput
                  style={{ width: "90%" }}
                  value={quantityValue}
                  onChange={({ valueAsNumber }) => {
                    setSingleVariationQuantityValue(valueAsNumber);
                  }}
                  validators={[
                    new RequiredValidator(),
                    new MinMaxValueValidator({
                      minAllowedValue: 0.001,
                      customMessage: i`Value cannot be zero or less`,
                    }),
                  ]}
                  forceValidation={forceValidation}
                  disabled={isSubmitting}
                  data-cy="input-quantity-value"
                />
                {unitPriceUnit != null && (
                  <Text>{unitDisplayName(unitPriceUnit).symbol}</Text>
                )}
              </Stack>
            </Field>
          </Grid>
        )}
      </Grid>
    </Section>
  );
};

export default observer(InventoryGtin);
