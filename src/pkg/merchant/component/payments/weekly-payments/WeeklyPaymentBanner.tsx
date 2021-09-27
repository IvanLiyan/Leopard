import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WeeklyPaymentBannerProps = BaseProps & {
  readonly nextDisbursementDate: string;
};

const WeeklyPaymentBanner = (props: WeeklyPaymentBannerProps) => {
  const styles = useStyleSheet();
  const { nextDisbursementDate } = props;
  return (
    <div className={css(styles.banner)}>
      <Alert
        text={
          i`As part of the Weekly Payment program, your ` +
          i`next scheduled payment will be paid on ${nextDisbursementDate}`
        }
        sentiment="info"
        link={{
          text: i`View details`,
          url: "/account-balance",
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

export default observer(WeeklyPaymentBanner);
