import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ExpeditedPaymentBannerProps = BaseProps & {
  readonly expeditedProcessDaysToPayment: number;
};

const ExpeditedPaymentBanner = (props: ExpeditedPaymentBannerProps) => {
  const styles = useStyleSheet();
  const { expeditedProcessDaysToPayment } = props;
  return (
    <div className={css(styles.banner)}>
      <Alert
        title={i`Expedited Payment Eligibility`}
        text={
          i`Your orders are eligible for payment as soon as they are confirmed ` +
          i`shipped by Wish through verified tracking information. Orders that are not ` +
          i`confirmed shipped are eligible for payment ${expeditedProcessDaysToPayment} days ` +
          i`after fulfillment date if tracking is uploaded.`
        }
        sentiment="info"
      />
    </div>
  );
};

const useStyleSheet = () => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        banner: {
          padding: "10px 0",
        },
      }),
    []
  );
};

export default observer(ExpeditedPaymentBanner);
