/*
 * DeleteProductConfirmModal.tsx
 *
 * Created by Jonah Dlin on Wed May 18 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Alert, H5, Layout, Markdown, Text } from "@ContextLogic/lego";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ModalFooter from "@core/components/modal/ModalFooter";
import {
  DeleteWarehouseResponseType,
  DeleteWarehouseInputType,
  DELETE_WAREHOUSE,
  PickedWarehouse,
} from "@all-products/toolkit";
import { ci18n } from "@core/toolkit/i18n";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import { merchFeURL } from "@core/toolkit/router";
import ModalTitle from "@core/components/modal/ModalTitle";

type DeleteWarehouseConfirmModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: (props: { readonly removed: boolean }) => unknown;
    readonly warehouse: PickedWarehouse;
  };

const DeleteWarehouseConfirmModal: React.FC<
  DeleteWarehouseConfirmModalProps
> = ({
  className,
  open,
  style,
  onClose,
  warehouse,
}: DeleteWarehouseConfirmModalProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [deleteWarehouse] = useMutation<
    DeleteWarehouseResponseType,
    DeleteWarehouseInputType
  >(DELETE_WAREHOUSE);

  const policyLink = merchFeURL("/policy#warehouse_fulfillment");

  return (
    <Modal open={open} onClose={() => onClose({ removed: false })}>
      <ModalTitle
        title={ci18n(
          "Header of a confirmation modal for removing a warehouse",
          "Delete Warehouse",
        )}
        onClose={() => onClose({ removed: false })}
      />
      <Layout.FlexColumn style={[className, style]} alignItems="stretch">
        <Layout.FlexColumn style={styles.content} alignItems="stretch">
          <H5>Are you sure you would like to remove this warehouse?</H5>
          <Alert
            sentiment="warning"
            text={() => (
              <Layout.FlexColumn style={styles.alertContent}>
                <Markdown
                  text={
                    i`Please note that if this warehouse is deleted, any ` +
                    i`orders currently withheld under Policy 12 will no ` +
                    i`longer be eligible for payment. See [Policy 12: Warehouse Fulfillment Policy](${policyLink}) for more details.`
                  }
                  openLinksInNewTab
                />
                <Text>
                  In addition, if this warehouse is deleted, you will not be
                  allowed to recreate an identical warehouse in the next 2
                  weeks.
                </Text>
              </Layout.FlexColumn>
            )}
          />
        </Layout.FlexColumn>
        <ModalFooter
          action={{
            text: i`Remove this Warehouse`,
            onClick: async () => {
              const response = await deleteWarehouse({
                variables: { input: { id: warehouse.id } },
              });
              const ok =
                response.data?.currentMerchant.warehouseSettings.deleteWarehouse
                  .ok;
              const message =
                response.data?.currentMerchant.warehouseSettings.deleteWarehouse
                  .message;
              if (!ok) {
                toastStore.negative(message ?? i`Something went wrong`);
                return;
              }
              onClose({ removed: true });
            },
          }}
          cancel={{
            text: ci18n(
              "Text on a button that closes a modal without performing any action",
              "Cancel",
            ),
            onClick: () => {
              onClose({ removed: false });
            },
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default observer(DeleteWarehouseConfirmModal);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
          gap: 24,
        },
        alertContent: {
          gap: 16,
        },
      }),
    [],
  );
};
