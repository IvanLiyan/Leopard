import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const NoNewsToday: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={
        i`Optimize your product listings to attract customers and ` +
        i`get ready to fulfill your first order!`
      }
      illustration="yellowTruckBoxesInside"
    />
  );
};

export default NoNewsToday;
