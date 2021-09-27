import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

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
  const { surfaceLightest, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: surfaceLightest,
        },
        title: {
          fontSize: 12,
          marginLeft: 10,
          padding: "5px 0px",
          margin: "10px 10px",
          alignSelf: "flex-start",
          fontWeight: fonts.weightSemibold,
          textTransform: "uppercase",
          color: textBlack,
          borderBottom: `2px solid ${textBlack}`,
          cursor: "default",
        },
      }),
    [surfaceLightest, textBlack]
  );
};
