//
//  ChromeContent.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import { TopBarHeight } from "./ChromeTopBar";
import ChromePersistentAlerts from "./ChromePersistentAlerts";
import { Layout } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedUserAlert } from "@toolkit/chrome";

type Prop = BaseProps & {
  readonly sideMenuWidth: number;
  readonly isRightToLeft?: boolean;
  readonly alerts?: ReadonlyArray<PickedUserAlert> | null;
};

export default observer((prop: Prop) => {
  const { children, className, style, alerts } = prop;
  const styles = useStylesheet(prop);
  return (
    <Layout.FlexColumn
      className={css(styles.root, className, style)}
      alignItems="stretch"
    >
      {alerts != null && <ChromePersistentAlerts alerts={alerts} />}
      {children}
    </Layout.FlexColumn>
  );
});

const useStylesheet = ({ sideMenuWidth, isRightToLeft }: Prop) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          position: "relative",
          "@media (max-width: 640px)": {
            // reason: ChromeContent should always be rendered inside Chrome
            // which expects these constraints.
            // eslint-disable-next-line local-rules/validate-root
            margin: isRightToLeft
              ? `${TopBarHeight}px 0px 0px 0px`
              : `${TopBarHeight}px 0px 0px 0px`,
          },
          "@media (min-width: 640px)": {
            // reason: ChromeContent should always be rendered inside Chrome
            // which expects these constraints.
            // eslint-disable-next-line local-rules/validate-root
            margin: isRightToLeft
              ? `${TopBarHeight}px ${sideMenuWidth}px 0px 0px`
              : `${TopBarHeight}px 0px 0px ${sideMenuWidth}px`,
          },
        },
      }),
    [sideMenuWidth, isRightToLeft]
  );
};
