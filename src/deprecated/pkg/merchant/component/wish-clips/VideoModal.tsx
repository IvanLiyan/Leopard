import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Modal from "@merchant/component/core/modal/Modal";
import { css } from "@toolkit/styling";

type Props = BaseProps & { readonly videoURL: string };

const VideoModalContent: React.FC<Props> = ({ style, className, videoURL }) => {
  const styles = useStylesheet();

  return (
    <video
      className={css(style, className, styles.video)}
      muted
      autoPlay
      controls
    >
      <source src={videoURL} />
    </video>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        video: {
          width: "100%",
          maxHeight: "80vh",
          backgroundColor: "black", // exception to useTheme() for setting color: hardcoded to blackout video backgrounds
        },
      }),
    []
  );
};

export default class VideoModal extends Modal {
  videoUrl: string;
  style?: BaseProps["style"];
  className?: BaseProps["className"];

  constructor(props: {
    videoUrl: string;
    style?: BaseProps["style"];
    className?: BaseProps["className"];
  }) {
    super(() => null);
    const { videoUrl, style, className } = props;
    this.videoUrl = videoUrl;
    this.style = style;
    this.className = className;
    this.setNoMaxHeight(true);
  }

  renderContent() {
    return (
      <VideoModalContent
        videoURL={this.videoUrl}
        className={this.className}
        style={this.style}
      />
    );
  }
}
