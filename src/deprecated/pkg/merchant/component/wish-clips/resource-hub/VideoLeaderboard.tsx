import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  H4,
  Info,
  Layout,
  LoadingIndicator,
  PillRow,
  Text,
} from "@ContextLogic/lego";
import { useTheme } from "@stores/ThemeStore";
import RankedVideoCard from "@merchant/component/wish-clips/resource-hub/RankedVideoCard";
import { css } from "@toolkit/styling";
import { useQuery } from "@apollo/client";
import {
  GetLeaderboardResponseType,
  GET_VIDEO_LEADERBOARD,
} from "@toolkit/wish-clips/video-leaderboard";
import {
  ProductVideoServiceSchemaLeaderboardArgs,
  VideoCategory,
} from "@schema/types";

// For testing while backend is still WIP
// const DUMMY_DATA: GetLeaderboardResponseType = {
//   productCatalog: {
//     videoService: {
//       leaderboard: {
//         lastUpdated: {
//           mmddyyyy: "02/17/2022",
//         },
//         videos: [
//           {
//             viewCount: 320340,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/5ff50c9264348010ca17b9a0-603a0e92d05ef351d077806c-1614417557-1920_3200.mp4",
//             },
//             totalWatchTime: 10000,
//           },
//           {
//             viewCount: 123440,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/603bb6b017995a962ae1f654-603bb6c02a314bd32e37575d-1614526146-1920_3200.mp4",
//             },
//             totalWatchTime: 1042300,
//           },
//           {
//             viewCount: 125440,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/5f3b998601b5b20047c54ea0-6035c8df7f5267cea8c3d7fd-1614172814-1920_3200.mp4",
//             },
//             totalWatchTime: 1003200,
//           },
//           {
//             viewCount: 13240,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/5f7b2a0b6ca00a003dd1b663-5fd4ddb7d29db3efdc337a66-1614099081-1920_3200.mp4",
//             },
//             totalWatchTime: 132100,
//           },
//           {
//             viewCount: 120340,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/5f6f19925deadf171e1a527b-5fb01ffd02562062217ce8f4-1614120904-1920_3200.mp4",
//             },
//             totalWatchTime: 230000,
//           },
//           {
//             viewCount: 112340,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/603f52eb6dd7c927b3b7e7cc-603f52f2028d427cf394b93b-1614762740-1920_3200.mp4",
//             },
//             totalWatchTime: 50000,
//           },
//           {
//             viewCount: 120340,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/5f1421e28af90c05436592ea-5fc25c3a760f05eb0c9dc3fc-1614118978-1920_3200.mp4",
//             },
//             totalWatchTime: 520000,
//           },
//           {
//             viewCount: 120340,
//             highQuality: {
//               url: "https://canary.contestimg.wish.com/api/product-video/fetch/5f944b790a054a2adffcc779-5fa25d2bd96d4b783c119abb-1614031491-1920_3200.mp4",
//             },
//             totalWatchTime: 110000,
//           },
//         ],
//       },
//     },
//   },
// };

const categoryOrder: ReadonlyArray<VideoCategory> = [
  "ALL",
  "FASHION",
  "MAKEUP_AND_BEAUTY",
  "GADGETS",
  "HOME_DECOR",
  "KITCHEN",
  "HOBBIES",
  "TOYS",
  "OUTDOOR",
];

const CategoryEmoji: { readonly [T in VideoCategory]: string | null } = {
  ALL: "",
  FASHION: "🎽",
  MAKEUP_AND_BEAUTY: "💄",
  GADGETS: "🎧",
  HOME_DECOR: "🛋",
  KITCHEN: "🍳",
  HOBBIES: "🎣️",
  TOYS: "🏀️",
  OUTDOOR: "🏕",
};

const CategoryNames: { readonly [T in VideoCategory]: string } = {
  ALL: i`All`,
  FASHION: i`#Fashion`,
  MAKEUP_AND_BEAUTY: i`#Makeup & beauty`,
  GADGETS: i`#Gadgets`,
  HOME_DECOR: i`#Home decor`,
  KITCHEN: i`#Kitchen`,
  HOBBIES: i`#Hobbies`,
  TOYS: i`#Toys`,
  OUTDOOR: i`#Outdoor`,
};

type Props = BaseProps;

const VideoLeaderboard: React.FC<Props> = ({ className, style }) => {
  const [category, setCategory] = useState<VideoCategory>(`ALL`);
  const styles = useStylesheet();
  const { data, loading } = useQuery<
    GetLeaderboardResponseType,
    ProductVideoServiceSchemaLeaderboardArgs
  >(GET_VIDEO_LEADERBOARD, {
    variables: {
      category,
    },
  });

  const videos = data?.productCatalog?.videoService?.leaderboard?.videos || [];
  const lastUpdatedDate =
    data?.productCatalog.videoService.leaderboard?.lastUpdated.mmddyyyy || "";

  const changeCategory = (selectedSet: ReadonlySet<string>) => {
    selectedSet.forEach(
      (selected) =>
        selected != category && setCategory(selected as VideoCategory)
    );
  };

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow justifyContent="space-between">
        <Layout.FlexRow>
          <H4>Wish Clips Leaderboard</H4>
          <Info
            position="top center"
            sentiment="info"
            size={16}
            text={i`Top videos for each product category ranked by customer views`}
            style={styles.info}
          />
        </Layout.FlexRow>
        <Text style={styles.lastUpdated}>
          Last updated on {lastUpdatedDate}
        </Text>
      </Layout.FlexRow>
      <PillRow
        options={categoryOrder.map((category) => {
          return {
            title: `${CategoryEmoji[category as VideoCategory]}  ${
              CategoryNames[category as VideoCategory]
            }`,
            value: category,
          };
        })}
        selected={[category]}
        onCheckedChanged={changeCategory}
        style={styles.pillRow}
        pillStyle={styles.pill}
      />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Layout.FlexRow style={styles.leaderboardGrid} justifyContent="center">
          {videos.map((videoData, index) => {
            const { highQuality, viewCount, totalWatchTime } = videoData;
            const url = highQuality?.url || "";
            return (
              <RankedVideoCard
                rank={index + 1}
                videoUrl={url}
                viewCount={viewCount || 0}
                watchTimeInSeconds={totalWatchTime || 0}
                className={css(styles.rankedVideoCard)}
              />
            );
          })}
        </Layout.FlexRow>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(VideoLeaderboard);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 20,
        },
        info: {
          marginLeft: 10,
        },
        pillRow: {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        },
        pill: {
          marginBottom: 5,
        },
        rankedVideoCard: {
          height: 180,
          // we want a fixed width for each card
          // eslint-disable-next-line local-rules/no-frozen-width
          width: 230,
        },
        lastUpdated: {
          color: textLight,
        },
        leaderboardGrid: {
          gap: 20,
          flexWrap: "wrap",
        },
      }),
    [textLight]
  );
};
