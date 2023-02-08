import React from "react";
import { upload } from "@core/toolkit/uploads";
import { ClientWritableBucket } from "@schema";
import {
  FileInput,
  FileInputProps,
  FileUploadOptions,
  FileUploadResponse,
} from "@ContextLogic/lego";

export type SecureFileInputProps = Omit<
  FileInputProps,
  "onUpload" | "bucket"
> & {
  readonly bucket: ClientWritableBucket;
};

const SecureFileInput: React.FC<SecureFileInputProps> = (
  props: SecureFileInputProps,
) => {
  const doUpload = async (
    file: File,
    options: FileUploadOptions,
  ): Promise<FileUploadResponse | undefined> => {
    const response = await upload(file, {
      ...options,
      bucket: options.bucket as ClientWritableBucket,
    });
    const downloadUrl = response?.downloadUrl;
    if (downloadUrl == null) {
      return;
    }
    return {
      downloadUrl,
    };
  };
  return <FileInput {...props} onUpload={doUpload} />;
};

export default SecureFileInput;
