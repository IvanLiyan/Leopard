import React from "react";
import { TableColumn } from "src/app/performance-cn/components/Table";
import { Tooltip } from "@mui/material";
import { formatPercentage } from "@core/toolkit/stringUtils";
import { Icon } from "src/app/performance-cn/components";
import { useTheme } from "@core/stores/ThemeStore";
import commonStyles from "@performance-cn/styles/common.module.css";
import { AugmentedRefundAggregate } from "src/app/performance-cn/stores/Refund";

export default function useRefundBaseColumn() {
  const { textBlack } = useTheme();
  const refundBaseColumn: ReadonlyArray<
    TableColumn<
      Pick<
        AugmentedRefundAggregate,
        | "itemNotMatchingListingPercentage"
        | "itemNotFitPercentage"
        | "shippingTakeTooLongPercentage"
        | "itemReturnedPercentage"
        | "itemDamagedPercentage"
        | "itemNotWorkPercentage"
        | "itemNotWorkPercentage"
        | "receivedWrongItemPercentage"
        | "failToFulfillPercentage"
        | "deliverWrongAddressPercentage"
        | "incompleteOrderPercentage"
      >
    >
  > = [
    {
      key: "itemNotMatchingListingPercentage",
      titleRender: () => (
        <>
          <span>Item does not match listing</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by items in the order not matching the
                description in the listing
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { itemNotMatchingListingPercentage } }) =>
        itemNotMatchingListingPercentage == null
          ? "-"
          : formatPercentage(String(itemNotMatchingListingPercentage), "1", 2),
    },
    {
      key: "itemNotFitPercentage",
      titleRender: () => (
        <>
          <span>Item does not fit</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by items in the order not fitting
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { itemNotFitPercentage } }) =>
        itemNotFitPercentage == null
          ? "-"
          : formatPercentage(String(itemNotFitPercentage), "1", 2),
    },
    {
      key: "shippingTakeTooLongPercentage",
      titleRender: () => (
        <>
          <span>Shipping taking too long</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by the shipment taking too long to
                ship to the destination
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { shippingTakeTooLongPercentage } }) =>
        shippingTakeTooLongPercentage == null
          ? "-"
          : formatPercentage(String(shippingTakeTooLongPercentage), "1", 2),
    },
    {
      key: "itemReturnedPercentage",
      titleRender: () => (
        <>
          <span>Item was returned to sender</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by a customer return of the order
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { itemReturnedPercentage } }) =>
        itemReturnedPercentage == null
          ? "-"
          : formatPercentage(String(itemReturnedPercentage), "1", 2),
    },
    {
      key: "itemDamagedPercentage",
      titleRender: () => (
        <>
          <span>Item is damaged</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by damaged item(s) in the shipment
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { itemDamagedPercentage } }) =>
        itemDamagedPercentage == null
          ? "-"
          : formatPercentage(String(itemDamagedPercentage), "1", 2),
    },
    {
      key: "itemNotWorkPercentage",
      titleRender: () => (
        <>
          <span>Item does not work as described</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by item(s) in the shipment not working
                as described
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { itemNotWorkPercentage } }) =>
        itemNotWorkPercentage == null
          ? "-"
          : formatPercentage(String(itemNotWorkPercentage), "1", 2),
    },
    {
      key: "receivedWrongItemPercentage",
      titleRender: () => (
        <>
          <span>Customer received wrong item</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by wrong item(s) being included in the
                shipment
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { receivedWrongItemPercentage } }) =>
        receivedWrongItemPercentage == null
          ? "-"
          : formatPercentage(String(receivedWrongItemPercentage), "1", 2),
    },
    {
      key: "failToFulfillPercentage",
      titleRender: () => (
        <>
          <span>Failed to fulfill</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by the failure to fufill the order
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { failToFulfillPercentage } }) =>
        failToFulfillPercentage == null
          ? "-"
          : formatPercentage(String(failToFulfillPercentage), "1", 2),
    },
    {
      key: "deliverWrongAddressPercentage",
      titleRender: () => (
        <>
          <span>Order was delivered to wrong address</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by the shipment being delivered to the
                wrong address
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { deliverWrongAddressPercentage } }) =>
        deliverWrongAddressPercentage == null
          ? "-"
          : formatPercentage(String(deliverWrongAddressPercentage), "1", 2),
    },
    {
      key: "incompleteOrderPercentage",
      titleRender: () => (
        <>
          <span>Incomplete order</span>
          <Tooltip
            className={commonStyles.tableTooltip}
            title={
              <div style={{ fontSize: "14px" }}>
                Percent of refunds caused by incomplete shipments
              </div>
            }
          >
            <Icon name="help" size={20} color={textBlack} />
          </Tooltip>
        </>
      ),
      render: ({ row: { incompleteOrderPercentage } }) =>
        incompleteOrderPercentage == null
          ? "-"
          : formatPercentage(String(incompleteOrderPercentage), "1", 2),
    },
  ];
  return refundBaseColumn;
}
