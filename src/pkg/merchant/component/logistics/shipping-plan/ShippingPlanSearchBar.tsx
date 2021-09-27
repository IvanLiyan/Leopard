import React, { useCallback } from "react";

/* Lego Components */
import { TextInputWithSelect } from "@ContextLogic/lego";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SearchType = "product_id" | "product_sku" | "variation_sku";

type SearchBarProps = BaseProps & {
  readonly searchType: SearchType;
  readonly setSearchType: (arg0: SearchType) => unknown;
  readonly setSearchString: (arg0: string) => unknown;
};

const options: { value: SearchType; text: string }[] = [
  {
    value: "product_id",
    text: i`Product ID`,
  },
  {
    value: "product_sku",
    text: i`Product SKU`,
  },
  {
    value: "variation_sku",
    text: i`Variation SKU`,
  },
];

const ShippingPlanSearchBar = (props: SearchBarProps) => {
  const { searchType, setSearchType, setSearchString } = props;

  const onChangeCallback = useCallback(
    (item) => {
      setSearchString(item.tokens.length > 0 ? item.tokens[0] : "");
    },
    [setSearchString]
  );

  return (
    <TextInputWithSelect
      selectProps={{
        selectedValue: searchType,
        options,
        onSelected: (item: SearchType) => {
          setSearchType(item);
        },
      }}
      textInputProps={{
        icon: searchImg,
        placeholder: i`Search for ${
          options.find((item) => item.value === searchType)?.text
        }`,
        tokenize: true,
        noDuplicateTokens: true,
        maxTokens: 1,
        onTokensChanged: onChangeCallback,
        style: { minWidth: "350px" },
      }}
    />
  );
};

export default ShippingPlanSearchBar;
