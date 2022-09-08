import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { H4, Layout, Text } from "@ContextLogic/lego";
import VideoDemo from "./VideoDemo";
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import {
  BestPracticesPromotion,
  BestPracticesFunctional,
  BestPracticesInspirational,
} from "@toolkit/wish-clips/video-management";
import { useDeviceStore } from "@stores/DeviceStore";

type Props = BaseProps & { readonly pagePaddingX: string | number };

const BestPracticesHeader: React.FC<Props> = ({
  className,
  style,
  pagePaddingX,
}: Props) => {
  const { isSmallScreen } = useDeviceStore();
  const styles = useStylesheet({ pagePaddingX });
  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="flex-start"
    >
      <Layout.FlexColumn style={css(styles.textColumn)}>
        <div className={css(styles.absoluteBackgroundParent)}>
          <div className={css(styles.absoluteBackground)}></div>
          <H4 style={styles.title}>
            Express your product value in video for extra exposure on Wish.
          </H4>
        </div>
        <Text style={styles.subTitle}>
          The videos you uploaded will appear on the Wish home feed, Wish Clips,
          product details page, and search results.
        </Text>
      </Layout.FlexColumn>
      <Layout.FlexRow
        justifyContent={isSmallScreen ? "flex-start" : "space-evenly"}
        style={styles.videos}
        alignItems="flex-start"
      >
        <VideoDemo
          title={i`Promotional`}
          description={i`High quality video, good lighting, studio level`}
          videoUrl={BestPracticesPromotion}
        />
        <VideoDemo
          title={i`Inspirational`}
          description={i`Focus is on content not product features. Think story/narrative/tip driven.`}
          videoUrl={BestPracticesInspirational}
        />
        <VideoDemo
          title={i`Functional`}
          description={i`Shows the product in-use, no special effects added`}
          videoUrl={BestPracticesFunctional}
        />
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
};

export default observer(BestPracticesHeader);

const useStylesheet = ({ pagePaddingX }: { pagePaddingX: string | number }) => {
  const { surfaceLighter, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 50,
          flexWrap: "wrap",
          backgroundColor: surfaceLightest,
          overflow: "hidden", // hides 100vw inconsistencies
        },
        title: {
          paddingTop: 50, // not margin so absoluteBackground's top:0 can reach top of parent
          marginBottom: 5,
        },
        textColumn: {
          minWidth: 162,
          flex: 1,
          zIndex: 1,
          alignSelf: "stretch",
        },
        subTitle: {
          marginTop: 20,
          zIndex: 1,
          flexGrow: 1,
        },
        videos: {
          gap: 20,
          zIndex: 1,
          marginBottom: 5,
          flexGrow: 1,
          overflow: "auto",
        },
        absoluteBackground: {
          zIndex: -1,
          width: "100vw",
          height: "100%",
          backgroundColor: surfaceLighter,
          position: "absolute",
          left: `-${pagePaddingX}`,
          top: 0,
        },
        absoluteBackgroundParent: {
          position: "relative",
        },
      }),
    [surfaceLighter, surfaceLightest, pagePaddingX]
  );
};
