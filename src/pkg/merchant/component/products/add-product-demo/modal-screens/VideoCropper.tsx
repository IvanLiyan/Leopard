import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { clamp } from "lodash";
import { withResizeDetector } from "react-resize-detector";

/* Lego Components */
import { DeleteButton, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@stores/ThemeStore";
import { CropProperties } from "@toolkit/ffmpeg";

type Props = BaseProps & {
  readonly height: number; // provided by withResizeDetector
  readonly width: number; // provided by withResizeDetector
} & {
  readonly video: File;
  readonly onDeleteVideo: () => unknown;
  readonly onChangeCrop: (crop: CropProperties | null) => unknown; // sends null if video is already 9:16
  readonly maxVideoLength: number;
  readonly onRejectVideoLength: () => unknown;
  readonly disabled?: boolean;
};

type Dimensions = {
  readonly videoWidth: number;
  readonly videoHeight: number;
};

const TARGET_ASPECT_RATIO = {
  width: 9,
  height: 16,
};

const VideoCropper: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    video,
    width,
    onDeleteVideo,
    onChangeCrop,
    maxVideoLength,
    onRejectVideoLength,
    disabled,
  } = props;

  // Tracking left panel width since its value is equal to the x to crop at
  const [leftPanelWidth, setLeftPanelWidth] = useState<number | null>(null);

  // Track dragging by difference from initial position of cursor and panel
  const [dragInitialX, setDragInitialX] = useState<number | null>(null);
  const [leftPanelInitialWidth, setLeftPanelInitialWidth] = useState<
    number | null
  >(null);

  const [videoDimensions, setVideoDimensions] = useState<Dimensions | null>(
    null,
  );

  const isDragging = dragInitialX != null;

  // Takes a video dimension width and produces video element width
  const dimensionWidthToElementWidth = useCallback(
    (dimensionWidth: number): number => {
      if (videoDimensions == null || width == 0) {
        return 0;
      }
      return (dimensionWidth / videoDimensions.videoWidth) * width;
    },
    [width, videoDimensions],
  );

  // Compute viewportWidth in video dimensions
  const viewportWidth = useMemo((): number => {
    if (videoDimensions == null) {
      return 0;
    }

    return (
      (videoDimensions.videoHeight / TARGET_ASPECT_RATIO.height) *
      TARGET_ASPECT_RATIO.width
    );
  }, [videoDimensions]);

  // Compute maxLeftPanelWidth in video dimensions
  const maxLeftPanelWidth = useMemo((): number => {
    if (videoDimensions == null || viewportWidth == null) {
      return 0;
    }

    return videoDimensions.videoWidth - viewportWidth;
  }, [videoDimensions, viewportWidth]);

  // const needsCropping: boolean = useMemo(() => {
  //   if (videoDimensions == null || videoDimensions.videoWidth == 0) {
  //     return false;
  //   }
  //   return (
  //     videoDimensions.videoHeight / videoDimensions.videoWidth !=
  //     TARGET_ASPECT_RATIO.height / TARGET_ASPECT_RATIO.width
  //   );
  // }, [videoDimensions]);
  // Disable cropping for initial release. We're struggling with web worker
  // issues.
  const needsCropping = false;

  const defaultLeftPanelWidth = useCallback((): number => {
    if (viewportWidth == null || videoDimensions == null) {
      return 0;
    }
    return (videoDimensions.videoWidth - viewportWidth) / 2;
  }, [videoDimensions, viewportWidth]);

  // Centers the viewport when video dimensions load
  useEffect(() => {
    if (videoDimensions == null || !needsCropping || leftPanelWidth != null) {
      return;
    }
    const defaultWidth = defaultLeftPanelWidth();
    setLeftPanelWidth(defaultWidth);
    onChangeCrop({
      position: {
        x: defaultWidth,
        y: 0,
      },
      size: {
        width: viewportWidth,
        height: videoDimensions.videoHeight,
      },
    });
  }, [
    leftPanelWidth,
    videoDimensions,
    viewportWidth,
    needsCropping,
    defaultLeftPanelWidth,
    onChangeCrop,
  ]);

  // Handles initial mouse click on crop overlay (viewport)
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    // Freeze these two coords in state so we can change them via diffs on drag
    if (!disabled) {
      setDragInitialX(event.clientX);
      setLeftPanelInitialWidth(leftPanelWidth);
    }
  };

  // Handles drag movement and sets left panel width
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (
        dragInitialX == null ||
        leftPanelInitialWidth == null ||
        videoDimensions == null ||
        viewportWidth == null
      ) {
        return;
      }
      const dragDiff = event.clientX - dragInitialX;
      // Convert user's drag to be in the units of the video dimension
      const dimensionDragDiff = (dragDiff / width) * videoDimensions.videoWidth;
      setLeftPanelWidth(
        clamp(leftPanelInitialWidth + dimensionDragDiff, 0, maxLeftPanelWidth),
      );
    };

    const handleMouseUp = () => {
      setDragInitialX(null);
      setLeftPanelInitialWidth(null);

      if (
        leftPanelWidth != null &&
        viewportWidth != null &&
        videoDimensions != null
      ) {
        onChangeCrop({
          position: {
            x: leftPanelWidth,
            y: 0,
          },
          size: {
            width: viewportWidth,
            height: videoDimensions.videoHeight,
          },
        });
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    width,
    videoDimensions,
    viewportWidth,
    maxLeftPanelWidth,
    isDragging,
    dragInitialX,
    leftPanelInitialWidth,
    leftPanelWidth,
    onChangeCrop,
    setLeftPanelWidth,
    setDragInitialX,
    setLeftPanelInitialWidth,
  ]);

  // Convert dimension measures to pixel measures for display
  const styles = useStylesheet({
    viewportWidth: dimensionWidthToElementWidth(viewportWidth),
    leftPanelWidth: leftPanelWidth
      ? dimensionWidthToElementWidth(leftPanelWidth)
      : 0,
    isDragging,
    disabled,
  });

  const videoPath = URL.createObjectURL(video);

  const handleLoadedMetadata = (
    data: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const { videoWidth, videoHeight, duration } =
      data.target as HTMLVideoElement;
    if (Math.floor(duration) > maxVideoLength) {
      onRejectVideoLength();
    }
    setVideoDimensions({
      videoWidth,
      videoHeight,
    });
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.videoContainer, className, style)}>
        {needsCropping && (
          <div
            className={css(styles.cropOverlay)}
            onMouseDown={handleMouseDown}
          >
            <div className={css(styles.leftPanel)} />
            <div className={css(styles.rightPanel)} />
          </div>
        )}
        <div className={css(styles.buttonsContainer)}>
          <DeleteButton
            className={css(styles.deleteButton)}
            onClick={onDeleteVideo}
          />
        </div>
        <video
          autoPlay
          loop
          muted
          className={css(styles.video)}
          onLoadedMetadata={handleLoadedMetadata}
        >
          <source src={videoPath} />
        </video>
      </div>
      {needsCropping && (
        <Markdown
          className={css(styles.error)}
          text={
            i`Video must be ` +
            i`${TARGET_ASPECT_RATIO.width}:${TARGET_ASPECT_RATIO.height}. ` +
            i`Drag the viewport right or left to crop your video and save as ` +
            i`${TARGET_ASPECT_RATIO.width}:${TARGET_ASPECT_RATIO.height}.`
          }
        />
      )}
    </div>
  );
};

