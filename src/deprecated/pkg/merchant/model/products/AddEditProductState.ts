/* External Libraries */
import { observable, computed, toJS, action } from "mobx";
import gql from "graphql-tag";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import uniqWith from "lodash/uniqWith";
import uniqueId from "lodash/uniqueId";
import isInteger from "lodash/isInteger";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import xor from "lodash/xor";
import { ci18n } from "@legacy/core/i18n";
import {
  Region,
  ImageInput,
  CountryCode,
  RemoveProduct,
  UpsertProduct,
  CurrencyInput,
  InventoryInput,
  VariationInput,
  RemoveProductInput,
  ProductUpsertInput,
  PaymentCurrencyCode,
  WeightInput,
  DefaultShippingInput,
  CountryShippingInput,
  WarehouseCountryShippingInput,
  ProductCatalogMutationsUpsertProductArgs,
  AreaUnit,
  LengthUnit,
  CountUnit,
  VolumeUnit,
  WeightUnit,
  Country,
  WishExpressCountryDetails,
  RegionShippingInput,
  LengthInput,
} from "@schema/types";
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";
import { Validator, ValidationResponse } from "@toolkit/validators";
import countries from "@toolkit/countries";

import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";
import {
  PickedImage,
  InitialProductState,
  PickedBrandSchema,
  VariationInitialState,
  PickedShippingSettingsSchema,
  PickedCountryShippingSchema,
  MeasurementType,
  Unit,
  MeasurementOptions,
  getPermutations,
  UnitPriceInput,
  VariationsInput,
  PickedRegion,
  CustomsLogisticsInput,
  CustomsLogisticsWeightUnit,
  CustomsLogisticsLengthUnit,
} from "@toolkit/products/add-edit";

const UPSERT_PRODUCT_MUTATION = gql`
  mutation ProductEditState_EditOrCreateProduct($input: ProductUpsertInput!) {
    productCatalog {
      upsertProduct(input: $input) {
        ok
        message
        productId
      }
    }
  }
`;

const REMOVE_PRODUCT_MUTATION = gql`
  mutation ProductEditState_RemoveProduct($input: RemoveProductInput!) {
    productCatalog {
      removeProduct(input: $input) {
        ok
        message
      }
    }
  }
`;

// ====================================
// CountryShipping
// ====================================

export type RegionShipping = {
  readonly code: Region["code"];
  readonly name: Region["name"];
  readonly wishExpressMaxDeliveryDaysRequirement: WishExpressCountryDetails["expectedTimeToDoor"];
  readonly shippingPrice: number | null | undefined;
  readonly maxDeliveryDays: number | null | undefined;
  readonly enabled: boolean | null | undefined;
  readonly hasEditedShippingPrice: boolean;
  readonly hasEditedMaxDeliveryDays: boolean;
};

export type CountryShipping = {
  readonly countryCode: CountryCode;
  readonly gmvRank: Country["gmvRank"];
  readonly wishExpressMaxDeliveryDaysRequirement: WishExpressCountryDetails["expectedTimeToDoor"];
  readonly shippingPrice: number | null | undefined;
  readonly enabled: boolean | null | undefined;
  readonly maxDeliveryDays: number | null | undefined;
  readonly regionShipping: ReadonlyMap<Region["code"], RegionShipping>;
  readonly hasEditedShippingPrice: boolean;
  readonly hasEditedMaxDeliveryDays: boolean;
};

const createInitialRegionShippingMap = ({
  regions,
  enabled,
  wishExpressMaxDeliveryDaysRequirement,
}: {
  readonly regions: ReadonlyArray<PickedRegion>;
  readonly enabled?: boolean;
  readonly wishExpressMaxDeliveryDaysRequirement: WishExpressCountryDetails["expectedTimeToDoor"];
}): ReadonlyMap<Region["code"], RegionShipping> => {
  const regionMap: Map<Region["code"], RegionShipping> = new Map();
  regions.forEach(({ code, name }) => {
    regionMap.set(code, {
      code,
      name,
      shippingPrice: undefined,
      maxDeliveryDays: undefined,
      enabled: enabled != null ? enabled : true,
      hasEditedShippingPrice: false,
      hasEditedMaxDeliveryDays: false,
      wishExpressMaxDeliveryDaysRequirement,
    });
  });
  return regionMap;
};

export const createCountryShipping = ({
  countryShipping,
  countryCode,
  wishExpressMaxDeliveryDaysRequirement,
  gmvRank,
  initialState,
}: {
  readonly countryCode: CountryCode;
  readonly gmvRank: CountryShipping["gmvRank"];
  readonly wishExpressMaxDeliveryDaysRequirement: WishExpressCountryDetails["expectedTimeToDoor"];
  readonly countryShipping?: PickedCountryShippingSchema | null | undefined;
  readonly initialState?: Partial<CountryShipping>;
}): CountryShipping => {
  const regionShipping = new Map();
  if (countryShipping != null && countryShipping.regionShipping != null) {
    countryShipping.regionShipping.forEach(
      ({ region: { code, name }, price, timeToDoor, enabled: rsEnabled }) => {
        if (!regionShipping.has(code)) {
          regionShipping.set(code, {
            code,
            name,
            shippingPrice: price == null ? undefined : price.amount,
            maxDeliveryDays: timeToDoor,
            enabled: rsEnabled,
            hasEditedShippingPrice: false,
            hasEditedMaxDeliveryDays: false,
            wishExpressMaxDeliveryDaysRequirement,
          });
        }
      }
    );
  }
  const csEnabled = countryShipping?.enabled ?? true;
  if (countryShipping != null && countryShipping.country.regions != null) {
    countryShipping.country.regions.forEach(({ code, name }) => {
      if (!regionShipping.has(code)) {
        regionShipping.set(code, {
          code,
          name,
          shippingPrice: undefined,
          maxDeliveryDays: undefined,
          enabled: csEnabled,
          hasEditedShippingPrice: false,
          hasEditedMaxDeliveryDays: false,
          wishExpressMaxDeliveryDaysRequirement,
        });
      }
    });
  }
  return {
    countryCode,
    gmvRank,
    enabled: csEnabled,
    shippingPrice: countryShipping?.price?.amount,
    hasEditedShippingPrice: false,
    maxDeliveryDays: countryShipping?.timeToDoor,
    hasEditedMaxDeliveryDays: false,
    wishExpressMaxDeliveryDaysRequirement,
    regionShipping,
    ...initialState,
  };
};

const countryShippingErrorMessage = (
  countryShipping: CountryShipping
): string | undefined => {
  const { shippingPrice, countryCode } = countryShipping;
  if (shippingPrice != null && isNaN(shippingPrice)) {
    return (
      i`Please provide a shipping price for ${countryCode} ` +
      i`or disable shipping to this country`
    );
  }
  return undefined;
};

export const regionShippingHasWishExpress = (rs: RegionShipping): boolean => {
  return (
    rs.maxDeliveryDays != null &&
    rs.wishExpressMaxDeliveryDaysRequirement != null &&
    rs.maxDeliveryDays <= rs.wishExpressMaxDeliveryDaysRequirement
  );
};

export const countryShippingHasWishExpress = (cs: CountryShipping): boolean => {
  return (
    cs.maxDeliveryDays != null &&
    cs.wishExpressMaxDeliveryDaysRequirement != null &&
    cs.maxDeliveryDays <= cs.wishExpressMaxDeliveryDaysRequirement
  );
};

const regionShippingAsInput = (
  rs: RegionShipping,
  currency: PaymentCurrencyCode
): RegionShippingInput => {
  return {
    regionCode: rs.code,
    enabled: rs.enabled,
    price:
      rs.shippingPrice == null
        ? null
        : {
            amount: rs.shippingPrice,
            currencyCode: currency,
          },
    timeToDoor: rs.maxDeliveryDays,
  };
};

