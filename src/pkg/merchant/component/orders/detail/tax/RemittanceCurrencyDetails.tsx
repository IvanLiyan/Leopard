import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { useTheme } from "@stores/ThemeStore";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

import { CurrencyValue, PaymentCurrencyCode } from "@schema/types";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FieldType = "net_tax" | "sales_tax";
type Props = BaseProps & {
  readonly value: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  readonly merchantCurrency: PaymentCurrencyCode;
  readonly field: FieldType;
};

const FieldLabel: { [fieldName in FieldType]: string } = {
  net_tax: ci18n(
    "Label for the amount of tax that is owed to the government after subtracting refunds etc",
    "Net tax",
  ),
  sales_tax: ci18n(
    "Label for the amount of tax that is owed to the government before subtracting refunds etc",
    "Sales tax",
  ),
};
const RemittanceCurrencyDetails = (props: Props) => {
  const { value, style, field, className, merchantCurrency } = props;
  const styles = useStyleSheet();

  const fieldName = FieldLabel[field];
  const currencySymbol = getCurrencySymbol(merchantCurrency);
  return (
    <div className={css(styles.root, className, style)}>
      <Markdown
        text={
          i`You will receive this amount in ${`**${merchantCurrency} (${currencySymbol})**`} ` +
          i`based on your store’s Currency Settings. You are responsible to ` +
          i`remit tax amounts in the local currency.`
        }
      />
      <div className={css(styles.liabilityHeader)}>{fieldName}:</div>
      <div className={css(styles.amountRow)}>
        <div className={css(styles.value)}>
          {value.display} ({value.currencyCode})
        </div>
      </div>
    </div>
  );
};

export default observer(RemittanceCurrencyDetails);

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        /* eslint-disable local-rules/validate-root */
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "8px 14px",
          fontFamily: fonts.proxima,
          maxWidth: 320,
          minWidth: 220,
        },
        explanation: {
          fontSize: 12,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.33,
          color: textBlack,
          marginBottom: 8,
        },
        liabilityHeader: {
          fontSize: 12,
          fontWeight: fonts.weightBold,
          lineHeight: 1.33,
          color: textBlack,
          marginTop: 3,
          marginBottom: 7,
        },
        amountRow: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        flag: {
          height: 18,
          marginRight: 8,
        },
        value: {
          fontSize: 12,
          lineHeight: 1.33,
          fontWeight: fonts.weightNormal,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
