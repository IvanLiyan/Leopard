/* eslint-disable filenames/match-regex */

import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { RichTextBanner } from "@ContextLogic/lego";

/* Relative Imports */
import SEWishPostShippingProvidersTable from "./SEWishPostShippingProvidersTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type SEWishPostShippingProvidersModalProps = BaseProps & {
  readonly closeModal: () => unknown;
  readonly wishPostServices: ReadonlyArray<string>;
};

const SEWishPostShippingProvidersModalContent = (
  props: SEWishPostShippingProvidersModalProps
) => {
  const { wishPostServices } = props;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <RichTextBanner
        sentiment="warning"
        title={
          i`WishPost is the only accepted shipping carrier ` +
          i`for orders shipped from Mainland China.`
        }
        description={
          i`Please select one of the following qualified ` +
          i`WishPost logistics channels for destination country Sweden.`
        }
      />
      <SEWishPostShippingProvidersTable shippingProviders={wishPostServices} />
    </div>
  );
};

export class SEWishPostShippingProvidersModal extends Modal {
  props: SEWishPostShippingProvidersModalProps;
  constructor(props: SEWishPostShippingProvidersModalProps) {
    super(() => null);
    this.props = props;
    this.setHeader({ title: i`WishPost` });
    this.setNoMaxHeight(false);
    this.setWidthPercentage(0.6);
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return <SEWishPostShippingProvidersModalContent {...this.props} />;
  }
}
