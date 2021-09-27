import React from "react";
import { observer } from "mobx-react";

/* Lego Component */
import {
  TextInputWithSelect,
  TextInputProps,
  SimpleSelectOption as Option,
} from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ProductPromotionSearchType } from "@schema/types";
import searchImg from "@assets/img/search.svg";

type Props = BaseProps & {
  readonly searchType: ProductPromotionSearchType;
  readonly onSelectSearchType: (searchType: ProductPromotionSearchType) => void;
  readonly query: string | null | undefined;
  readonly searchDebugValues: {
    [searchType in ProductPromotionSearchType]: string | undefined | null;
  };
  readonly onUpdateQuery: (arg: { readonly text: string }) => void;
  readonly disabled: boolean;
  readonly focusOnMount?: TextInputProps["focusOnMount"];
};

const SearchOptions: ReadonlyArray<Option<ProductPromotionSearchType>> = [
  {
    value: "NAME",
    text: i`Product Name`,
  },
  {
    value: "SKU",
    text: i`Product SKU`,
  },
  {
    value: "ID",
    text: i`Product ID`,
  },
];

const Placeholders: { [searchType in ProductPromotionSearchType]: string } = {
  ID: i`Enter a product id`,
  NAME: i`Search for a product`,
  SKU: i`Enter a product sku`,
};

const ProductSearchBar: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    searchType,
    onSelectSearchType,
    query,
    searchDebugValues,
    onUpdateQuery,
    disabled,
    focusOnMount,
  } = props;

  return (
    <TextInputWithSelect
      style={[className, style]}
      selectProps={{
        selectedValue: searchType,
        options: SearchOptions,
        onSelected: onSelectSearchType,
        disabled,
      }}
      textInputProps={{
        icon: searchImg,
        placeholder: Placeholders[searchType],
        noDuplicateTokens: true,
        maxTokens: 1,
        value: query,
        onChange: onUpdateQuery,
        debugValue: searchDebugValues[searchType],
        disabled,
        focusOnMount,
      }}
    />
  );
};

export default observer(ProductSearchBar);
