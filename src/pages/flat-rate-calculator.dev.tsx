import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { NextPage } from "next";
import {
  Button,
  CurrencyInput,
  Divider,
  HorizontalField,
  Layout,
  NumericInput,
  Table,
  Text,
  TextInput,
} from "@ContextLogic/lego";
import Icon from "@core/components/Icon";
import { round, uniqueId } from "lodash";

type Product = {
  readonly itemPrice: number;
  readonly shippingPrice: number;
  readonly name: string;
  readonly id: string;
};

const InitialProducts: ReadonlyArray<Product> = [
  {
    name: "Product A",
    shippingPrice: 4,
    itemPrice: 6,
    id: uniqueId(),
  },
  {
    name: "Product B",
    shippingPrice: 4,
    itemPrice: 6,
    id: uniqueId(),
  },
  {
    name: "Product C",
    shippingPrice: 4,
    itemPrice: 6,
    id: uniqueId(),
  },
];

type InputsProps = {
  readonly onAddToCart: (p: Product) => unknown;
  readonly itemCommission: number;
  readonly shippingCommission: number;
  readonly wishPostFlatRate: number;
  readonly wishPostPerItemCost: number;
  readonly onUpdateItemCommission: (value: number) => unknown;
  readonly onUpdateShippingCommission: (value: number) => unknown;
  readonly onUpdateWishPostFlatRate: (value: number) => unknown;
  readonly onUpdateWishPostPerItemCost: (value: number) => unknown;
};

