import React, { useState, useMemo, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Card, Layout, TextInput } from "@ContextLogic/lego";
import { KEYCODE_ENTER } from "@ContextLogic/lego/component/form/TextInput";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Button } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";
import MessageComponent, {
  Message as MessageType,
  File as FileType,
} from "./Message";
import Divider from "./Divider";
import UploadFileModal, {
  Props as FileUploadModalProps,
  Attachment as AttachmentType,
} from "./FileUploadModal";
import { ci18n } from "@core/toolkit/i18n";

// re-exported types for ease of use
export type Attachment = AttachmentType;
export type File = FileType;
export type Message = MessageType;
export type MessageGroup = {
  readonly title?: string;
  readonly messages: ReadonlyArray<Message>;
};

/*
  notes on usage:
    - if you want the conversation to include the upload files flow, provide
      the "fileUploadProps" prop. not providing it will remove the "Upload
      File" button and modal from the component
    - if you want to provide the ability to respond to the conversation, provide
      "response", etc. not providing them will remove the text input and "Send"
      button from the component
*/
type Props = Pick<BaseProps, "className" | "style"> & {
  readonly messageGroups: ReadonlyArray<MessageGroup>;
  readonly maxHeight?: number;
  readonly fileUploadProps?: Omit<FileUploadModalProps, "isOpen" | "onClose">;
} & (
    | {
        readonly response: React.ComponentProps<typeof TextInput>["value"];
        readonly onResponseChange: React.ComponentProps<
          typeof TextInput
        >["onChange"];
        readonly responseProps?: Omit<
          React.ComponentProps<typeof TextInput>,
          "value" | "onChange"
        >;
        // onSend is called both on the send button press and when the
        // user types enter; if more control over the send button onClick
        // is required (say, handling the event prop), send.onClick
        // can be provided. however, onSend is still required to handle
        // the enter press
        readonly onSend: () => unknown;
        readonly sendProps?: Omit<
          React.ComponentProps<typeof Button>,
          "onClick" | "primary" | "secondary" | "tertiary"
        >;
      }
    | {
        readonly response?: never;
        readonly onResponseChange?: never;
        readonly responseProps?: never;
        readonly onSend?: never;
        readonly sendProps?: never;
      }
  );

/*
  Features to be added in upcoming PRs:
    * infinite scrolling support driven by parent
    * initial loading state
    * loading state when sending a message
*/
const Conversation: React.FC<Props> = ({
  className,
  style,
  messageGroups,
  maxHeight = 520,
  response,
  onResponseChange,
  responseProps,
  onSend,
  sendProps,
  fileUploadProps,
}) => {
  const styles = useStylesheet(maxHeight);
  const [uploadFileModalOpen, setUploadFileModalOpen] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useMountEffect(() => {
    if (messageContainerRef == null || messageContainerRef.current == null) {
      return;
    }

    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;
  });

  const Messages = () =>
    messageGroups.length > 0 ? (
      <Layout.FlexColumn
        style={styles.messageContainer}
        ref={messageContainerRef}
      >
        {messageGroups.map(({ title, messages }, i) => (
          <>
            {title && (
              <Divider style={styles.conversationItem}>{title}</Divider>
            )}
            {messages.map((msg, j) => (
              // using index as key since messages have no stable IDs
              // (theoretically possible that entire message content could be
              // identical between messages)
              // when expanding to add support for new messages and/or infinite
              // scrolling, we should look at replacing this with a package like
              // https://github.com/ai/nanoid/
              <MessageComponent
                key={`${i}${j}`}
                style={[styles.message, styles.conversationItem]}
                {...msg}
              />
            ))}
          </>
        ))}
      </Layout.FlexColumn>
    ) : (
      <Divider style={styles.noMessages}>No messages</Divider>
    );

  return (
    <Layout.FlexColumn style={[style, className]}>
      <Card style={{ boxShadow: "none" }}>
        <Messages />
      </Card>
      {onResponseChange && (
        <TextInput
          value={response}
          onChange={onResponseChange}
          onKeyUp={(code) => {
            if (code === KEYCODE_ENTER) {
              onSend();
            }
          }}
          placeholder={i`Please type your response here`}
          style={styles.response}
          {...responseProps}
        />
      )}
      <Layout.FlexRow justifyContent="flex-end">
        {fileUploadProps && (
          <>
            <Button
              secondary
              onClick={() => {
                setUploadFileModalOpen(true);
              }}
              className={css(styles.button)}
            >
              {`${ci18n(
                "button text, allows a merchant to upload a file",
                "Upload File",
              )}${
                fileUploadProps.attachments &&
                fileUploadProps.attachments.length > 0
                  ? ` (${fileUploadProps.attachments.length})`
                  : ""
              }`}
            </Button>
            <UploadFileModal
              isOpen={uploadFileModalOpen}
              onClose={() => {
                setUploadFileModalOpen(false);
              }}
              {...fileUploadProps}
            />
          </>
        )}
        {onResponseChange && (
          <Button
            onClick={onSend}
            className={css(styles.button)}
            disabled={!response}
            {...sendProps}
          >
            {ci18n(
              "button text, will send a message the merchant has typed",
              "Send",
            )}
          </Button>
        )}
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(Conversation);

const useStylesheet = (maxHeight: number) => {
  return useMemo(() => {
    return StyleSheet.create({
      messageContainer: {
        alignItems: "flex-start",
        maxHeight,
        padding: 16,
        overflowY: "auto",
      },
      conversationItem: {
        ":not(:last-child)": {
          marginBottom: 10,
        },
      },
      message: {
        maxWidth: "min(340px, 80%)",
      },
      response: {
        marginTop: 10,
      },
      button: {
        marginTop: 10,
        ":not(:first-child)": {
          marginLeft: 10,
        },
      },
      noMessages: {
        margin: "16px",
      },
    });
  }, [maxHeight]);
};
