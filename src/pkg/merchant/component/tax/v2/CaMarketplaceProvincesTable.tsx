/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table, Layout } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { useDeviceStore } from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Info } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTaxStore } from "@merchant/stores/TaxStore";

type Props = BaseProps & {
  readonly stateCodes: ReadonlyArray<string>;
  readonly taxConstants: any;
};

const CaMarketplaceProvincesTable: React.FC<Props> = (props: Props) => {
  const { className, style, stateCodes, taxConstants } = props;

  const styles = useStylesheet();
  const taxStore = useTaxStore();

  const { isSmallScreen } = useDeviceStore();

  const tableData = useMemo(
    () =>
      stateCodes
        .map((stateCode) => ({
          name: getStateName("CA", stateCode),
          code: stateCode,
        }))
        .sort(),
    [stateCodes],
  );

  const rows = _.chunk(tableData, isSmallScreen ? 1 : 4);

  return (
    <Table className={css(className, style)} hideBorder>
      <Table.FixtureColumn title={i`Province`} width="30%" />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      {rows.map((provinces) => {
        return (
          <Table.FixtureRow key={provinces.map(({ name }) => name).join("")}>
            {[0, 1, 2, 3].map((i) => {
              const province = provinces[i];
              const provinceName = province == null ? "" : province.name;
              const provinceCode = province == null ? "" : province.code;
              return (
                <Table.FixtureCell
                  key={provinceName}
                  className={css(styles.fixtureCell)}
                >
                  {provinceName && (
                    <Layout.FlexRow className={css(styles.cell)}>
                      {provinceName}
                      <Info
                        className={css(styles.info)}
                        popoverContent={taxStore.getTaxDescription({
                          countryCode: "CA",
                          stateCode: provinceCode,
                          taxConstants,
                        })}
                      />
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

export default observer(CaMarketplaceProvincesTable);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        fixtureCell: {
          width: "25%",
        },
        cell: {
          padding: 14,
          fontSize: 14,
        },
        info: {
          marginLeft: 4,
        },
      }),
    [],
  );
