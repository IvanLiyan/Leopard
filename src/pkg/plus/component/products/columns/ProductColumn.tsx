//
//  core/data/table/ProductColumn.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 2/20/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CopyButton } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

import { Popover } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightMedium } from "@toolkit/fonts";

/* Merchant Components */
import ProductDetailModal from "@merchant/component/products/ProductDetailModal";

/* Toolkit */
import { contestImageURL } from "@toolkit/url";

/* Relative Imports */
import ProductDetailPopover from "@merchant/component/products/columns/ProductDetailPopover";

/* Type Imports */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BasicColumnProps, CellInfo } from "@ContextLogic/lego";
import { useTheme } from "@merchant/stores/ThemeStore";

export type ProductColumnProps = BasicColumnProps & {
  readonly imageSize?: number | null | undefined;
  readonly fontSize?: number | null | undefined;
  readonly showProductId?: boolean;
  readonly showDetailsInPopover?: boolean;
  readonly popoverPosition?: string;
  readonly hideText?: boolean;
  readonly showFullName?: boolean;
  readonly showFullProductId?: boolean;
  readonly showParentSku?: boolean;
};

type ContentProps = {
  readonly columnProps: ProductColumnProps;
  readonly productId: string;
};

const Content: React.FC<ContentProps> = observer((props: ContentProps) => {
  const { columnProps, productId } = props;
  const {
    hideText,
    showProductId,
    showFullName = true,
    showFullProductId = true,
  } = columnProps;

  const { productStore } = AppStore.instance();
  const product = productStore.getProduct(productId);

  const styles = useStylesheet(columnProps);
  let content: ReactNode = null;
  if (showProductId || !product) {
    if (showFullProductId) {
      content = productId;
    } else {
      content = `...${productId.substring(productId.length - 5)}`;
    }
  } else {
    content =
      showFullName === false && product.name.length >= 20
        ? product.name.substr(0, 20) + "..."
        : product.name;
  }
  return (
    <div
      className={css(styles.content)}
      onClick={() => {
        new ProductDetailModal(productId).render();
      }}
    >
      <img
        className={css(styles.image)}
        alt="product"
        src={contestImageURL({ contestId: productId, size: "small" })}
      />
      {!hideText && <div className={css(styles.identifier)}>{content}</div>}
    </div>
  );
});

const ProductColumn: React.FC<ProductColumnProps> = observer(
  (props: ProductColumnProps) => {
    const {
      imageSize,
      fontSize,
      showProductId,
      hideText,
      showDetailsInPopover = false,
      popoverPosition,
      showFullName,
      showFullProductId,
      showParentSku,
      ...otherProps
    } = props;
    return (
      <Table.Column {...otherProps}>
        {({ value }: CellInfo<string, any>) => {
          const productId = value;

          if (showDetailsInPopover) {
            return (
              <Popover
                position={popoverPosition || "top"}
                popoverMaxWidth={270}
                popoverContent={() => (
                  <ProductDetailPopover
                    productId={productId}
                    showParentSku={showParentSku}
                  />
                )}
              >
                <Content columnProps={props} productId={productId} />
              </Popover>
            );
          }

          return (
            <CopyButton
              style={{ width: "100%" }}
              text={productId}
              prompt={i`Copy Product ID`}
              copyOnBodyClick={false}
            >
              <Content columnProps={props} productId={productId} />
            </CopyButton>
          );
        }}
      </Table.Column>
    );
  }
);

export default ProductColumn;

const useStylesheet = ({ imageSize, fontSize }: ProductColumnProps) => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          cursor: "pointer",
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.8,
          },
        },
        image: {
          width: imageSize || 30,
          height: imageSize || 30,
          marginRight: 15,
          borderRadius: 4,
        },
        identifier: {
          color: primary,
          fontSize: fontSize || 15,
          userSelect: "none",
          whiteSpace: "nowrap",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: weightMedium,
        },
        popover: {
          display: "flex",
          flexDirection: "column",
        },
        nameContainer: {
          maxWidth: 220,
          margin: "20px",
          display: "flex",
          flexDirection: "column",
        },
        idContainer: {
          maxWidth: 220,
          margin: "0px 20px 20px 20px",
          display: "flex",
          flexDirection: "column",
        },
        textHeader: {
          fontSize: 12,
          fontWeight: weightBold,
        },
        textBody: {
          fontSize: 12,
        },
      }),
    [imageSize, fontSize, primary]
  );
};
