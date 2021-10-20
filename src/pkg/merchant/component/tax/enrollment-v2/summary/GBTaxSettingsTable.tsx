import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import {
  AccountTypeDisplayNames,
  GBNumberDisplayNameInfo,
} from "@toolkit/tax/types-v2";
import { CountryCode, UserEntityType } from "@schema/types";
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";
import { weightSemibold } from "@toolkit/fonts";

export type GBTaxSettingsTableProps = BaseProps & {
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly isValidated: boolean;
  readonly entityType: UserEntityType | null | undefined;
  readonly countryOfDomicile?: CountryCode | null;
};

const GBTaxSettingsTable: React.FC<GBTaxSettingsTableProps> = ({
  className,
  style,
  taxInfos,
  isValidated,
  entityType,
  countryOfDomicile,
}: GBTaxSettingsTableProps) => {
  const styles = useStylesheet();

  const info = useMemo(
    () => taxInfos.find(({ countryCode }) => countryCode === "GB"),
    [taxInfos],
  );

  if (info == null) {
    return null;
  }

  const { taxNumber } = info;

  if (taxNumber == null) {
    return null;
  }
  const { gbMerchantState, gbIndividualState } = info;
  if (gbMerchantState == null || gbIndividualState == null) {
    return null;
  }

  const { title, desc } =
    entityType === "INDIVIDUAL"
      ? GBNumberDisplayNameInfo[gbIndividualState.selectedValue]
      : GBNumberDisplayNameInfo[gbMerchantState.selectedValue];

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

      {countryOfDomicile == "GB" && (
        <>
          {renderInnerBorder()}
          <div className={css(styles.left)}>
            <div className={css(styles.title)}>{title}</div>
            <Info className={css(styles.info)} text={desc} />
          </div>
          <div className={css(styles.right)}>
            <div className={css(styles.text)}>{taxNumber}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(GBTaxSettingsTable);

const useStylesheet = () => {
  const { textBlack, borderPrimary, surfaceLightest } = useTheme();
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
    [textBlack, borderPrimary, surfaceLightest],
  );
};