const countryShippingAsInput = (
  cs: CountryShipping,
  currency: PaymentCurrencyCode
): CountryShippingInput => {
  return {
    countryCode: cs.countryCode,
    enabled: cs.enabled,
    price:
      cs.shippingPrice == null
        ? null
        : {
            amount: cs.shippingPrice,
            currencyCode: currency,
          },
    timeToDoor: cs.maxDeliveryDays,
    regionShipping: Array.from(cs.regionShipping.values())
      .map((rs) => regionShippingAsInput(rs, currency))
      .filter((rs) => rs != null) as ReadonlyArray<RegionShippingInput>,
  };
};

const countryShippingHasChanged = (
  current: CountryShipping,
  initial: PickedCountryShippingSchema
): boolean => {
  if (current.shippingPrice != initial.price?.amount) {
    return true;
  }
  if (current.enabled != initial.enabled) {
    return true;
  }
  if (current.maxDeliveryDays != initial.timeToDoor) {
    return true;
  }
  if (
    Array.from(current.regionShipping.values()).some(
      ({ code, shippingPrice, maxDeliveryDays, enabled }) => {
        const initialRegion = (initial.regionShipping || []).find(
          ({ region: { code: initialCode } }) => initialCode == code
        );
        if (initialRegion == null) {
          return true;
        }
        if (shippingPrice != initialRegion.price?.amount) {
          return true;
        }
        if (maxDeliveryDays != initialRegion.timeToDoor) {
          return true;
        }
        if (enabled != initialRegion.enabled) {
          return true;
        }
        return false;
      }
    )
  ) {
    return true;
  }
  return false;
};

// ====================================
// CustomsLogistics
// ====================================

export type CustomsLogistics = {
  readonly countryOfOrigin?: CountryCode | null;
  readonly declaredName?: string | null;
  readonly declaredLocalName?: string | null;
  readonly customsDeclaredValue?: number | null;
  readonly customsHsCode?: string | null;
  readonly piecesIncluded?: number | null;
  readonly length?: number | null;
  readonly width?: number | null;
  readonly height?: number | null;
  readonly weight?: number | null;
  readonly effectiveWeight?: number | null;
  readonly hasPowder?: boolean | null;
  readonly hasLiquid?: boolean | null;
  readonly hasBattery?: boolean | null;
  readonly hasMetal?: boolean | null;
};

export const createCustomsLogistics = (
  initialState?: Partial<CustomsLogistics>
): CustomsLogistics => {
  return initialState == null ? {} : { ...initialState };
};

export const updateCustomsLogistics = ({
  data,
  newProps,
}: {
  readonly data: CustomsLogistics;
  readonly newProps: Partial<CustomsLogistics>;
}): CustomsLogistics => {
  return {
    ...data,
    ...newProps,
  };
};

// ====================================
// Variation
// ====================================

export type Variation = {
  readonly initialState: Partial<VariationInitialState>;
  readonly clientSideId: string;
  readonly id: VariationInitialState["id"] | null | undefined;
  readonly sku: VariationInitialState["sku"] | null | undefined;
  readonly size: VariationInitialState["size"] | null | undefined;
  readonly color: VariationInitialState["color"] | null | undefined;
  readonly price: number | null | undefined;
  readonly image: VariationInitialState["image"] | null | undefined;
  readonly gtin: VariationInitialState["gtin"] | null | undefined;
  readonly quantityValue: number | null | undefined;
  readonly inventoryByWarehouseId: ReadonlyMap<string, number>;
  readonly customCustomsLogistics: CustomsLogistics | null;
};

export const createVariation = ({
  initialState,
}: {
  readonly initialState: Partial<VariationInitialState>;
}): Variation => {
  const inventoryByWarehouseId: Variation["inventoryByWarehouseId"] = new Map(
    (initialState.inventory || []).map(({ warehouseId, count }) => [
      warehouseId,
      count,
    ])
  );

  const customsLogistics = createCustomsLogistics({
    weight: initialState.weight == null ? undefined : initialState.weight.value,
    height: initialState.height == null ? undefined : initialState.height.value,
    // Effective weight's unit is kg, while weight's unit (and the UI's unit) is g.
    // We want to pass all values to the frontend in g.
    effectiveWeight:
      initialState.effectiveWeight == null
        ? undefined
        : initialState.effectiveWeight.value * 1000,
    length: initialState.length == null ? undefined : initialState.length.value,
    width: initialState.width == null ? undefined : initialState.width.value,
    customsHsCode: initialState.customsHsCode,
    countryOfOrigin:
      initialState.originCountry == null
        ? undefined
        : initialState.originCountry.code,
    customsDeclaredValue:
      initialState.declaredValue == null
        ? undefined
        : initialState.declaredValue.amount,
    declaredName: initialState.declaredName,
    declaredLocalName: initialState.declaredLocalName,
    piecesIncluded: initialState.pieces,
    hasPowder: initialState.hasPowder,
    hasLiquid: initialState.hasLiquid,
    hasBattery: initialState.hasBattery,
    hasMetal: initialState.hasMetal,
  });

  const hasCustomsLogistics =
    initialState.weight != null ||
    initialState.height != null ||
    initialState.length != null ||
    initialState.width != null ||
    initialState.customsHsCode != null ||
    initialState.originCountry != null ||
    initialState.declaredValue != null ||
    initialState.declaredName != null ||
    initialState.declaredLocalName != null ||
    initialState.pieces != null ||
    initialState.hasPowder != null ||
    initialState.hasLiquid != null ||
    initialState.hasBattery != null ||
    initialState.hasMetal != null;

  return {
    initialState,
    id: initialState.id,
    clientSideId: initialState.id == null ? uniqueId() : initialState.id,
    sku: initialState.sku,
    size: initialState.size,
    color: initialState.color,
    price: initialState.price?.amount,
    image: initialState.image,
    gtin: initialState.gtin,
    quantityValue:
      initialState.quantityArea?.value ||
      initialState.quantityLength?.value ||
      initialState.quantityUnit?.value ||
      initialState.quantityVolume?.value ||
      initialState.quantityWeight?.value ||
      undefined,
    inventoryByWarehouseId,
    customCustomsLogistics: hasCustomsLogistics ? customsLogistics : null,
  };
};

const hasVariationImageChanged = (variation: Variation): boolean => {
  const { image, initialState, id } = variation;

  return id == null || image?.wishUrl != initialState.image?.wishUrl;
};

