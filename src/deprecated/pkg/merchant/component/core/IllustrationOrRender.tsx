//
//  IllustrationOrRender.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 7/25/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactNode } from "react";

/* Lego Components */
import Illustration from "./Illustration";

import { IllustrationProps, IllustrationName } from "./Illustration";

export type IllustrationOrRenderProps = Omit<IllustrationProps, "name"> & {
  readonly value?: (IllustrationName | (() => ReactNode)) | null | undefined;
};

export default (props: IllustrationOrRenderProps) => {
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
