import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import BrandCard from "@merchant/component/brand/branded-products/BrandCard";
import { RemoveProductConfirmationModal } from "@merchant/component/products/list-page/RemoveProductConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import VerifyBrandsDaysLeft from "./VerifyBrandsDaysLeft";

/* Merchant Store */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ProductBrandDetectionInfoObject,
  verifyOrIgnoreBrands,
  deleteProduct,
} from "@merchant/api/brand/verify-brands";

export type VerifyBrandsTableProps = BaseProps & {
  readonly infos: ReadonlyArray<ProductBrandDetectionInfoObject>;
  readonly onUpdate: () => unknown;
};

const VerifyBrandsTable = (props: VerifyBrandsTableProps) => {
  const { className, style, infos, onUpdate } = props;
  const { primary } = useTheme();
  const toastStore = useToastStore();
  const styles = useStylesheet();

  const [selectedInfos, setSelectedInfos] = useState<Set<number>>(new Set([]));
  const [rowsWithFade, setRowsWithFade] = useState<
    ReadonlyArray<ProductBrandDetectionInfoObject>
  >();

  const callVerifyOrIgnoreBrands = useCallback(
    async (infos: ReadonlyArray<ProductBrandDetectionInfoObject>, isVerify) => {
      const args = {
        product_ids: infos.map(
          (info: ProductBrandDetectionInfoObject) => info.product_id
        ),
        is_verify: isVerify,
      };
      setRowsWithFade(infos);

      try {
        const response = await verifyOrIgnoreBrands(args).call();
        if (response?.code === 0) {
          onUpdate();
          setSelectedInfos(new Set([]));
        } else {
          toastStore.negative(response.msg || "");
        }
      } catch (e) {
        toastStore.negative(e.message);
      }
    },
    [toastStore, onUpdate]
  );

  const onRowSelectionToggled = useCallback(
    ({ index, selected }) => {
      if (selected) {
        selectedInfos.add(index);
      } else {
        selectedInfos.delete(index);
      }
      setSelectedInfos(new Set(selectedInfos));
    },
    [selectedInfos]
  );

  const onProductDelete = useCallback(
    async (info: ProductBrandDetectionInfoObject) => {
      const args = {
        product_id: info.product_id,
      };
      setRowsWithFade([info]);

      try {
        const response = await deleteProduct(args).call();

        if (response?.code === 0) {
          onUpdate();
          setSelectedInfos(new Set([]));
        } else {
          toastStore.negative(response.msg || "");
        }
      } catch (e) {
        toastStore.negative(e.message);
      }
    },
    [toastStore, onUpdate]
  );

  const actionCanApplyToRow = useCallback(
    (row: ProductBrandDetectionInfoObject) => !rowsWithFade?.includes(row),
    [rowsWithFade]
  );

  const tableActions = [
    {
      key: "verify",
      name: i`Verify brand`,
      canBatch: true,
      canApplyToRow: actionCanApplyToRow,
      apply: (infos: ReadonlyArray<ProductBrandDetectionInfoObject>) => {
        callVerifyOrIgnoreBrands(infos, true);
      },
    },
    {
      key: "ignore",
      name: i`Ignore tag`,
      canBatch: true,
      canApplyToRow: actionCanApplyToRow,
      apply: (infos: ReadonlyArray<ProductBrandDetectionInfoObject>) => {
        callVerifyOrIgnoreBrands(infos, false);
      },
    },
    {
      key: "delete",
      name: i`Permanently remove product`,
      canApplyToRow: actionCanApplyToRow,
      apply: ([info]: ReadonlyArray<ProductBrandDetectionInfoObject>) => {
        const infoArray = [info.product_id, info.fine_amount_text];
        new RemoveProductConfirmationModal(infoArray, () =>
          onProductDelete(info)
        ).render();
      },
    },
  ];

  return (
    <Table
      className={css(styles.root, className, style)}
      hideBorder
      data={infos}
      noDataMessage={i`No branded product listings to verify.`}
      rowHeight={50}
      highlightRowOnHover
      canSelectRow={() => true}
      actions={tableActions}
      selectedRows={Array.from(selectedInfos)}
      onRowSelectionToggled={onRowSelectionToggled}
      actionDropdownContentWidth={250}
      rowStyle={({ row }) =>
        rowsWithFade?.includes(row) ? styles.fadingRow : null
      }
    >
      <ProductColumn
        title={i`Product`}
        columnKey="product_id"
        width={300}
        showDetailsInPopover={false}
        fontColor={primary}
      />
      <Table.Column
        title={i`Days left to verify`}
        columnKey="days_left_to_verify"
        style={{ justifyContent: "center" }}
        handleEmptyRow
        width={120}
      >
        {({ value }) => (
          <VerifyBrandsDaysLeft daysLeftValue={value} width={90} />
        )}
      </Table.Column>
      <Table.Column title={i`Brand to verify`} columnKey="brand_name">
        {({ row }) => (
          <Popover
            popoverContent={() => (
              <BrandCard
                brand_id={row.brand_id}
                brand_name={row.brand_name}
                logo_url={row.brand_logo_url}
              />
            )}
            position="bottom center"
            contentWidth={330}
          >
            {row.brand_name}
          </Popover>
        )}
      </Table.Column>
    </Table>
  );
};

export default VerifyBrandsTable;

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        longTextColumn: {
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflow: "auto",
          width: "100%",
        },
        greenCheckmark: {
          marginRight: 9,
        },
        noDataText: {
          color: textDark,
        },
        fadingRow: {
          opacity: 0.4,
        },
      }),
    [textDark]
  );
};
