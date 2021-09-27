import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { wishURL } from "@toolkit/url";

type ProductDetailHeaderProps = BaseProps & {
  readonly productId: string;
  readonly productName: string;
  readonly isPromoted?: boolean;
};

const ProductDetailHeader = (props: ProductDetailHeaderProps) => {
  const styles = useStylesheet();

  const { productId, productName, isPromoted } = props;

  return (
    <div className={css(styles.row)}>
      <ProductImage className={css(styles.productImg)} productId={productId} />

      <div className={css(styles.column)}>
        <div className={css(styles.productName)}> {productName} </div>
        <div className={css(styles.row)}>
          <span>Product ID: </span>
          <CopyButton
            text={productId}
            prompt={i`Copy Product ID`}
            style={styles.copy}
          >
            <Link href={wishURL(`/product/${productId}`)} openInNewTab>
              {productId}
            </Link>
          </CopyButton>
          {isPromoted && (
            <Icon name="productBadgePromoted" alt={i`promoted product badge`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(ProductDetailHeader);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        column: {
          display: "flex",
          flexDirection: "column",
        },
        productName: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          marginBottom: 10,
        },
        productImg: {
          width: 80,
          height: 80,
          marginRight: 10,
        },
        copy: {
          margin: "0px 5px",
        },
      }),
    []
  );
};
