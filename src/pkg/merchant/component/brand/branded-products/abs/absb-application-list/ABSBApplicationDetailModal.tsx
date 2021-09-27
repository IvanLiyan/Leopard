import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Markdown } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Imports */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Relative Imports */
import ABSBApplicationDetailModalContent, {
  ABSBApplicationDetailModalProps,
} from "./ABSBApplicationDetailModalContent";

/* Type Imports */
import { ABSBBrandApplication } from "@toolkit/brand/branded-products/abs";

export default class ABSBApplicationDetailModal extends Modal {
  props: ABSBApplicationDetailModalProps;

  get styles() {
    return StyleSheet.create({
      doneBtn: {
        minWidth: 240,
        minHeight: 32,
        fontSize: 16,
      },
    });
  }

  constructor(props: ABSBApplicationDetailModalProps) {
    super(() => null);

    const brandName = props.brandApp.brand_name;
    const index = (props.appIndex || 0) + 1;
    const total = props.brandApp.applications.length;

    let title = i`**${brandName}** Application Details`;
    if (props.brandApp.applications.length > 1) {
      title += i` (${index} of ${total})`;
    }

    this.setHeader({
      title: () => (
        <Markdown
          text={title}
          style={css({ fontWeight: fonts.weightNormal })}
        />
      ),
    });

    this.setRenderFooter(() => (
      <ModalFooter
        action={{
          text: i`Done`,
          onClick: () => {
            this.close();
          },
          className: css(this.styles.doneBtn),
        }}
        layout="horizontal-centered"
      />
    ));

    this.props = props;
    this.noMaxHeight = true;

    const { dimenStore } = AppStore.instance();
    const targetPercentage = 980 / dimenStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return (
      <ABSBApplicationDetailModalContent
        {...this.props}
        closeModal={() => this.close()}
        renderModal={renderABSBApplicationDetailModal}
      />
    );
  }
}

export const renderABSBApplicationDetailModal = (
  brandApp: ABSBBrandApplication,
  appIndex?: number
) => {
  new ABSBApplicationDetailModal({
    brandApp,
    appIndex,
  }).render();
};
