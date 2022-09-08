import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { ci18n } from "@legacy/core/i18n";
import { H5, Card, Text } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Example from "./Example";
import {
  BlurryVideoUrl,
  PoorLightingUrl,
  FactoryVideoUrl,
  ImageSlideshowUrl,
  NonEnglishTextUrl,
  ScreenRecordingUrl,
  HasPersonTalkingUrl,
  IncorrectRotationUrl,
  ReferredCustomerOffPlatformUrl,
} from "@toolkit/products/demo-video";

type Props = BaseProps;

const NegativeExamples: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(className, style, styles.root)}>
      <H5 className={css(styles.title)}>Poor practices</H5>
      <Card contentContainerStyle={css(styles.cardContent)}>
        <Text className={css(styles.titleSection)}>
          Avoid submitting videos that may drive customers away from your
          product and potentially reduce sales.
        </Text>
        <div className={css(styles.exampleGrid)}>
          <Example
            className={css(styles.example)}
            title={i`Blurry content`}
            description={
              i`Avoid blurry, pixelated, unprofessional, ` +
              i`and low quality videos. Avoid applying blur filters.`
            }
            isPositive={false}
            videoUrl={BlurryVideoUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Non-English text`}
            description={i`Avoid videos with non-English text.`}
            isPositive={false}
            videoUrl={NonEnglishTextUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Image slideshow`}
            description={i`Avoid videos that are still photo slideshows.`}
            isPositive={false}
            videoUrl={ImageSlideshowUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Refer customer off platform`}
            description={i`Avoid referring customers away from the Wish app.`}
            isPositive={false}
            videoUrl={ReferredCustomerOffPlatformUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Incorrect rotation`}
            description={i`Avoid incorrectly rotated videos that are sideways or upside down.`}
            isPositive={false}
            videoUrl={IncorrectRotationUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Screen recording`}
            description={i`Avoid videos that are recordings of your phone screen.`}
            isPositive={false}
            videoUrl={ScreenRecordingUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Factory video`}
            description={i`Avoid videos that show your product’s factory.`}
            isPositive={false}
            videoUrl={FactoryVideoUrl}
          />

          <Example
            className={css(styles.example)}
            title={ci18n(
              "Video shows a person talking to the camera",
              "Person talking"
            )}
            description={
              i`Avoid videos where a person is talking because ` +
              i`videos are displayed without audio.`
            }
            isPositive={false}
            videoUrl={HasPersonTalkingUrl}
          />

          <Example
            className={css(styles.example)}
            title={i`Poor lighting`}
            description={i`Avoid videos that are dim and have poor lighting`}
            isPositive={false}
            videoUrl={PoorLightingUrl}
          />
        </div>
      </Card>
    </div>
  );
};

export default observer(NegativeExamples);

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
    [borderPrimary]
  );
};
