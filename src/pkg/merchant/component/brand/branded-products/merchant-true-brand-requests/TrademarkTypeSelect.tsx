import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Select, SelectProps } from "@ContextLogic/lego";

/* Type Imports */
import { TrademarkType } from "@merchant/model/brand/branded-products/IntellectualPropertyInfoState";

export type TrademarkTypeSelectProps = Omit<
  SelectProps,
  "options" | "position" | "onSelected"
> & {
  readonly onSelected: (value: TrademarkType) => unknown;
};

const TrademarkTypeDisplay = {
  DESIGN_MARK: i`Designmark`,
  WORD_MARK: i`Wordmark`,
};

export const getTrademarkTypeDisplay = (trademarkType: TrademarkType) => {
  return TrademarkTypeDisplay[trademarkType];
};

const options = Object.entries(TrademarkTypeDisplay).map(([k, v]) => {
  return {
    value: k as TrademarkType,
    text: v,
  };
});

const TrademarkTypeSelect = ({
  onSelected,
  ...otherProps
}: TrademarkTypeSelectProps) => {
  return (
    <Select
      placeholder={i`Select a type`}
      options={options}
      position={"bottom center"}
      onSelected={onSelected}
      {...otherProps}
    />
  );
};

export default observer(TrademarkTypeSelect);
