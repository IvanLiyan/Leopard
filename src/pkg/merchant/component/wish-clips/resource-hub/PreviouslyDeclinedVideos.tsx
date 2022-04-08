/* Revamp of @merchant/component/products/add-product-demo/NegativeExamples.tsx */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { ci18n } from "@legacy/core/i18n";
import { H5, Text, Layout } from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Example, {
  ExampleProps,
} from "@merchant/component/wish-clips/resource-hub/Example";
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

const VideoExampleOrder = [
  "BLURRY_CONTENT",
  "NON_ENGLISH_TEXT",
  "INCORRECT_ROTATION",
  "IMAGE_SLIDESHOW",
  "SCREEN_RECORDING",
  "REFER_OFF_PLATFORM",
  "FACTORY_VIDEO",
  "PERSON_TALKING",
  "POOR_LIGHTING",
] as const;
type VideoExampleType = typeof VideoExampleOrder[number];
type VideoExampleData = Pick<
  ExampleProps,
  "title" | "description" | "videoUrl"
>;
const VideoExamples: { readonly [T in VideoExampleType]: VideoExampleData } = {
  BLURRY_CONTENT: {
    title: i`Blurry content`,
    description:
      i`Avoid blurry, pixelated, unprofessional, ` +
      i`and low quality videos. Avoid applying blur filters`,
    videoUrl: BlurryVideoUrl,
  },
  NON_ENGLISH_TEXT: {
    title: i`Non-English text`,
    description: i`Avoid videos with non-English text`,
    videoUrl: NonEnglishTextUrl,
  },
  INCORRECT_ROTATION: {
    title: i`Incorrect rotation`,
    description: i`Avoid incorrectly rotated videos that are sideways or upside down`,
    videoUrl: IncorrectRotationUrl,
  },
  IMAGE_SLIDESHOW: {
    title: i`Image slideshow`,
    description: i`Avoid videos that are still photo slideshows`,
    videoUrl: ImageSlideshowUrl,
  },
  SCREEN_RECORDING: {
    title: i`Screen recording`,
    description: i`Avoid videos that are recordings of your phone screen`,
    videoUrl: ScreenRecordingUrl,
  },
  REFER_OFF_PLATFORM: {
    title: i`Refer customer off platform`,
    description: i`Avoid referring customers away from the Wish app`,
    videoUrl: ReferredCustomerOffPlatformUrl,
  },
  FACTORY_VIDEO: {
    title: i`Factory video`,
    description: i`Avoid videos that show your product’s factory`,
    videoUrl: FactoryVideoUrl,
  },
  PERSON_TALKING: {
    title: ci18n(
      "Video shows a person talking to the camera",
      "Person talking"
    ),
    description:
      i`Avoid videos where a person is talking because ` +
      i`videos are displayed without audio`,
    videoUrl: HasPersonTalkingUrl,
  },
  POOR_LIGHTING: {
    title: i`Poor lighting`,
    description: i`Avoid videos that are dim and have poor lighting`,
    videoUrl: PoorLightingUrl,
  },
};

type Props = BaseProps;

const PreviouslyDeclinedVideos: React.FC<Props> = ({
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow
        style={styles.titleSection}
        justifyContent={"space-between"}
      >
        <H5 style={styles.title}>Previously Declined Videos</H5>
        <Text style={styles.subTitle}>
          Avoid submitting videos that may drive customers away from your
          product
        </Text>
      </Layout.FlexRow>

      <Layout.FlexRow style={styles.examplesRow}>
        {VideoExampleOrder.map((example) => {
          const { title, description, videoUrl } = VideoExamples[example];
          return (
            <Layout.FlexColumn style={styles.videoGridCell} alignItems="center">
              <Example
                title={title}
                description={description}
                videoUrl={videoUrl}
              />
            </Layout.FlexColumn>
          );
        })}
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(PreviouslyDeclinedVideos);

const useStylesheet = () => {
  const { borderPrimary, surfaceLightest, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "0 50px 50px 50px",
          backgroundColor: surfaceLightest,
          borderRadius: 4,
        },
        title: {
          marginRight: 30,
        },
        subTitle: {
          color: textDark,
        },
        titleSection: {
          marginTop: 30,
          marginBottom: 30,
        },
        examplesRow: {
          justifyItems: "center",
          flexWrap: "wrap",
        },
        videoGridCell: {
          borderTop: `1px solid ${borderPrimary}`,
          padding: "25px 10px",
          flexGrow: 1,
        },
      }),
    [borderPrimary, surfaceLightest, textDark]
  );
};
