import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Flag, { FlagProps } from "@merchant/component/core/Flag";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

export type FlagsProps = BaseProps &
  Partial<FlagProps> & {
    readonly countries: ReadonlyArray<CountryCode | "EU" | "D">;
    readonly initialDisplay?: number;
    readonly flagStyle?: any;
  };

const Flags = ({
  countries,
  initialDisplay,
  flagStyle,
  style,
  ...flagProps
}: FlagsProps) => {
  const styles = useStylesheet();

  if (!initialDisplay) {
    initialDisplay = 4;
  }

  return (
    <div className={css(style, styles.container)}>
      {countries.slice(0, initialDisplay).map((countryCode) => (
        <div key={countryCode}>
          <Flag
            className={css(styles.flag, flagStyle)}
            countryCode={countryCode}
            {...flagProps}
          />
        </div>
      ))}
      {initialDisplay < countries.length &&
        i`+ ${countries.length - initialDisplay} more`}
    </div>
  );
};

export default observer(Flags);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        },
        flag: {
          height: 20,
          width: 20,
          marginRight: 5,
        },
      }),
    []
  );
