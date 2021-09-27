/* eslint-disable filenames/match-regex */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";
import moment from "moment/moment";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

import { TypeaheadInput } from "@merchant/component/core";

/* Lego Toolkit */
import { weightBold, weightMedium } from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBSProductStatsTable from "@merchant/component/logistics/fbs/performance/FBSProductStatsTable";

/* Merchant API */
import * as fbsApi from "@merchant/api/fbs";

/* Toolkit */
import {
  getDateRange,
  getUSStateNameSafe,
  getCountryNameSafe,
  LogActions,
} from "@toolkit/fbs";
import { useLogger } from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TimePeriod } from "@toolkit/fbs";
import { CountryCode } from "@toolkit/countries";
import { StateCode } from "@ContextLogic/lego/toolkit/states";

export type FBSRegionProductsSoldProps = BaseProps & {
  readonly timePeriod: TimePeriod;
  readonly countryCodes: ReadonlyArray<CountryCode>;
  readonly stateCodes: ReadonlyArray<StateCode>;
};

const numTopSellers = 50;

const FBSRegionProductsSold = (props: FBSRegionProductsSoldProps) => {
  const { className, style, timePeriod, countryCodes, stateCodes } = props;
  const styles = useStyleSheet();

  const today = moment();
  const dateRange = getDateRange(timePeriod, today);

  const countryNames = countryCodes.map((cc) => getCountryNameSafe(cc));
  const stateNames = stateCodes.map((sc) => getUSStateNameSafe(sc));

  const actionLogger = useLogger("FBS_PERFORMANCE_PAGE_ACTION");

  const allRegions = [...countryNames, ...stateNames];
  const generateRegionDisplay = (region: string) =>
    stateNames.includes(region) ? i`US - ${region}` : region;
  const queryRegions = async ({ query }: { query: string }) => {
    const trimmedQuery = query.trim().toLocaleLowerCase();
    if (trimmedQuery.length === 0) {
      return _.sortBy(allRegions, generateRegionDisplay);
    }
    const mostLikelyResults = allRegions.filter((item) =>
      item.toLocaleLowerCase().includes(trimmedQuery)
    );
    return _.sortBy(mostLikelyResults, generateRegionDisplay);
  };

  const pageSize = 10;
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([]));
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const resetRowActions = () => {
    setSelectedRows(new Set());
    setExpandedRows(new Set());
  };

  /* eslint-disable local-rules/unwrapped-i18n */
  const generalKeys = ["gmv", "orders", "quantity_sold", "inventory"];
  const countryKeys = [
    "gmv_country_dict",
    "orders_country_dict",
    "quantity_sold_country_dict",
    "inventory_country_dict",
  ];
  const stateKeys = [
    "gmv_us_dict",
    "orders_us_dict",
    "quantity_sold_us_dict",
    "inventory_us_dict",
  ];

  const request = fbsApi.getProductStats({
    start_date: dateRange.startDate,
    end_date: dateRange.endDate,
  });
  const productVariations = request.response?.data?.results;

  if (productVariations == null) {
    return (
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.header)}>
          <div className={css(styles.titleContent)}>
            <Markdown
              text={i`Products sold in`}
              className={css(styles.title)}
            />
          </div>
        </div>
        <LoadingIndicator />
      </div>
    );
  }

  const filteredProductVariations = productVariations
    .map((pv) => {
      if (searchText.length === 0) {
        return pv;
      }
      const modified = { ...pv };

      // Convert country codes in the response dict into full keys
      for (const countryKey of countryKeys) {
        (modified as any)[countryKey] = _.mapKeys(
          (modified as any)[countryKey],
          (value, key: CountryCode) => getCountryNameSafe(key)
        );
      }
      for (const stateKey of stateKeys) {
        (modified as any)[stateKey] = _.mapKeys(
          (modified as any)[stateKey],
          (value, key: StateCode) => getUSStateNameSafe(key)
        );
      }

      // eg. if our search is for DE, we need to update the total values to be DE's values (to display in table)
      if (
        countryKeys.some(
          (countryKey) => searchText in (modified as any)[countryKey]
        )
      ) {
        countryKeys.forEach((countryKey, idx) => {
          (modified as any)[generalKeys[idx]] =
            (modified as any)[countryKey][searchText] || 0;
        });
      } else if (
        stateKeys.some((stateKey) => searchText in (modified as any)[stateKey])
      ) {
        stateKeys.forEach((stateKey, idx) => {
          (modified as any)[generalKeys[idx]] =
            (modified as any)[stateKey][searchText] || 0;
        });
      } else {
        generalKeys.forEach(
          (generalKey) => ((modified as any)[generalKey] = 0)
        );
      }
      return modified;
    })
    .filter((pv) =>
      generalKeys.some((generalKey) => (pv as any)[generalKey] > 0)
    )
    .slice(0, numTopSellers);

  const totalItems = filteredProductVariations.length;
  const rangeStart = currentPage * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize + pageSize, totalItems);
  const displayedRows = filteredProductVariations.slice(
    rangeStart - 1,
    rangeEnd
  );

  const updateSearch = (value: string): void => {
    setSearchText(value);
    setCurrentPage(0);
    resetRowActions();
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.header)}>
        <div className={css(styles.titleContent)}>
          <Markdown text={i`Products sold in`} className={css(styles.title)} />
          <TypeaheadInput
            text={searchText}
            onTextChange={({ text }) => {
              updateSearch(text);
            }}
            onSelection={({ item }) => {
              actionLogger.info({
                action: LogActions.CLICK_FILTER_REGION_PRODUCTS,
                detail: item,
              });
              updateSearch(item);
            }}
            getData={queryRegions}
            renderItem={({ item }) => generateRegionDisplay(item)}
            inputProps={{
              placeholder: i`Search for a region`,
            }}
          />
        </div>
        <div className={css(styles.tableActions)}>
          <PageIndicator
            totalItems={totalItems}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hasNext={currentPage < totalItems / pageSize - 1}
            hasPrev={currentPage > 0}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              resetRowActions();
            }}
          />
        </div>
      </div>
      <FBSProductStatsTable
        rows={displayedRows}
        dataExistsButFiltered={
          productVariations ? productVariations.length > 0 : false
        }
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        expandedRows={expandedRows}
        setExpandedRows={setExpandedRows}
        noDataMessage={
          i`Within the next few days, you will be able to see ` +
          i`your products' performance insights in offline pickup stores here.`
        }
      />
    </div>
  );
};

export default observer(FBSRegionProductsSold);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0px 24px 20px 24px",
        },
        titleContent: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          fontWeight: weightBold,
          marginRight: 14,
        },
        subtitle: {
          color: palettes.textColors.LightInk,
          fontSize: 16,
          fontWeight: weightMedium,
          verticalAlign: "middle",
        },
        tableActions: {
          display: "flex",
          flexDirection: "row",
        },
        downloadButton: {
          marginLeft: 8,
        },
        downloadText: {
          color: palettes.textColors.LightInk,
          fontSize: 14,
          fontWeight: weightMedium,
        },
      }),
    []
  );
};
