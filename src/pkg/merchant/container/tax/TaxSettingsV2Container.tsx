/*
 * TaxSettingsV2Container.tsx
 *
 * Created by Jonah Dlin on Wed Nov 25 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

import { StyleSheet } from "aphrodite";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import SettingsCard from "@merchant/component/tax/v2/SettingsCard";
import DomicileCard from "@merchant/component/tax/v2/DomicileCard";
import TaxReportCard from "@merchant/component/tax/v2/TaxReportCard";

/* Plus Components */
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";

/* Toolkit */
import { getTaxRows } from "@toolkit/tax/util";

/* Schema */
import { CountryCode, UserSchema } from "@schema/types";
import {
  TaxSettingsInitialDataType,
  TaxConstants,
} from "@toolkit/tax/types-v2";

export type Props = {
  readonly initialData: TaxSettingsInitialDataType;
};

const TaxSettingsV2Container: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const {
    currentUser: { entityType, accountManager },
    currentMerchant: {
      countryOfDomicile,
      businessAddress,
      shippingOrigins,
      shippingSettings,
      tax: {
        settings,
        hasConfiguredTaxesBefore: hasConfiguredTaxesBeforeOrganic,
      },
      euVatTax: { euVatSelfRemittanceEligible, euVatEntityStatus },
      sellerVerification: {
        hasCompleted: hasCompletedSellerVerification,
        canStart: canStartSellerVerification,
        kycVerification: { canStart: canStartKyc },
      },
    },
    platformConstants: {
      euVatCountries,
      tax: {
        us: {
          nomadStates: usNomadStates,
          marketplaceStates: usMarketplaceStates,
          marketplaceMunicipalities: usMarketplaceMunicipalities,
        },
        ca: {
          pstQstProvinces: caPstQstProvinces,
          marketplaceProvinces: caMarketplaceProvinces,
        },
        marketplaceUnions,
        marketplaceCountries,
      },
    },
  } = initialData;

  const euVatCountryCodes = useMemo(
    () => new Set((euVatCountries || []).map(({ code }) => code)),
    [euVatCountries]
  );

  const countryOfDomicileCode: CountryCode | null | undefined =
    countryOfDomicile == null ? null : countryOfDomicile.code;

  const shipsToEu: boolean = useMemo(() => {
    const shippingSettingsEnabledEUCountries = (shippingSettings || []).filter(
      ({ country: { code }, enabled }) =>
        enabled === true && euVatCountryCodes.has(code)
    );
    return (
      shippingSettingsEnabledEUCountries != null &&
      shippingSettingsEnabledEUCountries.length > 0
    );
  }, [shippingSettings, euVatCountryCodes]);

  const notDomiciledOrHaveBusinessAddressInEU =
    (countryOfDomicileCode == null ||
      !euVatCountryCodes.has(countryOfDomicileCode)) &&
    (businessAddress == null ||
      !euVatCountryCodes.has(businessAddress?.country?.code));

  const isEuVatQuestionnaireRequired =
    (euVatEntityStatus !== "NOT_STARTED" &&
      notDomiciledOrHaveBusinessAddressInEU) ||
    (shipsToEu &&
      (notDomiciledOrHaveBusinessAddressInEU || !euVatSelfRemittanceEligible));

  const accountType: Pick<UserSchema, "entityType">["entityType"] =
    entityType || "COMPANY";

  const hasConfiguredTaxesBefore =
    hasConfiguredTaxesBeforeOrganic ||
    (settings != null && settings.length > 0);

  const validationRequired = canStartSellerVerification || canStartKyc;

  const taxRows = useMemo(
    () =>
      getTaxRows({
        usNomadStates,
        usMarketplaceStates,
        usMarketplaceMunicipalities,
        caPstQstProvinces,
        caMarketplaceProvinces,
        marketplaceUnions,
        marketplaceCountries,
        settings,
        accountType,
        hasCompletedSellerVerification,
        euVatSelfRemittanceEligible,
        euVatEntityStatus,
        shippingOrigins,
        countryOfDomicileCode,
        euVatCountryCodes,
      }),
    [
      usNomadStates,
      usMarketplaceStates,
      usMarketplaceMunicipalities,
      caPstQstProvinces,
      caMarketplaceProvinces,
      marketplaceUnions,
      marketplaceCountries,
      settings,
      accountType,
      hasCompletedSellerVerification,
      euVatSelfRemittanceEligible,
      euVatEntityStatus,
      shippingOrigins,
      countryOfDomicileCode,
      euVatCountryCodes,
    ]
  );

  const taxConstants: TaxConstants = {
    type: "CA_TAX_CONSTANTS",
    pstAndQstCaProvinceCodes: caPstQstProvinces,
    mpfCaProvinceCodes: caMarketplaceProvinces,
  };

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Tax Settings`}
        breadcrumbs={[
          { name: i`Settings`, href: "/settings" },
          { name: i`Taxes`, href: window.location.href },
        ]}
        actions={
          countryOfDomicile &&
          !validationRequired && (
            <PrimaryButton href="/tax/v2-enroll">Set up taxes</PrimaryButton>
          )
        }
      />
      <PageGuide contentContainerStyle={css(styles.content)}>
        <SettingsCard
          className={css(styles.settingsCard)}
          countryOfDomicileCode={countryOfDomicileCode}
          hasConfiguredTaxesBefore={hasConfiguredTaxesBefore}
          taxRows={taxRows}
          taxConstants={taxConstants}
          shippingOrigins={shippingOrigins}
          verificationRequired={canStartSellerVerification || canStartKyc}
          euVatEntityStatus={euVatEntityStatus}
          euVatCountryCodes={euVatCountryCodes}
          euVatSelfRemittanceEligible={euVatSelfRemittanceEligible}
        />
        <DomicileCard
          className={css(styles.domicileCard)}
          hasCompletedSellerVerification={hasCompletedSellerVerification}
          countryOfDomicileCode={countryOfDomicileCode}
          verificationRequired={canStartSellerVerification || canStartKyc}
          euVatEntityStatus={euVatEntityStatus}
          isEuVatQuestionnaireRequired={isEuVatQuestionnaireRequired}
          accountManager={accountManager}
        />
        <TaxReportCard
          className={css(styles.taxReportCard)}
          isEnabled={countryOfDomicile && hasConfiguredTaxesBefore}
        />
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "18px 0px",
          display: "grid",
          gap: 18,
          gridTemplateColumns: "2fr 1fr",
        },
        settingsCard: {
          gridColumn: "1 / 3",
          gridRow: 1,
        },
        domicileCard: {
          gridColumn: 1,
          gridRow: 2,
        },
        taxReportCard: {
          gridColumn: 2,
          gridRow: 2,
        },
      }),
    []
  );
};

export default observer(TaxSettingsV2Container);
