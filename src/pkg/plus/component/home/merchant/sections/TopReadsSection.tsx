import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy Toolkit */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import HomeSection from "@plus/component/home/HomeSection";
import ArticleCard from "@plus/component/home/cards/ArticleCard";

import {
  bannerAddProductVariations,
  bannerUploadProducts,
} from "@assets/illustrations";

type Props = BaseProps;

const TopReadsSection: React.FC<Props> = ({ style, className }: Props) => {
  const styles = useStylesheet();
  const uploadProductsArticle = zendeskURL("204529848");
  const productVariationsArticle = zendeskURL("205211757");

  return (
    <HomeSection
      title={ci18n(
        "Meaning top recommended articles to help new merchants setup store",
        "Top reads"
      )}
      className={css(style, className)}
    >
      <div className={css(styles.root)}>
        <ArticleCard
          titleText={i`How to upload products`}
          bannerUrl={bannerUploadProducts}
          contentText={ci18n(
            "Article blurb",
            "No products means no sales. You can add products manually (as opposed to uploading them using a product feed) through the Merchant Dashboard Add Products Manual page. [Learn more]({%1=url})",
            uploadProductsArticle
          )}
        />
        <ArticleCard
          titleText={i`Adding product images and variations`}
          bannerUrl={bannerAddProductVariations}
          contentText={
            i`It is strongly recommended that all product variations have linked images ` +
            i`of product variations for providing a better shopping experience on Wish. ` +
            i`[${i`Learn more`}](${productVariationsArticle})`
          }
        />
      </div>
    </HomeSection>
  );
};

export default observer(TopReadsSection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "grid",
          gridGap: 18,
          "@media (max-width: 900px)": {
            gridTemplateColumns: "100%",
          },
          "@media (min-width: 900px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        },
      }),
    []
  );
