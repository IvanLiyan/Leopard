/*
 *
 * WishAppAdPreview.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  Card,
  Markdown,
  HeroBanner,
  StaggeredFadeIn,
} from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { useTheme } from "@merchant/stores/ThemeStore";
import ProductImage from "@merchant/component/products/ProductImage";

import BoostProductsState from "@plus/model/BoostProductsState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly boostState: BoostProductsState;
};

const WishAppAdPreview: React.FC<Props> = ({
  style,
  className,
  boostState,
}: Props) => {
  const styles = useStylesheet();
  const { surfaceLightest } = useTheme();
  const { selectedProducts } = boostState;
  const pages = _.chunk(selectedProducts, 2);
  return (
    <Card
      className={css(style, className)}
      contentContainerStyle={css(styles.root)}
    >
      <div className={css(styles.app)}>
        <Illustration name="wishAppTopBar" alt="wish app" />
        <HeroBanner
          autoScrollIntervalSecs={2}
          contentMarginX={10}
          infiniteScroll={false}
        >
          {pages.map((boostedProducts, index) => {
            const productIds = boostedProducts
              .map(({ product: { id: productId } }) => productId)
              .join(",");
            return (
              <HeroBanner.Item
                id={productIds}
                key={productIds}
                background={surfaceLightest}
              >
                <StaggeredFadeIn
                  deltaY={8}
                  animationDurationMs={500}
                  className={css(styles.feedRow)}
                >
                  {boostedProducts.map(({ product: { id: productId } }) => (
                    <div className={css(styles.productCell)}>
                      <div className={css(styles.imageContainer)}>
                        <ProductImage
                          productId={productId}
                          className={css(styles.image)}
                        />
                      </div>

                      <div className={css(styles.productNameContainer)}>
                        <div className={css(styles.productName)} />
                        <Illustration name="adBadge" alt="ad" />
                      </div>
                      <div className={css(styles.testimonial)}>
                        Customers bought this
                      </div>
                    </div>
                  ))}
                </StaggeredFadeIn>
              </HeroBanner.Item>
            );
          })}
        </HeroBanner>
      </div>
      <Markdown
        text={i`Your boosted products will be tagged as "**ad**" in the Wish app.`}
      />
    </Card>
  );
};

export default observer(WishAppAdPreview);

const useStylesheet = () => {
  const { textUltralight, borderPrimary, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 25,
        },
        app: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          marginBottom: 15,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
        },
        feedRow: {
          display: "grid",
          gridGap: 15,
          gridTemplateColumns: "1fr 1fr",
        },
        imageContainer: {
          height: 140,
          display: "flex",
          justifyContent: "center",
          alignSelf: "center",
        },
        image: {
          width: "100%",
        },
        productCell: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "15px 0px",
        },
        productNameContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 5,
          justifyContent: "space-between",
        },
        productName: {
          height: 12,
          backgroundColor: surfaceLight,
          marginRight: 10,
          width: "60%",
        },
        testimonial: {
          fontSize: 10,
          color: textUltralight,
        },
      }),
    [textUltralight, borderPrimary, surfaceLight]
  );
};
