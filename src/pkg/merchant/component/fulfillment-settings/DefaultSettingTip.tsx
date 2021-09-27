/*
 *
 * DefaultSettingTip.tsx
 * Merchant Web
 *
 * Created by Sola Ogunsakin on 2/23/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { Text, Tip } from "@ContextLogic/lego";

import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {};

const DefaultSettingTip: React.FC<Props> = ({ style, className }: Props) => {
  const { primary } = useTheme();
  return (
    <Tip color={primary} icon="tip" className={css(style, className)}>
      <Text>
        To resume operations of your warehouse(s), update your setting to “All
        Warehouse(s) Operational”.
      </Text>
    </Tip>
  );
};

export default DefaultSettingTip;
