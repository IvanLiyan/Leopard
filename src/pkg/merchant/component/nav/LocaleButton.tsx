import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as icons from "@assets/icons";

/* Toolkit */
import Locales, { Locale } from "@toolkit/locales";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { Option } from "@ContextLogic/lego";

type LocaleButtonProps = Option<Locale> & {
  readonly compressOnSmallScreen: boolean;
};

type LocaleButtonContext = LocaleButtonProps & {
  readonly showText: boolean;
};

const useLocaleButtonContext = (
  props: LocaleButtonProps
): LocaleButtonContext => {
  const { compressOnSmallScreen } = props;
  const { dimenStore } = AppStore.instance();
  const showText = !compressOnSmallScreen || !dimenStore.isSmallScreen;
  return { ...props, showText };
};

const LocaleButton = (props: LocaleButtonProps) => {
  const context = useLocaleButtonContext(props);
  const styles = useStylesheet(context);
  const { showText, text, value } = context;
  const { country: countryCode } = Locales[value];

  return (
    <div className={css(styles.root)}>
      {countryCode && (
        <Flag
          countryCode={countryCode}
          className={css(styles.icon)}
          aspectRatio="1x1"
        />
      )}
      <div className={css(styles.textContainer)}>
        {showText && <section className={css(styles.text)}>{text}</section>}
        <img src={icons.chevronRight} className={css(styles.chevron)} />
      </div>
    </div>
  );
};

export default observer(LocaleButton);

const useStylesheet = (ctx: LocaleButtonContext) => {
  const { showText } = ctx;

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: 4,
          overflow: "hidden",
          // eslint-disable-next-line local-rules/validate-root
          width: showText ? 95 : 30,
          height: 30,
          backgroundColor: palettes.textColors.White,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          userSelect: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          cursor: "pointer",
          border: "solid 1px #c4cdd5",
          color: palettes.textColors.DarkInk,
          padding: "0px 11px",
        },
        textContainer: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        text: {
          flex: 1,
          lineHeight: 1.43,
          fontSize: 13,
          marginRight: 10,
          color: palettes.textColors.Ink,
        },
        icon: {
          width: 13,
          height: 13,
          marginRight: 7,
          borderRadius: "100%",
          flexShrink: 0,
        },
        chevron: {
          transform: "rotate(90deg)",
          width: 13,
          height: 13,
        },
      }),
    [showText]
  );
};
