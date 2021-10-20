import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table, Layout, Info } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName } from "@toolkit/countries";
import { useDeviceStore } from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Schema */
import { CountryCode } from "@schema/types";

/* Toolkit */
import { infoCountries, getCountryTooltipText } from "@toolkit/tax/eu-vat";

type Props = BaseProps & {
  readonly countryCodes: ReadonlyArray<CountryCode>;
};

const EuCountriesTable: React.FC<Props> = (props: Props) => {
  const { className, style, countryCodes } = props;

  const styles = useStylesheet();

  const { isSmallScreen } = useDeviceStore();

  const tableData = useMemo(() => {
    const countriesData = countryCodes.map((countryCode) => ({
      name: getCountryName(countryCode),
      code: countryCode,
    }));
    return _.sortBy(countriesData, (country) => country.name);
  }, [countryCodes]);

  const rows = _.chunk(tableData, isSmallScreen ? 1 : 3);

  return (
    <Table
      className={css(className, style)}
      rowStyle={() => ({ minHeight: 68 })}
      style={{
        position: "static",
      }}
      hideBorder
      noDataMessage={i`No countries`}
    >
      <Table.FixtureColumn title={i`Country`} />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      {rows.map((countries) => {
        return (
          <Table.FixtureRow key={countries.map(({ name }) => name).join("")}>
            {[0, 1, 2].map((i) => {
              const country = countries[i];
              const code = country?.code;
              return (
                <Table.FixtureCell
                  key={country?.name || null}
                  className={css(styles.fixtureCell)}
                >
                  {country && (
                    <Layout.FlexRow className={css(styles.cell)}>
                      <Flag
                        className={css(styles.flag)}
                        countryCode={code || null}
                      />
                      {country.name}
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
                  )}
                </Table.FixtureCell>
              );
            })}
          </Table.FixtureRow>
        );
      })}
    </Table>
  );
};

export default observer(EuCountriesTable);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        fixtureCell: {
          width: "calc(100% / 3)",
        },
        cell: {
          paddingLeft: 14,
          fontSize: 14,
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        info: {
          marginLeft: 6,
        },
      }),
    [],
  );
