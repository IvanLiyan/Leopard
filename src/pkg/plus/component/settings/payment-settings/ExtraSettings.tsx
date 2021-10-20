import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightSemibold } from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Schema */
import { PaymentSettingsInitialData } from "@toolkit/payment-settings";
import { PayoutPaymentProviderType } from "@schema/types";

type Props = BaseProps & {
  readonly initialData: PaymentSettingsInitialData;
  readonly providerType: PayoutPaymentProviderType;
};

const ExtraSettings: React.FC<Props> = (props: Props) => {
  const {
    initialData: {
      payments: {
        currentMerchant: { infoCollectedForPaymentProvider },
      },
      currentMerchant: { id },
    },
    providerType,
  } = props;
  const styles = useStylesheet();

  const getEmailLabel = (providerType: PayoutPaymentProviderType) => {
    switch (providerType) {
      case "PAYPAL":
        return i`PayPal account email`;
      case "PAYPAL_MERCH":
        return i`PayPal account email`;
      case "PAYONEER":
        return i`Payoneer account email`;
      default:
        return i`Account email`;
    }
  };

  return (
    <>
      <HorizontalField
        title={i`Information collected by provider`}
        titleAlign="start"
        titleStyle={styles.titleStyle}
      />
      {infoCollectedForPaymentProvider && (
        <HorizontalField titleAlign="start" title={getEmailLabel(providerType)}>
          {infoCollectedForPaymentProvider.email}
        </HorizontalField>
      )}
      <HorizontalField titleAlign="start" title={i`Merchant ID`}>
        {id}
      </HorizontalField>
    </>
  );
};

export default observer(ExtraSettings);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        titleStyle: {
          fontWeight: weightSemibold,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
