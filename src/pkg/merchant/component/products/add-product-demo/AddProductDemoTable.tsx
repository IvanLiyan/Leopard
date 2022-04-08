import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { ObjectId, CellInfo, TableAction, Table } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Merchant Components */
import ProductDetailModal from "@merchant/component/products/ProductDetailModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import ProductImage from "@merchant/component/products/ProductImage";
import { useToastStore } from "@stores/ToastStore";
import { ProductCatalogMutationsUpsertProductArgs } from "@schema/types";

import { useApolloStore } from "@stores/ApolloStore";

import {
  DELETE_DEMO_VIDEO,
  PickedProductType,
  DeleteDemoResponseType,
} from "@toolkit/products/demo-video";

import AddDemoModal from "./AddDemoModal";
import ProductVideoStateLabel from "./ProductVideoStateLabel";

import Link from "@next-toolkit/Link";

type Props = BaseProps & {
  readonly products: ReadonlyArray<PickedProductType>;
  readonly onRefetchProducts: () => Promise<unknown>;
};

const AddProductDemoTable: React.FC<Props> = (props: Props) => {
  const { className, style, products, onRefetchProducts } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const { client } = useApolloStore();

  const onCloseModal = useCallback(async () => {
    await onRefetchProducts();
  }, [onRefetchProducts]);

  const tableActions = useMemo((): ReadonlyArray<TableAction> => {
    return [
      {
        key: "update",
        name: i`Update`,
        canApplyToRow: (product: PickedProductType) =>
          product?.demoVideo != null,
        apply: ([product]: ReadonlyArray<PickedProductType>) => {
          new AddDemoModal({
            product,
            onCloseModal,
          }).render();
        },
      },
      {
        key: "add",
        name: i`Add Video`,
        canApplyToRow: (product: PickedProductType) =>
          product?.demoVideo == null,
        apply: ([product]: ReadonlyArray<PickedProductType>) => {
          new AddDemoModal({
            product,
            onCloseModal,
          }).render();
        },
      },
      {
        key: "delete",
        name: i`Delete Video`,
        canApplyToRow: (product: PickedProductType) =>
          product?.demoVideo != null,
        apply: async ([product]: ReadonlyArray<PickedProductType>) => {
          new ConfirmationModal(i`Are you sure you want to delete this video?`)
            .setHeader({ title: i`Confirmation` })
            .setCancel(i`Cancel`)
            .setAction(i`Yes`, async () => {
              const { data } = await client.mutate<
                DeleteDemoResponseType,
                ProductCatalogMutationsUpsertProductArgs
              >({
                mutation: DELETE_DEMO_VIDEO,
                variables: {
                  input: { id: product.id, demoVideoSourceUrl: "" },
                },
              });

              const ok = data?.productCatalog?.upsertProduct?.ok || false;
              const message = data?.productCatalog?.upsertProduct?.message;
              if (!ok) {
                toastStore.negative(message || i`Something went wrong`);
                return;
              }
              onRefetchProducts();
              toastStore.positive(i`Video has been deleted`);
            })
            .render();
        },
      },
    ];
  }, [onCloseModal, client, toastStore, onRefetchProducts]);

  return (
    <Table
      className={css(styles.root, className, style)}
      data={products || []}
      actions={tableActions}
      cellPadding="8px 60x"
      rowHeight={60}
      noDataMessage={i`No products found`}
    >
      <Table.Column
        _key={undefined}
        title={ni18n(1, "Product", "Products")}
        columnKey="name"
      >
        {({
          row: { id, name },
        }: CellInfo<PickedProductType["id" | "name"], PickedProductType>) => (
          <div className={css(styles.productCell)}>
            <Link
              className={css(styles.productCellContent)}
              onClick={() => {
                new ProductDetailModal(id).render();
              }}
              openInNewTab
            >
              <ProductImage
                productId={id}
                className={css(styles.productCellImage)}
              />
              <div className={css(styles.productCellName)}>{name}</div>
            </Link>
          </div>
        )}
      </Table.Column>

      <Table.Column
        _key={undefined}
        title={i`Product ID`}
        columnKey="id"
        align="left"
      >
        {({
          row: { id },
        }: CellInfo<PickedProductType["id"], PickedProductType>) => (
          <ObjectId id={id} copyOnBodyClick />
        )}
      </Table.Column>

      <Table.Column
        _key={undefined}
        title={i`Date added`}
        columnKey="demoVideo.uploadTime.mmddyyyy"
        align="left"
        noDataMessage="--"
      />
      <Table.Column
        _key={undefined}
        title={i`Status`}
        columnKey="demoVideo.state"
        align="left"
        noDataMessage="--"
      >
        {({
          row: { demoVideo },
        }: CellInfo<PickedProductType, PickedProductType>) =>
          demoVideo?.state == null ? (
            "--"
          ) : (
            <ProductVideoStateLabel status={demoVideo.state} />
          )
        }
      </Table.Column>
      <Table.Column
        _key={undefined}
        title={i`Reason for rejection`}
        columnKey="demoVideo.rejectionReason"
        align="left"
        noDataMessage="--"
        multiline
        width={240}
      >
        {({
          row: { demoVideo },
        }: CellInfo<PickedProductType, PickedProductType>) => {
          const reason = demoVideo?.rejectionReason;
          if (reason == null) {
            return "--";
          }
          return (
            <Link
              onClick={() =>
                new ConfirmationModal(reason)
                  .setHeader({ title: i`Your video was rejected` })
                  .setCancel(i`Cancel`)
                  .setAction(i`Ok`, async () => {})
                  .render()
              }
            >
              View details
            </Link>
          );
        }}
      </Table.Column>

      <Table.NumeralColumn
        _key={undefined}
        title={i`Views`}
        columnKey="demoVideo.viewCount"
        align="left"
        noDataMessage="--"
      />
    </Table>
  );
};

export default AddProductDemoTable;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        productCell: {
          display: "flex",
          alignItems: "center",
          margin: "12px 0px",
          maxWidth: 500,
        },
        productCellImage: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        productCellContent: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
        },
        productCellName: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    []
  );
};
