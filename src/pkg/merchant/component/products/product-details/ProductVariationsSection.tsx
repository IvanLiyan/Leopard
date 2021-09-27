//@flow
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { AddVariationModal } from "@merchant/component/products/product-details/AddVariationModalContent";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Table } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { TextInput, OnTextChangeEvent } from "@ContextLogic/lego";
import ProductEditState from "@merchant/model/products/ProductEditState";
import { CurrencyInput } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";

import { RequiredValidator } from "@toolkit/validators";
import { Switch } from "@ContextLogic/lego";

export type ProductVariation = {
  readonly id: string;
  readonly color: string;
  readonly size: string;
  readonly sku: string;
  readonly price: number;
  readonly cost: number;
  readonly inventory: number;
  readonly enabled: boolean;
};

type ProductVariationsSectionProps = BaseProps & {
  readonly variations: ReadonlyArray<ProductVariation>;
  readonly parentSKU: string;
  readonly cid: string;
  readonly productName: string;
  readonly warehouseId: string;
  readonly editState: ProductEditState;
};

const ProductVariationsSection = (props: ProductVariationsSectionProps) => {
  const styles = useStylesheet();

  const { variations, parentSKU, cid, productName, editState } = props;
  const { userStore } = useStore();
  const isCostBased = userStore.isCostBased;
  const currencyCode = userStore.merchantSourceCurrency || "USD";
  const totalCount = variations.length;
  const [offset, setOffset] = useState(0);
  const pageSize = 10;
  const [hasNext, setHasNext] = useState(totalCount > pageSize);
  const [currentEnd, setCurrentEnd] = useState(Math.min(pageSize, totalCount));

  const currentVariations = variations.slice(offset, currentEnd);

  const variationMap = new Map();
  variations.forEach((item) => {
    variationMap.set(item.id, item);
  });

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setOffset(nextPage * pageSize);
    const newOffset = nextPage * pageSize;
    if (newOffset + pageSize >= totalCount) {
      setCurrentEnd(totalCount);
      setHasNext(false);
    } else {
      setCurrentEnd(newOffset + pageSize);
      setHasNext(true);
    }
  };

  const renderEditColor = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <TextInput
          className={css(styles.textInput)}
          value={
            editState.variations?.get(row.id)?.color !== undefined
              ? editState.variations?.get(row.id)?.color
              : variationMap.get(row.id).color
          }
          onChange={({ text }) => {
            editState.setVariationColor({ id: row.id, value: text });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderEditSize = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <TextInput
          className={css(styles.textInput)}
          value={
            editState.variations?.get(row.id)?.size !== undefined
              ? editState.variations?.get(row.id)?.size
              : variationMap.get(row.id).size
          }
          onChange={({ text }) => {
            editState.setVariationSize({ id: row.id, value: text });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderEditSKU = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <TextInput
          className={css(styles.textInput)}
          validators={[new RequiredValidator()]}
          value={
            editState.variations?.get(row.id)?.sku !== undefined
              ? editState.variations?.get(row.id)?.sku
              : variationMap.get(row.id).sku
          }
          onChange={({ text }) => {
            editState.setVariationSKU({ id: row.id, value: text.trim() });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderEditInventory = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <NumericInput
          className={css(styles.textInput)}
          validators={[new RequiredValidator()]}
          incrementStep={1}
          value={
            editState.variations?.get(row.id)?.inventory !== undefined
              ? editState.variations?.get(row.id)?.inventory
              : variationMap.get(row.id).inventory
          }
          onChange={({ valueAsNumber }) => {
            const number = valueAsNumber ? Math.max(valueAsNumber, 0) : 0;
            editState.setVariationInventory({ id: row.id, value: number });
          }}
        />
      </div>
    );
  };

  const renderEditPrice = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <CurrencyInput
          className={css(styles.textInput)}
          validators={isCostBased ? undefined : [new RequiredValidator()]}
          currencyCode={currencyCode}
          value={
            editState.variations?.get(row.id)?.price !== undefined
              ? editState.variations?.get(row.id)?.price
              : variationMap.get(row.id).price
          }
          onChange={({ text }: OnTextChangeEvent) => {
            const number = Number(text) >= 0 ? Number(text) : 0;
            editState.setVariationPrice({ id: row.id, value: number });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderEditCost = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <CurrencyInput
          className={css(styles.textInput)}
          validators={[new RequiredValidator()]}
          currencyCode={currencyCode}
          value={
            editState.variations?.get(row.id)?.cost !== undefined
              ? editState.variations?.get(row.id)?.cost
              : variationMap.get(row.id).cost
          }
          onChange={({ text }: OnTextChangeEvent) => {
            const number = Number(text) >= 0 ? Number(text) : 0;
            editState.setVariationCost({ id: row.id, value: number });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderEditEnabled = (row: ProductVariation) => {
    return (
      <div className={css(styles.cell)}>
        <Switch
          isOn={
            editState.variations?.get(row.id)?.enabled !== undefined
              ? editState.variations?.get(row.id)?.enabled
              : variationMap.get(row.id).enabled
          }
          onToggle={(to) =>
            editState.setVariationEnabled({ id: row.id, value: to })
          }
          showText={false}
        />
      </div>
    );
  };

  const renderVariationTable = () => {
    return (
      <Table
        className={css(styles.table)}
        data={currentVariations}
        noDataMessage={i`No active variations found`}
        maxVisibleColumns={20}
      >
        <Table.Column
          title={i`Color`}
          columnKey="color"
          align="center"
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderEditColor(row)}
        </Table.Column>
        <Table.Column
          title={i`Size`}
          columnKey="size"
          align="center"
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderEditSize(row)}
        </Table.Column>
        <Table.Column
          title={i`SKU`}
          columnKey="sku"
          align="center"
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderEditSKU(row)}
        </Table.Column>
        <Table.Column
          title={i`Price`}
          columnKey="price"
          align="center"
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderEditPrice(row)}
        </Table.Column>
        {isCostBased && (
          <Table.Column
            title={i`Cost`}
            columnKey="cost"
            align="center"
            noDataMessage={""}
            handleEmptyRow
          >
            {({ row }) => renderEditCost(row)}
          </Table.Column>
        )}
        <Table.Column
          title={i`Inventory`}
          columnKey="inventory"
          align="center"
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderEditInventory(row)}
        </Table.Column>
        <Table.Column
          title={i`Enable Globally`}
          columnKey="enabled"
          align="center"
          noDataMessage={""}
          handleEmptyRow
        >
          {({ row }) => renderEditEnabled(row)}
        </Table.Column>
      </Table>
    );
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.row)}>
        <div className={css(styles.button)}>
          <Button
            onClick={() => {
              new AddVariationModal({
                onColorChange: () => {},
                onSizeChange: () => {},
                onSKUChange: () => {},
                onPriceChange: () => {},
                onCostChange: () => {},
                onInventoryChange: () => {},
                currencyCode,
                parentSKU,
                cid,
                productName,
              }).render();
            }}
          >
            Add Variation
          </Button>
        </div>
      </div>
      <div className={css(styles.topControls)}>
        <PageIndicator
          isLoading={false}
          totalItems={totalCount}
          rangeStart={offset + 1}
          rangeEnd={currentEnd}
          hasNext={hasNext}
          hasPrev={offset >= pageSize}
          currentPage={offset / pageSize}
          onPageChange={onPageChange}
        />
      </div>
      {renderVariationTable()}
    </div>
  );
};

export default observer(ProductVariationsSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        table: {
          padding: 20,
        },
        root: {
          display: "flex",
          flexDirection: "column",
          padding: `20px`,
        },
        tips: {
          marginBottom: 10,
        },
        topControls: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 10,
        },
        pageIndicator: {
          marginLeft: 15,
        },
        row: {
          display: "flex",
        },
        button: {
          marginRight: 8,
        },
        cell: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        },
        textInput: {
          width: 128,
          minheight: 24,
          margin: "4px 4px",
          flexShrink: 0,
        },
      }),
    []
  );
};
