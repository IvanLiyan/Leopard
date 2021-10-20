import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { H5, Card, Text } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Example from "./Example";

import makeup from "@toolkit/demo-video-examples/makeup-360-width-muted.mp4";
import cornhole from "@toolkit/demo-video-examples/cornhole-360-width-muted.mp4";
import desk from "@toolkit/demo-video-examples/desk-chairs-360-width-muted.mp4";
import organizer from "@toolkit/demo-video-examples/organizer-360-width-muted.mp4";
import weights from "@toolkit/demo-video-examples/weights-360-width-muted.mp4";
import workout from "@toolkit/demo-video-examples/workout-360-width-muted.mp4";

type Props = BaseProps;

const PositiveExamples: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(className, style, styles.root)}>
      <H5 className={css(styles.title)}>Best practices</H5>
      <Card contentContainerStyle={css(styles.cardContent)}>
        <Text className={css(styles.titleSection)}>
          Use these pro tips to maximize the Demo Videos feature, engage
          customers, and potentially increase sales.
        </Text>
        <div className={css(styles.exampleGrid)}>
          <Example
            title={i`Quality counts`}
            description={
              i`High quality video is essential. Create a ` +
              i`professional feel with clear, steady visuals.`
            }
            isPositive
            videoUrl={makeup}
            className={css(styles.example)}
          />

          <Example
            title={i`Tell a story`}
            description={
              i`Help customers visualize how your product ` +
              i`could fit into their personal journey. `
            }
            isPositive
            videoUrl={desk}
            className={css(styles.example)}
          />

          <Example
            title={i`Show off`}
            description={
              i`Highlight features or qualities that might ` +
              i`be hard to demonstrate in photos.`
            }
            isPositive
            videoUrl={organizer}
            className={css(styles.example)}
          />

          <Example
            title={i`Make it fun`}
            description={
              i`Showcase how your products might bring ` +
              i`unique enjoyment to customers.`
            }
            isPositive
            videoUrl={cornhole}
            className={css(styles.example)}
          />

          <Example
            title={i`Create broader appeal`}
            description={
              i`Use video to facilitate universal ` +
              i`understanding of your products.`
            }
            isPositive
            videoUrl={workout}
            className={css(styles.example)}
          />

          <Example
            title={i`Keep it real`}
            description={
              i`Make sure your videos are relatable, ` +
              i`honest, and accurate.`
            }
            isPositive
            videoUrl={weights}
            className={css(styles.example)}
          />
        </div>
      </Card>
    </div>
  );
};

export default observer(PositiveExamples);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          marginBottom: 10,
        },
        cardContent: {
          padding: 20,
        },
        titleSection: {
          paddingBottom: 15,
          borderBottom: `1px solid ${borderPrimary}`,
          marginBottom: 15,
        },
        exampleGrid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridGap: 15,
        },
        example: {
          marginTop: 10,
        },
      }),
    [borderPrimary],
  );
};
