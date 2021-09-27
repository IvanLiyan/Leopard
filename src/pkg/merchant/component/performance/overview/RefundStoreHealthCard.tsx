import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import BaseStoreHealthCard from "./BaseStoreHealthCard";
import StoreHealthCardLabel from "./StoreHealthCardLabel";

/* Model */
import { PickedMerchantStats } from "@toolkit/performance/stats";

/* Toolkit */
import { Page } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

type Props = BaseProps & {
  readonly storeStats: PickedMerchantStats;
};

const RefundStoreHealthCard = (props: Props) => {
  const { className, style, storeStats } = props;
  const styles = useStylesheet();

  const refundRate = storeStats.refunds?.refundRate;
  const startDate = storeStats.refunds?.startDate;
  const endDate = storeStats.refunds?.endDate;

  const weekOf =
    startDate != null && endDate != null && refundRate != null
      ? i`Week of ${startDate.formatted} to ${endDate.formatted}`
      : null;

  const renderContent = () => (
    <>
      <div className={css(styles.body)}>
        <Markdown
          text={
            i`Keep refunds low by ensuring your product listings are clear and accurate, ` +
            i`and by shipping quickly.`
          }
        />
      </div>
      <div className={css(styles.statsGroup)}>
        <StoreHealthCardLabel
          label={i`Refund rate`}
          value={
            refundRate != null
              ? numeral(refundRate).format("0.00%")
              : refundRate
          }
        />
      </div>
    </>
  );

  const renderLearnMore = () => (
    <>
      <Markdown
        text={
          i`Stores with an extremely high refund rate ` +
          i`[may be suspended](${"/policy/customer#6.1"}).`
        }
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "HIGH_REFUND_RATE_SUSPENSION_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy/customer#6.1",
          })
        }
        openLinksInNewTab
      />
      <Markdown
        text={i`What is a [high refund rate?](${"/policy/refunds#7.19"})`}
        onLinkClicked={async () =>
          await logger({
            action: "CLICK",
            event_name: "HIGH_REFUND_RATE_PAYMENT_POLICY",
            page: Page.storeHealth,
            to_page_url: "/policy/customer#6.1",
          })
        }
        openLinksInNewTab
      />
    </>
  );

  return (
    <BaseStoreHealthCard
      title={i`Refunds`}
      titleIconName="darkBlueBag"
      linkTitle={i`View Refund Performance`}
      linkUrl="/refund-performance"
      content={renderContent()}
      learnMore={renderLearnMore()}
      dateSnapshot={weekOf}
      className={css(className, style)}
    />
  );
};

export default RefundStoreHealthCard;

const useStylesheet = () => {
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
      }),
    []
  );
};
