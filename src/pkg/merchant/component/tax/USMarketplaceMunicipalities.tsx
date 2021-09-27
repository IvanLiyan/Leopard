/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getStateName } from "@ContextLogic/lego/toolkit/states";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { UsTaxMarketplaceMunicipalities } from "@schema/types";

export type PickedUSMarketplaceMunicipalities = Pick<
  UsTaxMarketplaceMunicipalities,
  "stateCode" | "cities" | "counties" | "districts"
>;

type Props = BaseProps & {
  readonly marketplaceMunicipalities: ReadonlyArray<
    PickedUSMarketplaceMunicipalities
  >;
};

export default observer((props: Props) => {
  const { className, style, marketplaceMunicipalities } = props;

  const styles = useStylesheet();

  if (marketplaceMunicipalities.length == 0) {
    return null;
  }

  return (
    <Table
      className={css(className, style)}
      rowStyle={() => ({ minHeight: 68 })}
    >
      <Table.FixtureColumn
        title={i`Home-rule state`}
        minWidth="150px"
        description={() => (
          <div className={css(styles.popover)}>
            <p className={css(styles.paragraph)}>
              A home-rule state refers to a U.S. state with self-administered
              local taxing authorities that have chosen to collect and
              administer sales or use tax independently from the state.
            </p>
            <p className={css(styles.paragraph)}>
              For local jurisdictions within a home-rule state in which Wish is
              not registered as a marketplace, merchants are responsible for
              identifying and remitting sales tax on transactions placed on
              Wish.
            </p>
          </div>
        )}
      />
      <Table.FixtureColumn title={i`County`} />
      <Table.FixtureColumn title={i`City`} />
      <Table.FixtureColumn title={i`District`} />
      {marketplaceMunicipalities.map(
        ({ stateCode, counties, cities, districts }) => {
          return (
            <Table.FixtureRow key={stateCode}>
              <Table.FixtureCell>
                <div className={css(styles.cell)}>
                  {getStateName("US", stateCode)}
                </div>
              </Table.FixtureCell>
              <Table.FixtureCell>
                <div className={css(styles.cell)}>
                  {counties.length > 0
                    ? counties.map(toTitleCase).join(", ")
                    : "--"}
                </div>
              </Table.FixtureCell>
              <Table.FixtureCell>
                <div className={css(styles.cell)}>
                  {cities.length > 0
                    ? cities.map(toTitleCase).join(", ")
                    : "--"}
                </div>
              </Table.FixtureCell>
              <Table.FixtureCell>
                <div className={css(styles.cell)}>
                  {districts.length > 0
                    ? districts.map(toTitleCase).join(", ")
                    : "--"}
                </div>
              </Table.FixtureCell>
            </Table.FixtureRow>
          );
        }
      )}
    </Table>
  );
});

const toTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        cell: {
          paddingLeft: 15,
          wordWrap: "break-word",
          overflow: "hidden",
          whiteSpace: "normal",
        },
        popover: {
          maxWidth: 300,
          padding: 10,
        },
        paragraph: {
          fontSize: 12,
        },
      }),
    []
  );
