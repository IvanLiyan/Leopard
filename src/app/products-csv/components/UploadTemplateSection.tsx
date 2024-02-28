import React, { useMemo, useState } from "react";
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
import { useMutation } from "@apollo/client";
import {
  UPSERT_PRODUCT_CSV_MUTATION,
  UpsertProductCsvRequestType,
  UpsertProductCsvResponseType,
} from "@products-csv/queries";
import { useToastStore } from "@core/stores/ToastStore";
import { merchFeUrl } from "@core/toolkit/router";
import SomethingWentWrongText from "@core/components/SomethingWentWrongText";

const UploadTemplateSection: React.FC = () => {
  const { textDark, textWhite, negative } = useTheme();
  const toastStore = useToastStore();
  const [uploadType, setUploadType] = useState<
    UploadTemplateType | undefined
  >();
  const [attachments, setAttachments] = useState<ReadonlyArray<AttachmentInfo>>(
    [],
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const uploadTypeOptions = Object.entries(UPLOAD_TEMPLATE_NAMES).map(
    ([type, text]) => ({
      value: type as UploadTemplateType,
      text,
    }),
  );

  const [upsertProductCsv] = useMutation<
    UpsertProductCsvResponseType,
    UpsertProductCsvRequestType
  >(UPSERT_PRODUCT_CSV_MUTATION);

  const errorMessage = useMemo(() => {
    if (uploadType == null) {
      return i`Please select a template`;
    } else if (attachments.length === 0) {
      return i`Please upload a template`;
    }
    return undefined;
  }, [attachments.length, uploadType]);

  const onUpload = async () => {
    try {
      setShowError(true);
      setIsUploading(true);
      if (attachments.length === 0 || uploadType == null) {
        return;
      }

      const resp = await upsertProductCsv({
        variables: {
          input: {
            fileUrl: attachments[0].url,
            feedType: uploadType,
            columnIdList: [],
          },
        },
      });

      const jobId = resp.data?.productCatalog.upsertProductCsvFile?.jobId;
      const message = resp.data?.productCatalog.upsertProductCsvFile?.message;
      const ok = resp.data?.productCatalog.upsertProductCsvFile?.ok;
      if (jobId == null || !ok) {
        toastStore.negative(
          <SomethingWentWrongText>{message}</SomethingWentWrongText>,
        );
        return;
      }

      toastStore.positive(
        i`Success! You will receive an email when your update is ready for review. ` +
          i`[Return to Product Listing Feed Status](${merchFeUrl(
            "/md/products/csv-history",
          )})`,
      );
      setAttachments([]);
      setUploadType(undefined);
      setShowError(false);
    } catch {
      toastStore.negative(<SomethingWentWrongText />);
    } finally {
      setIsUploading(false);
    }
  };

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
        borderColor={showError && uploadType == null ? negative : undefined}
        data-cy="select-upload-template"
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
        }}
        maxRows={30000}
        data-cy="input-csv"
      />
      {showError && errorMessage != null && (
        <Text sx={{ color: negative, marginTop: "24px" }}>{errorMessage}</Text>
      )}
      <Button
        primary
        disabled={isUploading}
        sx={{
          marginTop: showError && errorMessage != null ? "8px" : "24px",
        }}
        onClick={() => void onUpload()}
        startIcon={<Icon name="uploadCloud" color={textWhite} />}
        data-cy="button-upload-csv"
      >
        {ci18n("Button text", "Upload file")}
      </Button>
    </div>
  );
};

export default observer(UploadTemplateSection);
