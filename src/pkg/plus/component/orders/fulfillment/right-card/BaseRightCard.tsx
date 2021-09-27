/*
 *
 * BaseRightCard.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Card, Text } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string | (() => React.ReactNode);
};

const BaseRightCard: React.FC<Props> = ({
  title,
  children,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Card
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      <div className={css(styles.header)}>
        {typeof title == "string" ? (
          <Text weight="bold">{title}</Text>
        ) : (
          title()
        )}
      </div>
      {children}
    </Card>
  );
};

export default observer(BaseRightCard);

const useStylesheet = () => {
  const { surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        header: {
          backgroundColor: surfaceLight,
          padding: "13px 50px 13px 20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: 15,
        },
      }),
    [surfaceLight],
  );
};
