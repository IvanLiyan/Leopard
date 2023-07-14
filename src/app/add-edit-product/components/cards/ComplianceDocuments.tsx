// based on src/app/add-edit-product/components/ImageUploadGroup.tsx, if we use a similar component again consider generalizing
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import Dropzone, {
  DropzoneState,
  FileError,
  FileRejection,
} from "react-dropzone";

/* Lego */
import {
  Layout,
  Text,
  DeleteButton,
  LoadingIndicator,
} from "@ContextLogic/lego";

/* Stores */
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import Icon from "@core/components/Icon";
import { upload } from "@core/toolkit/uploads";
import { Text as AtlasText, TextField } from "@ContextLogic/atlas-ui";
import {
  ACCEPTED_FILETYPES,
  MAX_FILENAME_LENGTH,
  MAX_FILES,
  MAX_SIZE_IN_MB,
  Document,
  PendingDocument,
  useComplianceDocumentsContext,
} from "@add-edit-product/compliance-documents/ComplianceDocumentsContext";
import { EXISTING_COMPLIANCE_DOCUMENTS } from "@add-edit-product/compliance-documents/complianceDocumentsQueries";
import { useProductId } from "@add-edit-product/toolkit";
import { useLazyQuery } from "@apollo/client";

const FilenameRegex = /^[a-zA-Z0-9-_.]+$/;

type ErrorCode =
  | "too-many-files"
  | "file-invalid-type"
  | "file-too-large"
  | "filename-too-long"
  | "filename-invalid-characters";

const ErrorCodeMessages: { readonly [code in ErrorCode]: string } = {
  "file-too-large": i`Please upload files less then ${MAX_SIZE_IN_MB}MB`,
  "too-many-files": i`Please upload fewer then ${MAX_FILES} files`,
  "file-invalid-type": i`Please upload a ${Object.values(ACCEPTED_FILETYPES)
    .flat()
    .join(", ")
    .replace(".", "")} file`,
  "filename-too-long": i`Filenames must be less than ${MAX_FILENAME_LENGTH} characters`,
  "filename-invalid-characters": i`Filenames must include only alphanumeric characters, -, and _`,
};

const validator = (file: File): FileError | FileError[] | null => {
  if (file.name.length > MAX_FILENAME_LENGTH) {
    return {
      code: "filename-too-long",
      message: "", // messages are handled via ErrorCodeMessages
    };
  }

  if (file.name.search(FilenameRegex) === -1) {
    return {
      code: "filename-invalid-characters",
      message: "", // messages are handled via ErrorCodeMessages
    };
  }

  return null;
};

