/*
 * WishImagePreview.tsx
 *
 * Created by Jonah Dlin on Mon Jul 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@toolkit/api";
import { useTheme } from "@stores/ThemeStore";
import { CurrencyValue } from "@schema/types";
import { formatCurrency } from "@toolkit/currency";
import { PreviewType } from "@toolkit/product-edit";

export type WishImagePreviewProps = BaseProps & {
  readonly previewType: PreviewType;
  readonly imageUrl?: string | null;
  readonly price?: number | null;
  readonly msrp?: number | null;
  readonly currencyCode?: CurrencyValue["currencyCode"] | null;
};

const WishImagePreview: React.FC<WishImagePreviewProps> = ({
  className,
  style,
  previewType,
  imageUrl,
  price,
  msrp,
  currencyCode,
}) => {
  const styles = useStylesheet({ previewType });

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Layout.FlexRow
        style={styles.imageContainerSquare}
        alignItems="flex-start"
      >
        <Layout.FlexRow style={styles.imageContainer} alignItems="center">
          {imageUrl == null ? (
            <div className={css(styles.imagePlaceholder)} />
          ) : (
            <img src={imageUrl} className={css(styles.image)} />
          )}
        </Layout.FlexRow>
      </Layout.FlexRow>
      {price == null || currencyCode == null ? (
        <div className={css(styles.pricePlaceholder)} />
      ) : (
        <Layout.FlexRow style={styles.priceContainer}>
          {msrp != null && (
            <Text style={styles.msrp}>
              {formatCurrency(msrp, currencyCode)}
            </Text>
          )}
          <Text style={styles.price}>
            {formatCurrency(price, currencyCode)}
          </Text>
        </Layout.FlexRow>
      )}
      <Text style={styles.desc}>Customers bought this</Text>
    </Layout.FlexColumn>
  );
};

export default observer(WishImagePreview);

const useStylesheet = ({
  previewType,
}: {
  readonly previewType: PreviewType;
}) => {
  const { surfaceLighter, surfaceLight, textDark, textUltralight, textBlack } =
    useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        imageContainerSquare: {
          width: "100%",
          // 'paddingBottom: "100%"' makes this a responsive square
          // padding as % is calculated relative to the width
          paddingBottom: "100%",
          position: "relative",
        },
        imageContainer: {
          position: "absolute",
          width: "100%",
          height: "100%",
        },
        imagePlaceholder: {
          backgroundColor: surfaceLighter,
          width: "100%",
          height: "100%",
        },
        image: {
          maxWidth: "100%",
          maxHeight: "100%",
        },
        pricePlaceholder: {
          margin:
            previewType === "WEB" ? "16px 0px 6px 20px" : "8px 0px 0px 0px",
          borderRadius: 2,
          backgroundColor: surfaceLight,
          width: 54,
          height: 14,
        },
        priceContainer: {
          margin:
            previewType == "WEB" ? "10px 0px 0px 20px" : "8px 0px 0px 0px",
        },
        msrp: {
          color: textUltralight,
          textDecoration: `line-through ${textUltralight}`,
          marginRight: 4,
          ...(previewType === "WEB"
            ? {
                fontSize: 16,
                lineHeight: "26px",
              }
            : {
                fontSize: 12,
                lineHeight: "14px",
              }),
        },
        price: {
          color: textBlack,
          ...(previewType === "WEB"
            ? {
                fontSize: 16,
                lineHeight: "26px",
              }
            : {
                fontSize: 12,
                lineHeight: "14px",
              }),
        },
        desc: {
          color: textDark,
          ...(previewType === "WEB"
            ? {
                fontSize: 14,
                lineHeight: "16px",
                marginLeft: 20,
              }
            : {
                fontSize: 10,
                lineHeight: "12px",
                marginTop: 4,
              }),
        },
      }),
    [
      surfaceLighter,
      surfaceLight,
      textDark,
      textUltralight,
      textBlack,
      previewType,
    ],
  );
};
