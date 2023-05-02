import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Card } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";

export type SupportCardProps = BaseProps & {
  readonly titleText: string;
  readonly contentText: string;
  readonly buttonText: string;
  readonly buttonLink: string;
  readonly iconIllustrationName?: IllustrationName;
};

const SupportCard = ({
  titleText,
  contentText,
  buttonText,
  buttonLink,
  iconIllustrationName,
  className,
}: SupportCardProps) => {
  const styles = useStylesheet();
  return (
    <Card className={className} contentContainerStyle={css(styles.root)}>
      <div className={css(styles.contentContainer)}>
        {iconIllustrationName && (
          <Illustration
            name={iconIllustrationName}
            alt={i`illustration`}
            className={css(styles.illustrationIconContainer)}
          />
        )}
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
    </Card>
  );
};
export default observer(SupportCard);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "flex-start",
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
        illustrationIconContainer: {
          alignSelf: "flex-start",
          zIndex: 1,
          height: 50,
          marginBottom: 10,
        },
        title: {
          fontSize: 20,
        },
        welcomeText: {
          fontSize: 14,
          color: textDark,
          marginTop: 8,
          marginBottom: 20,
          maxWidth: 610,
        },
        button: {
          maxWidth: 200,
        },
      }),
    [textDark],
  );
};
