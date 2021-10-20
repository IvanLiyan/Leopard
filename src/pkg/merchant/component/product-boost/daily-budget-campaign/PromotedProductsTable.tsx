import React, { ReactNode } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { CellInfo } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { CurrencyInput } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Switch } from "@ContextLogic/lego";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";

/* Merchant Components */
import ValidatedProductColumn from "@merchant/component/products/columns/ValidatedProductColumn";

/* Merchant Model */
import Product from "@merchant/model/product-boost/Product";

/* Merchant Store */
import { useProductBoostMerchantInfo } from "@merchant/stores/product-boost/ProductBoostContextStore";

/* Toolkit */
import { DailyBudgetCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";
import ProductIdValidator from "@toolkit/product-boost/validators/ProductIdValidator";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PromotedProductsTableProps = BaseProps & {
  readonly currencyCode: CurrencyCode;
  readonly products: ReadonlyArray<Product>;
  readonly setProducts: (products: ReadonlyArray<Product>) => void;
  readonly productsDailyBudgetMap: Map<string, string>;
  readonly setProductsDailyBudgetMap: (budget: Map<string, string>) => void;
  readonly intenseBoostMap: Map<string, boolean>;
  readonly setIntenseBoostMap: (intenseBoost: Map<string, boolean>) => void;
};

const PromotedProductsTable = (props: PromotedProductsTableProps) => {
  const {
    currencyCode,
    products,
    setProducts,
    productsDailyBudgetMap,
    setProductsDailyBudgetMap,
    intenseBoostMap,
    setIntenseBoostMap,
    className,
  } = props;
  const merchantInfo = useProductBoostMerchantInfo();
  const minBudget =
    merchantInfo?.marketing.currentMerchant.dailyMinBudget.amount || 1.5;

  const renderBudgetTextField = (row: Product) => {
    let budget = productsDailyBudgetMap.get(row.id);

    // set a default value to daily budget
    if (budget === undefined) {
      budget = minBudget.toFixed(2);
      productsDailyBudgetMap.set(row.id, minBudget.toFixed(2));
      setProductsDailyBudgetMap(
        new Map<string, string>(productsDailyBudgetMap),
      );
    }

    return (
      <CurrencyInput
        currencyCode={currencyCode}
        value={budget}
        placeholder={minBudget.toFixed(2)}
        onChange={({ text }: OnTextChangeEvent) => {
          productsDailyBudgetMap.set(row.id, text);
          setProductsDailyBudgetMap(
            new Map<string, string>(productsDailyBudgetMap),
          );
        }}
        hideCheckmarkWhenValid
      />
    );
  };

  const renderIntenseBoostToggle = (row: Product) => {
    let intenseBoost = intenseBoostMap.get(row.id);
    // set a default value to intense boost
    if (intenseBoost == null) {
      intenseBoost = false;
      intenseBoostMap.set(row.id, false);
      setIntenseBoostMap(new Map<string, boolean>(intenseBoostMap));
    }
    return (
      <Switch
        isOn={intenseBoost}
        onToggle={(isOn: boolean) => {
          intenseBoostMap.set(row.id, isOn);
          setIntenseBoostMap(new Map<string, boolean>(intenseBoostMap));
        }}
      />
    );
  };

  const tableActions = [
    {
      key: "remove",
      name: i`Remove`,
      apply: (rows: ReadonlyArray<Product>) => {
        const product = rows[0];

        productsDailyBudgetMap.delete(product.id);
        setProductsDailyBudgetMap(new Map(productsDailyBudgetMap));

        setProducts(products.filter((p) => p.id !== product.id));
      },
      canApplyToRow: () => true,
    },
  ];

  return (
    <Table
      data={products}
      noDataMessage={i`You haven't selected any products yet.`}
      className={className}
      actions={tableActions}
    >
      <ValidatedProductColumn
        columnKey="id"
        title={i`Product ID`}
        fontSize={14}
        showProductId
        multiline
        productIds={products.map((p) => p.id)}
        validators={[
          new ProductIdValidator({
            productIds: products.map((p) => p.id),
          }),
        ]}
        width={300}
      />
      <Table.Column
        columnKey="name"
        title={i`Product name`}
        noDataMessage={"\u2014"}
      >
        {({ value }: CellInfo<Product["name"], Product>) =>
          renderProductName(value)
        }
      </Table.Column>
      <Table.Column
        columnKey="parentSku"
        title={i`Parent SKU`}
        noDataMessage={"\u2014"}
      />
      <Table.Column
        columnKey="id"
        title={i`Daily Budget`}
        minWidth={150}
        description={DailyBudgetCampaignExplanations.DAILY_BUDGET}
      >
        {({ row }) => renderBudgetTextField(row)}
      </Table.Column>
      <Table.Column
        columnKey="id"
        title={i`IntenseBoost`}
        description={DailyBudgetCampaignExplanations.INTENSE_BOOST}
      >
        {({ row }) => renderIntenseBoostToggle(row)}
      </Table.Column>
    </Table>
  );
};

const renderProductName = (value: Product["name"]): ReactNode => {
  if (value == null) {
    return null;
  }
  if (value.length > 30) {
    return value.substring(0, 30) + "...";
  }
  return value;
};

export default observer(PromotedProductsTable);