const hasVariationChanged = (variation: Variation): boolean => {
  const {
    sku,
    size,
    color,
    price,
    initialState,
    gtin,
    customCustomsLogistics,
  } = variation;

  const countryOfOrigin =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.countryOfOrigin;
  const declaredName =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.declaredName;
  const declaredLocalName =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.declaredLocalName;
  const customsDeclaredValue =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.customsDeclaredValue;
  const customsHsCode =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.customsHsCode;
  const piecesIncluded =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.piecesIncluded;
  const length =
    customCustomsLogistics == null ? undefined : customCustomsLogistics.length;
  const width =
    customCustomsLogistics == null ? undefined : customCustomsLogistics.width;
  const height =
    customCustomsLogistics == null ? undefined : customCustomsLogistics.height;
  const weight =
    customCustomsLogistics == null ? undefined : customCustomsLogistics.weight;
  const hasPowder =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.hasPowder;
  const hasLiquid =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.hasLiquid;
  const hasBattery =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.hasBattery;
  const hasMetal =
    customCustomsLogistics == null
      ? undefined
      : customCustomsLogistics.hasMetal;

  const hasImageChange = hasVariationImageChanged(variation);

  if (gtin != initialState.gtin) {
    return true;
  }

  if (sku != initialState.sku) {
    return true;
  }

  if (price != initialState.price?.amount) {
    return true;
  }

  if (color != initialState.color) {
    return true;
  }

  if (size != initialState.size) {
    return true;
  }

  if (hasImageChange) {
    return true;
  }

  if (countryOfOrigin != initialState.originCountry?.code) {
    return true;
  }
  if (declaredName != initialState.declaredName) {
    return true;
  }
  if (declaredLocalName != initialState.declaredLocalName) {
    return true;
  }
  if (customsDeclaredValue != initialState.declaredValue) {
    return true;
  }
  if (customsHsCode != initialState.customsHsCode) {
    return true;
  }
  if (piecesIncluded != initialState.pieces) {
    return true;
  }
  if (length != initialState.length) {
    return true;
  }
  if (width != initialState.width) {
    return true;
  }
  if (height != initialState.height) {
    return true;
  }
  if (weight != initialState.weight) {
    return true;
  }
  if (hasPowder != initialState.hasPowder) {
    return true;
  }
  if (hasLiquid != initialState.hasLiquid) {
    return true;
  }
  if (hasBattery != initialState.hasBattery) {
    return true;
  }
  if (hasMetal != initialState.hasMetal) {
    return true;
  }

  return false;
};

export const setVariationInventory = ({
  variation,
  warehouseId,
  value,
}: {
  readonly variation: Variation;
  readonly value: number;
  readonly warehouseId: string;
}): Variation => {
  const newInventory: Map<string, number> =
    variation.inventoryByWarehouseId as Map<string, number>;
  newInventory.set(warehouseId, Math.max(value, 0));
  const newVariation: Variation = {
    ...variation,
    inventoryByWarehouseId: newInventory,
  };
  return newVariation;
};

export const getVariationInventory = ({
  variation,
  warehouseId,
}: {
  variation: Variation;
  warehouseId: string;
}): number | undefined => {
  return variation.inventoryByWarehouseId.get(warehouseId);
};

// ====================================
// Page State
// ====================================

export default class AddEditProductState {
  @observable
  private countryShippingStates: ReadonlyMap<CountryCode, CountryShipping> =
    new Map();

  @observable
  private defaultShippingPriceInternal: number | null | undefined;

  @observable
  canShowMaxDeliveryDays: boolean;

  @observable
  isCloning: boolean;

  @observable
  isSubmitting = false;

  @observable
  initialState: InitialProductState | null | undefined;

  @observable
  id: InitialProductState["id"] | null | undefined;

  @observable
  tags: InitialProductState["tags"] | null | undefined;

  @observable
  requestedBrand: PickedBrandSchema | null | undefined;

  @observable
  enabled: InitialProductState["enabled"] | null | undefined;

  @observable
  createTime: InitialProductState["createTime"] | null | undefined;

  @observable
  lastUpdateTime: InitialProductState["lastUpdateTime"] | null | undefined;

  @observable
  storeCountries: ReadonlyArray<PickedShippingSettingsSchema>;

  @observable
  standardWarehouseId: string;

  @observable
  canManageShipping: boolean;

  @observable
  useCalculatedShipping: boolean;

  @observable
  hasColorOrSizeVariations: boolean = false;

  @observable
  primaryCurrency: PaymentCurrencyCode;

  @observable
  forceValidation = false;

  @observable
  isStoreMerchant: boolean;

  @observable
  disputeId?: string | null;

  @observable
  maxQuantity: number | null | undefined;

  @observable
  msrp: number | null | undefined;

  @observable
  parentSku: string | null | undefined;

  @observable
  private hasVariationsInternal: boolean;

  @observable
  sizesText: string;

  @observable
  colorsText: string;

  @observable
  name: InitialProductState["name"] | null | undefined;

  @observable
  description: InitialProductState["description"] | null | undefined;

  @observable
  condition: InitialProductState["condition"] | null | undefined;

  @observable
  private imagesInternal: ReadonlyArray<PickedImage> = [];

  @observable
  showUnitPrice?: boolean;

  @observable
  measurementType?: MeasurementType;

  @observable
  unitPriceUnit?: Unit;

  @observable
  unitPrice?: number;

  @observable
  private variationsRaw: ReadonlyArray<Variation> = [];

  @observable
  private customsLogisticsDefaultRaw: CustomsLogistics | null;

  constructor({
    initialState,
    isCloning = false,
    standardWarehouseId,
    primaryCurrency,
    storeCountries,
    canManageShipping,
    disputeId,
    isCnMerchant,
    isStoreMerchant,
    useCalculatedShipping,
  }: {
    readonly standardWarehouseId: string;
    readonly primaryCurrency: PaymentCurrencyCode;
    readonly initialState?: InitialProductState | null | undefined;
    readonly isCloning?: boolean;
    readonly storeCountries: ReadonlyArray<PickedShippingSettingsSchema>;
    readonly isStoreMerchant: boolean;
    readonly canManageShipping: boolean;
    readonly disputeId?: string | null;
    readonly isCnMerchant?: boolean | null;
    readonly useCalculatedShipping?: boolean | null;
  }) {
    this.initialState = initialState;

    this.id = isCloning || initialState == null ? undefined : initialState.id;
    this.parentSku = initialState == null ? undefined : initialState.sku;
    this.isCloning = isCloning;
    this.tags =
      initialState == null ? undefined : uniq([...(initialState.tags || [])]);
    this.enabled =
      initialState == null ? undefined : initialState.enabled ?? true;
    this.createTime =
      initialState == null ? undefined : initialState.createTime;
    this.lastUpdateTime =
      initialState == null ? undefined : initialState.lastUpdateTime;
    this.requestedBrand =
      initialState == null ? undefined : initialState.requestedBrand;
    this.standardWarehouseId = standardWarehouseId;
    this.canManageShipping = canManageShipping;
    this.primaryCurrency = primaryCurrency;
    this.storeCountries = storeCountries;
    this.isStoreMerchant = isStoreMerchant;
    this.canShowMaxDeliveryDays = isCnMerchant == null || !isCnMerchant;
    this.disputeId = disputeId;
    this.useCalculatedShipping = useCalculatedShipping || false;

    const countryShippingStates: Map<CountryCode, CountryShipping> = new Map();
    const warehouseCountryShippingSettings =
      initialState == null
        ? undefined
        : initialState.shipping?.warehouseCountryShipping;
    for (const warehouseCountryShipping of warehouseCountryShippingSettings ||
      []) {
      for (const countryShipping of warehouseCountryShipping.countryShipping ||
        []) {
        const {
          country: { code: countryCode, gmvRank },
          wishExpressTtdRequirement,
        } = countryShipping;
        const countryShippingState = createCountryShipping({
          countryCode,
          gmvRank,
          countryShipping,
          wishExpressMaxDeliveryDaysRequirement: wishExpressTtdRequirement,
        });
        countryShippingStates.set(countryCode, countryShippingState);
      }
    }

    storeCountries.forEach(
      ({
        country: {
          code,
          gmvRank,
          regions,
          wishExpress: { expectedTimeToDoor },
        },
      }) => {
        if (!countryShippingStates.has(code)) {
          countryShippingStates.set(
            code,
            createCountryShipping({
              countryCode: code,
              gmvRank,
              wishExpressMaxDeliveryDaysRequirement: expectedTimeToDoor,
              initialState:
                regions == null
                  ? undefined
                  : {
                      regionShipping: createInitialRegionShippingMap({
                        regions,
                        wishExpressMaxDeliveryDaysRequirement:
                          expectedTimeToDoor,
                        enabled: true,
                      }),
                    },
            })
          );
        }
      }
    );

    this.countryShippingStates = countryShippingStates;

    const primaryWarehouseDefaultShipping =
      initialState == null ||
      initialState.shipping == null ||
      initialState.shipping.defaultShipping == null
        ? null
        : initialState.shipping.defaultShipping.find(
            (defaultShipping) =>
              defaultShipping.warehouseId == standardWarehouseId
          );

    this.defaultShippingPriceInternal =
      primaryWarehouseDefaultShipping == null
        ? null
        : primaryWarehouseDefaultShipping.price.amount;

    const hasVariations =
      initialState != null &&
      (initialState.variations.length > 1 ||
        (initialState.variations.length == 1 &&
          (initialState.variations[0].color != null ||
            initialState.variations[0].size != null)));
    const initialVariations =
      hasVariations == null
        ? []
        : (initialState == null ? [] : initialState.variations || []).map(
            (variationInitial) =>
              createVariation({
                initialState: variationInitial,
              })
          );

    this.customsLogisticsDefaultRaw = null;

    this.variationsRaw = initialVariations;

    this.maxQuantity =
      initialState == null ? undefined : initialState.maxQuantity;

    this.msrp =
      initialState == null || initialState.msrp == null
        ? undefined
        : initialState.msrp.amount;
    this.sizesText = "";
    this.colorsText = "";
    this.hasVariationsInternal = hasVariations;

    const initialName = initialState == null ? undefined : initialState.name;
    const initialDescription =
      initialState == null ? undefined : initialState.description;
    const initialCondition =
      initialState == null ? undefined : initialState.condition;

    this.name = isCloning ? i`Copy of ${initialName}` : initialName;
    this.description = initialDescription;
    this.condition = initialCondition;

    if (initialState != null && initialState.mainImage) {
      this.imagesInternal = [
        initialState.mainImage,
        ...(initialState.extraImages || []),
      ];
    }

    if (initialState != null) {
      const {
        referenceArea,
        referenceLength,
        referenceUnit,
        referenceVolume,
        referenceWeight,
      } = initialState;
      this.showUnitPrice = true;
      if (referenceArea != null) {
        this.unitPrice = referenceArea.value;
        this.unitPriceUnit = referenceArea.unit;
        this.measurementType = "AREA";
      } else if (referenceLength != null) {
        this.unitPrice = referenceLength.value;
        this.unitPriceUnit = referenceLength.unit;
        this.measurementType = "LENGTH";
      } else if (referenceUnit != null) {
        this.unitPrice = referenceUnit.value;
        this.unitPriceUnit = referenceUnit.unit;
        this.measurementType = "COUNT";
      } else if (referenceVolume != null) {
        this.unitPrice = referenceVolume.value;
        this.unitPriceUnit = referenceVolume.unit;
        this.measurementType = "VOLUME";
      } else if (referenceWeight != null) {
        this.unitPrice = referenceWeight.value;
        this.unitPriceUnit = referenceWeight.unit;
        this.measurementType = "WEIGHT";
      } else {
        this.showUnitPrice = false;
      }
    }
  }

