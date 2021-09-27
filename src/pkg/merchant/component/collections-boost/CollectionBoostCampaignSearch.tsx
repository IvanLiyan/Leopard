import React, { useMemo } from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { TextInputWithSelect } from "@ContextLogic/lego";

/* SVGs */
import searchImg from "@assets/img/search.svg";

/* Type Imports */
import { CampaignSearchType } from "@merchant/api/collections-boost";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";

export type CollectionSearchProps = BaseProps & {
  readonly searchType: CampaignSearchType;
  readonly searchInput: string;
  readonly onSearchTypeChange: (arg: CampaignSearchType) => void;
  readonly onSearchInputChange: (arg: string) => void;
};

type SelectOption = {
  readonly value: CampaignSearchType;
  readonly text: string;
};

const CollectionBoostCampaignSearch = (props: CollectionSearchProps) => {
  const {
    searchType,
    searchInput,
    onSearchTypeChange,
    onSearchInputChange,
  } = props;
  const selectOptions = useSelectOptions();

  const searchTypeName = selectOptions.find(
    (option) => option.value === searchType
  )?.text;

  return (
    <TextInputWithSelect
      selectProps={{
        selectedValue: searchType,
        options: selectOptions,
        onSelected: onSearchTypeChange,
      }}
      textInputProps={{
        icon: searchImg,
        placeholder: i`Search for ${searchTypeName}`,
        onChange: ({ text }: OnTextChangeEvent) => {
          onSearchInputChange(text);
        },
        style: { minWidth: "20vw" },
        value: searchInput,
      }}
    />
  );
};

export default observer(CollectionBoostCampaignSearch);

const useSelectOptions = () =>
  useMemo((): ReadonlyArray<SelectOption> => {
    return [
      {
        value: "campaign_id",
        text: i`Campaign ID`,
      },
      {
        value: "product_id",
        text: i`Product ID`,
      },
      {
        value: "collection_name",
        text: i`Collection Name`,
      },
    ];
  }, []);
