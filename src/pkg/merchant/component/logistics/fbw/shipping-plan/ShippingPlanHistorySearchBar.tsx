import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { TextInputWithSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type SearchBarProps = BaseProps & {
  readonly onSearch: (arg0: string) => unknown;
  readonly searchType: string;
  readonly setSearchType: (arg0: string) => unknown;
};

const options = [
  {
    value: "shipping_plan_id",
    text: i`Shipping Plan ID`,
  },
  {
    value: "sku",
    text: i`SKU`,
  },
];

const ShippingPlanHistorySearchBar = (props: SearchBarProps) => {
  const styles = useStylesheet(props);
  const { onSearch, searchType, setSearchType } = props;

  const onChangeCallback = (item: { tokens: ReadonlyArray<string> }) => {
    onSearch(item.tokens.length > 0 ? item.tokens[0] : "");
  };

  return (
    <TextInputWithSelect
      className={css(styles.input)}
      selectProps={{
        selectedValue: searchType,
        options,
        onSelected: (item: string) => {
          setSearchType(item);
        },
      }}
      textInputProps={{
        icon: searchImg,
        placeholder: i`Choose an ID type to Search`,
        tokenize: true,
        noDuplicateTokens: true,
        maxTokens: 1,
        onTokensChanged: onChangeCallback,
        style: { minWidth: "350px" },
      }}
    />
  );
};

const useStylesheet = (props: SearchBarProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        toolbarContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        input: {},
        paginationContainer: {},
        tableContainer: {},
        emptyText: {},
      }),
    []
  );
};

export default ShippingPlanHistorySearchBar;
