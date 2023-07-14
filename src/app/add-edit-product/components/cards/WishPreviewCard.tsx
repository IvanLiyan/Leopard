/*
 * WishPreviewCard.tsx
 *
 * Created by Jonah Dlin on Mon Jul 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";
import { css } from "@core/toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Section from "./Section";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import WishPreview from "./WishPreview";

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const WishPreviewCard: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  return (
    <Section
      className={css(className, style)}
      title={i`Listing preview on Wish feed`}
      contentStyle={{
        padding: 0,
      }}
      alwaysOpen
    >
      <WishPreview state={state} style={{ padding: 24 }} />
    </Section>
  );
};

export default observer(WishPreviewCard);
