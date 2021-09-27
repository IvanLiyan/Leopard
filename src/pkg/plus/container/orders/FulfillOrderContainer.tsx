/*
 *
 * FulfillOrderContainer.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useEffect } from "react";
import { runInAction } from "mobx";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

import { useMutation } from "@apollo/react-hooks";

/* Legacy */
import { cni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

import { useToastStore } from "@merchant/stores/ToastStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

import HttpError from "@merchant/component/errors/HttpError";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import FulfillOrderCard from "@plus/component/orders/fulfillment/FulfillOrderCard";
import OrderEditState from "@plus/model/OrderEditState";
import { FulfillmentError } from "@schema/types";
import {
  CancelWpsLabelInputType,
  CancelWpsLabelResponseType,
  CANCEL_WPS_LABEL_MUTATION,
} from "@toolkit/orders/refund";
import {
  ShipTransactionsResponseType,
  ShipTransactionsInputType,
  SHIP_TRANSACTIONS_MUTATION,
  FulfillOrdersInitialData,
  ModifyTrackingInputType,
  MODIFY_TRACKING_MUTATION,
  ModifyTrackingResponseType,
} from "@toolkit/orders/fulfill-order";

type Props = {
  readonly initialData: FulfillOrdersInitialData;
};

const FulfillOrderContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();
  const {
    fulfillment: { orders },
    platformConstants: { countriesWeShipTo },
  } = initialData;

  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const [editStates] = useState<ReadonlyArray<OrderEditState>>(
    (orders || [])
      .filter((initialOrderData) => {
        const hasWps =
          initialOrderData.wpsFulfillment != null &&
          initialOrderData.wpsFulfillment.shippingOptionId != null;
        return (
          initialOrderData.state == "APPROVED" ||
          (initialOrderData.state === "SHIPPED" &&
            hasWps &&
            initialOrderData.canModifyTrackingInfo)
        );
      })
      .map(
        (initialOrderData) =>
          new OrderEditState({
            order: { ...initialOrderData },
            countriesWeShipTo,
          })
      )
  );

  useEffect(() => {
    // If there no valid orders to be fulfilled go back to
    // Unfulfilled orders page.
    if (editStates.length == 0) {
      navigationStore.navigate("/transactions/action");
      return;
    }
  }, [navigationStore, editStates]);

  const [shipTransactions] = useMutation<
    ShipTransactionsResponseType,
    ShipTransactionsInputType
  >(SHIP_TRANSACTIONS_MUTATION);

  const [modifyTrackingMutation] = useMutation<
    ModifyTrackingResponseType,
    ModifyTrackingInputType
  >(MODIFY_TRACKING_MUTATION);

  const [cancelWpsLabel] = useMutation<
    CancelWpsLabelResponseType,
    CancelWpsLabelInputType
  >(CANCEL_WPS_LABEL_MUTATION);

  if (editStates.length == 0) {
    return <HttpError status={404} />;
  }

  const onSave = async () => {
    const validEditStates = editStates.filter(
      ({
        shippingProviderId: providerId,
        shippingOriginCode: originCountryCode,
        trackingId,
        isReadyFulFill,
      }) =>
        isReadyFulFill &&
        providerId != null &&
        originCountryCode != null &&
        trackingId != null &&
        originCountryCode != null
    );
    const [createEditStates, modifyEditStates] = _.partition(
      validEditStates,
      ({ initialData: { state } }) => state === "APPROVED"
    );

    const createInput = createEditStates.reduce(
      (
        acc,
        {
          id: orderId,
          shippingProviderId: providerId,
          shippingOriginCode: originCountryCode,
          shipNote,
          trackingId,
        }
      ) => {
        if (
          !isReadyFulFill ||
          providerId == null ||
          originCountryCode == null ||
          trackingId == null ||
          originCountryCode == null
        ) {
          return acc;
        }
        return [
          ...acc,
          {
            orderId,
            shipNote,
            providerId,
            trackingId,
            originCountryCode,
          },
        ];
      },
      [] as ShipTransactionsInputType["input"]
    );

    const modifyInput = modifyEditStates.reduce(
      (
        acc,
        {
          id: orderId,
          shippingProviderId: providerId,
          shippingOriginCode: originCountryCode,
          shipNote,
          trackingId,
        }
      ) => {
        if (
          !isReadyFulFill ||
          providerId == null ||
          originCountryCode == null ||
          trackingId == null ||
          originCountryCode == null
        ) {
          return acc;
        }
        return [
          ...acc,
          {
            orderId,
            shipNote,
            providerId,
            trackingId,
            originCountryCode,
          },
        ];
      },
      [] as ModifyTrackingInputType["input"]
    );

    runInAction(() => {
      editStates.forEach((editState) => (editState.isSubmitting = true));
    });

    const cancelLoading = () =>
      runInAction(() => {
        editStates.forEach((editState) => (editState.isSubmitting = false));
      });

    const modifyTracking = async () => {
      const wpsOks = await Promise.all(
        modifyInput.map(async ({ orderId }) => {
          const editState = editStates.find(({ id }) => id === orderId);
          if (editState == null || !editState.hasCreatedWpsLabel) {
            return true;
          }

          const { data } = await cancelWpsLabel({
            variables: { input: { orderId } },
          });
          if (data == null || !data.fulfillment.cancelWpsTrackingId.ok) {
            toastStore.negative(
              data?.fulfillment.cancelWpsTrackingId?.errorMessage ||
                i`Something went wrong`
            );
            return false;
          }
          return true;
        })
      );

      if (wpsOks.some((ok) => !ok)) {
        return false;
      }

      const { data } = await modifyTrackingMutation({
        variables: { input: modifyInput },
      });
      if (data == null) {
        toastStore.negative(i`Something went wrong`);
        return false;
      }

      const modifyTrackingResponse = data.fulfillment.modifyTrackingOrders;
      const { modifyTrackingCount, errorMessages } = modifyTrackingResponse;
      if (modifyTrackingCount != modifyInput.length) {
        if (errorMessages == null) {
          toastStore.negative(i`Something went wrong`);
        } else {
          const errors = errorMessages
            .map((errorObj) => errorObj.message)
            .join(". ");
          toastStore.negative(errors);
        }

        return false;
      }

      return true;
    };

    try {
      const modifySuccess = await modifyTracking();
      if (!modifySuccess) {
        cancelLoading();
        return;
      }

      if (createInput.length > 0) {
        const { data } = await shipTransactions({
          variables: { input: createInput },
        });
        if (data == null) {
          toastStore.negative(i`Something went wrong`);
          return;
        }

        const fulfillOrdersResponse = data.fulfillment.fulfillOrders;
        const { shippedCount, errorMessages } = fulfillOrdersResponse;
        if (shippedCount != createInput.length) {
          cancelLoading();
          if (errorMessages == null) {
            toastStore.negative(i`Something went wrong`);
          } else {
            const errors = errorMessages
              .map((errorObj: FulfillmentError) => errorObj.message)
              .join(". ");
            toastStore.negative(errors);
          }

          return;
        }
      }
    } catch (e) {
      toastStore.negative(i`Something went wrong`);
      cancelLoading();
      return;
    }

    if (editStates.length == 1 && editStates[0].hasCreatedWpsLabel) {
      await navigationStore.navigate(`/order/${editStates[0].id}`);
    } else {
      await navigationStore.navigate("/plus/orders/unfulfilled");
    }

    toastStore.positive(
      cni18n(
        "'Fulfill' here is a VERB. Means to ship the order",
        editStates.length,
        "Order is being processed for fulfillment!",
        "Orders are being processed for fulfillment!"
      )
    );
  };

  const isReadyFulFill = editStates.every(
    (editState) => editState.isReadyFulFill
  );
  const isSubmitting = editStates.some((editState) => editState.isSubmitting);
  const actions = (
    <>
      <Button href="/plus/orders/unfulfilled" disabled={isSubmitting}>
        Cancel
      </Button>
      <PrimaryButton onClick={onSave} isDisabled={!isReadyFulFill} minWidth>
        {cni18n(
          "'Fulfill' here is a VERB. Means to ship the order",
          editStates.length,
          "Fulfill order",
          "Fulfill orders"
        )}
      </PrimaryButton>
    </>
  );

  const title = cni18n(
    "'Fulfill' here is a VERB. Means to ship the order",
    editStates.length,
    "Fulfill order",
    "Fulfill orders"
  );
  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={title}
        breadcrumbs={[
          { name: i`Unfulfilled Orders`, href: "/plus/orders/unfulfilled" },
          { name: title, href: window.location.href },
        ]}
        actions={actions}
        className={css(styles.header)}
      />
      <PageGuide>
        <div className={css(styles.content)}>
          {editStates.map((editState) => (
            <FulfillOrderCard
              key={editState.initialData.id}
              editState={editState}
              className={css(styles.section)}
            />
          ))}
        </div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
        section: {
          margin: "15px 0px",
        },
      }),
    []
  );

export default observer(FulfillOrderContainer);
