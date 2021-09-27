/*
 * PerCountrySettings.tsx
 *
 * Created by Jonah Dlin on Thu Nov 26 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CountryPager } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightNormal } from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

/* Merchant Components */
import USEnrollment from "@merchant/component/tax/enrollment-v2/us/USEnrollment";
import CAEnrollment from "@merchant/component/tax/enrollment-v2/ca/CAEnrollment";
import DEEnrollment from "@merchant/component/tax/enrollment-v2/de/DEEnrollment";
import MXEnrollment from "@merchant/component/tax/enrollment-v2/mx/MXEnrollment";
import EUProvideTaxNumber from "@merchant/component/tax/enrollment-v2/eu/EUProvideTaxNumber";
import GBEnrollment from "@merchant/component/tax/enrollment-v2/gb/GBEnrollment";

/* Model */
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Toolkit */
import { useCurrentCountry } from "@toolkit/tax/util";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

export type PerCountrySettingsProps = BaseProps & {
  readonly editState: TaxEnrollmentV2State;
};

const PerCountrySettings: React.FC<PerCountrySettingsProps> = ({
  editState,
}: PerCountrySettingsProps) => {
  const styles = useStylesheet();
  const routeStore = useRouteStore();
  const currentCountry = useCurrentCountry();
  const navigationStore = useNavigationStore();
  const { currentEUCountries, currentCountries, countrySteps } = editState;

  useMountEffect(() => {
    if (currentCountry == null) {
      return;
    }
    const isEnrolledCountry = currentCountries.includes(currentCountry);
    if (!isEnrolledCountry) {
      navigationStore.navigate("/tax/v2-enroll");
    }
  });

  const renderCountryStep = (countryCode: CountryCode) => {
    if (countryCode === "US") {
      return <USEnrollment editState={editState} />;
    }

    if (countryCode === "CA") {
      return <CAEnrollment editState={editState} />;
    }

    if (countryCode === "DE") {
      return <DEEnrollment editState={editState} />;
    }

    if (countryCode === "MX") {
      return <MXEnrollment editState={editState} />;
    }

    if (countryCode === "GB") {
      return <GBEnrollment editState={editState} />;
    }

    // Monaco is a European country that is not in the EU
    if (currentEUCountries.includes(countryCode) || countryCode === "MC") {
      return (
        <EUProvideTaxNumber
          key={countryCode}
          countryCode={countryCode}
          editState={editState}
        />
      );
    }

    return null;
  };

  // PerCountrySettings should only be rendered when currentCountry is not null
  if (currentCountry == null) {
    return null;
  }

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.titleLine)}>
          <section className={css(styles.title)}>
            <span>Select countries for tax collection</span>
            &nbsp;
            {currentCountries.length > 1 && (
              <span className={css(styles.numCountries)}>
                ({currentCountries.length} countries selected)
              </span>
            )}
          </section>
        </div>
        <section className={css(styles.description)}>
          Select the jurisdictions where you have indirect tax (e.g. sales tax,
          GST and VAT) obligations. Some areas may have subjurisdiction-level
          settings for you to select.
        </section>
      </div>
      <CountryPager
        currentCountryCode={currentCountry}
        onTabChange={(countryCode) => {
          routeStore.push(`/tax/v2-enroll/${countryCode}`);
        }}
        maxVisibleTabs={4}
        hideHeaderBorder={false}
      >
        {countrySteps.map(({ countryCode }, idx: number) => {
          let enabled = false;
          if (currentCountry === countryCode) {
            enabled = true;
          } else {
            // Every country before this is ready for submission.
            enabled = countrySteps
              .slice(0, idx)
              .every(({ countryCode }) =>
                editState.countryIsReadyForSubmission(countryCode),
              );
          }

          return (
            <CountryPager.Content
              key={countryCode}
              countryCode={countryCode}
              style={{ paddingTop: 14 }}
              disabled={!enabled}
            >
              {renderCountryStep(countryCode)}
            </CountryPager.Content>
          );
        })}
      </CountryPager>
    </div>
  );
};

export default observer(PerCountrySettings);

const useStylesheet = () => {
  const { textBlack, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        titleContainer: {
          display: "flex",
          flexDirection: "column",
          padding: "20px 25px 30px 25px",
          color: textBlack,
        },
        title: {
          fontSize: 20,
          fontWeight: weightBold,
          lineHeight: 1.4,
          marginBottom: 8,
        },
        description: {
          fontSize: 15,
          fontWeight: weightNormal,
          lineHeight: 1.4,
        },
        numCountries: {
          fontSize: 16,
          fontWeight: weightNormal,
          color: textLight,
        },
        titleLine: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }),
    [textBlack, textLight],
  );
};
