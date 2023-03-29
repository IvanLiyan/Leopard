import { ci18n, i18n } from "@core/toolkit/i18n";
import {
  ContestWarningType,
  VolumeUnit,
  AreaUnit,
  CountUnit,
  LengthUnit,
  WeightUnit,
} from "@schema";

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
