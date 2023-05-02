import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Card, Markdown, H4Markdown } from "@ContextLogic/lego";

import { css } from "@core/toolkit/styling";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ArticleCardProps = BaseProps & {
  readonly titleText: string;
  readonly contentText: string;
  readonly bannerUrl: IllustrationName;
};

const ArticleCard = (props: ArticleCardProps) => {
  const { titleText, contentText, className, style, bannerUrl } = props;
  const styles = useStylesheet();
  return (
    <Card className={className} style={style}>
      <Illustration
        style={styles.bannerWrapper}
        styleImg={{
          position: "absolute",
          height: 120,
          width: "unset",
        }}
        name={bannerUrl}
        alt={titleText}
      />
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
export default observer(ArticleCard);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        bannerWrapper: {
          position: "relative",
          height: 120,
          overflow: "hidden",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
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
    [textDark],
  );
};
