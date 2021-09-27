/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName, CountryCode } from "@toolkit/countries";

type FBWWarehouseTaxInfoProps = {
  readonly countryCode: CountryCode;
  readonly warehouseName: string;
};

const FBWWarehouseTaxInfo = (props: FBWWarehouseTaxInfoProps) => {
  const { countryCode, warehouseName } = props;
  const countryName = getCountryName(countryCode);
  const styles = useStylesheet();

  return (
    <Info
      className={css(styles.info)}
      popoverContent={
        i`Keep the ${countryName} selected if you plan to fulfill FBW orders` +
        i` using the non-bonded **${warehouseName}** warehouse for your inventory.` +
        i` Please also select any other jurisdictions where you have indirect tax` +
        i` tax obligations.`
      }
      position="right"
    />
  );
};

export default FBWWarehouseTaxInfo;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        info: {
          marginLeft: 6,
        },
      }),
    []
  );
};
