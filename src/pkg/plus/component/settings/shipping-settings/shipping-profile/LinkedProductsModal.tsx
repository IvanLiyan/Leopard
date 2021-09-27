import React from "react";

import { ni18n } from "@legacy/core/i18n";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

import LinkedProducts from "./LinkedProducts";

export type LinkedProductsModalProps = {
  readonly profileId: string;
  readonly linkedProductCount: number;
};
export default class LinkedProductsModal extends Modal {
  constructor({ profileId, linkedProductCount }: LinkedProductsModalProps) {
    super(() => (
      <LinkedProducts profileId={profileId} onClose={() => this.close()} />
    ));

    this.setHeader({
      title: ni18n(
        linkedProductCount,
        "1 linked product",
        "{%1=number of products} linked products",
        linkedProductCount
      ),
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.55);
    this.maxHeight = 624;
  }
}
