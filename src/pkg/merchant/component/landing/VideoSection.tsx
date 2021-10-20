import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useLocalizationStore } from "@stores/LocalizationStore";

type VideoSectionProps = BaseProps & {
  readonly insetX: number;
};

const YouTubeVideoIds: { [key: string]: string } = {
  en: "BQh9bGeq_-A",
  de: "y0VrTZDMxbg",
  es: "TwToBdoQTE4",
  fr: "2sP-iPyTwHE",
  it: "Q07OMy8IQp4",
  pt: "8O5PjQi2KHg",
};

const VideoSection = (props: VideoSectionProps) => {
  const { style, className } = props;
  const styles = useStylesheet(props);

  const { locale } = useLocalizationStore();

  const { [locale]: videoId } = YouTubeVideoIds;
  if (videoId == null) {
    return null;
  }

  return (
    <section className={css(styles.root, className, style)}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </section>
  );
};

export default observer(VideoSection);

const useStylesheet = (props: VideoSectionProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palettes.textColors.White,
          padding: `30px ${props.insetX}px`,
        },
      }),
    [props.insetX],
  );
};
