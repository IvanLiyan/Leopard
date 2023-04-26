import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Card, Markdown, H4Markdown } from "@ContextLogic/lego";

import { css } from "@core/toolkit/styling";
import { IllustrationName } from "@core/components/Illustration";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SupportCardProps = BaseProps & {
  readonly titleText: string;
  readonly contentText: string;
  readonly bannerUrl: IllustrationName;
};

const SupportCard = (props: SupportCardProps) => {
  const { titleText, contentText, className } = props;
  const styles = useStylesheet(props);
  return (
    <Card className={className} contentContainerStyle={css(styles.root)}>
      <div className={css(styles.bannerBackground)} />
      <div className={css(styles.contentContainer)}>
        <Markdown
          className={css(styles.subheading)}
          text={i`Products`}
          openLinksInNewTab
        />
        <H4Markdown text={titleText} className={css(styles.title)} />
        <Markdown
          className={css(styles.bodyText)}
          text={contentText}
          openLinksInNewTab
        />
      </div>
    </Card>
  );
};
export default observer(SupportCard);

const useStylesheet = ({ bannerUrl }: SupportCardProps) => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: "90%",
          position: "relative",
        },
        bannerBackground: {
          backgroundImage: `url(${bannerUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 120,
          width: "100%",
        },
        contentContainer: {
          padding: 24,
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
        subheading: {
          color: textDark,
          fontSize: 14,
        },
        title: {
          fontSize: 20,
        },
        bodyText: {
          fontSize: 16,
          color: textDark,
          marginTop: 8,
          marginBottom: 20,
          maxWidth: 610,
        },
        button: {
          maxWidth: 200,
        },
      }),
    [textDark, bannerUrl],
  );
};
