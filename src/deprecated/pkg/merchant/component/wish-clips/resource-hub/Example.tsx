/* Revamp of @merchant/component/products/add-product-demo/Example.tsx */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { css } from "@toolkit/styling";
import { Layout, Text } from "@ContextLogic/lego";

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
      <Text style={styles.title} weight="semibold">
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
      <video loop muted controls className={css(styles.video)}>
        <source src={videoUrl} />
        {i`Your browser does not support videos`}
      </video>
    </Layout.FlexColumn>
  );
};

export default observer(Example);

const VideoWidth = 290;

const useStylesheet = () => {
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
        },
        description: {
          margin: "10px 0px",
          wordWrap: "break-word",
          height: 63,
        },
        video: {
          width: VideoWidth,
          height: VideoWidth / (9 / 16),
          borderRadius: 4,
        },
      }),
    []
  );
};
