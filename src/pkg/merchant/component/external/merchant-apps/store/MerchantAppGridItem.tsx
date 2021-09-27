import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MerchantAppListing } from "@merchant/api/merchant-apps";

import { Locale } from "@toolkit/locales";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

type MerchantAppGridItemProps = BaseProps & {
  readonly merchantApp: MerchantAppListing;
  readonly selectedLanguages: ReadonlyArray<Locale>;
};

const MerchantAppGridItem = (props: MerchantAppGridItemProps) => {
  const styles = useStylesheet(props);
  const { merchantApp, selectedLanguages } = props;
  const { locale } = useLocalizationStore();

  // Show intro in one of the locales in selectedLanguages
  // if user's current locale is not available
  let intro = merchantApp.intros[locale];
  if (!intro) {
    const introLocale =
      selectedLanguages.find(
        (filterLocale) => merchantApp.intros[filterLocale]
      ) || "en";
    intro = merchantApp.intros[introLocale];
  }

  return (
    /* eslint-disable local-rules/use-link-component */
    <a href={`/merchant_apps/${merchantApp.client_id}`}>
      <div className={css(styles.root)}>
        {merchantApp.logo_source && (
          <div className={css(styles.imgContainer)}>
            <img
              className={css(styles.illustration)}
              src={merchantApp.logo_source}
            />
          </div>
        )}
        <div className={css(styles.text)}>
          <div className={css(styles.name)}>{merchantApp.name}</div>
          {intro && (
            <div className={css(styles.intro)}>
              {intro.length > 64 ? `${intro.substring(0, 61)}...` : intro}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default observer(MerchantAppGridItem);

const useStylesheet = (props: MerchantAppGridItemProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          ":hover": {
            backgroundColor: colors.white,
          },
          cursor: "pointer",
          padding: 10,
          minHeight: 73,
          alignItems: "center",
          "@media (max-width: 600px)": {
            flexDirection: "column",
          },
        },
        text: {},
        name: {
          fontSize: 20,
          color: palettes.textColors.Ink,
          marginBottom: 8,
          marginTop: 5,
          fontWeight: fonts.weightBold,
        },
        intro: {
          color: palettes.textColors.Ink,
          overflow: "hidden",
          fontWeight: fonts.weightMedium,
          fontSize: 14,
        },
        imgContainer: {
          display: "flex",
          backgroundColor: colors.white,
          flex: "0 0 75px",
          marginRight: 20,
          height: 75,
          justifyContent: "center",
          "@media (max-width: 600px)": {
            flexDirection: "column",
            marginBottom: 10,
            marginRight: 0,
          },
        },
        illustration: {
          alignSelf: "center",
          backgroundColor: "#ffffff",
          padding: 1,
          maxHeight: 75,
        },
      }),
    []
  );
};
