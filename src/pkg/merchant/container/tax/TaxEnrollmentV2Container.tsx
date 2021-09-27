/*
 * TaxEnrollmentV2Container.tsx
 *
 * Created by Jonah Dlin on Wed Nov 25 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, StepsIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

import { CountryCode } from "@toolkit/countries";

/* Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

/* Merchant Components */
import EnrollmentSummary from "@merchant/component/tax/enrollment-v2/EnrollmentSummary";
import SelectDestinationsStep from "@merchant/component/tax/enrollment-v2/SelectDestinationsStep";
import EUProvideShipFromLocation from "@merchant/component/tax/enrollment-v2/eu/EUProvideShipFromLocation";

/* Schema */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Toolkit */
import { TaxEnrollmentV2InitialData } from "@toolkit/tax/types-v2";

import { useCurrentCountry } from "@toolkit/tax/util";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useTaxStore } from "@merchant/stores/TaxStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";
import PerCountrySettings from "@merchant/component/tax/enrollment-v2/PerCountrySettings";

export type Props = {
  readonly initialData: TaxEnrollmentV2InitialData;
};

const ENROLLMENT_STEPS = [
  { title: i`Select countries for tax collection` },
  { title: i`Provide tax information` },
  { title: i`Review summary` },
];

const TaxEnrollmentV2Container: React.FC<Props> = ({ initialData }: Props) => {
  const taxStore = useTaxStore();
  const routeStore = useRouteStore();
  const navigationStore = useNavigationStore();
  const currentCountry = useCurrentCountry();
  const currentStepIndex = useCurrentStepIndex();

  const {
    platformConstants: {
      euVatCountries,
      tax: {
        us: {
          marketplaceStates: usMarketplaceStates,
          marketplaceMunicipalities: usMarketplaceMunicipalities,
          nomadStates: usNomadStates,
          homeRuleStates: usHomeRuleStates,
        },
        ca: {
          pstQstProvinces: caPstQstProvinces,
          marketplaceProvinces: caMarketplaceProvinces,
        },
        marketplaceUnions,
      },
    },
    currentUser: { entityType },
    currentMerchant: {
      countryOfDomicile: originalCountryOfDomicile,
      shippingOrigins,
      tax: { settings, enrollableCountries },
      sellerVerification: { hasCompleted },
      euVatTax: { euVatSelfRemittanceEligible, euVatEntityStatus },
    },
  } = initialData;

  const isEuVatLaunched = useMemo(() => {
    const euLaunchDateInfo = marketplaceUnions.filter(
      ({ union: { code } }) => code === "EU"
    )[0]?.launchDate;
    return euLaunchDateInfo?.hasPassed === true;
  }, [marketplaceUnions]);

  const euVatCountryCodes = useMemo(
    () => new Set(euVatCountries.map(({ code }) => code)),
    [euVatCountries]
  );

  const isOss = useMemo(() => {
    const searchedOssCountry = (settings || []).find(
      ({ taxNumberType }) => taxNumberType === "OSS"
    );
    return searchedOssCountry != null;
  }, [settings]);

  useEffect(() => {
    if (!originalCountryOfDomicile) {
      navigationStore.navigate("/seller-profile-verification");
    }
  }, [navigationStore, originalCountryOfDomicile]);

  const editState: TaxEnrollmentV2State = useMemo(() => {
    const gbShipping = (shippingOrigins || []).find(
      ({ destinationRegion }) => destinationRegion === "GB"
    );
    const gbShipFromLocation = gbShipping
      ? (gbShipping.originCountryCode as CountryCode)
      : undefined;

    const usNoStateLevelTaxIDRequiredStates = [
      ...usNomadStates,
      ...usMarketplaceStates,
    ];

    const taxInfos: ReadonlyArray<CommerceMerchantTaxInfo> = (settings || [])
      .filter(({ status }) => status != "INACTIVE")
      .map((setting) => {
        const isNoTaxNumberRequired =
          (setting.authority.country.code === "US" &&
            setting.authority.stateCode != null &&
            usNoStateLevelTaxIDRequiredStates.includes(
              setting.authority.stateCode
            )) ||
          setting.taxNumberType === "OSS";

        return new CommerceMerchantTaxInfo({
          id: setting.id,
          state_code: setting.authority.stateCode || undefined,
          tax_number: setting.taxNumber,
          numberIsInvalid:
            !isNoTaxNumberRequired &&
            (setting.taxNumber == null || setting.taxNumber.length == 0),
          country_code: setting.authority.country.code,
          review_status: setting.reviewStatus || undefined,
          authority_level: setting.authority.level,
          last_updated: setting.lastUpdated.unix,
          status: setting.status,
          display_name: setting.authority.displayName,
          certificate_file_url: setting.certificateFileUrl,
          de_no_number_reason: setting.germanyDetails?.noNumberReason,
          mx_default_ship_from_is_mx:
            setting.mexicoDetails?.defaultShipFromIsMx,
          taxNumberType: setting.taxNumberType,
          gbShipFromLocation,
          euDetails: setting.euDetails,
          oss_registration_country_code: setting.ossRegistrationCountry?.code,
          eu_vat_country_codes: euVatCountryCodes,
        });
      });

    return new TaxEnrollmentV2State({
      savedTaxInfos: taxInfos,
      savedCountryOfDomicile: originalCountryOfDomicile?.code,
      entityType,
      shippingOrigins,
      usMarketplaceStates,
      usMarketplaceMunicipalities,
      usNoStateLevelTaxIDRequiredStates,
      usNomadStates,
      usHomeRuleStates,
      caPstQstProvinces,
      caMarketplaceProvinces,
      marketplaceUnions,
      hasCompletedSellerVerification: hasCompleted,
      enrollableCountries,
      euVatSelfRemittanceEligible,
      euVatEntityStatus,
      isEuVatLaunched,
      isOss,
      euVatCountryCodes,
    });
  }, [
    settings,
    shippingOrigins,
    originalCountryOfDomicile,
    usMarketplaceStates,
    usMarketplaceMunicipalities,
    entityType,
    usNomadStates,
    usHomeRuleStates,
    caPstQstProvinces,
    caMarketplaceProvinces,
    marketplaceUnions,
    hasCompleted,
    enrollableCountries,
    euVatSelfRemittanceEligible,
    euVatEntityStatus,
    isEuVatLaunched,
    isOss,
    euVatCountryCodes,
  ]);

  useMountEffect(() => {
    const { availableCountries } = taxStore;
    if (availableCountries.length === 0) {
      navigationStore.navigate("/");
      return;
    }
  });

  const styles = useStylesheet();

  const renderContent = () => {
    if (currentCountry == null) {
      if (routeStore.currentPath === "/tax/v2-enroll") {
        return <SelectDestinationsStep editState={editState} />;
      }

      if (
        !isEuVatLaunched &&
        routeStore.currentPath === "/tax/v2-enroll/eu-ship-from"
      ) {
        return <EUProvideShipFromLocation editState={editState} />;
      }

      if (routeStore.currentPath === "/tax/v2-enroll/review") {
        return <EnrollmentSummary editState={editState} />;
      }

      return null;
    }

    return <PerCountrySettings editState={editState} />;
  };

  if (!originalCountryOfDomicile) {
    return null;
  }

  return (
    <PageRoot>
      <PageGuide>
        <section className={css(styles.pageTitle)}>Set up taxes</section>
        <StepsIndicator
          steps={ENROLLMENT_STEPS}
          completedIndex={currentStepIndex}
          className={css(styles.stepsIndicator)}
        />

        <Card className={css(styles.content)}>{renderContent()}</Card>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(TaxEnrollmentV2Container);

const useCurrentStepIndex = (): number => {
  const { currentPath } = useRouteStore();

  if (currentPath == "/tax/v2-enroll") {
    return 0;
  }

  if (currentPath == "/tax/v2-enroll/review") {
    return 2;
  }

  return 1;
};

const useStylesheet = () => {
  const { textBlack, textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pageTitle: {
          fontSize: 24,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.33,
          color: textBlack,
          marginBottom: 20,
          marginTop: 56,
        },
        content: {
          flex: 1,
          animationName: [
            {
              from: {
                transform: "translate(-5px)",
                opacity: 0.3,
              },

              to: {
                transform: "translate(0px)",
                opacity: 1,
              },
            },
          ],
          animationDuration: "400ms",
        },
        stepsIndicator: {
          marginBottom: 15,
        },
        numCountries: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          color: textLight,
        },
        stepsText: {
          fontSize: 16,
          lineHeight: 1.5,
          cursor: "default",
          fontWeight: fonts.weightMedium,
          userSelect: "none",
          color: textLight,
        },
        titleLine: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      }),
    [textBlack, textLight]
  );
};
