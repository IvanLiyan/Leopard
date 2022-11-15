import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import Flag from "@core/components/Flag";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { palettes } from "@deprecated/pkg/toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import Locales, { Locale } from "@chrome/locales";

import DeviceStore from "@core/stores/DeviceStore";
import { Option } from "@ContextLogic/lego";

import Icon from "@core/components/Icon";

type LocaleButtonProps = Option<Locale> & {
  readonly compressOnSmallScreen: boolean;
};

type LocaleButtonContext = LocaleButtonProps & {
  readonly showText: boolean;
};

const useLocaleButtonContext = (
  props: LocaleButtonProps,
): LocaleButtonContext => {
  const { compressOnSmallScreen } = props;
  const deviceStore = DeviceStore.instance();
  const showText = !compressOnSmallScreen || !deviceStore.isSmallScreen;
  return { ...props, showText };
};

const LocaleButton = (props: LocaleButtonProps) => {
  const context = useLocaleButtonContext(props);
  const styles = useStylesheet();
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
        <Icon name="chevronRightLarge" className={css(styles.chevron)} />
      </div>
    </div>
  );
};

export default observer(LocaleButton);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          borderRadius: 4,
          overflow: "hidden",
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
    [],
  );
};
