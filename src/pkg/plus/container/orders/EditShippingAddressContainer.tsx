/*
 *
 * EditShippingAddressContainer.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { runInAction } from "mobx";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

import { useToastStore } from "@stores/ToastStore";
import { useNavigationStore } from "@stores/NavigationStore";

import HttpError from "@merchant/component/errors/HttpError";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

import EditShippingAddressCard from "@plus/component/orders/fulfillment/EditShippingAddressCard";
import OrdersInfoCard from "@plus/component/orders/fulfillment/right-card/OrdersInfoCard";
import OrderEditState from "@plus/model/OrderEditState";
import {
  EditShippingAddresses,
  EditAddressInput,
  AddressUpdateError,
  FulfillmentMutationEditShippingAddressesArgs,
} from "@schema/types";
import {
  CountriesWeShipToPick,
  InitialOrderData,
} from "@toolkit/orders/fulfill-order";

const EDIT_SHIPPING_ADDRESSES_MUTATION = gql`
  mutation EditShippingAddressContainer_EditShippingAddressesMutation(
    $input: [EditAddressInput!]!
  ) {
    fulfillment {
      editShippingAddresses(input: $input) {
        updatedCount
        errorMessages {
          orderId
          message
        }
      }
    }
  }
`;

type InitialData = {
  readonly fulfillment: {
    readonly orders: ReadonlyArray<InitialOrderData> | null;
  };
  readonly platformConstants: {
    readonly countriesWeShipTo: CountriesWeShipToPick;
  };
};

type Props = {
  readonly initialData: InitialData;
};

const EditShippingAddressContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const {
    fulfillment: { orders },
    platformConstants: { countriesWeShipTo },
  } = initialData;

  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();
  const [editStates] = useState<ReadonlyArray<OrderEditState>>(
    (orders || []).map(
      (initialOrderData) =>
        new OrderEditState({
          order: { ...initialOrderData },
          countriesWeShipTo,
        }),
    ),
  );

  type MutationResponseType = {
    readonly fulfillment: {
      readonly editShippingAddresses: Pick<
        EditShippingAddresses,
        "updatedCount"
      > & {
        readonly errorMessages: ReadonlyArray<
          Pick<AddressUpdateError, "orderId" | "message">
        > | null;
      };
    };
  };

  const [shipTransactions] = useMutation<
    MutationResponseType,
    FulfillmentMutationEditShippingAddressesArgs
  >(EDIT_SHIPPING_ADDRESSES_MUTATION);
  if (editStates.length == 0) {
    return <HttpError status={404} />;
  }

  const onSave = async () => {
    let input: ReadonlyArray<EditAddressInput> = [];
    for (const editState of editStates) {
      const {
        id: orderId,
        name,
        state,
        streetAddress1,
        streetAddress2,
        city,
        zipcode,
        phoneNumber,
        countryCode,
      } = editState;

      if (
        phoneNumber == null ||
        name == null ||
        state == null ||
        streetAddress1 == null ||
        city == null
      ) {
        toastStore.negative(i`Required fields must be provided`);
        return;
      }

      input = [
        ...input,
        {
          orderId,
          address: {
            name,
            state,
            streetAddress1,
            streetAddress2,
            city,
            zipcode,
            phoneNumber,
            countryCode,
          },
        },
      ];
    }
    runInAction(() => {
      editStates.forEach((editState) => (editState.isSubmitting = true));
    });

    const cancelLoading = () =>
      runInAction(() => {
        editStates.forEach((editState) => (editState.isSubmitting = false));
      });

    try {
      const { data } = await shipTransactions({ variables: { input } });
      if (data == null) {
        toastStore.negative(i`Something went wrong`);
        return;
      }
      const editShippingAdressesResponse =
        data.fulfillment.editShippingAddresses;
      const { updatedCount, errorMessages } = editShippingAdressesResponse;
      if (updatedCount != editStates.length) {
        cancelLoading();
        if (errorMessages == null) {
          toastStore.negative(i`Something went wrong`);
        } else {
          // if you find this please fix the any types (legacy)
          const errors = errorMessages
            .map((errorObj: any) => errorObj.message)
            .join(". ");
          toastStore.negative(errors);
        }

        return;
      }
    } catch (e) {
      toastStore.negative(i`Something went wrong`);
      cancelLoading();
      return;
    }

    await navigationStore.navigate("/plus/orders/unfulfilled");
    toastStore.positive(
      ni18n(
        editStates.length,
        "Shipping address update is being processed!",
        "Shipping address updates are being processed!",
      ),
    );
  };

  const isReadySave = editStates.every(
    (editState) => editState.shippingAddressIsValid,
  );
  const isSubmitting = editStates.some((editState) => editState.isSubmitting);
  const actions = (
    <>
      <Button href="/plus/orders/unfulfilled" disabled={isSubmitting}>
        Cancel
      </Button>
      <PrimaryButton onClick={onSave} isDisabled={!isReadySave} minWidth>
        Save
      </PrimaryButton>
    </>
  );

  const title = ni18n(
    editStates.length,
    "Edit shipping address",
    "Edit shipping addresses",
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
        {editStates.map((editState) => (
          <div className={css(styles.info)}>
            <div className={css(styles.content)}>
              <EditShippingAddressCard
                editState={editState}
                className={css(styles.section)}
              />
            </div>
            <div className={css(styles.rightSide)}>
              <OrdersInfoCard
                orderId={editState.id}
                productId={editState.productId}
                productName={editState.productName}
                quantity={editState.quantity}
                size={editState.productSize}
                color={editState.productColor}
              />
            </div>
          </div>
        ))}
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        info: {
          display: "flex",
          paddingTop: 25,
          "@media (max-width: 900px)": {
            flexDirection: "column-reverse",
            alignItems: "stretch",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
        },
        section: {
          marginBottom: 25,
        },
        header: {
          top: 0,
          position: "sticky",
          zIndex: 200,
        },
        rightSide: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          "@media (min-width: 900px)": {
            width: "30%",
            paddingLeft: 35,
          },
        },
      }),
    [],
  );

export default observer(EditShippingAddressContainer);
