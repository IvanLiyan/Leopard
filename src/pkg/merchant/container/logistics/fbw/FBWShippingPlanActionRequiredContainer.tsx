import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Internal Components */
import ShippingPlanPage from "@merchant/component/logistics/common/ShippingPlanPage";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

const FBWShippingPlanActionRequiredContainer = () => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root)}>
      <ShippingPlanPage productType="fbw" stateFilter="action-required" />
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingBottom: 70,
        },
        content: {
          paddingLeft: pageX,
          paddingRight: pageX,
          paddingBottom: pageX,
        },
        toolbarContainer: {
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
        },
        createButton: {
          marginRight: 20,
        },
        toolContainer: {
          display: "flex",
        },
        searchContainer: {},
        loadingContainer: {
          display: "flex",
          justifyContent: "center",
        },
        tableContainer: {},
        filterContainer: {
          marginLeft: 10,
        },
        emptyText: {},
        paginationContainer: {},
        pageIndicator: {},
        chartContainer: {
          marginBottom: 20,
        },
        createContainer: {
          display: "flex",
        },
      }),
    [pageX]
  );
};

export default observer(FBWShippingPlanActionRequiredContainer);
