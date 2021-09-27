/* eslint-disable local-rules/unnecessary-list-usage */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info, Layout, Text } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Tip } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Model */
import ProductEditState from "@merchant/model/products/ProductEditState";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ImageUploadGroup, { ImageInfo } from "./ImageUploadGroup";

type ProductImagesSectionProps = BaseProps & {
  readonly onImagesChanged?: (
    mainImageUrl: string,
    extraImageUrls: Array<string>,
    cleanImageUrl: string
  ) => unknown;
  readonly mainImage?: string;
  readonly extraImages?: ReadonlyArray<string> | null | undefined;
  readonly cleanImage?: string | null | undefined;
  readonly editState?: ProductEditState;
};

const ProductImagesSection = (props: ProductImagesSectionProps) => {
  const styles = useStylesheet();

  const {
    onImagesChanged,
    mainImage: initialMainImageUrl,
    extraImages: initialExtraImageUrls,
    cleanImage: initialCleanImageUrl,
  } = props;

  const initialMainImage: ImageInfo | null | undefined = useMemo(
    () =>
      initialMainImageUrl
        ? {
            url: initialMainImageUrl,
            isClean: initialMainImageUrl === initialCleanImageUrl,
          }
        : null,
    [initialMainImageUrl, initialCleanImageUrl]
  );

  const initialExtraImages: ReadonlyArray<ImageInfo> = useMemo(
    () =>
      initialExtraImageUrls != null
        ? initialExtraImageUrls.map((img) => ({
            url: img,
            isClean: img === initialCleanImageUrl,
          }))
        : [],
    [initialExtraImageUrls, initialCleanImageUrl]
  );

  const [mainImages, setMainImages] = useState<ReadonlyArray<ImageInfo>>(
    initialMainImage ? [initialMainImage] : []
  );
  const [extraImages, setExtraImages] = useState(initialExtraImages);

  const onImagesUpdated = (
    mainImages: ReadonlyArray<ImageInfo>,
    extraImages: ReadonlyArray<ImageInfo>
  ) => {
    const { editState } = props;
    const mainImageUrl = mainImages.length > 0 ? mainImages[0].url : "";
    const extraImageUrls: string[] = [];
    let cleanImageUrl = "";
    mainImages.forEach((img, _) => {
      if (img.isClean) {
        cleanImageUrl = img.url;
      }
    });
    extraImages.forEach((img, _) => {
      extraImageUrls.push(img.url);
      if (img.isClean) {
        cleanImageUrl = img.url;
      }
    });
    onImagesChanged &&
      onImagesChanged(mainImageUrl, extraImageUrls, cleanImageUrl);
    editState &&
      editState.setImages({ mainImageUrl, extraImageUrls, cleanImageUrl });
  };

  const onMainImagesUpdated = (newMainImages: ReadonlyArray<ImageInfo>) => {
    // only one clean image allowed, so set isClean to false for extra images
    if (
      newMainImages.some((img) => img.isClean) &&
      extraImages.some((img) => img.isClean)
    ) {
      const newExtraImages = extraImages.map((img) => {
        return {
          ...img,
          isClean: false,
        };
      });
      setExtraImages(newExtraImages);
    }
    setMainImages(newMainImages);
    onImagesUpdated(newMainImages, extraImages);
  };

  const onExtraImagesUpdated = (newExtraImages: ReadonlyArray<ImageInfo>) => {
    // only one clean image allowed, so set isClean to false for main images
    if (
      newExtraImages.some((img) => img.isClean) &&
      mainImages.some((img) => img.isClean)
    ) {
      const newMainImages = mainImages.map((img) => {
        return {
          ...img,
          isClean: false,
        };
      });
      setMainImages(newMainImages);
    }
    setExtraImages(newExtraImages);
    onImagesUpdated(mainImages as ImageInfo[], newExtraImages);
  };

  const cleanImageTip = () => {
    return (
      <div style={{ margin: 10 }}>
        <p>Tips for choosing a Clean Image:</p>
        <ul>
          <li>No added texts or logos</li>
          <li>Clearly present the product</li>
          <li>Choose a light background</li>
        </ul>
        <span>
          See the full lists of standards and examples for clean images.
        </span>
        <Link href={zendeskURL("360033668153")} openInNewTab>
          {" "}
          Learn more
        </Link>
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.headerText)}>
        Upload images to give buyers a general view of your item.
      </div>

      <Tip color={palettes.coreColors.WishBlue} icon="tip">
        <ul>
          <li>
            Products with multiple high quality images get the most sales.
          </li>
          <li>Listings look best with photos at least 800x800 pixels.</li>
          <li>Images can be reordered by dragging around.</li>
          <li>
            <div className={css(styles.rowWithTooltip)}>
              <span>
                Choosing designated Clean Image may increase sales and
                impressions.{" "}
              </span>
              <Info
                size={16}
                position="top center"
                sentiment="info"
                popoverContent={cleanImageTip}
              />
            </div>
          </li>
        </ul>
      </Tip>

      <Layout.FlexRow alignItems="stretch" style={styles.imageContainer}>
        <Layout.FlexColumn style={styles.imageSectionContainer}>
          <Text style={styles.imageSectionHeader} weight="semibold">
            Main Image
          </Text>
          <ImageUploadGroup
            maxSizeMB={24}
            maxImages={1}
            onImagesChanged={(images: ReadonlyArray<ImageInfo>) =>
              onMainImagesUpdated(images)
            }
            images={mainImages}
            allowReorder={false}
          />
        </Layout.FlexColumn>

        <Layout.FlexColumn style={styles.imageSectionContainer}>
          <Text style={styles.imageSectionHeader} weight="semibold">
            Extra Images
          </Text>
          <ImageUploadGroup
            maxSizeMB={24}
            maxImages={20}
            onImagesChanged={(images: ReadonlyArray<ImageInfo>) =>
              onExtraImagesUpdated(images)
            }
            images={extraImages}
            allowReorder
          />
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </div>
  );
};

export default observer(ProductImagesSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 20,
        },
        imageContainer: {
          flex: 1,
          marginTop: 20,
        },
        imageSectionHeader: {
          marginBottom: 5,
        },
        imageSectionContainer: {
          ":not(:last-child)": {
            marginRight: 8,
          },
          ":last-child": {
            flex: 1,
          },
        },
        headerText: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          marginBottom: 20,
        },
        rowWithTooltip: {
          display: "flex",
          flex: 1,
          flexDirection: "row",
        },
      }),
    []
  );
};
