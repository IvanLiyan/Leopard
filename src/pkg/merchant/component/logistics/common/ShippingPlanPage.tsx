import React, { useMemo, useCallback, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { PageIndicator } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useRequest } from "@toolkit/api";

/* Internal Components */
import ShippingPlanHistorySearchBar from "@merchant/component/logistics/fbw/shipping-plan/ShippingPlanHistorySearchBar";
import ShippingPlanHistorySearchResultTable from "@merchant/component/logistics/fbw/shipping-plan/ShippingPlanHistorySearchResultTable";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Internal API */
import { getShippingPlanHistory } from "@merchant/api/fbw";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ObjectID from "bson-objectid";

type TextMap = {
  [index: string]: string;
};

const TEXT_SCRUBS: TextMap = {
  fbw_history_title: i`FBW Shipping Plan History`,
  fbw_action_required_title: i`FBW Action Required`,
  fbs_history_title: i`FBS Shipping Plan History`,
  fbs_action_required_title: i`FBS Action Required`,
  fbw_history_body:
    i`Track the status and view details on your FBW shipping plans that are ` +
    i`in-transit to warehouses, completed, or expired.`,
  fbw_action_required_body: i`View details of your FBW shipping plans that require further action.`,
  fbs_history_body:
    i`Track the status and view details on your FBS shipping plans that are  ` +
    i`in-transit to warehouses, completed, or expired.`,
  fbs_action_required_body: i`View details of your FBS shipping plans that require further action.`,
};

type ShippingPlanPageProps = BaseProps & {
  readonly stateFilter: "history" | "action-required";
  readonly productType: "fbs" | "fbw";
};

const ShippingPlanPage = (props: ShippingPlanPageProps) => {
  const styles = useStylesheet(props);
  const { primary } = useTheme();
  const { productType, stateFilter } = props;
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsInOnePage, setItemsInOnePage] = useState(50);

  const start = currentPage * itemsInOnePage;
  const [searchString, setSearchString] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("shipping_plan_id");

  // This is a temporary pagination solution for microservice api integration
  const [sortKeyOffset, setSortKeyOffset] = useState([""]);
  const [idOffset, setIdOffset] = useState([""]);

  const payload = searchString
    ? {
        start,
        count: itemsInOnePage,
        sortKey: "id",
        sortDir: -1,
        query: searchString,
        search_type: searchType,
        product_type: productType,
        state_filter: stateFilter,
      }
    : {
        start: 0,
        count: itemsInOnePage,
        sortKey: "id",
        sortDir: -1,
        query: "",
        product_type: productType,
        state_filter: stateFilter,
        created_before: sortKeyOffset[currentPage],
        id_offset: idOffset[currentPage],
      };

  const [response, refreshData] = useRequest(getShippingPlanHistory(payload), {
    relayError: true,
  });
  const tableData = response?.data?.results?.rows || [];
  const remainingTotal = response?.data?.results?.num_results || 0;
  const loading = response === undefined;

  const renderTable = () => (
    <ShippingPlanHistorySearchResultTable
      data={tableData}
      stateFilter={stateFilter}
      refreshParent={refreshData}
    />
  );

  const onPageChange = (inputPage: number) => {
    if (inputPage > currentPage) {
      setSortKeyOffset((prevItems) => [
        ...prevItems.slice(0, inputPage),
        new Date(
          new ObjectID(tableData[tableData.length - 1].id).getTimestamp()
        ).toISOString(),
      ]);
      setIdOffset((prevItems) => [
        ...prevItems.slice(0, inputPage),
        tableData[tableData.length - 1].id,
      ]);
    }

    setCurrentPage(inputPage);
  };

  const onSearch = useCallback(
    (item: string) => {
      setSearchString(item);
      setCurrentPage(0);
    },
    [setSearchString]
  );

  const renderEmpty = () => (
    <div className={css(styles.emptyText)}>
      No result matching search criteria.
    </div>
  );

  const isCurrentPageFull = tableData.length >= itemsInOnePage;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={
          TEXT_SCRUBS[`${productType}_${stateFilter.replace("-", "_")}_title`]
        }
        body={
          TEXT_SCRUBS[`${productType}_${stateFilter.replace("-", "_")}_body`]
        }
        paddingX={pageX}
        illustration="fbwInventoryListing"
        hideBorder
      />
      <div className={css(styles.content)}>
        <div className={css(styles.toolbarContainer)}>
          <div className={css(styles.toolContainer)}>
            <ShippingPlanHistorySearchBar
              searchType={searchType}
              setSearchType={setSearchType}
              onSearch={onSearch}
            />
          </div>
          <div className={css(styles.toolContainer)}>
            <div className={css(styles.createContainer)}>
              <SecondaryButton
                className={css(styles.createButton)}
                text={i`Create`}
                type="default"
                border={`solid 1px ${primary}`}
                onClick={() => {
                  window.open(
                    `/create-shipping-plan?shipmentType=${
                      productType === "fbs" ? "FBS" : "FBW"
                    }`
                  );
                }}
              />
            </div>
            {tableData && tableData.length > 0 && (
              <div className={css(styles.paginationContainer)}>
                <PageIndicator
                  className={css(styles.pageIndicator)}
                  totalItems={remainingTotal + currentPage * itemsInOnePage}
                  rangeStart={currentPage * itemsInOnePage + 1}
                  rangeEnd={
                    isCurrentPageFull
                      ? (currentPage + 1) * itemsInOnePage
                      : remainingTotal + currentPage * itemsInOnePage
                  }
                  hasNext={isCurrentPageFull}
                  hasPrev={currentPage != 0}
                  currentPage={currentPage}
                  onPageChange={(value) => onPageChange(value)}
                />
                <div className={css(styles.pageSelector)}>
                  <div className={css(styles.itemsPerPage)}>Items per page</div>
                  <Select
                    className={css(styles.itemsPerPage)}
                    options={[
                      { value: 10, text: i`10` },
                      { value: 50, text: i`50` },
                      { value: 100, text: i`100` },
                    ]}
                    onSelected={(value) => {
                      setItemsInOnePage(value);
                    }}
                    selectedValue={itemsInOnePage}
                    minWidth={50}
                    buttonHeight={35}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className={css(styles.loadingContainer)}>
            <LoadingIndicator type="spinner" size={70} />
          </div>
        ) : (
          <div className={css(styles.tableContainer)}>
            {tableData.length == 0 ? renderEmpty() : renderTable()}
          </div>
        )}
      </div>
    </div>
  );
};

const useStylesheet = (props: BaseProps) => {
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
        paginationContainer: {
          display: "flex",
        },
        pageIndicator: {},
        chartContainer: {
          marginBottom: 20,
        },
        createContainer: {
          display: "flex",
        },
        itemsPerPage: {
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          margin: "0px 10px 0px 0px",
          height: 35,
        },
        pageSelector: {
          display: "flex",
          marginLeft: 20,
        },
      }),
    [pageX]
  );
};

export default ShippingPlanPage;
