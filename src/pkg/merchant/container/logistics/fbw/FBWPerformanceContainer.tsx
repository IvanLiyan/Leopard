import React, { useMemo, useState, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBWAllStats from "@merchant/component/logistics/fbw/FBWAllStats";
import FBWWarehouseStats from "@merchant/component/logistics/fbw/FBWWarehouseStats";
import FBWHeader from "@merchant/component/logistics/fbw/FBWHeader";
import LowInventoryTip from "@merchant/component/logistics/fbw/LowInventoryTip";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { FBWPerformanceState } from "@toolkit/fbw";
import { useRequest } from "@toolkit/api";

const WarehousesPerPage = 7;
const currency = "USD";

const FBWPerformanceContainer = () => {
  const { dimenStore, routeStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const styles = useStyleSheet();
  const { current: performanceState } = useRef(new FBWPerformanceState());

  const [response] = useRequest(api.getNumLowInventory({}));
  const merchantId = response?.data?.merchant_id || "";
  const lowInventory = response?.data?.low_inventory || [];
  const lowInventoryNum = response?.data?.num_low_inventory || 0;
  const warehouses = response?.data?.warehouses || [];

  const allWarehouses = [
    {
      id: "",
      name: i`All`,
      code: "all",
      warehouse_name: "",
      region: -1,
      region_name: "",
      estimated_fulfill_time: 0,
    },
    ...warehouses,
  ];

  const selectedTab =
    routeStore.pathParams("/fbw-performance/:tab").tab || "all";
  const subpager = React.createRef<HTMLDivElement | null>();
  const [focusOnLowInv, setFocusOnLowInv] = useState(false);

  const scrollToLowInv = () => {
    if (subpager.current) {
      window.scrollTo(0, subpager.current.offsetTop);
      setFocusOnLowInv(false);
    }
  };

  return (
    <div className={css(styles.root)}>
      <FBWHeader
        title={i`FBW Performance`}
        body={
          i`FBW performance presents the sales and product ` +
          i`performance of your FBW inventory. You can manage ` +
          i`your top sellers or restock products to optimize your ` +
          i`business. `
        }
        paddingX={pageX}
        className={css(styles.header)}
      />

      <LowInventoryTip className={css(styles.alerts)} />

      <div className={css(styles.content)}>
        <Card>
          <Pager
            onTabChange={(tabKey: string) => {
              routeStore.pushPath(`/fbw-performance/${tabKey}`);
            }}
            selectedTabKey={selectedTab}
            equalSizeTabs={false}
            hideHeaderBorder={false}
            maxVisibleTabs={WarehousesPerPage}
          >
            {allWarehouses.map((warehouse) => {
              if (warehouse.code === "all") {
                return (
                  <Pager.Content
                    titleValue={warehouse.name}
                    tabKey={warehouse.code}
                    key={warehouse.code}
                  >
                    <FBWAllStats
                      key={warehouse.code}
                      warehouse={warehouse}
                      allWarehouses={warehouses}
                      lowInvNum={lowInventoryNum}
                      lowInv={lowInventory}
                      merchantId={merchantId}
                      subpager={subpager}
                      focusOnLowInv={focusOnLowInv}
                      scrollToLowInv={scrollToLowInv}
                      currency={currency}
                      performanceState={performanceState}
                    />
                  </Pager.Content>
                );
              }
              return (
                <Pager.Content
                  titleValue={warehouse.name}
                  tabKey={warehouse.code}
                  key={warehouse.code}
                >
                  <FBWWarehouseStats
                    key={warehouse.code}
                    warehouse={warehouse}
                    merchantId={merchantId}
                    performanceState={performanceState}
                    currency={currency}
                  />
                </Pager.Content>
              );
            })}
          </Pager>
        </Card>
      </div>
    </div>
  );
};

const useStyleSheet = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
        content: {
          paddingLeft: pageX,
          paddingRight: pageX,
          paddingBottom: pageX,
        },
        header: {
          marginBottom: 30,
        },
        alerts: {
          marginLeft: pageX,
          marginRight: pageX,
          marginBottom: 30,
        },
      }),
    [pageX]
  );
};

export default observer(FBWPerformanceContainer);
