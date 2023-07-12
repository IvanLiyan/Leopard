import { useMutation } from "@apollo/client";
import { UPDATE_COMPLIANCE_DOCUMENTS } from "./complianceDocumentsQueries";
import {
  DocumentLabelRegex,
  useComplianceDocumentsContext,
} from "./ComplianceDocumentsContext";
import { useToastStore } from "@core/stores/ToastStore";
import { SOMETHING_WENT_WRONG_TEXT } from "@core/components/SomethingWentWrongText";

export const useUpdateComplianceDocuments = () => {
  const toastStore = useToastStore();
  const [updateComplianceDocumentsMutation, mutationStatus] = useMutation(
    UPDATE_COMPLIANCE_DOCUMENTS,
  );
  const {
    state: { documents },
  } = useComplianceDocumentsContext();

  const updateComplianceDocuments = async ({
    productId,
  }: {
    productId: string;
  }) => {
    const input = documents
      .filter(
        (cur) =>
          !(
            (cur.onServer && !cur.dirty && !cur.deleted) ||
            (!cur.onServer && cur.deleted)
          ),
      )
      .map((cur) => ({
        fileName: cur.fileName,
        fileExtension: cur.fileExtension,
        sourceUrl: cur.sourceUrl,
        productId,
        documentLabel: cur.documentLabel || "", // invariant: handled prior to call
        delete: cur.deleted,
      }));
    try {
      const resp = await updateComplianceDocumentsMutation({
        variables: { input },
      });
      if (!resp.data?.productCatalog?.uploadProductComplianceDocument?.ok) {
        toastStore.negative(
          resp.data?.productCatalog?.uploadProductComplianceDocument?.failure,
        );
      }
    } catch {
      toastStore.negative(SOMETHING_WENT_WRONG_TEXT);
    }
  };

  return [updateComplianceDocuments, mutationStatus] as const;
};

export const useVerifyComplianceDocuments = (): (() => boolean) => {
  const {
    state: { documents },
    dispatch,
  } = useComplianceDocumentsContext();

  return () => {
    dispatch({ type: "ATTEMPT_SAVE" });

    return documents.every(
      (doc) => doc.documentLabel && DocumentLabelRegex.test(doc.documentLabel),
    );
  };
};
