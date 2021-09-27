import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, Markdown, Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightNormal, weightSemibold } from "@toolkit/fonts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import {
  AccountTypeDisplayNames,
  GbDropdown,
  GBNumberDisplayNameInfo,
  isNonGbMerchantDropdown,
} from "@toolkit/tax/types-v2";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { getCountryName } from "@toolkit/countries";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

type Props = BaseProps & {
  readonly info: GbDropdown;
};

const GBMpfTaxInfo: React.FC<Props> = ({ className, style, info }: Props) => {
  const styles = useStylesheet();
  const { preferredProperLocale } = useLocalizationStore();

  const [title, desc] = useMemo(() => {
    if (isNonGbMerchantDropdown(info)) {
      return [
        GBNumberDisplayNameInfo.VAT.title,
        GBNumberDisplayNameInfo.VAT.desc,
      ];
    }

    const { taxNumberType } = info;

    if (taxNumberType == "TAX_IDENTIFICATION_NUMBER") {
      return [
        GBNumberDisplayNameInfo.TIN.title,
        GBNumberDisplayNameInfo.TIN.desc,
      ];
    }
    if (taxNumberType == "NATIONAL_INSURANCE_NUMBER") {
      return [
        GBNumberDisplayNameInfo.NIN.title,
        GBNumberDisplayNameInfo.NIN.desc,
      ];
    }
    if (taxNumberType == "COMPANY_REGISTRITION_NUMBER") {
      return [
        GBNumberDisplayNameInfo.CRN.title,
        GBNumberDisplayNameInfo.CRN.desc,
      ];
    }

    // taxNumberType == "VALUE_ADDED_TAX"
    return [
      GBNumberDisplayNameInfo.VAT.title,
      GBNumberDisplayNameInfo.VAT.desc,
    ];
  }, [info]);

  if (isNonGbMerchantDropdown(info)) {
    return null;
  }

  const {
    accountType,
    accountValidation,
    taxId,
    defaultShipFromLocation,
    lastUpdated,
  } = info;

  return (
    <>
      <Table
        className={css(className, style)}
        rowStyle={() => ({ minHeight: 68 })}
        style={{
          position: "static",
        }}
        hideBorder
      >
        <Table.FixtureColumn title={i`Your tax information`} width={135} />
        <Table.FixtureColumn />

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>Account type</div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            <div className={css(styles.accountTypeCell, styles.font)}>
              {AccountTypeDisplayNames[accountType || "COMPANY"]}
              <ValidatedLabel
                state={accountValidation}
                className={css(styles.accountTypeLabel)}
              />
            </div>
          </Table.FixtureCell>
        </Table.FixtureRow>

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>
              <Markdown text={title} />
              <Info
                className={css(styles.info)}
                popoverPosition="right center"
                text={() => (
                  <div className={css(styles.desc)}>
                    <Markdown className={css(styles.descText)} text={desc} />
                  </div>
                )}
              />
            </div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            <div className={css(styles.font)}>{taxId}</div>
          </Table.FixtureCell>
        </Table.FixtureRow>

        {defaultShipFromLocation && (
          <Table.FixtureRow>
            <Table.FixtureCell>
              <div className={css(styles.title)}>
                <Markdown text={i`Default ship-from location`} />
              </div>
            </Table.FixtureCell>
            <Table.FixtureCell>
              <Markdown
                className={css(styles.font)}
                text={i`Orders are shipped from ${getCountryName(
                  defaultShipFromLocation
                )}`}
              />
            </Table.FixtureCell>
          </Table.FixtureRow>
        )}

        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.title)}>Last updated</div>
          </Table.FixtureCell>
          <Table.FixtureCell>
            {lastUpdated != null &&
              new Date(lastUpdated.unix * 1000).toLocaleDateString(
                preferredProperLocale
              )}
          </Table.FixtureCell>
        </Table.FixtureRow>
      </Table>
    </>
  );
};

export default observer(GBMpfTaxInfo);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        font: {
          fontSize: 14,
          color: textBlack,
        },
        accountTypeCell: {
          display: "flex",
        },
        accountTypeLabel: {
          marginLeft: 8,
        },
        title: {
          paddingLeft: 14,
          display: "flex",
          alignItems: "center",
          fontWeight: weightSemibold,
          fontSize: 15,
          color: textBlack,
        },
        info: {
          marginLeft: 4,
        },
        desc: {
          display: "flex",
          flexDirection: "column",
          padding: 8,
          maxWidth: 250,
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
        descText: {
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: weightNormal,
        },
      }),
    [textBlack]
  );
};
