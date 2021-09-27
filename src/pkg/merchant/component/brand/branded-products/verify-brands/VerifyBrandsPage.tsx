import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { FilterButton } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { H5Markdown } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Merchant API */
import * as verifyBrandsApi from "@merchant/api/brand/verify-brands";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringArrayQueryParam,
} from "@toolkit/url";

import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Relative Imports */
import VerifyBrandsSearch from "./VerifyBrandsSearch";
import VerifyBrandsFilter from "./VerifyBrandsFilter";
import VerifyBrandsTable from "./VerifyBrandsTable";

type VerifyBrandsPageProps = BaseProps;

const VerifyBrandsPage = (props: VerifyBrandsPageProps) => {
  const toastStore = useToastStore();
  const styles = useStylesheet();
  const { style } = props;

  // Query
  const [offsetParam, setOffset] = useIntQueryParam("offset");
  const [itemsInOnePageParam, setItemsInOnePage] = useIntQueryParam("count");
  const [query, setQuery] = useStringQueryParam("query");
  const offset = offsetParam || 0;
  const itemsInOnePage = itemsInOnePageParam
    ? Math.min(itemsInOnePageParam, 100)
    : 25;

  // Filter
  const [daysLeft] = useStringArrayQueryParam("days_left_to_verify");

  const queryParams = {
    limit: itemsInOnePage,
    offset,
    query: query.trim(),
    query_type: "brand_name",
    days_left: daysLeft.join(","),
  };
  const [response, refreshList] = useRequest(
    verifyBrandsApi.getProductBrandDetectionInfoList(queryParams)
  );

  const data = response?.data;
  const pageIndicatorLoading = data == null;
  const infos = data?.detection_infos || [];
  const total = data?.total_count || 0;
  const lastPage = total ? Math.floor((total - 1) / itemsInOnePage) : 0;

  const errorMsg = response?.msg;
  useEffect(() => {
    if (errorMsg != null && errorMsg.trim().length > 0) {
      toastStore.error(errorMsg);
    }
  }, [toastStore, errorMsg]);

  const onQueryUpdate = useCallback(
    (newQuery: string | null | undefined): void => {
      setQuery(newQuery);
      setOffset(0);
    },
    [setQuery, setOffset]
  );

  return (
    <Card className={css(style)}>
      <div className={css(styles.headerContainer)}>
        <H5Markdown
          className={css(styles.headerTitle)}
          text={i`Branded Products Pending Verification`}
        />

        <div className={css(styles.headerText)}>
          Verify brands for the products below to continue selling them, or
          select “Ignore tag” if the detection by Wish is incorrect. If the
          product is counterfeit, please permanently remove the product.
          Listings will be temporarily removed if no action is taken within the
          days left to verify. Correctly tagging these products will optimize
          your listings for customers and maximize sales.
        </div>

        <div className={css(styles.utilsBar)}>
          <VerifyBrandsSearch
            initialQuery={query}
            onQueryUpdate={onQueryUpdate}
          />
          <div className={css(styles.utilsBarRight)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              rangeStart={offset + 1}
              rangeEnd={offset + infos.length}
              hasNext={infos.length != 0 && offset + itemsInOnePage < total}
              hasPrev={offset !== 0}
              currentPage={offset / itemsInOnePage}
              onPageChange={(_nextPage) => {
                let nextPage = Math.max(0, _nextPage);
                nextPage = Math.min(lastPage, nextPage);
                setOffset(nextPage * itemsInOnePage);
              }}
              isLoading={pageIndicatorLoading}
              totalItems={total}
            />

            <Select
              className={css(styles.itemsPerPage)}
              options={[
                { value: 10, text: i`10` },
                { value: 25, text: i`25` },
                { value: 50, text: i`50` },
                { value: 100, text: i`100` },
              ]}
              onSelected={(value) => {
                setItemsInOnePage(value);
              }}
              selectedValue={itemsInOnePage}
              minWidth={50}
              buttonHeight={32}
            />

            <Popover
              popoverContent={() => <VerifyBrandsFilter />}
              position="bottom center"
              contentWidth={264}
            >
              <FilterButton style={styles.filterButton} />
            </Popover>
          </div>
        </div>
      </div>
      {pageIndicatorLoading ? (
        <LoadingIndicator />
      ) : (
        <VerifyBrandsTable infos={infos} onUpdate={refreshList} />
      )}
    </Card>
  );
};

export default observer(VerifyBrandsPage);

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          paddingTop: 24,
          paddingLeft: 24,
          paddingRight: 24,
          paddingBottom: 20,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        headerTitle: {
          fontWeight: fonts.weightBold,
          lineHeight: 1.6,
          height: 32,
        },
        headerText: {
          maxWidth: 692,
          marginTop: 9,
          marginBottom: 24,
          fontSize: 16,
          lineHeight: 1.5,
          color: textBlack,
        },
        utilsBar: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          height: 40,
        },
        utilsBarRight: {
          display: "flex",
          flexDirection: "row",
          height: 34,
          alignSelf: "center",
        },
        itemsPerPage: {
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          margin: "0px 20px 0px 0px",
          height: 32,
        },
        pageIndicator: {
          marginRight: 20,
        },
        filterButton: {
          height: "100%",
          padding: "4px 15px",
        },
      }),
    [borderPrimary, textBlack]
  );
};
