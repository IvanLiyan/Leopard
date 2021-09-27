/*
 *
 * ProductCell.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";

import { Link } from "@ContextLogic/lego";

import ProductImage from "@merchant/component/products/ProductImage";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BoostedProductsRowState from "@plus/model/BoostedProductsRowState";

type Props = BaseProps & {
  readonly productState: BoostedProductsRowState;
};

const ProductCell: React.FC<Props> = (props: Props) => {
  const {
    style,
    className,
    productState: {
      product: { id: productId, name, variationCount },
    },
  } = props;
  const styles = useStylesheet();

  const numberOfVariations = numeral(variationCount).format("0,0");

  return (
    <div className={css(styles.root, className, style)}>
      <ProductImage productId={productId} className={css(styles.image)} />
      <div className={css(styles.content)}>
        <Link
          className={css(styles.name)}
          href={`/plus/products/edit/${productId}`}
        >
          {name}
        </Link>
        <div className={css(styles.variations)}>
          {variationCount == 1
            ? i`1 variation`
            : `${numberOfVariations} variations`}
        </div>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        image: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        name: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        variations: {
          color: textDark,
          fontSize: 14,
          margin: "5px 0px",
        },
      }),
    [textDark]
  );
};

export default observer(ProductCell);
