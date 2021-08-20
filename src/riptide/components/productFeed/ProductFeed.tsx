import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import { useTheme } from "@riptide/toolkit/theme";

import Layout from "@components/core/Layout";
import H4 from "@riptide/components/core/H4";
import Link from "@riptide/components/core/Link";
import ProductsRow from "@riptide/components/core/products/ProductsRow";
import { Product } from "@riptide/components/core/products/ProductCard";

export type Props = BaseProps & {
  readonly name: string;
} & (
    | {
        readonly id: string;
        readonly products?: never;
      }
    | {
        readonly id?: never;
        readonly products: ReadonlyArray<Product>;
      }
  );

const CuratedProductsSection: React.FC<Props> = ({
  style,
  name,
  products: productsProp,
}: Props) => {
  const styles = useStylesheet();
  const products = productsProp || [
    {
      pid: "1",
      imageUrl: "/images/TEMP.png",
      productUrl: "/",
      productName: "Product Name",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasersText: "10000",
    },
    {
      pid: "1",
      imageUrl: "/images/TEMP.png",
      productUrl: "/",
      productName: "Product Name",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasersText: "10000",
    },
    {
      pid: "1",
      imageUrl: "/images/TEMP.png",
      productUrl: "/",
      productName: "Product Name",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasersText: "10000",
    },
    {
      pid: "1",
      imageUrl: "/images/TEMP.png",
      productUrl: "/",
      productName: "Product Name",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasersText: "10000",
    },
    {
      pid: "1",
      imageUrl: "/images/TEMP.png",
      productUrl: "/",
      productName: "Product Name",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasersText: "10000",
    },
  ];

  return (
    <Layout.FlexColumn style={[styles.root, style]}>
      <Layout.FlexRow justifyContent="space-between" style={styles.title}>
        <H4>{name}</H4>
        <Link style={styles.link}>View all</Link>
      </Layout.FlexRow>
      <ProductsRow products={products} />
    </Layout.FlexColumn>
  );
};

export default CuratedProductsSection;

const useStylesheet = () => {
  const { surfaceWhite } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceWhite,
          // note: bottom padding for <ProductFeed> is in <ProductCard> so
          // scrollbar doesn't cover pricing information
          padding: "16px 0px 0px 16px",
        },
        link: {
          marginRight: 16,
        },
        title: {
          marginBottom: 16,
        },
      }),
    [surfaceWhite],
  );
};
