import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DataGrid } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { AuthorityLevel } from "@merchant/api/tax";
import CommerceMerchantTaxInfo from "@merchant/model/CommerceMerchantTaxInfo";

export type HomeRuleStateSettingsProps = BaseProps & {
  readonly title?: string;
  readonly stateCode: string;
  readonly countryCode: string;
  readonly authorityLevel: AuthorityLevel;
  readonly taxInfos: ReadonlyArray<CommerceMerchantTaxInfo>;
};

const HomeRuleStateSettings = (props: HomeRuleStateSettingsProps) => {
  const { title, authorityLevel, className, taxInfos } = props;

  const styles = useStylesheet();

  const data = taxInfos.map((taxInfo) => taxInfo.authorityDisplayName || "");
  if (data.length === 0) {
    return null;
  }

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.title)}>{title || authorityLevel}</div>
      <DataGrid
        data={data}
        numColumns={4}
        textStyle={{
          fontSize: 14,
          padding: "5px 0px",
        }}
      />
    </div>
  );
};

export default observer(HomeRuleStateSettings);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        title: {
          fontSize: 16,
          textTransform: "capitalize",
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.5,
          color: palettes.textColors.Ink,
          cursor: "default",
          marginBottom: 10,
        },
      }),
    []
  );
