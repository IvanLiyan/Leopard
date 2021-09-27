import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps;

const VideoTutorialCard: React.FC<Props> = ({ style, className }: Props) => {
  return (
    <div className={css(style, className)}>
      <iframe
        width="100%" // matching homePageCard and InsightsCard
        height="242" // matching homePageCard and InsightsCard
        src="https://www.youtube.com/embed/GoK61s1uB4U"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default observer(VideoTutorialCard);
