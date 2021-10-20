import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { RichTextBanner } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Schema */
import { PaymentSettingsInitialData } from "@toolkit/payment-settings";
import { ChargePaymentProviderType } from "@schema/types";

type Props = BaseProps & {
  readonly initialData: PaymentSettingsInitialData;
};

const ChargeProviderNames: { [type in ChargePaymentProviderType]: string } = {
  NONE: i`None`,
  PAYPAL: i`PayPal`,
  PAYONEER: i`Payoneer`,
  UMPAY: i`UMPay`,
};

const PaymentSettings: React.FC<Props> = (props: Props) => {
  const {
    initialData: {
      payments: {
        currentMerchant: {
          personalInfo,
          hasActiveLoan,
          hasPayoutInProgress,
          nextPayoutTime,
          releasePayoutRequest,
          pendingChargeProviders,
        },
      },
      currentMerchant: { isStoreMerchant },
    },
    style,
    className,
  } = props;

  const styles = useStylesheet();

  const errorBody: string | undefined | null = useMemo(() => {
    if (isStoreMerchant) {
      return null;
    }

    if (!personalInfo) {
      return (
        i`We're missing a few pieces of information from you. Please review and update ` +
        i`your payment information to continue receiving payouts from Wish.`
      );
    } else if (hasActiveLoan) {
      return (
        i`Your payment provider cannot be changed because you currently have an ` +
        i`outstanding loan balance.`
      );
    } else if (hasPayoutInProgress && nextPayoutTime) {
      return (
        i`Your payment provider cannot be changed because your most recent ` +
        i`payout from ${nextPayoutTime.mmddyyyy} is currently being processed.`
      );
    } else if (
      releasePayoutRequest?.releasePaymentRequestId &&
      nextPayoutTime
    ) {
      return (
        i`Changing your payment provider will cause your payout from ` +
        i`${nextPayoutTime.mmddyyyy} to be delayed because you have an active payout release request.`
      );
    } else if (pendingChargeProviders && pendingChargeProviders.length > 0) {
      const name = ChargeProviderNames[pendingChargeProviders[0]];
      return (
        i`You have chosen ${name} as your payment provider. We are validating your ` +
        i`account with your chosen payment provider ${name}.`
      );
    }
  }, [
    isStoreMerchant,
    hasActiveLoan,
    hasPayoutInProgress,
    nextPayoutTime,
    releasePayoutRequest,
    pendingChargeProviders,
    personalInfo,
  ]);

  if (!errorBody) {
    return null;
  }

  return (
    <div className={css(className, style)}>
      <RichTextBanner
        sentiment="warning"
        title=""
        description={errorBody}
        contentAlignment="left"
        iconVerticalAlignment="top"
        className={css(styles.warningBanner)}
      />
    </div>
  );
};

export default observer(PaymentSettings);

const useStylesheet = () => {
  const { warning } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        warningBanner: {
          borderRadius: 4,
          border: `1px solid ${warning}`,
        },
      }),
    [warning],
  );
};
