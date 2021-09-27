import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Toolkit */
import { PriceDropConstants } from "@toolkit/price-drop/constants";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { EligibleProduct } from "@merchant/api/price-drop";

type PriceDropEligibleProductsTableProps = BaseProps & {
  readonly products: ReadonlyArray<EligibleProduct>;
  readonly onProductSelect: (
    product: EligibleProduct | null | undefined
  ) => void;
  readonly selectedProduct: EligibleProduct | null | undefined;
  readonly isExempted: boolean | null | undefined;
};

const PriceDropEligibleProductsTable = (
  props: PriceDropEligibleProductsTableProps
) => {
  const styles = useStylesheet();
  const {
    className,
    style,
    products,
    onProductSelect,
    selectedProduct,
    isExempted,
  } = props;
  const selectedRows = useMemo(() => {
    const indexes: number[] = [];
    products.forEach((product, index) => {
      if (selectedProduct && product.id === selectedProduct.id) {
        return indexes.push(index);
      }
    });
    return indexes;
  }, [selectedProduct, products]);

  const renderListedPrice = (product: EligibleProduct) => {
    const minPrice = product.min_price;
    const maxPrice = product.max_price;
    const currencyCode = product.currency_code;

    const listPrice =
      minPrice === maxPrice
        ? formatCurrency(minPrice, currencyCode)
        : `${formatCurrency(minPrice, currencyCode)}-${formatCurrency(
            maxPrice,
            currencyCode
          )}`;

    return renderContent(listPrice, product);
  };

  const canSelectRow = (product: EligibleProduct) =>
    product.eligible_for_campaign &&
    (isExempted ||
      (product.sales >= PriceDropConstants.PREFILTER_MIN_SALE_COUNT &&
        product.rating_count >= PriceDropConstants.PREFILTER_MIN_RATING_COUNT &&
        product.average_rating >=
          PriceDropConstants.PREFILTER_MIN_AVERAGE_RATING));

  // if you find this please fix the any types (legacy)
  const renderContent = (content: any, row: any) => {
    const cellContent =
      typeof content === "number"
        ? numeral(content).format("0,0").toString()
        : content;
    if (!canSelectRow(row)) {
      return (
        <Popover
          position="top"
          popoverContent={() => (
            <div className={css(styles.tooltip)}>
              <span>
                This product is not suited for Price Drop yet. Try ProductBoost
                to surface your product to more Wish customers or come back to
                Price Drop at a later time.
              </span>
              <span className={css(styles.tooltipButton)}>
                <Link openInNewTab href="/product-boost/v2/create">
                  Try ProductBoost
                </Link>
              </span>
            </div>
          )}
          contentWidth={350}
        >
          <span className={css(styles.greyText)}>{cellContent}</span>
        </Popover>
      );
    }
    return <span>{cellContent}</span>;
  };

  return (
    <Table
      className={css(className, style)}
      data={products}
      overflowY="visible"
      highlightRowOnHover
      selectedRows={selectedRows}
      onRowSelectionToggled={({ row, selected }) => {
        if (selected) {
          onProductSelect(row);
        } else {
          onProductSelect(null);
        }
      }}
      hideSelectAll
      canSelectRow={(row) => canSelectRow(row.row)}
      rowHeight={68}
    >
      <ProductColumn
        showProductId
        title={i`Product ID`}
        columnKey="id"
        align="left"
        showFullProductId={false}
      />
      <Table.Column
        columnKey="name"
        title={i`Product name`}
        noDataMessage={"\u2014"}
      >
        {({ row }) => {
          const productName = row.name;
          const cellContent =
            productName.length > 30
              ? productName.substring(0, 30) + "..."
              : productName;
          return renderContent(cellContent, row);
        }}
      </Table.Column>
      <Table.Column
        columnKey="parent_sku"
        title={i`Parent SKU`}
        noDataMessage={"\u2014"}
      >
        {({ row }) => renderContent(row.parent_sku, row)}
      </Table.Column>
      <Table.Column title={i`Listed Price`} columnKey="min_price" align="right">
        {({ row }) => renderListedPrice(row)}
      </Table.Column>
      <Table.Column
        columnKey="wishes"
        title={i`Wishes`}
        noDataMessage={"\u2014"}
      >
        {({ row }) => renderContent(row.wishes, row)}
      </Table.Column>
      <Table.Column columnKey="sales" title={i`Sales`} noDataMessage={"\u2014"}>
        {({ row }) => renderContent(row.sales, row)}
      </Table.Column>
    </Table>
  );
};

export default observer(PriceDropEligibleProductsTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        greyText: {
          color: palettes.greyScaleColors.DarkGrey,
        },
        tooltip: {
          fontSize: 14,
          lineHeight: 1.33,
          fontWeight: fonts.weightMedium,
          padding: "13px 13px 13px 13px",
        },
        tooltipButton: {
          fontSize: 13,
          fontWeight: fonts.weightSemibold,
          marginLeft: 5,
        },
      }),
    []
  );
};
