import { ProductComplianceDocumentSchema } from "@schema";
import { Dispatch, createContext, useContext, useReducer } from "react";

export const MAX_FILES = 15;
export const MAX_SIZE_IN_MB = 10;
export const MAX_FILENAME_LENGTH = 100; // also limited to alphanumeric characters and "-", "_"
export const MAX_LABEL_LENGTH = 40; // also limited to alphanumeric characters and "-", "_"
// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
export const ACCEPTED_FILETYPES = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

export const DocumentLabelRegex = new RegExp(
  `^[a-zA-Z0-9-_]{0,${MAX_LABEL_LENGTH}}$`,
);

export type Document = {
  readonly fileName: string;
  readonly fileExtension: string;
  readonly sourceUrl: string;
  readonly documentLabel: string | null;
  readonly onServer: boolean;
  readonly dirty: boolean;
  readonly deleted: boolean;
};

export type PendingDocument = {
  readonly id: number;
  readonly fileName: string;
  readonly fileExtension: string;
};

type State = {
  readonly documents: ReadonlyArray<Document>;
  readonly pendingDocuments: ReadonlyArray<PendingDocument>;
  readonly hasAttemptedSave: boolean;
};

type Action =
  | {
      readonly type: "ADD_PENDING_DOCUMENT";
      readonly pendingDocument: PendingDocument;
    }
  | {
      readonly type: "REMOVE_PENDING_DOCUMENT";
      readonly pendingDocument: PendingDocument;
    }
  | {
      readonly type: "UPLOAD_COMPLETED";
      readonly pendingDocument: PendingDocument;
      sourceUrl: string;
    }
  | { readonly type: "REMOVE_DOCUMENT"; readonly document: Document }
  | {
      readonly type: "UPDATE_TEXT";
      readonly document: Document;
      readonly documentLabel: string;
    }
  | {
      readonly type: "INITIALIZE_EXISTING_DOCUMENTS";
      readonly existingDocuments: ReadonlyArray<
        Pick<
          ProductComplianceDocumentSchema,
          "fileName" | "fileUrl" | "documentLabel"
        >
      >;
    }
  | { readonly type: "ATTEMPT_SAVE" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_PENDING_DOCUMENT": {
      return {
        ...state,
        pendingDocuments: [...state.pendingDocuments, action.pendingDocument],
      };
    }
    case "REMOVE_PENDING_DOCUMENT": {
      return {
        ...state,
        pendingDocuments: state.pendingDocuments.filter(
          (cur) => cur.id !== action.pendingDocument.id,
        ),
      };
    }
    case "UPLOAD_COMPLETED": {
      return {
        ...state,
        pendingDocuments: state.pendingDocuments.filter(
          (cur) => cur.id !== action.pendingDocument.id,
        ),
        documents: [
          ...state.documents,
          {
            fileName: action.pendingDocument.fileName,
            fileExtension: action.pendingDocument.fileExtension,
            sourceUrl: action.sourceUrl,
            documentLabel: null,
            onServer: false,
            dirty: false,
            deleted: false,
          },
        ],
      };
    }
    case "REMOVE_DOCUMENT": {
      return {
        ...state,
        documents: state.documents.map((cur) =>
          cur.sourceUrl === action.document.sourceUrl
            ? {
                ...cur,
                deleted: true,
              }
            : cur,
        ),
      };
    }
    case "UPDATE_TEXT": {
      return DocumentLabelRegex.test(action.documentLabel)
        ? {
            ...state,
            documents: state.documents.map((cur) =>
              cur.sourceUrl === action.document.sourceUrl
                ? {
                    ...cur,
                    documentLabel: action.documentLabel,
                    dirty: true,
                  }
                : cur,
            ),
          }
        : state;
    }
    case "INITIALIZE_EXISTING_DOCUMENTS": {
      return {
        ...state,
        documents: action.existingDocuments.map((cur) => ({
          fileName: cur.fileName,
          fileExtension: cur.fileName.split(".").slice(-1)[0],
          sourceUrl: cur.fileUrl,
          documentLabel: cur.documentLabel,
          onServer: true,
          dirty: false,
          deleted: false,
        })),
      };
    }
    case "ATTEMPT_SAVE": {
      return {
        ...state,
        hasAttemptedSave: true,
      };
    }
  }
};

const StateContext = createContext<State | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export const useComplianceDocumentsContext = (): {
  state: State;
  dispatch: Dispatch<Action>;
} => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  if (state == null) {
    throw Error("No ComplianceDocumentsStateContext found");
  }
  if (dispatch == null) {
    throw Error("No ComplianceDocumentsDispatchContext found");
  }
  return { state, dispatch };
};

export const ComplianceDocumentsProvider: React.FC<{
  children?: React.ReactNode | undefined;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    documents: [],
    pendingDocuments: [],
    hasAttemptedSave: false,
  });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
