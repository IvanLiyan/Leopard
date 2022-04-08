/*
 * CarouselSection.tsx
 *
 * Created by Jonah Dlin on Mon Mar 14 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Carousel,
  H3,
  H4,
  Layout,
  SecondaryButton,
  Text,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { css } from "@toolkit/styling";
import Illustration from "@merchant/component/core/Illustration";
import { ConsumerSideDemo } from "@toolkit/wish-clips/video-management";

type Props = BaseProps;

const CarouselSection: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();
  const [page, setPage] = useState(0);

  return (
    <Layout.FlexColumn
      style={[styles.root, className, style]}
      alignItems="stretch"
    >
      <Carousel
        style={styles.carousel}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
      >
        <Layout.FlexRow
          style={[styles.carouselScreen, styles.intro]}
          justifyContent="space-between"
          alignItems="stretch"
        >
          <Layout.FlexColumn
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Layout.FlexColumn alignItems="flex-start">
              <H3>Introducing Wish Clips!</H3>
              <Text style={styles.introSubtitle}>
                A scrollable video feed with its own dedicated tab in the Wish
                app
              </Text>
              <Layout.FlexRow
                style={styles.introSubsections}
                alignItems="flex-start"
              >
                <Layout.FlexColumn>
                  <Text weight="semibold" style={styles.introSubsectionTitle}>
                    Capture customer imagination
                  </Text>
                  <Text style={styles.introSubsectionText}>
                    Wish Clips is a brand-new opportunity lets you creatively
                    highlight the benefits of your products to customers around
                    the globe through video.
                  </Text>
                </Layout.FlexColumn>
                <Layout.FlexColumn>
                  <Text weight="semibold" style={styles.introSubsectionTitle}>
                    Get in on the lifestyle video trend
                  </Text>
                  <Text style={styles.introSubsectionText}>
                    Videos have exploded in popularity, setting a new bar for
                    the type of engaging content that customers prefer. With
                    videos on Wish, you can target this growing demographic by
                    telling compelling stories to promote your products.
                  </Text>
                </Layout.FlexColumn>
              </Layout.FlexRow>
            </Layout.FlexColumn>
            <SecondaryButton href="/videos/resource-hub">
              Explore Video Resources
            </SecondaryButton>
          </Layout.FlexColumn>
          <div className={css(styles.videoWrapper)}>
            <video loop autoPlay muted className={css(styles.video)}>
              <source src={ConsumerSideDemo} />
              {i`Your browser does not support videos`}
            </video>
          </div>
        </Layout.FlexRow>

        <Layout.FlexRow style={styles.carouselScreen} alignItems="stretch">
          <Layout.FlexColumn justifyContent="space-between">
            <Layout.FlexColumn
              alignItems="flex-start"
              style={styles.androidTitleContainer}
            >
              <H4>
                Wish Clips is Now Available to Android Users in {9} countries!
              </H4>
              <Text style={styles.androidSubtitle}>
                Italy, Brazil, Canada, Australia, Japan, Germany, France, Great
                Britain, United States of America
              </Text>
            </Layout.FlexColumn>
            <Text style={styles.comingSoon} weight="semibold">
              Coming soon to iOS
            </Text>
          </Layout.FlexColumn>
          <Illustration
            style={styles.androidImage}
            name="homeGettingImpressions"
            alt={i`Your client shopping via Wish Clips`}
          />
        </Layout.FlexRow>
      </Carousel>
    </Layout.FlexColumn>
  );
};

const VideoWidth = 148;
const VideoAspectRatio = 37 / 80;

const useStylesheet = () => {
  const { surfaceLightest, textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLightest,
        },
        carousel: {
          margin: "40px 20px 20px 20px",
        },
        carouselScreen: {
          minHeight: 320,
        },
        intro: {
          gap: 24,
        },
        introSubtitle: {
          color: textBlack,
          fontSize: 16,
          lineHeight: "24px",
          marginTop: 8,
          marginBottom: 40,
        },
        introSubsections: {
          gap: 24,
          marginBottom: 24,
        },
        introSubsectionTitle: {
          marginBottom: 12,
          color: textDark,
          fontSize: 16,
          lineHeight: "20px",
        },
        introSubsectionText: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        videoWrapper: {
          maxWidth: VideoWidth,
          overflow: "hidden",
          borderRadius: 8,
          flexShrink: 0,
          alignSelf: "center",
        },
        video: {
          width: VideoWidth,
          height: VideoWidth / VideoAspectRatio,
        },
        androidTitleContainer: {
          gap: 16,
          marginBottom: 16,
        },
        androidSubtitle: {
          color: textBlack,
          fontSize: 14,
          lineHeight: "20px",
        },
        comingSoon: {
          color: textDark,
          fontSize: 16,
          lineHeight: "24px",
        },
        androidImage: {
          maxHeight: 307,
          alignSelf: "flex-end",
        },
      }),
    [surfaceLightest, textBlack, textDark]
  );
};

export default observer(CarouselSection);
