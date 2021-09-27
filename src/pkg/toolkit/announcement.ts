import gql from "graphql-tag";

import {
  MerchantAnnouncementSchema,
  AnnouncementCategorySchema,
  Datetime,
  AnnouncementProgramSchema,
} from "@schema/types";

type PickedAnnouncementCategorySchema = Pick<
  AnnouncementCategorySchema,
  "text" | "type"
>;
export type PickedAnnouncement = Pick<
  MerchantAnnouncementSchema,
  "message" | "ctaLink" | "ctaText" | "title" | "id" | "important"
> & {
  readonly categories: ReadonlyArray<PickedAnnouncementCategorySchema>;
  readonly createdAt: {
    readonly inTimezone: Pick<Datetime, "formatted">;
  };
  readonly program?: Pick<AnnouncementProgramSchema, "text" | "type"> | null;
};

export type HomeAnnouncementsResponseData = {
  readonly announcements?: {
    readonly forUsers?: ReadonlyArray<PickedAnnouncement> | null;
  };
};

export const GET_ANNOUNCEMENTS_QUERY = gql`
  query AnnouncementDashboard_GetAnnouncements {
    announcements {
      forUsers(announcementType: SYSTEM_UPDATE, limit: 5) {
        id
        ctaText
        ctaLink
        title
        important
        program {
          text
          type
        }
        createdAt {
          inTimezone(identifier: "UTC") {
            formatted(fmt: "MMM d, y")
          }
        }
        categories {
          text
          type
        }
      }
    }
  }
`;
