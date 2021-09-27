//
//  component/data/table/column/CountryColumn.tsx
//  Project-Lego
//
//  Created by Julian Dominguez-Schatz on 30/07/2020.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Flag from "@merchant/component/core/Flag";
import { Table, BasicColumnProps, CellInfo } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { CountryCode } from "@toolkit/countries";

const CountryColumn = (props: BasicColumnProps) => {
  const styles = useStylesheet();
  return (
    <Table.Column {...props}>
      {(cell: CellInfo<ReadonlyArray<CountryCode>, any>) => {
        const { value } = cell;
        return (
          <div className={css(styles.root)}>
            {value.map((countryCode) => (
              <div key={countryCode} className={css(styles.flagContainer)}>
                <Flag
                  countryCode={countryCode}
                  displayCountryName
                  // This style needs to be inline in order to override the
                  // internal styles from Flag.
                  flagContainerStyle={{ display: "inline-flex" }}
                  className={css(styles.flag)}
                />
              </div>
            ))}
          </div>
        );
      }}
    </Table.Column>
  );
};
const useStylesheet = () => {
  const { surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 10,
          display: "flex",
          flexWrap: "wrap",
        },
        flagContainer: {
          display: "inline-flex",
          background: surfaceLight,
          padding: 10,
          marginRight: 5,
          marginBottom: 5,
          borderRadius: 2,
        },
        flag: {
          width: 20,
          height: 20,
        },
      }),
    [surfaceLight]
  );
};

export default observer(CountryColumn);
