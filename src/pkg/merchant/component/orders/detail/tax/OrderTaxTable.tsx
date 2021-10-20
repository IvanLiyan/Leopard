/* eslint-disable react/jsx-pascal-case */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";

/* Merchant Components */
import RemitPopover from "./RemitPopover";
import OrderTaxAuthoritiesTable from "./OrderTaxAuthoritiesTable";
import RemittanceCurrencyDetails from "./RemittanceCurrencyDetails";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useOrderTaxData } from "@toolkit/orders/tax";

export type OrderTaxTableProps = BaseProps & {
  readonly orderId: string;
  readonly scrollToAuthorities?: boolean;
  readonly showAuthoritiesOnMount?: boolean;
};

const OrderTaxTable: React.FC<OrderTaxTableProps> = (
  props: OrderTaxTableProps,
) => {
  const {
    style,
    orderId,
    className,
    showAuthoritiesOnMount,
    scrollToAuthorities,
  } = props;
  const styles = useStylesheet();
  const { data } = useOrderTaxData(orderId);
  const [authorityDetailVisible, setAuthorityDetailVisible] = useState<boolean>(
    !!showAuthoritiesOnMount,
  );

  if (data == null) {
    return <LoadingIndicator />;
  }

  const order = data?.fulfillment.order;
  const tax = order?.tax;
  if (order == null || tax == null) {
    return null;
  }

  const { merchantCurrencyAtPurchaseTime } = order;

  const {
    salesTax: {
      salesTax,
      salesTaxInAuthorityCurrency,
      refundedTax,
      refundedTaxInAuthorityCurrency,
      netTax,
      netTaxInAuthorityCurrency,
      remitTypes,
      merchantRemitItems,
      authorityCountry,
    },
  } = tax;

  const renderSalesTaxAmount = () => {
    const content = (
      <div className={css(styles.valueContainer)}>
        <div className={css(styles.amountRemit)}>
          {salesTaxInAuthorityCurrency.display}
        </div>
        <Info
          className={css(styles.valueInfo)}
          popoverContent={() =>
            authorityCountry && (
              <RemittanceCurrencyDetails
                field="sales_tax"
                value={salesTax}
                merchantCurrency={merchantCurrencyAtPurchaseTime}
              />
            )
          }
          position="right center"
        />
      </div>
    );

    if (remitTypes.includes("NO_REMIT")) {
      return (
        <RemitPopover remitTypes={remitTypes} position="top center">
          {content}
        </RemitPopover>
      );
    }

    return content;
  };

  const renderTaxRefundedAmount = () => {
    if (remitTypes.includes("NO_REMIT")) {
      return (
        <RemitPopover remitTypes={remitTypes} position="top center">
          <div className={css(styles.amountNoRemit)}>{refundedTax.display}</div>
        </RemitPopover>
      );
    }

    return (
      <div className={css(styles.amountRemit)}>
        {refundedTaxInAuthorityCurrency.display}
      </div>
    );
  };

  const renderNetTaxAmount = () => {
    if (remitTypes.includes("NO_REMIT")) {
      return (
        <RemitPopover remitTypes={remitTypes} position="top center">
          <div className={css(styles.amountNoRemit)}>{netTax.display}</div>
        </RemitPopover>
      );
    }

    return (
      <div className={css(styles.valueContainer)}>
        <div className={css(styles.amountRemit)}>
          {netTaxInAuthorityCurrency.display}
        </div>
        <Info
          className={css(styles.valueInfo)}
          popoverContent={() =>
            authorityCountry && (
              <RemittanceCurrencyDetails
                field="net_tax"
                value={netTax}
                merchantCurrency={merchantCurrencyAtPurchaseTime}
              />
            )
          }
          position="right center"
        />
      </div>
    );
  };

  const renderAuthorityDetails = () => {
    if (!authorityDetailVisible) {
      return null;
    }

    return (
      <Table.FixtureRow>
        <Table.FixtureCell spanEntireRow>
          <div
            className={css(styles.authorityDetail)}
            ref={(ref) => {
              if (ref && scrollToAuthorities) {
                ref.scrollIntoView();
              }
            }}
          >
            <OrderTaxAuthoritiesTable
              data={data}
              style={{ flex: 1, maxWidth: "100%" }}
            />
          </div>
        </Table.FixtureCell>
      </Table.FixtureRow>
    );
  };

  const renderRefundRow = () => {
    if (refundedTax.amount == 0) {
      return null;
    }

    return (
      <Table.FixtureRow>
        <Table.FixtureCell>
          <div className={css(styles.titleContainer)}>
            <section className={css(styles.title)}>Tax refunded</section>
            <Info
              className={css(styles.info)}
              text={
                i`When one or multiple products in an order are refunded, ` +
                i`the associated tax will be refunded to the customer.  `
              }
              position="right center"
            />
          </div>
        </Table.FixtureCell>

        <Table.FixtureCell>{renderTaxRefundedAmount()}</Table.FixtureCell>
      </Table.FixtureRow>
    );
  };

  const renderNetTaxRow = () => {
    if (netTax.amount == salesTax.amount) {
      return null;
    }

    const backgroundStyle = { backgroundColor: "#f8fafb" };
    return (
      <Table.FixtureRow style={backgroundStyle}>
        <Table.FixtureCell style={backgroundStyle}>
          <div className={css(styles.titleContainer, backgroundStyle)}>
            <section className={css(styles.title)}>Net sales tax</section>
            <Info
              className={css(styles.info)}
              text={
                i`Net sales tax is the adjusted sales tax ` +
                i`for the effects of refunds on orders. `
              }
              position="right center"
            />
          </div>
        </Table.FixtureCell>

        <Table.FixtureCell style={backgroundStyle}>
          {renderNetTaxAmount()}
        </Table.FixtureCell>
      </Table.FixtureRow>
    );
  };

  return (
    <Table
      className={css(className, style)}
      fixLayout
      highlightRowOnHover
      overflowY="hidden"
    >
      <Table.FixtureColumn title={i`Tax information`} width="30%" />
      <Table.FixtureColumn />
      <Table.FixtureRow>
        <Table.FixtureCell>
          <div className={css(styles.titleContainer)}>
            <section className={css(styles.title)}>Tax</section>
            <Info
              className={css(styles.info)}
              text={
                i`Tax is collected from the customer ` +
                i`when an order is placed.`
              }
              position="right center"
            />
          </div>
        </Table.FixtureCell>

        <Table.FixtureCell>{renderSalesTaxAmount()}</Table.FixtureCell>
      </Table.FixtureRow>

      {renderRefundRow()}
      {renderNetTaxRow()}

      {merchantRemitItems.length > 0 && (
        <Table.FixtureRow>
          <Table.FixtureCell>
            <div className={css(styles.titleContainer)}>
              <section className={css(styles.title)}>Tax authorities</section>
              <Info
                className={css(styles.info)}
                text={
                  i`The applicable tax authorities for which there ` +
                  i`are estimated tax remittance amounts for this ` +
                  i`transaction. Tax remittance amounts for product ` +
                  i`and shipping prices are displayed in individual ` +
                  i`rows in the Tax Authorities Details table. `
                }
                position="right center"
              />
            </div>
          </Table.FixtureCell>

          <Table.FixtureCell
            onClick={() => setAuthorityDetailVisible(!authorityDetailVisible)}
            className={css(styles.link)}
            style={{ padding: "14px 0px" }}
          >
            {authorityDetailVisible ? i`Hide details` : i`View details`}
          </Table.FixtureCell>
        </Table.FixtureRow>
      )}

      {renderAuthorityDetails()}
    </Table>
  );
};

const useStylesheet = () => {
  const { textBlack, primary, textLight, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        titleContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          maxWidth: 165,
          padding: 14,
          backgroundColor: surfaceLightest,
        },
        title: {
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.25,
          color: textBlack,
        },
        info: {
          marginLeft: 5,
        },
        valueCell: {
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        },
        amountRemit: {
          fontSize: 14,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.43,
          color: textBlack,
        },
        amountNoRemit: {
          fontSize: 14,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.43,
          color: textLight,
          textDecoration: "line-through",
        },
        authorityDetail: {
          padding: "16px 24px",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundBlendMode: "darken",
          backgroundImage:
            "linear-gradient(rgba(238, 242, 245, 0.5), " +
            "rgba(238, 242, 245, 0.5))",
        },
        link: {
          opacity: 1,
          fontSize: 14,
          color: primary,
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.8,
          },
          cursor: "pointer",
          userSelect: "none",
        },
        valueInfo: {
          marginLeft: 8,
        },
        valueContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
      }),
    [primary, textBlack, textLight, surfaceLightest],
  );
};
export default observer(OrderTaxTable);
