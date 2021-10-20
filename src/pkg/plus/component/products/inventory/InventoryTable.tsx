/*
 *
 * InventoryMerchantTable.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { SortOrder } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

import ProductImage from "@merchant/component/products/ProductImage";

/* Relative Imports */
import InventoryControls from "./InventoryControls";
import { OnChangeEvent } from "@ContextLogic/lego";

import { useToastStore } from "@stores/ToastStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo } from "@ContextLogic/lego";
import {
  VariationSchema,
  MerchantSchema,
  UpsertProduct,
  ProductUpsertInput,
  VariationInput,
  InventoryInput,
  VariationSortField,
} from "@schema/types";

const UPDATE_INVENTORY_MUTATION = gql`
  mutation InventoryTable_UpdateInventory(
    $productId: ObjectIdType!
    $variationId: ObjectIdType!
    $warehouseId: ObjectIdType!
    $count: Int!
  ) {
    productCatalog {
      upsertProduct(
        input: {
          id: $productId
          variations: [
            {
              id: $variationId
              inventory: [{ warehouseId: $warehouseId, count: $count }]
            }
          ]
        }
      ) {
        ok
        message
      }
    }
  }
`;

export type VariationType = Pick<
  VariationSchema,
  | "id"
  | "sku"
  | "size"
  | "color"
  | "totalInventory"
  | "productId"
  | "productName"
>;

type UpdateInventoryMutationArgs = {
  readonly productId: ProductUpsertInput["id"];
  readonly variationId: VariationInput["id"];
  readonly warehouseId: InventoryInput["warehouseId"];
  readonly count: InventoryInput["count"];
};

type UpdateInventoryMutationResponse = {
  readonly productCatalog: {
    readonly upsertProduct: Pick<UpsertProduct, "ok" | "message">;
  };
};

const VariationCell = ({
  productId,
  productName,
  size,
  color,
}: VariationType) => {
  const styles = useStylesheet();

  let slugs: ReadonlyArray<string> = [];
  if (size) {
    slugs = [...slugs, size];
  }

  if (color) {
    slugs = [...slugs, color];
  }

  return (
    <Link
      className={css(styles.variationsCell)}
      href={`/plus/products/edit/${productId}`}
    >
      <ProductImage productId={productId} className={css(styles.image)} />
      <div className={css(styles.cellContent)}>
        <div className={css(styles.text)}>{productName}</div>
        <div className={css(styles.text, styles.variation)}>
          {slugs.join(" / ")}
        </div>
      </div>
    </Link>
  );
};

const InventoryForm = ({
  variation,
  standardWarehouseId,
}: {
  readonly variation: VariationType;
  readonly standardWarehouseId: MerchantSchema["standardWarehouseId"];
}) => {
  const toastStore = useToastStore();
  const [currentValue, setCurrentValue] = useState<number>(
    variation.totalInventory || 0,
  );
  const [lastSubmission, setLastSubmission] = useState<number>(
    variation.totalInventory || 0,
  );
  const [updateInventory, { loading }] = useMutation<
    UpdateInventoryMutationResponse,
    UpdateInventoryMutationArgs
  >(UPDATE_INVENTORY_MUTATION, {
    variables: {
      productId: variation.productId,
      variationId: variation.id,
      count: currentValue,
      warehouseId: standardWarehouseId,
    },
  });

  const onSave = async () => {
    const { data } = await updateInventory({});
    const ok = data?.productCatalog.upsertProduct.ok;
    const errorMessage = data?.productCatalog.upsertProduct.message;
    if (ok) {
      setLastSubmission(currentValue);
      toastStore.info(i`Inventory has been updated`);
    } else {
      toastStore.error(errorMessage || i`Something went wrong`);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <InventoryControls
        value={currentValue}
        disabled={loading}
        incrementStep={1}
        onChange={({ valueAsNumber }: OnChangeEvent) => {
          setCurrentValue(Math.max(0, valueAsNumber || 0));
        }}
        canSave={currentValue != lastSubmission}
        onSave={async () => await onSave()}
        style={{ width: "95%" }}
      />
    </div>
  );
};

type Props = BaseProps & {
  readonly variations: ReadonlyArray<VariationType>;
  readonly sortField: VariationSortField | undefined;
  readonly sortOrder: SortOrder | undefined;
  readonly standardWarehouseId: MerchantSchema["standardWarehouseId"];
  readonly onSortToggled: (
    field: VariationSortField,
    order: SortOrder,
  ) => unknown;
};

const InventoryTable: React.FC<Props> = ({
  variations,
  sortOrder,
  sortField,
  standardWarehouseId,
  onSortToggled,
  style,
  className,
}: Props) => {
  const inventorySortOrder =
    sortField == "INVENTORY" ? sortOrder : "not-applied";

  return (
    <Table data={variations} className={css(className)} style={style}>
      <Table.Column title={i`Product`} columnKey="productName">
        {({ row }: CellInfo<VariationType["productName"], VariationType>) => (
          <VariationCell {...row} />
        )}
      </Table.Column>
      <Table.Column title={i`SKU`} columnKey="sku" align="left" width={100} />
      <Table.Column
        title={i`Quantity`}
        columnKey="totalInventory"
        align="left"
        sortOrder={inventorySortOrder}
        onSortToggled={(newOrder) => onSortToggled("INVENTORY", newOrder)}
        width={200}
      >
        {({
          row: variation,
        }: CellInfo<VariationType["totalInventory"], VariationType>) => {
          return (
            <InventoryForm
              key={variation.id}
              variation={variation}
              standardWarehouseId={standardWarehouseId}
            />
          );
        }}
      </Table.Column>
    </Table>
  );
};

export default observer(InventoryTable);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        variationsCell: {
          display: "inline-flex",
          alignItems: "center",
          margin: "12px 0px",
          overflow: "hidden",
          "@media (min-width: 900px)": {
            maxWidth: 400,
          },
        },
        image: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        text: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        variation: {
          fontSize: 12,
        },
        popover: {
          margin: 24,
        },
        markdown: {
          margin: 12,
        },
        cellContent: {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }),
    [],
  );
