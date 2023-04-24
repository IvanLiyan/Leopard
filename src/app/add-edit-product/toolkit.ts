import { ci18n, i18n } from "@core/toolkit/i18n";

import {
  CommerceProductCondition,
  VolumeUnit,
  AreaUnit,
  CountUnit,
  LengthUnit,
  WeightUnit,
  ProductUpsertInput,
  VariationInput,
  ContestWarningType,
} from "@schema";
import { IconName } from "@ContextLogic/zeus";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import { Variation } from "@add-edit-product/AddEditProductState";

export const ConditionDisplay: {
  readonly [condition in CommerceProductCondition]: string;
} = {
  NEW: ci18n("product condition", "New"),
  USED: ci18n("product condition", "Used"),
  REFURBISHED: ci18n("product condition", "Refurbished"),
};

export const PreviewTypes = ["MOBILE", "WEB"] as const;

export type PreviewType = typeof PreviewTypes[number];

export const PreviewTypeIconMap: {
  readonly [preview in PreviewType]: IconName;
} = {
  MOBILE: "smartphone",
  WEB: "desktop",
};

export type VariationsInput = {
  readonly variations?: ReadonlyArray<VariationInput> | null;
};

export type UnitPriceInput = Pick<
  ProductUpsertInput,
  | "referenceArea"
  | "referenceLength"
  | "referenceUnit"
  | "referenceVolume"
  | "referenceWeight"
>;

export type PermutationResult = ReadonlyArray<{
  readonly color: string | null | undefined;
  readonly size: string | null | undefined;
}>;

export const getPermutations = (
  colorsList: ReadonlyArray<string>,
  sizesList: ReadonlyArray<string>,
): PermutationResult => {
  if (colorsList.length == 0 && sizesList.length == 0) {
    return [];
  }

  if (colorsList.length == 0 || sizesList.length == 0) {
    const populatedList = colorsList.length == 0 ? sizesList : colorsList;
    return populatedList.map((value) => ({
      color: colorsList.length != 0 ? value : undefined,
      size: sizesList.length != 0 ? value : undefined,
    }));
  }

  return colorsList.reduce(
    (total: PermutationResult, colorValue: string): PermutationResult => {
      const colorCombinations = sizesList.map((sizeValue) => {
        const color = colorValue.trim().length == 0 ? undefined : colorValue;
        const size = sizeValue.trim().length == 0 ? undefined : sizeValue;
        return { color, size };
      });
      return [...total, ...colorCombinations];
    },
    [],
  );
};

/**
 * Get permutation of option values. The result will be a list of combination, each
 * combination is an object in the form {optionIds[i]: optionValues[i][<selected_value_index>] for all i < optionIds.length}
 * Example:
 *  Input: options = [{size, color}], optionValues = [{large}, {red, blue}]
 *  Output: [{size: large, color: red}, {size: large, color: blue}]
 * @param options array of option identifiers
 * @param optionValues array of values available for each option
 */
export const getOptionValuesPermutation = (
  options: ReadonlyArray<string>,
  optionValues: ReadonlyArray<ReadonlyArray<string>>,
): ReadonlyArray<Record<string, string>> => {
  const permutations = optionValues.reduce(
    // eslint-disable-next-line local-rules/no-large-method-params
    (result, currentValues, currentIndex) => {
      return result.flatMap((combination) =>
        currentValues.map((value) => {
          return { ...combination, [`${options[currentIndex]}`]: value };
        }),
      );
    },
    [{}],
  );

  return Object.keys(permutations[0]).length === 0 ? [] : permutations;
};

export const variationOptionsEqual = (
  options1: Variation["options"],
  options2: Variation["options"],
) => {
  if (options1 == null && options2 == null) {
    return true;
  }

  if (options1 == null || options2 == null) {
    return false;
  }

  const optionNames1 = Object.keys(options1);
  const optionNames2 = Object.keys(options2);
  if (optionNames1.length !== optionNames2.length) {
    return false;
  }

  return optionNames1.every((name) => {
    const value1 = options1[name];
    const value2 = options2[name];

    if (value2 == null || value1.length !== value2.length) {
      return false;
    }

    const sortedValue1 = [...value1].sort();
    const sortedValue2 = [...value2].sort();

    return sortedValue1.every((value, index) => value === sortedValue2[index]);
  });
};

