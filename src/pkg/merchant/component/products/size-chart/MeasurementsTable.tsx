import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Model */
import { Measurements } from "@merchant/model/Product";

/* Toolkit */
import { Constants } from "@toolkit/products/constants";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type MeasurementsTableProps = BaseProps & {
  readonly measurements: Measurements;
  readonly disableEdit: boolean;
};

const MeasurementsTable = (props: MeasurementsTableProps) => {
  const styles = useStylesheet();
  const { measurements, disableEdit } = props;

  const cellOnBlur = (arg: {
    size: string;
    dimension: string;
    isMin: boolean;
  }) => {
    const { size, dimension, isMin } = arg;
    const newBound = isMin ? "newMin" : "newMax";
    const bound = isMin ? "min" : "max";
    const newCell = measurements.getCell({
      size,
      dimension,
      bound: newBound,
    });
    if (newCell === null) {
      return;
    }
    let value = parseFloat(newCell).toString();
    if (value === "0") {
      value = "";
    }
    measurements.setCell({
      size,
      dimension,
      bound: newBound,
      value,
    });
    measurements.setCell({
      size,
      dimension,
      bound,
      value,
    });
  };

  const numericSizeCellOnBlur = (arg: { size: string }) => {
    const { size } = arg;
    const newCell = measurements.getNumericSizeCell({ size });
    if (newCell === null) {
      return;
    }
    let value = "";
    if (newCell && newCell.trim().length > 0) {
      value = parseFloat(newCell).toString();
    }
    measurements.setNumericSizeCell({
      size,
      value,
    });
  };

  const renderCell = (
    row: ReturnType<typeof measurements.toTableData>[0],
    dimension: string
  ) => {
    const { newMin: minValue, newMax: maxValue } = row[dimension];
    return (
      <div className={css(styles.cell)}>
        <TextInput
          className={css(styles.textInput)}
          value={minValue}
          type="number"
          disabled={disableEdit}
          onChange={({ text }) => {
            measurements.setCell({
              size: row.size,
              dimension,
              bound: "newMin",
              value: text,
            });
          }}
          onBlur={() => {
            cellOnBlur({
              size: row.size,
              dimension,
              isMin: true,
            });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
        <p className={css(styles.divider)}>-</p>
        <TextInput
          className={css(styles.textInput)}
          value={maxValue}
          type="number"
          disabled={disableEdit}
          onChange={({ text }) => {
            measurements.setCell({
              size: row.size,
              dimension,
              bound: "newMax",
              value: text,
            });
          }}
          onBlur={() => {
            cellOnBlur({
              size: row.size,
              dimension,
              isMin: false,
            });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderSizeName = (
    row: ReturnType<typeof measurements.toTableData>[0]
  ) => {
    return (
      <div className={css(styles.cell)}>
        <TextInput
          className={css(styles.sizeName)}
          value={row.newSizeName}
          disabled={disableEdit || measurements.getSizes().includes(row.size)}
          onChange={({ text }) => {
            measurements.editNewSizeName(row.size, text.trim());
          }}
          onBlur={() => {
            const editingSizeName = measurements.getNewSizeName(row.size);
            if (!editingSizeName) {
              if (row.size.trim().length > 0) {
                const modal = new ConfirmationModal(
                  i`Please confirm you would like to remove this row.`
                );
                modal
                  .setHeader({ title: i`Remove Row` })
                  .setAction(i`Confirm`, () => {
                    measurements.removeSize(row.size);
                  })
                  .setCancel(i`Cancel`, () => {
                    measurements.editNewSizeName(row.size, row.sizeName);
                  })
                  .render();
              }
            } else {
              measurements.editSizeName(
                row.size || editingSizeName,
                editingSizeName
              );
            }
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  const renderNumericSizeCell = (
    row: ReturnType<typeof measurements.toTableData>[0]
  ) => {
    return (
      <div className={css(styles.cell)}>
        <TextInput
          className={css(styles.textInput)}
          value={row.numericSize}
          type="number"
          disabled={disableEdit}
          onChange={({ text }) => {
            measurements.setNumericSizeCell({
              size: row.size,
              value: text,
            });
          }}
          onBlur={() => {
            numericSizeCellOnBlur({
              size: row.size,
            });
          }}
          inputStyle={{
            textAlign: "center",
          }}
          height={32}
          padding={1}
        />
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      <Table
        data={measurements.toTableData()}
        overflowY="scroll"
        highlightRowOnHover
        rowHeight={48}
      >
        <Table.Column
          columnKey="size"
          title={i`Size`}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderSizeName(row)}
        </Table.Column>
        <Table.Column
          columnKey="numericSize"
          title={i`Numeric Size`}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderNumericSizeCell(row)}
        </Table.Column>
        <Table.Column
          columnKey="bust"
          title={Constants.DIMENSIONS_TO_DISPLAY.bust}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "bust")}
        </Table.Column>
        <Table.Column
          columnKey="waist"
          title={Constants.DIMENSIONS_TO_DISPLAY.waist}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "waist")}
        </Table.Column>
        <Table.Column
          columnKey="hip"
          title={Constants.DIMENSIONS_TO_DISPLAY.hip}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "hip")}
        </Table.Column>
        <Table.Column
          columnKey="neck"
          title={Constants.DIMENSIONS_TO_DISPLAY.neck}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "neck")}
        </Table.Column>
        <Table.Column
          columnKey="shoulder"
          title={Constants.DIMENSIONS_TO_DISPLAY.shoulder}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "shoulder")}
        </Table.Column>
        <Table.Column
          columnKey="sleeve"
          title={Constants.DIMENSIONS_TO_DISPLAY.sleeve}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "sleeve")}
        </Table.Column>
        <Table.Column
          columnKey="inseam"
          title={Constants.DIMENSIONS_TO_DISPLAY.inseam}
          noDataMessage=""
          align="center"
        >
          {({ row }) => renderCell(row, "inseam")}
        </Table.Column>
      </Table>
    </div>
  );
};

export default observer(MeasurementsTable);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        cell: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        },
        divider: {
          margin: "4px 0",
        },
        textInput: {
          width: 48,
          height: 32,
          margin: "0px 4px",
          flexShrink: 0,
        },
        sizeName: {
          minWidth: 104,
          height: 32,
          margin: "0px 4px",
        },
      }),
    []
  );
};
