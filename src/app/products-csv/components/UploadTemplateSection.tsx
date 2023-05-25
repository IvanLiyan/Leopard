import React, { useState } from "react";
import { observer } from "mobx-react";
import { AttachmentInfo, FormSelect } from "@ContextLogic/lego";
import { Text, Button } from "@ContextLogic/atlas-ui";
import SecureFileInput from "@core/components/SecureFileInput";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import Icon from "@core/components/Icon";
import {
  UploadTemplateType,
  UPLOAD_TEMPLATE_NAMES,
} from "@products-csv/toolkit";

const UploadTemplateSection: React.FC = () => {
  const { textDark, textWhite } = useTheme();
  const [uploadType, setUploadType] = useState<
    UploadTemplateType | undefined
  >();
  const [attachments, setAttachments] = useState<ReadonlyArray<AttachmentInfo>>(
    [],
  );

  const uploadTypeOptions = Object.entries(UPLOAD_TEMPLATE_NAMES).map(
    ([type, text]) => ({
      value: type as UploadTemplateType,
      text,
    }),
  );

  return (
    <div className="upload-template-root">
      <style jsx>{`
        .upload-template-root {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
        }
      `}</style>
      <FormSelect
        style={{ marginTop: 16, width: 400, boxSizing: "border-box" }}
        options={uploadTypeOptions}
        selectedValue={uploadType}
        placeholder={ci18n("Dropdown placeholder text", "Select a template")}
        onSelected={(value: UploadTemplateType | undefined) =>
          setUploadType(value)
        }
        showArrow
      />
      <Text variant="bodyM" sx={{ color: textDark, marginTop: "16px" }}>
        Deleting unchanged rows will help your products go live faster.
      </Text>
      <Text variant="bodyM" sx={{ color: textDark }}>
        Make sure the file is the CSV format, is less than 50 MB in size, and
        your template has 30k rows or less.
      </Text>
      <SecureFileInput
        bucket="TEMP_UPLOADS_V2"
        accepts=".csv"
        maxSizeMB={50}
        maxAttachments={1}
        attachments={attachments}
        onAttachmentsChanged={(attachments) => setAttachments(attachments)}
        backgroundColor={textWhite}
        style={{
          marginTop: 16,
          width: 400,
          height: 240,
        }}
        maxRows={30000}
      />
      <Button
        primary
        disabled={!uploadType || attachments.length === 0}
        sx={{
          marginTop: "24px",
        }}
        startIcon={<Icon name="uploadCloud" color={textWhite} />}
      >
        {ci18n("Button text", "Upload file")}
      </Button>
    </div>
  );
};

export default observer(UploadTemplateSection);
