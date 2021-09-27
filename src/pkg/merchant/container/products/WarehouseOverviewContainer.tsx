/*
 * WarehouseOverviewContainer.tsx
 *
 * Created by Jonah Dlin on Mon Feb 22 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";

/* Lego Components */
import { Link, Text, Pager, Layout, PrimaryButton } from "@ContextLogic/lego";

/* Merchant Components */
import WarehousePerformance from "@merchant/component/products/warehouse-overview/WarehousePerformance";
import WarehouseSettingsSection from "@merchant/component/products/warehouse-overview/WarehouseSettingsSection";
import { PageGuide, WelcomeHeader } from "@merchant/component/core";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";
import { useRouteStore } from "@merchant/stores/RouteStore";
import { useDimenStore } from "@merchant/stores/DimenStore";

/* Toolkit */
import { WarehouseOverviewInitialData } from "@toolkit/products/warehouse-overview";

type Props = {
  readonly initialData: WarehouseOverviewInitialData;
};

const WarehouseOverviewContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const styles = useStylesheet();
  const dimenStore = useDimenStore();

  const policyLink = "/policy#warehouse_fulfillment";
  const routeStore = useRouteStore();
  const { currentTab } = usePathParams("/warehouse-overview/:currentTab");

  const {
    decision: showWarehouseSettings,
    isLoading: showWarehouseSettingsIsLoading,
  } = useDeciderKey("product_new_warehouse_settings");

  const { decision: showWarehouseCreation } = useDeciderKey(
    "show_new_warehouse_creation",
  );

  return (
    <Layout.FlexColumn className={css(styles.root)}>
      <WelcomeHeader
        title={i`Warehouse Overview`}
        body={() => (
          <Layout.FlexColumn
            alignItems="flex-start"
            className={css(styles.headerBody)}
          >
            <Text className={css(styles.text)}>
              View your warehouse locations and performance metrics.
            </Text>
            <Link className={css(styles.text)} href={policyLink}>
              View Warehouse Fulfillment Policy
            </Link>
            {showWarehouseCreation && (
              <PrimaryButton
                href="/product/create-warehouse"
                className={css(styles.addWarehouse)}
                openInNewTab
              >
                Add warehouse
              </PrimaryButton>
            )}
          </Layout.FlexColumn>
        )}
        maxIllustrationWidth={240}
        illustration="warehouseOverviewBannerImage"
        hideBorder
        paddingY="24px"
      />
      {!showWarehouseSettingsIsLoading && showWarehouseSettings ? (
        <Pager
          tabsRowStyle={{
            padding: `0px ${dimenStore.pageGuideX}`,
          }}
          selectedTabKey={currentTab}
          onTabChange={async (tab: string) => {
            routeStore.pushPath(`/warehouse-overview/${tab}`);
          }}
        >
          <Pager.Content tabKey="performance" titleValue={i`Performance`}>
            <PageGuide>
              <WarehousePerformance
                className={css(styles.content)}
                initialData={initialData}
              />
            </PageGuide>
          </Pager.Content>
          <Pager.Content tabKey="settings" titleValue={i`Settings`}>
            <PageGuide>
              <WarehouseSettingsSection
                className={css(styles.content)}
                initialData={initialData}
              />
            </PageGuide>
          </Pager.Content>
        </Pager>
      ) : (
        <PageGuide>
          <WarehousePerformance
            className={css(styles.content)}
            initialData={initialData}
          />
        </PageGuide>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(WarehouseOverviewContainer);

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: pageBackground,
        },
        headerBody: {
          marginTop: 8,
        },
        text: {
          fontSize: 16,
          lineHeight: 1.5,
          ":not(:last-child)": {
            marginBottom: 4,
          },
        },
        addWarehouse: {
          marginTop: 20,
        },
        content: {
          marginTop: 64,
        },
      }),
    [pageBackground],
  );
};
