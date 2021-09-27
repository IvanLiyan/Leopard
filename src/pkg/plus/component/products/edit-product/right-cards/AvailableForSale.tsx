import React from "react";
import { observer } from "mobx-react";

import { Switch } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import RightCard from "@plus/component/products/edit-product/RightCard";
import ProductEditState from "@plus/model/ProductEditState";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly editState: ProductEditState;
};

const AvailableForSale: React.FC<Props> = (props: Props) => {
  const { className, style, editState } = props;

  return (
    <RightCard
      className={css(className, style)}
      title={i`Available for sale`}
      titleRight={() => (
        <Switch
          isOn={editState.enabled || false}
          onToggle={(to) => (editState.enabled = to)}
          showText={false}
          disabled={editState.isSubmitting}
        />
      )}
    />
  );
};

export default observer(AvailableForSale);
