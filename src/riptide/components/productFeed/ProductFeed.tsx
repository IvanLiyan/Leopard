import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import { useTheme } from "@riptide/toolkit/theme";

import Layout from "@components/core/Layout";
import H4 from "@riptide/components/core/H4";
import Link from "@riptide/components/core/Link";
import ProductsRow from "@riptide/components/core/products/ProductsRow";

// eslint-disable-next-line local-rules/no-non-riptide-import
import { fetchProductFeed } from "@toolkit/rest-api";

export type Props = BaseProps & {
  readonly id: string;
  readonly name: string;
};

const CuratedProductsSection: React.FC<Props> = ({
  style,
  name,
  id,
}: Props) => {
  const styles = useStylesheet();
  const products = [
    {
      pid: "1",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "2",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "3",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "4",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "5",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "6",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "7",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
    {
      pid: "8",
      originalPrice: "$80",
      discountedPrice: "$20",
      numPurchasers: 10000,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetchProductFeed({ id });
      // TODO [lliepert]: integrate with product feed
      // eslint-disable-next-line no-console
      console.log(resp);
    };

    void fetchData();
  }, [id]);

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
