import { gql } from "@gql";
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

// note: `message` is in EN, `translatedMessage` is in CN
// TODO: BE will be deprecating the images and idFiles resolvers and moving
// those responses to files. no changes will be required by FE at the time but
// once that is done we can remove them from our query here and elsewhere
export const REPLY_FIELDS = gql(`
  fragment ReplyFields on MerchantWarningReplySchema {
    senderType
    senderName
    message
    translatedMessage
    images
    date {
      unix
    }
    files {
      displayFilename
      fileUrl
      isImageFile
    }
    idFiles {
      displayFilename
      fileUrl
      isImageFile
    }
  }
`);

export type ReplyFields = Pick<
  MerchantWarningReplySchema,
  "senderType" | "senderName" | "message" | "translatedMessage" | "images"
> & {
  readonly date: Pick<Datetime, "unix">;
  readonly files: ReadonlyArray<
    Pick<MerchantFileSchema, "displayFilename" | "fileUrl" | "isImageFile">
  >;
  readonly idFiles: ReadonlyArray<
    Pick<MerchantFileSchema, "displayFilename" | "fileUrl" | "isImageFile">
  >;
};

export const TRACKING_MESSAGE_FIELDS = gql(`
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
      isImageFile
    }
  }
`);

export type TrackingMessageFields = Pick<
  TrackingDisputeMessageSchema,
  "senderType" | "senderName" | "message"
> & {
  readonly date: Pick<Datetime, "unix">;
  readonly files: ReadonlyArray<
    Pick<MerchantFileSchema, "displayFilename" | "fileUrl" | "isImageFile">
  >;
};

export const MESSAGES_QUERY = gql(`
  query MessagesQuery($infractionId: ObjectIdType) {
    policy {
      merchantWarning(id: $infractionId) {
        trackingDispute {
          messages {
            ...TrackingMessageFields
          }
        }
        replies {
          ...ReplyFields
        }
      }
    }
  }
`);

export type MessagesQueryResponse = {
  readonly policy?: {
    readonly merchantWarning?: {
      readonly trackingDispute?: {
        readonly messages: ReadonlyArray<TrackingMessageFields>;
      };
      readonly replies: ReadonlyArray<ReplyFields>;
    };
  };
};

export type MessagesQueryVariables = {
  readonly infractionId: string;
};
