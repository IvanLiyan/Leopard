/*
 * SummaryCard.tsx
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import CardHeader from "@merchant/component/wps/create-shipping-label/CardHeader";
import Separator from "@merchant/component/wps/create-shipping-label/Separator";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Lego Components */
import { Alert, Card, Text } from "@ContextLogic/lego";

/* Merchant Model */
import CreateShippingLabelState from "@merchant/model/CreateShippingLabelState";

type Props = BaseProps & {
  readonly state: CreateShippingLabelState;
};

const SummaryCard: React.FC<Props> = ({
  state: {
    shippingState: {
      selectedShippingOption,
      estimatedTotal,
      selectedAdditionalServicesDetails,
    },
  },
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  if (selectedShippingOption == null) {
    return null;
  }

  const {
    price: { display, currencyCode },
  } = selectedShippingOption;

  return (
    <Card className={css(styles.root, className, style)}>
      <CardHeader className={css(styles.header)} title={i`Summary`} />
      <div className={css(styles.priceTable)}>
        <Text className={css(styles.priceText)} weight="semibold">
          Subtotal
        </Text>
        <Text className={css(styles.priceText)}>{display}</Text>
      </div>
      {selectedAdditionalServicesDetails.map((service) => (
        <div className={css(styles.priceTable)}>
          <Text className={css(styles.priceText)} weight="semibold">
            {service.name}
          </Text>
          <Text className={css(styles.priceText)}>{service.fee?.display}</Text>
        </div>
      ))}
      <Separator className={css(styles.separator)} />
      <div className={css(styles.priceTable)}>
        <Text className={css(styles.totalText)} weight="semibold">
          Estimated Total
        </Text>
        <Text className={css(styles.totalText)} weight="semibold">
          {formatCurrency(estimatedTotal, currencyCode)}
        </Text>
      </div>
      <Alert
        className={css(styles.alert)}
        sentiment="info"
        text={
          i`The price is an estimate based on provided information and may ` +
          i`be adjusted on your further payments.`
        }
        link={{ text: i`Learn more`, url: "http://www.google.com" }}
      />
    </Card>
  );
};

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
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
        priceTable: {
          display: "flex",
          justifyContent: "space-between",
        },
        priceText: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        separator: {
          margin: "24px 0px",
        },
        totalText: {
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
        },
        alert: {
          marginTop: 24,
          maxWidth: 296,
        },
      }),
    [textDark, textBlack]
  );
};

export default observer(SummaryCard);
