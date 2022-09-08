/*
 * ShipToCard.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
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

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Toolkit */
import { getCountryName } from "@toolkit/countries";

/* Lego Components */
import { Card, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShipToCard: React.FC<Props> = ({
  state: {
    initialData: {
      fulfillment: {
        order: { shippingDetails },
      },
    },
  },
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  const name = shippingDetails?.name || "";
  const phoneNumber = shippingDetails?.phoneNumber || "";

  const renderAddress = () => {
    const line1 = shippingDetails?.streetAddress1;
    const line2 = shippingDetails?.streetAddress2;
    const line3 =
      [
        ...(shippingDetails?.city != null ? [shippingDetails.city] : []),
        ...(shippingDetails?.state != null ? [shippingDetails.state] : []),
        ...(shippingDetails?.zipcode != null ? [shippingDetails.zipcode] : []),
      ].join(", ") || null;
    const line4 =
      shippingDetails?.countryCode != null
        ? getCountryName(shippingDetails?.countryCode)
        : null;

    const lines = [line1, line2, line3, line4].filter((line) => line != null);

    return (
      <div className={css(styles.address)}>
        {lines.map((line, index) => (
          <Text key={line} className={css(styles.text)}>
            {line}
            {index != lines.length - 1 && ","}
          </Text>
        ))}
      </div>
    );
  };

  return (
    <Card className={css(styles.root, className, style)}>
      <CardHeader
        className={css(styles.header)}
        icon="paperAirplane"
        title={i`Ship to`}
      />
      <div className={css(styles.content)}>
        <Text className={css(styles.text)} weight="semibold">
          Customer
        </Text>
        <Text className={css(styles.text)}>{name}</Text>
        <Text className={css(styles.text)} weight="semibold">
          Address
        </Text>
        {renderAddress()}
        <Text className={css(styles.text)} weight="semibold">
          Phone
        </Text>
        <Text className={css(styles.text)}>{phoneNumber}</Text>
      </div>
    </Card>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 24,
        },
        header: {
          marginBottom: 16,
        },
        content: {
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          rowGap: 12,
          columnGap: "8px",
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        address: {
          display: "flex",
          flexDirection: "column",
        },
      }),
    [textDark]
  );
};

export default observer(ShipToCard);
