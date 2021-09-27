import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const UnfinishedTodos: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={
        i`It looks like you haven't received any orders. ` +
        i`Have you completed your things to do?`
      }
      illustration="plantLaptopHomeBox"
    />
  );
};

export default UnfinishedTodos;
