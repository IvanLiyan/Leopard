//
//  core/data/table/ProductColumn.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 2/20/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { useState, useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";
// import Popover from "@merchant/component/core/Popover";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { palettes } from "@deprecated/pkg/toolkit/lego-legacy/DEPRECATED_colors";
import { weightBold, proxima } from "@core/toolkit/fonts";

/* Merchant Components */
import ProductDetailModal from "@core/components/products/ProductDetailModal";

/* Toolkit */
import { contestImageURL } from "@core/toolkit/url";

import { BasicColumnProps, CellInfo } from "@ContextLogic/lego";
import Image from "@core/components/Image";
// import { useProductStore } from "@merchant/stores/ProductStore";

export type ProductColumnProps = BasicColumnProps & {
  readonly imageSize?: number | null | undefined;
  readonly fontSize?: number | null | undefined;
  readonly fontColor?: string | null | undefined;
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
  readonly productName: string;
};

const Content = observer((props: ContentProps) => {
  const { columnProps, productId, productName } = props;
  const {
    hideText,
    showProductId,
    showFullName = true,
    showFullProductId = true,
  } = columnProps;
  const [modalOpen, setModalOpen] = useState(false);

  const styles = useStylesheet(columnProps);
  let content: ReactNode = null;
  if (showProductId) {
    if (showFullProductId) {
      content = productId;
    } else {
      content = `...${productId.substring(productId.length - 5)}`;
    }
  } else {
    content =
      showFullName === false && productName.length >= 20
        ? productName.substr(0, 20) + "..."
        : productName;
  }
  return (
    <>
      <ProductDetailModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        productId={productId}
      />
      <div
        className={css(styles.content)}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <Image
          className={css(styles.image)}
          alt="product"
          src={contestImageURL(productId, "small")}
        />
        {!hideText && <div className={css(styles.identifier)}>{content}</div>}
      </div>
    </>
  );
});

const ProductColumn = observer((props: ProductColumnProps) => {
  // commenting out dependencies for details popover
  const {
    // imageSize,
    // fontSize,
    // showProductId,
    // hideText,
    // popoverPosition,
    // showFullName,
    // showFullProductId,
    // showParentSku,
    ...otherProps
  } = props;
  // const styles = useStylesheet(props);

  return (
    <Table.Column {...otherProps}>
      {({
        row: { id: productId, name: productName },
      }: // legacy code
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      CellInfo<string, any>) => {
        return (
          <CopyButton
            style={{ width: "100%" }}
            text={productId}
            prompt={i`Copy Product ID`}
            copyOnBodyClick={false}
          >
            <Content
              columnProps={props}
              productId={productId}
              productName={productName}
            />
          </CopyButton>
        );
      }}
    </Table.Column>
  );
});

export default ProductColumn;

const useStylesheet = ({
  imageSize,
  fontSize,
  fontColor,
}: ProductColumnProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: "100%",
        },
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
          width: imageSize || 40,
          height: imageSize || 40,
          marginRight: 15,
          borderRadius: 4,
        },
        identifier: {
          color: fontColor || palettes.textColors.Ink,
          fontSize: fontSize || 16,
          userSelect: "none",
          whiteSpace: "nowrap",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
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
        textBodyId: {
          fontSize: 12,
          color: palettes.coreColors.DarkWishBlue,
          fontFamily: proxima,
        },
      }),
    [imageSize, fontSize, fontColor],
  );
};
