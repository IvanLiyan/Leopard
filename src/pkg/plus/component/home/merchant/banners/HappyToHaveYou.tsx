import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const HappyToHaveYou: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={i`We’re thrilled you’re selling with Wish!`}
      illustration="merchantPlusHome"
    />
  );
};

export default HappyToHaveYou;
