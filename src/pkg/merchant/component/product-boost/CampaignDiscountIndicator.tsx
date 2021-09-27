import React from "react";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";

import { ThemedLabelProps } from "@ContextLogic/lego";

type CampaignDiscountIndicatorProps = Omit<ThemedLabelProps, "theme"> & {
  readonly discount: number;
  readonly automatedType?: number;
};

const CampaignDiscountIndicator = (props: CampaignDiscountIndicatorProps) => {
  const { discount, automatedType, ...labelProps } = props;
  if (discount === 0) {
    return null;
  }

  const discountPercent = Math.round(discount * 100);
  let popoverContent =
    discount === 1
      ? i`All of the impressions in this campaign were complimentary, ` +
        i`as a result of an introductory promotion.`
      : i`${discountPercent}% of the charges in this campaign were complimentary, ` +
        i`as a result of an introductory ${discountPercent}% off promotion.`;

  if (automatedType === 3) {
    popoverContent =
      i`${discountPercent}% of the charges in this campaign were complimentary ` +
      i`as a result of a special FBW promotion.`;
  }

  return (
    <ThemedLabel
      theme={"DarkWishBlue"}
      popoverContent={popoverContent}
      {...labelProps}
    >
      {discount === 1 ? i`Free` : i`${discountPercent}% off`}
    </ThemedLabel>
  );
};

export default CampaignDiscountIndicator;
