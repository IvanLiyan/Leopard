import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import RefundPerformanceBox from "@merchant/component/performance/refund/RefundPerformanceBox";
import FulfillmentPerformanceBox from "@merchant/component/performance/fulfillment/FulfillmentPerformanceBox";
import TrackingPerformanceBox from "@merchant/component/performance/tracking/TrackingPerformanceBox";
import DeliveryPerformanceBox from "@merchant/component/performance/delivery/DeliveryPerformanceBox";
import StorePerformanceBox from "@merchant/component/performance/store/StorePerformanceBox";
import CounterfeitPerformanceBox from "@merchant/component/performance/counterfeit/CounterfeitPerformanceBox";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

const PerfOverviewContainer = () => {
  const styles = useStylesheet();
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={() => {
          return (
            <Text weight="bold" className={css(styles.mainTitle)}>
              Performance Overview
            </Text>
          );
        }}
        body={
          i`The Performance Overview page presents you with all the ` +
          i`key performance metrics of your store. Explore and receive ` +
          i`in-depth insights and customized tips to grow your business ` +
          i`on Wish.`
        }
        paddingX={pageX}
        illustration="perfHeader"
      />
      <Text weight="bold" className={css(styles.title)}>
        Key performance metrics
      </Text>
      <div className={css(styles.container)}>
        <FulfillmentPerformanceBox className={css(styles.column)} />
        <TrackingPerformanceBox className={css(styles.column)} />
        <DeliveryPerformanceBox className={css(styles.column)} />
        <RefundPerformanceBox className={css(styles.column)} />
        <StorePerformanceBox className={css(styles.column)} />
        <CounterfeitPerformanceBox className={css(styles.column)} />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
        mainTitle: {
          backgroundColor: "#ffffff",
          marginTop: 15,
          fontSize: 24,
          color: palettes.textColors.Ink,
        },
        container: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
          padding: `0px ${pageX} 160px ${pageX}`,
          marginLeft: -10,
          marginRight: -10,
          justifyContent: "space-between",
        },
        column: {
          display: "inline-block",
          margin: 10,
          flex: "0 1 auto",
          flexGrow: 1,
          borderRadius: 4,
          overflow: "hidden",
          flexBasis: "30%",
          minWidth: dimenStore.screenInnerWidth < 1200 ? 350 : "31.5%",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
          backgroundColor: "#ffffff",
          transform: "scale3d(1, 1, 1)",
          transition: "transform 0.2s linear",
          ":hover": {
            transform: "scale3d(1.05, 1.05, 1.05)",
          },
        },
        title: {
          marginTop: 24,
          padding: `16px ${pageX}`,
          fontSize: 24,
          color: palettes.textColors.Ink,
        },
      }),
    [pageX, dimenStore.screenInnerWidth]
  );
};

export default observer(PerfOverviewContainer);
