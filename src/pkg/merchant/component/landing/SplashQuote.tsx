import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type SplashQuoteProps = BaseProps & {
  readonly text: string;
  readonly name: string;
};

const SplashQuote = (props: SplashQuoteProps) => {
  const { style, className, text, name } = props;
  const styles = useStylesheet(props);

  return (
    <section className={css(styles.root, className, style)}>
      <div className={css(styles.line)}>{text}</div>
      <div className={css(styles.name)}>{name}</div>
    </section>
  );
};

export default observer(SplashQuote);

const useStylesheet = (props: SplashQuoteProps) => {
  const { isIE } = AppStore.instance();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          width: isIE ? "100%" : undefined,
        },
        line: {
          width: "100%",
          padding: "10px 0px",
          textAlign: "center",
          fontSize: 23,
          color: palettes.textColors.DarkInk,
        },
        name: {
          width: "100%",
          color: palettes.textColors.DarkInk,
          fontSize: 17,
          textAlign: "center",
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          marginTop: 14,
        },
      }),
    [isIE]
  );
};
