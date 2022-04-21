import React, { Component } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Select } from "@ContextLogic/lego";
import { Chevron } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Flags4x3 } from "@toolkit/countries";

/* Toolkit */
import Locales, { Locale } from "@toolkit/locales";
import { call } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import LocalizationStore from "@stores/LocalizationStore";
import NavigationStore from "@stores/NavigationStore";
import DeviceStore from "@stores/DeviceStore";
import { ThemeWrapper } from "@stores/ThemeStore";
import { ThemeContext } from "@stores/ThemeStore";
import EnvironmentStore from "@stores/EnvironmentStore";

import NextImage from "@next-toolkit/Image";

export type AppLocaleSelectorProps = BaseProps & {
  readonly textColor?: string;
  readonly customLocales?: ReadonlyArray<Locale>;
};

@observer
class AppLocaleSelector extends Component<AppLocaleSelectorProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  onLocaleChanged = async (locale: Locale): Promise<void> => {
    const navigationStore = NavigationStore.instance();
    await call("change-locale", { locale });
    navigationStore.reload({ fullReload: true }); // full reload required to load app in new language
  };

  @computed
  get iconStyle(): CSSProperties {
    return {
      width: 16,
      marginRight: 7,
      borderRadius: 2,
    };
  }

  @computed
  get styles() {
    const { textColor } = this.props;
    const { textWhite } = this.context;

    return StyleSheet.create({
      navButton: {
        borderRadius: 4,
        overflow: "hidden",
        minWidth: 95,
        height: 30,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        userSelect: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        cursor: "pointer",
        border: "solid 1px #c4cdd5",
        color: textColor || textWhite,
      },
      chromeNavButton: {
        borderRadius: 4,
        overflow: "hidden",
        height: 30,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        userSelect: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        cursor: "pointer",
        border: "solid 1px #c4cdd5",
        color: textColor || textWhite,
      },
      textContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      text: {
        flex: 1,
        lineHeight: 1.43,
        fontSize: 13,
        marginRight: 10,
      },
      chevron: {
        marginLeft: 10,
        color: textColor || textWhite,
      },
      chevronChrome: {
        marginTop: 2,
        marginLeft: 7,
        marginRight: -7,
        height: 10,
      },
    });
  }

  renderButtonForChrome = (option: Option<Locale> | null | undefined) => {
    const { textWhite, textDark } = this.context;

    const useLightIcon = false; // isDev || isStaging; TODO [lliepert] bring back once we have the top bar colour back
    return (
      <div
        className={css(this.styles.chromeNavButton)}
        style={{ padding: "0px 11px" }}
      >
        {option && option.img && (
          <NextImage
            src={option.img}
            className={css({
              width: 20,
              borderRadius: 3,
            })}
          />
        )}
        <Chevron
          direction="down"
          color={useLightIcon ? textWhite : textDark}
          className={css(this.styles.chevronChrome)}
        />
      </div>
    );
  };

  @computed
  get localeOptions(): ReadonlyArray<Option<Locale>> {
    const { customLocales } = this.props;
    const { availableLocales } = LocalizationStore.instance();
    return (customLocales || availableLocales).map<Option<Locale>>(
      (code: Locale) => {
        const localeInfo = Locales[code];
        const countryCode = localeInfo.country.toLowerCase();
        const { [countryCode]: img } = Flags4x3;
        return {
          img: img.src,
          text: localeInfo.name,
          value: code,
        };
      },
    );
  }

  render() {
    const { isWebview, isSmallScreen } = DeviceStore.instance();
    const isNavyBlueNav = true; // deprecated [lliepert] const { isNavyBlueNav } = NavigationStore.instance();
    const { locale: currentLocale } = LocalizationStore.instance();

    if (isWebview) {
      return null;
    }

    const { className } = this.props;

    const Button = ({ option }: { readonly option: Option<Locale> }) => {
      return this.renderButtonForChrome(option);
    };

    return (
      <ThemeWrapper>
        <Select
          className={css(className)}
          options={this.localeOptions}
          onSelected={this.onLocaleChanged}
          iconStyle={this.iconStyle}
          /* Override the select button if rendering for logged-in nav. */
          renderButton={(option) => (
            <Button option={option as Option<Locale>} />
          )}
          selectedValue={currentLocale}
          minWidth={isNavyBlueNav ? 260 : 200}
          buttonHeight={35}
          listMaxHeight={isSmallScreen ? undefined : 600}
        />
      </ThemeWrapper>
    );
  }
}

export default AppLocaleSelector;
