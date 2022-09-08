/*
 * ShippingCard.tsx
 *
 * Created by Jonah Dlin on Tue Feb 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import CardHeader from "@merchant/component/wps/create-shipping-label/CardHeader";
import ShippingEditing from "./ShippingEditing";
import ShippingClosed from "./ShippingClosed";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Components */
import { Card, Spinner, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

import Link from "@next-toolkit/Link";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShippingCard: React.FC<Props> = ({ className, style, state }: Props) => {
  const styles = useStylesheet();

  const { shippingState, onReopenShipping } = state;

  const { cardState, isFetching } = shippingState;

  const renderContent = () => {
    return cardState === "EDITING" ? (
      <ShippingEditing className={css(styles.content)} state={state} />
    ) : (
      <ShippingClosed
        className={css(styles.content, styles.closedContent)}
        state={state}
      />
    );
  };

  return (
    <Card className={css(styles.root, className, style)}>
      <div className={css(styles.baseHeaderWrapper)}>
        <CardHeader
          icon="truckOutline"
          title={i`Shipping`}
          subtitle={i`How would you like to ship?`}
        />
        {isFetching && <Spinner size={24} />}
        {cardState === "CLOSED_EDITABLE" && (
          <Link onClick={onReopenShipping} className={css(styles.editLink)}>
            <Illustration
              className={css(styles.editIcon)}
              name="editWishBlue"
              alt=""
            />
            <Text>Edit</Text>
          </Link>
        )}
      </div>
      {renderContent()}
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 24,
        },
        baseHeaderWrapper: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        editLink: {
          display: "flex",
          alignItems: "center",
          marginLeft: 8,
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
    []
  );
};

export default observer(ShippingCard);
