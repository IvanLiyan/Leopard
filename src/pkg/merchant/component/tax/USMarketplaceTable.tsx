/* eslint-disable filenames/match-regex */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";

import { PickedUSMarketplaceMunicipalities } from "@toolkit/tax/enrollment";

/* Merchant Components */
import USMarketplaceStatesTable from "@merchant/component/tax/USMarketplaceStatesTable";
import USMarketplaceMunicipalities from "@merchant/component/tax/USMarketplaceMunicipalities";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { UsTaxConstants } from "@schema/types";

type Props = BaseProps & {
  readonly marketplaceStates: UsTaxConstants["marketplaceStates"];
  readonly marketplaceMunicipalities: ReadonlyArray<
    PickedUSMarketplaceMunicipalities
  >;
};

export default (props: Props) => {
  const {
    className,
    style,
    marketplaceStates,
    marketplaceMunicipalities,
  } = props;
  const styles = useStylesheet();

  return (
    <div className={css(className, style, styles.usContent)}>
      <section className={css(styles.description)}>
        Below is a list of marketplace regions where Wish collects and remits
        taxes on behalf of merchants if certain requirements and thresholds are
        met.
      </section>
      <USMarketplaceStatesTable
        className={css(styles.extraTable)}
        marketplaceStates={marketplaceStates}
      />
      <USMarketplaceMunicipalities
        className={css(styles.extraTable, styles.hyrbridTable)}
        marketplaceMunicipalities={marketplaceMunicipalities}
      />
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        extraTable: {
          border: `1px solid ${palettes.greyScaleColors.LightGrey}`,
        },
        hyrbridTable: {
          marginTop: 25,
        },
        usContent: {
          padding: 24,
        },
        description: {
          fontSize: 15,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.4,
          paddingBottom: "24px",
        },
      }),
    []
  );
};
