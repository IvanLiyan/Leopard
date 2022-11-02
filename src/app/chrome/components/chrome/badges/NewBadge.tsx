//
//  NewBadge.tsx
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
import { ci18n } from "@core/toolkit/i18n";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { palettes } from "@deprecated/pkg/toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@core/toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const NewBadge = observer((props: BaseProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className, style)}>
      {ci18n("'New' here means the feature was just released", "New")}
    </div>
  );
});

export default NewBadge;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: new Color(palettes.cyans.Cyan)
            .lighten(0.99)
            .toString(),
          color: palettes.cyans.Cyan,
          padding: "2px 8px",
          borderRadius: 10,
          fontWeight: fonts.weightSemibold,
          fontSize: 12,
        },
      }),
    [],
  );
};
