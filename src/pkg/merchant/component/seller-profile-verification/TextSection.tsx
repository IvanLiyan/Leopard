import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold } from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Store */
import { useTheme, AppTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export interface TextSectionStyles {
  spaceBetweenTitleAreaAndText?: number;
  spaceBetweenTitleAndSubtitle?: number;
  spaceBetweenParagraphs?: number;
  titleFontSize?: number;
  titleFontColor?: string;
  subtitleFontSize?: number;
  subtitleFontColor?: string;
  textFontSize?: number;
  textFontColor?: string;
  centerText?: boolean;
}

export interface TextSectionProps extends BaseProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly paragraphs: string[] | string;
  readonly textSectionStyles?: TextSectionStyles;
}

const TextSection = (props: TextSectionProps) => {
  const {
    className,
    style,
    title,
    subtitle,
    paragraphs,
    textSectionStyles,
  } = props;

  const theme = useTheme();
  const styles = useStylesheet(theme, textSectionStyles);

  const renderParagraphs = () => {
    if (typeof paragraphs == "string") {
      return (
        <Markdown
          className={css(styles.p)}
          openLinksInNewTab
          text={paragraphs}
        />
      );
    }
    return paragraphs.map((p) => (
      <Markdown className={css(styles.p)} key={p} openLinksInNewTab text={p} />
    ));
  };
  return (
    <div className={css(styles.root, style, className)}>
      {(title || subtitle) && (
        <div className={css(styles.titleArea)}>
          {title && <Markdown className={css(styles.title)} text={title} />}
          {subtitle && (
            <Markdown className={css(styles.subtitle)} text={subtitle} />
          )}
        </div>
      )}
      <div className={css(styles.paragraphs)}>{renderParagraphs()}</div>
    </div>
  );
};

export default TextSection;

const useStylesheet = (
  theme: AppTheme,
  textSectionStyles?: TextSectionStyles
) => {
  return useMemo(() => {
    const {
      spaceBetweenTitleAreaAndText,
      spaceBetweenTitleAndSubtitle,
      spaceBetweenParagraphs,
      titleFontSize,
      titleFontColor,
      subtitleFontSize,
      subtitleFontColor,
      textFontSize,
      textFontColor,
      centerText,
    } = textSectionStyles || {};

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch",
        lineHeight: 1.5,
      },
      titleArea: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap:
          spaceBetweenTitleAndSubtitle == null
            ? 8
            : spaceBetweenTitleAndSubtitle,
        marginBottom:
          spaceBetweenTitleAreaAndText == null
            ? 24
            : spaceBetweenTitleAreaAndText,
      },
      title: {
        fontWeight: weightBold,
        fontSize: titleFontSize || 24,
        color: titleFontColor || theme.textBlack,
        textAlign: centerText ? "center" : "left",
      },
      subtitle: {
        fontSize: subtitleFontSize || 18,
        color: subtitleFontColor || theme.textDark,
        textAlign: centerText ? "center" : "left",
      },
      paragraphs: {
        fontSize: textFontSize || 16,
        color: textFontColor || theme.textDark,
        display: "grid",
        gridTemplateColumns: "1fr",
        gridGap: spaceBetweenParagraphs == null ? 16 : spaceBetweenParagraphs,
      },
      p: {
        textAlign: centerText ? "center" : "justify",
      },
    });
  }, [theme, textSectionStyles]);
};
