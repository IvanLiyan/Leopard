import React from "react";
import { useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import { FormSelect, Layout, Ul } from "@ContextLogic/lego";
import { useTheme } from "@core/stores/ThemeStore";
import { Card, Heading, Text } from "@ContextLogic/atlas-ui";
import {
  EDIT_DOWNLOAD_TEMPLATE_INFOS,
  EDIT_DOWNLOAD_TEMPLATE_NAMES,
  DownloadTemplateType,
  EditDownloadTemplateType,
} from "@products-csv/toolkit";
import {
  MERCHANT_CONSIGNMENT_MODE_QUERY,
  GetConsignmentModeResponseType,
} from "../queries";

type EditTemplateSelectProps = {
  readonly selectedType: EditDownloadTemplateType | undefined;
  readonly onSelect: (type: DownloadTemplateType) => unknown;
};

const EditTemplateSelect: React.FC<EditTemplateSelectProps> = ({
  selectedType,
  onSelect,
}: EditTemplateSelectProps) => {
  const { textDark } = useTheme();

  const { data: initialData } = useQuery<GetConsignmentModeResponseType>(
    MERCHANT_CONSIGNMENT_MODE_QUERY,
    {
      variables: {},
    },
  );

  const isConsignmentMode = initialData?.currentMerchant?.isConsignmentMode;

  const EDIT_DOWNLOAD_TEMPLATE_NAMES_LOCAL: Partial<
    typeof EDIT_DOWNLOAD_TEMPLATE_NAMES
  > = EDIT_DOWNLOAD_TEMPLATE_NAMES;

  if (isConsignmentMode === false) {
    delete EDIT_DOWNLOAD_TEMPLATE_NAMES_LOCAL["EDIT_CONSIGNMENT_INFO"];
  }

  const downloadTypeOptions = Object.entries(
    EDIT_DOWNLOAD_TEMPLATE_NAMES_LOCAL,
  ).map(([type, text]) => ({
    value: type as EditDownloadTemplateType,
    text,
  }));

  const templateInfos = selectedType
    ? EDIT_DOWNLOAD_TEMPLATE_INFOS[selectedType]
    : undefined;

  return (
    <div className="edit-template-select-root">
      <style jsx>{`
        .edit-template-select-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: flex-start;
          align-items: stretch;
          width: 400px;
        }
      `}</style>
      <Heading variant="h4">Select a template</Heading>
      <FormSelect
        options={downloadTypeOptions}
        selectedValue={selectedType}
        onSelected={(value: DownloadTemplateType) => onSelect(value)}
        data-cy="select-edit-template"
        showArrow
      />
      {templateInfos && (
        <Card sx={{ padding: "24px" }} borderRadius="md">
          <Layout.FlexColumn style={{ gap: 10 }}>
            <Heading variant="h4">{templateInfos.title}</Heading>
            <Text style={{ color: textDark }}>{templateInfos.description}</Text>
            {templateInfos.fieldNames.length > 0 && (
              <Ul>
                {templateInfos.fieldNames.map((field) => (
                  <Ul.Li key={field}>
                    <Text variant="bodyMStrong">{field}</Text>
                  </Ul.Li>
                ))}
              </Ul>
            )}
          </Layout.FlexColumn>
        </Card>
      )}
    </div>
  );
};

export default observer(EditTemplateSelect);
