/*
 *
 * WhatShouldIKnowCard.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import BaseRightCard from "./BaseRightCard";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly children: React.ReactNode;
};

const WhatShouldIKnowCard: React.FC<Props> = ({
  className,
  style,
  children,
}: Props) => {
  return (
    <BaseRightCard
      className={css(className, style)}
      title={i`What should I know?`}
    >
      {children}
    </BaseRightCard>
  );
};

export default observer(WhatShouldIKnowCard);
