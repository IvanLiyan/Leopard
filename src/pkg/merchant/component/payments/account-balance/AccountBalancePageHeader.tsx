import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { MultilineAlert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

type Props = {
  readonly fundsFrozen: boolean;
  readonly showTFALink: boolean;
  readonly showSetPaymentTip: boolean;
};

const AccountBalancePageHeader = ({
  fundsFrozen,
  showTFALink,
  showSetPaymentTip,
}: Props) => {
  const styles = useStyleSheet();

  if (fundsFrozen) {
    return null;
  }

  let lines: string[] = [];
  if (showTFALink) {
    const text =
      i`- **Enable Two Factor Two Factor Authentication **` +
      i` Your account must have Two Factor Authentication` +
      i` enabled to receive payments.` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i` [Enable Two Factor Authentication](/settings#two-factor-authentication)`;
    lines = [...lines, text];
  }

  if (showSetPaymentTip) {
    const text =
      i`- **Set up payments**` +
      i` Select a payment provider and submit your payment information` +
      i` to receive payments.` + // eslint-disable-next-line local-rules/no-links-in-i18n
      i` [Set up payments](/payment-settings)`;
    lines = [...lines, text];
  }

  if (lines.length == 0) {
    return null;
  }

  return (
    <div className={css(styles.banner)}>
      <MultilineAlert
        title={i`Before you receive your payments`}
        sentiment="warning"
        lines={lines}
      />
    </div>
  );
};

const useStyleSheet = () => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        banner: {
          padding: "20px 0",
        },
      }),
    []
  );
};

export default observer(AccountBalancePageHeader);