  // =============================
  // Shipping
  // =============================
  @computed
  get defaultShippingPrice(): number | null | undefined {
    return this.defaultShippingPriceInternal;
  }

  @action
  setDefaultShippingPrice = (value: number | null | undefined) => {
    this.defaultShippingPriceInternal = value;
    const { countryShippingStates } = this;
    countryShippingStates.forEach((countryShipping) => {
      if (!countryShipping.hasEditedShippingPrice) {
        this.updateCountryShipping({
          cc: countryShipping.countryCode,
          newProps: {
            shippingPrice: value,
          },
        });

        Array.from(countryShipping.regionShipping.values()).forEach(
          ({ code, hasEditedShippingPrice }) => {
            if (!hasEditedShippingPrice) {
              this.updateRegionShipping({
                cc: countryShipping.countryCode,
                regionCode: code,
                newProps: {
                  shippingPrice: value,
                },
              });
            }
          }
        );
      }
    });
  };

  @computed
  get countryShippings(): ReadonlyArray<CountryShipping> {
    return Array.from(this.countryShippingStates.values());
  }

  @action
  updateRegionShipping = ({
    cc,
    regionCode,
    newProps,
  }: {
    readonly cc: CountryCode;
    readonly regionCode: string;
    readonly newProps: Partial<RegionShipping>;
  }) => {
    const { countryShippingStates, storeCountries } = this;
    const initialShippingSetting = storeCountries.find(
      ({ country: { code } }) => code == cc
    );
    const oldCountryShippingState = countryShippingStates.get(cc);
    const oldRegionShipping =
      oldCountryShippingState == null
        ? undefined
        : oldCountryShippingState.regionShipping.get(regionCode);

    if (
      initialShippingSetting == null ||
      oldCountryShippingState == null ||
      oldRegionShipping == null
    ) {
      return;
    }

    const newMap = new Map(oldCountryShippingState.regionShipping);
    newMap.set(regionCode, {
      ...oldRegionShipping,
      ...newProps,
    });
    this.updateCountryShipping({
      cc,
      newProps: {
        regionShipping: newMap,
      },
    });
  };

  @action
  updateCountryShipping = ({
    cc,
    newProps,
  }: {
    readonly cc: CountryCode;
    readonly newProps: Partial<CountryShipping>;
  }) => {
    const { countryShippingStates, storeCountries } = this;
    const initialShippingSetting = storeCountries.find(
      ({ country: { code } }) => code == cc
    );
    if (initialShippingSetting == null) {
      return;
    }

    const gmvRank = initialShippingSetting.country.gmvRank;
    const wishExpressMaxDeliveryDaysRequirement =
      initialShippingSetting.country.wishExpress.expectedTimeToDoor;

    const newMap = new Map(countryShippingStates);
    const oldCountryShippingState = countryShippingStates.get(cc);
    newMap.set(
      cc,
      oldCountryShippingState == null
        ? createCountryShipping({
            countryCode: cc,
            gmvRank,
            wishExpressMaxDeliveryDaysRequirement,
            initialState: newProps,
          })
        : {
            ...oldCountryShippingState,
            ...newProps,
          }
    );
    this.countryShippingStates = newMap;
  };

  getCountryShipping = (
    countryCode: CountryCode
  ): CountryShipping | undefined => {
    const { countryShippingStates } = this;
    const state = countryShippingStates.get(countryCode);
    if (state != null) {
      return state;
    }
  };

  // =============================
  // Customs and Logistics
  // =============================
  @action
  updateDefaultCustomsLogistics = (newProps: Partial<CustomsLogistics>) => {
    const { customsLogisticsDefaultRaw } = this;
    if (customsLogisticsDefaultRaw == null) {
      this.customsLogisticsDefaultRaw = createCustomsLogistics(newProps);
      return;
    }
    this.customsLogisticsDefaultRaw = updateCustomsLogistics({
      data: customsLogisticsDefaultRaw,
      newProps,
    });
  };

  @computed
  get customsLogisticsDefault(): CustomsLogistics | null {
    const { customsLogisticsDefaultRaw } = this;
    return customsLogisticsDefaultRaw;
  }

  @computed
  get customsCountryOptions(): ReadonlyArray<Option<CountryCode>> {
    const topCountries: ReadonlyArray<CountryCode> = [
      "US",
      "DE",
      "FR",
      "BR",
      "CA",
      "GB",
      "ES",
      "CN",
    ];
    const sortedCountryCodes: ReadonlyArray<CountryCode> = sortBy(
      Object.keys(countries) as ReadonlyArray<CountryCode>,
      (cc: CountryCode) => countries[cc]
    );
    const countryCodes = uniq([...topCountries, ...sortedCountryCodes]);
    return countryCodes.map(
      (cc): Option<CountryCode> => ({
        value: cc,
        text: countries[cc],
      })
    );
  }

