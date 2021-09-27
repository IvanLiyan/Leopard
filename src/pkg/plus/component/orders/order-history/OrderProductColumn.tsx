import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ni18n } from "@legacy/core/i18n";

import { Text, Link, Layout } from "@ContextLogic/lego";
import ProductImage from "@merchant/component/products/ProductImage";
import ProductDetailModal from "@merchant/component/products/ProductDetailModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly sku: string;
  readonly orderId: string;
  readonly quantity: number;
  readonly productId: string;
  readonly productName: string;
};

const OrderProductColumn: React.FC<Props> = (props: Props) => {
  const { className, style, productId, productName, sku, quantity } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexRow className={css(className, style)}>
      <ProductImage className={css(styles.image)} productId={productId} />
      <Layout.FlexColumn className={css(styles.content)}>
        <Link
          className={css(styles.name)}
          onClick={() => new ProductDetailModal(productId).render()}
        >
          {productName}
        </Link>
        <Layout.FlexRow>
          <Text className={css(styles.bits, styles.sku)}>{sku}</Text>
          <Text>{" • "}</Text>
          <Text className={css(styles.bits)}>
            {ni18n(quantity, "%1$s unit", "%1$s units")}
          </Text>
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { primary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          overflow: "hidden",
        },
        name: {
          color: primary,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          marginBottom: 7,
        },
        sku: {
          maxWidth: "33%",
        },
        bits: {
          color: textDark,
          opacity: 0.7,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          fontSize: 14,
          margin: "0px 5px",
        },
        image: {
          minWidth: 50,
          maxWidth: 50,
          maxHeight: 50,
          marginRight: 15,
        },
      }),
    [primary, textDark]
  );
};

export default observer(OrderProductColumn);
