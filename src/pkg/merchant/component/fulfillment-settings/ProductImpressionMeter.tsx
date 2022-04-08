/*
 *
 * ProductImpressionMeter.tsx
 * Merchant Web
 *
 * Created by Sola Ogunsakin on 1/21/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React from "react";
import { observer } from "mobx-react";
import { StrengthIndicatorProps, StrengthIndicator } from "@ContextLogic/lego";
import {
  FulfillmentSetting,
  FulfillmentSettingProductImpressionStrength,
} from "@toolkit/fulfillment-settings";

type Props = Omit<StrengthIndicatorProps, "warningRange" | "strength"> & {
  readonly currentSetting: FulfillmentSetting;
};

const ProductImpressionMeter: React.FC<Props> = ({
  currentSetting,
  ...props
}: Props) => {
  return (
    <StrengthIndicator
      {...props}
      strength={FulfillmentSettingProductImpressionStrength[currentSetting]}
      warningRange={[0.4, 0.7]}
    />
  );
};

export default observer(ProductImpressionMeter);
