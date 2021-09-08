import React, { useMemo } from "react";
import Image from "next/image";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";
import { WISH_URL } from "@toolkit/context/constants";

import Text from "@riptide/components/core/Text";
import Link from "@riptide/components/core/Link";
import Layout from "@riptide/components/core/Layout";

export type Product = {
  readonly pid: string;
  readonly imageUrl: string;
  readonly productUrl: string;
  readonly productName: string;
  readonly originalPrice: string;
  readonly discountedPrice: string;
  readonly numPurchasersText: string;
};

export type Props = Omit<BaseProps, "children"> & Product;

const ProductCard: React.FC<Props> = ({
  style,
  pid,
  imageUrl,
  productName,
  originalPrice,
  discountedPrice,
  numPurchasersText,
}: Props) => {
  const styles = useStylesheet();

  const showOriginalPrice = originalPrice !== discountedPrice;

  return (
    <Layout.FlexColumn style={[styles.root, style]}>
      <Link href={`${WISH_URL}/product/${pid}`}>
        <Image
          objectFit="cover"
          src={imageUrl}
          height={128}
          width={128}
          alt={productName}
        />
        <Layout.FlexRow style={{ marginTop: 8 }}>
          {showOriginalPrice && (
            <Text
              fontSize={14}
              lineHeight={"20px"}
              color="LIGHT"
              style={{ textDecoration: "line-through", marginRight: 4 }}
            >
              {originalPrice}
            </Text>
          )}
          <Text fontSize={14} lineHeight={"20px"} color="BLACK">
            {discountedPrice}
          </Text>
        </Layout.FlexRow>
        <Text fontSize={10} lineHeight={"12px"} color="LIGHT">
          {numPurchasersText}
        </Text>
      </Link>
    </Layout.FlexColumn>
  );
};

export default ProductCard;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: "none",
          // note: bottom padding for <ProductFeed> is in <ProductCard> so
          // scrollbar doesn't cover pricing information
          paddingBottom: 16,
        },
      }),
    [],
  );
};