const Inputs: React.FC<InputsProps> = ({
  onAddToCart,
  itemCommission,
  shippingCommission,
  wishPostFlatRate,
  wishPostPerItemCost,
  onUpdateItemCommission,
  onUpdateShippingCommission,
  onUpdateWishPostFlatRate,
  onUpdateWishPostPerItemCost,
}) => {
  const [products, setProducts] =
    useState<ReadonlyArray<Product>>(InitialProducts);
  const pushProduct = (p: Product) => {
    setProducts([...products, p]);
  };
  const deleteProduct = (productId: string) => {
    setProducts(products.filter(({ id }) => id !== productId));
  };

  const [name, setName] = useState<string>();
  const [shippingPrice, setShippingPrice] = useState<number>();
  const [itemPrice, setItemPrice] = useState<number>();

  const handleSubmit = () => {
    if (
      name == null ||
      shippingPrice == null ||
      itemPrice == null ||
      shippingPrice < 0 ||
      itemPrice < 0
    ) {
      return;
    }

    pushProduct({ name, shippingPrice, itemPrice, id: uniqueId() });
  };

  return (
    <Layout.FlexColumn
      style={{
        gap: 4,
        padding: 16,
        border: "1px solid black",
      }}
    >
      <Text style={{ textDecoration: "underline" }}>Add a product</Text>
      <HorizontalField centerTitleVertically title="Name" titleWidth={150}>
        <TextInput
          style={{ maxWidth: 200 }}
          value={name}
          onChange={({ text }) => setName(text)}
        />
      </HorizontalField>
      <HorizontalField
        centerTitleVertically
        title="Shipping price"
        titleWidth={150}
      >
        <CurrencyInput
          style={{ maxWidth: 100 }}
          value={shippingPrice}
          onChange={({ textAsNumber }) =>
            setShippingPrice(textAsNumber ?? undefined)
          }
          currencyCode="USD"
          hideCheckmarkWhenValid
        />
      </HorizontalField>
      <HorizontalField
        centerTitleVertically
        title="Item price"
        titleWidth={150}
      >
        <CurrencyInput
          style={{ maxWidth: 100 }}
          value={itemPrice}
          onChange={({ textAsNumber }) =>
            setItemPrice(textAsNumber ?? undefined)
          }
          currencyCode="USD"
          hideCheckmarkWhenValid
        />
      </HorizontalField>
      <Button style={{ width: 200 }} onClick={() => handleSubmit()}>
        Add
      </Button>

      <Divider style={{ marginTop: 8, marginBottom: 8 }} />

      <Text style={{ textDecoration: "underline" }}>Your Products</Text>
      {products.map((product) => (
        <Layout.FlexRow key={product.id} style={{ gap: 8 }}>
          <Button
            style={{ flexDirection: "row", gap: 4 }}
            onClick={() => onAddToCart(product)}
          >
            <Icon
              name="plus"
              style={{ cursor: "pointer" }}
              size={12}
              color="green"
            />
            Add to cart
          </Button>
          <Text>{product.name},</Text>
          <Text>Item: ${product.itemPrice}</Text>
          <Text>Shipping: ${product.shippingPrice}</Text>
          <Icon
            name="x"
            onClick={() => deleteProduct(product.id)}
            style={{ cursor: "pointer" }}
            size={12}
            color="red"
          />
        </Layout.FlexRow>
      ))}

      <Divider style={{ marginTop: 8, marginBottom: 8 }} />

      <Text style={{ textDecoration: "underline" }}>Variables</Text>
      <HorizontalField
        title="Item commission"
        titleWidth={150}
        centerTitleVertically
      >
        <Layout.FlexRow alignItems="center" style={{ gap: 8 }}>
          <NumericInput
            style={{ maxWidth: 100 }}
            value={itemCommission}
            onChange={({ valueAsNumber }) => {
              if (
                valueAsNumber != null &&
                (valueAsNumber < 0 || valueAsNumber > 100)
              ) {
                return;
              }
              onUpdateItemCommission(valueAsNumber ?? 0);
            }}
          />
          %
        </Layout.FlexRow>
      </HorizontalField>
      <HorizontalField
        title="Shipping commission"
        titleWidth={150}
        centerTitleVertically
      >
        <Layout.FlexRow alignItems="center" style={{ gap: 8 }}>
          <NumericInput
            style={{ maxWidth: 100 }}
            value={shippingCommission}
            onChange={({ valueAsNumber }) => {
              if (
                valueAsNumber != null &&
                (valueAsNumber < 0 || valueAsNumber > 100)
              ) {
                return;
              }
              onUpdateShippingCommission(valueAsNumber ?? 0);
            }}
          />
          %
        </Layout.FlexRow>
      </HorizontalField>
      <HorizontalField
        title="WishPost Flat Rate"
        titleWidth={150}
        centerTitleVertically
      >
        <CurrencyInput
          style={{ maxWidth: 100 }}
          value={wishPostFlatRate}
          onChange={({ textAsNumber }) =>
            onUpdateWishPostFlatRate(textAsNumber ?? 0)
          }
          currencyCode="USD"
          hideCheckmarkWhenValid
        />
      </HorizontalField>
      <HorizontalField
        title="WishPost Per-item cost"
        titleWidth={150}
        centerTitleVertically
      >
        <CurrencyInput
          style={{ maxWidth: 100 }}
          value={wishPostPerItemCost}
          onChange={({ textAsNumber }) =>
            onUpdateWishPostPerItemCost(textAsNumber ?? 0)
          }
          currencyCode="USD"
          hideCheckmarkWhenValid
        />
      </HorizontalField>
    </Layout.FlexColumn>
  );
};

type ResultsProps = {
  readonly onRemoveFromCart: (index: number) => unknown;
  readonly products: ReadonlyArray<Product>;
  readonly itemCommission: number;
  readonly shippingCommission: number;
  readonly wishPostFlatRate: number;
  readonly wishPostPerItemCost: number;
};

