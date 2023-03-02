import React, { useContext, useMemo, useState } from "react";
import { observer } from "mobx-react";
import {
  MessagesQueryResponse,
  MessagesQueryVariables,
  MESSAGES_QUERY,
} from "@infractions/queries/messages";
import BaseCard, { Props as BaseCardProps } from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Conversation, {
  Attachment,
  Message,
  MessageGroup,
} from "@core/components/conversation/Conversation";
import { InfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { useQuery } from "@apollo/client";
import { Text } from "@ContextLogic/atlas-ui";
import Skeleton from "@core/components/Skeleton";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { arrayGroup } from "@core/toolkit/array";

const MessagesCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const {
    infraction: { id: infractionId },
  } = useContext(InfractionContext);
  const Card = ({ children }: Pick<BaseCardProps, "children">) => (
    <BaseCard
      title={ci18n("card title", "Messages")}
      style={[className, style]}
    >
      {children}
    </BaseCard>
  );

  const [response, setResponse] = useState<string | undefined>();
  const [attachments, setAttachments] = useState<ReadonlyArray<Attachment>>([]);
  const { locale } = useLocalizationStore();

  const { data, loading, error } = useQuery<
    MessagesQueryResponse,
    MessagesQueryVariables
  >(MESSAGES_QUERY, { variables: { infractionId } });

  const infraction = data?.policy?.merchantWarning;

  const messageGroups: ReadonlyArray<MessageGroup> = useMemo(() => {
    if (!infraction) {
      return [];
    }

    const dateSentFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    });
    const messageGroupFormatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
    });

    const messages: ReadonlyArray<Message & { messageGroup: string }> =
      infraction.order?.trackingDispute
        ? infraction.order.trackingDispute.messages.map(
            ({ senderType, senderName, date: { unix }, message, files }) => ({
              type: senderType == "ADMIN" ? "RECEIVED" : "SENT",
              author:
                senderType == "ADMIN"
                  ? i`Wish Merchant Service`
                  : senderName ?? undefined,
              dateSent: dateSentFormatter.format(unix),
              message: message ?? undefined,
              files,
              messageGroup: messageGroupFormatter.format(unix),
            }),
          )
        : infraction.replies.map(
            ({
              senderType,
              displayName,
              date: { unix },
              translatedMessage,
              files,
              images,
            }) => ({
              type: senderType == "ADMIN" ? "RECEIVED" : "SENT",
              author: displayName ?? undefined,
              dateSent: dateSentFormatter.format(unix),
              message: translatedMessage ?? undefined,
              files: [
                ...files,
                ...(images?.map((imageUrl) => ({
                  displayFilename: ci18n("a filename", "image"),
                  fileUrl: imageUrl,
                })) ?? []),
              ],
              messageGroup: messageGroupFormatter.format(unix),
            }),
          );

    const groupedMessages = arrayGroup(
      messages,
      ({ messageGroup }) => messageGroup,
    );

    return Object.keys(groupedMessages).map((key) => ({
      title: key,
      messages: groupedMessages[key],
    }));
  }, [infraction, locale]);

  if (loading) {
    return (
      <Card>
        <Skeleton height={520} />
      </Card>
    );
  }

  if (error || infraction == null) {
    return (
      <Card>
        <Text variant="bodyLStrong">
          Something went wrong. Please try again later.
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Conversation
        messageGroups={messageGroups}
        response={response}
        onResponseChange={({ text }) => {
          setResponse(text);
        }}
        onSend={() => {
          alert("send clicked");
        }}
        fileUploadProps={{
          accepts: ".pdf,.jpeg,.png",
          maxSizeMB: 5,
          attachments,
          onAttachmentsChanged: (attachments) => {
            setAttachments(attachments);
          },
          bucket: "TEMP_UPLOADS_V2",
          onSend: () => {
            alert("file upload clicked");
          },
        }}
      />
    </Card>
  );
};

export default observer(MessagesCard);
