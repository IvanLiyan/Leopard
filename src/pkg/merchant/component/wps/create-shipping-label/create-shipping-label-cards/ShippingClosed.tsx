/*
 * ShippingClosed.tsx
 *
 * Created by Jonah Dlin on Tue Feb 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import { Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";
import { useTheme } from "@stores/ThemeStore";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const ShippingClosed: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();

  const { shippingState } = state;

  const { selectedShippingOption: option, estimatedTotal } = shippingState;

  if (option == null) {
    return null;
  }

  const methodString = `${option.name} - ${formatCurrency(
    estimatedTotal,
    option.price.currencyCode,
  )}`;

  const deliveryDate = formatDatetimeLocalized(
    moment().add(option.daysToDeliver, "d"),
    "MMM DD, YYYY",
  );

  return (
    <div className={css(styles.root, className, style)}>
      <Text className={css(styles.text)} weight="semibold">
        Shipping method and price
      </Text>
      <Text className={css(styles.text)}>{methodString}</Text>
      <Text className={css(styles.text)} weight="semibold">
        Estimated delivery time
      </Text>
      <Text className={css(styles.text)}>{deliveryDate}</Text>
    </div>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridTemplateColumns: "max-content max-content",
          columnGap: "80px",
          rowGap: 8,
        },
        text: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        separator: {
          margin: "16px 0px",
        },
      }),
    [textDark],
  );
};

export default observer(ShippingClosed);
