import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ABSBApplicationSellerType } from "@toolkit/brand/branded-products/abs";

export type ABSBApplicationAuthTypeDisplayProps = BaseProps & {
  readonly type: ABSBApplicationSellerType;
};

const authTypes = {
  BRAND_OWNER: i`Brand owner`,
  AUTHORIZED_RESELLER: i`Authorized reseller`,
  UNAUTHORIZED_RESELLER: i`Unauthorized reseller`,
};

const themes = {
  BRAND_OWNER: "DarkWishBlue" as Theme,
  AUTHORIZED_RESELLER: "LightWishBlue" as Theme,
  UNAUTHORIZED_RESELLER: "LightWishBlue" as Theme,
};

export const getAuthTypeDisplay = (type: ABSBApplicationSellerType) => {
  return authTypes[type];
};

const ABSBApplicationAuthTypeDisplay = ({
  type,
  style,
}: ABSBApplicationAuthTypeDisplayProps) => {
  return (
    <ThemedLabel style={style} width={100} theme={themes[type]}>
      {getAuthTypeDisplay(type)}
    </ThemedLabel>
  );
};

export default observer(ABSBApplicationAuthTypeDisplay);
