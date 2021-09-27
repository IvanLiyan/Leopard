import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Label } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as illustrations from "@assets/illustrations";

/* SVGs */
import iconDisputeDenied from "@assets/img/dispute-denied.svg";
import iconDisputeSuccess from "@assets/img/dispute-success.svg";
import iconDisputeInProgress from "@assets/img/dispute-in-progress.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { LabelProps } from "@ContextLogic/lego";
import { FineDisputeStatus } from "@merchant/api/fines";

export type FineDisputeStatusLabelProps = BaseProps & {
  readonly status: FineDisputeStatus | null | undefined;
  readonly infoPopoverText?: string | null | undefined;
};

@observer
export default class FineDisputeStatusLabel extends Component<FineDisputeStatusLabelProps> {
  @computed
  get labelProps(): LabelProps {
    const { status, infoPopoverText } = this.props;
    switch (status) {
      case "APPROVED":
        return {
          text: i`Dispute success`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: "#88c43f",
          popoverIcon: iconDisputeSuccess,
          popoverContent:
            infoPopoverText ||
            i`Your dispute for this penalty was approved. ` +
              i`The penalty amount has been reversed and will be reflected ` +
              i`in your next scheduled payment.`,
          popoverMaxWidth: 300,
        };
      case "SUBMITTED":
        return {
          text: i`Dispute submitted`,
          position: "top center",
          textColor: "#2b3333",
          backgroundColor: "#ffea8a",
          popoverIcon: iconDisputeInProgress,
          popoverContent:
            infoPopoverText ||
            i`We are reviewing the dispute information submitted for this ` +
              i`penalty. Please allow a few business days for review.`,
          popoverMaxWidth: 300,
        };
      case "DECLINED":
        return {
          text: i`Dispute rejected`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: "#ee6c6b",
          popoverIcon: iconDisputeDenied,
          popoverContent:
            infoPopoverText ||
            i`Your dispute for this penalty was rejected. ` +
              i`Review the Wish admin's reply in the dispute page for ` +
              i`further details.`,
          popoverMaxWidth: 300,
        };
      case "CANCELLED":
        return {
          text: i`Dispute cancelled`,
          position: "top center",
          textColor: "#2b3333",
          backgroundColor: "#cef2fd",
        };
      default:
        return {
          text: i`No dispute found`,
          position: "top center",
          textColor: "#2b3333",
          backgroundColor: "#cef2fd",
          popoverIcon: illustrations.redBulb,
          popoverContent: infoPopoverText,
          popoverMaxWidth: 300,
        };
    }
  }

  render() {
    return <Label {...this.labelProps} />;
  }
}
