/*
 * OrderSummaryCard.tsx
 *
 * Created by Jonah Dlin on Fri Feb 05 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import CardHeader from "@merchant/component/wps/create-shipping-label/CardHeader";
import ProductDetailModal from "@merchant/component/products/ProductDetailModal";

/* Lego Components */
import { Card, Link, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import ProductImage from "@merchant/component/products/ProductImage";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const OrderSummaryCard: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();

  const {
    initialData: {
      fulfillment: {
        order: {
          quantity,
          product,
          productId,
          sizeAtPurchaseTime,
          colorAtPurchaseTime,
        },
      },
    },
  } = state;

  const renderProduct = () => {
    const name = product?.name;

    return (
      <>
        <ProductImage
          className={css(styles.productImage)}
          productId={productId}
        />
        <Link
          openInNewTab
          className={css(styles.productLink)}
          onClick={() => new ProductDetailModal(productId).render()}
        >
          <Text weight="semibold">{name}</Text>
        </Link>
      </>
    );
  };

  const renderVariation = () => {
    const variationString =
      [
        ...(colorAtPurchaseTime == null ? [] : [colorAtPurchaseTime]),
        ...(sizeAtPurchaseTime == null ? [] : [sizeAtPurchaseTime]),
      ].join(" / ") || i`None`;

    return (
      <>
        <Text className={css(styles.text)} weight="semibold">
          Variation
        </Text>
        <Text className={css(styles.text)}>{variationString}</Text>
      </>
    );
  };

  const renderQuantity = () => (
    <>
      <Text className={css(styles.text)} weight="semibold">
        Quantity
      </Text>
      <Text className={css(styles.text)}>{quantity}</Text>
    </>
  );

  return (
    <Card className={css(styles.root, className, style)}>
      <CardHeader icon="document" title={i`In your order`} />
      <div className={css(styles.content)}>
        {renderProduct()}
        {renderVariation()}
        {renderQuantity()}
      </div>
    </Card>
  );
};

const useStylesheet = () => {
  const { textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        content: {
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          columnGap: "20px",
          rowGap: 12,
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        productImage: {
          width: 48,
          height: 48,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
        productLink: {
          maxWidth: 196,
          overflow: "hidden",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
      }),
    [textDark, borderPrimary],
  );
};

export default observer(OrderSummaryCard);
