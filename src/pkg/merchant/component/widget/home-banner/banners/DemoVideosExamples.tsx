import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { shuffle } from "lodash";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import cornhole from "@toolkit/demo-video-examples/cornhole-360-width-muted.mp4";
import desk from "@toolkit/demo-video-examples/desk-chairs-360-width-muted.mp4";
import makeup from "@toolkit/demo-video-examples/makeup-360-width-muted.mp4";
import organizer from "@toolkit/demo-video-examples/organizer-360-width-muted.mp4";
import pool from "@toolkit/demo-video-examples/pool-360-width-muted.mp4";
import watch from "@toolkit/demo-video-examples/watch-360-width-muted.mp4";
import weights from "@toolkit/demo-video-examples/weights-360-width-muted.mp4";
import workout from "@toolkit/demo-video-examples/workout-360-width-muted.mp4";

const DemoVideosExamples = () => {
  const styles = useStylesheet();

  const urls = useMemo(
    () => [cornhole, desk, makeup, organizer, pool, watch, weights, workout],
    []
  );

  // gets a random 3 videos to be the still images and video
  const [image1, image2, video] = useMemo(() => shuffle(urls), [urls]);

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.stillImageContainer, styles.mediaContainer)}>
        <div className={css(styles.overlay)} />
        <video className={css(styles.video)} muted>
          <source src={image1} />
        </video>
      </div>
      <div className={css(styles.videoContainer, styles.mediaContainer)}>
        <video className={css(styles.video)} muted loop autoPlay>
          <source src={video} />
        </video>
      </div>
      <div className={css(styles.stillImageContainer, styles.mediaContainer)}>
        <div className={css(styles.overlay)} />
        <video className={css(styles.video)} muted>
          <source src={image2} />
        </video>
      </div>
    </div>
  );
};

const ImageHeight = 136;
const ImageWidth = ImageHeight * (9 / 16);
const VideoHeight = 164;
const VideoWidth = VideoHeight * (9 / 16);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
        },
        mediaContainer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ":not(:last-child)": {
            marginRight: 8,
          },
          borderRadius: 4,
          overflow: "hidden",
        },
        stillImageContainer: {
          position: "relative",
          height: ImageHeight,
          width: ImageWidth,
        },
        overlay: {
          position: "absolute",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          backgroundColor: "black",
          opacity: 0.4,
        },
        videoContainer: {
          height: VideoHeight,
          width: VideoWidth,
        },
        video: {
          pointerEvents: "none", // prevents user getting video controls
          maxWidth: "100%",
        },
      }),
    []
  );
};

export default observer(DemoVideosExamples);
