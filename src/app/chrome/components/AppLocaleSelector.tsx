import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Select } from "@ContextLogic/lego";
import { Chevron } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { Flags4x3 } from "@core/toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";
import { Locales, useLocalizationStore } from "@core/stores/LocalizationStore";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useTheme } from "@core/stores/ThemeStore";

import NextImage from "@core/components/Image";
import { observer } from "mobx-react";
import { Locale } from "@schema";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import {
  ChangeLocalRequestType,
  ChangeLocalResponseType,
  CHANGE_LOCALE_MUTATION,
} from "../localeMutations";

export type AppLocaleSelectorProps = BaseProps & {
  readonly textColor?: string;
  readonly customLocales?: ReadonlyArray<Locale>;
};

const AppLocaleSelector: React.FC<AppLocaleSelectorProps> = ({
  className,
  style,
  textColor,
  customLocales,
}) => {
  const styles = useStylesheet({ textColor });

  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const { availableLocales, locale: currentLocale } = useLocalizationStore();
  const { textDark } = useTheme();

  const [changeLocale, { loading: isLoading }] = useMutation<
    ChangeLocalResponseType,
    ChangeLocalRequestType
  >(CHANGE_LOCALE_MUTATION);

  const onLocaleChanged = async (locale: Locale): Promise<void> => {
    const response = await changeLocale({ variables: { input: { locale } } });
    if (!response.data?.locale.changeLocale.ok) {
      toastStore.error(
        response.data?.locale.changeLocale.message ?? i`Something went wrong`,
      );
      return;
    }
    navigationStore.reload({ fullReload: true }); // full reload required to load app in new language
  };

  const localeOptions = useMemo((): ReadonlyArray<Option<Locale>> => {
    return (customLocales || availableLocales).map<Option<Locale>>(
      (code: Locale) => {
        const localeInfo = Locales[code];
        const countryCode = localeInfo.country.toLowerCase();
        const { [countryCode]: img } = Flags4x3;
        return {
          img: `/md${img.src}`,
          text: localeInfo.name,
          value: code,
        };
      },
    );
  }, [customLocales, availableLocales]);

  const { isSmallScreen } = useDeviceStore();

  return (
    <Select
      className={css(className, style)}
      options={localeOptions}
      onSelected={onLocaleChanged}
      iconStyle={{
        width: 16,
        marginRight: 7,
        borderRadius: 2,
      }}
      renderButton={(option) => (
        <div
          className={css(styles.chromeNavButton)}
          style={{ padding: "0px 11px" }}
        >
          {option && option.img && (
            <NextImage
              src={option.img}
              className={css({
                width: 20,
                borderRadius: 3,
              })}
              alt="button image"
            />
          )}
          <Chevron
            direction="down"
            color={textDark}
            className={css(styles.chevronChrome)}
          />
        </div>
      )}
      selectedValue={currentLocale}
      minWidth={260}
      buttonHeight={35}
      listMaxHeight={isSmallScreen ? undefined : 600}
      disabled={isLoading}
    />
  );
};

const useStylesheet = ({
  textColor,
}: Pick<AppLocaleSelectorProps, "textColor">) => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
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
      }),
    [textWhite, textColor],
  );
};

export default observer(AppLocaleSelector);
