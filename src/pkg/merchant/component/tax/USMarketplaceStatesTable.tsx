/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import hash from "object-hash";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { useDeviceStore } from "@stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { UsTaxConstants } from "@schema/types";

type Props = BaseProps & {
  readonly marketplaceStates: UsTaxConstants["marketplaceStates"];
};
export default observer((props: Props) => {
  const { className, style, marketplaceStates } = props;

  const styles = useStylesheet();

  const { isSmallScreen } = useDeviceStore();

  const tableData = _.sortBy(
    marketplaceStates.map((stateCode) => ({
      state: getStateName("US", stateCode),
    })),
    (info) => info.state,
  );

  const rows = _.chunk(tableData, isSmallScreen ? 1 : 4);

  return (
    <Table className={css(className, style)}>
      <Table.FixtureColumn title={i`State/Territory`} width="30%" />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      <Table.FixtureColumn />
      {rows.map((states, idx) => {
        return (
          <Table.FixtureRow key={hash(idx)}>
            {[0, 1, 2, 3].map((idx) => {
              const state = states[idx];
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
});

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        fixtureCell: {
          width: "25%",
        },
        cell: {
          paddingLeft: 15,
        },
      }),
    [],
  );
