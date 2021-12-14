/*
 * ShipFromCard.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { AnimatePresence, motion, Variants } from "framer-motion";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import CardHeader from "@merchant/component/wps/create-shipping-label/CardHeader";
import ShipFromEditing from "./ShipFromEditing";
import ShipFromAddEditAddress from "./ShipFromAddEditAddress";
import ShipFromClosed from "./ShipFromClosed";
import { Illustration } from "@merchant/component/core";

/* Lego Components */
import { Card, Link, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

/* Merchant Toolkit */
import {
  SubmitShippingAddressInputType,
  SubmitShippingAddressResponseType,
  SUBMIT_SHIPPING_ADDRESS,
  WarehouseAddress,
} from "@toolkit/wps/create-shipping-label";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@stores/ToastStore";

const CardPadding = 24;

const ADD_EDIT_ADDRESS_VARIANTS: Variants = {
  // Style to enter from
  enter: {
    x: `calc(100% + ${CardPadding * 2}px)`,
    position: "static",
    opacity: 0,
  },
  // Style to animate to on mount
  center: {
    x: 0,
    position: "static",
    opacity: 1,
  },
  // Style to exit to
  exit: {
    x: `calc(100% + ${CardPadding * 2}px)`,
    position: "absolute",
    opacity: 0,
  },
};

const BASE_CARD_VARIANTS: Variants = {
  enter: {
    x: `calc(-100% - ${CardPadding * 2}px)`,
    position: "static",
    opacity: 0,
  },
  center: {
    x: 0,
    position: "static",
    opacity: 1,
  },
  exit: {
    x: `calc(-100% - ${CardPadding * 2}px)`,
    position: "absolute",
    opacity: 0,
  },
};

const TRANSITION = { type: "spring", stiffness: 750, damping: 50 };

type MotionDivProps = {
  variants: Variants;
  uniqueKey: string;
  children: React.ReactNode;
};
const MotionDiv: React.FC<MotionDivProps> = ({
  variants,
  uniqueKey,
  children,
}: MotionDivProps) => (
  <motion.div
    key={uniqueKey}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={TRANSITION}
  >
    {children}
  </motion.div>
);

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShipFromCard: React.FC<Props> = ({ className, style, state }: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const {
    shipFromCardState,
    submittedWarehouse,
    onCloseShipFrom,
    onReopenShipFrom,
    initialData: {
      currentMerchant: {
        wps: { enabledOriginCountries },
      },
      fulfillment: {
        order: { id: orderId },
      },
    },
  } = state;

  const [isInAddEditScreen, setIsInAddEditScreen] = useState(false);
  const [warehouseEditing, setWarehouseEditing] = useState<
    WarehouseAddress | undefined
  >();
  const [initialSelectedId, setInitialSelectedId] = useState<
    string | undefined
  >(submittedWarehouse == null ? undefined : submittedWarehouse.id);

  const [submitShippingAddress] = useMutation<
    SubmitShippingAddressResponseType,
    SubmitShippingAddressInputType
  >(SUBMIT_SHIPPING_ADDRESS);

  const handleStartEdit = (warehouse?: WarehouseAddress) => {
    setWarehouseEditing(warehouse);
    setIsInAddEditScreen(true);
  };

  const handleCloseAddEdit = () => {
    setWarehouseEditing(undefined);
    setIsInAddEditScreen(false);
  };

  const handleAddEditSubmit = async (updatedId: string) => {
    setInitialSelectedId(updatedId);
    handleCloseAddEdit();
  };

  const handleSubmit = async (
    warehouse: WarehouseAddress,
  ): Promise<boolean> => {
    // State is required here but not in AddressSchema.
    // State is required in the Add/Edit flow so this case should not be reached
    if (warehouse.address.state == null) {
      toastStore.negative(
        ci18n(
          "Here 'state' refers to a geographical state of a country. The placeholder is the name of a warehouse.",
          "Please add a state to %1$s or select a different warehouse.",
          warehouse.warehouseName,
        ),
      );
      return false;
    }
    const { data } = await submitShippingAddress({
      variables: {
        input: [
          {
            orderId,
            address: {
              name: warehouse.address.name,
              streetAddress1: warehouse.address.streetAddress1,
              streetAddress2: warehouse.address.streetAddress2,
              city: warehouse.address.city,
              countryCode: warehouse.address.countryCode,
              zipcode: warehouse.address.zipcode,
              state: warehouse.address.state,
              phoneNumber: warehouse.address.phoneNumber,
            },
          },
        ],
      },
    });

    if (data == null) {
      toastStore.negative(i`Something went wrong`);
      return false;
    }

    const {
      fulfillment: {
        editOriginAddresses: { errorMessages },
      },
    } = data;

    if (errorMessages != null && errorMessages.length > 0) {
      toastStore.negative(errorMessages[0].message || i`Something went wrong`);
      return false;
    }

    setInitialSelectedId(warehouse.id);
    state.submittedWarehouse = warehouse;
    onCloseShipFrom();
    return true;
  };

  const renderBase = () => {
    return (
      <MotionDiv uniqueKey="EDITING" variants={BASE_CARD_VARIANTS}>
        <div className={css(styles.baseHeaderWrapper)}>
          <CardHeader
            icon="locationMarker"
            title={i`Ship from`}
            subtitle={i`Where are you shipping from?`}
          />
          {shipFromCardState === "CLOSED_EDITABLE" && (
            <Link onClick={onReopenShipFrom} className={css(styles.editLink)}>
              <Illustration
                className={css(styles.editIcon)}
                name="editWishBlue"
                alt=""
              />
              <Text>Edit</Text>
            </Link>
          )}
        </div>
        {shipFromCardState === "EDITING" ? (
          <ShipFromEditing
            className={css(styles.content)}
            onAddEditAddress={handleStartEdit}
            onSubmit={handleSubmit}
            initialSelectedId={initialSelectedId}
          />
        ) : (
          shipFromCardState === "CLOSED_EDITABLE" && (
            <ShipFromClosed
              className={css(styles.content, styles.closedContent)}
              state={state}
            />
          )
        )}
      </MotionDiv>
    );
  };

  const renderAddOrEditAddress = () => {
    const header =
      warehouseEditing != null ? i`Edit an address` : i`Add a new address`;
    return (
      <MotionDiv
        uniqueKey={"ADD_OR_EDIT_ADDRESS"}
        variants={ADD_EDIT_ADDRESS_VARIANTS}
      >
        <CardHeader title={header} />
        <ShipFromAddEditAddress
          className={css(styles.content)}
          onBack={handleCloseAddEdit}
          onSubmit={handleAddEditSubmit}
          warehouse={warehouseEditing}
          countryOptions={enabledOriginCountries}
        />
      </MotionDiv>
    );
  };

  const renderContent = () => {
    if (shipFromCardState === "EDITING" && isInAddEditScreen) {
      return renderAddOrEditAddress();
    }
    return renderBase();
  };

  return (
    <Card className={css(styles.root, className, style)}>
      <div className={css(styles.animationWrapper)}>
        <AnimatePresence initial={false}>{renderContent()}</AnimatePresence>
      </div>
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: CardPadding,
        },
        animationWrapper: {
          overflow: "hidden",
          position: "relative",
        },
        baseHeaderWrapper: {
          display: "flex",
          justifyContent: "space-between",
        },
        editLink: {
          display: "flex",
          alignItems: "center",
        },
        editIcon: {
          marginRight: 6,
          height: 16,
          width: 16,
        },
        content: {
          marginTop: 20,
        },
        closedContent: {
          marginLeft: 48,
        },
      }),
    [],
  );
};

export default observer(ShipFromCard);
