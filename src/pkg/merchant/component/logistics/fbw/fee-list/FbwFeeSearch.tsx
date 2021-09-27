import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInputWithSelect } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Option } from "@ContextLogic/lego";

export type SearchType = "ShippingPlanId" | "VariationSku" | "OrderId";

const AllSearchOptions: Array<Option<string>> = [
  { value: "ShippingPlanId", text: i`Shipping Plan ID` },
  { value: "VariationSku", text: i`Variation SKU` },
  { value: "OrderId", text: i`Order ID` },
];
const getPlaceHolderBySearchType: (arg0: string) => string = (type) => {
  if (type === "ShippingPlanId") {
    return i`Search by Shipping Plan ID`;
  }
  if (type === "VariationSku") {
    return i`Search by Variation SKU`;
  }
  // "OrderId"
  return i`Search by Order ID`;
};

export type FbwFeeSearchValues = {
  readonly searchType: string;
  readonly searchToken: string;
};

export type FbwFeeSearchProp = BaseProps &
  FbwFeeSearchValues & {
    readonly setSearchValues: (arg0: FbwFeeSearchValues) => unknown;
  };

const MAX_SEARCH_NUM = 1; //current API only supports 1, but can be expanded

const FbwFeeSearch = (props: FbwFeeSearchProp) => {
  const styles = useStyleSheet();
  const { searchType, searchToken, setSearchValues } = props;
  const [currentSearchType, setCurrentSearchType] = useState(searchType);
  const [currentSearchToken, setCurrentSearchToken] = useState(searchToken);
  // only updates if token changes or type changes when token is not empty
  useEffect(() => {
    if (
      currentSearchToken !== searchToken ||
      (currentSearchToken && currentSearchType !== searchType)
    ) {
      setSearchValues({
        searchToken: currentSearchToken,
        searchType: currentSearchType,
      });
    }
  }, [
    searchType,
    searchToken,
    currentSearchToken,
    currentSearchType,
    setSearchValues,
  ]);
  return (
    <TextInputWithSelect
      className={css(styles.input)}
      selectProps={{
        selectedValue: currentSearchType,
        options: AllSearchOptions,
        onSelected: (selectedSearchField: string) => {
          setCurrentSearchType(selectedSearchField);
        },
      }}
      textInputProps={{
        icon: searchImg,
        placeholder: getPlaceHolderBySearchType(currentSearchType),
        tokenize: true,
        onTokensChanged: (params: { tokens: ReadonlyArray<string> }) => {
          const newSearchToken = params.tokens[0] || "";
          setCurrentSearchToken(newSearchToken);
        },
        noDuplicateTokens: true,
        maxTokens: MAX_SEARCH_NUM,
        defaultValue: currentSearchToken,
        style: { minWidth: "25vw" },
      }}
    />
  );
};

export default observer(FbwFeeSearch);

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
