import React, { useMemo, useEffect } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { Pager } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/atlas-ui";

import { css } from "@core/toolkit/styling";
import { useStringQueryParam } from "@core/toolkit/url";
import PageHeader from "@core/components/PageHeader";

import PerformanceStoreMetricsSection from "@performance/migrated/sales-metrics-components/PerformanceStoreMetricsSection";
import MerchantScoreSection from "@performance/migrated/wss-components/MerchantScoreSection";

/* Model */
import { Page } from "@performance/migrated/toolkit/constants";
import logger from "@performance/migrated/toolkit/logger";
import { useQuery } from "@apollo/client";
import {
  PERFORMANCE_OVERVIEW_PAGE_INITIAL_DATA_QUERY,
  PerformanceOverviewPageInitialDataQueryResponse,
} from "@performance/api/performanceOverviewPageInitialDataQuery";
import PageRoot from "@core/components/PageRoot";
import Skeleton from "@core/components/Skeleton";
import { RelaxedSidePadding } from "@core/components/PageGuide";
import { ci18n } from "@core/toolkit/i18n";

const PageLayout: React.FC = ({ children }) => {
  return (
    <PageRoot>
      <PageHeader title={i`Performance Overview`} relaxed>
        <Text>View key performance metrics of your store and products.</Text>
      </PageHeader>
      {children}
    </PageRoot>
  );
};

const Tabs = ["metrics", "wish-standards"] as const;
type Tab = typeof Tabs[number];

const PerformanceOverviewPage: NextPage<Record<string, never>> = () => {
  const styles = useStylesheet();

  const [currentTabRaw, setCurrentTab] = useStringQueryParam("tab", "metrics");
  const currentTab: Tab = (Tabs as ReadonlyArray<string>).includes(
    currentTabRaw,
  )
    ? (currentTabRaw as Tab)
    : "metrics";

  const { data: initialData, loading } =
    useQuery<PerformanceOverviewPageInitialDataQueryResponse>(
      PERFORMANCE_OVERVIEW_PAGE_INITIAL_DATA_QUERY,
    );

  useEffect(() => {
    const callLogger = () => {
      logger({
        action: "LAND_FROM_ENTRY",
        event_name: "LANDING",
        page: Page.performanceOverview,
      });
    };
    callLogger();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <Skeleton
          sx={{
            margin: `32px ${RelaxedSidePadding} 0px ${RelaxedSidePadding}`,
          }}
          height={1920}
        />
      </PageLayout>
    );
  }

  if (initialData == null) {
    return (
      <PageLayout>
        <Text variant="bodyLStrong">Something went wrong.</Text>;
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Pager
        onTabChange={(tab: Page) => {
          void setCurrentTab(tab);
        }}
        selectedTabKey={currentTab}
        tabsRowStyle={{
          padding: `0px ${RelaxedSidePadding}`,
          zIndex: 999,
          ":nth-child(1n) > *": {
            overflowX: "visible",
          },
        }}
      >
        <Pager.Content
          tabKey="metrics"
          titleValue={ci18n("title of tab on page", "Sales Metrics")}
        >
          <PerformanceStoreMetricsSection
            initialData={initialData}
            className={css(styles.section)}
          />
        </Pager.Content>
        <Pager.Content
          tabKey="wish-standards"
          titleValue={ci18n("title of tab on page", "Wish Standards")}
        >
          <MerchantScoreSection
            initialData={initialData}
            className={css(styles.section)}
          />
        </Pager.Content>
      </Pager>
    </PageLayout>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          marginTop: 32,
        },
      }),
    [],
  );
};

export default observer(PerformanceOverviewPage);
