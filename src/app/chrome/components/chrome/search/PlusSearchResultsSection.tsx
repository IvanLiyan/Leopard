/* moved from
 * @plus/component/nav/chrome/search/SearchResultsSection.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import * as fonts from "@core/toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
};

const PlusSearchResultsSection = observer((props: Props) => {
  const { className, style, title, children } = props;
  const styles = useStylesheet();
  return (
    <section className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>{title}</div>
      {children}
    </section>
  );
});

export default PlusSearchResultsSection;

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
    [surfaceLightest, textBlack],
  );
};
