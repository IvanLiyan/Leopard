import React from "react";
import { TableColumn } from "@performance/components/Table";
import { Tooltip } from "@mui/material";
import { addCommas, formatPercentage } from "@core/toolkit/stringUtils";
import { Icon } from "@performance/components";
import { useTheme } from "@core/stores/ThemeStore";
import commonStyles from "@performance/styles/common.module.css";
import { PickedSales } from "@performance/toolkit/sales";

export default function useSalesBaseColumn() {
  const { textBlack } = useTheme();
  const salesBaseColumn: ReadonlyArray<
    TableColumn<
      Pick<
        PickedSales,
        | "productImpressions"
        | "addToCart"
        | "addToCartConversion"
        | "orders"
        | "checkoutConversion"
      >
    >
  > = [
    {
      key: "productImpressions",
      titleRender: () => (
        <>
          <span>Product Impressions</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Number of times your products were viewed
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { productImpressions } }) => {
        return productImpressions == null
          ? "-"
          : addCommas(String(productImpressions));
      },
    },
    {
      key: "addToCart",
      titleRender: () => (
        <>
          <span>Buy Button Clicks</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Number of times the buy button is clicked
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { addToCart } }) => {
        return addToCart == null ? "-" : addCommas(String(addToCart));
      },
    },
    {
      key: "addToCartConversion",
      titleRender: () => (
        <>
          <span>Buy Button CTR</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Buy button click divided by product impressions
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { addToCartConversion } }) => {
        return addToCartConversion == null
          ? "-"
          : formatPercentage(String(addToCartConversion), "1", 4);
      },
    },
    {
      key: "orders",
      titleRender: () => (
        <>
          <span>Orders</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Number of times your products were bought
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { orders } }) => {
        return orders == null ? "-" : addCommas(String(orders));
      },
    },
    {
      key: "checkoutConversion",
      titleRender: () => (
        <>
          <span>Checkout Conversion</span>
          <Tooltip
            title={
              <div style={{ fontSize: "14px" }}>
                Orders divided by shopping cart impressions
              </div>
            }
            className={commonStyles.tableTooltip}
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { checkoutConversion } }) => {
        return checkoutConversion == null
          ? "-"
          : formatPercentage(String(checkoutConversion), "1", 2);
      },
    },
  ];
  return salesBaseColumn;
}
