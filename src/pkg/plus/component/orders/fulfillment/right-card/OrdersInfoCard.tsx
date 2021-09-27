import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { Link } from "@ContextLogic/lego";
import ProductImage from "@merchant/component/products/ProductImage";

import BaseRightCard from "./BaseRightCard";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type Props = BaseProps & {
  readonly orderId: string;
  readonly productId: string;
  readonly productName: string | undefined;
  readonly quantity: number;
  readonly size?: string | null;
  readonly color?: string | null;
};

const OrdersInfoCard: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    orderId,
    productId,
    productName,
    quantity,
    size,
    color,
  } = props;
  const styles = useStylesheet();

  const colorSize = [color, size].filter(Boolean).join(" / ");
  const bits = [colorSize, ni18n(quantity, "%1$s unit", "%1$s units")]
    .filter(Boolean)
    .join(" • ");

  return (
    <BaseRightCard className={css(className, style)} title={i`In your order`}>
      <div className={css(styles.root)}>
        <Link className={css(styles.link, style)} href={`/order/${orderId}`}>
          {productName != null && (
            <ProductImage className={css(styles.image)} productId={productId} />
          )}
          <div className={css(styles.content)}>
            <div className={css(styles.name)}>{productName || i`DELETED`}</div>
            <div className={css(styles.bits)}>{bits}</div>
          </div>
        </Link>
      </div>
    </BaseRightCard>
  );
};

export default observer(OrdersInfoCard);

const useStylesheet = () => {
  const { surfaceLightest, primary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "25px 20px",
        },
        link: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        name: {
          fontWeight: fonts.weightSemibold,
          color: primary,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          marginBottom: 7,
        },
        bits: {
          color: textDark,
          opacity: 0.7,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          fontSize: 14,
          fontWeight: fonts.weightNormal,
        },
        image: {
          minWidth: 50,
          maxWidth: 50,
          marginRight: 15,
        },
      }),
    [surfaceLightest, primary, textDark]
  );
};
