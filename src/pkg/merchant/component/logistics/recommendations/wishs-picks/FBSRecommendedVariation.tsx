/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FBSTopVariation } from "@merchant/api/fbs";

type FBSRecommendedVariationProps = BaseProps & {
  readonly variation: FBSTopVariation;
  readonly selectedItemVariationIds: Set<string>;
  readonly onSelect: (arg0: Set<string>) => void;
  readonly isShown: boolean;
  readonly combinedQuantity: Map<string, number>;
};

const FBSRecommendedVariation = (props: FBSRecommendedVariationProps) => {
  const {
    variation,
    selectedItemVariationIds,
    onSelect,
    isShown,
    combinedQuantity,
  } = props;
  const variationId = variation.variation_id;
  const isSelected = selectedItemVariationIds.has(variationId);
  const styles = useStylesheet(isSelected, isShown);
  const { productStore } = useStore();
  const product = productStore.getProduct(variation.product_id);

  const onSecondaryButtonClick = () => {
    if (isSelected) {
      selectedItemVariationIds.delete(variationId);
    } else {
      selectedItemVariationIds.add(variationId);
    }
    onSelect(new Set(selectedItemVariationIds));
  };

  return (
    <Card className={css(styles.root)}>
      <div className={css(styles.topContent)}>
        <ProductImage
          className={css(styles.productImage)}
          productId={variation.product_id}
        />
        <div className={css(styles.quantity)}>
          <div className={css(styles.quantityNeededTitle)}>
            <Popover
              position={"right"}
              popoverMaxWidth={160}
              popoverFontSize={12}
              popoverContent={
                i`Based on our analysis, we recommend that you add this quantity` +
                i` of the product variation to your shipping plan and stock them` +
                i` in the FBW warehouses.`
              }
            >
              Quantity Recommended
            </Popover>
          </div>
          <div className={css(styles.quantityNumber)}>
            {combinedQuantity.get(variation.variation_id) || 0}
          </div>
        </div>
      </div>
      {product ? (
        <>
          <div className={css(styles.productName)}>
            {product ? product.name : variation.product_id}
          </div>
          <div className={css(styles.variation)}>{variation.variation_sku}</div>
        </>
      ) : (
        <LoadingIndicator key="loading-fbs-product-name" />
      )}
      <SecondaryButton
        className={css(styles.selectButton)}
        padding="8px 32px"
        type="select"
        onClick={onSecondaryButtonClick}
        isSelected={isSelected}
      >
        <div className={css(styles.selectButtonText)}>
          {isSelected && <Icon name="blueCheckmarkNoFill" alt="checkmark" />}
          {isSelected ? i`Selected` : i`Select`}
        </div>
      </SecondaryButton>
    </Card>
  );
};

export default observer(FBSRecommendedVariation);

const useStylesheet = (isSelected: boolean, isShown: boolean) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: isShown ? "block" : "none",
          padding: "24px 28px",
          ":hover": {
            boxShadow: "0 2px 10px 0 #afc7d133",
          },
          border: isSelected
            ? "solid 1px #2fb7ec"
            : "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        },
        topContent: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        productImage: {
          width: "56px",
          height: "56px",
        },
        quantity: {
          display: "flex",
          flexDirection: "column",
          textAlign: "right",
        },
        quantityNeededTitle: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          color: palettes.textColors.LightInk,
          borderBottom: "1px dashed #5A7385",
        },
        quantityNumber: {
          fontSize: 28,
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.Ink,
          lineHeight: 1.14,
          paddingTop: "4px",
        },
        productName: {
          display: "-webkit-box" as any,
          fontSize: 14,
          fontWeight: fonts.weightSemibold,
          color: "#122936",
          paddingTop: "20px",
          overflow: "hidden",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          minHeight: "40px",
        },
        variation: {
          display: "-webkit-box" as any,
          fontSize: 14,
          color: palettes.textColors.LightInk,
          paddingTop: "8px",
          overflow: "hidden",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        },
        selectButton: {
          paddingTop: "16px",
          width: "100%",
        },
        selectButtonText: {
          display: "flex",
          flexDirection: "row",
          lineHeight: "24px",
          fontSize: "16px",
        },
      }),
    [isSelected, isShown]
  );
};
