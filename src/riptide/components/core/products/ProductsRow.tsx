import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import ProductCard, {
  Props as ProductProps,
} from "@riptide/components/core/products/ProductCard";

export type Props = Omit<BaseProps, "children"> & {
  readonly products: ReadonlyArray<ProductProps>;
};

const ProductsRow: React.FC<Props> = ({
  style,
  className,
  products,
}: Props) => {
  const styles = useStylesheet();

  const productCards = products.map((productProp) => (
    <ProductCard
      key={productProp.pid}
      className={css(styles.card)}
      {...productProp}
    />
  ));

  return (
    <Layout.FlexRow className={css(style, className, styles.root)}>
      {productCards}
    </Layout.FlexRow>
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
