import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "@next-toolkit/Image";

export type SellerProfileTodoCardProps = BaseProps & {
  readonly title: string;
  readonly body: string;
  readonly imageUrl: string;
  readonly cta: {
    readonly text: string;
    readonly onClick?: () => unknown;
  };
};

const SellerProfileTodoCard = (props: SellerProfileTodoCardProps) => {
  const { title, body, imageUrl, cta, className, style } = props;
  const { text, onClick } = cta;
  const styles = useStylesheet();
  const rootCSS = css(styles.root, style, className);

  return (
    <div className={rootCSS}>
      <div className={css(styles.icon)}>
        <NextImage draggable="false" src={imageUrl} />
      </div>
      <div className={css(styles.content)}>
        <div className={css(styles.contentText)}>
          <div className={css(styles.title)}>
            <Markdown text={title} />
          </div>
          <div className={css(styles.body)}>
            <Markdown text={body} />
          </div>
        </div>
        <SecondaryButton
          style={{ fontSize: 16 }}
          onClick={onClick}
          padding="8px 90px"
        >
          {text}
        </SecondaryButton>
      </div>
    </div>
  );
};

export default SellerProfileTodoCard;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: palettes.textColors.White,
        },
        content: {
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 370,
        },
        contentText: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 18,
          fontWeight: fonts.weightBold,
          lineHeight: 1.33,
          color: palettes.textColors.Ink,
          marginBottom: 8,
          whiteSpace: "normal",
        },
        body: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          marginBottom: 16,
          whiteSpace: "normal",
        },
        icon: {
          width: 64,
          height: 64,
          marginRight: 12,
          alignSelf: "flex-start",
        },
      }),
    [],
  );
};
