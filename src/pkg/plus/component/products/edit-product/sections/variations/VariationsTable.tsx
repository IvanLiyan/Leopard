/*
 *
 * VariationsMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/24/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState } from "react";
import { observer } from "mobx-react";

import { ni18n } from "@legacy/core/i18n";

import faker from "faker/locale/en";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  CustomsHsCodeValidator,
  MinMaxValueValidator,
  RequiredValidator,
} from "@toolkit/validators";
import { zendeskURL } from "@toolkit/url";

/* Merchant Store */
import { useToastStore } from "@merchant/stores/ToastStore";

import { Layout, RowSelectionArgs, Text } from "@ContextLogic/lego";
import {
  TextInput,
  NumericInput,
  CurrencyInput,
  DeleteButton,
} from "@ContextLogic/lego";
import ProductEditState, {
  UniqueSkuValidator,
  VariationEditState,
} from "@plus/model/ProductEditState";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import VariationTableImage from "./VariationTableImage";
import { Table } from "@ContextLogic/lego";

import { CellInfo } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { unitDisplayName } from "@toolkit/product-edit";

type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const VariationsTable: React.FC<Props> = (props: Props) => {
  const { style, className, editState } = props;
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([]));
  const toastStore = useToastStore();

  const {
    variationsList,
    hasColors,
    hasSizes,
    isSubmitting,
    forceValidation,
    primaryCurrency,
    showUnitPrice,
    unitPriceUnit,
  } = editState;
  if (variationsList.length == 0) {
    return null;
  }

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<VariationEditState>) => {
    if (selected) {
      selectedRows.add(index);
    } else {
      selectedRows.delete(index);
    }
    setSelectedRows(new Set(selectedRows));
  };

  const actions = [
    {
      key: "discard",
      name: i`Discard`,
      canBatch: variationsList.some((variation) => !variation.isSaved),
      canApplyToRow: (variation: VariationEditState) => !variation.isSaved,
      apply: (variations: ReadonlyArray<VariationEditState>) => {
        new ConfirmationModal(
          ni18n(
            variations.length,
            "Are you sure you want to discard this variation?",
            "Are you sure you want to discard these variations?"
          )
        )
          .setHeader({ title: i`Confirm` })
          .setCancel(i`Cancel`)
          .setAction(i`Yes, discard`, async () => {
            editState.discardVariations(variations);
            setSelectedRows(new Set([]));
            toastStore.info(
              ni18n(
                variations.length,
                "Variation has been discarded",
                "%1$d variations have been discarded"
              )
            );
          })
          .render();
      },
    },
  ];
  const learnMoreLink = zendeskURL("4405383834267");

  return (
    <Table
      key={[hasColors, hasSizes].join("_")}
      data={variationsList}
      hideBorder
      className={css(style, className)}
      actions={actions}
      rowHeight={70}
      selectedRows={Array.from(selectedRows)}
      onRowSelectionToggled={onRowSelectionToggled}
      doubleClickToSelectRow={false}
      renderRowActions={({ actions: [action], apply }) => {
        return (
          <DeleteButton
            onClick={() => apply(action)}
            popoverContent={i`Discard`}
          />
        );
      }}
      actionColumnWidth={70}
    >
      <Table.Column title={i`Image`} columnKey="image.wishUrl" handleEmptyRow>
        {({
          row: variation,
        }: CellInfo<VariationEditState, VariationEditState>) => (
          <VariationTableImage variation={variation} editState={editState} />
        )}
      </Table.Column>
      {hasColors && (
        <Table.Column
          title={i`Color`}
          columnKey="color"
          noDataMessage={i`No color`}
          width={55}
        />
      )}
      {hasSizes && (
        <Table.Column
          title={i`Size`}
          columnKey="size"
          noDataMessage={i`No size`}
          width={55}
        />
      )}
      <Table.Column title={i`SKU`} columnKey="sku" minWidth={80} handleEmptyRow>
        {({
          row: variation,
        }: CellInfo<VariationEditState["size"], VariationEditState>) => (
          <TextInput
            value={variation.sku}
            onChange={({ text }) => (variation.sku = text)}
            debugValue={faker.finance.iban().substring(0, 5)}
            style={{ minWidth: 80 }}
            hideCheckmarkWhenValid
            forceValidation={forceValidation}
            validators={[
              new RequiredValidator(),
              new UniqueSkuValidator({ editState }),
            ]}
            disabled={isSubmitting}
          />
        )}
      </Table.Column>
      <Table.Column
        title={i`Price`}
        columnKey="price"
        minWidth={80}
        handleEmptyRow
      >
        {({
          row: variation,
        }: CellInfo<VariationEditState["price"], VariationEditState>) => {
          const currentAmount = variation.price;
          return (
            <CurrencyInput
              value={currentAmount?.toString()}
              placeholder="0.00"
              currencyCode={primaryCurrency}
              hideCheckmarkWhenValid
              onChange={({ textAsNumber }) => variation.setPrice(textAsNumber)}
              debugValue={(Math.random() * 10).toFixed(2).toString()}
              style={{ minWidth: 80 }}
              forceValidation={forceValidation}
              validators={[new RequiredValidator()]}
              disabled={isSubmitting}
              inputStyle={{
                width: 26,
              }}
            />
          );
        }}
      </Table.Column>
      <Table.Column title={i`Inventory`} columnKey="inventory" handleEmptyRow>
        {({
          row: variation,
        }: CellInfo<VariationEditState, VariationEditState>) => {
          return (
            <NumericInput
              value={variation.getInventory(editState.standardWarehouseId)}
              incrementStep={1}
              onChange={({ valueAsNumber }) =>
                variation.setInventory(
                  valueAsNumber || 0,
                  editState.standardWarehouseId
                )
              }
              validators={[new RequiredValidator()]}
              forceValidation={forceValidation}
              disabled={isSubmitting}
              style={{ minWidth: 80 }}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        title={i`Customs HS Code`}
        columnKey="customsHsCode"
        handleEmptyRow
        description={
          i`Harmonization System Code used for custom declaration. NOTE: ` +
          i`Make sure to provide this information so that the product's ` +
          i`European Union-bound orders may smoothly pass through customs.`
        }
      >
        {({
          row: variation,
        }: CellInfo<VariationEditState, VariationEditState>) => {
          return (
            <TextInput
              value={variation.customsHsCode}
              onChange={({ text }) => (variation.customsHsCode = text)}
              debugValue={"0000.00.0000"}
              style={{ minWidth: 130 }}
              hideCheckmarkWhenValid
              forceValidation={forceValidation}
              validators={[new CustomsHsCodeValidator({ allowBlank: true })]}
              disabled={isSubmitting}
            />
          );
        }}
      </Table.Column>
      <Table.Column
        title={i`Weight`}
        columnKey="weight"
        handleEmptyRow
        description={
          i`The weight of your product that will be packaged to ship to ` +
          i`customer (units ing). NOTE: Make sure to provide this information ` +
          i`so that the product's European Union-bound orders may smoothly ` +
          i`pass through customs.`
        }
      >
        {({
          row: variation,
        }: CellInfo<VariationEditState, VariationEditState>) => {
          return (
            <Layout.FlexRow>
              <NumericInput
                value={variation.weight}
                incrementStep={1}
                onChange={({ valueAsNumber }) => {
                  variation.weight =
                    valueAsNumber == null
                      ? undefined
                      : Math.max(0, valueAsNumber);
                }}
                validators={[
                  new MinMaxValueValidator({
                    minAllowedValue: 0,
                    customMessage: i`Enter a valid weight`,
                    allowBlank: true,
                  }),
                ]}
                forceValidation={forceValidation}
                disabled={isSubmitting}
                style={{ minWidth: 80 }}
              />
              <Text style={{ marginLeft: 8 }}>g</Text>
            </Layout.FlexRow>
          );
        }}
      </Table.Column>
      {showUnitPrice && (
        <Table.Column
          title={i`Quantity value`}
          columnKey="weight"
          handleEmptyRow
          description={
            i`The total quantity of the product variant (in the given unit) ` +
            i`that is used to calculate the price per unit of a product. Note ` +
            i`that if a product has multiple product variants, you will need ` +
            i`to set quantity values for each product variant. ` +
            i`[Learn More](${learnMoreLink}).`
          }
        >
          {({
            row: variation,
          }: CellInfo<VariationEditState, VariationEditState>) => {
            return (
              <Layout.FlexRow>
                <NumericInput
                  value={variation.quantityValue}
                  onChange={({ valueAsNumber }) => {
                    variation.quantityValue =
                      valueAsNumber == null
                        ? undefined
                        : Math.max(0, valueAsNumber);
                  }}
                  validators={[new RequiredValidator()]}
                  forceValidation={forceValidation}
                  disabled={isSubmitting}
                  style={{ minWidth: 80 }}
                />
                {unitPriceUnit != null && (
                  <Text style={{ marginLeft: 8 }}>
                    {unitDisplayName(unitPriceUnit).symbol}
                  </Text>
                )}
              </Layout.FlexRow>
            );
          }}
        </Table.Column>
      )}
    </Table>
  );
};

export default observer(VariationsTable);
