/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { useDeviceStore } from "@merchant/stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly stateCodes: ReadonlyArray<string>;
};

const USMarketplaceStatesTable: React.FC<Props> = (props: Props) => {
  const { className, style, stateCodes } = props;

  const styles = useStylesheet();

  const { isSmallScreen } = useDeviceStore();

  const tableData = useMemo(
    () =>
      stateCodes
        .map((stateCode) => ({ state: getStateName("US", stateCode) }))
        .sort(),
    [stateCodes]
  );

  const rows = _.chunk(tableData, isSmallScreen ? 1 : 4);

  return (
    <Table
      className={css(className, style)}
      rowStyle={() => ({ minHeight: 68 })}
      style={{
        position: "static",
      }}
      hideBorder
    >
      <Table.FixtureColumn title={i`State/Territory`} width="30%" />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      {rows.map((states) => {
        return (
          <Table.FixtureRow key={states.map(({ state }) => state).join("")}>
            {[0, 1, 2, 3].map((i) => {
              const state = states[i];
              const stateName = state == null ? "" : state.state;
              return (
                <Table.FixtureCell
                  key={stateName}
                  className={css(styles.fixtureCell)}
                >
                  <div className={css(styles.cell)}>{stateName}</div>
                </Table.FixtureCell>
              );
            })}
          </Table.FixtureRow>
        );
      })}
    </Table>
  );
};

export default observer(USMarketplaceStatesTable);

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
      }),
    []
  );
