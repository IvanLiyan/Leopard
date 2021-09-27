//
//  NotificationCountBadge.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/28/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Text } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly count: number;
};

const NotificationCountBadge: React.FC<Props> = (props: Props) => {
  const { className, style, count } = props;
  const styles = useStylesheet(props);
  if (count <= 0) {
    return null;
  }

  return (
    <Text className={css(styles.root, className, style)} weight="semibold">
      {count > 999 ? "999+" : numeral(count).format("0a")}
    </Text>
  );
};

export default observer(NotificationCountBadge);

const useStylesheet = (props: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,163,158, 0.15)",
          color: "#e14d4c",
          padding: "2px 8px",
          borderRadius: 15,
          fontSize: 12,
          maxHeight: 20,
        },
      }),
    []
  );
};
