/* External Libraries */
import { observable } from "mobx";

/* Toolkit */
import { Constants } from "@toolkit/products/constants";

// TODO: separate to multiple files
export default class Product {
  @observable
  id: string | null | undefined;

  @observable
  name: string;

  @observable
  parentSku: string;

  constructor(params: {
    readonly id: string;
    readonly name: string;
    readonly parent_sku: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.parentSku = params.parent_sku;
  }
}

export type Bound = "min" | "max" | "newMin" | "newMax";

export type TableData = {
  readonly size: string;
  sizeName: string;
  newSizeName: string;
  numericSize?: string;
  dimension?: string;
} & {
  [key: string]: {
    min: string | number;
    max: string | number;
    newMin: string | number;
    newMax: string | number;
  };
};

export class Range {
  @observable
  range: Map<Bound, string> = new Map();

  constructor(min?: string, max?: string) {
    this.range.set("min", min || "");
    this.range.set("max", max || "");

    // temp value for field editing
    this.range.set("newMin", min || "");
    this.range.set("newMax", max || "");
  }

  toJson() {
    return {
      min: this.range.get("min") || "",
      max: this.range.get("max") || "",

      // temp value for field editing
      newMin: this.range.get("newMin") || "",
      newMax: this.range.get("newMax") || "",
    };
  }
}

export class Measurement {
  // <dimension, Range>
  @observable
  measurement: Map<string, Range> = new Map();

  @observable
  dimensions: Array<string> = [];

  constructor(dimensions?: Array<string>) {
    if (dimensions) {
      this.dimensions = dimensions;
    } else {
      this.dimensions = [...Constants.DEFAULT_DIMENSIONS];
    }
    for (const dimension of this.dimensions) {
      this.measurement.set(dimension, new Range());
    }
  }
}

export class Measurements {
  // <size, <dimension, Range>>
  @observable
  measurements: Map<string, Measurement> = new Map();

  @observable
  numericSizes: Map<string, string> = new Map();

  @observable
  sizeName: Map<string, string> = new Map();

  @observable
  newSizeName: Map<string, string> = new Map();

  sizes: Array<string> = [];

  constructor(variationSizes?: Array<string>) {
    if (variationSizes) {
      this.sizes = variationSizes;
    }
    for (const size of this.sizes) {
      this.measurements.set(size, new Measurement());
      this.numericSizes.set(size, "");
      this.sizeName.set(size, size);
      this.newSizeName.set(size, size);
    }
    this.measurements.set("", new Measurement());
    this.numericSizes.set("", "");
    this.newSizeName.set("", "");
  }

  editNewSizeName(size: string, sizeName: string) {
    this.newSizeName.set(size, sizeName);
  }

  getNewSizeName(size: string) {
    return this.newSizeName.get(size);
  }

  editSizeName(size: string, sizeName: string) {
    if (!this.measurements.has(size)) {
      this.measurements.set(size, new Measurement());
      this.numericSizes.set(size, "");
    }
    this.sizeName.set(size, sizeName);
    this.newSizeName.set(size, sizeName);
    this.newSizeName.set("", "");
  }

  removeSize(size: string) {
    if (!this.measurements.has(size)) {
      return;
    }
    this.measurements.delete(size);
    this.numericSizes.delete(size);
    this.sizeName.delete(size);
    this.newSizeName.delete(size);
    this.newSizeName.set("", "");
  }

  setCell(params: {
    size: string;
    dimension: string;
    bound: Bound;
    value: string;
  }) {
    const { size, dimension, bound, value } = params;
    const measurement = this.measurements.get(size);
    if (measurement) {
      const range = measurement.measurement.get(dimension);
      if (range) {
        range.range.set(bound, value);
      }
    }
  }

  setNumericSizeCell(params: { size: string; value: string }) {
    const { size, value } = params;
    this.numericSizes.set(size, value);
  }

  getCell(params: { size: string; dimension: string; bound: Bound }) {
    const { size, dimension, bound } = params;
    const measurement = this.measurements.get(size);
    if (measurement) {
      const range = measurement.measurement.get(dimension);
      if (range) {
        return range.range.get(bound) || "0";
      }
    }
    return null;
  }

  getNumericSizeCell(params: { size: string }) {
    const { size } = params;
    return this.numericSizes.get(size);
  }

  getSizes(): Array<string> {
    return this.sizes;
  }

  toTableData(): ReadonlyArray<TableData> {
    const tableData: TableData[] = [];
    const orderedSizes = [
      "XXS",
      "2XS",
      "XS",
      i`Extra Small`,
      "EXTRA SMALL",
      "S",
      i`Small`,
      "SMALL",
      "M",
      i`Medium`,
      "MEDIUM",
      "L",
      i`Large`,
      "LARGE",
      "XL",
      "XXL",
      "2XL",
      "XXXL",
      "3XL",
      "XXXXL",
      "4XL",
      "XXXXXL",
      "5XL",
    ];
    const sizeNames = [...this.measurements.keys()].map((x) =>
      this.sizeName.get(x)
    );
    const regularSizes: string[] = [];
    const otherSizes: string[] = [];
    for (const size of orderedSizes) {
      if (sizeNames.includes(size)) {
        regularSizes.push(size);
      }
    }
    for (const size of sizeNames) {
      if (size && !regularSizes.includes(size)) {
        otherSizes.push(size);
      }
    }
    otherSizes.sort();
    const sizes = [...regularSizes, ...otherSizes, ""];
    for (const size of sizes) {
      const row = {
        size,
        sizeName: this.sizeName.get(size) || "",
        newSizeName: this.newSizeName.get(size) || "",
        numericSize: this.numericSizes.get(size) || "",
      };
      const measurement = this.measurements.get(size);
      if (measurement) {
        for (const dimension of measurement.measurement.keys()) {
          const range = measurement.measurement.get(dimension);
          if (range) {
            // if you find this please fix the any types (legacy)
            (row as any)[dimension] = range.toJson();
          }
        }
        tableData.push(row as TableData); // casting not good, relies on server response
      }
    }
    return tableData;
  }

  toJson() {
    return JSON.stringify(this);
  }

  fromJson(json: string) {
    const obj = JSON.parse(json);
    for (const size of Object.keys(obj)) {
      const measurement = new Measurement([]);
      for (const dimension of Object.keys(obj[size])) {
        if (dimension !== "numeric_size") {
          measurement.measurement.set(
            dimension,
            new Range(obj[size][dimension].min, obj[size][dimension].max)
          );
        }
      }
      this.measurements.set(size, measurement);
      this.numericSizes.set(
        size,
        obj[size].numeric_size == null ? "" : obj[size].numeric_size.toString()
      );
      this.sizeName.set(size, size);
      this.newSizeName.set(size, size);
      this.sizes.push(size);
    }
  }
}
