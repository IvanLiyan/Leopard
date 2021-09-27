import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CountryCode } from "@toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useTaxStore } from "@merchant/stores/TaxStore";
import { UserEntityType } from "@schema/types";
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";
import { weightSemibold } from "@toolkit/fonts";
import { AccountTypeDisplayNames } from "@toolkit/tax/types-v2";
import { Info } from "@ContextLogic/lego";

import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

export type CountryTaxSettingsTableProps = BaseProps & {
  readonly countryCode: CountryCode;
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly entityType: UserEntityType | null | undefined;
  readonly isValidated: boolean;
  readonly editState: TaxEnrollmentV2State;
};

const CountryTaxSettingsTable: React.FC<CountryTaxSettingsTableProps> = ({
  className,
  style,
  countryCode,
  taxInfos,
  entityType,
  isValidated,
  editState,
}: CountryTaxSettingsTableProps) => {
  const styles = useStylesheet();

  const info = useMemo(
    () => taxInfos.find(({ countryCode: infoCC }) => infoCC === countryCode),
    [taxInfos, countryCode]
  );

  const { getTaxNumberName, getTaxDescription } = useTaxStore();

  const isOss = editState.isOss;
  const title = getTaxNumberName({
    countryCode,
    entityType: entityType || undefined,
    isOss,
  });
  const desc = getTaxDescription({
    countryCode,
    entityType: entityType || undefined,
    isOss,
  });

  if (info == null) {
    return null;
  }

  const { taxNumber } = info;

  if (taxNumber == null) {
    return null;
  }

  const renderInnerBorder = () => <div className={css(styles.border)} />;

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.left)}>
        <div className={css(styles.title)}>Account type</div>
      </div>
      <div className={css(styles.right)}>
        <div className={css(styles.text)}>
          {AccountTypeDisplayNames[entityType || "COMPANY"]}
        </div>
        {isValidated && (
          <ValidatedLabel className={css(styles.label)} state="VALIDATED" />
        )}
      </div>
      {renderInnerBorder()}
      <div className={css(styles.left)}>
        <div className={css(styles.title)}>{title}</div>
        {desc != null && <Info className={css(styles.info)} text={desc} />}
      </div>
      <div className={css(styles.right)}>
        <div className={css(styles.text)}>{taxNumber}</div>
      </div>
    </div>
  );
};

export default observer(CountryTaxSettingsTable);

const useStylesheet = () => {
  const { borderPrimary, textBlack, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          backgroundColor: surfaceLightest,
          alignItems: "center",
        },
        border: {
          gridColumn: "1 / 3",
          height: 0,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        left: {
          display: "flex",
          alignItems: "center",
          gridColumn: 1,
          padding: "14px 0px 14px 24px",
        },
        title: {
          color: textBlack,
          fontSize: 16,
          lineHeight: 1.5,
          fontWeight: weightSemibold,
        },
        info: { marginLeft: 4 },
        right: {
          display: "flex",
          alignItems: "center",
          gridColumn: 2,
          padding: "14px 0px 14px 24px",
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
        },
        label: {
          marginLeft: 12,
        },
      }),
    [borderPrimary, textBlack, surfaceLightest]
  );
};
