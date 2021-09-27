// @flow
import React, { useState } from "react";
/* External Libraries */
/* Lego Components */
import { TypeaheadInput, TypeaheadInputProps } from "@ContextLogic/lego";

import { OnTextChangeEvent } from "@ContextLogic/lego";
/* Lego Toolkit */
import { search } from "@assets/icons";

/* Merchant Store */
import { useApolloStore } from "@merchant/stores/ApolloStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { observer } from "mobx-react";
import { BrandSchema, BrandServiceSchemaTrueBrandsArgs } from "@schema/types";
import gql from "graphql-tag";

export type TrueBrandObject = Pick<
  BrandSchema,
  "id" | "displayName" | "logoUrl"
>;

type BrandSearchProps = BaseProps &
  Pick<TypeaheadInputProps, "text" | "placeholder" | "inputProps"> & {
    readonly onTextChange: (e: { readonly text: string }) => void;
    readonly onBrandChanged: (item: TrueBrandObject) => unknown;
    readonly validateBrand: (isValid: boolean, text?: string) => unknown;
    readonly setNumBrands?: (numBrands: number) => unknown;
  };

const GET_TRUE_BRANDS_QUERY = gql`
  query BrandSearch_GetTrueBrands(
    $count: Int!
    $offset: Int!
    $queryString: String!
    $sort: BrandSort!
  ) {
    brand {
      trueBrands(
        count: $count
        offset: $offset
        queryString: $queryString
        sort: $sort
      ) {
        id
        displayName
        logoUrl
      }
    }
  }
`;

type GetTrueBrandsRequestType = Pick<
  BrandServiceSchemaTrueBrandsArgs,
  "count" | "offset" | "queryString" | "sort"
>;

type GetTrueBrandsResponseType = {
  readonly brand: {
    readonly trueBrands: ReadonlyArray<TrueBrandObject>;
  };
};

const BrandSearch = (props: BrandSearchProps) => {
  const {
    text,
    onBrandChanged,
    validateBrand,
    placeholder,
    inputProps,
    onTextChange,
    setNumBrands,
  } = props;
  const { client } = useApolloStore();
  const [selected, setSelected] = useState(false);

  const onTextChangeInternal = (e: OnTextChangeEvent) => {
    const { text } = e;
    if (selected) {
      setSelected(false);
    } else {
      validateBrand(false, text);
    }
    onTextChange({ text });
  };

  const onSelectionInternal = (item: TrueBrandObject) => {
    onTextChange({ text: item.displayName });
    onBrandChanged(item);
    validateBrand(true);
    setSelected(true);
  };

  const queryBrands = async (args: {
    query: string;
  }): Promise<ReadonlyArray<TrueBrandObject>> => {
    const query = args.query.trim().toLocaleLowerCase();

    const { data } = await client.query<
      GetTrueBrandsResponseType,
      GetTrueBrandsRequestType
    >({
      query: GET_TRUE_BRANDS_QUERY,
      variables: {
        count: 100,
        offset: 0,
        queryString: query,
        sort: {
          field: "NAME",
          order: "ASC",
        },
      },
    });

    const brands = data?.brand.trueBrands || [];
    setNumBrands && setNumBrands(brands.length);
    return brands;
  };

  return (
    <TypeaheadInput
      text={text}
      onTextChange={(e) => onTextChangeInternal(e)}
      getData={queryBrands}
      onSelection={({ item }) => onSelectionInternal(item)}
      renderItem={({ item: brand }) => brand.displayName}
      inputProps={{
        icon: search,
        placeholder: placeholder || i`Search by brand name (e.g. Adidas)`,
        ...inputProps,
      }}
      delay={500}
    />
  );
};
export default observer(BrandSearch);
