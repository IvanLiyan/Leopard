import React from "react";

/* Lego Components */
import BaseHomeBanner from "@plus/component/home/BaseHomeBanner";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const CongratsOnImpressions: React.FC<BaseProps> = (props: BaseProps) => {
  return (
    <BaseHomeBanner
      {...props}
      title={i`Congrats! Your store is getting a lot impressions`}
      illustration="userOnPhoneLoveHandbag"
    />
  );
};

export default CongratsOnImpressions;
