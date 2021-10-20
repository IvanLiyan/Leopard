import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { useUserStore } from "@stores/UserStore";

/* Merchant API */
import { getEarlyPaymentAvailableAmount } from "@merchant/api/early-payment";

const EarlyPaymentMarketingBanner = ({}) => {
  const styles = useStyleSheet();
  const earlyPaymentAvailableAmount = getEarlyPaymentAvailableAmount();
  const availableAmount = earlyPaymentAvailableAmount.response?.data;
  const { isPlusUser } = useUserStore();
  if (isPlusUser) {
    return null;
  }

  if (availableAmount && availableAmount.available_amount > 0) {
    return (
      <div className={css(styles.banner)}>
        <Alert
          text={
            i`Accelerate your cash flow by ${formatCurrency(
              availableAmount.available_amount,
              availableAmount.currency,
            )} ` + i`in your next payment and grow your business faster!`
          }
          sentiment="info"
          link={{
            text: i`Request Early Payment`,
            url: "/merchant-early-payment",
          }}
        />
      </div>
    );
  }
  return null;
};

const useStyleSheet = () => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        banner: {
          padding: "10px 0",
        },
      }),
    [],
  );
};

export default observer(EarlyPaymentMarketingBanner);