export const TOP_SELLER_MAX_GMV_RANK = 10;

export type CustomsLogisticsInput = Pick<
  VariationInput,
  | "originCountry"
  | "declaredValue"
  | "declaredName"
  | "declaredLocalName"
  | "pieces"
  | "image"
  | "weight"
  | "height"
  | "length"
  | "width"
  | "hasPowder"
  | "hasLiquid"
  | "hasBattery"
  | "hasMetal"
  | "customsHsCode"
>;

export const CustomsLogisticsLengthUnit: LengthUnit = "CENTIMETER";
export const CustomsLogisticsWeightUnit: WeightUnit = "GRAM";

export type MeasurementType = "AREA" | "WEIGHT" | "LENGTH" | "VOLUME" | "COUNT";

const VolumeOptionOrder: ReadonlyArray<VolumeUnit> = [
  "LITER",
  "CENTILITER",
  "MILLILITER",
  "CUBICMETER",
  "GALLON",
  "FLUID_OUNCE",
  "PINT",
  "QUART",
];

const AreaOptionOrder: ReadonlyArray<AreaUnit> = [
  "SQUARE_METER",
  "SQUARE_FOOT",
];
const CountOptionOrder: ReadonlyArray<CountUnit> = [
  "COUNT",
  "LOAD",
  "POD",
  "ROLL",
  "WASH",
];
const LengthOptionOrder: ReadonlyArray<LengthUnit> = [
  "CENTIMETER",
  "METER",
  "INCH",
  "FEET",
  "YARD",
];
const WeightOptionOrder: ReadonlyArray<WeightUnit> = [
  "GRAM",
  "MILLIGRAM",
  "KILOGRAM",
  "OUNCE",
  "POUND",
];

type UnitOfMeasurement<T extends MeasurementType> = T extends "AREA"
  ? AreaUnit
  : T extends "VOLUME"
  ? VolumeUnit
  : T extends "COUNT"
  ? CountUnit
  : T extends "LENGTH"
  ? LengthUnit
  : WeightUnit;

const MeasurementTypeOptionOrder: ReadonlyArray<MeasurementType> = [
  "VOLUME",
  "AREA",
  "COUNT",
  "LENGTH",
  "WEIGHT",
];

export const MeasurementTypeDisplayNames: {
  readonly [T in MeasurementType]: string;
} = {
  VOLUME: ci18n("measurement type", "Volume"),
  AREA: ci18n("measurement type", "Area"),
  COUNT: ci18n("measurement type", "Per unit"),
  LENGTH: ci18n("measurement type", "Length"),
  WEIGHT: ci18n("measurement type", "Weight"),
};

export const MeasurementTypeOptions: ReadonlyArray<Option<MeasurementType>> =
  MeasurementTypeOptionOrder.map((m) => ({
    value: m,
    text: MeasurementTypeDisplayNames[m],
  }));

export const ContestWarningOptionOrder: ReadonlyArray<ContestWarningType> = [
  "CHEMICAL",
  "FOOD",
  "FURNITURE",
  "ON_PRODUCT_CANCER",
  "ON_PRODUCT_COMBINED_CANCER_REPRODUCTIVE",
  "ON_PRODUCT_REPRODUCTIVE",
  "RAW_WOOD",
  "DEP_PASSENGER_OFF_ROAD_VEHICLE",
  "DEP_RECREATIONAL_VESSEL",
  "DIESEL_ENGINE",
];

export const LEGACY_COLOR_ID = "LEGACY_COLOR";
export const LEGACY_SIZE_ID = "LEGACY_SIZE";
export const LEGACY_COLOR_DISPLAY_TEXT = ci18n(
  "Variation type, merchant customized color for a variation",
  "Custom Color",
);
export const LEGACY_SIZE_DISPLAY_TEXT = ci18n(
  "Custom variation type, custom value to distinguish a variation",
  "Custom Variation",
);