  private customsLogisticsAsInput = (
    customsLogistics: CustomsLogistics | null
  ): CustomsLogisticsInput | undefined => {
    if (customsLogistics == null) {
      return undefined;
    }

    const { primaryCurrency } = this;

    const {
      countryOfOrigin,
      declaredName,
      declaredLocalName,
      customsDeclaredValue,
      customsHsCode,
      piecesIncluded,
      length,
      width,
      height,
      weight,
      hasPowder,
      hasLiquid,
      hasBattery,
      hasMetal,
    } = customsLogistics;

    const lengthInput: LengthInput | undefined =
      length != undefined
        ? {
            value: length,
            unit: CustomsLogisticsLengthUnit,
          }
        : undefined;
    const widthInput: LengthInput | undefined =
      width != undefined
        ? {
            value: width,
            unit: CustomsLogisticsLengthUnit,
          }
        : undefined;
    const heightInput: LengthInput | undefined =
      height != undefined
        ? {
            value: height,
            unit: CustomsLogisticsLengthUnit,
          }
        : undefined;

    const weightInput: WeightInput | undefined =
      weight != undefined
        ? {
            value: weight,
            unit: CustomsLogisticsWeightUnit,
          }
        : undefined;

    return {
      declaredName,
      declaredLocalName,
      customsHsCode,
      declaredValue:
        customsDeclaredValue == null
          ? undefined
          : {
              amount: customsDeclaredValue,
              currencyCode: primaryCurrency,
            },
      originCountry: countryOfOrigin,
      pieces: piecesIncluded,
      length: lengthInput,
      width: widthInput,
      height: heightInput,
      weight: weightInput,
      hasPowder,
      hasLiquid,
      hasBattery,
      hasMetal,
    };
  };

  // =============================
  // Unit Price
  // =============================

  @computed
  get unitPriceOptions(): ReadonlyArray<Option<Unit>> | undefined {
    if (this.measurementType == null) {
      return;
    }
    return MeasurementOptions[this.measurementType];
  }

  // =============================
  // Variations
  // =============================

  @computed
  get variations(): ReadonlyArray<Variation> {
    const { variationsRaw, isVariationSaved } = this;
    return sortBy(Array.from(variationsRaw.values()), (v) =>
      isVariationSaved(v)
    );
  }

  @action
  updateVariation = ({
    clientSideId,
    newProps,
  }: {
    readonly clientSideId: string;
    readonly newProps: Partial<Variation>;
  }) => {
    const { variationsRaw } = this;
    const targetVariationIndex = variationsRaw.findIndex(
      ({ clientSideId: id }) => id === clientSideId
    );
    if (targetVariationIndex == -1) {
      return;
    }

    const targetVariation = variationsRaw[targetVariationIndex];
    const newVariation: Variation = {
      ...targetVariation,
      ...newProps,
    };
    const newVariations = [
      ...variationsRaw.slice(0, targetVariationIndex),
      newVariation,
      ...variationsRaw.slice(targetVariationIndex + 1, variationsRaw.length),
    ];
    this.replaceVariations(newVariations);
  };

  @computed
  get mainImageVariation(): Variation | undefined {
    const { variations, images } = this;
    if (images.length == 0 || variations.length == 0) {
      return;
    }
    return variations.find(({ image }) => image?.id == images[0].id);
  }

  @action
  replaceVariations = (newVariations: ReadonlyArray<Variation>) => {
    this.variationsRaw = newVariations;
  };

  @action
  discardVariations = (variationsToDiscard: ReadonlyArray<Variation>) => {
    const idsToDiscard = new Set(
      variationsToDiscard.map(({ clientSideId }) => clientSideId)
    );

    const newVariations = this.variations.filter(
      ({ clientSideId: existingId }) => !idsToDiscard.has(existingId)
    );

    this.variationsRaw = newVariations;
  };

  @action
  updateSingleVariation = (variationProps: Partial<Variation>) => {
    const { variations } = this;
    if (variations.length >= 1) {
      const singleVariation = variations[0];
      this.replaceVariations([
        {
          ...singleVariation,
          ...variationProps,
        },
      ]);
      return;
    }

    this.replaceVariations([
      {
        ...createVariation({ initialState: {} }),
        ...variationProps,
      },
    ]);
  };

  isVariationSaved = (variation: Variation): boolean => {
    return variation.id != null;
  };

  @computed
  get hasVariations(): boolean {
    return this.hasVariationsInternal;
  }

  @action
  checkHasVariations = () => {
    this.replaceVariations([]);
    this.hasVariationsInternal = true;
  };

  @action
  uncheckHasVariations = () => {
    const { variations, images } = this;

    if (variations != null && variations.length > 0) {
      const singleVariation: Writeable<Variation> = variations[0];
      if (images.length > 0) {
        singleVariation.image = images[0];
      }
      delete singleVariation.color;
      delete singleVariation.size;
      this.replaceVariations([singleVariation]);
    } else {
      if (images.length > 0) {
        const singleVariation = createVariation({
          initialState: {
            image: images[0],
          },
        });
        this.replaceVariations([singleVariation]);
      }
    }

    this.hasVariationsInternal = false;
  };

  @action
  updateVariationsFromForm = () => {
    const { sizesText, colorsText, variations } = this;
    if (colorsText.trim().length == 0 && sizesText.trim().length == 0) {
      this.replaceVariations([]);
      return;
    }
    const colorsList: ReadonlyArray<string> = parseVariationTokens(colorsText);
    const sizesList: ReadonlyArray<string> = parseVariationTokens(sizesText);

    const permutations = getPermutations(colorsList, sizesList);
    const newVariations: ReadonlyArray<Variation> = permutations.map(
      ({ size: sizeValue, color: colorValue }) => {
        const color = colorValue?.trim().length == 0 ? undefined : colorValue;
        const size = sizeValue?.trim().length == 0 ? undefined : sizeValue;
        const matchingVariations =
          color == null && size == null
            ? []
            : variations.filter(
                ({ color: vColor, size: vSize }) =>
                  vColor == color && vSize == size
              );
        return matchingVariations.length > 0
          ? matchingVariations[0]
          : createVariation({
              initialState: { color, size },
            });
      }
    );

    this.colorsText = colorsList.join(",");
    this.sizesText = sizesList.join(",");
    this.replaceVariations(uniqBy([...newVariations], (v) => v.clientSideId));
  };

  @computed
  get savedVariations(): ReadonlyArray<Variation> {
    const { variations, isVariationSaved } = this;
    return variations.filter((v) => isVariationSaved(v));
  }

  @computed
  get hasColors(): boolean {
    return this.colorVariations.length > 0;
  }

  @computed
  get colorVariations(): ReadonlyArray<Variation> {
    const { variations } = this;
    return variations.filter((variation) => variation.color != null);
  }

  @computed
  get hasSizes(): boolean {
    return this.sizeVariations.length > 0;
  }

  @computed
  get sizeVariations(): ReadonlyArray<Variation> {
    const { variations } = this;
    return variations.filter((variation) => variation.size != null);
  }

  @action
  setSingleVariationPrice = (price: number | null | undefined) => {
    this.updateSingleVariation({
      price,
    });
  };

  @action
  setSingleVariationGtin = (gtin: string | null | undefined) => {
    this.updateSingleVariation({ gtin });
  };

