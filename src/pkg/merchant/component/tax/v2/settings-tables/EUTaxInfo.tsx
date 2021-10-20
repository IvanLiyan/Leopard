import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, Text, Layout, Link, Info } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { getCountryName } from "@toolkit/countries";

/* Toolkit */
import {
  AccountTypeDisplayNames,
  AccountType,
  ValidatedState,
} from "@toolkit/tax/types-v2";
import { TaxSettingTaxNumberType, CountryCode } from "@schema/types";

/* Merchant Components */
import ValidatedLabel from "@merchant/component/tax/v2/ValidatedLabel";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useLocalizationStore } from "@stores/LocalizationStore";

/* Toolkit */
import { infoCountries, getCountryTooltipText } from "@toolkit/tax/eu-vat";

type Props = BaseProps & {
  readonly accountType: AccountType;
  readonly accountValidation: ValidatedState;
  readonly ossNumber: string | null | undefined;
  readonly taxNumberType: TaxSettingTaxNumberType | null | undefined;
  readonly countryOfOssRegistration: CountryCode | null | undefined;
  readonly lastUpdated: number | null | undefined;
  readonly ustSt1T1Number?: string | null | undefined;
  readonly certificateFileUrl?: string | null | undefined;
};

const EUTaxInfo: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    accountType,
    accountValidation,
    ossNumber,
    taxNumberType,
    countryOfOssRegistration,
    lastUpdated,
    ustSt1T1Number,
    certificateFileUrl,
  } = props;

  const styles = useStylesheet();
  const { preferredProperLocale } = useLocalizationStore();

  const lastUpdatedString =
    lastUpdated != null
      ? new Date(lastUpdated * 1000).toLocaleDateString(preferredProperLocale, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return (
    <Layout.FlexColumn>
      <Table className={css(className, style)} hideBorder>
        <Table.FixtureColumn title={i`Your tax information`} />
        <Table.FixtureColumn />
        <Table.FixtureRow>
          <Table.FixtureCell>
            <Layout.FlexRow className={css(styles.title)}>
              <Text>Account type</Text>
            </Layout.FlexRow>
          </Table.FixtureCell>
          <Table.FixtureCell>
            <Layout.FlexRow className={css(styles.font)}>
              {AccountTypeDisplayNames[accountType || "COMPANY"]}
              <ValidatedLabel
                state={accountValidation}
                className={css(styles.accountTypeLabel)}
              />
            </Layout.FlexRow>
          </Table.FixtureCell>
        </Table.FixtureRow>
        {taxNumberType === "OSS" && countryOfOssRegistration != null && (
          <Table.FixtureRow>
            <Table.FixtureCell>
              <Layout.FlexRow className={css(styles.title)}>
                <Text>Country of OSS registration</Text>
              </Layout.FlexRow>
            </Table.FixtureCell>
            <Table.FixtureCell>
              <Layout.FlexRow className={css(styles.font)}>
                <Flag
                  className={css(styles.flag)}
                  countryCode={countryOfOssRegistration}
                />
                <Text>{getCountryName(countryOfOssRegistration)}</Text>
                {infoCountries.has(countryOfOssRegistration) && (
                  <Info
                    className={css(styles.info)}
                    text={getCountryTooltipText(countryOfOssRegistration)}
                    size={16}
                    sentiment="info"
                    position="right"
                  />
                )}
              </Layout.FlexRow>
            </Table.FixtureCell>
          </Table.FixtureRow>
        )}
        {taxNumberType === "OSS" && (
          <Table.FixtureRow>
            <Table.FixtureCell>
              <Layout.FlexRow className={css(styles.title)}>
                <Text>One-Stop Shop (OSS) Number</Text>
              </Layout.FlexRow>
            </Table.FixtureCell>
            <Table.FixtureCell>
              <div className={css(styles.font)}>{ossNumber}</div>
            </Table.FixtureCell>
          </Table.FixtureRow>
        )}
        {taxNumberType === "OSS" &&
          countryOfOssRegistration === "DE" &&
          ustSt1T1Number != null && (
            <Table.FixtureRow>
              <Table.FixtureCell>
                <div className={css(styles.title)}>
                  <Text>USt 1 TI Number</Text>
                </div>
              </Table.FixtureCell>
              <Table.FixtureCell>{ustSt1T1Number}</Table.FixtureCell>
            </Table.FixtureRow>
          )}
        {taxNumberType === "OSS" &&
          countryOfOssRegistration === "DE" &&
          certificateFileUrl != null && (
            <Table.FixtureRow>
              <Table.FixtureCell>
                <div className={css(styles.title)}>
                  <Text>Tax certificate</Text>
                </div>
              </Table.FixtureCell>
              <Table.FixtureCell>
                <Link href={certificateFileUrl} download openInNewTab>
                  View
                </Link>
              </Table.FixtureCell>
            </Table.FixtureRow>
          )}
        {taxNumberType === "OSS" && (
          <Table.FixtureRow>
            <Table.FixtureCell>
              <div className={css(styles.title)}>
                <Text>Last updated</Text>
              </div>
            </Table.FixtureCell>
            <Table.FixtureCell>
              <div className={css(styles.font)}>{lastUpdatedString || ""}</div>
            </Table.FixtureCell>
          </Table.FixtureRow>
        )}
      </Table>
    </Layout.FlexColumn>
  );
};

export default observer(EUTaxInfo);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        font: {
          fontSize: 14,
          color: textBlack,
        },
        accountTypeLabel: {
          marginLeft: 8,
        },
        title: {
          marginLeft: 14,
          fontSize: 15,
          color: textBlack,
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        info: {
          marginLeft: 6,
        },
      }),
    [textBlack],
  );
};
