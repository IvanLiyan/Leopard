import React from "react";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";

/* Merchant Components */
import DDPExplanation from "@merchant/component/orders/ddp/DDPExplanation";

import { ThemedLabelProps } from "@ContextLogic/lego";

type Props = {
  readonly pcVatRequired: boolean;
} & Partial<ThemedLabelProps>;

const DDPLabel = ({ pcVatRequired = false, ...props }: Props) => {
  return (
    <ThemedLabel
      {...props}
      popoverContent={() => (
        <DDPExplanation
          pcVatRequired={pcVatRequired}
          style={{
            maxWidth: 260,
            padding: 8,
          }}
        />
      )}
      theme="LightWishBlue"
      position={"right center"}
    >
      Pay Customer VAT "PC-VAT" required
    </ThemedLabel>
  );
};

export default DDPLabel;
