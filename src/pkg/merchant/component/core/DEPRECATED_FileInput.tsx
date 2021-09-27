/* eslint-disable filenames/match-exported */
import React, { useMemo } from "react";

/* Legacy */
import { uploadToS3 } from "@legacy/core/s3";

import {
  FileInput,
  FileInputProps,
  FileUploadOptions,
  FileUploadResponse,
} from "@ContextLogic/lego";

type DEPRECATEDFileInputProps = Omit<FileInputProps, "onUpload" | "bucket"> & {
  // Please do NOT add new buckets to this list. Use `SecureFileInput` component instead.
  readonly bucket: "TEMP_UPLOADS" | "BRAND_LOGO";
};

const DEPRECATEDFileInput: React.FC<DEPRECATEDFileInputProps> = (
  props: DEPRECATEDFileInputProps
) => {
  const { maxSizeMB, bucket, accepts } = props;
  const acceptedDocs = useMemo(() => {
    const formats = accepts.toLowerCase().split(",");
    return formats.some((ext) => !isImage(ext));
  }, [accepts]);
  const doUpload = async (
    file: File,
    options: FileUploadOptions
  ): Promise<FileUploadResponse | undefined> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext == null) {
      return;
    }

    return new Promise<FileUploadResponse>((resolve, reject) => {
      const success = (resp: { data: { image_url: string } }) =>
        resolve({ downloadUrl: resp.data.image_url });
      const failure = (resp: unknown) => reject(resp);
      const bucketMappings: { [key: string]: string } = {
        BRAND_LOGO: "brand-logo",
        TEMP_UPLOADS: "tmp-uploads",
      };
      uploadToS3(
        null,
        success,
        failure,
        ext,
        acceptedDocs,
        file,
        maxSizeMB * 1048576,
        bucketMappings[bucket]
      );
    });
  };
  return <FileInput {...props} onUpload={doUpload} />;
};

const isImage = (ext: string): boolean => {
  return [".jpeg", ".jpg", ".png", ".webp", ".gif"].includes(ext.toLowerCase());
};
export default DEPRECATEDFileInput;
