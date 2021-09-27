import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { wishURL } from "@toolkit/url";

import { ProductVariation } from "@toolkit/fbs";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductVariationDetailRowProps = BaseProps & {
  readonly productVariation: ProductVariation;
};

const ProductVariationDetailRow = (props: ProductVariationDetailRowProps) => {
  const { className, productVariation } = props;
  const styles = useStyleSheet();
  const TitleWidth = 270;

  return (
    <div className={css(styles.root, className)}>
      <SheetItem
        className={css(styles.item)}
        title={i`Product name`}
        titleFontSize={14}
        titleWidth={TitleWidth}
        value={productVariation.product_name}
      />
      <SheetItem
        className={css(styles.item)}
        title={i`Product ID`}
        titleFontSize={14}
        titleWidth={TitleWidth}
      >
        <CopyButton text={productVariation.product_id} copyOnBodyClick={false}>
          <Link
            className={css(styles.copyButtonId)}
            openInNewTab
            href={wishURL(`/c/${productVariation.product_id}`)}
          >
            {productVariation.product_id}
          </Link>
        </CopyButton>
      </SheetItem>
      <SheetItem
        className={css(styles.item)}
        title={i`Variation information`}
        titleFontSize={14}
        titleWidth={TitleWidth}
      >
        <div>{productVariation.variation_size}</div>
        <div>{productVariation.variation_color}</div>
      </SheetItem>
      <SheetItem
        className={css(styles.item)}
        title={i`Originating warehouse`}
        titleFontSize={14}
        titleWidth={TitleWidth}
        value={productVariation.warehouses.join(", ")}
      />
    </div>
  );
};

export default observer(ProductVariationDetailRow);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        item: {
          marginBottom: 12,
        },
        copyButtonId: {
          marginRight: 4,
        },
      }),
    [],
  );
};
