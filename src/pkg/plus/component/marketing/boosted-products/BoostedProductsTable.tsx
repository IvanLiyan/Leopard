/*
 *
 * BoostedProductsTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import {
  BoostedProductType,
  PickedMerchantProperty,
} from "@toolkit/marketing/boosted-products";

import ProductCell from "./ProductCell";
import SpendRevenue from "./SpendRevenue";
import EnabledSwitch from "./EnabledSwitch";
import ProductBudgetInput from "./ProductBudgetInput";
import BoostedProductDetail from "./BoostedProductDetail";
import BoostedProductsRowState from "@plus/model/BoostedProductsRowState";

type Props = BaseProps & {
  readonly promotedProducts: ReadonlyArray<BoostedProductType>;
  readonly expandedRows?: ReadonlyArray<number> | null | undefined;
  readonly onRowExpandToggled?: (
    index: number,
    shouldExpand: boolean
  ) => unknown | null | undefined;
  readonly merchantProperty: PickedMerchantProperty;
  readonly refetchProducts: () => void;
};

const BoostedProductsTable: React.FC<Props> = ({
  promotedProducts,
  style,
  className,
  expandedRows,
  merchantProperty,
  onRowExpandToggled,
  refetchProducts,
}: Props) => {
  const renderExpandedOrder = (state: BoostedProductsRowState) => (
    <BoostedProductDetail productState={state} />
  );

  const data = useMemo(() => {
    return promotedProducts.map(
      (initialData) => new BoostedProductsRowState({ initialData })
    );
  }, [promotedProducts]);
  const revenueColumnTitle = merchantProperty.isFreeBudgetMerchant
    ? i`Revenue`
    : i`Spend / Revenue`;
  return (
    <Table
      data={data}
      className={css(className)}
      style={style}
      rowExpands={() => true} // all rows expand
      expandedRows={expandedRows}
      renderExpanded={renderExpandedOrder}
      onRowExpandToggled={onRowExpandToggled}
    >
      <Table.Column
        title={i`Product`}
        columnKey="initialData.product.id"
        width={450}
      >
        {({
          row: state,
        }: CellInfo<BoostedProductsRowState, BoostedProductsRowState>) => (
          <ProductCell
            productState={state}
            // TODO [lliepert]: maxWidth is temp fix for ProductCell not respecting table width
            // will be fixed more generally in future <Table /> update
            className={css({
              maxWidth: 450,
              display: "flex",
              alignItems: "center",
              margin: "12px 0px",
            })}
          />
        )}
      </Table.Column>
      <Table.Column
        title={revenueColumnTitle}
        columnKey="initialData.lifetimeStats.spend"
        align="right"
      >
        {({
          row: state,
        }: CellInfo<BoostedProductsRowState, BoostedProductsRowState>) => (
          // TODO: un-hide spend when bid for store products are finalized
          <SpendRevenue
            productState={state}
            isFreeBudgetMerchant={merchantProperty.isFreeBudgetMerchant}
          />
        )}
      </Table.Column>
      <Table.Column
        title={i`Active`}
        columnKey="initialData.promotionStatus"
        align="center"
      >
        {({
          row: state,
        }: CellInfo<BoostedProductsRowState, BoostedProductsRowState>) => (
          <EnabledSwitch key={state.id} productState={state} />
        )}
      </Table.Column>
      <Table.Column
        title={i`Daily budget`}
        columnKey="initialData.dailyPromotionBudget"
        align="center"
        width={200}
      >
        {({
          row: state,
        }: CellInfo<BoostedProductsRowState, BoostedProductsRowState>) => (
          <ProductBudgetInput
            key={state.id}
            productState={state}
            merchantProperty={merchantProperty}
            refetchProducts={refetchProducts}
            style={{ width: 200 }}
          />
        )}
      </Table.Column>
    </Table>
  );
};

export default observer(BoostedProductsTable);
