import { H5, Layout, ObjectId } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalFooter from "@core/components/modal/ModalFooter";
import ProductImage from "@core/components/products/ProductImage";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";
import RefundBreakdown from "./RefundBreakdown";
import OrderRefundTable from "./OrderRefundTable";
import ModalTitle from "@core/components/modal/ModalTitle";

type Props = Pick<ModalProps, "open" | "onClose"> & {
  readonly productId: string;
  readonly productName?: string | null;
  readonly productImg?: string | null;
};

const RefundDetailsModal: React.FC<Props> = ({
  open,
  onClose,
  productId,
  productName,
  productImg,
}) => {
  const styles = useStylesheet();
  return (
    <Modal open={open} onClose={onClose} maxWidth="md">
      <ModalTitle
        title={ci18n(
          "modal title, let's merchants view the details relating to a refunded order",
          "Refund details",
        )}
        onClose={
          onClose === undefined
            ? undefined
            : (e) => {
                onClose(e, "backdropClick");
              }
        }
      />
      <Layout.FlexColumn>
        <Layout.FlexColumn style={styles.contentContainer}>
          <Layout.FlexRow>
            {productImg ? (
              <ProductImage imageUrl={productImg} style={styles.productImage} />
            ) : (
              <ProductImage productId={productId} style={styles.productImage} />
            )}
            <Layout.FlexColumn
              style={styles.rightColumn}
              alignItems="flex-start"
            >
              <H5>{productName}</H5>
              <ObjectId style={styles.objectId} id={productId} showFull />
            </Layout.FlexColumn>
          </Layout.FlexRow>
          <RefundBreakdown productId={productId} />
          <OrderRefundTable productId={productId} />
        </Layout.FlexColumn>
        <ModalFooter
          layout="horizontal"
          cancel={{
            text: ci18n("CTA text", "Back"),
            onClick: () => {
              onClose?.({}, "backdropClick");
            },
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        contentContainer: {
          padding: 24,
        },
        productImage: {
          height: 60,
          width: 60,
          maxWidth: "none",
          borderRadius: 4,
        },
        rightColumn: {
          margin: "0 8px",
        },
        objectId: {
          padding: "0px 4px",
        },
      }),
    [],
  );
};

export default observer(RefundDetailsModal);