const OptionalDocumentationUpload: React.FC = () => {
  const { textDark } = useTheme();
  const {
    state: { pendingDocuments, documents, hasAttemptedSave },
    dispatch,
  } = useComplianceDocumentsContext();

  const dataCy = "compliance-documents";
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [productId] = useProductId();

  const [loadExistingDocuments, { called, loading }] = useLazyQuery(
    EXISTING_COMPLIANCE_DOCUMENTS,
    {
      variables: {
        id: productId,
      },
    },
  );

  useEffect(() => {
    const effect = async () => {
      const resp = await loadExistingDocuments({
        variables: { id: productId },
      });

      const existingDocuments =
        resp.data?.productCatalog?.product?.productComplianceDocuments;
      existingDocuments &&
        dispatch({
          type: "INITIALIZE_EXISTING_DOCUMENTS",
          existingDocuments,
        });
    };

    if (!called && productId != null && productId.trim().length !== 0) {
      void effect();
    }
  }, [called, dispatch, loadExistingDocuments, productId]);

  const [hoveredDocumentUrl, setHoveredDocumentUrl] = useState<
    string | undefined
  >();

  const documentCount = useMemo(
    () =>
      pendingDocuments.length + documents.filter((doc) => !doc.deleted).length,
    [pendingDocuments, documents],
  );
  const showDocuments = documentCount > 0;
  const showDropZone = MAX_FILES !== documentCount;

  const onDropRejected = (fileRejections: ReadonlyArray<FileRejection>) => {
    const errorCodes = new Set<ErrorCode>();
    fileRejections.forEach(
      (rejection) =>
        rejection.errors.forEach(({ code }) =>
          errorCodes.add(code as ErrorCode),
        ), // invariant
    );
    toastStore.error(
      Array.from(errorCodes)
        .map((code) => ErrorCodeMessages[code])
        .join("\n\n"),
    );
  };

  const onDropAccepted = async (acceptedFiles: ReadonlyArray<File>) => {
    for (const file of acceptedFiles) {
      const ext = file.name.split(".").slice(-1)[0].toLowerCase();

      const pendingDocument: PendingDocument = {
        fileExtension: ext,
        id: new Date().getTime(),
        fileName: file.name,
      };

      dispatch({ type: "ADD_PENDING_DOCUMENT", pendingDocument });

      const response = await upload(file, {
        bucket: "TEMP_UPLOADS_V2",
        filename: file.name,
        contentType: file.type,
      });
      const sourceUrl = response?.downloadUrl;
      if (sourceUrl == null) {
        dispatch({ type: "REMOVE_PENDING_DOCUMENT", pendingDocument });
        return;
      }

      dispatch({ type: "UPLOAD_COMPLETED", pendingDocument, sourceUrl });
    }
  };

  const renderDropzone = ({ getRootProps, isDragActive }: DropzoneState) => {
    return (
      <Layout.FlexColumn
        style={[styles.dropzone, { opacity: isDragActive ? 0.3 : 1 }]}
        alignItems="center"
        {...getRootProps()}
      >
        <Text style={styles.title}>
          Drop documents here to upload, or click to select files
        </Text>
      </Layout.FlexColumn>
    );
  };

  const renderPendingDocument = (pendingDocument: PendingDocument) => {
    return (
      <Layout.FlexColumn key={pendingDocument.id}>
        <Layout.FlexRow
          style={styles.cell}
          key={`pending_document_${pendingDocument.fileName}`}
          alignItems="center"
          justifyContent="center"
        >
          <LoadingIndicator type="spinner" size={36} />
        </Layout.FlexRow>
        <TextField disabled />
      </Layout.FlexColumn>
    );
  };

  const renderDocument = (document: Document) => {
    if (document.deleted) {
      return null;
    }

    const isHovered = hoveredDocumentUrl == document.sourceUrl;
    const error =
      (document.dirty || hasAttemptedSave) &&
      (document.documentLabel == null || document.documentLabel === "");

    return (
      <Layout.FlexColumn key={document.sourceUrl}>
        <Layout.FlexColumn
          style={styles.cell}
          alignItems="center"
          justifyContent="center"
          onMouseEnter={() => setHoveredDocumentUrl(document.sourceUrl)}
          onMouseLeave={() => setHoveredDocumentUrl(undefined)}
          key={document.sourceUrl}
          data-cy={`${dataCy}-cell`}
        >
          <Icon name="file" color={textDark} />
          <AtlasText
            variant="bodyS"
            component="div"
            color={textDark}
            sx={{
              marginTop: "4px",
              width: "calc(100% - 18px)",
              wordWrap: "break-word",
              textAlign: "center",
            }}
          >
            {document.fileName}
          </AtlasText>
          <DeleteButton
            style={[
              styles.deleteButton,
              styles.disableRipple,
              styles.hoverable,
              isHovered && styles.hovered,
            ]}
            onClick={() => {
              dispatch({ type: "REMOVE_DOCUMENT", document });
            }}
            data-cy={`${dataCy}-button-delete-${document.fileName}`}
          />
        </Layout.FlexColumn>
        <TextField
          placeholder={i`Document label`}
          value={document.documentLabel}
          onChange={(e) => {
            dispatch({
              type: "UPDATE_TEXT",
              document,
              documentLabel: e.target.value,
            });
          }}
          error={error}
          helperText={error && i`A document label is required`}
          // due to BE limitations we can't currently update the document label
          // of existing docs. since the FE logic is in and tested, we just
          // disable the field for now so we can easily enable it once BE has
          // added the functionality in the future
          disabled={document.onServer}
        />
      </Layout.FlexColumn>
    );
  };

  return (
    <Layout.FlexColumn>
      <style jsx>{`
        div {
          display: grid;
          grid-gap: 10px;
          grid-template-columns: repeat(auto-fit, 223.75px);
          margin-bottom: 10px;
        }
      `}</style>
      <div>
        {showDocuments && documents.map((document) => renderDocument(document))}
        {showDocuments &&
          pendingDocuments.map((document) => renderPendingDocument(document))}
      </div>
      {showDropZone && (
        <Dropzone
          accept={ACCEPTED_FILETYPES}
          onDropRejected={onDropRejected}
          onDropAccepted={(acceptedFiles) => void onDropAccepted(acceptedFiles)}
          maxSize={MAX_SIZE_IN_MB * 1048576} // convert to bytes
          maxFiles={MAX_FILES - documentCount}
          multiple={documentCount < MAX_FILES - 1}
          data-cy={`${dataCy}-upload`}
          validator={validator}
          disabled={loading}
        >
          {renderDropzone}
        </Dropzone>
      )}
    </Layout.FlexColumn>
  );
};

export default observer(OptionalDocumentationUpload);

const useStylesheet = () => {
  const { surfaceLight, surfaceLighter, textDark, borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        dropzone: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 43,
          borderRadius: 4,
          backgroundColor: surfaceLight,
          border: `solid 1px ${borderPrimary}`,
          transition: "opacity 0.3s linear",
        },
        title: {
          fontSize: 16,
          color: textDark,
          userSelect: "none",
        },
        uploadIcon: {
          marginRight: 8,
        },
        cell: {
          position: "relative",
          border: `solid 1px ${borderPrimary}`,
          borderRadius: 4,
          backgroundColor: surfaceLighter,
          height: 150,
          width: "calc(100% - 2px)",
          marginBottom: 8,
        },
        hoverable: {
          opacity: 0,
          transition: "opacity 0.3s linear",
        },
        hovered: {
          opacity: 1,
        },
        deleteButton: {
          position: "absolute",
          top: 8,
          right: 8,
          ":nth-child(1n) > div": {
            ":after": {
              content: "none",
            },
          },
        },
        disableRipple: {
          // ripple ink uses an :after that causes an inaccurate drag preview
          ":nth-child(1n) > div": {
            ":after": {
              content: "none",
            },
          },
        },
      }),
    [surfaceLight, borderPrimary, textDark, surfaceLighter],
  );
};
