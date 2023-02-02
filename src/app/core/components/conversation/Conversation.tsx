import React, { useMemo, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Card, Layout, TextInput } from "@ContextLogic/lego";
import { KEYCODE_ENTER } from "@ContextLogic/lego/component/form/TextInput";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Button } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";
import MessageComponent, { Message as MessageType } from "./Message";
import Divider from "./Divider";

export type Message = MessageType;
export type MessageGroup = {
  readonly title?: string;
  readonly messages: ReadonlyArray<Message>;
};

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly messageGroups: ReadonlyArray<MessageGroup>;
  readonly maxHeight?: number;
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
        // onSubmit is called both on the submit button press and when the
        // user types enter; if more control over the submit button onClick
        // is required (say, handling the event prop), submitProps.onClick
        // can be provided. however, onSubmit is still required to handle
        // the enter press
        readonly onSubmit: () => unknown;
        readonly submitProps?: Omit<
          React.ComponentProps<typeof Button>,
          "onClick" | "primary" | "secondary" | "tertiary"
        >;
      }
    | {
        readonly response?: undefined;
        readonly onResponseChange?: undefined;
        readonly responseProps?: undefined;
        readonly onSubmit?: undefined;
        readonly submitProps?: undefined;
      }
  ) &
  (
    | {
        onFileUpload: () => unknown;
      }
    | {
        onFileUpload?: undefined;
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
  onSubmit,
  submitProps,
  onFileUpload,
}) => {
  const styles = useStylesheet(maxHeight);

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
              onSubmit();
            }
          }}
          placeholder={i`Please type your response here`}
          style={styles.response}
          {...responseProps}
        />
      )}
      <Layout.FlexRow justifyContent="flex-end">
        {onFileUpload && (
          <Button
            secondary
            onClick={onFileUpload}
            className={css(styles.button)}
          >
            Upload File
          </Button>
        )}
        {onResponseChange && (
          <Button
            onClick={onSubmit}
            className={css(styles.button)}
            disabled={!response}
            {...submitProps}
          >
            Submit
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
