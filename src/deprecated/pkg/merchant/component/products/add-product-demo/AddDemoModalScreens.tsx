import React from "react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import UploadVideo from "./modal-screens/UploadVideo";

import { PickedProductType } from "@toolkit/products/demo-video";

export type AddDemoModalScreensProps = BaseProps & {
  readonly product: PickedProductType;
  readonly onClose: () => Promise<unknown>;
};

const AddDemoModalScreens = (props: AddDemoModalScreensProps) => {
  const { className, style, product, onClose } = props;

  return (
    <UploadVideo
      className={css(className, style)}
      onClickBack={onClose}
      onClose={onClose}
      product={product}
    />
  );
};

export default AddDemoModalScreens;
