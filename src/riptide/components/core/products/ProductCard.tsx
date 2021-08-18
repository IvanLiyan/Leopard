import React, { useMemo } from "react";
import Image from "next/image";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import Text from "@riptide/components/core/Text";
import Layout from "@riptide/components/core/Layout";

export type Props = Omit<BaseProps, "children"> & {
  readonly pid: string;
  readonly originalPrice: string;
  readonly discountedPrice: string;
  readonly numPurchasers: number;
};

const ProductCard: React.FC<Props> = ({
  style,
  originalPrice,
  discountedPrice,
  numPurchasers,
}: Props) => {
  const styles = useStylesheet();
  return (
    <Layout.FlexColumn style={[styles.root, style]}>
      <Image
        objectFit="cover"
        src={"/images/TEMP.png"}
        height={128}
        width={128}
        alt="TODO [lliepert]"
      />
      <Layout.FlexRow style={{ marginTop: 8 }}>
        <Text
          fontSize={14}
          lineHeight={"20px"}
          color="LIGHT"
          style={{ textDecoration: "line-through", marginRight: 4 }}
        >
          {originalPrice}
        </Text>
        <Text fontSize={14} lineHeight={"20px"} color="BLACK">
          {discountedPrice}
        </Text>
      </Layout.FlexRow>
      <Text fontSize={10} lineHeight={"12px"} color="LIGHT">
        {numPurchasers} bought this
      </Text>
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
