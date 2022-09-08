import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout } from "@ContextLogic/lego";
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import EditWarehouseForm from "./create/EditWarehouseForm";

/* Model */
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";

/* Merchant Store */
import { useDeviceStore } from "@stores/DeviceStore";

import Link from "@next-toolkit/Link";

type EditWarehouseModalContentProps = BaseProps & {
  readonly state: WarehouseSettingsState;
  readonly onClose: () => void;
};

type EditWarehouseModalProps = {
  readonly state: WarehouseSettingsState;
};

const EditWarehouseModalContent = observer(
  (props: EditWarehouseModalContentProps) => {
    const { state, onClose } = props;
    const deviceStore = useDeviceStore();

    const sendButtonProps = {
      style: { flex: 1 },
      isDisabled: !state.formValid,
      text: i`Submit`,
      isLoading: state.isSubmitting,
      onClick: async () => {
        await state.submit();
      },
    };

    const closeButtonProps = {
      style: { marginRight: 24 },
      disabled: state.isSubmitting,
      text: i`Cancel`,
      onClick: onClose,
    };

    return (
      <>
        <EditWarehouseForm state={state} style={{ padding: 24 }} />
        <ModalFooter
          layout={deviceStore.isSmallScreen ? "vertical" : "horizontal"}
          action={sendButtonProps}
          extraFooterContent={<Link {...closeButtonProps}>Cancel</Link>}
        />
      </>
    );
  }
);

export default class EditWarehouseModal extends Modal {
  parentProps: EditWarehouseModalProps;

  constructor(props: EditWarehouseModalProps) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`Edit Warehouse Address`,
    });
    this.setNoMaxHeight(true);
    this.setWidthPercentage(0.5);
  }

  renderContent() {
    const { state } = this.parentProps;

    return (
      <Layout.FlexColumn>
        <EditWarehouseModalContent state={state} onClose={() => this.close()} />
      </Layout.FlexColumn>
    );
  }
}
