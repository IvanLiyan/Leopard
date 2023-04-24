/*
 * ProductImages.tsx
 *
 * Created by Jonah Dlin on Tue Nov 16 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { Layout, Markdown, Text } from "@ContextLogic/lego";

import ImageUploadGroup, {
  ImageInfo,
} from "@add-edit-product/components/ImageUploadGroup";

import Section, { SectionProps } from "./Section";
import { useTheme } from "@core/stores/ThemeStore";
import AddEditProductState from "@add-edit-product/AddEditProductState";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ImageWidth = 173;

const ProductImages: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;

  const { forceValidation, images } = state;
  const imageInfos: ReadonlyArray<ImageInfo> = useMemo(() => {
    if (images == null) {
      return [];
    }

    return images.map((image) => ({
      url: image.wishUrl,
      isClean: image.isCleanImage,
    }));
  }, [images]);

  return (
    <Section
      className={css(style, className)}
      title={i`Product images`}
      {...sectionProps}
      hasInvalidData={forceValidation && imageInfos.length == 0}
    >
      <Text style={styles.title} weight="semibold">
        Stand out with multiple, high-quality images of your product
      </Text>
      <Markdown
        style={styles.body}
        text={i`After uploading, you can drag and drop to re-order your images.`}
        openLinksInNewTab
      />
      {images != null && images.length > 0 && (
        <Layout.FlexRow style={styles.imageTypeTextRow}>
          <Text style={styles.imageTypeText} weight="semibold">
            Main image
          </Text>
          <Text style={styles.imageTypeText} weight="semibold">
            Extra image(s)
          </Text>
        </Layout.FlexRow>
      )}
      <ImageUploadGroup
        maxSizeMB={24}
        maxImages={100}
        onImagesChanged={(images: ReadonlyArray<ImageInfo>) => {
          state.setImages(
            images.map((imageInfo, index) => ({
              id: index,
              wishUrl: imageInfo.url,
              isCleanImage: imageInfo?.isClean || false,
            })),
          );
        }}
        images={imageInfos}
        allowReorder
        className={css(styles.input)}
        cleanImageEnabled
        imageWidth={ImageWidth}
        data-cy="product-image"
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
          marginBottom: 4,
        },
        body: {
          color: textDark,
          marginBottom: 24,
        },
        imageTypeTextRow: {
          marginBottom: 8,
        },
        imageTypeText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          width: ImageWidth,
          ":not(:last-child)": {
            marginRight: 16,
          },
        },
        input: {
          alignSelf: "stretch",
        },
      }),
    [textDark],
  );
};
