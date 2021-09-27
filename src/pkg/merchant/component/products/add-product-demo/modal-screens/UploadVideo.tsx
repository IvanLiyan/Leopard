// Inline import required for worker-loader
/* eslint-disable import/no-webpack-loader-syntax */
import React, { useMemo, useRef, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Legacy */
import { uploadToS3 } from "@legacy/core/s3";

import { zendeskURL } from "@toolkit/url";

/* Lego Components */
import {
  Alert,
  Markdown,
  TextInput,
  ProgressBar,
  AttachmentInfo,
  OnTextChangeEvent,
} from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { SecureFileInput } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";

import { weightSemibold } from "@toolkit/fonts";

import VideoCropper from "./VideoCropper";
import ProductImage from "@merchant/component/products/ProductImage";

import {
  ProductCatalogMutationsUpsertProductArgs,
  ProductUpsertInput,
} from "@schema/types";
import { useApolloStore } from "@merchant/stores/ApolloStore";

import {
  MAX_SIZE_MB,
  MAX_VIDEO_LENGTH,
  ACCEPTED_FORMATS,
  PickedProductType,
  VideoAssetURLValidator,
  ADD_DEMO_VIDEO_TO_PRODUCT,
  PickedUpsertProductResponseType,
} from "@toolkit/products/demo-video";

import { CropProperties } from "@toolkit/ffmpeg";

// inline webpack worker doesn't recognize absolute import
// eslint-disable-next-line local-rules/no-complex-relative-imports
import CropWorker from "worker-loader!../../../../../workers/crop-worker.ts";

const CROP_PROGRESS_MAX_PERC = 0.8;
const UPLOAD_PROGRESS_MAX_PERC = 0.9;

type ResponseType = {
  readonly productCatalog: {
    readonly upsertProduct: PickedUpsertProductResponseType;
  };
};

type Props = BaseProps & {
  readonly product: PickedProductType;
  readonly onClickBack: () => unknown;
  readonly onClose: () => Promise<unknown>;
};

const UploadVideo: React.FC<Props> = (props: Props) => {
  const { className, style, product, onClickBack, onClose } = props;
  const { client } = useApolloStore();

  const { demoVideo } = product;
  const initialAttachments = useMemo(() => {
    return demoVideo
      ? [
          {
            url: demoVideo.source.url,
          },
        ]
      : [];
  }, [demoVideo]);

  const [attachments, setAttachments] =
    useState<ReadonlyArray<Partial<AttachmentInfo>>>(initialAttachments);
  const [urlInput, setUrlInput] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [urlInputIsValid, setUrlInputIsValid] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<
    number | undefined
  >();
  const [processingStatusMessage, setProcessingStatusMessage] = useState<
    string | undefined
  >();

  // Use ref since cropDimensions changing should not cause a re-render
  const cropDimensions = useRef<CropProperties | null>(null);

  // Don't disable save if isUpdate so merchant can delete their video
  const isUpdate = demoVideo != null;
  const hasSaveableAttachment =
    attachments.length > 0 && attachments[0].url != demoVideo?.source.url;
  const hasSaveableUrlInput =
    urlInput != null && urlInput.trim().length > 0 && urlInputIsValid;
  const canSave = hasSaveableUrlInput || hasSaveableAttachment;
  const disableFileInput =
    isSaving || (urlInput != null && urlInput.trim().length > 0);
  const disableVideoUrlInput = isSaving || attachments.length > 0;

  const isCropping = attachments.length > 0 && attachments[0].file != null;
  const styles = useStylesheet({ isCropping });

  const { primary, surfaceLight, negativeLighter } = useTheme();

  const toastStore = useToastStore();

  const renderFileContent = () => {
    if (isCropping && attachments[0].file != null) {
      return (
        <VideoCropper
          video={attachments[0].file}
          onDeleteVideo={() => setAttachments([])}
          onChangeCrop={(dimensions) => {
            cropDimensions.current = dimensions;
          }}
          maxVideoLength={MAX_VIDEO_LENGTH}
          onRejectVideoLength={() => {
            setHasVideoError(true);
            setAttachments([]);
          }}
          disabled={isSaving}
        />
      );
    }

    const acceptedFormatsCsv = ACCEPTED_FORMATS.map((fmt) => `.${fmt}`).join(
      ",",
    );

    return (
      <>
        <SecureFileInput
          className={css(styles.fileInput)}
          accepts={acceptedFormatsCsv}
          maxSizeMB={MAX_SIZE_MB}
          attachments={attachments}
          onAttachmentsChanged={(attachments) => {
            setHasVideoError(false);
            setAttachments(attachments);
          }}
          prompt={
            isUpdate
              ? i`Drop a video here to replace the current video`
              : i`Drop a video here to upload`
          }
          disabled={disableFileInput}
          backgroundColor={hasVideoError ? negativeLighter : undefined}
          attachmentListLabel={i`Current Video`}
          bucket="RACC_SOURCE_ASSETS"
        />
        {hasVideoError && (
          <div className={css(styles.error)}>
            Video must be {MAX_VIDEO_LENGTH} seconds or less.
          </div>
        )}
      </>
    );
  };

  const submitVideoUrl = async (videoUrl: string) => {
    const input: ProductUpsertInput = {
      id: product.id,
      demoVideoSourceUrl: videoUrl.trim(),
    };

    const { data } = await client.mutate<
      ResponseType,
      ProductCatalogMutationsUpsertProductArgs
    >({
      mutation: ADD_DEMO_VIDEO_TO_PRODUCT,
      variables: { input },
    });

    const ok = data?.productCatalog?.upsertProduct?.ok || false;
    const message = data?.productCatalog?.upsertProduct?.message;
    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    await onClose();
    toastStore.positive(i`Your video has been added to **${product.name}**`);
  };

  const runCropping = (
    cropDimensions: CropProperties,
  ): Promise<string | undefined> => {
    return new Promise((accept, reject) => {
      const cropWorker = new CropWorker();
      setProcessingProgress(0);
      setProcessingStatusMessage(i`Cropping your video`);

      cropWorker.postMessage({
        type: "start",
        message: {
          file: attachments[0].file,
          dimensions: cropDimensions,
        },
      });
      cropWorker.onmessage = (event: any) => {
        if (event.data.type === "progress") {
          setProcessingProgress(event.data.message * CROP_PROGRESS_MAX_PERC);
        } else if (event.data.type === "done") {
          setProcessingProgress(CROP_PROGRESS_MAX_PERC);

          const cropBlob: any = event.data.message;
          cropBlob.lastModifiedDate = new Date();
          cropBlob.name = attachments[0].fileName;
          const cropFile = cropBlob as File;
          setProcessingStatusMessage(i`Uploading your video`);

          const onUploadSuccess = async (resp: {
            data: { image_url: string };
          }) => {
            setProcessingProgress(UPLOAD_PROGRESS_MAX_PERC);
            accept(resp.data.image_url);
          };

          const onUploadFailure = (resp: { msg: string }) => {
            toastStore.negative(i`Could not upload your video`);
            accept(undefined);
          };

          uploadToS3(
            null,
            onUploadSuccess,
            onUploadFailure,
            attachments[0].ext,
            true,
            cropFile,
            MAX_SIZE_MB * 1048576,
            null,
          );

          return;
        }
      };
    });
  };
  const submit = async () => {
    setIsSaving(true);
    if (urlInput != null && urlInput.trim().length > 0) {
      await submitVideoUrl(urlInput);
      return;
    }

    let videoUrl: string | undefined = undefined;
    const { current: cropDimen } = cropDimensions;
    if (cropDimen != null) {
      videoUrl = await runCropping(cropDimen);
    } else {
      videoUrl = attachments[0].url;
    }

    if (videoUrl == null) {
      setIsSaving(false);
      return;
    }

    setProcessingStatusMessage(i`Adding video to your product`);
    await submitVideoUrl(videoUrl);
  };

  const videoContentPolicyLink = zendeskURL("360056604494");

  return (
    <div className={css(styles.root, className, style)}>
      {isUpdate && (
        <Alert
          className={css(styles.updateWarning)}
          text={
            i`You can only add 1 video per product. ` +
            i`Please remove the current video before adding a new one.`
          }
          sentiment="warning"
        />
      )}
      <div className={css(styles.content)}>
        <div className={css(styles.leftContent)}>{renderFileContent()}</div>
        <div className={css(styles.rightContent)}>
          <div className={css(styles.productInfo)}>
            <ProductImage
              className={css(styles.productImage)}
              productId={product.id}
            />
            <div className={css(styles.productTitle, styles.fontSmall)}>
              {product.name}
            </div>
            <div className={css(styles.productId, styles.fontSmall)}>
              PID: {product.id}
            </div>
          </div>
          <Markdown
            className={css(styles.description, styles.font)}
            text={
              i`Tell your product’s story through a demo-style video. The ` +
              i`video will be soundless, so focus on bringing the product to ` +
              i`life! For best results, make sure your video has following ` +
              i`attributes and complies with our content rules. ` +
              i`[View video content policy](${videoContentPolicyLink})`
            }
            openLinksInNewTab
          />
          <div className={css(styles.bullets, styles.font)}>
            <div className={css(styles.font)}>
              • {9}:{16} vertical aspect ratio for portrait view
            </div>
            <div className={css(styles.font)}>
              • {MAX_VIDEO_LENGTH} seconds or less
            </div>
            <div className={css(styles.font)}>
              • High resolution. Minimum resolution of {480}p
            </div>
            <div className={css(styles.font)}>
              • Abundant lighting, so users can clearly see your product.
            </div>
            <div className={css(styles.font)}>• Demo-style content</div>
          </div>
          <div className={css(styles.videoUrlDescription, styles.font)}>
            You can use the upload tool on the left or link your video below.
          </div>
          <div className={css(styles.videoURLHeader)}>Video URL</div>
          <TextInput
            disabled={disableVideoUrlInput}
            placeholder={i`Enter the video URL`}
            value={urlInput}
            onChange={(event: OnTextChangeEvent) => setUrlInput(event.text)}
            validators={[new VideoAssetURLValidator()]}
            onValidityChanged={(isValid) => setUrlInputIsValid(isValid)}
            debugValue="http://luckyretail.com/Uploadfile/vedio/202010221/30s/157428/157428.mp4"
          />
        </div>
      </div>
      <div className={css(styles.footer)}>
        <Button onClick={onClickBack}>Back</Button>
        <div className={css(styles.processingProgressContainer)}>
          {processingProgress != null && (
            <ProgressBar
              progress={processingProgress}
              color={primary}
              backgroundColor={surfaceLight}
              minWidth={240}
              transitionDurationMs={800}
            />
          )}
          {processingStatusMessage && (
            <div className={css(styles.processingProgressDescription)}>
              {processingStatusMessage}
            </div>
          )}
        </div>
        <PrimaryButton
          isLoading={isSaving}
          isDisabled={!canSave}
          onClick={submit}
        >
          Save
        </PrimaryButton>
      </div>
    </div>
  );
};

export default UploadVideo;

const useStylesheet = ({ isCropping }: { isCropping: boolean }) => {
  const { textDark, textLight, negativeDark, borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          maxHeight: 628,
        },
        updateWarning: {
          margin: "24px 48px 0px 48px",
        },
        content: {
          display: "flex",
          margin: "24px 48px",
          overflowY: "scroll",
        },
        font: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        fontSmall: {
          fontSize: 14,
          lineHeight: "20px",
          color: textLight,
        },
        error: {
          fontSize: 12,
          lineHeight: "16px",
          color: negativeDark,
        },
        leftContent: {
          ...(isCropping
            ? {
                display: "flex",
                alignItems: "center",
                maxHeight: 499,
                maxWidth: 280,
              }
            : {
                display: "flex",
                flexDirection: "column",
                maxWidth: 225,
                minWidth: 187,
              }),
        },
        rightContent: {
          display: "flex",
          flexDirection: "column",
          marginLeft: 24,
        },
        fileInput: {
          height: "100%",
        },
        productInfo: {
          display: "grid",
          gap: "8px 12px",
          marginBottom: 32,
          gridTemplateColumns: 80,
        },
        productImage: {
          gridColumn: 1,
          gridRow: "1 / 3",
          maxHeight: 80,
        },
        productTitle: {
          gridColumn: 2,
          fontWeight: weightSemibold,
        },
        productId: {
          gridColumn: 2,
        },
        description: {
          marginBottom: 8,
        },
        bullets: {
          display: "flex",
          flexDirection: "column",
          marginBottom: 24,
        },
        videoUrlDescription: {
          fontWeight: weightSemibold,
          marginBottom: 16,
        },
        videoURLHeader: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          marginBottom: 4,
        },
        footer: {
          display: "flex",
          justifyContent: "space-between",
          padding: 24,
          borderTop: `1px solid ${borderPrimaryDark}`,
        },
        processingProgressContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        processingProgressDescription: {
          fontSize: 12,
          lineHeight: "16px",
          color: textLight,
          marginTop: 4,
        },
      }),
    [textDark, textLight, negativeDark, borderPrimaryDark, isCropping],
  );
};
