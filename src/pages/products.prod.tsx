import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import AllProducts from "@all-products/components/AllProducts";
import { LoadingIndicator, Pager } from "@ContextLogic/lego";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { useStringQueryParam, useUpsertQueryParams } from "@core/toolkit/url";
import { merchFeURL } from "@core/toolkit/router";
import PageRoot from "@core/components/PageRoot";
import PageHeader from "@core/components/PageHeader";
import PageGuide, { VeryRelaxedSidePadding } from "@core/components/PageGuide";
import { ci18n } from "@core/toolkit/i18n";
import {
  ProductsContainerInitialData,
  PRODUCTS_CONTAINER_INITIAL_DATA_QUERY,
} from "@all-products/toolkit";
import { useQuery } from "@apollo/client";
import FullPageError from "@core/components/FullPageError";

const AddWarehouseTabKey = "ADD_WAREHOUSE";

const ProductsContainer: React.FC = () => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const upsertQueryParams = useUpsertQueryParams();
  const [selectedTab] = useStringQueryParam("warehouse");

  const {
    data: initialData,
    loading: isLoadingInitialData,
    refetch: onRefetchInitialData,
  } = useQuery<ProductsContainerInitialData>(
    PRODUCTS_CONTAINER_INITIAL_DATA_QUERY,
  );

  const warehouses = initialData?.currentMerchant?.warehouses || [];

  const handleChangeTab = async (tab: string) => {
    await upsertQueryParams({
      // keys here need to be the same as the ones in stateHooks.ts
      search_type: null,
      search_term: null,
      limit: null,
      offset: null,
      state: null,
      enabled: null,
      badges: null,
      sort: null,
      order: null,
      warehouse: tab,
    });
  };

  if (!isLoadingInitialData && warehouses.length == 0) {
    return <FullPageError error="500" />;
  }

  return (
    <PageRoot>
      <PageHeader
        title={ci18n(
          "Title of a page on which merchants can view all their products in table form",
          "All products",
        )}
        veryRelaxed
      />
      {isLoadingInitialData ? (
        <LoadingIndicator />
      ) : (
        <Pager
          selectedTabKey={selectedTab || warehouses[0].id}
          onTabChange={(tab: string) =>
            tab == AddWarehouseTabKey
              ? navigationStore.navigate(
                  merchFeURL("/product/create-warehouse"),
                  {
                    openInNewTab: true,
                  },
                )
              : handleChangeTab(tab)
          }
          tabsRowStyle={{
            padding: `0px ${VeryRelaxedSidePadding}`,
          }}
          condenseMode
        >
          {warehouses.map((warehouse) => (
            <Pager.Content
              key={warehouse.id}
              tabKey={warehouse.id}
              titleValue={warehouse.unitId}
            >
              <PageGuide veryRelaxed>
                {isLoadingInitialData || initialData == null ? null : (
                  <AllProducts
                    style={styles.content}
                    warehouse={warehouse}
                    initialData={initialData}
                    onRefetchInitialData={onRefetchInitialData}
                  />
                )}
              </PageGuide>
            </Pager.Content>
          ))}
          <Pager.Content tabKey={AddWarehouseTabKey} titleValue="+" />
        </Pager>
      )}
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          marginTop: 32,
        },
      }),
    [],
  );

export default observer(ProductsContainer);
