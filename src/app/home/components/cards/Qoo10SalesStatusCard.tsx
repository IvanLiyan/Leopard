import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PrimaryButton } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import { Qoo10SalesStats } from "@schema";
import { getUrl } from "@core/toolkit/qoo10redirect";
import { RedirectToQoo10PageName } from "@schema";
import Link from "@deprecated/components/Link";
import { ci18n } from "@core/toolkit/i18n";

type Props = BaseProps & {
  readonly data: Qoo10SalesStats | undefined;
};

const Qoo10SalesStatusCard: React.FC<Props> = ({ data }: Props) => {
  const styles = useStylesheet();

  const redirectToQoo10 = async (name: RedirectToQoo10PageName) => {
    try {
      const res = await getUrl({ name });
      const redirectUrl: string | undefined = res?.currentMerchant
        ?.redirectToQoo10?.redirectUrl as string;
      window.open(redirectUrl, "_blank");
    } catch {
      return false;
    }
  };

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
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("ON_SALE");
            }}
          >
            <p className={css(styles.salesData)}>{data?.onSale}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n("data name in home global sales status module", "On Sale")}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("NEW_ORDERS");
            }}
          >
            <p className={css(styles.salesData)}>{data?.newOrders}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "New Orders",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("REFUND_OR_CANCEL_REQUESTS");
            }}
          >
            <p className={css(styles.salesData)}>
              {data?.refundOrCancelRequests}
            </p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Refund/Cancellation Requests",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("WAITING_FOR_REPLY");
            }}
          >
            <p className={css(styles.salesData)}>{data?.waitingForReply}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Waiting for Reply",
            )}
          </p>
        </div>
      </div>
      <div className={css(styles.tableData)}>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("ABOUT_TO_EXPIRE");
            }}
          >
            <p className={css(styles.salesData)}>{data?.aboutToExpire}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Products about to expire",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("SHIPPING_DELAY");
            }}
          >
            <p className={css(styles.salesData)}>{data?.shippingDelay}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Shipping Delay",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("EXCHANGE_REQUESTS");
            }}
          >
            <p className={css(styles.salesData)}>{data?.exchangeRequests}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Exchange Requests",
            )}
          </p>
        </div>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("CS_CENTER");
            }}
          >
            <p className={css(styles.salesData)}>{data?.csCenter}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n("data name in home global sales status module", "CS Center")}
          </p>
        </div>
      </div>
      <div className={css(styles.tableData)}>
        <div className={css(styles.tableItem)}>
          <Link
            onClick={(event) => {
              event.preventDefault();
              void redirectToQoo10("STOCK_LESS_THAN_3");
            }}
          >
            <p className={css(styles.salesData)}>{data?.stockLessThan3}</p>
          </Link>
          <p className={css(styles.salesItem)}>
            {ci18n(
              "data name in home global sales status module",
              "Less than 3 items in stock",
            )}
          </p>
        </div>
      </div>
      <PrimaryButton
        className={css(styles.linkToQoo10Btn)}
        onClick={(event) => {
          event.preventDefault();
          void redirectToQoo10("DEFAULT");
        }}
      >
        {ci18n(
          "button text, click to Wish plus performance",
          "View Wish+ performance",
        )}
      </PrimaryButton>
    </div>
  );
};
export default observer(Qoo10SalesStatusCard);

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
          color: "#0E161C",
        },
        salesItem: {
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "20px",
          color: "#3F5663",
          margin: 0,
        },
        linkToQoo10Btn: {
          width: 296,
          height: 40,
          weight: 700,
          borderRadius: 5,
          margin: "0 auto",
          marginTop: 18,
        },
      }),
    [],
  );
};
