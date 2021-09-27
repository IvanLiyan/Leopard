import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { formatCurrency } from "@toolkit/currency";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import BaseStoreHealthCard from "./BaseStoreHealthCard";
import StoreHealthCardLabel from "./StoreHealthCardLabel";

/* Model */
import { PickedMerchantStats } from "@toolkit/performance/stats";
import {
  SHIPPING_LATE_CONFIRM_THRESHOLD,
  SHIPPING_VALID_TRACKING_THRESHOLD,
} from "@toolkit/performance/constants";

/* Toolkit */
import { Page } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

type Props = BaseProps & {
  readonly storeStats: PickedMerchantStats;
};

const ShippingStoreHealthCard = (props: Props) => {
  const { className, style, storeStats } = props;
  const styles = useStylesheet();

  const validTrackingRate = storeStats.tracking?.validTrackingRate;
  const lateConfirmedFulfillmentRate =
    storeStats.tracking?.lateConfirmedFulfillmentRate;
  const averageFulfillmentTime = storeStats.tracking?.averageFulfillmentTime;
  const trackingStartDate = storeStats.tracking?.startDate;
  const trackingEndDate = storeStats.tracking?.endDate;

  const timeToDoor = storeStats.delivery?.timeToDoor;
  const startDate = storeStats.delivery?.startDate;
  const endDate = storeStats.delivery?.endDate;

  const trackingWeekOf =
    (validTrackingRate != null ||
      lateConfirmedFulfillmentRate != null ||
      averageFulfillmentTime != null) &&
    trackingStartDate != null &&
    trackingEndDate != null
      ? i`Week of ${trackingStartDate.formatted} to ${trackingEndDate.formatted}*`
      : null;
  const deliveryWeekOf =
    startDate != null && endDate != null && timeToDoor != null
      ? i`Week of ${startDate.formatted} to ${endDate.formatted}`
      : null;

  const lateConfirmedFulfillmentThresh = lateConfirmedFulfillmentRate
    ? lateConfirmedFulfillmentRate > SHIPPING_LATE_CONFIRM_THRESHOLD
    : false;
  const validTrackingRateThresh =
    validTrackingRate != null
      ? validTrackingRate < SHIPPING_VALID_TRACKING_THRESHOLD
      : false;

  const renderContent = () => (
    <>
      <div className={css(styles.body)}>
        <Markdown
          text={
            i`All orders must have valid tracking and be confirmed fulfilled by the carrier ` +
            i`within a [designated amount of time.](${"/policy/fulfillment#5.5"})`
          }
          onLinkClicked={async () =>
            await logger({
              action: "CLICK",
              event_name: "SHIPPING_POLICY",
              page: Page.storeHealth,
              to_page_url: "/policy/fulfillment#5.5",
            })
          }
          openLinksInNewTab
        />
      </div>
      <div className={css(styles.statsGroup)}>
        <StoreHealthCardLabel
          label={i`Average confirmed fulfillment time`}
          value={
            averageFulfillmentTime != null
              ? i`${Math.round(averageFulfillmentTime.hours)} hours`
              : "--"
          }
          tooltipText={
            i`Average time from order placed to the time our system confirmed ` +
            i`the tracking number.`
          }
        />
        <StoreHealthCardLabel
          label={i`Late confirmed fulfillment rate`}
          value={
            lateConfirmedFulfillmentRate != null
              ? numeral(lateConfirmedFulfillmentRate).format("0.00%")
              : lateConfirmedFulfillmentRate
          }
          aboveThreshold={lateConfirmedFulfillmentThresh}
          tooltipText={
            i`Percentage of orders with valid tracking where the period between order ` +
            i`released time and first recorded carrier scan is longer than 168 hours for ` +
            i`orders with (merchant price + shipping price) per item less than ${formatCurrency(
              100,
              "USD"
            )}, or ` +
            i`longer than 336 hours for orders with (merchant price + shipping price) per ` +
            i`item greater than or equal to ${formatCurrency(100, "USD")}`
          }
        />
        <StoreHealthCardLabel
          label={i`Valid tracking rate`}
          value={
            validTrackingRate != null
              ? numeral(validTrackingRate).format("0.00%")
              : validTrackingRate
          }
          aboveThreshold={validTrackingRateThresh}
          tooltipText={i`Percentage of orders confirmed shipped by the carrier.`}
        />
        <div className={css(styles.stat)}>
          {trackingWeekOf != null && (
            <span className={css(styles.date)}>{trackingWeekOf}</span>
          )}
        </div>
      </div>
      <div className={css(styles.separator)} />
      <div className={css(styles.statsGroup)}>
        <StoreHealthCardLabel
          label={i`Time to door`}
          value={
            timeToDoor != null ? i`${Math.round(timeToDoor.days)} days` : "--"
          }
          tooltipText={
            i`Average time from when orders were placed to when the shipping carrier ` +
            i`confirmed orders as delivered.`
          }
        />
      </div>
    </>
  );

  const renderLearnMore = () => (
    <>
      <Markdown
        text={i`What is the allowable period of time for a carrier to [confirm fulfillment](${"/policy/fulfillment#5.5"})?`}
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "SHIPPING_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy/fulfillment#5.5",
          })
        }
        openLinksInNewTab
      />
      <Markdown
        text={i`What is [valid tracking](${"/policy/refunds#7.3"})?`}
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "VALID_TRACKING_REFUND_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy/refunds#7.3",
          })
        }
        openLinksInNewTab
      />
    </>
  );

  return (
    <BaseStoreHealthCard
      title={i`Shipping`}
      titleIconName="darkBlueShip"
      linkTitle={i`View Shipping Performance`}
      linkUrl="/shipping-dest-performance#tab=weekly"
      linkOnClick={async () =>
        await logger({
          action: "CLICK",
          event_name: "VIEW_SHIPPING_PERFORMANCE",
          page: Page.storeHealth,
          to_page_url: "/shipping-dest-performance#tab=weekly",
        })
      }
      content={renderContent()}
      learnMore={renderLearnMore()}
      dateSnapshot={deliveryWeekOf}
      className={css(className, style)}
      aboveThreshold={lateConfirmedFulfillmentThresh || validTrackingRateThresh}
    />
  );
};

export default ShippingStoreHealthCard;

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          display: "flex",
          flexFlow: "row",
          alignItems: "center",
        },
        body: {
          padding: "16px 0px 0px 30px",
        },
        statsGroup: {
          paddingTop: 32,
        },
        stat: {
          display: "flex",
          justifyContent: "flex-end",
          ":not(:last-child)": {
            marginBottom: 26,
          },
        },
        date: {
          fontSize: 12,
          lineHeight: "16px",
        },
        separator: {
          borderTop: `1px ${borderPrimary} solid`,
          padding: "0 24px",
          marginTop: 26,
        },
      }),
    [borderPrimary]
  );
};
