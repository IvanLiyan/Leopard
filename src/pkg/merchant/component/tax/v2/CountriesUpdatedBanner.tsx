import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

type CountriesUpdatedBannerProps = BaseProps & {
  readonly countries: ReadonlyArray<string>;
};

const CountriesUpdatedBanner: React.FC<CountriesUpdatedBannerProps> = ({
  className,
  style,
  countries,
}: CountriesUpdatedBannerProps) => {
  const styles = useStylesheet();

  let bodyText = "";

  if (countries.length == 0) {
    return null;
  }

  if (countries.length == 1) {
    const [country] = countries;
    bodyText = i`You have set up taxes for ${country}.`;
  } else if (countries.length == 2) {
    const [country1, country2] = countries;
    bodyText = i`You have set up taxes for ${country1} and ${country2}.`;
  } else {
    const listOfCountries = countries.slice(0, countries.length - 1).join(", ");
    const lastCountry = countries[countries.length - 1];
    bodyText = i`You have set up taxes for ${listOfCountries}, and ${lastCountry}`;
  }

  return (
    <Banner
      sentiment="success"
      text={
        <div className={css(styles.bannerTextContainer, className, style)}>
          <div
            className={css(styles.bannerText)}
            style={{ fontWeight: fonts.weightBold }}
          >
            Your Tax Settings have been updated!
          </div>
          <div className={css(styles.bannerText)}>{bodyText}</div>
        </div>
      }
      showTopBorder
      contentAlignment="left"
    />
  );
};

export default observer(CountriesUpdatedBanner);

const useStylesheet = () => {
  const { borderPrimary, textBlack, pageBackground } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        font: {
          fontSize: 14,
          lineHeight: "20px",
        },
        editContainer: {
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          padding: "25px 25px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        editTitle: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          color: textBlack,
          marginBottom: 15,
          cursor: "default",
        },
        editDescription: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: textBlack,
          cursor: "default",
        },
        editButton: {
          marginTop: 25,
        },
        reviewStatusLabel: {
          minWidth: 90,
        },
        bannerTextContainer: {
          display: "flex",
          textAlign: "left",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        bannerText: {
          marginBottom: 4,
          color: textBlack,
        },
        dropdownWrapper: {
          padding: 24,
          backgroundColor: pageBackground,
        },
        dropdownContentWrapper: {
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          overflow: "hidden",
        },
        countryName: {
          display: "flex",
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        check: {
          height: 24,
          width: 24,
        },
      }),
    [borderPrimary, textBlack, pageBackground],
  );
};
