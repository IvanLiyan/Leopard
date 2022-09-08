import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { css } from "@toolkit/styling";
import { Layout, Text } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";

export type ExampleProps = BaseProps & {
  readonly title: string;
  readonly description: string;
  readonly videoUrl: string;
};

const Example: React.FC<ExampleProps> = ({
  className,
  style,
  title,
  description,
  videoUrl,
}) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <video loop muted controls className={css(styles.video)}>
        <source src={videoUrl} />
        {i`Your browser does not support videos`}
      </video>
      <Text style={styles.title} weight="semibold">
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </Layout.FlexColumn>
  );
};

export default observer(Example);

const VideoWidth = 200;

const useStylesheet = () => {
  const { secondaryDarkest, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          // We want to limit these cards
          // eslint-disable-next-line local-rules/validate-root
          maxWidth: VideoWidth,
        },
        title: {
          wordWrap: "break-word",
          color: secondaryDarkest,
          marginTop: 15,
          paddingBottom: 15,
          textAlign: "center",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        description: {
          margin: "10px 0px",
          textAlign: "center",
        },
        video: {
          width: VideoWidth,
          borderRadius: 4,
        },
      }),
    [secondaryDarkest, borderPrimary]
  );
};
