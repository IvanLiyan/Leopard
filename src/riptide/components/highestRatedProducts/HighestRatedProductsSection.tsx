import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import H3 from "@riptide/components/core/H3";
import ProductsRow from "@riptide/components/core/products/ProductsRow";

export type Props = BaseProps;

const HighestRatedProductsSection: React.FC<Props> = ({
  style,
  className,
}: Props) => {
  const styles = useStylesheet();
  const products = [
    { pid: 11, name: "A" },
    { pid: 12, name: "B" },
    { pid: 13, name: "C" },
    { pid: 14, name: "D" },
    { pid: 15, name: "E" },
    { pid: 16, name: "F" },
    { pid: 17, name: "G" },
    { pid: 18, name: "H" },
  ];

  return (
    <Layout.FlexColumn className={css(style, className)}>
      <H3 className={css(styles.title)}>Highest rated products</H3>
      <ProductsRow products={products} />
    </Layout.FlexColumn>
  );
};

export default HighestRatedProductsSection;

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
