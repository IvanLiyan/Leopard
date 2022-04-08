import { Datetime, ProductVideo, RaccVideoAsset } from "@schema/types";
import gql from "graphql-tag";

const NUM_OF_VIDEOS_ON_LEADERBOARD = 8;

export const GET_VIDEO_LEADERBOARD = gql`
  query VideoLeaderboard_GetVideoLeaderboard($category: VideoCategory!) {
    productCatalog {
      videoService {
        leaderboard(offset: 0, limit: ${NUM_OF_VIDEOS_ON_LEADERBOARD}, category: $category) {
          lastUpdated {
            mmddyyyy
          }
          videos {
            highQuality {
              url
            }
            viewCount
            totalWatchTime
          }
        }
      }
    }
  }
`;

export type GetLeaderboardResponseType = {
  readonly productCatalog: {
    readonly videoService: {
      readonly leaderboard?: {
        readonly lastUpdated: Pick<Datetime, "mmddyyyy">;
        videos: ReadonlyArray<
          Pick<ProductVideo, "viewCount" | "totalWatchTime"> & {
            readonly highQuality?: Pick<RaccVideoAsset, "url"> | null;
          }
        >;
      };
    };
  };
};
