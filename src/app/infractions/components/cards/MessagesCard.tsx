import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import {
  MessagesQueryResponse,
  MessagesQueryVariables,
  MESSAGES_QUERY,
} from "@infractions/api/messagesQueries";
import Card, { Props as CardProps } from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Conversation, {
  Attachment,
  Message,
  MessageGroup,
} from "@core/components/conversation/Conversation";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { useMutation, useQuery } from "@apollo/client";
import { Text } from "@ContextLogic/atlas-ui";
import Skeleton from "@core/components/Skeleton";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { arrayGroup } from "@core/toolkit/array";
import {
  SendMessageMutationResponse,
  SendMessageMutationVariables,
  SEND_MESSAGE_MUTATION,
} from "@infractions/api/sendMessageMutations";
import { useToastStore } from "@core/stores/ToastStore";
import Chip from "@mui/material/Chip";
import styles from "@infractions/styles/messagesCard.module.css";

const MessagesCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const cardProps: Omit<CardProps, "children"> = {
    title: ci18n("card title", "Messages"),
    style: [className, style],
  };

  const {
    infraction: { id: infractionId, actions },
  } = useInfractionContext();

  const [viewingTranslatedMessages, setViewingTranslatedMessages] =
    useState(false);
  const [response, setResponse] = useState<string | undefined>();
  const [attachments, setAttachments] = useState<ReadonlyArray<Attachment>>([]);
  const { locale } = useLocalizationStore();
  const toastStore = useToastStore();

  const {
    data,
    loading: queryLoading,
    error,
    refetch,
  } = useQuery<MessagesQueryResponse, MessagesQueryVariables>(MESSAGES_QUERY, {
    variables: { infractionId },
  });

  const infraction = data?.policy?.merchantWarning;
  const isOrderInfraction = infraction?.order?.trackingDispute != null;

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
      isOrderInfraction
        ? infraction.order.trackingDispute.messages.map(
            ({ senderType, senderName, date: { unix }, message, files }) => ({
              type: senderType !== "MERCHANT" ? "RECEIVED" : "SENT",
              author:
                senderType !== "MERCHANT"
                  ? i`Wish Merchant Service`
                  : senderName ?? undefined,
              dateSent: dateSentFormatter.format(unix * 1000),
              message: message ?? undefined,
              files,
              messageGroup: messageGroupFormatter.format(unix * 1000),
            }),
          )
        : infraction.replies.map(
            ({
              senderType,
              senderName,
              date: { unix },
              message,
              translatedMessage,
              files,
              idFiles,
              images,
            }) => ({
              type: senderType !== "MERCHANT" ? "RECEIVED" : "SENT",
              author:
                senderType !== "MERCHANT"
                  ? i`Wish Merchant Service`
                  : senderName ?? undefined,
              dateSent: dateSentFormatter.format(unix * 1000),
              message:
                (viewingTranslatedMessages ? translatedMessage : message) ??
                undefined,
              files: [
                ...files,
                ...idFiles,
                ...(images?.map((imageUrl) => ({
                  displayFilename: ci18n("a filename", "image"),
                  fileUrl: imageUrl,
                  isImageFile: true,
                })) ?? []),
              ],
              messageGroup: messageGroupFormatter.format(unix * 1000),
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
  }, [infraction, locale, isOrderInfraction, viewingTranslatedMessages]);

  const [sendMessage, { loading: sendMessageMutationLoading }] = useMutation<
    SendMessageMutationResponse,
    SendMessageMutationVariables
  >(SEND_MESSAGE_MUTATION);

  const onSend = async () => {
    if (!response) {
      return;
    }

    try {
      const resp = await sendMessage({
        variables: {
          infractionId,
          messageInput: {
            message: response,
            uploadFiles:
              attachments.length > 0
                ? attachments.map(({ fileName, url }) => ({
                    fileName,
                    url,
                  }))
                : undefined,
          },
        },
      });

      const ok =
        resp?.data?.policy?.merchantWarning?.upsertMerchantWarning?.ok ?? false;
      const message =
        resp?.data?.policy?.merchantWarning?.upsertMerchantWarning?.message;

      if (!ok) {
        toastStore.negative(message ?? i`Something went wrong.`);
      }

      await refetch();
      setResponse(""); // undefined doesn't properly clear the text input
      setAttachments([]);
    } catch {
      toastStore.negative(i`Something went wrong.`);
    }
  };

  if (queryLoading) {
    return (
      <Card {...cardProps}>
        <Skeleton height={520} />
      </Card>
    );
  }

  if (error || infraction == null) {
    return (
      <Card {...cardProps}>
        <Text variant="bodyL">Something went wrong.</Text>
      </Card>
    );
  }

  const canMessage = actions.includes("MESSAGE");
  const disabled = queryLoading || sendMessageMutationLoading;

  return (
    <Card {...cardProps}>
      <div className={styles.conversation}>
        {messageGroups.length > 0 && (
          <div className={styles.chip}>
            {/* @ts-expect-error MUI TS typing is broken on chip with disable ripple */}
            <Chip
              onClick={() => {
                setViewingTranslatedMessages((cur) => !cur);
              }}
              label={i`View Translated Message(s)`}
              color="primary"
              variant={viewingTranslatedMessages ? "filled" : "outlined"}
              disableRipple
              sx={{
                fontFamily: "Proxima",
              }}
            />
          </div>
        )}
        <Conversation
          style={{ flex: 1 }}
          messageGroups={messageGroups}
          response={canMessage ? response : undefined}
          onResponseChange={
            canMessage
              ? ({ text }) => {
                  setResponse(text);
                }
              : undefined
          }
          responseProps={{
            disabled,
          }}
          sendProps={{
            disabled,
          }}
          onSend={onSend}
          fileUploadProps={
            canMessage
              ? {
                  accepts: ".pdf,.jpeg,.jpg,.png",
                  maxSizeMB: 5,
                  attachments,
                  onAttachmentsChanged: (attachments) => {
                    setAttachments(attachments);
                  },
                  bucket: "TEMP_UPLOADS_V2",
                }
              : undefined
          }
        />
      </div>
    </Card>
  );
};

export default observer(MessagesCard);
