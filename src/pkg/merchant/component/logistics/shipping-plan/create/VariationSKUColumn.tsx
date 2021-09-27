/*
 * VariationSKUColumn.tsx
 *
 * Created by Sola Ogunsakin on Thurs May 6 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

import { Text, Layout, IconButton, IconButtonProps } from "@ContextLogic/lego";
import { PickedVariationSchema } from "@toolkit/fbw/create-shipping-plan";
import ProductImage from "@merchant/component/products/ProductImage";
import { Illustration } from "@merchant/component/core";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly variation: PickedVariationSchema;
  readonly onCopy?: IconButtonProps["onClick"];
  readonly copyDisabled?: IconButtonProps["disabled"];
};

export const VARIATION_ICON_WIDTH = 38;

const VariationSKUColumn: React.FC<Props> = ({
  style,
  variation,
  className,
  onCopy,
  copyDisabled,
}: Props) => {
  const {
    logisticsMetadata: { isFbwRecommended },
    productId,
    sku,
  } = variation;
  const styles = useStylesheet();
  return (
    <Layout.FlexRow style={[style, className]}>
      {onCopy && (
        <IconButton
          style={styles.icon}
          icon="copy"
          onClick={onCopy}
          disabled={copyDisabled}
          popoverContent={
            i`Apply the logistics information of this SKU to ` +
            i`all variations of the same product.`
          }
          hideBorder
        />
      )}
      {isFbwRecommended ? (
        <Illustration
          name="recomIcon"
          alt={i`Recommended by Wish`}
          style={styles.icon}
        />
      ) : (
        <div className={css(styles.icon)} />
      )}
      <ProductImage productId={productId} style={styles.icon} />
      <Text style={styles.sku}>{sku}</Text>
    </Layout.FlexRow>
  );
};

export default observer(VariationSKUColumn);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        sku: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        icon: {
          width: 30,
          maxWidth: 30,
          maxHeight: 30,
          marginRight: 8,
        },
      }),
    []
  );
};
