/*
 *
 * TopGmvCountryBadge.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/27/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

import { Illustration } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {};

const TopGmvCountryBadge: React.FC<Props> = ({ style, className }: Props) => {
  return (
    <Popover
      popoverContent={i`This is a top-selling country on Wish`}
      position="top center"
    >
      <Illustration
        name="crownGray"
        alt={i`Top GMV Country`}
        className={css(style, className)}
      />
    </Popover>
  );
};

export default observer(TopGmvCountryBadge);
