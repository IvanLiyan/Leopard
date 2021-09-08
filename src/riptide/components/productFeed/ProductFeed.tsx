import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import { useTheme } from "@riptide/toolkit/theme";
import { useLocalization } from "@toolkit/context/localization";

import Layout from "@components/core/Layout";
import H4 from "@riptide/components/core/H4";
import Link from "@riptide/components/core/Link";
import LoadingRow from "@riptide/components/productFeed/LoadingRow";
import ProductsRow from "@riptide/components/productFeed/ProductsRow";
import { Product } from "@riptide/components/productFeed/ProductCard";

export type Props = BaseProps & {
  readonly name: string;
  readonly viewAllLink: string;
  readonly productsReq: () => Promise<ReadonlyArray<Product>>;
};

const CuratedProductsSection: React.FC<Props> = ({
  style,
  name,
  viewAllLink,
  productsReq,
}: Props) => {
  const styles = useStylesheet();
  const { i18n } = useLocalization();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ReadonlyArray<Product> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const products = await productsReq();
      setProducts(products);
      setLoading(false);
    };

    void fetchData();
  }, [productsReq]);

  return (
    <Layout.FlexColumn style={[styles.root, style]}>
      <Layout.FlexRow justifyContent="space-between" style={styles.title}>
        <H4>{name}</H4>
        <Link
          style={styles.link}
          disabled={loading || products?.length === 0}
          href={viewAllLink}
        >
          {i18n("View all")}
        </Link>
      </Layout.FlexRow>
      {loading ? <LoadingRow /> : <ProductsRow products={products || []} />}
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
