import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import AddDemoModalScreens from "./AddDemoModalScreens";

import { PickedProductType } from "@toolkit/products/demo-video";

export type AddDemoModalProps = {
  readonly product: PickedProductType;
  readonly onCloseModal: () => Promise<unknown>;
};

export default class AddDemoModal extends Modal {
  constructor({ product, onCloseModal }: AddDemoModalProps) {
    super(() => (
      <AddDemoModalScreens
        product={product}
        onClose={async () => {
          await onCloseModal();
          this.close();
        }}
      />
    ));

    this.setHeader({
      title:
        product.demoVideo != null ? i`Update demo video` : i`Add a demo video`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.75);
    this.maxHeight = 628;
  }
}
