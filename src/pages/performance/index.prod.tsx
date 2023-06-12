import React, { useMemo, useEffect } from "react";
import { NextPage } from "next";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { Pager, Layout, H6 } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/atlas-ui";

import { css } from "@core/toolkit/styling";
import { useStringQueryParam } from "@core/toolkit/url";
import { useTheme } from "@core/stores/ThemeStore";
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
        <Skeleton height={720} />
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

  const renderNewBadge = () => (
    <Layout.FlexRow style={styles.newBadge}>New</Layout.FlexRow>
  );

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
          titleValue={() => (
            <Layout.FlexRow justifyContent="center" style={styles.tab}>
              <H6>Sales Metrics</H6>
            </Layout.FlexRow>
          )}
        >
          <PerformanceStoreMetricsSection
            initialData={initialData}
            className={css(styles.section)}
          />
        </Pager.Content>
        <Pager.Content
          tabKey="wish-standards"
          titleValue={() => (
            <Layout.FlexRow justifyContent="center" style={styles.tab}>
              <H6>Wish Standards</H6>
              {renderNewBadge()}
            </Layout.FlexRow>
          )}
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
  const { pageBackground, secondaryDark, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
        },
        section: {
          marginTop: 32,
          zIndex: 200,
        },
        text: {
          marginTop: 8,
        },
        newLabel: {
          marginLeft: 16,
        },
        tab: {
          padding: "12px 20px",
        },
        newBadge: {
          fontSize: 12,
          color: textWhite,
          backgroundColor: secondaryDark,
          padding: "4px 8px",
          borderRadius: 14,
          marginLeft: 8,
        },
      }),
    [pageBackground, secondaryDark, textWhite],
  );
};

export default observer(PerformanceOverviewPage);