export const MAX_ALLOWED_DELIVERY_DAYS = 15;

export const ContestWarningDisplayNames: {
  readonly [T in ContestWarningType]: string;
} = {
  CHEMICAL: i18n("Chemical"),
  FOOD: i18n("Food"),
  FURNITURE: i18n("Furniture"),
  ON_PRODUCT_CANCER: i18n("On Product Cancer"),
  ON_PRODUCT_COMBINED_CANCER_REPRODUCTIVE: i18n(
    "On Product Combined Cancer Reproductive",
  ),
  ON_PRODUCT_REPRODUCTIVE: i18n("On Product Reproductive"),
  RAW_WOOD: i18n("Raw Wood"),
  DEP_PASSENGER_OFF_ROAD_VEHICLE: i18n("Passenger or Off-road Vehicle"),
  DEP_RECREATIONAL_VESSEL: i18n("Recreational Vessel"),
  DIESEL_ENGINE: i18n("Diesel Engine"),
};

export type Unit = VolumeUnit | AreaUnit | CountUnit | LengthUnit | WeightUnit;

export type UnitDisplayInfo = {
  readonly name: string;
  readonly symbol: string;
};

export const VolumeUnitDisplayNames: {
  readonly [volume in VolumeUnit]: UnitDisplayInfo;
} = {
  LITER: {
    name: ci18n("A volume measurement", "Liter"),
    symbol: ci18n("Abbreviation for the volume measurement 'liter'", "l"),
  },
  CENTILITER: {
    name: ci18n("A volume measurement", "Centiliter"),
    symbol: ci18n("Abbreviation for the volume measurement 'centiliter'", "cl"),
  },
  CUBICMETER: {
    name: ci18n("A volume measurement", "Cubic meter"),
    symbol: ci18n(
      "Abbreviation for the volume measurement 'cubic' meter",
      "cu m",
    ),
  },
  FLUID_OUNCE: {
    name: ci18n("A volume measurement", "Fluid ounce"),
    symbol: ci18n(
      "Abbreviation for the volume measurement 'fluid' ounce",
      "fl oz",
    ),
  },
  GALLON: {
    name: ci18n("A volume measurement", "Gallon"),
    symbol: ci18n("Abbreviation for the volume measurement 'gallon'", "gal"),
  },
  MILLILITER: {
    name: ci18n("A volume measurement", "Milliliter"),
    symbol: ci18n("Abbreviation for the volume measurement 'milliliter'", "ml"),
  },
  PINT: {
    name: ci18n("A volume measurement", "Pint"),
    symbol: ci18n("Abbreviation for the volume measurement 'pint'", "pt"),
  },
  QUART: {
    name: ci18n("A volume measurement", "Quart"),
    symbol: ci18n("Abbreviation for the volume measurement 'quart'", "qt"),
  },
};

export const AreaUnitDisplayNames: {
  readonly [area in AreaUnit]: UnitDisplayInfo;
} = {
  SQUARE_METER: {
    name: ci18n("An area measurement", "Square meter"),
    symbol: ci18n("Abbreviation for the area measurement square meter", "sq m"),
  },
  SQUARE_FOOT: {
    name: ci18n("An area measurement", "Square foot"),
    symbol: ci18n("Abbreviation for the area measurement square foot", "sq ft"),
  },
};

