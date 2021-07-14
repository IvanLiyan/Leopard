import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { BaseProps } from "@riptide/toolkit/types";

import Card from "@riptide/components/core/Card";
import Text from "@riptide/components/core/Text";

export type Props = Omit<BaseProps, "children"> & {
  readonly pid: number;
  readonly name: string;
};

const ProductCard: React.FC<Props> = ({ style, name }: Props) => {
  const styles = useStylesheet();
  return (
    <Card style={[styles.root, style]}>
      <Text fontSize={24} fontWeight="BOLD" color="LIGHT">
        {name}
      </Text>
    </Card>
  );
};

export default ProductCard;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: "none",
          borderRadius: 4,
          width: 160,
          height: 172,
          padding: 16,
        },
      }),
    [],
  );
};
