import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

const WeeklyPaymentChangeProvidersBanner = ({}) => {
  const styles = useStyleSheet();
  return (
    <div className={css(styles.banner)}>
      <Alert
        text={
          i`Paypal and Payoneer are the only accepted payment providers for ` +
          i`weekly disbursements. Please update your provider to continue ` +
          i`receiving weekly payments. If you do not update your provider and` +
          i` do not opt out of this program by contacting your account manager, ` +
          i`your payments may not process correctly.`
        }
        sentiment="info"
        link={{
          text: i`Update Provider`,
          url: "/payment-settings",
        }}
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

export default observer(WeeklyPaymentChangeProvidersBanner);
