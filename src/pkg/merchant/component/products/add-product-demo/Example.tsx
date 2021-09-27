import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { css } from "@toolkit/styling";
import { Text } from "@ContextLogic/lego";

type Props = BaseProps & {
  readonly title: string;
  readonly description: string;
  readonly isPositive: boolean;
  readonly videoUrl: string;
};

const Example: React.FC<Props> = ({
  className,
  style,
  title,
  description,
  videoUrl,
  isPositive,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <Icon
        className={css(styles.icon)}
        name={isPositive ? "star" : "redXSolid"}
      />
      <div className={css(styles.content)}>
        <Text className={css(styles.title)} weight="semibold">
          {title}
        </Text>
        <Text className={css(styles.description)}>{description}</Text>
        <video loop muted controls className={css(styles.video)}>
          <source src={videoUrl} />
          {i`Your browser does not support videos`}
        </video>
      </div>
    </div>
  );
};

export default observer(Example);

const VideoWidth = 290;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          // We want to limit these cards
          // eslint-disable-next-line local-rules/validate-root
          maxWidth: VideoWidth,
        },
        content: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          wordWrap: "break-word",
        },
        description: {
          margin: "10px 0px",
          wordWrap: "break-word",
          height: 63,
        },
        icon: {
          width: 14,
          minWidth: 14,
          marginRight: 10,
          marginTop: 3,
        },
        video: {
          width: VideoWidth,
          height: VideoWidth / (9 / 16),
        },
      }),
    []
  );
};
