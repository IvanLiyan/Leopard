/*
 * LinePreview.tsx
 *
 * Created by Jonah Dlin on Wed May 12 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import {
  DailyStatsLineType,
  useDailyStatsLineStroke,
} from "@toolkit/product-boost/external-boost/external-boost";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly metric: DailyStatsLineType;
  readonly isDisabled?: boolean;
};

const LinePreview: React.FC<Props> = ({
  className,
  style,
  metric,
  isDisabled,
}: Props) => {
  const styles = useStylesheet();

  const { borderPrimary } = useTheme();
  const stroke = useDailyStatsLineStroke();

  return (
    <div
      className={css(styles.root, className, style)}
      style={{
        backgroundColor: isDisabled ? borderPrimary : stroke[metric],
      }}
    />
  );
};

export default observer(LinePreview);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 4,
          width: 20,
          borderRadius: 2,
        },
      }),
    [],
  );
};
