import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly videoId: string;
};

const YoutubeVideo: React.FC<Props> = ({
  style,
  className,
  videoId,
}: Props) => {
  return (
    <div className={css(style, className)}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default observer(YoutubeVideo);
