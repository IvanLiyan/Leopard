import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Label } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import iconDisputeDenied from "@assets/img/dispute-denied.svg";
import iconDisputeSuccess from "@assets/img/dispute-success.svg";
import iconDisputeInProgress from "@assets/img/dispute-in-progress.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { LabelProps } from "@ContextLogic/lego";
import { TrackingDisputeState } from "@merchant/api/disputes";

export type TrackingDisputeStateLabelProps = BaseProps & {
  readonly state: TrackingDisputeState | null | undefined;
};

@observer
class TrackingDisputeStateLabel extends Component<
  TrackingDisputeStateLabelProps
> {
  static demoProps: TrackingDisputeStateLabelProps = {
    state: "DECLINED",
  };

  @computed
  get labelProps(): LabelProps {
    const { state } = this.props;
    switch (state) {
      case "APPROVED":
        return {
          text: i`Dispute success`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: "#88c43f",
          popoverIcon: iconDisputeSuccess,
          popoverContent: i`Your dispute was approved. `,
          popoverMaxWidth: 300,
        };
      case "AWAITING_ADMIN":
        return {
          text: i`Dispute submitted`,
          position: "top center",
          textColor: "#2b3333",
          backgroundColor: "#ffea8a",
          popoverIcon: iconDisputeInProgress,
          popoverContent:
            i`We are reviewing the dispute information submitted for this ` +
            i`penalty. Please allow a few business days for review.`,
          popoverMaxWidth: 300,
        };
      case "AWAITING_MERCHANT":
        return {
          text: i`Dispute submitted`,
          position: "top center",
          textColor: "#2b3333",
          backgroundColor: "#ffea8a",
          popoverIcon: iconDisputeInProgress,
          popoverContent:
            i`We are waiting for your response. ` +
            i`Please review the dispute`,
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
            i`Your dispute was rejected. ` +
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
        };
    }
  }

  render() {
    return <Label {...this.labelProps} position="bottom center" />;
  }
}
export default TrackingDisputeStateLabel;
