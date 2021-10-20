import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert, AlertType } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import PaymentHoldAlert from "@merchant/component/payments/account-balance/payment-hold/PaymentHoldAlert";

import { PaymentHoldType } from "@merchant/component/payments/account-balance/payment-hold/PaymentHoldAlert";
import { useLocalizationStore } from "@stores/LocalizationStore";

export type PaymentMessageProps = {
  readonly can_request_for_funds: boolean;
  readonly suspended_and_no_holds: boolean;
  readonly infraction_id: string;
  readonly next_payment_date: string;
  readonly reauthentication_id?: string;
  readonly withhold_funds_permanently: boolean;
  readonly show_invalid_weekly_disb_psp: boolean;
  readonly holds: Array<PaymentHoldType>;
};

const AccountBalancePaymentMessage = (props: PaymentMessageProps) => {
  const styles = useStyleSheet();
  const alertProps = useAlert(props);
  const { holds, reauthentication_id: reauthenticationId } = props;
  const reauthentication = reauthenticationId || "";
  const { locale } = useLocalizationStore();
  if (alertProps == null) {
    if (holds.length !== 0) {
      return (
        <PaymentHoldAlert
          className={css(styles.alert)}
          holds={holds}
          locale={locale}
          reauthenticationId={reauthentication}
        />
      );
    }
    return <div>Your next scheduled payment is {props.next_payment_date}</div>;
  }

  return <Alert className={css(styles.alert)} {...alertProps} />;
};

const useAlert = ({
  can_request_for_funds: canRequestForFunds,
  suspended_and_no_holds: suspendedAndNoHolds,
  infraction_id: infractionId,
  next_payment_date: nextPaymentDate,
  reauthentication_id: reauthenticationId,
  withhold_funds_permanently: withholdFundsPermanently,
  show_invalid_weekly_disb_psp: showInvalidWeeklyDisbPSP,
  holds,
}: PaymentMessageProps): AlertType | undefined => {
  if (suspendedAndNoHolds) {
    if (withholdFundsPermanently) {
      return {
        title: i`The payment for this account has been permanently withheld.`,
        text: "",
        sentiment: "negative",
      };
    }

    if (canRequestForFunds && infractionId) {
      return {
        title: i`The payment for this account has been suspended.`,
        text: "",
        sentiment: "negative",
        link: {
          text: i`Request for payment release`,
          url: `/warning/view/${infractionId}?request-payment=true`,
        },
      };
    }

    return {
      title: i`The payment for this account has been suspended.`,
      text: i`You will be eligible to request for payment after 3 months.`,
      sentiment: "negative",
    };
  }
  if (showInvalidWeeklyDisbPSP) {
    return {
      title: i`Your current provider is invalid for weekly disbursements.`,
      text: i`Please change your provider`,
      sentiment: "negative",
      link: {
        text: i`here`,
        url: `/payment-settings`,
      },
    };
  }
};

const useStyleSheet = () => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        alert: {
          fontSize: 14,
        },
      }),
    [],
  );
};

export default observer(AccountBalancePaymentMessage);
