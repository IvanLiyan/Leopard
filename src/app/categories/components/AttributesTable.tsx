import { LoadingIndicator, Table } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import {
  AttributeDataTypeLabel,
  AttributeLevelLabel,
  AttributeUsageLabel,
  CategoryAttributesRequestData,
  CategoryAttributesResponseData,
  CATEGORY_ATTRIBUTES_QUERY,
  AttributeSelectionTypeLabel,
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
  readonly enabledForVariations: boolean;
  readonly usage: string;
  readonly selectionType: string;
  readonly maxSelection?: number;
  readonly dataType: string;
  readonly description: string;
  readonly validValues: string;
};

const NO_DATA_MESSAGE = "-";

const AttributesTable: React.FC<Props> = ({
  className,
  style,
  categoryId,
}: Props) => {
  const { data, loading } = useQuery<
    CategoryAttributesResponseData,
    CategoryAttributesRequestData
  >(CATEGORY_ATTRIBUTES_QUERY, {
    variables: {
      categoryId,
    },
  });

  const tableData = data?.taxonomy?.attributes?.map((attr): TableData => {
    return {
      name: attr.name,
      level: attr.isVariationAttribute
        ? AttributeLevelLabel.ATTRIBUTE_LEVEL_VARIANT
        : AttributeLevelLabel.ATTRIBUTE_LEVEL_PRODUCT,
      enabledForVariations: attr.enabledForVariations,
      usage: AttributeUsageLabel[attr.usage],
      selectionType: AttributeSelectionTypeLabel[attr.mode],
      maxSelection:
        attr.mode === "ATTRIBUTE_MODE_MULTI_SELECTION_ONLY"
          ? attr.maxMultiSelect
          : attr.mode === "ATTRIBUTE_MODE_SINGLE_SELECTION_ONLY"
          ? 1
          : undefined,
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
        <Table.BooleanColumn
          title={ci18n(
            "Column title, whether the attribute can be used for grouping varitaions",
            "Enabled for Variations",
          )}
          _key="enabledForVariations"
          columnKey="enabledForVariations"
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
            "Column title, the attribute's selection type, can be single select, multi select, free text",
            "Selection Type",
          )}
          _key="selectionType"
          columnKey="selectionType"
        />
        <Table.NumeralColumn
          title={ci18n(
            "Column title, max number of selections for the attribute",
            "Maximum Selections",
          )}
          noDataMessage={NO_DATA_MESSAGE}
          _key="maxSelection"
          columnKey="maxSelection"
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
