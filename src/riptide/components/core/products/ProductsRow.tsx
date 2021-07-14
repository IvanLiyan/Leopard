import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import ProductCard, {
  Props as ProductProps,
} from "@riptide/components/core/products/ProductCard";

export type Props = Omit<BaseProps, "children"> & {
  readonly products: ReadonlyArray<ProductProps>;
};

const ProductsRow: React.FC<Props> = ({ style, products }: Props) => {
  const styles = useStylesheet();

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
      }),
    [],
  );
};
