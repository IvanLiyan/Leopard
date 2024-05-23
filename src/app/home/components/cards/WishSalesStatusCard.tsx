import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import { WishSalesStats } from "@schema";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly data: WishSalesStats | undefined;
};

const WishSalesStatusCard: React.FC<Props> = ({ data }: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.contentContainer)}>
      <div className={css(styles.tableRow)}>
        <div className={css(styles.tableRowName)}>
          {ci18n("data name in home global sales status module", "PRODUCTS")}
        </div>
        <div className={css(styles.tableRowName)}>
          {ci18n(
            "data name in home global sales status module",
            "ORDER DELIVERY",
          )}
        </div>
        <div className={css(styles.tableRowName)}>
          {ci18n("data name in home global sales status module", "APPEAL")}
        </div>
        <div className={css(styles.tableRowName)}>
          {ci18n("data name in home global sales status module", "INQUIRY")}
        </div>
      </div>
      <div className={css(styles.tableData)}>
        <div className={css(styles.tableItem)}>
          <p className={css(styles.salesData)}>{data?.onSale}</p>
          <p className={css(styles.salesItem)}>
            {ci18n("data name in home global sales status module", "On Sale")}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <p className={css(styles.salesData)}>{data?.newOrders}</p>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "New Orders",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <p className={css(styles.salesData)}>
            {data?.refundOrCancelRequests}
          </p>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Refund/Cancellation Requests",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <p className={css(styles.salesData)}>{data?.waitingForReply}</p>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Waiting for Reply",
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
export default observer(WishSalesStatusCard);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          padding: 24,
          display: "flex",
          flexDirection: "column",
          zIndex: 5,
        },
        tableRow: {
          fontSize: 14,
          fontWeight: 700,
          display: "flex",
          justifyContent: "space-between",
          color: "#3F5663",
        },
        tableRowName: {
          textAlign: "left",
          width: "25%",
        },
        tableData: {
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
        },
        tableItem: {
          width: "25%",
        },
        salesData: {
          fontSize: 20,
          fontWeight: 700,
          lineHeight: "20px",
          margin: 0,
        },
        salesItem: {
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "20px",
          color: "#3F5663",
          margin: 0,
        },
      }),
    [],
  );
};