  @action
  setSingleVariationSku = (sku: string | null | undefined) => {
    this.parentSku = sku;
    this.updateSingleVariation({ sku });
  };

  @action
  setSingleVariationInventory = (inventory: number | null | undefined) => {
    const { standardWarehouseId } = this;
    const inventoryByWarehouseId = new Map([
      [standardWarehouseId, inventory],
    ]) as ReadonlyMap<string, number>;
    this.updateSingleVariation({
      inventoryByWarehouseId,
    });
  };

  @action
  setSingleVariationQuantityValue = (
    quantityValue: number | null | undefined
  ) => {
    this.updateSingleVariation({ quantityValue });
  };

  private variationErrorMessage = (variation: Variation): string | null => {
    const {
      sku,
      size,
      color,
      price,
      image,
      inventoryByWarehouseId,
      quantityValue,
    } = variation;

    const { hasVariations, showUnitPrice } = this;

    if (price == null) {
      return hasVariations
        ? i`Please provide a price for your variations`
        : i`Please provide a price for your product`;
    }

    if (sku == null) {
      return hasVariations
        ? i`Please attach a sku to all your variations`
        : i`Please provide a sku for your product`;
    }

    if (inventoryByWarehouseId.size == 0) {
      return hasVariations
        ? i`Please attach a quantity to all your variations`
        : i`Please provide a quantity for your product`;
    }

    if (hasVariations && color == null && size == null) {
      return i`Please attach a color and/or size to all your variations`;
    }

    if (image == null) {
      return hasVariations
        ? i`Please attach an image to all your variations`
        : i`Please attach at least one image to your product`;
    }

    if (showUnitPrice && (quantityValue == null || quantityValue <= 0)) {
      return hasVariations
        ? i`Please provide valid quantity values for your product.`
        : i`Please provide a valid quantity value for your product.`;
    }

    return null;
  };

  private variationAsInput = (variation: Variation): VariationInput => {
    const {
      id,
      sku,
      price,
      size,
      color,
      image,
      gtin,
      inventoryByWarehouseId,
      quantityValue,
      customCustomsLogistics,
    } = variation;

    const {
      primaryCurrency,
      showUnitPrice,
      unitPrice,
      unitPriceUnit,
      measurementType,
      customsLogisticsAsInput,
    } = this;

    const customsLogisticsInput = customsLogisticsAsInput(
      customCustomsLogistics
    );

    const hasImageChange = hasVariationImageChanged(variation);

    const imageInput: ImageInput | undefined =
      image && hasImageChange
        ? {
            id: image.id,
            url: image.wishUrl,
            isCleanImage: image.isCleanImage,
          }
        : undefined;

    const priceInput: CurrencyInput | undefined = price
      ? {
          amount: price,
          currencyCode: primaryCurrency,
        }
      : undefined;

    const inventory: ReadonlyArray<InventoryInput> = Array.from(
      inventoryByWarehouseId.entries()
    ).map(([warehouseId, count]) => ({ warehouseId, count }));

    const quantityValueInput: Pick<
      VariationInput,
      | "quantityWeight"
      | "quantityLength"
      | "quantityVolume"
      | "quantityArea"
      | "quantityUnit"
    > =
      showUnitPrice &&
      unitPrice != null &&
      unitPriceUnit != null &&
      measurementType != null &&
      quantityValue != null
        ? {
            quantityArea:
              measurementType === "AREA"
                ? {
                    value: quantityValue,
                    unit: unitPriceUnit as AreaUnit,
                  }
                : undefined,
            quantityLength:
              measurementType === "LENGTH"
                ? {
                    value: quantityValue,
                    unit: unitPriceUnit as LengthUnit,
                  }
                : undefined,
            quantityUnit:
              measurementType === "COUNT"
                ? {
                    value: quantityValue,
                    unit: unitPriceUnit as CountUnit,
                  }
                : undefined,
            quantityVolume:
              measurementType === "VOLUME"
                ? {
                    value: quantityValue,
                    unit: unitPriceUnit as VolumeUnit,
                  }
                : undefined,
            quantityWeight:
              measurementType === "WEIGHT"
                ? {
                    value: quantityValue,
                    unit: unitPriceUnit as WeightUnit,
                  }
                : undefined,
          }
        : {
            quantityArea: null,
            quantityLength: null,
            quantityUnit: null,
            quantityVolume: null,
            quantityWeight: null,
          };

    return {
      id,
      enabled: true,
      sku,
      inventory,
      price: priceInput,
      size,
      color,
      gtin,
      image: imageInput,
      ...customsLogisticsInput,
      ...quantityValueInput,
    };
  };

  // =============================
  // Tags
  // =============================

  @computed
  get hasTagChanges(): boolean {
    const { initialState, tags: rawTags } = this;
    const initialTags = initialState == null ? [] : initialState.tags || [];
    const tags = rawTags || [];
    if (tags.length != initialTags.length) {
      return true;
    }
    return tags.some((value) => !initialTags.includes(value));
  }

  // =============================
  // Images
  // =============================

  @computed
  get images(): ReadonlyArray<PickedImage> {
    return this.imagesInternal;
  }

  @action
  setImages = (images: ReadonlyArray<PickedImage>) => {
    const { hasVariations } = this;
    if (!hasVariations) {
      this.updateSingleVariation({
        image: images[0],
      });
    }
    this.imagesInternal = images;
  };

  // =============================
  // Whole page
  // =============================

  @computed
  get isNewProduct(): boolean {
    return this.id == null;
  }

  @computed
  get isViewableOnWish(): boolean {
    const { initialState } = this;
    return initialState != null && initialState.reviewStatus == "APPROVED";
  }

  @computed
  get canSave(): boolean {
    const { errorMessage } = this;
    return errorMessage != null;
  }

  @computed
  get saveButtonInactiveMessage(): string | undefined {
    const { initialState } = this;
    if (initialState != null && initialState.isRemovedByWish) {
      return i`This product has been removed by Wish. You are only allowed to edit the SKU`;
    }
  }

  @computed
  get errorMessage(): string | undefined {
    const {
      variations,
      name,
      description,
      showUnitPrice,
      measurementType,
      unitPriceUnit,
      unitPrice,
      countryShippingStates,
      defaultShippingPrice,
      canManageShipping,
      hasVariations,
      variationErrorMessage,
    } = this;

    if (hasVariations && variations.length == 0) {
      return i`Please add at least one variation`;
    }

    const variationError = variations.reduce<string | null>(
      (acc, variation) => {
        return acc == null ? variationErrorMessage(variation) : acc;
      },
      null
    );

    if (variationError != null) {
      return variationError;
    }

    const uniqueVariationSkus = uniq(variations.map((v) => v.sku));
    if (uniqueVariationSkus.length != variations.length) {
      return i`Please make sure each of your variations has a unique sku`;
    }

    if (name == null || name.trim().length == 0) {
      return i`Please provide a product name`;
    }

    if (description == null || description.trim().length == 0) {
      return i`Please provide a product description`;
    }

    if (
      showUnitPrice &&
      (measurementType == null || unitPriceUnit == null || unitPrice == null)
    ) {
      return i`Please provide a measurement type, unit and reference value.`;
    }

    if (
      showUnitPrice &&
      unitPrice != null &&
      (!isInteger(unitPrice) || unitPrice <= 0)
    ) {
      return i`Reference value must be a positive integer.`;
    }

    const countryShippingWithError = Array.from(
      countryShippingStates.values()
    ).find(
      (countryShipping) => countryShippingErrorMessage(countryShipping) != null
    );

    if (countryShippingWithError != null) {
      return countryShippingErrorMessage(countryShippingWithError);
    }

    if (defaultShippingPrice == null && canManageShipping) {
      return i`Please provide a default shipping price`;
    }

    const countryShipping = Array.from(countryShippingStates.values());
    const hasEnabledCountry = countryShipping.some((cs) => cs.enabled);
    if (countryShipping.length > 0 && !hasEnabledCountry) {
      return i`Please enable shipping to at least one country`;
    }

    return undefined;
  }

