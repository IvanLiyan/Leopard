/*
 * Inventory.tsx
 *
 * Created by Jonah Dlin on Thu Oct 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import numeral from "numeral";
import faker from "faker/locale/en";
import { ci18n } from "@core/toolkit/i18n";
import { Field, TextInput, NumericInput, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import {
  NonZeroValidator,
  RequiredValidator,
  UPCValidator,
} from "@core/toolkit/validators";
import { zendeskURL } from "@core/toolkit/url";

import Section, { SectionProps } from "./Section";
import { unitDisplayName } from "@add-edit-product/toolkit";
import AddEditProductState, {
  getVariationInventory,
} from "@add-edit-product/AddEditProductState";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const Inventory: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;

  const {
    forceValidation,
    isSubmitting,
    variations,
    standardWarehouseId,
    setSingleVariationSku,
    setSingleVariationInventory,
    setSingleVariationGtin,
    setSingleVariationQuantityValue,
    unitPriceUnit,
    showUnitPrice,
    maxQuantity,
  } = state;

  const attributesLearnMoreLink = zendeskURL("1260805100070");

  const variation = variations[0];
  const inventory =
    variation == null
      ? undefined
      : getVariationInventory({ variation, warehouseId: standardWarehouseId });
  const gtin = variation == null ? undefined : variation.gtin;
  const quantityValue = variation == null ? undefined : variation.quantityValue;
  const sku = variation == null ? undefined : variation.sku;

  const learnMoreLink = zendeskURL("1260805100070");
  return (
    <Section
      className={css(style, className)}
      title={ci18n("add products section title", "Inventory")}
      {...sectionProps}
    >
      <div className={css(styles.parent)}>
        <Field
          title={ci18n("add products section title", "SKU")}
          style={styles.field}
          description={
            i`Provide the unique SKU number you use internally to identify ` +
            i`this item. Please keep this SKU number for any SKU number ` +
            i`updates to this item in future feeds. Wish.com's system uses ` +
            i`this SKU number to identify, track, update, and report on this ` +
            i`item. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <Layout.FlexRow style={styles.content} alignItems="stretch">
            <TextInput
              value={sku}
              placeholder={i`Enter the SKU`}
              style={styles.input}
              onChange={({ text }) => setSingleVariationSku(text)}
              debugValue={faker.random.alphaNumeric(6).toUpperCase()}
              forceValidation={forceValidation}
              hideCheckmarkWhenValid
              validators={[new RequiredValidator()]}
              disabled={isSubmitting}
              data-cy="input-sku"
            />
          </Layout.FlexRow>
        </Field>
        <Field
          title={i`GTIN (UPC, EAN, ISBN)`}
          style={styles.field}
          description={
            i`${12} to ${14} digits GTIN (UPC, EAN, ISBN) that contains no letters or other ` +
            i`characters. A barcode symbology used for tracking trade items in stores and ` +
            i`scanning them at the point of sale. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <Layout.FlexRow style={styles.content} alignItems="stretch">
            <TextInput
              value={gtin || ""}
              placeholder={i`Enter the GTIN (UPC, EAN, ISBN) barcode`}
              style={styles.input}
              onChange={({ text }) => setSingleVariationGtin(text)}
              debugValue={Math.round(Math.random() * 1e12).toString()}
              validators={[new UPCValidator()]}
              forceValidation={forceValidation}
              hideCheckmarkWhenValid
              disabled={isSubmitting}
              data-cy="input-gtin"
            />
          </Layout.FlexRow>
        </Field>
        <Field
          title={i`Inventory (quantity available)`}
          style={styles.field}
          description={
            i`Amount of an SKU that is in stock. Please use inventory buffering for Wish ` +
            i`specified inventory. Maximum ${numeral(500000)
              .format("0,0")
              .toString()}. Larger inventories will be automatically ` +
            i`lowered. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <Layout.FlexRow style={styles.content} alignItems="stretch">
            <NumericInput
              value={inventory}
              placeholder="0"
              style={styles.input}
              onChange={({ valueAsNumber }) =>
                setSingleVariationInventory(valueAsNumber || 0)
              }
              validators={[new RequiredValidator()]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              data-cy="input-inventory"
            />
          </Layout.FlexRow>
        </Field>
        <Field
          title={i`Max quantity (optional)`}
          style={styles.field}
          description={
            i`The maximum quantity of products per order. This lets users break down large ` +
            i`orders for easy management and tracking. This should only be used in rare ` +
            i`cases. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <Layout.FlexRow style={styles.content} alignItems="stretch">
            <NumericInput
              value={maxQuantity}
              placeholder="0"
              style={styles.input}
              onChange={({ valueAsNumber }) =>
                (state.maxQuantity = valueAsNumber)
              }
              disabled={isSubmitting}
              data-cy="input-max-quantity"
            />
          </Layout.FlexRow>
        </Field>
        {showUnitPrice && (
          <Field
            title={ci18n("add products section title", "Quantity value")}
            style={styles.field}
            description={
              i`The total quantity of the product variant (in the given unit) ` +
              i`that is used to calculate the price per unit of a product. Note ` +
              i`that if a product has multiple product variants, you will need ` +
              i`to set quantity values for each product variant. ` +
              i`[Learn More](${learnMoreLink}).`
            }
          >
            <Layout.FlexRow style={styles.content} alignItems="stretch">
              <NumericInput
                value={quantityValue}
                onChange={({ valueAsNumber }) => {
                  setSingleVariationQuantityValue(
                    valueAsNumber == null
                      ? undefined
                      : Math.max(0, valueAsNumber),
                  );
                }}
                placeholder="0"
                style={styles.input}
                validators={[new RequiredValidator(), new NonZeroValidator()]}
                forceValidation={forceValidation}
                disabled={isSubmitting}
                data-cy="input-quantity-value"
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
    </Section>
  );
};

export default observer(Inventory);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
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
      }),
    [],
  );
