import React from "react";
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

type EditTemplateSelectProps = {
  readonly selectedType: EditDownloadTemplateType | undefined;
  readonly onSelect: (type: DownloadTemplateType) => unknown;
};

const EditTemplateSelect: React.FC<EditTemplateSelectProps> = ({
  selectedType,
  onSelect,
}: EditTemplateSelectProps) => {
  const { textDark } = useTheme();
  const downloadTypeOptions = Object.entries(EDIT_DOWNLOAD_TEMPLATE_NAMES).map(
    ([type, text]) => ({
      value: type as EditDownloadTemplateType,
      text,
    }),
  );
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
      <Text variant="bodyMStrong">Select a template</Text>
      <FormSelect
        options={downloadTypeOptions}
        selectedValue={selectedType}
        onSelected={(value: DownloadTemplateType) => onSelect(value)}
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
