import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Layout } from "@ContextLogic/lego";

/* Model */
import VideoCatalogState from "@merchant/model/products/VideoCatalogState";

/* Relative Impots */
import LinkProductTable from "./LinkProductTable";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";

type Props = {
  readonly state: VideoCatalogState;
};

type ContentProps = Props & {
  readonly onClose: () => void;
};

const EditProductLinkModalContent = (props: ContentProps) => {
  const { state, onClose } = props;
  const styles = useStylesheet();

  const sendButtonProps = {
    style: { flex: 1 },
    text: i`Confirm`,
    onClick: () => onClose(),
  };

  const { isSmallScreen } = useDeviceStore();

  return (
    <Layout.FlexColumn style={styles.root}>
      <LinkProductTable style={styles.content} state={state} isEdit />
      <ModalFooter
        layout={isSmallScreen ? "vertical" : "horizontal"}
        action={sendButtonProps}
      />
    </Layout.FlexColumn>
  );
};

export default class EditProductLinkModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`Edit Product List`,
    });
    this.setWidthPercentage(0.6);
    this.setOverflowY("scroll");
  }

  renderContent() {
    return (
      <EditProductLinkModalContent
        state={this.parentProps.state}
        onClose={this.close}
      />
    );
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          overflow: "hidden",
          maxHeight: 670,
        },
        content: {
          padding: 24,
          height: "100%",
          overflowY: "auto",
        },
      }),
    []
  );
};