const Results: React.FC<ResultsProps> = ({
  onRemoveFromCart,
  products,
  itemCommission,
  shippingCommission,
  wishPostFlatRate,
  wishPostPerItemCost,
}) => {
  const productsFlatRate = products.map((product) => ({
    ...product,
    itemPrice: product.itemPrice + wishPostPerItemCost,
    shippingPrice: product.shippingPrice - wishPostPerItemCost,
  }));

  const linearShippingTableData = useMemo(() => {
    const customerPaysItemPrice = products.reduce(
      (acc, { itemPrice }) => acc + itemPrice,
      0,
    );

    const customerPaysShippingPrice = products.reduce(
      (acc, { shippingPrice }) => acc + shippingPrice,
      0,
    );

    const customerPays = customerPaysShippingPrice + customerPaysItemPrice;

    const wishIncomeOnItems = round(itemCommission * customerPaysItemPrice, 2);
    const wishIncomeOnShipping = round(
      shippingCommission * customerPaysShippingPrice,
      2,
    );

    const wishIncome = round(wishIncomeOnItems + wishIncomeOnShipping, 2);

    const merchantRevenueOnItems = round(
      customerPaysItemPrice - wishIncomeOnItems,
      2,
    );
    const merchantRevenueOnShipping = round(
      customerPaysShippingPrice - wishIncomeOnShipping,
      2,
    );

    const merchantRevenue = round(
      merchantRevenueOnItems + merchantRevenueOnShipping,
      2,
    );

    const wishPostShippingCost = round(
      wishPostFlatRate + wishPostPerItemCost * products.length,
      2,
    );

    const merchantRevenueMinusLogistics = round(
      merchantRevenue - wishPostShippingCost,
      2,
    );

    return [
      {
        title: "Customer Pays",
        value: `**$${customerPays}** ($${customerPaysItemPrice} for items, $${customerPaysShippingPrice} for shipping)`,
      },
      {
        title: "Wish Revenue",
        value: `**$${wishIncome}** ($${wishIncomeOnItems} for items, $${wishIncomeOnShipping} for shipping)`,
      },
      {
        title: "Merchant Revenue",
        value: `**$${merchantRevenue}** ($${merchantRevenueOnItems} for items, $${merchantRevenueOnShipping} for shipping)`,
      },
      {
        title: "WishPost shipping cost",
        value: `**$${wishPostShippingCost}** ($${wishPostFlatRate} parcel fee, $${wishPostPerItemCost} per item)`,
      },
      {
        title: "Merchant revenue less logistics",
        value: `**$${merchantRevenueMinusLogistics}**`,
      },
    ];
  }, [
    products,
    itemCommission,
    shippingCommission,
    wishPostFlatRate,
    wishPostPerItemCost,
  ]);

  const flatRateShippingTableData = useMemo(() => {
    const customerPaysItemPrice = productsFlatRate.reduce(
      (acc, { itemPrice }) => acc + itemPrice,
      0,
    );

    const customerPaysShippingPrice =
      productsFlatRate.length > 0 ? productsFlatRate[0].shippingPrice : 0;

    const customerPays = customerPaysShippingPrice + customerPaysItemPrice;

    const wishIncomeOnItems = round(itemCommission * customerPaysItemPrice, 2);
    const wishIncomeOnShipping = round(
      shippingCommission * customerPaysShippingPrice,
      2,
    );

    const wishIncome = round(wishIncomeOnItems + wishIncomeOnShipping, 2);

    const merchantRevenueOnItems = round(
      customerPaysItemPrice - wishIncomeOnItems,
      2,
    );
    const merchantRevenueOnShipping = round(
      customerPaysShippingPrice - wishIncomeOnShipping,
      2,
    );

    const merchantRevenue = round(
      merchantRevenueOnItems + merchantRevenueOnShipping,
      2,
    );

    const wishPostShippingCost = round(
      wishPostFlatRate + wishPostPerItemCost * products.length,
      2,
    );

    const merchantRevenueMinusLogistics = round(
      merchantRevenue - wishPostShippingCost,
      2,
    );

    return [
      {
        title: "Customer Pays",
        value: `**$${customerPays}** ($${customerPaysItemPrice} for items, $${customerPaysShippingPrice} for shipping)`,
      },
      {
        title: "Wish Revenue",
        value: `**$${wishIncome}** ($${wishIncomeOnItems} for items, $${wishIncomeOnShipping} for shipping)`,
      },
      {
        title: "Merchant Revenue",
        value: `**$${merchantRevenue}** ($${merchantRevenueOnItems} for items, $${merchantRevenueOnShipping} for shipping)`,
      },
      {
        title: "WishPost shipping cost",
        value: `**$${wishPostShippingCost}** ($${wishPostFlatRate} parcel fee, $${wishPostPerItemCost} per item)`,
      },
      {
        title: "Merchant revenue less logistics",
        value: `**$${merchantRevenueMinusLogistics}**`,
      },
    ];
  }, [
    productsFlatRate,
    products,
    itemCommission,
    shippingCommission,
    wishPostFlatRate,
    wishPostPerItemCost,
  ]);
  return (
    <Layout.FlexColumn
      style={{
        gap: 4,
        padding: 16,
        border: "1px solid black",
      }}
    >
      <Text style={{ textDecoration: "underline" }}>Cart</Text>
      {products.map((product, index) => (
        <Layout.FlexRow key={`${product.id}_${index}`} style={{ gap: 8 }}>
          <Text>{product.name},</Text>
          <Text>Item: ${product.itemPrice}</Text>
          <Text>Shipping: ${product.shippingPrice}</Text>
          <Text>
            (for flat rate, item: ${productsFlatRate[index].itemPrice},
            shipping: ${productsFlatRate[index].shippingPrice})
          </Text>
          <Icon
            name="x"
            onClick={() => onRemoveFromCart(index)}
            style={{ cursor: "pointer" }}
            size={12}
            color="red"
          />
        </Layout.FlexRow>
      ))}

      <Divider style={{ marginTop: 8, marginBottom: 8 }} />

      <Text style={{ textDecoration: "underline" }}>Results</Text>

      {products.length == 0 ? (
        <Text style={{ color: "grey" }}>Add some items to cart</Text>
      ) : (
        <>
          <Text style={{ marginTop: 12 }}>Linear shipping (no flat rate)</Text>
          <Table data={linearShippingTableData}>
            <Table.MarkdownColumn
              _key="title"
              title="Metric"
              columnKey="title"
            />
            <Table.MarkdownColumn
              _key="value"
              title="Value"
              columnKey="value"
            />
          </Table>
          <Text style={{ marginTop: 12 }}>Flat Rate</Text>
          <Table data={flatRateShippingTableData}>
            <Table.MarkdownColumn
              _key="title"
              title="Metric"
              columnKey="title"
            />
            <Table.MarkdownColumn
              _key="value"
              title="Value"
              columnKey="value"
            />
          </Table>
        </>
      )}
    </Layout.FlexColumn>
  );
};

