import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Popover,
  FilterButton,
  PageIndicator,
  TextInputWithSelect,
} from "@ContextLogic/lego";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import LineItemsFilter from "@merchant/component/payments/line-items/LineItemsFilter";
import LineItemsTable from "@merchant/component/payments/line-items/LineItemsTable";

/* Merchant API */
import { getLineItems } from "@merchant/api/account-balance";

/* Relative Imports */
import AccountBalanceFetcher from "./AccountBalanceFetcher";

import UserStore from "@merchant/stores/UserStore";
import { Enum } from "@merchant/api/account-balance";
import { Option } from "@ContextLogic/lego";

type Props = {
  readonly adminMode: boolean;
  readonly idTypes: ReadonlyArray<Option<string>>;
  readonly currency: string;
  readonly confirmed: boolean;
  readonly lineItemTypeEnum: Enum;
  readonly fineTypeEnum: Enum;
  readonly lineItemFilterTypes: ReadonlyArray<Option<number>>;
};

// Using number inline throws a 'no-undef' error:
// "'number' is not defined"
type LineItemType = number;

const AccountBalanceTable = (props: Props) => {
  const styles = useStyleSheet();

  // Filter (Admin)
  const [idType, setIdType] = React.useState("id");
  const [idVal, setIdVal] = React.useState("");
  const [lineItemTypes, setTypes] = React.useState<Array<LineItemType>>([]);

  // Filter (Date)
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // Pagination
  const [start, setStart] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(100);

  const {
    adminMode,
    idTypes,
    confirmed,
    currency,
    lineItemTypeEnum,
    fineTypeEnum,
    lineItemFilterTypes,
  } = props;

  const {
    isSuAdmin: isAdmin,
    loggedInMerchantUser: { merchant_id: merchantId },
  } = UserStore.instance();

  // API request
  const request = getLineItems({
    start,
    count: pageSize,
    merchant_id: merchantId,
    confirmed,
    currency,
    item_types: isAdmin && adminMode ? lineItemTypes.join(",") : "",
    start_date: startDate,
    end_date: endDate,
    id_type: idType,
    id_val: idVal,
  });

  const renderSearchBar = () => {
    if (!isAdmin || !adminMode) {
      return null;
    }

    return (
      <TextInputWithSelect
        selectProps={{
          selectedValue: idType,
          height: 28,
          options: idTypes,
          onSelected: (selectedType: string) => setIdType(selectedType || "id"),
        }}
        textInputProps={{
          value: idVal || "",
          placeholder: i`Enter ${
            idTypes.filter((id) => id.value === idType)[0].text
          }`,
          tokenize: true,
          maxTokens: 1,
          height: 30,
          style: { minWidth: 350 },
          onChange: (selectedVal) => setIdVal(selectedVal.text),
        }}
      />
    );
  };

  const renderPageIndicator = () => {
    const hasNext = request.response?.data?.has_more || false;
    const totalCount = request.response?.data?.total_count || 0;

    const currentEnd = Math.min(totalCount, start + pageSize);
    const lastPage = Math.floor((totalCount - 1) / pageSize);

    return (
      <div className={css(styles.pageSelection)}>
        <PageIndicator
          className={css(styles.pageIndicator)}
          totalItems={totalCount}
          rangeStart={start + 1}
          rangeEnd={currentEnd}
          hasNext={hasNext}
          hasPrev={start > 0}
          currentPage={start / pageSize}
          onPageChange={(nextPage) => {
            setStart(Math.min(Math.max(0, nextPage), lastPage) * pageSize);
          }}
        />
      </div>
    );
  };

  const renderFilterButton = () => {
    const hasActiveFilters =
      !!startDate ||
      !!endDate ||
      (lineItemTypes.length > 0 && isAdmin && adminMode);

    return (
      <Popover
        on="click"
        position="bottom right"
        closeOnMouseLeave={false}
        popoverContent={() => (
          <LineItemsFilter
            className={css(styles.lineItemFilter)}
            showItemTypes={isAdmin && adminMode}
            lineItemTypes={lineItemFilterTypes}
            selectedLineItemTypes={lineItemTypes}
            pageSizes={[
              { value: 100, text: "100" },
              { value: 250, text: "250" },
              { value: 500, text: "500" },
              { value: 1000, text: "1000" },
            ]}
            onLineItemTypeToggled={(value: number) => {
              const typeSet = new Set<LineItemType>(lineItemTypes);
              if (typeSet.has(value)) {
                typeSet.delete(value);
              } else {
                typeSet.add(value);
              }
              setTypes([...typeSet]);
              setStart(0);
            }}
            setLineItemTypeSelectedItems={(values: Set<number>) => {
              const typeSet = new Set<LineItemType>();
              values.forEach((value) => {
                typeSet.add(value);
              });
              setTypes([...typeSet]);
              setStart(0);
            }}
            selectedSize={pageSize}
            onPageSizeChange={(newSize: number) => setPageSize(newSize)}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
            onStartDateFilterChanged={(date: string) => {
              setStartDate(date);
              setStart(0);
            }}
            onEndDateFilterChanged={(date: string) => {
              setEndDate(date);
              setStart(0);
            }}
            hasActiveFilters={hasActiveFilters}
            onFiltersDeselected={() => {}}
          />
        )}
      >
        <FilterButton style={styles.filterButton} isActive={hasActiveFilters} />
      </Popover>
    );
  };

  return (
    <>
      <div className={css(styles.tableMenuTop)}>
        <div className={css(styles.buttons)}>{renderSearchBar()}</div>
        <div className={css(styles.buttons)}>
          {renderPageIndicator()}
          {renderFilterButton()}
        </div>
      </div>
      <AccountBalanceFetcher request={request}>
        {(data) => (
          <LineItemsTable
            className={css(styles.lineItemsTable)}
            data={data}
            currency={currency}
            confirmed={confirmed}
            lineItemTypeEnum={lineItemTypeEnum}
            fineTypeEnum={fineTypeEnum}
          />
        )}
      </AccountBalanceFetcher>
    </>
  );
};

const useStyleSheet = () => {
  return React.useMemo(
    () =>
      StyleSheet.create({
        tableMenuTop: {
          marginTop: 15,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        },
        buttons: {
          display: "flex",
          flexDirection: "row",
          marginTop: 15,
          height: 30,
        },
        pageSelection: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          marginRight: 25,
        },
        pageIndicator: {
          marginRight: 10,
          flexWrap: "wrap",
          height: 30,
        },
        lineItemsTable: {
          marginTop: 10,
          marginBottom: 100,
        },
        filterButton: {
          display: "flex",
          alignSelf: "stretch",
          padding: "4px 15px",
        },
        lineItemFilter: {
          maxWidth: 350,
        },
      }),
    []
  );
};

export default observer(AccountBalanceTable);
