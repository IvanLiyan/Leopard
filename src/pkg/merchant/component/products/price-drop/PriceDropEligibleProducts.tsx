import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { CheckboxField } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { search as searchImg } from "@assets/icons";

/* Merchant Components */
import PriceDropEligibleProductsTable from "@merchant/component/products/price-drop/PriceDropEligibleProductsTable";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* SVGs */
import wishExpressTruck from "@assets/img/wish-express.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import {
  EligibleProduct,
  EligibleProductsSearchType,
} from "@merchant/api/price-drop";
import {
  useBoolQueryParam,
  useIntQueryParam,
  useStringEnumQueryParam,
  useStringQueryParam,
} from "@toolkit/url";

const PageSize = 10;

type PriceDropEligibleProductsProps = BaseProps & {
  readonly selectedProduct: EligibleProduct | null | undefined;
  readonly onProductSelect: (
    product: EligibleProduct | null | undefined
  ) => void;
  readonly data?: priceDropApi.GetPriceDropEligibleProductsResponse;
  readonly isLoading?: boolean;
};

const PriceDropEligibleProducts = (props: PriceDropEligibleProductsProps) => {
  const styles = useStylesheet();
  const {
    className,
    style,
    onProductSelect,
    selectedProduct,
    data,
    isLoading,
  } = props;

  const [searchOption, setSearchOption] = useStringEnumQueryParam<
    EligibleProductsSearchType
  >("search_type", "id");
  const [query, setQuery] = useStringQueryParam("q");
  const [, setStartId] = useStringQueryParam("sid");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [wishExpressOnly, setWishExpressOnly] = useBoolQueryParam(
    "wish_express",
    false
  );

  const offset = rawOffset || 0;

  const products = data?.rows || [];
  const hasNext = !data?.feed_ended || false;
  const isExempted = data?.is_exempted || false;
  const currentEnd = offset + products.length || 0;
  const lastProduct = products[products.length - 1];

  const inputPlaceholder = useMemo(() => {
    const dict = {
      id: i`Search a product ID`,
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
        if (query.trim().length === 0) {
          return;
        }
        setOffset(0);
      },
      selectedValue: searchOption,
      minWidth: 120,
      hideBorder: true,
    };
  }, [searchOption, query, setOffset, setSearchOption]);

  const textInputProps = useMemo(() => {
    return {
      icon: searchImg,
      placeholder: inputPlaceholder,
      hideBorder: true,
      focusOnMount: false,
      value: query,
      onChange: ({ text }: OnTextChangeEvent) => {
        setQuery(text);
        setOffset(0);
      },
      style: { minWidth: "25vw" },
    };
  }, [inputPlaceholder, query, setOffset, setQuery]);

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.topControls)}>
        <div className={css(styles.searchContainer)}>
          <TextInputWithSelect
            selectProps={selectProps}
            textInputProps={textInputProps}
          />
        </div>

        <div className={css(styles.filterContainer)}>
          <CheckboxField
            className={css(styles.filterCheckbox)}
            title={i`Wish Express`}
            icon={wishExpressTruck}
            onChange={() => {
              setWishExpressOnly(!wishExpressOnly);
              setOffset(0);
            }}
            checked={wishExpressOnly}
          />
        </div>

        <div className={css(styles.controllerGroup)}>
          <PageIndicator
            className={css(styles.pageIndicator)}
            rangeStart={offset + 1}
            rangeEnd={currentEnd}
            hasNext={hasNext}
            hasPrev={offset >= PageSize}
            currentPage={offset / PageSize}
            onPageChange={(nextPage: number) => {
              nextPage = Math.max(0, nextPage);
              setOffset(nextPage * PageSize);
              setStartId(lastProduct.id);
            }}
          />
        </div>
      </div>

      <div className={css(styles.tableContainer)}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <PriceDropEligibleProductsTable
            selectedProduct={selectedProduct}
            products={products}
            onProductSelect={onProductSelect}
            isExempted={isExempted}
          />
        )}
      </div>
    </div>
  );
};

export default observer(PriceDropEligibleProducts);

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
            margin: "0px 0px 25px 25px",
          },
        },
        searchContainer: {
          border: `1px solid ${palettes.greyScaleColors.LighterGrey}`,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        controllerGroup: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "center",
          height: 30,
        },
        tableContainer: {
          // Workaround for search type being cut off
          minHeight: 300,
        },
        filterContainer: {
          display: "flex",
        },
        filterCheckbox: {
          marginRight: 25,
        },
      }),
    []
  );
};
