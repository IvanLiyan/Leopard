import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import { useLocalization } from "@toolkit/context/localization";

import Layout from "@components/core/Layout";
import Text from "@riptide/components/core/Text";
import ProductCard, {
  Props as ProductProps,
} from "@riptide/components/core/products/ProductCard";

export type Props = Omit<BaseProps, "children"> & {
  readonly products: ReadonlyArray<ProductProps>;
};

const ProductsRow: React.FC<Props> = ({ style, products }: Props) => {
  const styles = useStylesheet();
  const { i18n } = useLocalization();

  if (products.length === 0) {
    return (
      <Layout.FlexRow
        justifyContent="center"
        style={[styles.noProducts, style]}
      >
        <Text color="LIGHT">{i18n("No products found")}</Text>
      </Layout.FlexRow>
    );
  }

  const productCards = products.map((productProp) => (
    <ProductCard key={productProp.pid} style={styles.card} {...productProp} />
  ));

  return (
    <Layout.FlexRow style={[styles.root, style]}>{productCards}</Layout.FlexRow>
  );
};

export default ProductsRow;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: "none",
          overflowX: "scroll",
        },
        card: {
          marginRight: 8,
        },
        noProducts: {
          padding: 15,
          // ProductRow has no right padding, account for that here
          marginRight: 16,
        },
      }),
    [],
  );
};
