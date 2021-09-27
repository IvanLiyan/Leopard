/*
 * PerformanceOverviewDashboardContainer.tsx
 *
 * Created by Betty Chen on Mar 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { usePathParams } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import PerformanceStoreHealthSection from "@merchant/component/performance/overview/PerformanceStoreHealthSection";
import PerformanceStoreMetricsSection from "@merchant/component/performance/overview/PerformanceStoreMetricsSection";
import WarningBadgeTab from "@merchant/component/performance/overview/WarningBadgeTab";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { WelcomeHeader } from "@merchant/component/core";

/* Model */
import {
  PerformanceHealthInitialData,
  countStoreHealthWarnings,
} from "@toolkit/performance/stats";
import { Page } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

type Props = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
};

const PerformanceOverviewDashboardContainer = (props: Props) => {
  const { initialData } = props;
  const styles = useStylesheet();
  const dimenStore = useDimenStore();
  const routeStore = useRouteStore();
  const { currentTab } = usePathParams("/performance-overview/:currentTab");

  useEffect(() => {
    const callLogger = async () => {
      await logger({
        action: "LAND_FROM_ENTRY",
        event_name: "LANDING",
        page: Page.performanceOverview,
      });
    };
    callLogger();
  }, []);

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Performance overview`}
        illustration="performanceOverview"
        body={() => (
          <>
            <Text>
              View key performance metrics of your store and products.
            </Text>
            <Text>Dates are in Pacific Time</Text>
          </>
        )}
        hideBorder
      />
      <Pager
        onTabChange={async (tab: string) => {
          if (tab === "health") {
            await logger({
              action: "CLICK",
              page: Page.performanceOverview,
              event_name: "CLICK_TO_STORE_HEALTH",
              new_value: countStoreHealthWarnings(initialData),
              to_page_url: `/performance-overview/${tab}`,
            });
          }
          routeStore.pushPath(`/performance-overview/${tab}`);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${dimenStore.pageGuideX}`,
        }}
      >
        <Pager.Content
          tabKey="metrics"
          titleValue={() => (
            <WarningBadgeTab
              text={i`Sales metrics`}
              initialData={initialData}
            />
          )}
        >
          <PerformanceStoreMetricsSection
            initialData={initialData}
            className={css(styles.section)}
          />
        </Pager.Content>
        <Pager.Content
          tabKey="health"
          titleValue={() => (
            <WarningBadgeTab
              text={i`Store health`}
              initialData={initialData}
              showWarning
            />
          )}
        >
          <PerformanceStoreHealthSection
            initialData={initialData}
            className={css(styles.section)}
          />
        </Pager.Content>
      </Pager>
    </div>
  );
};

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        section: {
          marginTop: 64,
        },
      }),
    [pageBackground]
  );
};

export default observer(PerformanceOverviewDashboardContainer);
