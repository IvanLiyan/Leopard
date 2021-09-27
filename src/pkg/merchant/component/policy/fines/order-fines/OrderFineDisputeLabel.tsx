import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Label } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as illustrations from "@assets/illustrations";

/* Merchant Components */
import FineDisputeStatusLabel from "@merchant/component/policy/fines/FineDisputeStatusLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FineDisplayItem, FineDisputeStatus } from "@merchant/api/fines";

type OrderFineDisputeLabelProps = BaseProps & {
  readonly currentDisputeStatus: FineDisputeStatus;
  readonly fineItem: FineDisplayItem;
};

const OrderFineDisputeLabel = (props: OrderFineDisputeLabelProps) => {
  const { className, style, fineItem, currentDisputeStatus } = props;
  const styles = useStylesheet();
  let popoverText: string | null | undefined = null;

  if (currentDisputeStatus !== null || fineItem.create_dispute_url) {
    const pastTrackingInfo = fineItem.transaction.past_tracking_info;

    if (
      fineItem.merchant_fine?.is_late_confirmed_fulfillment_fine &&
      pastTrackingInfo !== null &&
      pastTrackingInfo.modified_after_lcf_fine
    ) {
      const dateStr = pastTrackingInfo.last_updated_str;

      if (fineItem.create_dispute_url) {
        popoverText =
          i`Penalty will not be reversed because tracking information ` +
          i`was changed on ${dateStr}`;
      } else if (currentDisputeStatus == "APPROVED") {
        popoverText =
          i`Your dispute for this penalty was approved. ` +
          i`However, the penalty will not be reversed because tracking ` +
          i`information was changed on ${dateStr}`;
      }
    }

    return (
      <FineDisputeStatusLabel
        className={css(styles.root, className, style)}
        status={currentDisputeStatus}
        infoPopoverText={popoverText}
      />
    );
  }

  const now = new Date().getTime() / 1000;

  const trackingId =
    fineItem.transaction.shipping_details &&
    fineItem.transaction.shipping_details.tracking_id;
  const shippingProvider =
    fineItem.transaction.shipping_details &&
    fineItem.transaction.shipping_details.provider;

  if (!fineItem.fine_spec.disputable) {
    popoverText = i`This type of penalty is not disputable.`;
  } else if (fineItem.is_reversed) {
    popoverText = i`penalty has been reversed`;
  } else if (
    fineItem.dispute_deadline != null &&
    fineItem.dispute_deadline < now
  ) {
    popoverText = i`Dispute deadline has passed.`;
  } else if (fineItem.is_tracking_fine && (!trackingId || !shippingProvider)) {
    popoverText = i`Cannot dispute without a tracking number and provider.`;
  } else {
    popoverText = i`This penalty is not disputable.`;
  }

  return (
    <Label
      text={i`Cannot dispute`}
      textColor={colors.text}
      popoverContent={popoverText}
      backgroundColor={colors.grayED}
      popoverIcon={illustrations.redBulb}
      popoverMaxWidth={300}
    />
  );
};

export default OrderFineDisputeLabel;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    []
  );
