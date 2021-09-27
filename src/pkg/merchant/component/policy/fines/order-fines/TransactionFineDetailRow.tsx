import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import FakeTrackingInfoTip from "@merchant/component/policy/fines/FakeTrackingInfoTip";
import LateConfirmedFulfillmentTip from "@merchant/component/policy/fines/LateConfirmedFulfillmentTip";
import WishExpressDeliveryTip from "@merchant/component/wish-express/WishExpressDeliveryTip";

/* Relative Imports */
import TransactionFineDetailSheet from "./TransactionFineDetailSheet";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineDisplayItem } from "@merchant/api/fines";
import { TransactionFineDetailField } from "./TransactionFineDetailSheet";

export type TransactionFineDetailRowProps = BaseProps & {
  readonly fineItem: FineDisplayItem;
};

@observer
class TransactionFineDetailRow extends Component<
  TransactionFineDetailRowProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      tip: {
        marginBottom: 30,
      },
    });
  }

  @computed
  get detailFields(): ReadonlyArray<TransactionFineDetailField> {
    const { fineItem } = this.props;

    switch (fineItem.fine_spec.enum_name) {
      case "LateConfirmedFulfillmentFine":
        return [
          "state",
          "order_total",
          "release_time",
          "tracking_number",
          "tracking_valid",
          "tracking_confirmed",
          "confirmed_fulfillment_hours",
          "dispute_approved_deadline",
        ];
      case "WishExpressLateOrderFine":
      case "WishExpressWithheldOrderFine":
        return [
          "state",
          "order_total",
          "release_time",
          "tracking_number",
          "tracking_valid",
          "time_to_door",
          "time_to_door_requirement",
        ];
      case "FakeTrackingFine":
        return [
          "state",
          "order_total",
          "release_time",
          "tracking_number",
          "tracking_valid",
          "tracking_confirmed",
          "dispute_approved_deadline",
        ];
      case "CancellationFine":
        return [
          "state",
          "order_total",
          "release_time",
          "tracking_number",
          "tracking_confirmed",
          "tracking_confirmed_time",
          "refunded_time",
          "dispute_approved_deadline",
        ];
      default:
        return [
          "state",
          "order_total",
          "release_time",
          "tracking_number",
          "tracking_valid",
          "tracking_confirmed",
          "confirmed_fulfillment_hours",
          "time_to_door",
        ];
    }
  }

  renderTip() {
    const { fineItem } = this.props;
    switch (fineItem.fine_spec.enum_name) {
      case "UnconfirmedCarrierFine":
      case "FakeTrackingFine":
        return <FakeTrackingInfoTip className={css(this.styles.tip)} />;
      case "LateConfirmedFulfillmentFine":
        return (
          <LateConfirmedFulfillmentTip
            className={css(this.styles.tip)}
            confirmedFulfillmentTimeRequirement={
              fineItem.transaction.confirmed_fulfillment_hours_requirement
            }
          />
        );
      case "WishExpressLateOrderFine":
      case "WishExpressWithheldOrderFine":
        return (
          <WishExpressDeliveryTip
            className={css(this.styles.tip)}
            country={fineItem.transaction.country_code}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { className, fineItem } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {this.renderTip()}
        <TransactionFineDetailSheet
          fineItem={fineItem}
          fields={this.detailFields}
        />
      </div>
    );
  }
}
export default TransactionFineDetailRow;