export default withResizeDetector(VideoCropper);

const useStylesheet = ({
  viewportWidth,
  leftPanelWidth,
  isDragging,
  disabled,
}: {
  viewportWidth: number | null;
  leftPanelWidth: number | null;
  isDragging: boolean;
  disabled?: boolean;
}) => {
  const { negativeDark } = useTheme();

  let overlayCursor = isDragging ? "grabbing" : "grab";
  if (disabled) {
    overlayCursor = "not-allowed";
  }

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        },
        videoContainer: {
          display: "flex",
          position: "relative",
          flexDirection: "column",
        },
        video: {
          maxWidth: "100%",
          pointerEvents: "none", // Stops user from enabling controls or stopping loop
          flex: 1,
        },
        cropOverlay: {
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          cursor: overlayCursor,
        },
        leftPanel: {
          height: "100%",
          width: viewportWidth && leftPanelWidth != null ? leftPanelWidth : 0,
          backgroundColor: "black",
          opacity: 0.5,
        },
        rightPanel: {
          height: "100%",
          width:
            viewportWidth && leftPanelWidth != null
              ? `calc(100% - ${leftPanelWidth}px - ${viewportWidth}px)`
              : 0,
          backgroundColor: "black",
          opacity: 0.5,
        },
        buttonsContainer: {
          position: "absolute",
          zIndex: 2,
          width: "100%",
          bottom: 0,
          padding: "0 8px 8px 8px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "flex-end",
          pointerEvents: "none",
        },
        deleteButton: {
          pointerEvents: "all",
        },
        error: {
          marginTop: 8,
          fontSize: 14,
          lineHeight: "20px",
          color: negativeDark,
        },
      }),
    [viewportWidth, leftPanelWidth, overlayCursor, negativeDark],
  );
};
