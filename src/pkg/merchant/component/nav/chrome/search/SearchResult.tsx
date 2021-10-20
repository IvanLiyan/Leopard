import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationSearchResult } from "@stores/NavigationStore";

type Props = BaseProps & {
  readonly result: NavigationSearchResult;
  readonly isSelected?: boolean;
};

export default observer((props: Props) => {
  const {
    className,
    style,
    result: {
      title,
      description,
      breadcrumbs,
      url,
      image_url: imageUrl,
      open_in_new_tab: openInNewTab,
      nuggets = [],
    },
  } = props;
  const styles = useStylesheet(props);
  const filteredNuggets = nuggets.filter((nugget) => nugget != null);
  return (
    <Link
      className={css(className, style)}
      openInNewTab={openInNewTab}
      href={url}
    >
      <div className={css(styles.root)}>
        {imageUrl && <img className={css(styles.image)} src={imageUrl} />}
        <div className={css(styles.rightContent)}>
          <Markdown className={css(styles.title)} text={title} />
          {description && (
            <div className={css(styles.description)} title={description}>
              <Markdown text={description} />
            </div>
          )}
          {filteredNuggets && (
            <Markdown
              className={css(styles.nuggets)}
              text={filteredNuggets.join("** • **")}
            />
          )}
          {breadcrumbs && (
            <Markdown
              className={css(styles.breadcrumbs)}
              text={breadcrumbs.join("** > **")}
            />
          )}
        </div>
      </div>
    </Link>
  );
});

const useStylesheet = ({ isSelected }: Props) => {
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
          transition: "background-color 0.1s linear",
          backgroundColor: isSelected
            ? "rgba(47, 183, 236, 0.2)"
            : palettes.textColors.White,
        },
        image: {
          height: 50,
          marginRight: 10,
        },
        title: {
          fontSize: 15,
          margin: "1px 0px",
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.Ink,
        },
        rightContent: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
        },
        description: {
          fontSize: 12,
          margin: "1px 0px",
          maxWidth: 500,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightNormal,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        breadcrumbs: {
          fontSize: 12,
          margin: "1px 0px",
          color: palettes.textColors.DarkInk,
        },
        nuggets: {
          fontSize: 12,
          margin: "1px 0px",
          color: palettes.textColors.DarkInk,
          fontWeight: fonts.weightNormal,
        },
      }),
    [isSelected],
  );
};
