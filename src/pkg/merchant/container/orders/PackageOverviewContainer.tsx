/* eslint-disable local-rules/unwrapped-i18n */
/*
 * PackageOverviewContainer.tsx
 *
 * Created by Jonah Dlin on Thu Dec 24 2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";

import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { PackageOverviewInitialData } from "@toolkit/orders/package-overview";
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import { weightBold } from "@toolkit/fonts";
import { useTheme } from "@stores/ThemeStore";
import Error404 from "@merchant/component/errors/Error404";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

export type Props = {
  readonly initialData: PackageOverviewInitialData;
};

const PackageOverviewContainer: React.FC<Props> = ({ initialData }: Props) => {
  const styles = useStylesheet();

  const {
    fulfillment: {
      order: {
        id,
        user,
        variation,
        shippingDetails,
        cartPrice,
        quantity,
        releasedTime,
        orderTime,
        tax,
      },
    },
    platformConstants,
  } = initialData;

  if (
    tax == null ||
    cartPrice == null ||
    cartPrice.preTaxProductPrice == null ||
    cartPrice.preTaxShippingPrice == null ||
    cartPrice.postTaxProductPrice == null ||
    cartPrice.postTaxShippingPrice == null
  ) {
    return <Error404 />;
  }

  const {
    preTaxProductPrice: {
      amount: productPriceAmount,
      display: productPriceDisplay,
    },
    preTaxShippingPrice: {
      amount: shippingPriceAmount,
      display: shippingPriceDisplay,
    },
    postTaxProductPrice: {
      amount: productPriceGrossAmount,
      display: productPriceGrossDisplay,
    },
    postTaxShippingPrice: {
      amount: shippingPriceGrossAmount,
      display: shippingPriceGrossDisplay,
    },
  } = cartPrice;

  const {
    ukPriceTax: {
      salesTax: { amount: productTaxAmount, display: productTaxDisplay },
    },
    ukShippingTax: {
      salesTax: { amount: shippingTaxAmount, display: shippingTaxDisplay },
    },
  } = tax;

  const { destination, origin, orders, items, shipping } = {
    destination: shippingDetails,
    origin: platformConstants?.wishCompanyInfo,
    orders: [
      {
        id,
        orderDate: orderTime,
      },
    ],
    items: [
      {
        name: variation?.productName,
        quantity,
        netAmount: productPriceAmount,
        vatAmount: productTaxAmount,
        grossAmount: productPriceGrossAmount,
        netDisplay: productPriceDisplay,
        vatDisplay: productTaxDisplay,
        grossDisplay: productPriceGrossDisplay,
      },
    ],
    shipping: {
      netAmount: shippingPriceAmount,
      vatAmount: shippingTaxAmount,
      grossAmount: shippingPriceGrossAmount,
      netDisplay: shippingPriceDisplay,
      vatDisplay: shippingTaxDisplay,
      grossDisplay: shippingPriceGrossDisplay,
    },
  };

  const renderDestination = () => {
    if (destination == null) {
      return null;
    }

    return (
      <div className={css(styles.flexColumn)}>
        <div className={css(styles.titleFont, styles.topInfoTitle)}>{`To`}</div>
        <div className={css(styles.boldFont, styles.topInfo)}>
          {destination.name}
        </div>
        <div className={css(styles.font, styles.topInfo)}>
          {destination.streetAddress1}
        </div>
        {destination.streetAddress2 != null && (
          <div className={css(styles.font, styles.topInfo)}>
            {destination.streetAddress2}
          </div>
        )}
        <div className={css(styles.font, styles.topInfo)}>
          {destination.city}
        </div>
        {destination.zipcode != null && (
          <div className={css(styles.font, styles.topInfo)}>
            {destination.zipcode}
          </div>
        )}
        <div className={css(styles.font, styles.topInfo)}>
          {destination.country.name}
        </div>
      </div>
    );
  };

  const renderOrigin = () => {
    if (origin == null) {
      return null;
    }

    const address = origin.hqAddress;

    return (
      <div className={css(styles.flexColumn)}>
        <div
          className={css(styles.titleFont, styles.topInfoTitle)}
        >{`From`}</div>
        {origin.companyOperatorName != null && (
          <div className={css(styles.boldFont, styles.topInfo)}>
            {origin.companyOperatorName}
          </div>
        )}
        <div className={css(styles.font, styles.topInfo)}>
          {address.streetAddress1}
        </div>
        {address.streetAddress2 != null && (
          <div className={css(styles.font, styles.topInfo)}>
            {address.streetAddress2}
          </div>
        )}
        <div className={css(styles.font, styles.topInfo)}>
          {address.city} {address.state}
        </div>
        {address.zipcode != null && (
          <div className={css(styles.font, styles.topInfo)}>
            {address.zipcode}
          </div>
        )}
        <div className={css(styles.font, styles.topInfo)}>
          {address.country.name}
        </div>
      </div>
    );
  };

  const renderTopInfo = () => {
    return (
      <div className={css(styles.topInfoContainer)}>
        {renderDestination()}
        {renderOrigin()}
        <div className={css(styles.flexColumn)}>
          <div className={css(styles.metadataContainer)}>
            <div className={css(styles.titleFont, styles.topInfoTitle)}>
              {`Document Generated On`}
            </div>
            <div className={css(styles.font)}>
              {releasedTime && releasedTime.formatted}
            </div>
          </div>
          <div className={css(styles.metadataContainer)}>
            {user && (
              <>
                <div className={css(styles.titleFont, styles.topInfoTitle)}>
                  {`Customer ID`}
                </div>
                <div className={css(styles.font)}>{user.id}</div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOrderDetailsTable = () => {
    const rows = orders.map(({ id, orderDate }) => {
      if (orderDate == null) {
        return null;
      }

      return (
        <React.Fragment key={id}>
          <div className={css(styles.font, styles.cell)}>{id}</div>
          <div className={css(styles.font, styles.cell)}>
            {orderDate.formatted}
          </div>
        </React.Fragment>
      );
    });

    return (
      <div className={css(styles.orderDetailsTable)}>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {`Customer Order ID`}
        </div>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {` Order Placed By Customer On`}
        </div>
        {rows}
      </div>
    );
  };

  const renderItemDetailsTable = () => {
    const rows = items.map(
      ({ name, quantity, netDisplay, vatDisplay, grossDisplay }) => (
        <React.Fragment key={name}>
          <div className={css(styles.font, styles.cell)}>{name}</div>
          <div className={css(styles.font, styles.cell)}>{quantity}</div>
          <div className={css(styles.font, styles.cell)}>{netDisplay}</div>
          <div className={css(styles.font, styles.cell)}>{vatDisplay}</div>
          <div className={css(styles.font, styles.cell)}>{grossDisplay}</div>
        </React.Fragment>
      ),
    );

    const shippingRow = (
      <>
        <div className={css(styles.font, styles.cell)}>{`Shipping`}</div>
        <div className={css(styles.font, styles.cell, styles.column3)}>
          {shipping.netDisplay}
        </div>
        <div className={css(styles.font, styles.cell, styles.column4)}>
          {shipping.vatDisplay}
        </div>
        <div className={css(styles.font, styles.cell, styles.column5)}>
          {shipping.grossDisplay}
        </div>
      </>
    );

    const netTotal =
      items.reduce((acc, { netAmount }) => acc + netAmount, 0) +
      shippingPriceAmount;
    const vatTotal =
      items.reduce((acc, { vatAmount }) => acc + vatAmount, 0) +
      shippingTaxAmount;
    const grossTotal =
      items.reduce((acc, { grossAmount }) => acc + grossAmount, 0) +
      shippingPriceGrossAmount;

    return (
      <div className={css(styles.itemDetailsTable)}>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {`Description`}
        </div>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {`Quantity`}
        </div>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {`Net`}
        </div>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {`VAT`} ({20}%)
        </div>
        <div className={css(styles.headerRow, styles.titleFont, styles.cell)}>
          {`Gross`}
        </div>
        {rows}
        {shippingRow}
        <div className={css(styles.tableRule)} />
        <div className={css(styles.font, styles.cell, styles.column4)}>
          {`Net total`}
        </div>
        <div className={css(styles.font, styles.cell, styles.column5)}>
          {formatCurrency(netTotal, "GBP")}
        </div>
        <div className={css(styles.font, styles.cell, styles.column4)}>
          {`VAT total`}
        </div>
        <div className={css(styles.font, styles.cell, styles.column5)}>
          {formatCurrency(vatTotal, "GBP")}
        </div>
        <div className={css(styles.boldFont, styles.cell, styles.column4)}>
          {`Gross total`}
        </div>
        <div className={css(styles.boldFont, styles.cell, styles.column5)}>
          {formatCurrency(grossTotal, "GBP")}
        </div>
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.brandHeader)}>
        <Illustration
          className={css(styles.logo)}
          name="wishLogoBlue"
          alt={`Wish`}
        />
        <PrimaryButton
          style={{
            "@media print": {
              display: "none",
            },
          }}
          onClick={() => window.print()}
        >
          Print
        </PrimaryButton>
      </div>
      <div className={css(styles.pageTitle)}>{`Package Overview`}</div>
      <div className={css(styles.font, styles.subtitle)}>
        {`Please note the Package Overview document is not a VAT invoice.`}
      </div>
      {renderTopInfo()}
      <div className={css(styles.sectionTitle)}>{`Customer Order Details`}</div>
      {renderOrderDetailsTable()}
      <div className={css(styles.sectionTitle)}>{`Item Details`}</div>
      {renderItemDetailsTable()}
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark, borderPrimary, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 32,
          display: "flex",
          flexDirection: "column",
        },
        font: {
          fontSize: 14,
          lineHeight: "16px",
          color: textDark,
        },
        boldFont: {
          fontSize: 14,
          lineHeight: "16px",
          color: textDark,
          fontWeight: weightBold,
        },
        titleFont: {
          textTransform: "uppercase",
          letterSpacing: "12%",
          fontSize: 12,
          lineHeight: "14px",
          color: textDark,
        },
        flexColumn: {
          display: "flex",
          flexDirection: "column",
        },
        brandHeader: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 44,
        },
        logo: {
          width: 96,
        },
        pageTitle: {
          fontSize: 30,
          lineHeight: 1,
          color: textBlack,
          fontWeight: weightBold,
          marginBottom: 8,
        },
        subtitle: {
          marginBottom: 24,
        },
        topInfoContainer: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 40,
        },
        topInfoTitle: {
          marginBottom: 8,
        },
        topInfo: {
          ":not(:last-child)": {
            marginBottom: 4,
          },
        },
        metadataContainer: {
          ":not(:last-child)": {
            marginBottom: 34,
          },
        },
        sectionTitle: {
          fontSize: 16,
          lineHeight: 1.33,
          color: textBlack,
          fontWeight: weightBold,
          marginBottom: 8,
        },
        orderDetailsTable: {
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          rowGap: 16,
          marginBottom: 40,
        },
        cell: {
          paddingLeft: 8,
          paddingRight: 8,
        },
        headerRow: {
          display: "flex",
          alignItems: "center",
          height: 44,
          borderBottom: `1px solid ${borderPrimary}`,
          backgroundColor: surfaceLight,
        },

        itemDetailsTable: {
          display: "grid",
          gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr",
          rowGap: 16,
        },
        column3: {
          gridColumn: 3,
        },
        column4: {
          gridColumn: 4,
        },
        column5: {
          gridColumn: 5,
        },
        tableRule: {
          gridColumn: "1 / 6",
          borderBottom: `1px solid ${borderPrimary}`,
        },
      }),
    [textBlack, textDark, borderPrimary, surfaceLight],
  );
};

export default observer(PackageOverviewContainer);