  @computed
  get hasChanged(): boolean {
    const {
      initialState,
      images: rawImages,
      tags,
      requestedBrand,
      name,
      description,
      condition,
      isNewProduct,
      variations,
      msrp,
      hasVariations,
      showUnitPrice,
      measurementType,
      unitPrice,
      unitPriceUnit,
      maxQuantity,
      defaultShippingPrice,
      standardWarehouseId,
      countryShippings,
    } = this;

    const mainImage = initialState == null ? undefined : initialState.mainImage;
    const extraImages = initialState == null ? [] : initialState.extraImages;
    if (isNewProduct) {
      return true;
    }
    const images = toJS(rawImages || []);
    const rawInitialImages = mainImage ? [mainImage, ...extraImages] : [];
    const initialImages = toJS(rawInitialImages || []);
    if (initialImages.length != images.length) {
      return true;
    }

    if (!isEqual(initialImages, images)) {
      return true;
    }

    const initialTags = initialState == null ? [] : initialState.tags;
    // Check if the tags changed
    // https://stackoverflow.com/a/6229258/11192264
    if (!isEmpty(xor(tags, initialTags || []))) {
      return true;
    }

    const initialRequestedBrand =
      initialState == null ? null : initialState.requestedBrand;
    if (requestedBrand?.id != initialRequestedBrand?.id) {
      return true;
    }

    const initialDescription =
      initialState == null ? undefined : initialState.description;
    const initialName = initialState == null ? undefined : initialState.name;
    const initialCondition =
      initialState == null ? undefined : initialState.condition;

    if (
      (name || "").trim() != (initialName || "").trim() ||
      (description || "").trim() != (initialDescription || "").trim() ||
      initialCondition != condition
    ) {
      return true;
    }

    const getInitialUnitPriceData = (): {
      readonly measurementType: MeasurementType;
      readonly unitPrice: number;
      readonly unitPriceUnit: Unit;
    } | null => {
      if (initialState == null) {
        return null;
      }
      if (initialState.referenceArea != null) {
        return {
          measurementType: "AREA",
          unitPrice: initialState.referenceArea.value,
          unitPriceUnit: initialState.referenceArea.unit,
        };
      }
      if (initialState.referenceLength != null) {
        return {
          measurementType: "LENGTH",
          unitPrice: initialState.referenceLength.value,
          unitPriceUnit: initialState.referenceLength.unit,
        };
      }
      if (initialState.referenceUnit != null) {
        return {
          measurementType: "COUNT",
          unitPrice: initialState.referenceUnit.value,
          unitPriceUnit: initialState.referenceUnit.unit,
        };
      }
      if (initialState.referenceVolume != null) {
        return {
          measurementType: "VOLUME",
          unitPrice: initialState.referenceVolume.value,
          unitPriceUnit: initialState.referenceVolume.unit,
        };
      }
      if (initialState.referenceWeight != null) {
        return {
          measurementType: "WEIGHT",
          unitPrice: initialState.referenceWeight.value,
          unitPriceUnit: initialState.referenceWeight.unit,
        };
      }
      return null;
    };

    const initialUnitPriceData = getInitialUnitPriceData();
    if (
      (initialUnitPriceData == null && showUnitPrice) ||
      (initialUnitPriceData != null && !showUnitPrice)
    ) {
      return true;
    }

    if (initialUnitPriceData != null) {
      if (
        initialUnitPriceData.measurementType != measurementType ||
        initialUnitPriceData.unitPrice != unitPrice ||
        initialUnitPriceData.unitPriceUnit != unitPriceUnit
      ) {
        return true;
      }
    }

    const initialHasVariations =
      initialState != null &&
      initialState.variations.length > 0 &&
      (initialState.variations.length > 1 ||
        initialState.variations[0].color != null ||
        initialState.variations[0].size != null);

    if (initialHasVariations !== hasVariations) {
      return true;
    }

    if (
      hasVariations &&
      (initialState == null ? 0 : initialState.variations.length) !=
        variations.length
    ) {
      return true;
    }

    const variationChanged = variations.some((variation) =>
      hasVariationChanged(variation)
    );
    if (variationChanged) {
      return true;
    }

    const initialMsrp =
      initialState == null || initialState.msrp == null
        ? undefined
        : initialState.msrp.amount;

    if (msrp != initialMsrp) {
      return true;
    }

    if (maxQuantity != initialState?.maxQuantity) {
      return true;
    }

    const initialDefaultShipping =
      initialState == null ||
      initialState.shipping == null ||
      initialState.shipping.defaultShipping == null
        ? null
        : initialState.shipping.defaultShipping.find(
            (defaultShipping) =>
              defaultShipping.warehouseId == standardWarehouseId
          );

    const initialDefaultShippingPrice =
      initialDefaultShipping == null
        ? null
        : initialDefaultShipping.price.amount;
    if (defaultShippingPrice != initialDefaultShippingPrice) {
      return true;
    }

    const initialCountryShippings =
      initialState != null &&
      initialState.shipping.warehouseCountryShipping != null
        ? initialState.shipping.warehouseCountryShipping.reduce(
            (acc, { countryShipping: cs }) =>
              cs == null ? acc : [...acc, ...cs],
            [] as ReadonlyArray<PickedCountryShippingSchema>
          )
        : [];

    const hasCountryShippingChanged =
      countryShippings.length != initialCountryShippings.length ||
      countryShippings.some((cs) => {
        const initialCs = initialCountryShippings.find(
          ({ country: { code } }) => code == cs.countryCode
        );
        return initialCs == null || countryShippingHasChanged(cs, initialCs);
      });

    if (hasCountryShippingChanged) {
      return true;
    }

    return false;
  }

