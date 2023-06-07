import { useQuery } from "@apollo/client";
import { LoadingIndicator, Option, SimpleSelect } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Constants, useTreeVersion } from "@core/taxonomy/constants";
import {
  TaxonomyCategoryRequestData,
  TaxonomyCategoryResponseData,
  TAXONOMY_CATEGORY_QUERY,
} from "@core/taxonomy/toolkit";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";

type Props = BaseProps & {
  readonly onSelect?: (l1CategoryId: string | null) => void;
  readonly l1CategoryId?: string | null;
  readonly overrideTreeVersion?: string;
};

const TaxonomyL1CategoryDropdown: React.FC<Props> = ({
  className,
  style,
  onSelect,
  l1CategoryId,
  overrideTreeVersion,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  useEffect(() => {
    setSelectedOption(l1CategoryId || null);
  }, [l1CategoryId]);

  const { version: treeVersion, loading: treeVersionLoading } =
    useTreeVersion();

  const { data, loading } = useQuery<
    TaxonomyCategoryResponseData,
    TaxonomyCategoryRequestData
  >(TAXONOMY_CATEGORY_QUERY, {
    variables: {
      treeVersion:
        overrideTreeVersion || treeVersion || Constants.TAXONOMY.treeVersion,
      categoryId: Constants.TAXONOMY.rootCategoryId,
    },
    skip:
      overrideTreeVersion == null &&
      (treeVersion == null || treeVersionLoading),
  });

  const dropdownOptions =
    data?.taxonomy?.category?.categoryChildren?.map<Option<string>>((l1) => {
      return {
        text: l1.name,
        value: l1.id,
      };
    }) || [];

  return (
    <LoadingIndicator loadingComplete={!loading}>
      <SimpleSelect
        showArrow
        placeholder={i`Select Overall Category`}
        style={[className, style, { padding: 5 }]}
        onSelected={(value: string | undefined) => {
          setSelectedOption(value ?? null);
          onSelect && onSelect(value ?? null);
        }}
        options={dropdownOptions}
        selectedValue={selectedOption}
        data-cy="select-l1-category"
      />
    </LoadingIndicator>
  );
};

export default observer(TaxonomyL1CategoryDropdown);
