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
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type EditTemplateSelectProps = BaseProps & {
  readonly selectedType: EditDownloadTemplateType | undefined;
  readonly onSelect: (type: DownloadTemplateType) => unknown;
};

const EditTemplateSelect: React.FC<EditTemplateSelectProps> = ({
  className,
  style,
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
    <Layout.FlexColumn
      style={[{ gap: 16, width: "400px" }, className, style]}
      alignItems="stretch"
      justifyContent="flex-start"
    >
      <Text variant="bodyMStrong">Select a template</Text>
      <FormSelect
        options={downloadTypeOptions}
        selectedValue={selectedType}
        onSelected={(value: DownloadTemplateType) => onSelect(value)}
        showArrow
      />
      {templateInfos && (
        <Card style={{ padding: 24 }} borderRadius="md">
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
    </Layout.FlexColumn>
  );
};

export default observer(EditTemplateSelect);