  @computed
  private get asInput(): ProductUpsertInput {
    const {
      id,
      enabled,
      tags,
      requestedBrand,
      msrp,
      primaryCurrency,
      countryShippingStates,
      defaultShippingPrice,
      standardWarehouseId,
      initialState,
      variations,
      maxQuantity,
      name,
      description,
      condition,
      images,
      hasChanged,
      showUnitPrice,
      measurementType,
      unitPriceUnit,
      unitPrice,
      parentSku,
      hasVariations,
      variationAsInput,
    } = this;

    const msrpValue = msrp
      ? {
          amount: msrp,
          currencyCode: primaryCurrency,
        }
      : undefined;

    const countryShippingInputList = Array.from(countryShippingStates.values())
      .map((countryShipping) =>
        countryShippingAsInput(countryShipping, primaryCurrency)
      )
      .filter((input) => input != null) as ReadonlyArray<CountryShippingInput>;

    const countryShipping: ReadonlyArray<WarehouseCountryShippingInput> = [
      {
        shippingType: "REGULAR",
        countryShipping: countryShippingInputList,
      },
    ];

    const countryShippingValue =
      countryShippingInputList.length > 0 ? countryShipping : undefined;

    const defaultShippingPrices =
      initialState == null ? [] : initialState.shipping?.defaultShipping || [];

    const defaultShipping: ReadonlyArray<DefaultShippingInput> = [
      ...defaultShippingPrices.map((defaultShipping) => ({
        warehouseId: defaultShipping.warehouseId,
        price: {
          amount: defaultShipping.price.amount,
          currencyCode: primaryCurrency,
        },
      })),
      ...(defaultShippingPrice == null
        ? []
        : [
            {
              warehouseId: standardWarehouseId,
              price: {
                amount: defaultShippingPrice,
                currencyCode: primaryCurrency,
              },
            },
          ]),
    ];

    const referencePriceInput: UnitPriceInput =
      showUnitPrice &&
      unitPrice != null &&
      unitPriceUnit != null &&
      measurementType != null
        ? {
            referenceArea:
              measurementType === "AREA"
                ? {
                    value: unitPrice,
                    unit: unitPriceUnit as AreaUnit,
                  }
                : undefined,
            referenceLength:
              measurementType === "LENGTH"
                ? {
                    value: unitPrice,
                    unit: unitPriceUnit as LengthUnit,
                  }
                : undefined,
            referenceUnit:
              measurementType === "COUNT"
                ? {
                    value: unitPrice,
                    unit: unitPriceUnit as CountUnit,
                  }
                : undefined,
            referenceVolume:
              measurementType === "VOLUME"
                ? {
                    value: unitPrice,
                    unit: unitPriceUnit as VolumeUnit,
                  }
                : undefined,
            referenceWeight:
              measurementType === "WEIGHT"
                ? {
                    value: unitPrice,
                    unit: unitPriceUnit as WeightUnit,
                  }
                : undefined,
          }
        : {
            referenceArea: null,
            referenceLength: null,
            referenceUnit: null,
            referenceVolume: null,
            referenceWeight: null,
          };

    const requestedBrandId = requestedBrand?.id;

    const variationsInput: VariationsInput = {
      variations: variations.map((variation) => variationAsInput(variation)),
    };

    const firstVariationSku =
      variations.length > 0 ? variations[0].sku : undefined;

    return {
      id,
      sku: hasVariations ? parentSku : firstVariationSku,
      tags,
      enabled,
      defaultShipping,
      requestedBrandId,
      countryShipping: countryShippingValue,
      maxQuantity,
      msrp: msrpValue,
      name,
      description,
      condition,
      ...referencePriceInput,
      images:
        hasChanged && images
          ? images.map((image) => ({
              id: image.id,
              url: image.wishUrl,
              isCleanImage: image.isCleanImage,
            }))
          : undefined,
      ...variationsInput,
    };
  }

  @action
  async delete() {
    const { id: productId, name } = this;
    if (productId == null) {
      // Product hasn't been saved yet.
      return;
    }
    this.forceValidation = true;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

    type ProductRemoveVariables = {
      readonly input: RemoveProductInput;
    };

    type ResponseType = {
      readonly productCatalog: {
        readonly removeProduct: Pick<RemoveProduct, "ok" | "message">;
      };
    };
    this.isSubmitting = true;
    const { data } = await client.mutate<ResponseType, ProductRemoveVariables>({
      mutation: REMOVE_PRODUCT_MUTATION,
      variables: { input: { productId } },
    });
    this.isSubmitting = false;

    const ok = data?.productCatalog?.removeProduct?.ok;
    const message = data?.productCatalog?.removeProduct?.message;
    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    navigationStore.releaseNavigationLock();
    await navigationStore.navigate("/plus/products/list");
    toastStore.info(
      ci18n(
        "popup telling the merchant a product has been removed to their store",
        '"%1$s" has been removed from your store',
        name
      )
    );
  }

  @action
  async submit() {
    const { errorMessage, name, asInput: input, isNewProduct } = this;
    this.forceValidation = true;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();
    if (errorMessage != null) {
      toastStore.negative(errorMessage, {
        timeoutMs: 4000,
      });
      return;
    }

    type ResponseType = {
      readonly productCatalog: {
        readonly upsertProduct: Pick<
          UpsertProduct,
          "ok" | "message" | "productId"
        >;
      };
    };
    this.isSubmitting = true;
    const { data } = await client.mutate<
      ResponseType,
      ProductCatalogMutationsUpsertProductArgs
    >({
      mutation: UPSERT_PRODUCT_MUTATION,
      variables: { input },
    });
    this.isSubmitting = false;

    const ok = data?.productCatalog?.upsertProduct?.ok;
    const message = data?.productCatalog?.upsertProduct?.message;
    const productId = data?.productCatalog?.upsertProduct?.productId;
    if (!ok || productId == null) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    navigationStore.releaseNavigationLock();
    await navigationStore.navigate("/product");
    // Lint doesn't see that the arg is a binary expression of string literals
    /* eslint-disable local-rules/only-literals-in-i18n,local-rules/unwrapped-i18n */
    if (isNewProduct) {
      toastStore.positive(
        ci18n(
          "popup telling the merchant a new product has been added to their store, (placeholder is singular). " +
            "The product name is placed in a link that leads to a page where they merchant can view the product",
          "[%1$s](%2$s) has been added to your store",
          name,
          `/products/edit/${productId}`
        ),
        {
          timeoutMs: 7000,
        }
      );
    } else {
      toastStore.positive(
        ci18n(
          "popup telling the merchant a product has been updated, (placeholder is singular), " +
            "The product name is placed in a link that leads to a page where they merchant can view the product",
          "[%1$s](%2$s) has been updated",
          name,
          `/products/edit/${productId}`
        ),
        {
          timeoutMs: 7000,
        }
      );
    }
  }
}

export class UniqueSkuValidator extends Validator {
  pageState: AddEditProductState;
  customMessage: string | null | undefined;

  constructor({
    pageState,
    customMessage,
  }: {
    readonly customMessage?: string | null | undefined;
    readonly pageState: AddEditProductState;
  }) {
    super({ customMessage });
    this.customMessage = customMessage;
    this.pageState = pageState;
  }

  async validateText(sku: string): Promise<ValidationResponse> {
    const { pageState } = this;
    const duplicateSku =
      pageState.variations.filter(
        ({ sku: variationSku }) => variationSku === sku
      ).length > 1;
    if (duplicateSku) {
      return (
        this.customMessage ||
        i`Can't have multiple variations with the same SKU`
      );
    }
    return null;
  }
}

export class UniqueGtinValidator extends Validator {
  pageState: AddEditProductState;
  customMessage: string | null | undefined;

  constructor({
    pageState,
    customMessage,
  }: {
    readonly customMessage?: string | null | undefined;
    readonly pageState: AddEditProductState;
  }) {
    super({ customMessage });
    this.customMessage = customMessage;
    this.pageState = pageState;
  }

  async validateText(gtin: string): Promise<ValidationResponse> {
    const { pageState } = this;
    if (gtin == null || gtin.trim().length == 0) {
      return null;
    }
    const duplicateGtin =
      pageState.variations.filter(
        ({ gtin: variationGtin }) => variationGtin === gtin
      ).length > 1;
    if (duplicateGtin) {
      return this.customMessage || i`GTIN must be unique`;
    }
    return null;
  }
}

export const parseVariationTokens = (
  rawString: string
): ReadonlyArray<string> => {
  const list: ReadonlyArray<string> = rawString
    .trim()
    .split(",")
    .filter((s) => s.trim().length > 0);

  return list;
};

export class UniqueVariationTokensValidator extends Validator {
  customMessage: string | null | undefined;

  constructor({
    customMessage,
  }: {
    readonly customMessage?: string | null | undefined;
  }) {
    super({ customMessage });
    this.customMessage = customMessage;
  }

  async validateText(rawTokens: string): Promise<ValidationResponse> {
    const tokens = parseVariationTokens(rawTokens);
    const hasDuplicate =
      uniqWith(tokens, (a, b) => {
        return a.toLowerCase().trim() == b.toLowerCase().trim();
      }).length != tokens.length;
    if (hasDuplicate) {
      return this.customMessage || i`Can't have duplicate tokens`;
    }
    return null;
  }
}
