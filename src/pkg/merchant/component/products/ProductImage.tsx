import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { contestImageURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "next/image";

export type ImageSize = "small" | "large";

export type ProductImageProps = BaseProps & {
  readonly productId: string;
  readonly cacheBuster?: string;
};

const ProductImage = (props: ProductImageProps) => {
  const { productId, cacheBuster, className, style } = props;
  return (
    <NextImage
      className={css(className, style)}
      alt="product"
      src={contestImageURL({ contestId: productId, cacheBuster })}
      draggable={false}
    />
  );
};

export default observer(ProductImage);
