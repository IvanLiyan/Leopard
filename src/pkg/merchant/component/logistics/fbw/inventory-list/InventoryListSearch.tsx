import React, { useMemo, useState, useRef } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInputWithSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbw";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { SearchType } from "./FbwInventoryListTable";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type InventoryListSearchProp = BaseProps & {
  readonly onSearch: (searchType: SearchType, searchValue: string) => unknown;
};

const InventoryListSearch = (props: InventoryListSearchProp) => {
  const styles = useStyleSheet();
  const { onSearch } = props;
  const [searchType, setSearchType] = useState<SearchType>("id");
  const searchTypeRef = useRef<SearchType>("id");

  searchTypeRef.current = searchType;

  const listingPageActionLogger = useLogger(
    "FBW_INVENTORY_LISTING_PAGE_ACTION"
  );

  const onSelectedSearchFieldChanged = (selectedSearchField: SearchType) => {
    listingPageActionLogger.info({
      action: LogActions.EDIT_SEARCH_CRITERIA,
      detail: selectedSearchField,
    });
    setSearchType(selectedSearchField);
  };

  const onSearchTokensChanged = (item: { tokens: ReadonlyArray<string> }) => {
    listingPageActionLogger.info({
      action: LogActions.EDIT_SEARCH_TOKENS,
      detail: item.tokens.join(),
    });
    onSearch(searchTypeRef.current, item.tokens.join(","));
  };

  return (
    <TextInputWithSelect
      className={css(styles.input)}
      selectProps={{
        selectedValue: searchType,
        options: [
          {
            value: "sku",
            text: i`Product SKU`,
          },
          {
            value: "id",
            text: i`Product ID`,
          },
          {
            value: "variationSku",
            text: i`Variation SKU`,
          },
        ],
        onSelected: onSelectedSearchFieldChanged,
      }}
      textInputProps={{
        icon: searchImg,
        placeholder:
          searchType !== "variationSku"
            ? i`Search for a product ${searchType.toUpperCase()} `
            : i`Search for a variation SKU`,
        tokenize: true,
        onTokensChanged: onSearchTokensChanged,
        noDuplicateTokens: true,
        maxTokens: 1,
        style: { minWidth: "25vw" },
      }}
    />
  );
};

export default observer(InventoryListSearch);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        input: {
          display: "flex",
          minWidth: "100%",
          alignItems: "center",
        },
      }),
    []
  );
};
