import React, { useEffect } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import TrackingDisputeCreate from "@merchant/component/policy/disputes/TrackingDisputeCreate";
import WETrackingDisputeCreate from "@merchant/component/policy/disputes/WETrackingDisputeCreate";
import WFPTrackingDisputeCreate from "@merchant/component/policy/disputes/WFPTrackingDisputeCreate";
import FakeTrackingDisputeCreate from "@merchant/component/policy/disputes/FakeTrackingDisputeCreate";
import OrderCancellationDisputeCreate from "@merchant/component/policy/disputes/OrderCancellationDisputeCreate";
import Error403 from "@merchant/component/errors/Error403";

/* Merchant API */
import * as disputeApi from "@merchant/api/disputes";

import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { ShippingDetails } from "@merchant/api/orders";

const TrackingDisputeContainer = () => {
  const navigationStore = useNavigationStore();
  const { disputeType, orderId } = usePathParams(
    "/tracking-dispute/v2/create/:disputeType/:orderId"
  );
  // get tracking dispute form info
  const [response] = useRequest(
    disputeApi.getTrackingDisputeForm({
      order_id: orderId,
      dispute_type: disputeType,
    })
  );
  const result = response?.data;

  useEffect(() => {
    if (result == null) {
      return;
    }

    const { redirect, redirect_link: redirectLink } = result;
    if (redirect && redirectLink != null) {
      navigationStore.navigate(redirectLink);
    }
  }, [navigationStore, result]);

  if (result == null) {
    return <LoadingIndicator />;
  }

  const { page_info: pageInfo } = result;

  if (pageInfo == null) {
    return null;
  }

  const {
    transaction,
    fine_dicts: fines,
    tracking_number_modified_after_fine: trackingNumberModifiedAfterFine,
    past_tracking_info_dict: pti,
    tracking_number_modified_time: tnmt,
    wish_fulfillment_time: wishFulfillmentTime,
    wish_delivered_time: wishDeliveredTime,
    deliver_expected_deadline: deliverExpectedDeadline,
    confirm_exptected_deadline: confirmExptectedDeadline,
    wish_express_fine_dict: weFine,
    we_dispute_day: weDisputeDay,
    wish_express_late_reason_text_dict: weLateReasonTextDict,
    wish_express_reason_dict: weReasonEnum,
    disaster_timepoints_text_dict: disasterTimepointsTextDict,
    cancellation_reason_enum: cancelReasonEnum,
    cancellation_reason_text_dict: cancelReasonTextDict,
    previous_dispute: previousDispute,
    wfp_required_delivery_date: wfpRequiredDeliveryDate,
  } = pageInfo;

  if (previousDispute?.is_closed) {
    // Merchants aren't allowed to reopen a closed dispute.
    return <Error403 />;
  }

  const {
    state: customerState,
    country_code: customerCountry,
    street_address1: customerAddress1,
    street_address2: customerAddress2,
    zipcode: customerZipcode,
    city: customerCity,
    tracking_id: trackingId,
    provider: shippingCarrier,
  } = transaction?.shipping_details || {};
  const lcfFine = fines.find((fine) => fine.is_late_confirmed_fulfillment_fine);

  const hasPastInfo = trackingNumberModifiedAfterFine && pti;
  const pastTrackingId = hasPastInfo ? pti.old_tracking_id : null;
  const pastShippingCarrier = hasPastInfo ? pti.old_provider : null;
  const pastCarrierLastUpdated = hasPastInfo ? pti.last_updated_str : null;
  const trackingModifiedDate = hasPastInfo ? null : tnmt;
  const fineAmount = lcfFine?.localized_amount;
  const fineCurrency = lcfFine ? lcfFine.currency : "USD";
  const fakeTrackingFine = fines.find((fine) => fine.is_fake_tracking_fine);
  const merchantCancellationFine = fines.find(
    (fine) => fine.is_cancellation_fine
  );

  const shippingDetails: ShippingDetails = {
    street_address1: customerAddress1 || "",
    street_address2: customerAddress2,
    city: customerCity || "",
    state: customerState || "",
    zipcode: customerZipcode,
    country_code: customerCountry || "",
    country: customerCountry || "",
  };

  return (
    <>
      {disputeType === "lcp" && (
        <TrackingDisputeCreate
          orderId={orderId}
          trackingId={trackingId}
          shippingCarrier={shippingCarrier}
          trackingModifiedDate={trackingModifiedDate}
          wishFulfillmentTime={wishFulfillmentTime}
          wishDeliveredTime={wishDeliveredTime}
          fineAmount={fineAmount}
          fineCurrency={fineCurrency}
          deliverExpectedDeadline={deliverExpectedDeadline}
          confirmExptectedDeadline={confirmExptectedDeadline}
          customerState={customerState}
          customerCountry={customerCountry}
          pastTrackingId={pastTrackingId}
          pastShippingCarrier={pastShippingCarrier}
          pastCarrierLastUpdated={pastCarrierLastUpdated}
          trackingNumberModifiedAfterFine={trackingNumberModifiedAfterFine}
        />
      )}
      {disputeType === "we" && (
        <WETrackingDisputeCreate
          orderId={orderId}
          trackingId={trackingId}
          shippingCarrier={shippingCarrier}
          trackingModifiedDate={trackingModifiedDate}
          wishFulfillmentTime={wishFulfillmentTime}
          wishDeliveredTime={wishDeliveredTime}
          fineAmount={weFine.localized_amount}
          fineCurrency={weFine.localized_currency}
          weDisputeDay={weDisputeDay}
          deliverExpectedDeadline={deliverExpectedDeadline}
          customerState={customerState}
          customerCountry={customerCountry}
          weLateReasonTextDict={weLateReasonTextDict}
          weReasonEnum={weReasonEnum}
          disasterTimepointsTextDict={disasterTimepointsTextDict}
        />
      )}
      {disputeType === "wfp" && (
        <WFPTrackingDisputeCreate
          orderId={orderId}
          trackingId={trackingId}
          shippingCarrier={shippingCarrier}
          trackingModifiedDate={trackingModifiedDate}
          wishFulfillmentTime={wishFulfillmentTime}
          wishDeliveredTime={wishDeliveredTime}
          fineAmount={weFine.localized_amount}
          fineCurrency={weFine.localized_currency}
          deliverExpectedDeadline={deliverExpectedDeadline}
          customerState={customerState}
          customerCountry={customerCountry}
          weLateReasonTextDict={weLateReasonTextDict}
          weReasonEnum={weReasonEnum}
          disasterTimepointsTextDict={disasterTimepointsTextDict}
          wfpRequiredDeliveryDate={wfpRequiredDeliveryDate}
        />
      )}

      {disputeType === "fk" && (
        <FakeTrackingDisputeCreate
          orderId={orderId}
          trackingId={trackingId}
          shippingCarrier={shippingCarrier}
          fineAmount={fakeTrackingFine?.localized_amount}
          fineCurrency={fakeTrackingFine?.currency}
          disputeType="fk"
        />
      )}

      {disputeType === "uc" && (
        <FakeTrackingDisputeCreate
          orderId={orderId}
          trackingId={trackingId}
          shippingCarrier={shippingCarrier}
          fineAmount={fakeTrackingFine?.localized_amount}
          fineCurrency={fakeTrackingFine?.currency}
          disputeType="uc"
        />
      )}

      {disputeType === "oc" && (
        <OrderCancellationDisputeCreate
          orderId={orderId}
          trackingId={trackingId}
          shippingCarrier={shippingCarrier}
          shippingDetails={shippingDetails}
          disputeOpenDeadline={merchantCancellationFine?.dispute_open_deadline}
          fineAmount={merchantCancellationFine?.localized_amount}
          fineCurrency={merchantCancellationFine?.currency}
          cancelReasonEnum={cancelReasonEnum}
          cancelReasonTextDict={cancelReasonTextDict}
        />
      )}
    </>
  );
};

export default observer(TrackingDisputeContainer);
