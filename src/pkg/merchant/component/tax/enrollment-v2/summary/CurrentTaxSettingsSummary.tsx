import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import * as fonts from "@toolkit/fonts";
import { getCountryName } from "@toolkit/countries";
import { CountryCode } from "@toolkit/countries";

/* Merchant Components */
import USTaxSettingsTable from "./USTaxSettingsTable";
import CATaxSettingsTable from "./CATaxSettingsTable";
import MXTaxSettingsTable from "./MXTaxSettingsTable";
import CountryTaxSettingsTable from "./CountryTaxSettingsTable";
import GBTaxSettingsTable from "./GBTaxSettingsTable";
import DETaxSettingsTable from "./DETaxSettingsTable";

/* Schema */
import { UserEntityType } from "@schema/types";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

export type CurrentTaxSettingsSummaryProps = BaseProps & {
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly entityType: UserEntityType | null | undefined;
  readonly isValidated: boolean;
  readonly countryOfDomicile?: CountryCode | null;
  readonly editState: TaxEnrollmentV2State;
};

const CurrentTaxSettingsSummary: React.FC<CurrentTaxSettingsSummaryProps> = ({
  className,
  style,
  taxInfos,
  entityType,
  isValidated,
  countryOfDomicile,
  editState,
}: CurrentTaxSettingsSummaryProps) => {
  const [expandedCountries, setExpandedCountries] = useState<Set<CountryCode>>(
    new Set()
  );

  const styles = useStylesheet();

  const currentCountries = useMemo((): ReadonlyArray<CountryCode> => {
    return Array.from(new Set(taxInfos.map((info) => info.countryCode)));
  }, [taxInfos]);

  const renderCountrySettingsContent = (countryCode: CountryCode) => {
    const countryTaxInfos = taxInfos.filter(
      (info) => info.countryCode === countryCode
    );

    if (countryCode === "US") {
      return (
        <USTaxSettingsTable
          key={countryCode}
          className={css(styles.table)}
          taxInfos={countryTaxInfos}
        />
      );
    }

    if (countryCode === "CA") {
      return (
        <CATaxSettingsTable
          key={countryCode}
          className={css(styles.table)}
          taxInfos={countryTaxInfos}
          editState={editState}
        />
      );
    }

    if (countryCode === "MX") {
      return (
        <MXTaxSettingsTable
          key={countryCode}
          className={css(styles.table)}
          taxInfos={countryTaxInfos}
          entityType={entityType}
        />
      );
    }

    if (countryCode === "GB") {
      return (
        <GBTaxSettingsTable
          key={countryCode}
          className={css(styles.table)}
          taxInfos={countryTaxInfos}
          entityType={entityType}
          isValidated={isValidated}
          countryOfDomicile={countryOfDomicile}
        />
      );
    }

    if (countryCode === "DE") {
      return (
        <DETaxSettingsTable
          key={countryCode}
          className={css(styles.table)}
          taxInfos={countryTaxInfos}
          entityType={entityType}
          isValidated={isValidated}
          editState={editState}
        />
      );
    }

    return (
      <CountryTaxSettingsTable
        key={countryCode}
        className={css(styles.table)}
        countryCode={countryCode}
        taxInfos={countryTaxInfos}
        entityType={entityType}
        isValidated={isValidated}
        editState={editState}
      />
    );
  };

  const renderCountryHeader = (countryCode: CountryCode) => {
    return (
      <div className={css(styles.countryHeader)}>
        Tax for {getCountryName(countryCode)}
      </div>
    );
  };

  const renderCountrySettings = (countryCode: CountryCode) => {
    const onOpenToggled = (isOpen: boolean) => {
      const newCountries = new Set(expandedCountries);
      if (isOpen) {
        newCountries.add(countryCode);
      } else {
        newCountries.delete(countryCode);
      }
      setExpandedCountries(newCountries);
    };

    return (
      <Accordion
        key={countryCode}
        header={() => renderCountryHeader(countryCode)}
        onOpenToggled={onOpenToggled}
        isOpen={expandedCountries.has(countryCode)}
      >
        <div style={{ padding: "20px 30px" }}>
          {renderCountrySettingsContent(countryCode)}
        </div>
      </Accordion>
    );
  };

  if (taxInfos.length === 0) {
    return null;
  }

  return (
    <div className={css(styles.root, className, style)}>
      {currentCountries.map((countryCode: CountryCode) =>
        renderCountrySettings(countryCode)
      )}
    </div>
  );
};

export default observer(CurrentTaxSettingsSummary);

const useStylesheet = () => {
  const { surfaceLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        table: {
          border: `1px solid ${surfaceLight}`,
        },
        countryHeader: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          fontSize: 19,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.4,
          color: textBlack,
          cursor: "default",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
        reviewStatusLabel: {
          "@media (min-width: 900px)": {
            minWidth: 90,
          },
        },
        options: {
          marginLeft: 5,
        },
      }),
    [surfaceLight, textBlack]
  );
};
