/*
 *
 * SelectProductsMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/22/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";

import { H7 } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { BoostableProduct } from "@toolkit/marketing/boost-products";
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

import ProductCell from "@plus/component/marketing/manage-boost/ProductCell";

import BoostProductsState from "@plus/model/BoostProductsState";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly products: ReadonlyArray<BoostableProduct>;
  readonly boostState: BoostProductsState;
  readonly displayAllBoosted: boolean;
};

const SelectProductsTable: React.FC<Props> = (props: Props) => {
  const { className, style, products, boostState, displayAllBoosted } = props;
  const styles = useStylesheet();
  const selectedRowIndeces: ReadonlyArray<number> = products
    .map(({ product }, index): [number, boolean] => {
      return [index, boostState.isSelectedProduct(product.id)];
    })
    .filter(([, isSelectedProduct]) => isSelectedProduct)
    .map(([index]) => index);

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<BoostableProduct>) => {
    const { [index]: boostableProduct } = products;
    if (selected) {
      boostState.selectProduct(boostableProduct);
    } else {
      boostState.deselectProducts([boostableProduct.product.id]);
    }
  };

  const renderNoDataMessage = () =>
    displayAllBoosted ? (
      <div className={css(styles.allBoostedContainer)}>
        <H7 className={css(styles.allBoostedMessage)}>
          All your products are boosted. Add a new product, and continue
          boosting more products for promoted impressions!
        </H7>
        <PrimaryButton href="/plus/products/create">
          Add a product
        </PrimaryButton>
      </div>
    ) : (
      i`No products found`
    );

  return (
    <Table
      className={css(style, className)}
      data={products}
      noDataMessage={renderNoDataMessage}
      canSelectRow={() => true}
      selectedRows={selectedRowIndeces}
      onRowSelectionToggled={onRowSelectionToggled}
    >
      <Table.Column title={i`Product`} columnKey="product.id" width={250}>
        {({
          row: boostableProduct,
        }: CellInfo<BoostableProduct, BoostableProduct>) => (
          <ProductCell
            boostableProduct={boostableProduct}
            style={{ margin: "12px 0px", maxWidth: "100%" }}
          />
        )}
      </Table.Column>
      <Table.NumeralColumn title={i`Wishes`} columnKey="product.wishes" />
      <Table.NumeralColumn title={i`Sales`} columnKey="product.sales" />
    </Table>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        allBoostedContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 58px 20px 58px",
        },
        allBoostedMessage: {
          marginBottom: 16,
        },
      }),
    []
  );
};

export default observer(SelectProductsTable);
