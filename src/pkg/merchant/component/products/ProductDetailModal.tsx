import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { IconButton } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightSemibold } from "@toolkit/fonts";

/* Merchant API */
import * as productApi from "@merchant/api/product";

/* Toolkit */
import { wishURL } from "@toolkit/url";
import { contestImageURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "@next-toolkit/Image";

type ProductDetailModalContentProps = BaseProps & {
  readonly productId: string;
};

const ProductDetailModalContent = observer(
  (props: ProductDetailModalContentProps) => {
    const styles = useStyleSheet(props);
    const { productId } = props;
    const request = productApi.getProduct({ product_id: productId });

    if (request.isLoading) {
      return <LoadingIndicator />;
    }

    const product = request.response?.data?.product;
    if (!product) {
      return <>{i`No product found`}</>;
    }

    return (
      <div className={css(styles.root)}>
        <div className={css(styles.flexRow)}>
          <div className={css(styles.productImgContainer)}>
            <NextImage
              src={contestImageURL({ contestId: product.id })}
              className={css(styles.productImg)}
            />
          </div>
          <div className={css(styles.productNameIdContainer)}>
            <div className={css(styles.marginBottom)}>
              <span className={css(styles.bold)}>Name: </span>
              {product.name}
            </div>
            <div className={css(styles.productId, styles.marginBottom)}>
              <span className={css(styles.bold)}>ID: </span>
              <ObjectId id={product.id} showFull />
            </div>
            <div className={css(styles.marginBottom)}>
              <span className={css(styles.bold)}>Available For Sale: </span>
              {product.is_deleted ? i`No` : i`Yes`}
            </div>
            <IconButton
              href={wishURL(`/c/${product.id}`)}
              icon="externalLink"
              openInNewTab
            >
              View on Wish
            </IconButton>
          </div>
        </div>
        <div className={css(styles.description)}>
          <div className={css(styles.bold, styles.marginBottom)}>
            Description
          </div>
          {product.description}
        </div>
      </div>
    );
  },
);

export default class ProductDetailModal extends Modal {
  productId: string;

  constructor(productId: string) {
    super(() => null);
    this.productId = productId;
    this.setHeader({ title: i`Product Details` });
    this.setWidthPercentage(0.35);
  }

  renderContent() {
    return <ProductDetailModalContent productId={this.productId} />;
  }
}

const useStyleSheet = (props: ProductDetailModalContentProps) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 20,
        },
        bold: {
          fontWeight: weightSemibold,
          marginRight: 8,
        },
        flexRow: {
          display: "flex",
        },
        productNameIdContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 2,
          marginLeft: 10,
        },
        productImgContainer: {
          flex: 1,
          minWidth: 50,
        },
        productImg: {
          maxWidth: "100%",
        },
        productId: {
          display: "flex",
          alignItems: "center",
        },
        description: {
          marginTop: 10,
          alignSelf: "stretch",
          whiteSpace: "pre-wrap",
        },
        marginBottom: {
          marginBottom: 10,
        },
      }),
    [],
  );
