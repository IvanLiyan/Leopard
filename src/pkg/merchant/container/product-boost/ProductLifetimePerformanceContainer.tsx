import React, { useState, useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PageIndicator } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { search as searchImg } from "@assets/icons";

/* Merchant Components */
import ProductLifetimeTable from "@merchant/component/product-boost/products/ProductLifetimeTable";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { useRequest } from "@toolkit/api";

import { ProductsSearchType } from "@merchant/api/product-boost";
import { OnTextChangeEvent, TextInputProps } from "@ContextLogic/lego";

const PageSize = 10;

const ProductLifetimePerformanceContainer = () => {
  const { userStore } = useStore();

  const styles = useStylesheet();
  const [currentOffset, setCurrentOffset] = useState(0);
  const [searchOption, setSearchOption] = useState<ProductsSearchType>("id");
  const [searchValue, setSearchValue] = useState("");

  const logger = useLogger(
    "PRODUCT_BOOST_PRODUCT_LIFETIME_PERFORMANCE_PAGE_VIEW"
  );
  useEffect(() => {
    logger.info({
      mid: userStore.loggedInMerchantUser.id,
    });
  }, [logger, userStore.loggedInMerchantUser.id]);

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setCurrentOffset(nextPage * PageSize);
  };

  const [resp] = useRequest(
    productBoostApi.getProductBoostProducts({
      limit: PageSize,
      offset: currentOffset,
      search_type: searchOption,
      search_query: searchValue,
    })
  );

  const data = resp?.data;

  const options: { value: ProductsSearchType; text: string }[] = [
    {
      value: "id",
      text: i`Product ID`,
    },
    {
      value: "name",
      text: i`Product Name`,
    },
    {
      value: "sku",
      text: i`Product SKU`,
    },
  ];

  const selectProps = {
    options,
    onSelected: (value: ProductsSearchType) => {
      setSearchOption(value);
      if (searchValue.trim().length === 0) {
        return;
      }
      setCurrentOffset(0);
    },
    selectedValue: searchOption,
    minWidth: 120,
    hideBorder: true,
  };

  const inputPlaceholder = useMemo(() => {
    const dict: { [type in ProductsSearchType]: string } = {
      id: i`Search a product ID`,
      name: i`Search a product name`,
      sku: i`Search a product SKU`,
    };
    return dict[searchOption];
  }, [searchOption]);

  const textInputProps: TextInputProps = {
    icon: searchImg,
    placeholder: inputPlaceholder,
    hideBorder: true,
    focusOnMount: false,
    value: searchValue,
    onChange({ text }: OnTextChangeEvent) {
      setSearchValue(text);
      setCurrentOffset(0);
    },
    style: { minWidth: "25vw" },
  };

  if (data == null) {
    return <LoadingIndicator />;
  }

  const hasNext = !data.results.feed_ended;
  const currentEnd = data.results.next_offset;
  const totalCount = data.results.num_results;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.content)}>
        <div className={css(styles.topControls)}>
          <Text weight="bold" className={css(styles.title)}>
            Product Campaign Performance
          </Text>
        </div>
        <div className={css(styles.searchContainerAndPageIndicatorRow)}>
          <div className={css(styles.searchContainer)}>
            <TextInputWithSelect
              selectProps={selectProps}
              textInputProps={textInputProps}
            />
          </div>
          <div className={css(styles.controllerGroup)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              rangeStart={currentOffset + 1}
              rangeEnd={currentEnd}
              hasNext={hasNext}
              hasPrev={currentOffset >= PageSize}
              currentPage={currentOffset / PageSize}
              onPageChange={onPageChange}
              totalItems={totalCount}
            />
          </div>
        </div>
        <ProductLifetimeTable
          data={data.results.rows}
          className={css(styles.table)}
        />
      </div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: colors.pageBackground,
        },
        title: {
          fontSize: 22,
          lineHeight: 1.33,
          color: palettes.textColors.Ink,
          marginRight: 25,
          userSelect: "none",
          alignSelf: "flex-start",
        },
        content: {
          padding: "20px 3% 90px 3%",
        },
        topControls: {
          marginTop: 25,
          ":nth-child(1n) > *": {
            height: 30,
            margin: "0px 0px 25px 0px",
          },
        },
        searchContainerAndPageIndicatorRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
        },
        searchContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        searchBox: {
          minWidth: 300,
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "center",
          height: 30,
        },
        controllerGroup: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        table: {
          marginTop: 10,
        },
      }),
    []
  );
};

export default observer(ProductLifetimePerformanceContainer);
