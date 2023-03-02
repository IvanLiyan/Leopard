import { gql } from "@apollo/client";
import {
  Datetime,
  MerchantFileSchema,
  MerchantWarningReplySchema,
  TrackingDisputeMessageSchema,
} from "@schema";

// NOTE: orders messages are located inside trackingDispute; merchant and
// listing level messages are located in replies. We have to fetch both of
// them; reconciliation is handled inside MessagesCard
// please don't repeat this pattern

export const REPLY_FIELDS = gql`
  fragment ReplyFields on MerchantWarningReplySchema {
    senderType
    displayName
    translatedMessage
    images
    date {
      unix
    }
    files {
      displayFilename
      fileUrl
    }
  }
`;

export type ReplyFields = Pick<
  MerchantWarningReplySchema,
  "senderType" | "displayName" | "translatedMessage" | "images"
> & {
  readonly date: Pick<Datetime, "unix">;
  readonly files: ReadonlyArray<
    Pick<MerchantFileSchema, "displayFilename" | "fileUrl">
  >;
};

export const TRACKING_MESSAGE_FIELDS = gql`
  fragment TrackingMessageFields on TrackingDisputeMessageSchema {
    senderType
    senderName
    message
    date {
      unix
    }
    files {
      displayFilename
      fileUrl
    }
  }
`;

export type TrackingMessageFields = Pick<
  TrackingDisputeMessageSchema,
  "senderType" | "senderName" | "message"
> & {
  readonly date: Pick<Datetime, "unix">;
  readonly files: ReadonlyArray<
    Pick<MerchantFileSchema, "displayFilename" | "fileUrl">
  >;
};

export const MESSAGES_QUERY = gql`
  ${REPLY_FIELDS}
  ${TRACKING_MESSAGE_FIELDS}
  query MessagesQuery($infractionId: ObjectIdType) {
    policy {
      merchantWarning(id: $infractionId) {
        order {
          trackingDispute {
            messages {
              ...TrackingMessageFields
            }
          }
        }
        replies {
          ...ReplyFields
        }
      }
    }
  }
`;

export type MessagesQueryResponse = {
  readonly policy?: {
    readonly merchantWarning?: {
      readonly order?: {
        readonly trackingDispute?: {
          readonly messages: ReadonlyArray<TrackingMessageFields>;
        };
      };
      readonly replies: ReadonlyArray<ReplyFields>;
    };
  };
};

export type MessagesQueryVariables = {
  readonly infractionId: string;
};
