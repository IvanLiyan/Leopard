/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import Modal from "@merchant/component/core/modal/Modal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

type FBWWarehousesClassificationProps = {
  readonly warehouseClassification: {
    [key: string]: ReadonlyArray<string>;
  };
};

const FBWWarehouseDescription = {
  bonded:
    i`Bonded warehouses mean that merchants' product inventory may be` +
    i` stored in these warehouses without payment of duty upon the` +
    i` inventory's arrival.`,
  unbonded:
    i`Non-bonded warehouses mean that duty needs to be paid upon` +
    i` merchants' dutiable product inventory's arrival at these` +
    i` warehouses.`,
};

const columnTitle = {
  bonded: i`Bonded warehouses`,
  unbonded: i`Non-bonded warehouses`,
};

const FBWWarehousesClassificationContent = (
  props: FBWWarehousesClassificationProps
) => {
  const { warehouseClassification } = props;
  const styles = useStylesheet();

  const warehouses: [{ [key: string]: any }] = [{}];

  Object.keys(warehouseClassification).forEach((key) => {
    warehouseClassification[key].forEach((warehouseName, index) => {
      if (warehouses.length <= index) {
        warehouses.push({});
      }
      warehouses[index][key] = warehouseName;
    });
  });

  warehouses.unshift({});
  Object.keys(warehouseClassification).forEach((key) => {
    // if you find this please fix the any types (legacy)
    warehouses[0][key] = (FBWWarehouseDescription as any)[key];
  });

  return (
    <div className={css(styles.root)}>
      <Table data={warehouses}>
        {Object.keys(warehouseClassification)
          .sort()
          .map((warehouseType) => {
            return (
              <Table.Column
                title={(columnTitle as any)[warehouseType]}
                columnKey={warehouseType}
                width={440}
                noDataMessage={""}
                key={warehouseType}
              >
                {({ row }) => (
                  <div className={css(styles.column)}>{row[warehouseType]}</div>
                )}
              </Table.Column>
            );
          })}
      </Table>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "40px 24px",
        },
        column: {
          whiteSpace: "normal",
          padding: "20px 0",
          fontSize: "16px",
          color: palettes.textColors.Ink,
        },
      }),
    []
  );
};

export default class FBWWarehousesClassificationModal extends Modal {
  props: FBWWarehousesClassificationProps;
  constructor(props: FBWWarehousesClassificationProps) {
    super(() => null);
    this.props = props;

    this.setHeader({
      title: i`Intake warehouse regions`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
  }

  renderContent() {
    return <FBWWarehousesClassificationContent {...this.props} />;
  }
}
