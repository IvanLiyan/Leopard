import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const WishStoreAlmostReady: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={i`Your Wish store is almost ready! List a product to start selling.`}
      illustration="merchantPlusHome"
    />
  );
};

export default WishStoreAlmostReady;
