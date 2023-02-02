/*
 * DeleteProductConfirmModal.tsx
 *
 * Created by Jonah Dlin on Wed May 18 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { css, StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Alert, H5, Layout, ObjectId, Text } from "@ContextLogic/lego";
import Modal from "@core/components/modal/Modal";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import ModalFooter from "@core/components/modal/ModalFooter";
import {
  REMOVE_PRODUCT_MUTATION,
  RemoveProductResponseType,
  RemoveProductRequestType,
} from "@all-products/toolkit";
import { ci18n } from "@core/toolkit/i18n";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import ProductImage from "@core/components/products/ProductImage";
import { IS_SMALL_SCREEN, IS_LARGE_SCREEN } from "@core/toolkit/styling";
import { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";

type DeleteProductConfirmModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: (props: { readonly removed: boolean }) => unknown;
    readonly productId: string;
    readonly productName: string;
    readonly hasVariations: boolean;
  };

const DeleteProductConfirmModal: React.FC<DeleteProductConfirmModalProps> = ({
  open,
  className,
  style,
  onClose,
  productId,
  productName,
  hasVariations,
}: DeleteProductConfirmModalProps) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [removeProductMutation] = useMutation<
    RemoveProductResponseType,
    RemoveProductRequestType
  >(REMOVE_PRODUCT_MUTATION);

  return (
    <Modal open={open} onClose={() => onClose({ removed: false })}>
      <ModalTitle
        title={ci18n(
          "Header of a confirmation modal for removing a product",
          "Remove Product",
        )}
        onClose={() => onClose({ removed: false })}
      />
      <Layout.FlexColumn style={[className, style]} alignItems="stretch">
        <Layout.FlexColumn style={styles.content} alignItems="stretch">
          <Alert
            sentiment="warning"
            text={i`Once removed, you will not be able to reverse the removal action.`}
          />
          <H5>
            {hasVariations
              ? i`Are you sure you would like to remove this product and its variations?`
              : i`Are you sure you would like to remove this product?`}
          </H5>
          <div className={css(styles.productArea)}>
            <ProductImage productId={productId} style={styles.productImage} />
            <Layout.FlexColumn alignItems="flex-start">
              <Text style={styles.productName}>{productName}</Text>
              <ObjectId id={productId} showFull style={styles.productId} />
            </Layout.FlexColumn>
          </div>
        </Layout.FlexColumn>
        <ModalFooter
          layout="horizontal-centered"
          action={{
            text: i`Remove this Product`,
            onClick: async () => {
              const response = await removeProductMutation({
                variables: { input: { productId } },
              });

              const ok = response.data?.productCatalog.removeProduct?.ok;
              const message =
                response.data?.productCatalog.removeProduct?.message;

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

export default observer(DeleteProductConfirmModal);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
          gap: 24,
        },
        productArea: {
          display: "flex",
          [`@media (${IS_SMALL_SCREEN})`]: {
            gap: 8,
            flexDirection: "column",
          },
          [`@media (${IS_LARGE_SCREEN})`]: {
            gap: 16,
            flexDirection: "row",
          },
        },
        productImage: {
          maxHeight: 100,
          maxWidth: 100,
        },
        productName: {
          fontSize: 14,
          lineHeight: "20px",
          maxWidth: 400,
          color: textBlack,
          overflow: "hidden",
          whiteSpace: "pre-wrap",
        },
        productId: { padding: 0, marginTop: 8 },
      }),
    [textBlack],
  );
};
