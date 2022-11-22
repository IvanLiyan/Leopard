import React, { ReactNode } from "react";
import Illustration, {
  IllustrationProps,
  IllustrationName,
} from "@core/components/Illustration";

export type IllustrationOrRenderProps = Omit<IllustrationProps, "name"> & {
  readonly value?: (IllustrationName | (() => ReactNode)) | null | undefined;
};

const IllustrationOrRender = (props: IllustrationOrRenderProps) => {
  const { value, ...illustrationProps } = props;
  if (!value) {
    return null;
  }

  return (
    <>
      {typeof value === "function" ? (
        value()
      ) : (
        <Illustration name={value} {...illustrationProps} />
      )}
    </>
  );
};

export default IllustrationOrRender;