export const CountUnitDisplayNames: {
  readonly [count in CountUnit]: UnitDisplayInfo;
} = {
  COUNT: {
    name: ci18n(
      "A measurement of how many units of something are in a product",
      "Count",
    ),
    symbol: ci18n(
      "A measurement of how many units of something are in a product",
      "counts",
    ),
  },
  LOAD: {
    name: ci18n(
      "A measurement of how many loads of work a product can do, e.g. how many laundry loads",
      "Load",
    ),
    symbol: ci18n(
      "A measurement of how many loads of work a product can do, e.g. how many laundry loads",
      "loads",
    ),
  },
  POD: {
    name: ci18n(
      "A measurement of how many pods are in a product, e.g. 5 dishwasher soap pods",
      "Pod",
    ),
    symbol: ci18n(
      "A measurement of how many pods are in a product, e.g. 5 dishwasher soap pods",
      "pods",
    ),
  },
  ROLL: {
    name: ci18n(
      "A measurement of how many rolls are in a product, e.g. 8 paper towel rolls",
      "Roll",
    ),
    symbol: ci18n(
      "A measurement of how many rolls are in a product, e.g. 8 paper towel rolls",
      "rolls",
    ),
  },
  WASH: {
    name: ci18n(
      "A measurement of how many washes a product can do, e.g. 5 dishwasher washes",
      "Wash",
    ),
    symbol: ci18n(
      "A measurement of how many washes a product can do, e.g. 5 dishwasher washes",
      "washes",
    ),
  },
};

export const LengthUnitDisplayNames: {
  readonly [length in LengthUnit]: UnitDisplayInfo;
} = {
  METER: {
    name: ci18n("A length measurement", "Meter"),
    symbol: ci18n("Abbreviation for the length measurement 'meter'", "m"),
  },
  CENTIMETER: {
    name: ci18n("A length measurement", "Centimeter"),
    symbol: ci18n("Abbreviation for the length measurement 'centimeter'", "cm"),
  },
  INCH: {
    name: ci18n("A length measurement", "Inch"),
    symbol: ci18n("Abbreviation for the length measurement 'inch'", "in"),
  },
  FEET: {
    name: ci18n("A length measurement", "Feet"),
    symbol: ci18n("Abbreviation for the length measurement 'feet'", "ft"),
  },
  YARD: {
    name: ci18n("A length measurement", "Yard"),
    symbol: ci18n("Abbreviation for the length measurement 'yard'", "yd"),
  },
};

export const WeightUnitDisplayNames: {
  readonly [weight in WeightUnit]: UnitDisplayInfo;
} = {
  GRAM: {
    name: ci18n("A weight measurement", "Gram"),
    symbol: ci18n("Abbreviation for the weight measurement 'gram'", "g"),
  },
  KILOGRAM: {
    name: ci18n("A weight measurement", "Kilogram"),
    symbol: ci18n("Abbreviation for the weight measurement 'kilogram'", "kg"),
  },
  MILLIGRAM: {
    name: ci18n("A weight measurement", "Milligram"),
    symbol: ci18n("Abbreviation for the weight measurement 'milligram'", "mg"),
  },
  OUNCE: {
    name: ci18n("A weight measurement", "Ounce"),
    symbol: ci18n("Abbreviation for the weight measurement 'ounce'", "oz"),
  },
  POUND: {
    name: ci18n("A weight measurement", "Pound"),
    symbol: ci18n("Abbreviation for the weight measurement 'pound'", "lb"),
  },
};

export const unitDisplayName = (unit: Unit) => {
  return (
    VolumeUnitDisplayNames[unit as VolumeUnit] ||
    AreaUnitDisplayNames[unit as AreaUnit] ||
    CountUnitDisplayNames[unit as CountUnit] ||
    LengthUnitDisplayNames[unit as LengthUnit] ||
    WeightUnitDisplayNames[unit as WeightUnit]
  );
};

export const MeasurementOptions: {
  readonly [T in MeasurementType]: ReadonlyArray<Option<UnitOfMeasurement<T>>>;
} = {
  VOLUME: VolumeOptionOrder.map((unit) => ({
    value: unit,
    text: VolumeUnitDisplayNames[unit].name,
  })),
  AREA: AreaOptionOrder.map((unit) => ({
    value: unit,
    text: AreaUnitDisplayNames[unit].name,
  })),
  COUNT: CountOptionOrder.map((unit) => ({
    value: unit,
    text: CountUnitDisplayNames[unit].name,
  })),
  LENGTH: LengthOptionOrder.map((unit) => ({
    value: unit,
    text: LengthUnitDisplayNames[unit].name,
  })),
  WEIGHT: WeightOptionOrder.map((unit) => ({
    value: unit,
    text: WeightUnitDisplayNames[unit].name,
  })),
};
