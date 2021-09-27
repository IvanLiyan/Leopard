import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import FontAwesome from "react-fontawesome";

/* Lego Components */
import { Select } from "@ContextLogic/lego";
import { Chevron } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { Flags4x3 } from "@toolkit/countries";

/* Merchant Components */
import LocaleButton from "@merchant/component/nav/LocaleButton";

/* Toolkit */
import Locales, { Locale } from "@toolkit/locales";
import { call } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import UserStore from "@merchant/stores/UserStore";
import RouteStore from "@merchant/stores/RouteStore";
import DimenStore from "@merchant/stores/DimenStore";
import { ThemeWrapper } from "@merchant/stores/ThemeStore";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type AppLocaleSelectorProps = BaseProps & {
  readonly compressOnSmallScreen?: boolean;
  readonly textColor?: string;
};

@observer
class AppLocaleSelector extends Component<AppLocaleSelectorProps> {
  onLocaleChanged = async (locale: Locale) => {
    const navigationStore = NavigationStore.instance();
    await call("change-locale", { locale });
    navigationStore.reload({ fullReload: true }); // full reload required to load app in new language
  };

  @computed
  get iconStyle() {
    return {
      width: 16,
      marginRight: 7,
      borderRadius: 2,
    };
  }

  @computed
  get styles() {
    const { textColor } = this.props;

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
        color: textColor || palettes.textColors.White,
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
        color: textColor || palettes.textColors.White,
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
        color: "white",
      },
      chevronChrome: {
        marginTop: 2,
        marginLeft: 7,
        marginRight: -7,
        height: 10,
      },
    });
  }

  renderButtonForBlueNav = (option: Option<Locale> | null | undefined) => {
    const text = option?.text;

    return (
      <div
        className={css(this.styles.navButton)}
        style={{ padding: "0px 20px" }}
      >
        {option && option.img && (
          <img src={option.img} style={this.iconStyle} />
        )}
        <div className={css(this.styles.textContainer)}>
          <div className={css(this.styles.text)}>{text}</div>
          <FontAwesome
            name="chevron-down"
            className={css(this.styles.chevron)}
          />
        </div>
      </div>
    );
  };

  renderButtonForChrome = (option: Option<Locale> | null | undefined) => {
    return (
      <div
        className={css(this.styles.chromeNavButton)}
        style={{ padding: "0px 11px" }}
      >
        {option && option.img && (
          <img
            src={option.img}
            style={{
              width: 20,
              borderRadius: 3,
            }}
          />
        )}
        <Chevron
          direction="down"
          color="black"
          className={css(this.styles.chevronChrome)}
        />
      </div>
    );
  };

  @computed
  get localeOptions(): ReadonlyArray<Option<Locale>> {
    const { availableLocales } = LocalizationStore.instance();
    return availableLocales.map<Option<Locale>>((code: Locale) => {
      const localeInfo = Locales[code];
      const countryCode = localeInfo.country.toLowerCase();
      const { [countryCode]: img } = Flags4x3;

      return {
        img,
        text: localeInfo.name,
        value: code,
      };
    });
  }

  @computed
  get showLocalButton(): boolean {
    // show default locale button for either non-login user or specific external pages
    const { isLoggedIn } = UserStore.instance();
    const routeStore = RouteStore.instance();
    return (
      !isLoggedIn ||
      routeStore.currentPath === "/partner-developer" ||
      (!!routeStore.currentPath &&
        routeStore.currentPath.startsWith(
          "/documentation/api/v3/release-notes"
        ))
    );
  }

  render() {
    const { isWebview } = AppStore.instance();
    const { isSmallScreen } = DimenStore.instance();
    const { isNavyBlueNav } = NavigationStore.instance();
    const { locale: currentLocale } = LocalizationStore.instance();

    if (isWebview) {
      return null;
    }

    const { compressOnSmallScreen = true, className } = this.props;

    const Button = ({ option }: { readonly option: Option<Locale> }) => {
      if (this.showLocalButton) {
        return (
          <LocaleButton
            {...option}
            compressOnSmallScreen={compressOnSmallScreen}
          />
        );
      }

      if (isNavyBlueNav) {
        return this.renderButtonForChrome(option);
      }

      return this.renderButtonForBlueNav(option);
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
