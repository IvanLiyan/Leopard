import { LoadingIndicator, Table } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import { Constants, useTreeVersion } from "@core/taxonomy/constants";
import {
  AttributeDataTypeLabel,
  AttributeLevelLabel,
  AttributeUsageLabel,
  CategoryAttributesRequestData,
  CategoryAttributesResponseData,
  CATEGORY_ATTRIBUTES_QUERY,
} from "@core/taxonomy/toolkit";
import { observer } from "mobx-react";
import React from "react";
import { useQuery } from "@apollo/client";

type Props = BaseProps & {
  readonly categoryId: number;
};

type TableData = {
  readonly name: string;
  readonly level: string;
  readonly usage: string;
  readonly dataType: string;
  readonly description: string;
  readonly validValues: string;
};

const AttributesTable: React.FC<Props> = ({
  className,
  style,
  categoryId,
}: Props) => {
  const { version: treeVersion, loading: treeVersionLoading } =
    useTreeVersion();

  const { data, loading } = useQuery<
    CategoryAttributesResponseData,
    CategoryAttributesRequestData
  >(CATEGORY_ATTRIBUTES_QUERY, {
    variables: {
      categoryId,
      treeVersion: treeVersion || Constants.TAXONOMY.treeVersion,
    },
    skip: treeVersion == null || treeVersionLoading,
  });

  const tableData = data?.taxonomy?.attributes?.map((attr): TableData => {
    return {
      name: attr.name,
      level: attr.isVariationAttribute
        ? AttributeLevelLabel.ATTRIBUTE_LEVEL_VARIANT
        : AttributeLevelLabel.ATTRIBUTE_LEVEL_PRODUCT,
      usage: AttributeUsageLabel[attr.usage],
      dataType: AttributeDataTypeLabel[attr.dataType],
      description: attr.description,
      validValues: attr.values?.map((attr) => attr.value).join(", ") || "",
    };
  });

  return (
    <LoadingIndicator loadingComplete={!loading}>
      <Table style={[className, style]} data={tableData} highlightRowOnHover>
        <Table.Column
          title={ci18n("Column title, name of the category attribute", "Name")}
          _key="name"
          columnKey="name"
        />
        <Table.Column
          title={ci18n(
            "Column title, whether the attribute is product-level or variant-level",
            "Level",
          )}
          _key="level"
          columnKey="level"
        />
        <Table.Column
          title={ci18n(
            "Column title, whether the attribute is required, recommended or optional",
            "Usage",
          )}
          _key="usage"
          columnKey="usage"
        />
        <Table.Column
          title={ci18n(
            "Column title, data type of the category attribute",
            "Data Type",
          )}
          _key="dataType"
          columnKey="dataType"
        />
        <Table.Column
          title={ci18n(
            "Column title, description of the category attribute",
            "Description",
          )}
          multiline
          _key="description"
          columnKey="description"
        />
        <Table.Column
          title={ci18n(
            "Column title, list of accepted values for the category attribute",
            "Accepted Values",
          )}
          multiline
          _key="validValues"
          columnKey="validValues"
        />
      </Table>
    </LoadingIndicator>
  );
};

export default observer(AttributesTable);
