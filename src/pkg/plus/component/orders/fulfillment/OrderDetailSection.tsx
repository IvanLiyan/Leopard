/*
 *
 * OrderDetailSection.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import ShippingAddress from "@plus/component/orders/fulfillment/ShippingAddress";

import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import ProductImage from "@merchant/component/products/ProductImage";

import OrderEditState from "@plus/model/OrderEditState";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly editState: OrderEditState;
};

const LabelWidth = 60;
const OrderDetailSection: React.FC<Props> = ({
  editState,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();
  const {
    id: orderId,
    initialData: { variation, shippingDetails },
    productId,
    productSize: size,
    productColor: color,
    productSku: sku,
    quantity: quantity,
  } = editState;

  const productName = variation?.productName;

  const tidbits = [sku, size, color].filter((v) => v != null).join(" / ");
  return (
    <section className={css(styles.root, className, style)}>
      <Link className={css(styles.topRow)} href={`/order/${orderId}`}>
        <div className={css(styles.image)}>
          <ProductImage productId={productId} />
        </div>

        <div className={css(styles.nameAndSkuSection)}>
          <div className={css(styles.productName)}>{productName}</div>
          <div className={css(styles.tidbits)}>{tidbits}</div>
        </div>
      </Link>
      <div className={css(styles.sideBySide)}>
        <div className={css(styles.info)}>
          <div className={css(styles.label)}>Ship to</div>
          {shippingDetails && (
            <ShippingAddress
              className={css(styles.value)}
              shippingDetails={shippingDetails}
            />
          )}
        </div>
        <div className={css(styles.info)}>
          <div className={css(styles.label)}>Quantity</div>
          <div className={css(styles.value)}>{quantity}</div>
        </div>
      </div>
    </section>
  );
};

export default observer(OrderDetailSection);

const useStylesheet = () => {
  const { primary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "13px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflow: "hidden",
        },
        topRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          overflow: "hidden",
        },
        image: {
          width: LabelWidth,
          marginRight: 15,
        },
        bottomRow: {
          marginTop: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        label: {
          fontWeight: fonts.weightBold,
          width: LabelWidth,
          marginRight: 15,
        },
        productName: {
          fontWeight: fonts.weightSemibold,
          color: primary,
          whiteSpace: "normal",
          textOverflow: "ellipsis",
          overflow: "hidden",
          marginBottom: 7,
          fontSize: 16,
          maxWidth: "100%",
        },
        nameAndSkuSection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          overflow: "hidden",
        },
        tidbits: {
          color: textDark,
          opacity: 0.7,
          fontSize: 15,
          fontWeight: fonts.weightNormal,
        },
        sideBySide: {
          "@media (min-width: 900px)": {
            display: "flex",
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
              width: 350,
              ":first-child": {
                marginRight: 20,
              },
            },
          },
          "@media (max-width: 900px)": {
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            ":nth-child(1n) > div": {
              minWidth: 350,
              ":first-child": {
                marginRight: 20,
              },
              ":not(:first-child)": {
                marginTop: 20,
              },
            },
          },
          marginTop: 20,
        },
        info: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        },
        value: {
          marginRight: 15,
        },
      }),
    [primary, textDark]
  );
};
