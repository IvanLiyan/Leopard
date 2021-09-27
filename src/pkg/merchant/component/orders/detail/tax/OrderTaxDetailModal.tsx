import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Modal } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import OrderTaxTable, { OrderTaxTableProps } from "./OrderTaxTable";

type Props = OrderTaxTableProps;

const OrderTaxDetailModalContent = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();
  return (
    <div className={css(styles.root, className, style)}>
      <p className={css(styles.text)}>
        Based on your store's configured Tax Settings, Wish collected the below
        tax amounts from customers in addition to the product and shipping costs
        for the order. The collected tax amounts will be included in your
        payments, subject to order payment eligibility terms. Your store is
        responsible for remitting appropriate tax amounts to applicable tax
        authorities.
      </p>
      <OrderTaxTable {...props} />
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "24px",
        },
        text: {
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          color: textBlack,
          marginBottom: 18,
        },
      }),
    [textBlack]
  );
};

export default class OrderTaxDetailModal extends Modal {
  constructor(props: Props) {
    super((onClose) => <OrderTaxDetailModalContent {...props} />);

    this.setHeader({
      title: i`Tax`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
  }
}
