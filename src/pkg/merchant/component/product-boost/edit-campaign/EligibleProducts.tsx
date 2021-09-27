import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Zeus */
import { IconName } from "@ContextLogic/zeus";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { OnTextChangeEvent } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Components */
import EligibleProductsTable from "@merchant/component/product-boost/edit-campaign/EligibleProductsTable";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

/* Type Imports */
import { EligibleProduct } from "@merchant/api/product-boost";
import { EligibleProductsSearchType } from "@merchant/api/product-boost";

/* Merchant Model */
import Product from "@merchant/model/product-boost/Product";

/* SVGs */
import wishExpressTruck from "@assets/img/wish-express.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const PageSize = 10;

type EligibleProductsProps = BaseProps & {
  readonly allowMaxboost: boolean;
  readonly dailyBudgetEnabled?: boolean;
  readonly selectedProducts?: ReadonlyArray<Product>;
  readonly setSelectedProducts?: (
    updateFunction: (products: ReadonlyArray<Product>) => ReadonlyArray<Product>
  ) => void;
};

const EligibleProducts = (props: EligibleProductsProps) => {
  const styles = useStylesheet();
  const {
    className,
    dailyBudgetEnabled,
    selectedProducts,
    setSelectedProducts,
    allowMaxboost,
  } = props;

  const [searchOption, setSearchOption] = useState<EligibleProductsSearchType>(
    "id"
  );
  const [searchValue, setSearchValue] = useState("");
  const [currentOffset, setCurrentOffset] = useState(0);
  const [wishExpressOnly, setWishExpressOnly] = useState(false);
  const debouncedSearchValue = useDebouncer(searchValue, 500);

  const params: productBoostApi.GetProductBoostEligibleProductsParams = {
    count: PageSize,
    start: currentOffset,
    search_type: searchOption,
    search_query: debouncedSearchValue,
    wish_express_only: wishExpressOnly,
  };

  const request = productBoostApi.getProductBoostEligibleProducts(params);
  const data = request.response?.data;

  const products: ReadonlyArray<EligibleProduct> = data?.rows || [];
  const hasNext = !data?.feed_ended || false;
  const currentEnd = currentOffset + products.length || 0;

  const inputPlaceholder = useMemo(() => {
    const dict = {
      id: i`Search by product IDs (Use comma to separate)`,
      name: i`Search a product name`,
      sku: i`Search a product SKU`,
      parent_sku: i`Search a parent SKU`,
      tags: i`Search by tags (Use space to separate tags)`,
    };
    return dict[searchOption];
  }, [searchOption]);

  const selectProps = useMemo(() => {
    const options: { value: EligibleProductsSearchType; text: string }[] = [
      {
        value: "id",
        text: i`Product IDs`,
      },
      {
        value: "name",
        text: i`Product Name`,
      },
      {
        value: "sku",
        text: i`Product SKU`,
      },
      {
        value: "parent_sku",
        text: i`Parent SKU`,
      },
      {
        value: "tags",
        text: i`Tags`,
      },
    ];

    return {
      options,
      onSelected: (value: EligibleProductsSearchType) => {
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
  }, [searchOption, searchValue]);

  const textInputProps = useMemo(() => {
    return {
      icon: "search" as IconName,
      placeholder: inputPlaceholder,
      hideBorder: true,
      focusOnMount: false,
      value: searchValue,
      onChange: ({ text }: OnTextChangeEvent) => {
        setSearchValue(text);
        setCurrentOffset(0);
      },
      style: { minWidth: "25vw" },
    };
  }, [inputPlaceholder, searchValue]);

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setCurrentOffset(nextPage * PageSize);
  };

  const renderPageIndicator = () => (
    <PageIndicator
      className={css(styles.pageIndicator)}
      rangeStart={currentOffset + 1}
      rangeEnd={currentEnd}
      hasNext={hasNext}
      hasPrev={currentOffset >= PageSize}
      currentPage={currentOffset / PageSize}
      onPageChange={onPageChange}
    />
  );

  const renderSearchBar = () => (
    <TextInputWithSelect
      selectProps={selectProps}
      textInputProps={textInputProps}
    />
  );

  const renderBadgeFilter = () => (
    <div className={css(styles.filterContainer)}>
      <CheckboxField
        className={css(styles.filterCheckbox)}
        title={i`Wish Express`}
        icon={wishExpressTruck}
        onChange={() => {
          setWishExpressOnly(!wishExpressOnly);
          setCurrentOffset(0);
        }}
        checked={wishExpressOnly}
      />
    </div>
  );

  return (
    <div className={css(styles.root, className)}>
      <div
        className={
          dailyBudgetEnabled
            ? css(styles.topControls)
            : css(styles.topControls, styles.childMargin)
        }
      >
        <div className={css(styles.searchContainer)}>{renderSearchBar()}</div>
        {renderBadgeFilter()}
        <div className={css(styles.controllerGroup)}>
          {renderPageIndicator()}
        </div>
      </div>
      <LoadingIndicator loadingComplete={request.response != null}>
        <EligibleProductsTable
          allowMaxboost={allowMaxboost}
          products={products}
          dailyBudgetEnabled={dailyBudgetEnabled}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      </LoadingIndicator>
    </div>
  );
};
export default observer(EligibleProducts);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        topControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          marginTop: 25,
          ":nth-child(1n) > *": {
            marginBottom: 25,
          },
        },
        childMargin: {
          ":nth-child(1n) > *": {
            marginLeft: 25,
          },
        },
        searchContainer: {
          border: `1px solid ${palettes.greyScaleColors.LighterGrey}`,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        filterContainer: {
          display: "flex",
        },
        filterCheckbox: {
          marginRight: 25,
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
      }),
    []
  );
};
