/*
 * StoreOverview.tsx
 *
 * Created by Jonah Dlin on Mon Mar 14 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";

/* Merchant Components */
import PageGuide from "@merchant/component/core/PageGuide";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import CarouselSection from "./CarouselSection";
import VideoPerformanceSection from "./VideoPerformanceSection";
import OptimizeVideoCard from "./OptimizeVideoCard";
import { useQuery } from "@apollo/client";
import {
  VideoCountResponse,
  VIDEO_COUNT_QUERY,
} from "@toolkit/wish-clips/video-management";
import MakeASuccessfulWishClip from "@merchant/component/wish-clips/resource-hub/MakeASuccessfulWishClip";

type Props = BaseProps;

const StoreOverview: React.FC<Props> = ({ className, style }) => {
  const styles = useStylesheet();

  const { data: countData, loading: loadingCount } = useQuery<
    VideoCountResponse,
    Record<never, never>
  >(VIDEO_COUNT_QUERY);

  const noVideos =
    countData == null ||
    countData.productCatalog == null ||
    countData.productCatalog.videoService.videoCount == 0;

  const showSuccessfulWishClip = noVideos && !loadingCount;
  const showOptimizeVideo = !noVideos && !loadingCount;

  return (
    <PageGuide style={[className, style]}>
      <Layout.FlexColumn style={styles.content} alignItems="stretch">
        <CarouselSection />
        <VideoPerformanceSection
          noVideos={noVideos}
          loadingNoVideos={loadingCount}
        />
        {showSuccessfulWishClip && <MakeASuccessfulWishClip />}
        {showOptimizeVideo && <OptimizeVideoCard />}
      </Layout.FlexColumn>
    </PageGuide>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          gap: 38,
        },
      }),
    []
  );
};

export default observer(StoreOverview);
