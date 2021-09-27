import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const CongratsFirstSale: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={
        i`Congrats on your first sale! Remember ` +
        i`to fulfill your orders before the deadline.`
      }
      illustration="plantLaptopHomeBox"
    />
  );
};

export default CongratsFirstSale;
