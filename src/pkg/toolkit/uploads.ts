import gql from "graphql-tag";
import ApolloStore from "@stores/ApolloStore";
import ToastStore from "@stores/ToastStore";

import {
  InitiateUploadInput,
  InitiateUploadMutation,
  UploadMutationsInitiateUploadArgs,
} from "@schema/types";

const INITIATE_UPLOAD = gql`
  mutation Toolkit_InitialUpload($input: InitiateUploadInput!) {
    uploads {
      initiateUpload(input: $input) {
        ok
        message
        uploadUrl
        uploadHeaders
        downloadUrl
      }
    }
  }
`;

type PickedInitiateUploadMutation = Pick<
  InitiateUploadMutation,
  "ok" | "message" | "downloadUrl" | "uploadHeaders" | "uploadUrl"
>;

type ResponseType = {
  readonly uploads: {
    readonly initiateUpload: PickedInitiateUploadMutation;
  };
};

export const readFile = (file: File): Promise<Blob | undefined> => {
  return new Promise<Blob | undefined>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result == null) {
        reject();
      } else {
        const blob = new Blob([reader.result.toString()], {
          type: file.type,
        });
        resolve(blob);
      }
    };

    reader.onerror = () => {
      reject();
    };

    reader.readAsText(file);
  });
};

export type UploadResponse = Pick<InitiateUploadMutation, "downloadUrl">;

export const upload = async (
  file: File,
  input: InitiateUploadInput,
): Promise<Pick<InitiateUploadMutation, "downloadUrl"> | undefined> => {
  const { client } = ApolloStore.instance();
  const toastStore = ToastStore.instance();
  const { data } = await client.mutate<
    ResponseType,
    UploadMutationsInitiateUploadArgs
  >({
    mutation: INITIATE_UPLOAD,
    variables: { input },
  });
  if (data == null) {
    toastStore.negative(i`Something went wrong`);
    return;
  }
  const {
    uploads: {
      initiateUpload: { ok, message, uploadUrl, uploadHeaders, downloadUrl },
    },
  } = data;

  if (
    !ok ||
    uploadUrl == null ||
    uploadHeaders == null ||
    downloadUrl == null
  ) {
    toastStore.negative(message || i`Something went wrong`);
    return;
  }

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: JSON.parse(uploadHeaders),
  });

  return {
    downloadUrl,
  };
};
