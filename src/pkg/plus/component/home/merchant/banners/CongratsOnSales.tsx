import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const CongratsOnSales: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={i`Congrats, you’re getting orders! Be sure to fulfill them before the deadline.`}
      illustration="yellowTruckBoxesInside"
    />
  );
};

export default CongratsOnSales;
