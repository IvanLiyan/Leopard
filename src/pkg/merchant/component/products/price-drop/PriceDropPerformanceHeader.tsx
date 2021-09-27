import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { CopyButton } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ImprBoosterItem } from "@merchant/api/price-drop";

type PriceDropPerformanceHeaderProps = BaseProps & {
  readonly priceDropItem: ImprBoosterItem;
};

const PriceDropPerformanceHeader = (props: PriceDropPerformanceHeaderProps) => {
  const styles = useStylesheet();
  const { productStore, dimenStore } = AppStore.instance();

  const pageX = dimenStore.pageGuideXForPageWithTable;
  const { priceDropItem, style, className } = props;

  const { product_id: productId } = priceDropItem;

  const productName = productStore.getProduct(productId)?.name;

  return (
    <WelcomeHeader
      title={i`Price Drop Product Performance`}
      body={
        i`Explore the detailed performance of a product ` +
        i`during the Price Drop campaign.`
      }
      illustration="pricedropHeader"
      paddingX={pageX}
      className={css(className, style)}
    >
      <div className={css(styles.headerStatsContainer)}>
        <div className={css(styles.headerStatsRow)}>
          <div className={css(styles.headerStatsColumn)}>
            <Text weight="bold" className={css(styles.headerStatsTitle)}>
              Product ID
            </Text>
            <div className={css(styles.imgAndName)}>
              <ProductImage
                className={css(styles.productImg)}
                productId={productId}
              />
              <CopyButton text={productId} prompt={i`Copy Product ID`}>
                <Text weight="medium">{productId}</Text>
              </CopyButton>
            </div>
          </div>

          <div className={css(styles.headerStatsColumn)}>
            <Text weight="bold" className={css(styles.headerStatsTitle)}>
              Product Name
            </Text>
            {productName && (
              <Text weight="medium" className={css(styles.headerStatsBody)}>
                {productName.substring(0, 40) +
                  (productName.length > 40 ? "..." : "")}
              </Text>
            )}
          </div>
        </div>
      </div>
    </WelcomeHeader>
  );
};

export default observer(PriceDropPerformanceHeader);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        headerStatsContainer: {
          display: "flex",
          flexDirection: "column",
          maxWidth: 900,
          transform: "translateZ(0)",
        },
        headerStatsRow: {
          display: "flex",
          maxWidth: 900,
          transform: "translateZ(0)",
          marginTop: 16,
        },
        headerStatsColumn: {
          lineHeight: 1.4,
          flex: 1 / 3,
        },
        headerStatsTitle: {
          fontSize: 14,
          color: palettes.textColors.Ink,
          marginBottom: 7,
        },
        productImg: {
          width: 40,
          height: 40,
          marginRight: 10,
        },
        imgAndName: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        headerStatsBody: {
          fontSize: 14,
          color: palettes.textColors.Ink,
          wordWrap: "break-word",
          userSelect: "text",
          height: 40,
          display: "flex",
          alignItems: "center",
        },
      }),
    []
  );
};
