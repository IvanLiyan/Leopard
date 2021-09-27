/*
 *
 * SelectVariationsTable.tsx
 * Merchant Dashboard
 *
 * Created by Sola Ogunsakin on 5/4/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

/* Lego Components */
import { Table, SortOrder, RowSelectionArgs } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import { VariationSortField } from "@schema/types";
import CreateShippingPlanState from "@merchant/model/fbw/CreateShippingPlanState";
import { PickedVariationSchema } from "@toolkit/fbw/create-shipping-plan";
import VariationSKUColumn, { VARIATION_ICON_WIDTH } from "./VariationSKUColumn";

type DataRow = {
  readonly variation: PickedVariationSchema;
  readonly activeInventory: { [warehouseId: string]: number };
};

type Props = BaseProps & {
  readonly state: CreateShippingPlanState;
  readonly variations: ReadonlyArray<PickedVariationSchema>;
  readonly sortField: VariationSortField | undefined;
  readonly sortOrder: SortOrder | undefined;
  readonly onSortToggled: (
    field: VariationSortField,
    order: SortOrder
  ) => unknown;
};

const SelectVariationsTable: React.FC<Props> = ({
  state,
  style,
  className,
  variations,
  onSortToggled,
}: Props) => {
  const { selectedWarehouses } = state;

  const onRowSelectionToggled = ({
    row: { variation },
    selected,
  }: RowSelectionArgs<DataRow>) => {
    if (selected) {
      state.selectVariation(variation);
    } else {
      state.deselectVariation(variation);
    }
  };

  const selectedRowIndices: ReadonlyArray<number> = useMemo(() => {
    let indices: ReadonlyArray<number> = [];
    const packages: ReadonlyArray<[
      number,
      PickedVariationSchema
    ]> = variations.map((variation, idx) => [idx, variation]);
    for (const [idx, variation] of packages) {
      const isSelectedVariation = state.selectedVariations.some(
        ({ variation: { id } }) => id == variation.id
      );
      if (isSelectedVariation) {
        indices = [...indices, idx];
      }
    }
    return indices;
  }, [variations, state.selectedVariations]);

  const tableData: ReadonlyArray<DataRow> = useMemo(() => {
    return variations.map((variation) => {
      const row: DataRow = {
        variation,
        activeInventory: {},
      };
      for (const inventory of variation.fbwInventory) {
        row.activeInventory[inventory.warehouse.id] = inventory.activeInventory;
      }
      return row;
    });
  }, [variations]);

  return (
    <Table
      data={tableData}
      style={[style, className]}
      canSelectRow={() => true}
      onRowSelectionToggled={onRowSelectionToggled}
      selectedRows={selectedRowIndices}
    >
      <Table.Column
        title={() => (
          <div className={css({ marginLeft: VARIATION_ICON_WIDTH })}>
            Variation SKU
          </div>
        )}
        columnKey="variation.sku"
      >
        {({ row: { variation } }: CellInfo<string, DataRow>) => (
          <VariationSKUColumn variation={variation} />
        )}
      </Table.Column>
      <Table.Column title={i`Product Name`} columnKey="variation.productName" />
      {selectedWarehouses.map((warehouse) => (
        <Table.NumeralColumn
          key={warehouse.id}
          title={i`Active stock (${warehouse.code})`}
          columnKey={`activeInventory.${warehouse.id}`}
          width={80}
          noDataMessage="0"
        />
      ))}
    </Table>
  );
};

export default observer(SelectVariationsTable);
