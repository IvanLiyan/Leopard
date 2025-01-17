import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Layout } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Text } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import Link from "@deprecated/components/Link";
import Icon from "@core/components/Icon";
import Image from "@core/components/Image";
import { merchFeUrl } from "@core/toolkit/router";

export type File = {
  readonly displayFilename: string;
  readonly fileUrl: string;
  readonly isImageFile: boolean;
};

export type Message = {
  readonly type: "RECEIVED" | "SENT";
  readonly author: string | undefined;
  readonly dateSent: string | undefined;
  readonly message: string | undefined;
  readonly files: ReadonlyArray<File>;
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
  const styles = useStylesheet();
  const { borderPrimary } = useTheme();

  return (
    <Layout.FlexColumn
      style={[
        styles.root,
        type == "RECEIVED" ? styles.received : styles.sent,
        style,
        className,
      ]}
    >
      {files.map(({ displayFilename, fileUrl, isImageFile }, i) => (
        <Link
          key={i}
          href={merchFeUrl(fileUrl)}
          download
          openInNewTab
          style={{ marginBottom: i == files.length ? 16 : 8 }}
        >
          {isImageFile ? (
            <Image
              src={merchFeUrl(fileUrl)}
              alt={displayFilename}
              style={{
                maxWidth: "175px",
                maxHeight: "175px",
                border: `solid 2px ${borderPrimary}`,
                borderRadius: "12px",
              }}
            />
          ) : (
            <>
              <Icon name="file" style={styles.icon} />
              <Text variant="bodyS">{displayFilename}</Text>
            </>
          )}
        </Link>
      ))}
      {message != undefined && (
        <Text sx={{ overflowWrap: "break-word", whiteSpace: "pre-line" }}>
          {message}
        </Text>
      )}
      <div className={css(styles.metadataContainer)}>
        {author != undefined && (
          <>
            <Text variant="bodyS" className={css(styles.metadata)}>
              From
            </Text>
            &nbsp;
            <Text variant="bodySStrong" className={css(styles.metadata)}>
              {author}
            </Text>
          </>
        )}
      </div>
      {dateSent != undefined && (
        <Text variant="bodyS" className={css(styles.metadata)}>
          {dateSent}
        </Text>
      )}
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
      icon: {
        height: 16,
        width: 16,
        paddingRight: 4,
      },
    });
  }, [secondaryLightest, surfaceLighter, textLight]);
};
