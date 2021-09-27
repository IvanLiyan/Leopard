import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import moment from "moment/moment";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { PageIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { Label } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { DownloadButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  useDateQueryParam,
  useIntArrayQueryParam,
  useStringQueryParam,
} from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FeeFilter, {
  DateFormat,
} from "@merchant/component/logistics/common/FeeFilter";
import FbwFeeSearch from "@merchant/component/logistics/fbw/fee-list/FbwFeeSearch";
import FbsFeeTable from "@merchant/component/logistics/fbs/fee-list/FbsFeeTable";
import FeeSum from "@merchant/component/logistics/common/FeeSum";
import FeeDownloadModal from "@merchant/component/logistics/common/FeeDownloadModal";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Type Imports */
import { GetFBWFeesParams } from "@merchant/api/fbw";
import { FbwFeeSearchValues } from "@merchant/component/logistics/fbw/fee-list/FbwFeeSearch";
import {
  FeeFilterValues,
  FeeFilterOption,
  FilterOptionGroup,
} from "@merchant/component/logistics/common/FeeFilter";
import { SortOrder } from "@ContextLogic/lego";

// List all supported fee types.
const AllTypeFilters: ReadonlyArray<FeeFilterOption> = [
  {
    value: [150],
    title: i`FBS Service Fee`,
  },
];

const FeeTypeToDisplayName: ReadonlyArray<FeeFilterOption> = [
  {
    value: [1],
    title: i`Storage Fee`,
  },
  {
    value: [2],
    title: i`Shipping Plan Fee`,
  },
  {
    value: [3],
    title: i`Storage Fee`,
  },
  {
    value: [4],
    title: i`Order Fee`,
  },
  {
    value: [5],
    title: i`Return Exit Inventory Fee`,
  },
  {
    value: [100],
    title: i`Shipping Plan Handling Fee`,
  },
  {
    value: [101],
    title: i`Shipping Plan Sorting Fee`,
  },
  {
    value: [110],
    title: i`Order Shipping Fee`,
  },
  {
    value: [111],
    title: i`Order Handling Fee`,
  },
  {
    value: [112],
    title: i`Order Repackaging Fee`,
  },
  {
    value: [120],
    title: i`Storage Fee`,
  },
  {
    value: [130],
    title: i`Return Exit Inventory Shipping Fee`,
  },
  {
    value: [131],
    title: i`Return Exit Inventory Handling Fee`,
  },
  {
    value: [140],
    title: i`Returned Order Storage Fee`,
  },
  {
    value: [141],
    title: i`Returned Order Handling Fee`,
  },
  {
    value: [142],
    title: i`Returned Order Disposal Fee`,
  },
  {
    value: [150],
    title: i`FBS Service Fee`,
  },
];
// secondary variables depending on FBSFeeTypeFilters and NonFBSTypeFilters
const renderFeeTypeByValue = (value: number) => {
  const feeType = FeeTypeToDisplayName.find((type) => {
    return type.value.some((v) => v === value);
  });
  if (feeType) {
    return feeType.title;
  }
  return i`Unspecified`;
};
// List all supported fee statuses.
const AllStatusFilters: ReadonlyArray<FeeFilterOption> = [
  {
    value: [1],
    title: () => (
      <Label
        textColor="#2b3333"
        backgroundColor="#ffea8a"
        width={112}
        text={i`Not yet deducted`}
      />
    ),
  },
  {
    value: [2],
    title: () => (
      <Label
        textColor="#ffffff"
        backgroundColor="#88c43f"
        width={112}
        text={i`Deducted`}
      />
    ),
  },
];
const renderFeeStatusByValue = (value: number) => {
  const feeStatus = AllStatusFilters.find((status) => {
    return status.value.some((v) => v === value);
  });
  if (feeStatus) {
    return feeStatus.title;
  }
  return i`Unspecified`;
};

const FBWFeeContainer = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const styles = useStyleSheet();
  const filterValues = AllTypeFilters.map((filter) => [...filter.value]);
  const FBSFeeTypeValues = _.flatten(filterValues);

  // query related states
  const [
    feeTypeFilterSelections,
    setFeeTypeFilterSelections,
  ] = useIntArrayQueryParam("fee_types");
  const [
    feeStatusFilterSelections,
    setFeeStatusFilterSelections,
  ] = useIntArrayQueryParam("fee_statuses");
  const feeStatusSignature = JSON.stringify(feeStatusFilterSelections);
  const [searchType, setSearchType] = useStringQueryParam(
    "search_type",
    "VariationSku"
  );
  const [searchToken, setSearchToken] = useState<string>("");
  const [startDate, setStartDate] = useDateQueryParam("start_date", {
    format: DateFormat,
  });
  const [endDate, setEndDate] = useDateQueryParam("end_date", {
    format: DateFormat,
  });
  const startDateString = startDate ? moment(startDate).format(DateFormat) : "";
  const endDateString = endDate ? moment(endDate).format(DateFormat) : "";
  const [sortByAmountOrder, setSortByAmountOrder] = useState<SortOrder>(
    "not-applied"
  );
  const [sortByDateOrder, setSortByDateOrder] = useState<SortOrder>("desc");
  // functions related to setting filters
  const setFilterValues = (filterValues: FeeFilterValues) => {
    setFeeTypeFilterSelections(filterValues.feeTypeFilterOptionGroup.selected);
    setFeeStatusFilterSelections(
      filterValues.feeStatusFilterOptionGroup.selected
    );
    setStartDate(filterValues.startDate);
    setEndDate(filterValues.endDate);
    setCurrentPage(0);
  };
  const setSearchValues = (searchValues: FbwFeeSearchValues) => {
    setSearchToken(searchValues.searchToken);
    setSearchType(searchValues.searchType);
    setCurrentPage(0);
  };
  const onDownloadClicked = () => {
    new FeeDownloadModal({
      exportApiParams: getApiParams,
      productType: "fbs",
    }).render();
  };
  const onSortByAmountClicked = (sortOrder: SortOrder) => {
    setSortByDateOrder("not-applied");
    setSortByAmountOrder(sortOrder);
    setCurrentPage(0);
  };
  const onSortByDateClicked = (sortOrder: SortOrder) => {
    setSortByAmountOrder("not-applied");
    setSortByDateOrder(sortOrder);
    setCurrentPage(0);
  };
  // functions/variables related to changing tabs
  const getFeeTypeOptionGroupByTabOption = (): FilterOptionGroup => {
    let options: FilterOptionGroup["options"] = [];
    options = AllTypeFilters;
    return {
      title: i`Fee Type`,
      options,
      selected: feeTypeFilterSelections || [],
    };
  };
  const feeStatusFilterOptionGroup = {
    title: i`Fee Status`,
    options: AllStatusFilters,
    selected: feeStatusFilterSelections || [],
  };
  // page related states
  const [itemsInOnePage, setItemsInOnePage] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);
  // only update filter value when needed
  const getApiParams = useMemo((): GetFBWFeesParams => {
    const feeStatuses = JSON.parse(feeStatusSignature);
    const feeTypes = FBSFeeTypeValues;
    let searchParams = {};
    if (searchToken) {
      switch (searchType) {
        case "ShippingPlanId":
          searchParams = { shipping_plan_id: searchToken.trim() };
          break;
        case "OrderId":
          searchParams = { order_id: searchToken.trim() };
          break;
        default:
          //VariationSku
          searchParams = { sku: searchToken.trim() };
          break;
      }
    }
    let sortParams = {};
    if (sortByAmountOrder === "asc") {
      sortParams = { sort_by_amount: 1 };
    } else if (sortByAmountOrder === "desc") {
      sortParams = { sort_by_amount: -1 };
    } else if (sortByDateOrder === "asc") {
      sortParams = { sort_by_date: 1 };
    } else {
      sortParams = { sort_by_date: -1 };
    }
    return {
      product_type: "FBS",
      start: currentPage * itemsInOnePage,
      count: itemsInOnePage,
      ...(startDateString ? { start_date: startDateString } : {}),
      ...(endDateString ? { end_date: endDateString } : {}),
      ...(feeTypes.length ? { fee_types: feeTypes } : {}),
      ...(feeStatuses.length ? { fee_statuses: feeStatuses } : {}),
      ...searchParams,
      ...sortParams,
    };
  }, [
    startDateString,
    endDateString,
    searchType,
    searchToken,
    feeStatusSignature,
    sortByAmountOrder,
    sortByDateOrder,
    currentPage,
    itemsInOnePage,
    FBSFeeTypeValues,
  ]);
  // actual data in the table
  const [getFeeApiResponse] = useRequest(api.getFBWFees(getApiParams));
  const responseData = getFeeApiResponse?.data;
  const loadedFees = responseData?.results;
  const totalItems = responseData ? responseData.num_results : 0;
  // calculated page related stuff
  const rangeStart = currentPage * itemsInOnePage + 1;
  const rangeEnd = Math.min(
    currentPage * itemsInOnePage + itemsInOnePage,
    totalItems
  );
  const hasNext = Math.floor((totalItems - 1) / itemsInOnePage) !== currentPage;
  const hasPrev = currentPage !== 0;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`FBS Fees`}
        body={() => {
          return (
            <React.Fragment>
              <div className={css(styles.feeSumDescriptionContainer)}>
                <div className={css(styles.feeSumDescription)}>
                  You can view details of all FBS fees issued to your account.
                </div>
                <div className={css(styles.feeSumDescription)}>
                  <Link href={"/fbs/fees"} openInNewTab>
                    How do I get charged?
                  </Link>
                </div>
              </div>
              <FeeSum productType={"FBS"} queryParams={getApiParams} />
            </React.Fragment>
          );
        }}
        paddingX={pageX}
        illustration="fbwFee"
        className={css(styles.header)}
        hideBorder
      />

      {loadedFees == null ? (
        <LoadingIndicator type="swinging-bar" />
      ) : (
        <div className={css(styles.content)}>
          <div className={css(styles.buttonsRow)}>
            <div className={css(styles.buttonsLeft)}>
              <FbwFeeSearch
                searchType={searchType}
                searchToken={searchToken}
                setSearchValues={setSearchValues}
              />
            </div>
            <div className={css(styles.buttonsRight)}>
              <DownloadButton onClick={onDownloadClicked} />
              <div className={css(styles.pipeSeparator)} />
              <PageIndicator
                totalItems={totalItems}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                hasNext={hasNext}
                hasPrev={hasPrev}
                currentPage={currentPage}
                onPageChange={(value) => setCurrentPage(value)}
              />
              <div className={css(styles.pipeSeparator)} />
              <div className={css(styles.itemsPerPage)}>Items per page</div>
              <Select
                className={css(styles.itemsPerPageButton)}
                options={[
                  { value: 100, text: i`100` },
                  { value: 250, text: i`250` },
                  { value: 500, text: i`500` },
                ]}
                onSelected={(value) => {
                  setItemsInOnePage(value);
                }}
                selectedValue={itemsInOnePage}
                minWidth={50}
                buttonHeight={35}
              />
              <div className={css(styles.pipeSeparator)} />
              <FeeFilter
                feeTypeFilterOptionGroup={getFeeTypeOptionGroupByTabOption()}
                feeStatusFilterOptionGroup={feeStatusFilterOptionGroup}
                startDate={startDate}
                endDate={endDate}
                setFilterValues={setFilterValues}
                isOnFBSTab
              />
            </div>
          </div>
          <FbsFeeTable
            fbsFees={loadedFees}
            renderFeeTypeByValue={renderFeeTypeByValue}
            renderFeeStatusByValue={renderFeeStatusByValue}
            sortByAmountOrder={sortByAmountOrder}
            sortByDateOrder={sortByDateOrder}
            onSortByAmountClicked={onSortByAmountClicked}
            onSortByDateClicked={onSortByDateClicked}
          />
        </div>
      )}
    </div>
  );
};

const useStyleSheet = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        buttonsRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
          marginBottom: 25,
        },
        feeSumDescriptionContainer: {
          display: "flex",
          flexDirection: "row",
        },
        buttonsLeft: {
          display: "flex",
          flexDirection: "row",
        },
        buttonsRight: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        itemsPerPageButton: {
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          height: 35,
        },
        itemsPerPage: {
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          height: 35,
          marginRight: 10,
        },
        pipeSeparator: {
          display: "flex",
          margin: "0px 10px 0px 10px",
          width: 1,
          height: 30,
          borderRight: "1px solid lightgray",
        },
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        header: {},
        feeSumDescription: {
          margin: "20px 10px 20px 0px",
          fontSize: 16,
        },
        content: {
          paddingLeft: pageX,
          paddingRight: pageX,
          paddingBottom: pageX,
        },
        alert: {
          marginBottom: 8,
        },
      }),
    [pageX, pageBackground]
  );
};

export default observer(FBWFeeContainer);
