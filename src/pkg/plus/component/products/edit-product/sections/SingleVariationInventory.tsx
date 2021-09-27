/*
 *
 * SingleVariationInventory.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import faker from "faker/locale/en";

import { Field, TextInput, NumericInput, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  NonZeroValidator,
  RequiredValidator,
  UPCValidator,
} from "@toolkit/validators";
import { zendeskURL } from "@toolkit/url";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";
import { unitDisplayName } from "@toolkit/product-edit";

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const SingleVariationInventory: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState, ...sectionProps } = props;

  const {
    forceValidation,
    standardWarehouseId,
    isSubmitting,
    unitPriceUnit,
    showUnitPrice,
  } = editState;
  const variation = editState.variationsList[0];
  const learnMoreLink = zendeskURL("4405383834267");
  return (
    <Section
      className={css(style, className)}
      title={i`Inventory`}
      {...sectionProps}
    >
      <div className={css(styles.parent)}>
        <Field
          title={i`Parent SKU`}
          description={
            i`Parent SKU is the unique identifier that groups all your ` +
            i`variation SKUs under one product. This helps facilitate ` +
            i`CSV functionality. If not provided, parent SKU will ` +
            i`default to the first variation SKU.`
          }
          className={css(styles.field)}
        >
          <div className={css(styles.content)}>
            <TextInput
              onChange={({ text }) => editState.setSku(text)}
              value={editState.sku}
              placeholder={
                variation.sku ? variation.sku : i`Enter the Parent SKU`
              }
              className={css(styles.input)}
              disabled={isSubmitting}
            />
          </div>
        </Field>
        <Field title={i`SKU`} className={css(styles.field)}>
          <div className={css(styles.content)}>
            <TextInput
              value={variation.sku}
              placeholder={i`Enter the SKU`}
              className={css(styles.input)}
              onChange={({ text }) => (variation.sku = text)}
              debugValue={faker.random.alphaNumeric(6).toUpperCase()}
              forceValidation={forceValidation}
              hideCheckmarkWhenValid
              validators={[new RequiredValidator()]}
              disabled={isSubmitting}
            />
          </div>
        </Field>
        <Field title={i`Inventory`} className={css(styles.field)}>
          <div className={css(styles.content)}>
            <NumericInput
              value={variation.getInventory(standardWarehouseId)}
              placeholder="0"
              className={css(styles.input)}
              incrementStep={1}
              onChange={({ valueAsNumber }) =>
                variation.setInventory(valueAsNumber || 0, standardWarehouseId)
              }
              validators={[new RequiredValidator()]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
            />
          </div>
        </Field>
        <Field title={i`Barcode (optional)`} className={css(styles.field)}>
          <div className={css(styles.content)}>
            <TextInput
              value={editState.upc || ""}
              placeholder={i`Enter the GTIN (UPC, EAN, ISBN) barcode`}
              className={css(styles.input)}
              onChange={({ text }) => editState.setUpc(text)}
              debugValue={Math.round(Math.random() * 1e12).toString()}
              validators={[new UPCValidator()]}
              forceValidation={forceValidation}
              hideCheckmarkWhenValid
              disabled={isSubmitting}
            />
          </div>
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
            <div className={css(styles.content)}>
              <NumericInput
                value={variation.quantityValue}
                onChange={({ valueAsNumber }) => {
                  variation.quantityValue =
                    valueAsNumber == null
                      ? undefined
                      : Math.max(0, valueAsNumber);
                }}
                placeholder="0"
                className={css(styles.input)}
                incrementStep={1}
                validators={[new RequiredValidator(), new NonZeroValidator()]}
                forceValidation={forceValidation}
                disabled={isSubmitting}
              />
              {unitPriceUnit != null && (
                <Layout.FlexRow
                  alignItems="flex-start"
                  style={{ margin: "11px 0px 0px 8px" }}
                >
                  {unitDisplayName(unitPriceUnit).symbol}
                </Layout.FlexRow>
              )}
            </div>
          </Field>
        )}
      </div>
    </Section>
  );
};

export default observer(SingleVariationInventory);

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
      }),
    []
  );
