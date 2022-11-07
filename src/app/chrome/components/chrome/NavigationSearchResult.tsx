import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import * as fonts from "@core/toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationSearchResult } from "@chrome/search/searchStore";

import Link from "@core/components/Link";
import NextImage from "@core/components/Image";
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly result: NavigationSearchResult;
  readonly isSelected?: boolean;
};

export default observer((props: Props) => {
  const {
    className,
    style,
    result: { title, description, breadcrumbs, url, imageUrl },
  } = props;
  const styles = useStylesheet(props);
  return (
    <Link className={css(className, style)} href={url}>
      <div className={css(styles.root)}>
        {imageUrl && (
          <NextImage className={css(styles.image)} src={imageUrl} alt="TODO" />
        )}
        <div className={css(styles.rightContent)}>
          {title && <Markdown className={css(styles.title)} text={title} />}
          {description && (
            <div className={css(styles.description)} title={description}>
              <Markdown text={description} />
            </div>
          )}
          {breadcrumbs && (
            <Markdown
              className={css(styles.breadcrumbs)}
              text={breadcrumbs.join("** / **")}
            />
          )}
        </div>
      </div>
    </Link>
  );
});

const useStylesheet = ({ isSelected }: Props) => {
  const { textWhite, textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
          cursor: "pointer",
          padding: "10px 10px",
          minHeight: 66,
          transition: "background-color 0.1s linear",
          backgroundColor: isSelected ? "rgba(47, 183, 236, 0.2)" : textWhite,
        },
        image: {
          height: 50,
          marginRight: 10,
        },
        title: {
          fontSize: 17,
          margin: "2px 0px",
          fontWeight: fonts.weightSemibold,
          color: textBlack,
        },
        rightContent: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
        },
        description: {
          fontSize: 14,
          margin: "2px 0px",
          color: textBlack,
          fontWeight: fonts.weightNormal,
        },
        breadcrumbs: {
          fontSize: 12,
          margin: "2px 0px",
          fontWeight: fonts.weightSemibold,
          color: textBlack,
        },
      }),
    [isSelected, textWhite, textBlack],
  );
};
