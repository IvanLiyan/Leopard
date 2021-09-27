import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OrderType } from "@toolkit/orders/unfulfilled-orders";
import { Text, ThemedLabel, Layout } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

type Props = BaseProps & {
  readonly order: OrderType;
};

const OrderDestinationLabel: React.FC<Props> = ({
  className,
  style,
  order: { shippingDetails },
}: Props) => {
  const styles = useStylesheet();
  const country = shippingDetails?.country;
  if (country == null) {
    return null;
  }

  return (
    <ThemedLabel className={css(className, style)} theme="LightGrey">
      <Layout.FlexRow className={css(styles.content)}>
        <Flag className={css(styles.flag)} countryCode={country.code} />
        <Text weight="semibold">{country.code}</Text>
      </Layout.FlexRow>
    </ThemedLabel>
  );
};

export default observer(OrderDestinationLabel);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        flag: {
          width: 15,
          marginRight: 10,
        },
        content: {
          padding: "5px 3px",
        },
      }),
    []
  );
};
