import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import Modal from "@merchant/component/core/modal/Modal";
import { ObjectId } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

/* Merchant API */
import * as productApi from "@merchant/api/product";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { LightProductDict } from "@merchant/api/product";

type RemoveProductConfirmationModalContentProps = BaseProps & {
  readonly productId: string;
  readonly formatedFine: string;
};

@observer
class RemoveProductConfirmationModalContent extends Component<
  RemoveProductConfirmationModalContentProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
        fontFamily: fonts.proxima,
      },
      tip: {
        marginBottom: 10,
      },
      alert: {
        marginBottom: 10,
      },
      title: {
        display: "flex",
        margin: "25px 0px",
        fontSize: 20,
        fontWeight: fonts.weightSemibold,
      },
      infoBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        maxWidth: "50%",
      },
      productNameIdContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flex: 2,
        marginLeft: 10,
      },
      productImgContainer: {
        flex: 1,
        display: "flex",
        alignItems: "center",
      },
      productId: {
        display: "flex",
      },
      productName: {
        display: "flex",
        marginBottom: 10,
      },
    });
  }

  @computed
  get request() {
    const { productId } = this.props;
    return productApi.getMultiLight({ pids: productId });
  }

  @computed
  get product(): LightProductDict | null | undefined {
    const result = this.request.response?.data?.results[0];
    return result ? result : null;
  }

  render() {
    const { product } = this;
    if (product == null) {
      return <LoadingIndicator />;
    }

    return (
      <div className={css(this.styles.root)}>
        <Tip
          className={css(this.styles.tip)}
          color={palettes.coreColors.WishBlue}
          icon="tip"
        >
          Once removed, you will not be able to reverse the removal action.
        </Tip>
        <div className={css(this.styles.title)}>
          Are you sure you would like to remove this product and its variations?
        </div>
        <div className={css(this.styles.infoBox)}>
          <div className={css(this.styles.productImgContainer)}>
            <ProductImage productId={product.id} />
          </div>
          <div className={css(this.styles.productNameIdContainer)}>
            <div className={css(this.styles.productName)}>{product.name}</div>
            <div className={css(this.styles.productId)}>
              <ObjectId id={product.id} showFull />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class RemoveProductConfirmationModal extends Modal {
  productId: string;
  formatedFine: string;

  constructor(infoArray: ReadonlyArray<string>, onRemove: () => unknown) {
    super(() => null);
    this.productId = infoArray[0];
    this.formatedFine = infoArray[1];
    this.setHeader({ title: i`Remove Product` });
    this.setRenderFooter(() => (
      <ModalFooter
        action={{
          text: i`Remove this Product`,
          onClick: async () => {
            const param = {
              pid: this.productId,
            };
            const response = await productApi.removeProduct(param).call();

            const { toastStore } = AppStore.instance();
            if (response.code === 0) {
              onRemove();
              toastStore.positive(i`Your product has been removed!`);
              this.close();
            } else {
              const { msg } = response;
              if (msg) {
                toastStore.error(msg);
              }
            }
          },
        }}
        layout="vertical"
        cancel={{
          children: i`Cancel`,
          onClick: () => this.close(),
        }}
      />
    ));
    this.setWidthPercentage(0.5);
  }

  renderContent() {
    return (
      <RemoveProductConfirmationModalContent
        productId={this.productId}
        formatedFine={this.formatedFine}
      />
    );
  }
}
