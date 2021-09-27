import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import TimeToDoor from "@merchant/component/logistics/TimeToDoor";
import TrackingNumber from "@merchant/component/logistics/TrackingNumber";
import ConfirmedFulfillmentTime from "@merchant/component/policy/fines/ConfirmedFulfillmentTime";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineDisplayItem } from "@merchant/api/fines";

export type TransactionFineDetailField =
  | "state"
  | "tracking_number"
  | "order_total"
  | "time_to_door"
  | "tracking_valid"
  | "delivery_time_requirement"
  | "tracking_confirmed"
  | "delivery_confirmed"
  | "time_to_door_requirement"
  | "release_time"
  | "confirmed_fulfillment_hours"
  | "tracking_confirmed_time"
  | "refunded_time"
  | "dispute_approved_deadline";

export type TransactionFineDetailSheetProps = BaseProps & {
  readonly fineItem: FineDisplayItem;
  readonly fields: ReadonlyArray<TransactionFineDetailField>;
};

const TitleWidth = 250;

@observer
class TransactionFineDetailSheet extends Component<
  TransactionFineDetailSheetProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      item: {
        marginBottom: 12,
      },
    });
  }

  renderDetail(field: TransactionFineDetailField) {
    const { fineItem } = this.props;
    const transaction = fineItem.transaction;
    const trackingId =
      transaction.shipping_details && transaction.shipping_details.tracking_id;
    const isValidTracking =
      transaction.shipping_details &&
      transaction.shipping_details.is_tracking_valid;
    const trackingConfirmed =
      transaction.shipping_details &&
      transaction.shipping_details.tracking_confirmed;
    const trackingConfirmedTime =
      transaction.shipping_details &&
      transaction.shipping_details.tracking_confirmed_time;
    const isDelivered =
      transaction.shipping_details && transaction.shipping_details.is_delivered;
    const wishExpressExtensionDays = transaction.wish_express_extension_days;

    const timeToDoorAddedText =
      wishExpressExtensionDays != null && wishExpressExtensionDays > 0
        ? i`(${wishExpressExtensionDays} business day extension added)`
        : i`(${
            transaction.shipping_details
              ? transaction.shipping_details.country_code
              : "N/A"
          })`;

    switch (field) {
      case "state":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Order status`}
            value={transaction.state}
            titleWidth={TitleWidth}
          />
        );
      case "tracking_number":
        if (trackingId == null) {
          return null;
        }

        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Tracking number`}
            value={() => (
              <TrackingNumber
                number={trackingId}
                orderId={transaction.id}
                isValid={!!isValidTracking}
              />
            )}
            titleWidth={TitleWidth}
          />
        );
      case "order_total":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Order total`}
            value={formatCurrency(
              transaction.localized_total_with_wishpost,
              transaction.currency_code
            )}
            titleWidth={TitleWidth}
          />
        );
      case "tracking_confirmed":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Tracking confirmed`}
            value={trackingConfirmed ? i`Yes` : i`No`}
            titleWidth={TitleWidth}
          />
        );
      case "delivery_confirmed":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Delivery confirmed`}
            value={isDelivered ? i`Yes` : i`No`}
            titleWidth={TitleWidth}
          />
        );
      case "tracking_valid":
        if (trackingId != null) {
          return (
            <SheetItem
              key={field}
              className={css(this.styles.item)}
              title={i`Tracking number is valid`}
              value={isValidTracking ? i`Yes` : i`No`}
              titleWidth={TitleWidth}
            />
          );
        }

        break;
      case "time_to_door_requirement":
        if (transaction.max_ttd != null) {
          return (
            <SheetItem
              key={field}
              className={css(this.styles.item)}
              title={i`Time-to-door requirement`}
              value={
                i`${transaction.max_ttd} business days` +
                " " +
                timeToDoorAddedText
              }
              titleWidth={TitleWidth}
            />
          );
        }

        break;
      case "time_to_door":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Time-to-door`}
            value={() => (
              <TimeToDoor
                ttd={transaction.business_days_to_arrival}
                maxTTD={transaction.max_ttd}
              />
            )}
            titleWidth={TitleWidth}
          />
        );
      case "release_time":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Available for fulfillment`}
            value={transaction.available_for_fulfillment_time || ""}
            titleWidth={TitleWidth}
          />
        );
      case "confirmed_fulfillment_hours":
        if (!trackingConfirmed) {
          return null;
        }

        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Time to confirmed fulfillment`}
            value={() => (
              <ConfirmedFulfillmentTime
                timeInHours={transaction.confirmed_fulfillment_hours}
                requiredTimeInHours={
                  transaction.confirmed_fulfillment_hours_requirement
                }
              />
            )}
            titleWidth={TitleWidth}
          />
        );
      case "tracking_confirmed_time": {
        if (!trackingConfirmedTime) {
          return null;
        }

        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Tracking Confirmed Date`}
            value={trackingConfirmedTime}
            titleWidth={TitleWidth}
          />
        );
      }
      case "refunded_time": {
        const refundTime = transaction.refunded_time;
        if (!refundTime) {
          return null;
        }
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Refunded Date`}
            value={refundTime}
            titleWidth={TitleWidth}
          />
        );
      }
      case "dispute_approved_deadline": {
        const disputeApprovedDeadline = fineItem.dispute_approved_deadline;
        if (!disputeApprovedDeadline) {
          return null;
        }
        return (
          <SheetItem
            key={"dispute_approved_deadline"}
            className={css(this.styles.item)}
            title={i`Dispute approval deadline`}
            value={disputeApprovedDeadline}
            popoverContent={i`The fine can be reversed if dispute gets approved before this date`}
            titleWidth={TitleWidth}
          />
        );
      }
      default:
        return null;
    }
  }

  render() {
    const { className, fields } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {fields.map((field) => this.renderDetail(field))}
      </div>
    );
  }
}
export default TransactionFineDetailSheet;
