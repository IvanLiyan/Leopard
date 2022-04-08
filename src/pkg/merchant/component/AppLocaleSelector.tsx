import React, { Component } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import FontAwesome from "react-fontawesome";

/* Lego Components */
import { Select } from "@ContextLogic/lego";
import { Chevron } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Flags4x3 } from "@toolkit/countries";

/* Merchant Components */
import LocaleButton from "@merchant/component/nav/LocaleButton";

/* Toolkit */
import Locales, { Locale } from "@toolkit/locales";
import { call } from "@toolkit/api";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import LocalizationStore from "@stores/LocalizationStore";
import NavigationStore from "@stores/NavigationStore";
import UserStore from "@stores/UserStore";
import DeviceStore from "@stores/DeviceStore";
import { ThemeWrapper } from "@stores/ThemeStore";
import { ThemeContext } from "@stores/ThemeStore";
import EnvironmentStore from "@stores/EnvironmentStore";

import NextImage from "@next-toolkit/Image";

export type AppLocaleSelectorProps = BaseProps & {
  readonly compressOnSmallScreen?: boolean;
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

  renderButtonForBlueNav = (option: Option<Locale> | null | undefined) => {
    const text = option?.text;

    return (
      <div
        className={css(this.styles.navButton)}
        style={{ padding: "0px 20px" }}
      >
        {option && option.img && (
          <NextImage
            src={option.img}
            className={css(this.iconStyle)}
            height="12px"
            width="16px"
          />
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
    const { textWhite, textDark } = this.context;
    const { isDev, isStaging } = EnvironmentStore.instance();

    const useLightIcon = isDev || isStaging;
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
          img,
          text: localeInfo.name,
          value: code,
        };
      },
    );
  }

  @computed
  get showLocalButton(): boolean {
    // show default locale button for either non-login user or specific external pages
    const { isLoggedIn } = UserStore.instance();
    const navStore = NavigationStore.instance();
    return (
      !isLoggedIn ||
      navStore.currentPath === "/partner-developer" ||
      (!!navStore.currentPath &&
        navStore.currentPath.startsWith("/documentation/api/v3/release-notes"))
    );
  }

  render() {
    const { isWebview, isSmallScreen } = DeviceStore.instance();
    const isNavyBlueNav = true; // deprecated [lliepert] const { isNavyBlueNav } = NavigationStore.instance();
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
