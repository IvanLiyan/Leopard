import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold, proxima } from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useProductStore } from "@merchant/stores/ProductStore";

type Props = BaseProps & {
  readonly productId: string;
  readonly showParentSku?: boolean;
};

export default observer((props: Props) => {
  const { productId, showParentSku, className, style } = props;

  const styles = useStylesheet();
  const productStore = useProductStore();
  const product = productStore.getProduct(productId);

  return (
    <div className={css(styles.root, className, style)}>
      {product && (
        <div className={css(styles.container, styles.topControl)}>
          <div className={css(styles.textHeader)}>Product Name</div>
          <div className={css(styles.textBody)}>{product.name}</div>
        </div>
      )}
      {product && showParentSku && (
        <div className={css(styles.container)}>
          <div className={css(styles.textHeader)}>Parent SKU</div>
          <CopyButton
            text={product.parentSku}
            prompt={i`Copy Parent SKU`}
            copyOnBodyClick
          >
            <div className={css(styles.textCopyableBody)}>
              {product.parentSku}
            </div>
          </CopyButton>
        </div>
      )}
      <div
        className={
          !product
            ? css(styles.container, styles.topControl)
            : css(styles.container)
        }
      >
        <div className={css(styles.textHeader)}>Product ID</div>
        <CopyButton text={productId} prompt={i`Copy ID`} copyOnBodyClick>
          <div className={css(styles.textCopyableBody)}>{productId}</div>
        </CopyButton>
      </div>
    </div>
  );
});

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        topControl: {
          marginTop: "20px",
        },
        container: {
          maxWidth: 220,
          margin: "0px 20px 20px 20px",
          display: "flex",
          flexDirection: "column",
        },
        textHeader: {
          fontSize: 12,
          fontWeight: weightBold,
        },
        textBody: {
          fontSize: 12,
        },
        textCopyableBody: {
          fontSize: 12,
          color: palettes.coreColors.DarkWishBlue,
          fontFamily: proxima,
        },
      }),
    []
  );
};
