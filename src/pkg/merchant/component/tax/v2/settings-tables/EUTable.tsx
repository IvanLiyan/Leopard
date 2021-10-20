import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table, Layout, CellInfo, Info } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useTaxStore } from "@merchant/stores/TaxStore";

/* Merchant Components */
import EUTaxInfo from "./EUTaxInfo";
import TaxStatusLabel from "@merchant/component/tax/v2/TaxStatusLabel";
import EuCountriesTable from "@merchant/component/tax/v2/EuCountriesTable";

/* Toolkit */
import { EuDropdown, DataRow } from "@toolkit/tax/types-v2";
import { getCountryName } from "@toolkit/countries";
import { externalURL } from "@toolkit/url";
import { infoCountries, getCountryTooltipText } from "@toolkit/tax/eu-vat";

export type EUTableProps = BaseProps & {
  readonly info: EuDropdown;
};

const EUTable: React.FC<EUTableProps> = ({
  className,
  style,
  info: {
    accountType,
    accountValidation,
    taxId,
    taxNumberType,
    countryOfOssRegistration,
    euCountriesSettings,
  },
}: EUTableProps) => {
  const styles = useStylesheet();
  const { getTaxNumberName } = useTaxStore();

  const isOss = taxNumberType === "OSS";

  const data = useMemo(
    (): ReadonlyArray<DataRow> =>
      euCountriesSettings.map(
        ({
          authority: {
            country: { code },
          },
          euDetails: { ustSt1T1Number },
          certificateFileUrl,
          taxNumber,
          status,
          lastUpdated,
        }) => ({
          countryCode: code,
          countryName: () => (
            <Layout.FlexRow>
              <Flag className={css(styles.flag)} countryCode={code || null} />
              {getCountryName(code)}
              {infoCountries.has(code) && (
                <Info
                  className={css(styles.info)}
                  text={getCountryTooltipText(code)}
                  size={16}
                  sentiment="info"
                  position="right"
                />
              )}
            </Layout.FlexRow>
          ),
          taxNumber,
          status,
          lastUpdated: lastUpdated.unix,
          ustSt1T1Number,
          certificateFileUrl,
        }),
      ),
    [euCountriesSettings, styles.flag, styles.info],
  );

  const deData = _.find(data || [], { countryCode: "DE" });
  const ustSt1T1Number = deData?.ustSt1T1Number;
  const certificateFileUrl = deData?.certificateFileUrl;

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <EUTaxInfo
        className={css(styles.taxInfo)}
        accountType={accountType}
        accountValidation={accountValidation}
        ossNumber={taxId}
        taxNumberType={taxNumberType}
        countryOfOssRegistration={countryOfOssRegistration}
        lastUpdated={data != null && data.length ? data[0].lastUpdated : null}
        ustSt1T1Number={ustSt1T1Number}
        certificateFileUrl={certificateFileUrl}
      />
      {isOss ? (
        <EuCountriesTable
          countryCodes={data.map((settingInfo) => settingInfo.countryCode)}
        />
      ) : (
        <Table data={data} hideBorder noDataMessage={`No countries`}>
          <Table.Column
            columnKey="countryName"
            title={i`Country`}
            width={210}
            noDataMessage=""
          >
            {({ row }: CellInfo<DataRow["countryName"], DataRow>) =>
              row?.countryName != null && row.countryName()
            }
          </Table.Column>

          <Table.Column
            columnKey="taxNumber"
            title={i`${getTaxNumberName({
              countryCode: "AT",
              entityType: accountType,
            })}`}
            minWidth="15%"
            canCopyText
            noDataMessage=""
          />

          {ustSt1T1Number != null && (
            <Table.Column
              columnKey="ustSt1T1Number"
              title={i`USt 1 TI Number`}
              minWidth="15%"
              canCopyText
              noDataMessage=""
            />
          )}

          {certificateFileUrl != null && (
            <Table.LinkColumn
              title={i`Tax certificate`}
              columnKey="certificateFileUrl"
              text={i`View`}
              href={({ value }) => externalURL(value)}
              openInNewTab
              noDataMessage=""
            />
          )}

          <Table.Column
            columnKey="status"
            title={i`Status`}
            minWidth="15%"
            align="center"
            noDataMessage=""
          >
            {({ row }: CellInfo<DataRow["status"], DataRow>) => (
              <TaxStatusLabel status={row.status || "INACTIVE"} />
            )}
          </Table.Column>

          <Table.DatetimeColumn
            columnKey="lastUpdated"
            title={i`Last updated`}
            format="MM/DD/YYYY"
            noDataMessage=""
          />
        </Table>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(EUTable);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        taxInfo: {
          borderBottom: `1px solid ${borderPrimary}`,
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        info: {
          marginLeft: 6,
        },
      }),
    [borderPrimary],
  );
};
