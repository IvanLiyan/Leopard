import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const AdvancedLogisticsPendingLabel = ({ className, style }: BaseProps) => {
  return (
    <Popover
      popoverContent={
        i`For qualifying Advanced Logistics Program orders, you may be reimbursed ` +
        i`for WishPost Shipping. [Learn More](${zendeskURL("360054912394")})`
      }
      position="right center"
      className={className}
      style={style}
      openContentLinksInNewTab
      popoverMaxWidth={250}
    >
      <ThemedLabel theme="WishBlue">Pending</ThemedLabel>
    </Popover>
  );
};

export default observer(AdvancedLogisticsPendingLabel);
