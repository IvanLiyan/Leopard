import React, { useState } from "react";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { LoadingIndicator, OnTextChangeEvent } from "@ContextLogic/lego";
import { Pager } from "@ContextLogic/lego";

/* Lego Toolkit */
import { usePathParams } from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Components */
import PriceDrop from "@merchant/component/products/price-drop/PriceDrop";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Toolkit */
import { useRequest } from "@toolkit/api";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import {
  CurrencyCode,
  HistoryPriceDropState,
  PriceDropSearchType,
} from "@merchant/api/price-drop";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const PageSize = 10;

type PriceDropSectionProps = BaseProps & {
  readonly currency: CurrencyCode;
  readonly showGMVGain: boolean;
  readonly selectAll: boolean;
  readonly priceDropDeprecateV1: boolean;
  readonly resetSelectAll: () => void;
};

const PriceDropSection = (props: PriceDropSectionProps) => {
  const { currency, showGMVGain, selectAll, resetSelectAll } = props;
  const { dimenStore, routeStore } = AppStore.instance();

  const pageX = dimenStore.pageGuideXForPageWithTable;
  const { selectedTab = "pending" } = usePathParams(
    "/marketplace/price-drop/:selectedTab",
  );

  const [pendingOffset, setPendingOffset] = useState(0);
  const [ongoingOffset, setOngoingOffset] = useState(0);
  const [endedOffset, setEndedOffset] = useState(0);
  const [historyStateSelect, setHistoryStateSelect] =
    useState<HistoryPriceDropState>("all");
  const [pendingSearchOption, setPendingSearchOption] =
    useState<PriceDropSearchType>("product_id");
  const [pendingSearchValue, setPendingSearchValue] = useState("");
  const [ongoingSearchOption, setOngoingSearchOption] =
    useState<PriceDropSearchType>("product_id");
  const [ongoingSearchValue, setOngoingSearchValue] = useState("");
  const [endedSearchOption, setEndedSearchOption] =
    useState<PriceDropSearchType>("product_id");
  const [endedSearchValue, setEndedSearchValue] = useState("");
  const debouncedPendingSearchValue = useDebouncer(pendingSearchValue, 500);
  const debouncedOngoingSearchValue = useDebouncer(ongoingSearchValue, 500);
  const debouncedEndedSearchValue = useDebouncer(endedSearchValue, 500);

  const [pendingRecordResponse, refreshPendingRecordRequest] = useRequest(
    priceDropApi.getPriceDropRecords({
      count: PageSize,
      offset: pendingOffset,
      state: "pending",
      search_type: pendingSearchOption,
      search_query: debouncedPendingSearchValue,
    }),
  );
  const [ongoingRecordResponse, refreshOngoingRecordRequest] = useRequest(
    priceDropApi.getPriceDropRecords({
      count: PageSize,
      offset: ongoingOffset,
      state: "ongoing",
      search_type: ongoingSearchOption,
      search_query: debouncedOngoingSearchValue,
    }),
  );
  const [endedRecordResponse] = useRequest(
    priceDropApi.getPriceDropRecords({
      count: PageSize,
      offset: endedOffset,
      state: "ended",
      search_type: endedSearchOption,
      search_query: debouncedEndedSearchValue,
      history_state: historyStateSelect,
    }),
  );

  if (
    !pendingRecordResponse ||
    !ongoingRecordResponse ||
    !endedRecordResponse
  ) {
    return <LoadingIndicator />;
  }

  const pendingCount = pendingRecordResponse?.data?.total_count || 0;
  const ongoingCount = ongoingRecordResponse?.data?.total_count || 0;
  const merchantCanceledCount =
    endedRecordResponse?.data?.merchant_canceled_count || 0;
  const endedCount = endedRecordResponse?.data?.ended_count || 0;
  const allCount = merchantCanceledCount + endedCount;

  const historyStateSelectProps = {
    options: [
      {
        value: "all",
        text: i`Show All (${allCount})`,
      },
      {
        value: "ended",
        text: i`Campaign Ended (${endedCount})`,
      },
      {
        value: "merchant_canceled",
        text: i`Campaign Canceled (${merchantCanceledCount})`,
      },
    ],
    onSelected: (value: HistoryPriceDropState) => {
      setHistoryStateSelect(value);
    },
    selectedValue: historyStateSelect,
    minWidth: 120,
    hideBorder: false,
    filterName: i`Filter By`,
  };

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    switch (selectedTab) {
      case "pending":
        setPendingOffset(nextPage * PageSize);
        break;
      case "ongoing":
        setOngoingOffset(nextPage * PageSize);
        break;
      case "ended":
        setEndedOffset(nextPage * PageSize);
        break;
      default:
        break;
    }
  };

  const refreshAllRequests = () => {
    refreshOngoingRecordRequest();
    refreshPendingRecordRequest();
  };

  return (
    <Pager
      tabsPadding={`0px ${pageX}`}
      onTabChange={async (tabKey: string) => {
        routeStore.pushPath(`/marketplace/price-drop/${tabKey}`);
      }}
      selectedTabKey={selectedTab}
    >
      <Pager.Content
        titleValue={i`Pending (${numeral(pendingCount).format("0,0")})`}
        tabKey="pending"
        popoverContent={i`Pending campaigns are being analyzed and have not started yet.`}
      >
        <PriceDrop
          response={pendingRecordResponse?.data}
          offset={pendingOffset}
          pageSize={PageSize}
          pageX={pageX}
          currencyCode={currency}
          showGMVGain={showGMVGain}
          selectAll={selectAll}
          resetSelectAll={resetSelectAll}
          selectedTab="pending"
          onPriceDropActionUpdated={(resetOffset: boolean) => {
            if (resetOffset) {
              setPendingOffset(0);
            }
            refreshPendingRecordRequest();
          }}
          onPageChange={onPageChange}
          onSearchTypeSelect={(value: PriceDropSearchType) => {
            setPendingSearchOption(value);
            if (pendingSearchValue.trim().length === 0) {
              return;
            }
            setPendingOffset(0);
          }}
          onSearchValueChange={({ text }: OnTextChangeEvent) => {
            setPendingSearchValue(text);
            setPendingOffset(0);
          }}
          searchOption={pendingSearchOption}
          searchValue={pendingSearchValue}
        />
      </Pager.Content>
      <Pager.Content
        titleValue={i`On-going (${numeral(ongoingCount).format("0,0")})`}
        tabKey="ongoing"
        popoverContent={
          i`View on-going campaign details and adjust Auto-Renewal. Price Drop ` +
          i`percentages are locked in for duration of campaigns. If campaign is ` +
          i`not renewed, prices will automatically revert to Original Product Price.`
        }
      >
        <PriceDrop
          response={ongoingRecordResponse?.data}
          offset={ongoingOffset}
          pageSize={PageSize}
          pageX={pageX}
          currencyCode={currency}
          showGMVGain={showGMVGain}
          selectAll={selectAll}
          resetSelectAll={resetSelectAll}
          selectedTab="ongoing"
          onPriceDropActionUpdated={(resetOffset: boolean) => {
            if (resetOffset) {
              setOngoingOffset(0);
            }
            refreshAllRequests();
          }}
          onPageChange={onPageChange}
          onSearchTypeSelect={(value: PriceDropSearchType) => {
            setOngoingSearchOption(value);
            if (ongoingSearchValue.trim().length === 0) {
              return;
            }
            setOngoingOffset(0);
          }}
          onSearchValueChange={({ text }: OnTextChangeEvent) => {
            setOngoingSearchValue(text);
            setOngoingOffset(0);
          }}
          searchOption={ongoingSearchOption}
          searchValue={ongoingSearchValue}
        />
      </Pager.Content>
      <Pager.Content
        titleValue={i`History (${numeral(allCount).format("0,0")})`}
        tabKey="ended"
        popoverContent={i`View performance and details of all previously run Price Drop campaigns.`}
      >
        <PriceDrop
          response={endedRecordResponse?.data}
          offset={endedOffset}
          pageSize={PageSize}
          pageX={pageX}
          currencyCode={currency}
          showGMVGain={showGMVGain}
          selectAll={selectAll}
          resetSelectAll={resetSelectAll}
          selectedTab="ended"
          onPriceDropActionUpdated={() => {}}
          onPageChange={onPageChange}
          historyStateSelectProps={historyStateSelectProps}
          onSearchTypeSelect={(value: PriceDropSearchType) => {
            setEndedSearchOption(value);
            if (endedSearchValue.trim().length === 0) {
              return;
            }
            setEndedOffset(0);
          }}
          onSearchValueChange={({ text }: OnTextChangeEvent) => {
            setEndedSearchValue(text);
            setEndedOffset(0);
          }}
          searchOption={endedSearchOption}
          searchValue={endedSearchValue}
        />
      </Pager.Content>
    </Pager>
  );
};

export default observer(PriceDropSection);
