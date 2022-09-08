/*
 * StatusLabel.tsx
 *
 * Created by Jonah Dlin on Mon Jan 18 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";
import { ThemedLabel } from "@ContextLogic/lego";
import { DemoVideoReviewStatusMap } from "@toolkit/products/demo-video";
import { ProductVideoState } from "@schema/types";

type Props = {
  readonly status: ProductVideoState;
};

const ProductVideoStateLabel: React.FC<Props> = ({ status }: Props) => {
  return (
    <ThemedLabel
      theme={DemoVideoReviewStatusMap[status].theme}
      text={DemoVideoReviewStatusMap[status].displayName}
    />
  );
};

export default observer(ProductVideoStateLabel);
