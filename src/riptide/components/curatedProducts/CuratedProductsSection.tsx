import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import H3 from "@riptide/components/core/H3";
import ProductsRow from "@riptide/components/core/products/ProductsRow";

export type Props = BaseProps;

const CuratedProductsSection: React.FC<Props> = ({
  style,
  className,
}: Props) => {
  const styles = useStylesheet();
  const products = [
    { pid: 1, name: "1" },
    { pid: 2, name: "2" },
    { pid: 3, name: "3" },
    { pid: 4, name: "4" },
    { pid: 5, name: "5" },
    { pid: 6, name: "6" },
    { pid: 7, name: "7" },
    { pid: 8, name: "8" },
  ];

  return (
    <Layout.FlexColumn className={css(style, className)}>
      <H3 className={css(styles.title)}>Curated from the seller</H3>
      <ProductsRow products={products} />
    </Layout.FlexColumn>
  );
};

export default CuratedProductsSection;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          marginBottom: 16,
        },
      }),
    [],
  );
};
