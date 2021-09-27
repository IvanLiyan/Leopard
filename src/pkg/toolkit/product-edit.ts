import {
  Region,
  Country,
  Datetime,
  BrandSchema,
  ImageSchema,
  MerchantSchema,
  CurrencyValue,
  ProductSchema,
  VariationSchema,
  InventorySchema,
  CountryShippingSchema,
  DefaultShippingSchema,
  ProductCatalogSchema,
  ShippingProfileSchema,
  WishExpressCountryDetails,
  WarehouseCountryShippingSchema,
  CommerceProductCondition,
  ProductCategoryDisputeSchema,
  TrueTagSchema,
  VolumeUnit,
  AreaUnit,
  CountUnit,
  LengthUnit,
  WeightUnit,
  Weight,
  Length,
  Volume,
  Area,
  Count,
} from "@schema/types";
import { IconName } from "@ContextLogic/zeus";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import { ci18n } from "@legacy/core/i18n";

export type MeasurementType = "AREA" | "WEIGHT" | "LENGTH" | "VOLUME" | "COUNT";

export type Unit = VolumeUnit | AreaUnit | CountUnit | LengthUnit | WeightUnit;

export type UnitDisplayInfo = {
  readonly name: string;
  readonly symbol: string;
};

export const VolumeUnitDisplayNames: {
  readonly [volume in VolumeUnit]: UnitDisplayInfo;
} = {
  LITER: {
    name: i`Liter`,
    symbol: ci18n("Abbreviation for liter", "l"),
  },
  CENTILITER: {
    name: i`Centiliter`,
    symbol: ci18n("Abbreviation for centiliter", "cl"),
  },
  CUBICMETER: {
    name: i`Cubic meter`,
    symbol: ci18n("Abbreviation for cubic meter", "cu m"),
  },
  FLUID_OUNCE: {
    name: i`Fluid ounce`,
    symbol: ci18n("Abbreviation for fluid ounce", "fl oz"),
  },
  GALLON: {
    name: i`Gallon`,
    symbol: ci18n("Abbreviation for gallon", "gal"),
  },
  MILLILITER: {
    name: i`Milliliter`,
    symbol: ci18n("Abbreviation for milliliter", "ml"),
  },
  PINT: {
    name: i`Pint`,
    symbol: ci18n("Abbreviation for pint", "pt"),
  },
  QUART: {
    name: i`Quart`,
    symbol: ci18n("Abbreviation for quart", "qt"),
  },
};

export const AreaUnitDisplayNames: {
  readonly [area in AreaUnit]: UnitDisplayInfo;
} = {
  SQUARE_METER: {
    name: i`Square meter`,
    symbol: ci18n("Abbreviation for square meter", "sq m"),
  },
  SQUARE_FOOT: {
    name: i`Square foot`,
    symbol: ci18n("Abbreviation for square foot", "sq ft"),
  },
};

export const CountUnitDisplayNames: {
  readonly [count in CountUnit]: UnitDisplayInfo;
} = {
  COUNT: {
    name: i`Count`,
    symbol: i`counts`,
  },
  LOAD: {
    name: i`Load`,
    symbol: i`loads`,
  },
  POD: {
    name: i`Pod`,
    symbol: i`pods`,
  },
  ROLL: {
    name: i`Roll`,
    symbol: i`rolls`,
  },
  WASH: {
    name: i`Wash`,
    symbol: i`washes`,
  },
};

export const LengthUnitDisplayNames: {
  readonly [length in LengthUnit]: UnitDisplayInfo;
} = {
  METER: {
    name: i`Meter`,
    symbol: ci18n("Abbreviation for meter", "m"),
  },
  CENTIMETER: {
    name: i`Centimeter`,
    symbol: ci18n("Abbreviation for centimeter", "cm"),
  },
  INCH: {
    name: i`Inch`,
    symbol: ci18n("Abbreviation for inch", "in"),
  },
  FEET: {
    name: i`Feet`,
    symbol: ci18n("Abbreviation for feet", "ft"),
  },
  YARD: {
    name: i`Yard`,
    symbol: ci18n("Abbreviation for yard", "yd"),
  },
};

