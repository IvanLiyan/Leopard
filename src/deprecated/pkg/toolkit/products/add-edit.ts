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
  ProductUpsertInput,
  VariationInput,
  RegionShippingSchema,
  GtinProductServiceSchemaProductArgs,
  GtinProductSchema,
  GtinVariationSchema,
  PaymentCurrencyCode,
  BrandServiceSchemaTrueBrandsArgs,
  UserGateSchema,
} from "@schema/types";
import { IconName } from "@ContextLogic/zeus";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import { ci18n } from "@legacy/core/i18n";
import gql from "graphql-tag";

export type PickedShippingProfileSchema = Pick<
  ShippingProfileSchema,
  "id" | "name" | "description"
>;

export type PickedRegion = Pick<Region, "code" | "name">;

export type PickedImage = Pick<ImageSchema, "id" | "wishUrl" | "isCleanImage">;
export type PickedShippingSettingsSchema = {
  readonly country: Pick<Country, "name" | "code" | "gmvRank"> & {
    readonly regions?: ReadonlyArray<PickedRegion> | null | undefined;
    readonly wishExpress: Pick<WishExpressCountryDetails, "expectedTimeToDoor">;
  };
};

export type PickedInventory = Pick<
  InventorySchema,
  "warehouseId" | "shippingType" | "count"
>;

export type VariationInitialState = Pick<
  VariationSchema,
  | "sku"
  | "size"
  | "color"
  | "id"
  | "customsHsCode"
  | "gtin"
  | "declaredName"
  | "declaredLocalName"
  | "pieces"
  | "hasPowder"
  | "hasLiquid"
  | "hasBattery"
  | "hasMetal"
> & {
  readonly height?: Pick<Length, "value"> | null;
  readonly length?: Pick<Length, "value"> | null;
  readonly width?: Pick<Length, "value"> | null;
  readonly weight?: Pick<Weight, "value"> | null;
  readonly effectiveWeight?: Pick<Weight, "value"> | null;
  readonly image: PickedImage;
  readonly inventory: ReadonlyArray<PickedInventory>;
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly quantityWeight?: Pick<Weight, "value"> | null | undefined;
  readonly quantityLength?: Pick<Length, "value"> | null | undefined;
  readonly quantityVolume?: Pick<Volume, "value"> | null | undefined;
  readonly quantityArea?: Pick<Area, "value"> | null | undefined;
  readonly quantityUnit?: Pick<Count, "value"> | null | undefined;
  readonly originCountry?: Pick<Country, "code">;
  readonly declaredValue?: Pick<CurrencyValue, "amount"> | null;
};

export type PickedBrandSchema = Pick<
  BrandSchema,
  "id" | "displayName" | "logoUrl"
>;

export type PickedDefaultShippingSchema = Pick<
  DefaultShippingSchema,
  "warehouseId"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode">;
};

export type PickedRegionShippingSchema = Pick<
  RegionShippingSchema,
  "enabled" | "timeToDoor"
> & {
  readonly region: Pick<Region, "name" | "code">;
  readonly price?: Pick<CurrencyValue, "amount"> | null;
};

export type PickedCountryShippingSchema = Pick<
  CountryShippingSchema,
  "enabled" | "timeToDoor" | "wishExpressTtdRequirement"
