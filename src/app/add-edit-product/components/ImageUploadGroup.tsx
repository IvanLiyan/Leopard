/*
 * ImageUploadGroup.tsx
 *
 * Created by Jonah Dlin on Thu Jul 15 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { runInAction } from "mobx";
import Dropzone, { DropzoneRenderArgs } from "react-dropzone";

/* Lego */
import {
  DraggableList,
  Layout,
  Text,
  DeleteButton,
  RadioGroup,
  Info,
  Ul,
  Link,
  Button,
  LoadingIndicator,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { getImageSize } from "@ContextLogic/lego/toolkit/image";

/* Toolkit */
import { css } from "@core/toolkit/styling";
import { zendeskURL } from "@core/toolkit/url";

/* Stores */
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import Image from "@core/components/Image";
import Icon from "@core/components/Icon";
import { upload } from "@core/toolkit/uploads";

export type ImageInfo = {
  readonly url: string;
  readonly ext?: string | null | undefined;
  readonly fileName?: string;
  readonly isClean?: boolean;
  readonly serverParams?: { url: string; original_filename: string };
};

type PendingImage = {
  readonly ext: string | null | undefined;
  readonly id: number;
  readonly fileName: string;
};

type ImageUploadGroupProps = BaseProps & {
  readonly maxSizeMB: number;
  readonly maxImages: number;
  readonly minDimensions?: [number, number];
  readonly imageWidth?: number;
  readonly images?: ReadonlyArray<ImageInfo>;
  readonly onImagesChanged: (images: ReadonlyArray<ImageInfo>) => unknown;
  readonly allowReorder?: boolean;
  readonly cleanImageEnabled?: boolean;
};

const ImageUploadGroup = (props: ImageUploadGroupProps) => {
  const {
    className,
    style,
    maxSizeMB,
    minDimensions,
    maxImages,
    images = [],
    allowReorder,
    cleanImageEnabled = true,
    onImagesChanged,
    "data-cy": dataCy,
  } = props;
  const styles = useStylesheet(props);
  const toastStore = useToastStore();

  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | undefined>();
  const [pendingImages, setPendingImages] = useState<
    ReadonlyArray<PendingImage>
  >([]);

  const accepts = ".jpeg,.jpg,.png";
  const imageCount = pendingImages.length + images.length;
  const showImages = imageCount > 0;
  const showDropZone = maxImages !== imageCount;

  const cleanImageLink = zendeskURL("360033668153");

  const removePendingImage = (pendingImage: PendingImage) => {
    setPendingImages(pendingImages.filter((img) => img.id !== pendingImage.id));
  };

  const onImageRejected = () => {
    const formats = accepts.replace(",", ", ").replace(".", "");
    toastStore.error(
      i`Image file is not valid. Please upload a ${formats} file ` +
        i`less than ${maxSizeMB}MB`,
    );
  };

  const renderDropzoneContent = ({ isDragActive }: DropzoneRenderArgs) => {
    return (
      <Layout.FlexColumn
        style={[styles.dropzoneContent, { opacity: isDragActive ? 0.3 : 1 }]}
        alignItems="center"
      >
        <Text style={styles.title}>Drop images here to upload</Text>
        <Button>
          <Layout.FlexRow alignItems="center">
            <Icon
              className={css(styles.uploadIcon)}
              name="uploadCloud"
              size={16}
            />
            <Text>Upload new</Text>
          </Layout.FlexRow>
        </Button>
      </Layout.FlexColumn>
    );
  };

  const renderPendingImage = (image: PendingImage) => {
    return (
      <Layout.FlexColumn
        style={styles.cell}
        key={`pending_image_${image.fileName}`}
        alignItems="center"
        justifyContent="center"
      >
        <LoadingIndicator type="spinner" size={36} />
        <DeleteButton
          style={[styles.deleteButton, styles.disableRipple]}
          popoverContent={i`Remove`}
          onClick={() => removePendingImage(image)}
        />
      </Layout.FlexColumn>
    );
  };

  const renderImage = (image: ImageInfo) => {
    const isHovered = hoveredImageUrl == image.url;
    return (
      <Layout.FlexColumn>
        <Layout.FlexRow
          style={styles.cell}
          alignItems="center"
          justifyContent="center"
          onMouseEnter={() => setHoveredImageUrl(image.url)}
          onMouseLeave={() => setHoveredImageUrl(undefined)}
          key={image.url}
          data-cy={`${dataCy}-cell`}
        >
          <Image
            src={image.url}
            alt={image.fileName || i`uploaded product image`}
            className={css(styles.previewImage)}
            draggable={false}
          />
          <DeleteButton
            style={[
              styles.deleteButton,
              styles.disableRipple,
              styles.hoverable,
              isHovered && styles.hovered,
            ]}
            onClick={() => {
              const newImages = images.filter((img) => img.url != image.url);
              onImagesChanged(newImages);
            }}
            data-cy={
              image.fileName
                ? `${dataCy}-button-delete-${image.fileName}`
                : `${dataCy}-button-delete`
            }
          />
        </Layout.FlexRow>
        {cleanImageEnabled && (
          <Layout.FlexRow alignItems="center">
            <RadioGroup
              itemStyle={{ margin: 0 }}
              selectedValue={image.isClean ? image.url : undefined}
              onSelected={() => {
                const newImages = images.map((img) => ({
                  ...img,
                  isClean: img.url === image.url,
                }));
                onImagesChanged(newImages);
              }}
            >
              <RadioGroup.Item
                value={image.url}
                text={() => (
                  <Text style={styles.cleanImageText}>Clean image</Text>
                )}
                data-cy={
                  image.fileName
                    ? `${dataCy}-radio-clean-image-${image.fileName}`
                    : `${dataCy}-radio-clean-image`
                }
              />
            </RadioGroup>
            <Info
              text={() => (
                <Layout.FlexColumn style={styles.cleanImageInfo}>
                  <Text>
                    Wish products with high-quality clean images selected have
                    the opportunity to receive increased sales and impressions.
                  </Text>
                  <Text weight="semibold">A clean image features:</Text>
                  <Ul style={styles.cleanImageInfoUl}>
                    <Ul.Li>
                      <Text>light-colored background</Text>
                    </Ul.Li>
                    <Ul.Li>
                      <Text>clearly-presented item being sold</Text>
                    </Ul.Li>
                    <Ul.Li>
                      <Text>no superimposed text or logo</Text>
                    </Ul.Li>
                    <Ul.Li>
                      <Text>and more</Text>
                    </Ul.Li>
                  </Ul>
                  <Link href={cleanImageLink} openInNewTab>
                    See the full list of standards and examples
                  </Link>
                </Layout.FlexColumn>
              )}
            />
          </Layout.FlexRow>
        )}
      </Layout.FlexColumn>
    );
  };

  const onUploadImage = async (acceptedFiles: ReadonlyArray<File>) => {
    const totalNumFiles = imageCount + acceptedFiles.length;
    if (totalNumFiles > maxImages) {
      toastStore.negative(i`Too many files attached. Maximum is ${maxImages}`);
      return;
    }

    let newPendingImages = pendingImages;
    let newImages = [...images];
    for (const file of acceptedFiles) {
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (minDimensions) {
        const [minImageWidth, minImageHeight] = minDimensions;
        const [width, height] = await getImageSize(file);
        if (width < minImageWidth || height < minImageHeight) {
          toastStore.negative(
            i`Image resolution too low. Minimum is ${minImageWidth}x${minImageHeight}`,
          );
          return;
        }
      }

      const pendingImage: PendingImage = {
        ext,
        id: new Date().getTime(),
        fileName: file.name,
      };

      newPendingImages = [...newPendingImages, pendingImage];
      setPendingImages(newPendingImages);

      const response = await upload(file, {
        bucket: "TEMP_UPLOADS_V2",
        filename: file.name,
        contentType: file.type,
      });
      const downloadUrl = response?.downloadUrl;
      if (downloadUrl == null) {
        newPendingImages = newPendingImages.filter(
          (i) => i.id !== pendingImage.id,
        );
        removePendingImage(pendingImage);
        return;
      }

      const stillWantImage = newPendingImages.some(
        (pi) => pi.id === pendingImage.id,
      );
      if (!stillWantImage) {
        return;
      }

      runInAction(() => {
        newImages = [
          ...newImages,
          {
            ext,
            url: downloadUrl || "",
            fileName: file.name,
            isClean: false,
            serverParams: {
              url: downloadUrl || "",
              original_filename: file.name,
            },
          },
        ];
        onImagesChanged(newImages);

        newPendingImages = newPendingImages.filter(
          (i) => i.id !== pendingImage.id,
        );
        removePendingImage(pendingImage);
      });
    }
  };

  const onReorder = (from: number, to: number) => {
    if (from == to || images.length == 0 || from >= images.length) {
      return;
    }
    const newOrder = [...images];
    newOrder.splice(to, 0, images[from]);
    newOrder.splice(from + (from > to ? 1 : 0), 1);
    onImagesChanged(newOrder);
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      {showImages && allowReorder && (
        <DraggableList style={css(styles.previews)} onReorder={onReorder}>
          {[
            ...images.map((img) => (
              <DraggableList.Item
                key={img.url}
                containerStyle={styles.imagePreviewContainer}
              >
                {renderImage(img)}
              </DraggableList.Item>
            )),
            ...pendingImages.map((img) => (
              <DraggableList.Item
                key={`${img.id}`}
                style={styles.pendingContainer}
                containerStyle={styles.imagePreviewContainer}
              >
                {renderPendingImage(img)}
              </DraggableList.Item>
            )),
          ]}
        </DraggableList>
      )}
      {showImages && !allowReorder && images.map((img) => renderImage(img))}
      {showImages &&
        !allowReorder &&
        pendingImages.map((img) => renderPendingImage(img))}
      {showDropZone && (
        <Dropzone
          accept={accepts}
          onDropRejected={onImageRejected}
          onDropAccepted={(acceptedFiles) => void onUploadImage(acceptedFiles)}
          maxSize={maxSizeMB * 1048576} // convert to bytes
          multiple={imageCount < maxImages - 1}
          className={css(styles.dropzone)}
          data-cy={`${dataCy}-upload`}
        >
          {renderDropzoneContent}
        </Dropzone>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(ImageUploadGroup);

const useStylesheet = (props: ImageUploadGroupProps) => {
  const { imageWidth } = props;
  const { surfaceLight, surfaceLightest, textDark, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        previews: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "stretch",
          marginBottom: 8,
        },
        dropzone: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          margin: "8px 8px 0px 8px",
          padding: 43,
          borderRadius: 4,
          backgroundColor: surfaceLight,
          border: `solid 1px ${borderPrimary}`,
        },
        dropzoneContent: {
          transition: "opacity 0.3s linear",
        },
        title: {
          fontSize: 16,
          color: textDark,
          userSelect: "none",
          marginBottom: 8,
        },
        uploadIcon: {
          marginRight: 8,
        },
        imagePreviewContainer: {
          padding: 8,
        },
        cell: {
          position: "relative",
          border: `solid 1px ${borderPrimary}`,
          borderRadius: 4,
          backgroundColor: surfaceLightest,
          height: imageWidth != null ? imageWidth : 150,
          width: imageWidth != null ? imageWidth : 150,
          marginBottom: 8,
        },
        hoverable: {
          opacity: 0,
          transition: "opacity 0.3s linear",
        },
        hovered: {
          opacity: 1,
        },
        cleanImageText: {
          fontSize: 14,
          color: textDark,
          marginRight: 4,
        },
        cleanImageInfo: {
          padding: 16,
        },
        cleanImageInfoUl: {
          marginLeft: 16,
          marginBottom: 8,
        },
        deleteButton: {
          position: "absolute",
          top: 8,
          right: 8,
          ":nth-child(1n) > div": {
            ":after": {
              content: "none",
            },
          },
        },
        pendingContainer: {
          cursor: "default",
        },
        disableRipple: {
          // ripple ink uses an :after that causes an inaccurate drag preview
          ":nth-child(1n) > div": {
            ":after": {
              content: "none",
            },
          },
        },
        previewImage: {
          maxHeight: "100%",
          maxWidth: "100%",
          borderRadius: 2,
        },
      }),
    [imageWidth, surfaceLight, surfaceLightest, textDark, borderPrimary],
  );
};
