import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Illustration, IllustrationName } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SectionItemProps = BaseProps & {
  readonly titleText: string;
  readonly contentText: string;
  readonly buttonText: string;
  readonly buttonLink: string;
  readonly illustrationName: IllustrationName;
  readonly illustrationStyle?: CSSProperties | string;
};

const SectionItem = ({
  titleText,
  contentText,
  buttonText,
  buttonLink,
  illustrationName,
  illustrationStyle,
  className,
}: SectionItemProps) => {
  const styles = useStylesheet();
  return (
    <Card className={className} contentContainerStyle={css(styles.root)}>
      <div className={css(styles.contentContainer)}>
        <H4Markdown text={titleText} className={css(styles.title)} />
        <Markdown
          className={css(styles.welcomeText)}
          text={contentText}
          openLinksInNewTab
        />
        <SecondaryButton href={buttonLink} className={css(styles.button)}>
          {buttonText}
        </SecondaryButton>
      </div>
      <Illustration
        name={illustrationName}
        alt={i`illustration`}
        className={css(styles.illustrationContainer, illustrationStyle)}
      />
    </Card>
  );
};
export default observer(SectionItem);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 24,
          height: "90%",
          position: "relative",
        },
        contentContainer: {
          display: "flex",
          flexDirection: "column",
          zIndex: 5,
        },
        illustrationContainer: {
          alignSelf: "flex-end",
          zIndex: 1,
        },
        title: {
          fontSize: 20,
        },
        welcomeText: {
          fontSize: 16,
          color: textBlack,
          marginTop: 8,
          marginBottom: 20,
          maxWidth: 610,
        },
        button: {
          maxWidth: 200,
        },
      }),
    [textBlack],
  );
};
