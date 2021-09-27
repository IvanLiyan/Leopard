import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";

/* Toolkit */
import { ProductBoostProductFeedbackExplanations } from "@toolkit/product-boost/resources/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ThemedLabelProps } from "@ContextLogic/lego";

export type FeedbackLabelProps = BaseProps & {
  readonly feedbackType: number | null | undefined;
};

@observer
class FeedbackLabel extends Component<FeedbackLabelProps> {
  @computed
  get themedLabelProps(): ThemedLabelProps | null | undefined {
    const { feedbackType } = this.props;

    switch (feedbackType) {
      case 1:
        return {
          text: i`Rejected`,
          theme: "DarkRed",
          popoverContent: ProductBoostProductFeedbackExplanations.REJECTED,
        };
      case 2:
        return {
          text: i`Out of Stock`,
          theme: "DarkInk",
          popoverContent: ProductBoostProductFeedbackExplanations.OUT_OF_STOCK,
        };
      case 3:
        return {
          text: i`Not Boosted`,
          theme: "LightGrey",
        };
      case 4:
        return {
          text: i`Disabled`,
          theme: "DarkYellow",
          popoverContent: ProductBoostProductFeedbackExplanations.DISABLED,
        };
      case 5:
        return {
          text: i`Low Bid`,
          theme: "LightInk",
          popoverContent: ProductBoostProductFeedbackExplanations.LOW_BID,
        };
      case 6:
        return {
          text: i`Low Bid`,
          theme: "LightInk",
          popoverContent:
            ProductBoostProductFeedbackExplanations.LOW_BID_HARD_CUT,
        };
      case 9:
        return {
          text: i`Low Conversion`,
          theme: "LightInk",
          popoverContent:
            ProductBoostProductFeedbackExplanations.LOW_CONVERSION_PRODUCT,
        };
      case 20:
        return {
          text: i`Low Rating`,
          theme: "LightInk",
          popoverContent: ProductBoostProductFeedbackExplanations.LOW_RATING,
        };
    }
    return null;
  }

  render() {
    if (!this.themedLabelProps) {
      return null;
    }
    return <ThemedLabel {...this.themedLabelProps} />;
  }
}

export default FeedbackLabel;