> & {
  readonly country: Pick<Country, "name" | "code" | "gmvRank"> & {
    readonly regions?: ReadonlyArray<PickedRegion> | null | undefined;
  };
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode"> | null;
  readonly regionShipping?: ReadonlyArray<PickedRegionShippingSchema> | null;
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
  | "maxQuantity"
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

export type AddEditProductInitialData = {
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
    | "isCnMerchant"
  > & {
    readonly shippingSettings: ReadonlyArray<PickedShippingSettingsSchema>;
  };

  readonly currentUser: {
    readonly gating: {
      readonly useCalculatedShipping: UserGateSchema["isAllowed"];
    };
  };

  readonly productCatalog: Pick<ProductCatalogSchema, "productCount"> & {
    readonly product: InitialProductState | null | undefined;
  };
};

export const GET_GTIN_PRODUCT_QUERY = gql`
  query AddEdit_GetGtinProductQuery(
    $gtins: [String!]!
    $currency: PaymentCurrencyCode!
  ) {
    productCatalog {
      gtinProductService {
        product(gtins: $gtins) {
          title
          description
          imageUrls
          wishBrand {
            displayName
          }
          variations {
            gtin
            color
            size
            imageUrls
            length {
              value(targetUnit: CENTIMETER)
              unit
            }
            width {
              value(targetUnit: CENTIMETER)
              unit
            }
            height {
              value(targetUnit: CENTIMETER)
              unit
            }
            weight {
              value(targetUnit: GRAM)
              unit
            }
            price {
              convertedTo(currency: $currency, rate: MKL_POLICY) {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export type PickedGtinVariation = Pick<
  GtinVariationSchema,
  "color" | "size" | "imageUrls" | "gtin"
> & {
  readonly length?: Pick<Length, "value"> | null;
  readonly width?: Pick<Length, "value"> | null;
  readonly height?: Pick<Length, "value"> | null;
  readonly weight?: Pick<Weight, "value"> | null;
  readonly price?: {
    readonly convertedTo: Pick<CurrencyValue, "amount" | "currencyCode">;
  } | null;
};

export type PickedGtinProduct = Pick<
  GtinProductSchema,
  "title" | "description" | "imageUrls"
> & {
  readonly wishBrand?: Pick<BrandSchema, "displayName"> | null;
  readonly variations?: ReadonlyArray<PickedGtinVariation> | null;
};

export type GetGtinProductQueryRequest = GtinProductServiceSchemaProductArgs & {
  readonly currency: PaymentCurrencyCode;
};
export type GetGtinProductQueryResponse = {
  readonly productCatalog?: {
    readonly gtinProductService: {
      readonly product?: PickedGtinProduct | null;
    };
  } | null;
};

export const GET_BRAND_MATCH = gql`
  query GetBrandMatch($brandName: String!) {
    brand {
      trueBrands(brandName: $brandName, count: 1) {
        id
        displayName
        logoUrl
      }
    }
  }
`;

export type PickedBrand = Pick<BrandSchema, "id" | "displayName" | "logoUrl">;

export type GetBrandMatchRequest = BrandServiceSchemaTrueBrandsArgs;

export type GetBrandMatchResponse = {
  readonly brand: {
    readonly trueBrands: ReadonlyArray<PickedBrand>;
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
  sizesList: ReadonlyArray<string>
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
    []
  );
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
      "cu m"
    ),
  },
  FLUID_OUNCE: {
    name: ci18n("A volume measurement", "Fluid ounce"),
    symbol: ci18n(
      "Abbreviation for the volume measurement 'fluid' ounce",
      "fl oz"
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
      "Count"
    ),
    symbol: ci18n(
      "A measurement of how many units of something are in a product",
      "counts"
    ),
  },
  LOAD: {
    name: ci18n(
      "A measurement of how many loads of work a product can do, e.g. how many laundry loads",
      "Load"
    ),
    symbol: ci18n(
      "A measurement of how many loads of work a product can do, e.g. how many laundry loads",
      "loads"
    ),
  },
  POD: {
    name: ci18n(
      "A measurement of how many pods are in a product, e.g. 5 dishwasher soap pods",
      "Pod"
    ),
    symbol: ci18n(
      "A measurement of how many pods are in a product, e.g. 5 dishwasher soap pods",
      "pods"
    ),
  },
  ROLL: {
    name: ci18n(
      "A measurement of how many rolls are in a product, e.g. 8 paper towel rolls",
      "Roll"
    ),
    symbol: ci18n(
      "A measurement of how many rolls are in a product, e.g. 8 paper towel rolls",
      "rolls"
    ),
  },
  WASH: {
    name: ci18n(
      "A measurement of how many washes a product can do, e.g. 5 dishwasher washes",
      "Wash"
    ),
    symbol: ci18n(
      "A measurement of how many washes a product can do, e.g. 5 dishwasher washes",
      "washes"
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