const FlatRateCalculatorContainer: NextPage<Record<string, never>> = () => {
  const [productsInCart, setProductsInCart] = useState<ReadonlyArray<Product>>(
    [],
  );

  const pushProductInCart = (p: Product) => {
    setProductsInCart([...productsInCart, p]);
  };
  const deleteProductInCart = (indexToDelete: number) => {
    setProductsInCart(
      productsInCart.filter((_, index) => index !== indexToDelete),
    );
  };

  const [itemCommission, setItemCommission] = useState<number>(15);
  const [shippingCommission, setShippingCommission] = useState<number>(15);
  const [wishPostFlatRate, setWishPostFlatRate] = useState<number>(3);
  const [wishPostPerItemCost, setWishPostPerItemCost] = useState<number>(1);

  return (
    <Layout.FlexColumn alignItems="stretch" style={{ gap: 16, margin: 24 }}>
      <Layout.FlexColumn alignItems="stretch" style={{ gap: 16 }}>
        <Inputs
          onAddToCart={(p) => pushProductInCart(p)}
          itemCommission={itemCommission}
          shippingCommission={shippingCommission}
          onUpdateItemCommission={(value) => setItemCommission(value)}
          onUpdateShippingCommission={(value) => setShippingCommission(value)}
          wishPostFlatRate={wishPostFlatRate}
          wishPostPerItemCost={wishPostPerItemCost}
          onUpdateWishPostFlatRate={setWishPostFlatRate}
          onUpdateWishPostPerItemCost={setWishPostPerItemCost}
        />
        <Results
          onRemoveFromCart={(index) => deleteProductInCart(index)}
          products={productsInCart}
          itemCommission={itemCommission / 100}
          shippingCommission={shippingCommission / 100}
          wishPostFlatRate={wishPostFlatRate}
          wishPostPerItemCost={wishPostPerItemCost}
        />
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(FlatRateCalculatorContainer);
