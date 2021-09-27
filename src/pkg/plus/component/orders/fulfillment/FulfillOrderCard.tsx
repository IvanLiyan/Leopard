/*
 *
 * FulfillOrderCard.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/4/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import faker from "faker/locale/en";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { Card, Field, Text, TextInput } from "@ContextLogic/lego";

import { FormSelect } from "@ContextLogic/lego";

import { RequiredValidator } from "@toolkit/validators";

import OrderEditState from "@plus/model/OrderEditState";

import OrderDetailSection from "./OrderDetailSection";
import ConfirmedDeliveryIcon from "./icons/ConfirmedDeliveryIcon";
import SelectShippingProvider from "./SelectShippingProvider";

import WishExpressTip from "./right-card/WishExpressTip";
import ConfirmedDeliveryTip from "./right-card/ConfirmedDeliveryTip";

import WhatShouldIKnowCard from "./right-card/WhatShouldIKnowCard";
import WpsCard from "./right-card/WpsCard";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";
import WpsShippedWarning from "./WpsShippedWarning";

type Props = BaseProps & {
  readonly editState: OrderEditState;
};

const FulfillOrderCard: React.FC<Props> = ({
  editState,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();
  const { decision: showWPS, isLoading: showWPSIsLoading } = useDeciderKey(
    "md_wish_parcel_service"
  );

  const {
    id,
    isWishExpress,
    deliveryDeadline,
    initialData: { acceptableShippingOrigins, requiresConfirmedDelivery },
    hasCreatedWpsLabel,
    isConfirmedShipped,
  } = editState;

  const renderTip = () => {
    if (isWishExpress) {
      return (
        <WhatShouldIKnowCard className={css(styles.rightSideCard)}>
          <WishExpressTip orderId={id} deliveryDeadline={deliveryDeadline} />
        </WhatShouldIKnowCard>
      );
    }

    if (requiresConfirmedDelivery) {
      return (
        <WhatShouldIKnowCard className={css(styles.rightSideCard)}>
          <ConfirmedDeliveryTip />
        </WhatShouldIKnowCard>
      );
    }

    return null;
  };

  const renderWps = () => {
    const wpsEligible = editState.initialData.badges.includes("WPS_ELIGIBLE");

    if (showWPSIsLoading || !showWPS || !wpsEligible) {
      return null;
    }
    return (
      <WpsCard
        className={css(styles.rightSideCard)}
        id={id}
        hasCreatedWpsLabel={hasCreatedWpsLabel}
        isConfirmedShipped={isConfirmedShipped}
      />
    );
  };

  const renderWpsShippedWarning = () => {
    if (showWPS || !hasCreatedWpsLabel || isConfirmedShipped) {
      return null;
    }
    return <WpsShippedWarning orderId={id} />;
  };

  return (
    <div className={css(styles.root, className, style)}>
      <Card
        className={css(styles.contentOuter)}
        contentContainerStyle={css(styles.content)}
      >
        {renderWpsShippedWarning()}
        <div className={css(styles.header)}>
          <Text className={css(styles.headerText)} weight="bold">
            Order
          </Text>
          <div className={css(styles.orderId)}>{id}</div>
          {requiresConfirmedDelivery && <ConfirmedDeliveryIcon />}
        </div>
        <div className={css(styles.contentInner)}>
          <div className={css(styles.sideBySide)}>
            <Field title={i`Shipped from country / region`}>
              <FormSelect
                options={(acceptableShippingOrigins || []).map((country) => ({
                  value: country.code,
                  text: country.name,
                }))}
                onSelected={(
                  value: typeof editState.shippingOriginCode | undefined
                ) => {
                  editState.shippingOriginCode = value;
                }}
                selectedValue={editState.shippingOriginCode}
                placeholder={i`Select a country`}
                height={40}
                disabled={
                  editState.isSubmitting || editState.hasCreatedWpsLabel
                }
              />
            </Field>
          </div>
          <div className={css(styles.sideBySide)}>
            <Field title={i`Tracking number`}>
              <TextInput
                placeholder={i`Enter tracking number`}
                validators={[new RequiredValidator()]}
                value={editState.trackingId}
                onChange={({ text }) => {
                  editState.trackingId = text;
                }}
                onValidityChanged={(trackingIdIsValid) => {
                  editState.trackingIdIsValid = trackingIdIsValid;
                }}
                debugValue={faker.finance.iban()}
                disabled={editState.isSubmitting}
              />
            </Field>
            {editState.shippingOriginCode != null && (
              <Field title={i`Shipping provider`}>
                <SelectShippingProvider
                  orderId={editState.id}
                  originCountryCode={editState.shippingOriginCode}
                  onSelected={(value: string) => {
                    editState.shippingProviderId = parseInt(value);
                  }}
                  selectedValue={editState.shippingProviderId?.toString()}
                  height={40}
                  placeholder={i`Select a provider`}
                  disabled={editState.isSubmitting}
                  isWps={hasCreatedWpsLabel}
                />
              </Field>
            )}
          </div>
          <div className={css(styles.sideBySide)}>
            <Field title={i`Note`}>
              <TextInput
                className={css(styles.textArea)}
                placeholder={i`Add a note to yourself (optional)`}
                isTextArea
                value={editState.shipNote}
                onChange={({ text }) => {
                  editState.shipNote = text;
                }}
                height={100}
                debugValue={faker.lorem.sentence()}
                disabled={editState.isSubmitting}
              />
            </Field>
          </div>
        </div>
        <OrderDetailSection editState={editState} />
      </Card>
      <div className={css(styles.rightSide)}>
        {renderTip()}
        {renderWps()}
      </div>
    </div>
  );
};

export default observer(FulfillOrderCard);

const useStylesheet = () => {
  const { surfaceLight, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          "@media (max-width: 900px)": {
            flexDirection: "column-reverse",
            alignItems: "stretch",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "flex-start",
          },
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
        contentOuter: {
          "@media (min-width: 900px)": {
            width: "70%",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflow: "hidden",
          flex: 1,
        },
        header: {
          backgroundColor: surfaceLight,
          padding: "13px 20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        headerText: {
          fontSize: 15,
          marginRight: 30,
        },
        orderId: {
          fontWeight: fonts.weightNormal,
          fontSize: 15,
          marginRight: 10,
        },
        contentInner: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: surfaceLightest,
          padding: "15px 20px",
        },
        sideBySide: {
          "@media (min-width: 900px)": {
            display: "flex",
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
              width: 350,
              ":first-child": {
                marginRight: 20,
              },
            },
          },
          "@media (max-width: 900px)": {
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            ":nth-child(1n) > div": {
              minWidth: 350,
              ":first-child": {
                marginRight: 20,
              },
              ":not(:first-child)": {
                marginTop: 20,
              },
            },
          },
          marginBottom: 20,
        },
        field: {
          marginBottom: 20,
        },
        textArea: {},
        rightSideCard: {
          marginBottom: 20,
        },
      }),
    [surfaceLight, surfaceLightest]
  );
};
