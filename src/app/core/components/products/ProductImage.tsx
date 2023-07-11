import React, { useMemo } from "react";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { gql } from "@gql";
import { ImageSchema } from "@schema";
import imageLoadingSrc from "public/images/image-loading.svg";
import imageMissingSrc from "public/images/image-missing.svg";
import { css } from "@core/toolkit/styling";
// import Image, { ImageProps } from "next/image";
import { ci18n } from "@core/toolkit/i18n";
import { useQuery } from "@apollo/client";
import Image from "../Image";
import { ImageProps } from "next/image";

export type ProductImageProps = BaseProps &
  Pick<ImageProps, "width" | "height"> &
  (
    | {
        readonly productId: string;
        readonly imageUrl?: never;
      }
    | {
        readonly imageUrl: string;
        readonly productId?: never;
      }
  );

const GET_PRODUCT_IMAGE = gql(`
  query ProductImage_GetProductImage($productId: String!) {
    productCatalog {
      product(id: $productId) {
        mainImage {
          wishUrl
        }
      }
    }
  }
`);

type GetProductImageResponse = {
  readonly productCatalog?: {
    readonly product?: {
      readonly mainImage: Pick<ImageSchema, "wishUrl">;
    } | null;
  } | null;
};

type GetProductImageRequest = {
  readonly productId: string;
};

const ProductImage = ({
  productId,
  imageUrl,
  className,
  style,
  width,
  height,
}: ProductImageProps) => {
  const { data, loading } = useQuery<
    GetProductImageResponse,
    GetProductImageRequest
  >(GET_PRODUCT_IMAGE, {
    variables: {
      // never reaches "" case, query is skipped if PID is missing
      productId: productId ?? "",
    },
    skip: imageUrl != null || productId == null,
  });

  const url = data?.productCatalog?.product?.mainImage.wishUrl;
  const src = useMemo(() => {
    if (imageUrl != null) {
      return imageUrl;
    }

    if (loading) {
      return imageLoadingSrc.src;
    }

    if (url != null) {
      return url;
    }

    return imageMissingSrc.src;
  }, [imageUrl, url, loading]);

  return (
    <Image
      className={css(className, style)}
      alt={ci18n("Accessibility text for a product image", "Product image")}
      src={src}
      width={width ?? 60}
      height={height ?? 60}
      draggable={false}
    />
  );
};

export default observer(ProductImage);
