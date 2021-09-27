import React, { useMemo } from "react";
import { CSSProperties, StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Card, Markdown, H5Markdown } from "@ContextLogic/lego";
import { Illustration, IllustrationName } from "@merchant/component/core";
/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CardPriority = "normal" | "high";

type Props = BaseProps & {
  readonly title: string;
  readonly titleBolded?: boolean;
  readonly description: string;
  readonly completed?: boolean;
  readonly illustration?: IllustrationName | null | undefined;
  readonly illustrationStyle?: CSSProperties | string;
  readonly priority?: CardPriority | null | undefined;
};

const HomePageCard: React.FC<Props> = ({
  style,
  title,
  description,
  children,
  illustration,
  illustrationStyle,
  priority = "normal",
  titleBolded = true,
}: Props) => {
  const styles = useStylesheet();

  const contentContainerStyle = useMemo(() => {
    if (priority === "high") {
      return styles.containerHighPriority;
    }
    return null;
  }, [priority, styles.containerHighPriority]);

  return (
    <Card
      style={css(style, styles.card)}
      contentContainerStyle={css(styles.container, contentContainerStyle)}
    >
      <div className={css(styles.body)}>
        <H5Markdown
          style={styles.text}
          text={titleBolded ? `**${title}**` : title}
        />
        <Markdown text={description} style={css(styles.text)} />
        <div className={css(styles.buttonContainer)}>{children}</div>
      </div>
      {illustration && (
        <Illustration
          name={illustration}
          alt={title}
          style={css(styles.illustration, illustrationStyle)}
        />
      )}
    </Card>
  );
};

export default HomePageCard;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        card: {
          maxWidth: 504,
        },
        container: {
          padding: "20px 0px 0px 24px",
          minHeight: 224,
          display: "flex",
          justifyContent: "space-around",
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
        },
        body: {
          display: "flex",
          flexDirection: "column",
          flex: 2,
        },
        containerHighPriority: {
          backgroundColor: "rgba(128, 85, 255, 0.12)",
        },
        text: {
          margin: "4px 24px 4px 0px",
        },
        buttonContainer: {
          alignSelf: "flex-start",
          margin: "16px 4px 16px 0px",
        },
        illustration: {
          margin: "0px 16px",
          flex: 1,
          "@media (max-width: 900px)": {
            marginLeft: -10,
            maxWidth: "50%",
          },
        },
        doneRow: {
          display: "flex",
          height: 40,
          alignItems: "center",
          margin: "16px 4px",
        },
        doneCheckmark: {
          height: 40,
          width: 40,
          marginRight: 8,
        },
      }),
    []
  );
