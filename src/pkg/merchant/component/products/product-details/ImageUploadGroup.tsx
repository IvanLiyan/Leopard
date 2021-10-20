/*
 * ImageUploadGroup.tsx
 *
 * Created by Jonah Dlin on Thu Jul 15 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import Dropzone from "react-dropzone";

/* Legacy */
import { uploadToS3 } from "@legacy/core/s3";

/* Lego */
import {
  Button,
  DraggableList,
  Layout,
  Text,
  DeleteButton,
  LoadingIndicator,
  Label,
} from "@ContextLogic/lego";
import { getImageSize } from "@ContextLogic/lego/toolkit/image";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Stores */
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";
import { Icon } from "@merchant/component/core";

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
  } = props;
  const styles = useStylesheet(props);
  const toastStore = useToastStore();
  const { greenSurface } = useTheme();

  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | undefined>();
  const [pendingImages, setPendingImages] = useState<
    ReadonlyArray<PendingImage>
  >([]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, [setMounted]);

  const accepts = ".jpeg,.jpg,.png";

  const imageCount = pendingImages.length + images.length;

  const showImages = imageCount > 0;
  const showDropZone = maxImages !== imageCount;

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

  const renderDropzoneContent = ({ isDragActive }: any) => {
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
      <Layout.FlexRow
        style={styles.cell}
        alignItems="center"
        justifyContent="center"
        onMouseEnter={() => setHoveredImageUrl(image.url)}
        onMouseLeave={() => setHoveredImageUrl(undefined)}
        key={image.url}
      >
        <img
          src={image.url}
          alt={image.fileName}
          className={css(styles.previewImage)}
          draggable={false}
        />
        {cleanImageEnabled && image.isClean && (
          <Label
            style={styles.cleanImageLabel}
            textColor="white"
            fontSize={12}
            backgroundColor={greenSurface}
          >
            Clean image
          </Label>
        )}
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
        />
        {cleanImageEnabled && (
          <Layout.FlexRow
            className={css(
              styles.cleanImageButtonContainer,
              styles.hoverable,
              isHovered && styles.hovered,
            )}
          >
            <Button
              style={[styles.disableRipple, styles.cleanImageButton]}
              onClick={() => {
                const newImages = images.map((img) => ({
                  ...img,
                  isClean: img.url === image.url,
                }));
                onImagesChanged(newImages);
              }}
            >
              Mark as Clean Image
            </Button>
          </Layout.FlexRow>
        )}
      </Layout.FlexRow>
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

      // if you find this please fix the any types (legacy)
      const success = (resp: any) => {
        if (!mounted) {
          // We've no longer rendered.
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
              url: resp.data.image_url,
              fileName: file.name,
              isClean: false,
              serverParams: {
                url: resp.data.image_url,
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
      };

      // if you find this please fix the any types (legacy)
      const failure = (resp: any) => {
        if (!mounted) {
          // We've no longer rendered...
          // error doesn't matter.
          return;
        }

        newPendingImages = newPendingImages.filter(
          (i) => i.id !== pendingImage.id,
        );
        removePendingImage(pendingImage);

        toastStore.error(resp.msg);
      };

      uploadToS3(null, success, failure, ext, false, file);
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
              <DraggableList.Item key={img.url}>
                {renderImage(img)}
              </DraggableList.Item>
            )),
            ...pendingImages.map((img) => (
              <DraggableList.Item
                style={styles.pendingContainer}
                key={`${img.id}`}
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
          onDropAccepted={onUploadImage}
          maxSize={maxSizeMB * 1048576}
          multiple={imageCount < maxImages - 1}
          className={css(styles.dropzone)}
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
        cell: {
          position: "relative",
          border: `solid 1px ${borderPrimary}`,
          borderRadius: 4,
          backgroundColor: surfaceLightest,
          height: imageWidth != null ? imageWidth : 150,
          width: imageWidth != null ? imageWidth : 150,
          marginTop: 8,
          marginBottom: 8,
        },
        hoverable: {
          opacity: 0,
          transition: "opacity 0.3s linear",
        },
        hovered: {
          opacity: 1,
        },
        cleanImageLabel: {
          position: "absolute",
          top: 0,
          left: 0,
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
        cleanImageButtonContainer: {
          position: "absolute",
          bottom: 8,
          maxWidth: "calc(100% - 16px)",
        },
        cleanImageButton: {
          padding: 5,
          overflowWrap: "break-word",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          textAlign: "center",
          fontSize: 12,
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
