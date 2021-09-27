/*
 *
 * SetBudgetMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";

import { DeleteButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

import { TableAction } from "@ContextLogic/lego";
import { BoostableProduct } from "@toolkit/marketing/boost-products";
import { CellInfo } from "@ContextLogic/lego";

import ProductCell from "@plus/component/marketing/manage-boost/ProductCell";

import BoostProductsState from "@plus/model/BoostProductsState";
import SetBudgetInput from "./SetBudgetInput";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly products: ReadonlyArray<BoostableProduct>;
  readonly boostState: BoostProductsState;
};

const SetBudgetTable: React.FC<Props> = (props: Props) => {
  const { className, style, products, boostState } = props;

  const actions: ReadonlyArray<TableAction> = [
    {
      key: "discard",
      name: i`Discard`,
      canApplyToRow: () => true,
      apply: (products: ReadonlyArray<BoostableProduct>) => {
        const productIds = products.map(({ product }) => product.id);
        boostState.deselectProducts(productIds);
      },
    },
  ];

  return (
    <Table
      className={css(style, className)}
      data={products}
      actions={actions}
      noDataMessage={i`No products found`}
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
      <Table.Column title={i`Product`} columnKey="product" width={250}>
        {({
          row: boostableProduct,
        }: CellInfo<BoostableProduct, BoostableProduct>) => (
          <ProductCell
            boostableProduct={boostableProduct}
            style={{ margin: "12px 0px", maxWidth: "100%" }}
          />
        )}
      </Table.Column>
      <Table.Column title={i`Daily budget`} columnKey="product.id" width={250}>
        {({
          row: boostableProduct,
        }: CellInfo<BoostableProduct, BoostableProduct>) => (
          <SetBudgetInput
            boostableProduct={boostableProduct}
            boostState={boostState}
          />
        )}
      </Table.Column>
    </Table>
  );
};

export default observer(SetBudgetTable);
