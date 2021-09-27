/*
 *
 * ProductImages.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/20/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import { Markdown, Text } from "@ContextLogic/lego";

import ImageUploadGroup, {
  ImageInfo,
} from "@merchant/component/products/product-details/ImageUploadGroup";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const ProductImages: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, editState, ...sectionProps } = props;

  const { forceValidation } = editState;
  const imageInfos: ReadonlyArray<ImageInfo> = useMemo(() => {
    const images = editState.images;
    if (images == null) {
      return [];
    }

    return images.map((image) => ({
      url: image.wishUrl,
      isClean: image.isCleanImage,
    }));
  }, [editState.images]);

  return (
    <Section
      className={css(style, className)}
      title={i`Product images`}
      {...sectionProps}
      hasInvalidData={forceValidation && imageInfos.length == 0}
    >
      <Text className={css(styles.title)} weight="semibold">
        Stand out with multiple, high-quality images of your product
      </Text>
      <Markdown
        className={css(styles.body)}
        text={
          i`After uploading, you can drag and drop to re-order your images. ` +
          i`[View image guide](${zendeskURL("360051155153")})`
        }
      />
      <ImageUploadGroup
        maxSizeMB={24}
        maxImages={20}
        onImagesChanged={(images: ReadonlyArray<ImageInfo>) => {
          editState.setImages(
            images.map((imageInfo, index) => ({
              id: index,
              wishUrl: imageInfo.url,
              isCleanImage: imageInfo?.isClean || false,
            }))
          );
        }}
        images={imageInfos}
        allowReorder
        className={css(styles.input)}
        cleanImageEnabled={false}
      />
    </Section>
  );
};

export default observer(ProductImages);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          color: textDark,
          marginBottom: 15,
        },
        body: {
          color: textDark,
          marginBottom: 15,
        },
        input: {
          alignSelf: "stretch",
        },
      }),
    [textDark]
  );
};
