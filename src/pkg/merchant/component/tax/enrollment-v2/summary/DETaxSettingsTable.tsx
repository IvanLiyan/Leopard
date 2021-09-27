import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info, Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";
import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { AccountTypeDisplayNames } from "@toolkit/tax/types-v2";
import { UserEntityType } from "@schema/types";
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";
import { weightSemibold } from "@toolkit/fonts";
import { useTaxStore } from "@merchant/stores/TaxStore";

export type DETaxSettingsTableProps = BaseProps & {
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
  readonly isValidated: boolean;
  readonly entityType: UserEntityType | null | undefined;
  readonly editState: TaxEnrollmentV2State;
};

const DETaxSettingsTable: React.FC<DETaxSettingsTableProps> = ({
  className,
  style,
  taxInfos,
  isValidated,
  entityType,
  editState,
}: DETaxSettingsTableProps) => {
  const styles = useStylesheet();

  const info = useMemo(
    () => taxInfos.find(({ countryCode }) => countryCode === "DE"),
    [taxInfos],
  );

  const { getTaxNumberName, getTaxDescription } = useTaxStore();

  const isOss = editState.isOss;
  const title = getTaxNumberName({
    countryCode: "DE",
    entityType: entityType || undefined,
    isOss,
  });
  const desc = getTaxDescription({
    countryCode: "DE",
    entityType: entityType || undefined,
    isOss,
  });

  if (info == null) {
    return null;
  }

  const { taxNumber, deUstSt1T1Number, certificateFileUrl } = info;

  if (taxNumber == null) {
    return null;
  }

  const isCompany = entityType !== "INDIVIDUAL";

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

      {isCompany && (
        <>
          {renderInnerBorder()}
          <div className={css(styles.left)}>
            <div className={css(styles.title)}>{`USt 1 TI Number`}</div>
            <Info
              className={css(styles.info)}
              text={
                i`This number appears on the tax certificate issued by ` +
                i`German Tax Authorities (Bundeszentralamt für Steuern) to ` +
                i`merchants with tax obligations and registration in Germany.`
              }
            />
          </div>
          <div className={css(styles.right)}>
            {deUstSt1T1Number != null && (
              <div className={css(styles.text)}>{deUstSt1T1Number}</div>
            )}
          </div>
        </>
      )}

      {certificateFileUrl != null && certificateFileUrl.length && (
        <>
          {renderInnerBorder()}
          <div className={css(styles.left)}>
            <div className={css(styles.title)}>Tax certificate</div>
          </div>
          <div className={css(styles.right)}>
            <div className={css(styles.text)}>
              <Link href={certificateFileUrl} download openInNewTab>
                View
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(DETaxSettingsTable);

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
