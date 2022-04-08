//
//  BetaBadge.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/28/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import Color from "color";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const BetaBadge = observer((props: BaseProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className, style)}>
      {ci18n("'Beta' here means the feature is in limited release", "Beta")}
    </div>
  );
});

export default BetaBadge;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: new Color(palettes.purples.DarkPurple)
            .lighten(0.45)
            .toString(),
          color: palettes.purples.DarkPurple,
          padding: "2px 8px",
          borderRadius: 10,
          fontWeight: fonts.weightSemibold,
          fontSize: 12,
        },
      }),
    []
  );
};
