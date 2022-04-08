import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly title: string;
};

const SearchResultsSection = observer((props: Props) => {
  const { className, style, title, children } = props;
  const styles = useStylesheet();
  return (
    <section className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>{title}</div>
      {children}
    </section>
  );
});

export default SearchResultsSection;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: palettes.textColors.White,
        },
        title: {
          fontSize: 12,
          marginLeft: 10,
          padding: "5px 0px",
          margin: "10px 10px",
          alignSelf: "flex-start",
          fontWeight: fonts.weightSemibold,
          textTransform: "uppercase",
          color: palettes.textColors.Ink,
          borderBottom: `2px solid ${palettes.textColors.Ink}`,
          cursor: "default",
        },
      }),
    []
  );
};
