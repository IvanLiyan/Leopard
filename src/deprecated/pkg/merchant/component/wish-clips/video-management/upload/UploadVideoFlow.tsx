import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Layout,
  SecondaryButton,
  PrimaryButton,
  AttachmentInfo,
  FileUploadOptions,
  FileUploadResponse,
  FileInput,
  FileInputProps,
  H7,
  Text,
} from "@ContextLogic/lego";

/* Merchant Components */
import LinkProductTable from "@merchant/component/wish-clips/video-management/LinkProductTable";
import Icon from "@merchant/component/core/Icon";

/* Relative Impots */
import VideoInformation from "./VideoInformation";
import ProgressBar from "./ProgressBar";
import UploadSuccess from "./UploadSuccess";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ACCEPTED_FORMATS,
  MAX_SIZE_MB,
} from "@toolkit/wish-clips/video-management";
import { ClientWritableBucket } from "@schema/types";
import { upload } from "@toolkit/uploads";
import { useTimer } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";

/* Model */
import VideoCatalogState from "@merchant/model/products/VideoCatalogState";

const STEPS = ["UPLOAD_VIDEO", "VIDEO_DETAILS", "LINK_PRODUCT", "COMPLETE"];
const AVERAGE_LOAD_TIME = 10000;

// Pulled from @merchant/component/core/SecureFileInput.tsx
// Needed this to control the upload flow UI during the uploading process
type VideoFileInputProps = Omit<FileInputProps, "bucket"> & {
  readonly bucket: ClientWritableBucket;
  readonly state: VideoCatalogState;
};

const VideoFileInput: React.FC<VideoFileInputProps> = (
  props: VideoFileInputProps
) => {
  const { state, ...restOfProps } = props;

  return <FileInput {...restOfProps} />;
};

type Props = BaseProps & {
  readonly state: VideoCatalogState;
  readonly onClose: () => void;
};

const UploadVideoFlow = (props: Props) => {
  const { className, style, state, onClose } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const { surfaceDarker } = useTheme();

  const [stepCount, setStepCount] = useState(0);
  const [loadTime, setLoadTime] = useState(AVERAGE_LOAD_TIME);

  const [attachments, setAttachments] = useState<ReadonlyArray<AttachmentInfo>>(
    []
  );

  const [timeLeft, resetTimeLeft] = useTimer({
    periodMs: loadTime,
    intervalMs: 500,
    startNow: false,
  });

  const videoDone = !state.videoUploading && state.videoUrl !== null;
  const progress = videoDone ? 1 : (loadTime - timeLeft) / loadTime;

  // Pulled from @merchant/component/core/SecureFileInput.tsx
  // Needed this to control the upload flow UI during the uploading process
  const onUpload = async (
    file: File,
    options: FileUploadOptions
  ): Promise<FileUploadResponse | undefined> => {
    setTimeout(() => {
      state.videoUploading = true;
      setStepCount(stepCount + 1);
      // Scale the loading bar progress speed based on the file size
      setLoadTime(
        Math.round(AVERAGE_LOAD_TIME * (file.size / 1000000 / MAX_SIZE_MB))
      );
      resetTimeLeft();
    }, 500);

    const response = await upload(file, {
      ...options,
      bucket: options.bucket as ClientWritableBucket,
    });
    const downloadUrl = response?.downloadUrl;
    state.videoUploading = false;
    if (downloadUrl == null) {
      return;
    }
    return {
      downloadUrl,
    };
  };

  const step = STEPS[stepCount];

  const getStepComponent = () => {
    if (step === "UPLOAD_VIDEO") {
      return (
        <VideoFileInput
          state={state}
          bucket="TEMP_UPLOADS_V2"
          prompt={() => (
            <Layout.FlexColumn alignItems="center">
              <Icon
                name="uploadCloud"
                color={surfaceDarker}
                style={styles.iconUpload}
                size={24}
              />
              <H7>Drag or select a video file to upload</H7>
              <Text>.mp4, .mov, .wmv, .flv, .avi, .mkv, .webm</Text>
              <Text>Less than 30 seconds and 50MB</Text>
            </Layout.FlexColumn>
          )}
          accepts={ACCEPTED_FORMATS.join(",")}
          onAttachmentsChanged={(attachments) => {
            setAttachments(attachments);
            state.videoUrl = attachments[0].url;
            state.videoFileName = attachments[0].fileName;
          }}
          attachments={attachments}
          maxSizeMB={MAX_SIZE_MB}
          maxAttachments={1}
          onUpload={onUpload}
          hideFilename
          hideAttachments
          style={styles.upload}
        />
      );
    } else if (step === "VIDEO_DETAILS") {
      return <VideoInformation state={state} />;
    } else if (step === "LINK_PRODUCT") {
      return <LinkProductTable state={state} />;
    } else if (step === "COMPLETE") {
      return <UploadSuccess />;
    }
    return null;
  };

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexColumn style={styles.content}>
        {getStepComponent()}
      </Layout.FlexColumn>
      {step !== "UPLOAD_VIDEO" && step !== "COMPLETE" && (
        <ProgressBar
          style={styles.footer}
          progress={state.videoUploading ? Math.min(progress, 0.99) : progress}
          onBackProps={
            stepCount > 1
              ? {
                  text: i`Back`,
                  onClick: () => setStepCount(stepCount - 1),
                }
              : null
          }
          onNextProps={
            step === "LINK_PRODUCT"
              ? {
                  text: i`Next`,
                  onClick: async () => {
                    const success = await state.upsertVideo();
                    if (success) setStepCount(stepCount + 1);
                  },
                  isDisabled: !state.canSubmit || state.isSubmitting,
                }
              : {
                  text: i`Next`,
                  onClick: () => setStepCount(stepCount + 1),
                  isDisabled:
                    step === "VIDEO_DETAILS" ? !state.videoDetailsFilled : true,
                }
          }
        />
      )}
      {step === "COMPLETE" && (
        <Layout.FlexRow justifyContent="flex-end" style={styles.footer}>
          <Layout.FlexRow>
            <SecondaryButton
              onClick={() => onClose()}
              style={styles.close}
              padding="5px 12px"
            >
              Close
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                onClose();
                navigationStore.navigate("/videos/management-hub");
              }}
            >
              My Videos
            </PrimaryButton>
          </Layout.FlexRow>
        </Layout.FlexRow>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { borderPrimary, surface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          overflow: "hidden",
          maxHeight: 670,
        },
        content: {
          padding: 24,
          height: "100%",
          overflowY: "auto",
        },
        upload: {
          flexGrow: 1,
          height: 500,
        },
        confirmation: {
          padding: "24px 0px",
        },
        footer: {
          borderTop: `1px ${borderPrimary} solid`,
          padding: 24,
        },
        close: {
          marginRight: 8,
        },
        iconUpload: {
          backgroundColor: surface,
          padding: 16,
          borderRadius: "50%",
          marginBottom: 16,
        },
      }),
    [borderPrimary, surface]
  );
};

export default observer(UploadVideoFlow);
