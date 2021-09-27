import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PayoutPaymentProviderType } from "@schema/types";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly providerType: PayoutPaymentProviderType;
  readonly setup?: boolean;
  readonly isStoreMerchant?: boolean;
};

const PaymentProviderDetails: React.FC<Props> = (props: Props) => {
  const {
    providerType,
    className,
    setup = false,
    isStoreMerchant = false,
  } = props;
  const styles = useStylesheet();

  const paypalUrl = "https://www.paypal.com/ca/for-you/account/create-account";
  const payoneerUrl = "https://www.payoneer.com/accounts/?from=login";

  const setupPayPal =
    i`* You must link to an existing PayPal account. If you do not have a PayPal ` +
    i`account yet, please [sign up on PayPal](${paypalUrl}).` +
    `\n`;

  const setupPayoneer =
    i`* You must link to an existing Payoneer account. If you do not have a Payoneer ` +
    i`account yet, please [sign up on Payoneer](${payoneerUrl}).` +
    `\n`;

  const infoPayPal =
    i`* It usually takes **5-7** business days for the payment amount (in USD) to ` +
    i`arrive in your PayPal account.` +
    `\n` +
    i`* On receiving the payment amount, you may withdraw it to your local bank ` +
    i`account, or use it for overseas purchases.` +
    `\n\n` +
    i`[Learn more about PayPal](${zendeskURL("231576007")})
  `;

  const infoPayoneer =
    i`* It usually takes **5-7** business days for the payment amount (in USD) to ` +
    i`arrive in your Payoneer account.` +
    `\n` +
    i`* You can withdraw your funds to your local bank account, or instantly access ` +
    i`your funds using your Payoneer Prepaid MasterCard at ATMs, in-stores, or online.` +
    `\n\n` +
    i`[Learn more about Payoneer](${zendeskURL("229518947")})
  `;

  const payPalStoreMerchant =
    i`You must link to an existing PayPal account. If you do not have a PayPal ` +
    i`account yet, please [sign up on PayPal](${paypalUrl}).`;

  const getSetupBullet = (providerType: PayoutPaymentProviderType) => {
    switch (providerType) {
      case "PAYPAL":
        return setupPayPal;
      case "PAYPAL_MERCH":
        return setupPayPal;
      case "PAYONEER":
        return setupPayoneer;
      default:
        return setupPayPal;
    }
  };

  const getInstructions = (providerType: PayoutPaymentProviderType) => {
    switch (providerType) {
      case "PAYPAL":
        return infoPayPal;
      case "PAYPAL_MERCH":
        return infoPayPal;
      case "PAYONEER":
        return infoPayoneer;
      default:
        return infoPayPal;
    }
  };

  const getText = (providerType: PayoutPaymentProviderType) => {
    if (isStoreMerchant) {
      return payPalStoreMerchant;
    }
    if (setup) {
      return getSetupBullet(providerType) + getInstructions(providerType);
    }
    return getInstructions(providerType);
  };

  return (
    <div className={css(className)}>
      <article className={css(styles.card)}>
        <div className={css(styles.titleContainer, styles.title)}>
          {isStoreMerchant
            ? i`What if I don’t have a PayPal account?`
            : i`What should I know?`}
        </div>
        <div className={css(styles.body)}>
          {!isStoreMerchant && (
            <p className={css(styles.title)} style={{ marginBottom: 10 }}>
              Selected provider information:
            </p>
          )}
          <Markdown text={getText(providerType)} />
        </div>
      </article>
    </div>
  );
};

export default observer(PaymentProviderDetails);

const useStylesheet = () => {
  const {
    surfaceLightest,
    pageBackground,
    textBlack,
    borderPrimary,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderRadius: 4,
          border: `solid 1px ${borderPrimary}`,
          backgroundColor: surfaceLightest,
        },
        title: {
          color: textBlack,
          fontSize: 16,
          fontWeight: weightBold,
          lineHeight: 1.5,
        },
        titleContainer: {
          background: pageBackground,
          padding: "12px 20px",
        },
        body: {
          fontSize: 14,
          lineHeight: "24px",
          padding: "20px 24px 24px 24px",
        },
      }),
    [surfaceLightest, textBlack, pageBackground, borderPrimary]
  );
};