export const WeightUnitDisplayNames: {
  readonly [weight in WeightUnit]: UnitDisplayInfo;
} = {
  GRAM: {
    name: i`Gram`,
    symbol: ci18n("Abbreviation for gram", "g"),
  },
  KILOGRAM: {
    name: i`Kilogram`,
    symbol: ci18n("Abbreviation for kilogram", "kg"),
  },
  MILLIGRAM: {
    name: i`Milligram`,
    symbol: ci18n("Abbreviation for milligram", "mg"),
  },
  OUNCE: {
    name: i`Ounce`,
    symbol: ci18n("Abbreviation for ounce", "oz"),
  },
  POUND: {
    name: i`Pound`,
    symbol: ci18n("Abbreviation for pound", "lb"),
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
  VOLUME: i`Volume`,
  AREA: i`Area`,
  COUNT: i`Per unit`,
  LENGTH: i`Length`,
  WEIGHT: i`Weight`,
};

export const MeasurementTypeOptions: ReadonlyArray<Option<MeasurementType>> =
  MeasurementTypeOptionOrder.map((m) => ({
    value: m,
    text: MeasurementTypeDisplayNames[m],
  }));

export type PickedShippingProfileSchema = Pick<
  ShippingProfileSchema,
  "id" | "name" | "description"
>;

export type PickedImage = Pick<ImageSchema, "id" | "wishUrl" | "isCleanImage">;
export type PickedShippingSettingsSchema = {
  readonly country: Pick<Country, "name" | "code">;
};

export type PickedWishExpressCountries = Pick<Country, "code">;
export type PickedCountryWeShipTo = Pick<
  Country,
  "code" | "name" | "gmvRank" | "isInEurope"
> & {
  readonly wishExpress: Pick<
    WishExpressCountryDetails,
    "supportsWishExpress" | "expectedTimeToDoor"
  >;
};

export type PickedInventory = Pick<
  InventorySchema,
  "warehouseId" | "shippingType" | "count"
>;

export type VariationInitialState = Pick<
  VariationSchema,
  "sku" | "size" | "color" | "id" | "customsHsCode" | "weight"
> & {
  readonly image: PickedImage;
  readonly inventory: ReadonlyArray<PickedInventory>;
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly quantityWeight?: Pick<Weight, "value"> | null | undefined;
  readonly quantityLength?: Pick<Length, "value"> | null | undefined;
  readonly quantityVolume?: Pick<Volume, "value"> | null | undefined;
  readonly quantityArea?: Pick<Area, "value"> | null | undefined;
  readonly quantityUnit?: Pick<Count, "value"> | null | undefined;
};

export type PickedBrandSchema = Pick<
  BrandSchema,
  "id" | "displayName" | "logoUrl"
>;

export type RegionPick = Pick<Region, "name" | "code">;

export type PickedDefaultShippingSchema = Pick<
  DefaultShippingSchema,
  "warehouseId"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode">;
};

export type PickedCountryShippingSchema = Pick<
  CountryShippingSchema,
  "enabled"
> & {
  readonly country: Pick<Country, "name" | "code">;
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode"> | null;
};

export type PickedWarehouseCountryShippingSchema = Pick<
  WarehouseCountryShippingSchema,
  "shippingType"
> & {
  readonly countryShipping:
    | ReadonlyArray<PickedCountryShippingSchema>
    | undefined
    | null;
};

export type InitialProductState = Pick<
  ProductSchema,
  | "id"
  | "sku"
  | "name"
  | "tags"
  | "enabled"
  | "description"
  | "createTime"
  | "upc"
  | "reviewStatus"
  | "isRemovedByWish"
  | "condition"
  | "eligibleForCategoryDispute"
> & {
  readonly variations: ReadonlyArray<VariationInitialState>;
  readonly requestedBrand: PickedBrandSchema | undefined | null;
  readonly mainImage: PickedImage;
  readonly extraImages: ReadonlyArray<PickedImage>;
  readonly lastUpdateTime: Pick<Datetime, "formatted">;
  readonly createTime: Pick<Datetime, "formatted">;
  readonly shipping: {
    readonly defaultShipping:
      | null
      | undefined
      | ReadonlyArray<PickedDefaultShippingSchema>;
    readonly warehouseCountryShipping:
      | null
      | undefined
      | ReadonlyArray<PickedWarehouseCountryShippingSchema>;
  };
  readonly msrp:
    | Pick<CurrencyValue, "amount" | "currencyCode">
    | null
    | undefined;
  readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">> | null;
  readonly referenceWeight?: Pick<Weight, "value" | "unit"> | null | undefined;
  readonly referenceLength?: Pick<Length, "value" | "unit"> | null | undefined;
  readonly referenceVolume?: Pick<Volume, "value" | "unit"> | null | undefined;
  readonly referenceArea?: Pick<Area, "value" | "unit"> | null | undefined;
  readonly referenceUnit?: Pick<Count, "value" | "unit"> | null | undefined;
};

export type PickedShippingProfile = Pick<ShippingProfileSchema, "id" | "name">;

export type ProductEditInitialData = {
  readonly platformConstants: {
    readonly wishExpressCountries: ReadonlyArray<PickedWishExpressCountries>;
    readonly countriesWeShipTo: ReadonlyArray<PickedCountryWeShipTo>;
  };

  readonly policy?: {
    readonly productCategoryDispute?: {
      readonly disputes?: ReadonlyArray<
        Pick<ProductCategoryDisputeSchema, "id">
      > | null;
    } | null;
  } | null;

  readonly currentMerchant: Pick<
    MerchantSchema,
    | "standardWarehouseId"
    | "primaryCurrency"
    | "isStoreMerchant"
    | "canManageShipping"
  > & {
    readonly shippingSettings: ReadonlyArray<PickedShippingSettingsSchema>;
  };
  readonly productCatalog: Pick<ProductCatalogSchema, "productCount"> & {
    readonly product: InitialProductState | null | undefined;
  };
};

export const ConditionDisplay: {
  readonly [condition in CommerceProductCondition]: string;
} = {
  NEW: i`New`,
  USED: i`Used`,
  REFURBISHED: i`Refurbished`,
};

export const PreviewTypes = ["MOBILE", "WEB"] as const;

export type PreviewType = typeof PreviewTypes[number];

export const PreviewTypeIconMap: {
  readonly [preview in PreviewType]: IconName;
} = {
  MOBILE: "smartphone",
  WEB: "ticket", // temporary, need a zeus icon for this
};
