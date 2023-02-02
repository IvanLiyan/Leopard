import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Text } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";

export type Message = {
  type: "RECEIVED" | "SENT";
  author: string;
  dateSent: string;
  message: string;
  files: ReadonlyArray<unknown>;
};

type Props = Pick<BaseProps, "className" | "style"> & Message;

const Message: React.FC<Props> = ({
  className,
  style,
  type,
  author,
  dateSent,
  message,
  files,
}) => {
  void files; // TODO
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      style={[
        styles.root,
        type == "RECEIVED" ? styles.received : styles.sent,
        style,
        className,
      ]}
    >
      <Text>{message}</Text>
      <div className={css(styles.metadataContainer)}>
        <Text variant="bodyS" className={css(styles.metadata)}>
          From
        </Text>
        &nbsp;
        <Text variant="bodySStrong" className={css(styles.metadata)}>
          {author}
        </Text>
      </div>
      <Text variant="bodyS" className={css(styles.metadata)}>
        {dateSent}
      </Text>
    </Layout.FlexColumn>
  );
};

export default observer(Message);

const useStylesheet = () => {
  const { secondaryLightest, surfaceLighter, textLight } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      root: {
        borderRadius: 16,
        padding: 16,
      },
      received: {
        backgroundColor: secondaryLightest,
        alignSelf: "flex-start",
      },
      sent: {
        backgroundColor: surfaceLighter,
        alignSelf: "flex-end",
        textAlign: "end",
      },
      metadataContainer: {
        marginTop: 10,
      },
      metadata: {
        color: textLight,
      },
    });
  }, [secondaryLightest, surfaceLighter, textLight]);
};
