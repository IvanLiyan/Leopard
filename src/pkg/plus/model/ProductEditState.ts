/* External Libraries */
import _ from "lodash";
import { observable, computed, toJS, action } from "mobx";
import faker from "faker/locale/en";
import gql from "graphql-tag";
import { ci18n } from "@legacy/core/i18n";
import {
  Region,
  ImageInput,
  CountryCode,
  ImageSchema,
  RemoveProduct,
  UpsertProduct,
  CurrencyValue,
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
} from "@schema/types";
import { CheckboxState } from "@ContextLogic/lego";
import ToastStore from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import { Validator, ValidationResponse } from "@toolkit/validators";

import {
  PickedImage,
  InitialProductState,
  PickedBrandSchema,
  VariationInitialState,
  PickedShippingSettingsSchema,
  PickedWishExpressCountries,
  PickedCountryWeShipTo,
  PickedCountryShippingSchema,
  MeasurementType,
  Unit,
  MeasurementOptions,
} from "@toolkit/product-edit";
import { Option } from "@ContextLogic/lego/component/form/SimpleSelect";

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

export class VariationEditState {
  @observable
  private inventoryByWarehouseId: Map<string, number> = new Map();

  @observable
  initialState: Partial<VariationInitialState>;

  @observable
  id: VariationInitialState["id"] | null | undefined;

  @observable
  sku: VariationInitialState["sku"] | null | undefined;

  @observable
  size: VariationInitialState["size"] | null | undefined;

  @observable
  color: VariationInitialState["color"] | null | undefined;

  @observable
  price: number | null | undefined;

  @observable
  image: VariationInitialState["image"] | null | undefined;

  @observable
  key: string;

  @observable
  editState: ProductEditState;

  @observable
  customsHsCode: VariationInitialState["customsHsCode"] | null | undefined;

  @observable
  weight: number | null | undefined;

  @observable
  quantityValue: number | null | undefined;

  constructor(args: {
    readonly initialState: Partial<VariationInitialState>;
    readonly isCloning?: boolean;
    readonly editState: ProductEditState;
  }) {
    const { initialState, isCloning, editState } = args;
    this.initialState = { ...initialState };
    this.id = isCloning ? undefined : initialState.id;
    this.sku = initialState.sku;
    this.size = initialState.size;
    this.color = initialState.color;
    this.price = initialState.price?.amount;
    this.image = initialState.image;
    this.customsHsCode = initialState.customsHsCode;
    this.weight = initialState.weight?.value;
    this.quantityValue =
      initialState.quantityArea?.value ||
      initialState.quantityLength?.value ||
      initialState.quantityUnit?.value ||
      initialState.quantityVolume?.value ||
      initialState.quantityWeight?.value ||
      undefined;
    this.editState = editState;

    const clientSideVariationId = _.uniqueId();
    this.key = initialState.sku || clientSideVariationId;

    for (const inventory of initialState.inventory || []) {
      this.inventoryByWarehouseId.set(inventory.warehouseId, inventory.count);
    }
  }

  @computed
  get errorMessage(): string | undefined {
    const {
      sku,
      size,
      color,
      price,
      image,
      inventoryByWarehouseId,
      quantityValue,
      editState: { isSingleVariation, showUnitPrice },
    } = this;
    if (price == null) {
      return isSingleVariation
        ? i`Please provide a price for your product`
        : i`Please provide a price for your variations`;
    }

    if (sku == null) {
      return isSingleVariation
        ? i`Please provide a sku for your product`
        : i`Please attach a sku to all your variations`;
    }

    if (inventoryByWarehouseId.size == 0) {
      return isSingleVariation
        ? i`Please provide a quantity for your product`
        : i`Please attach a quantity to all your variations`;
    }

    if (!isSingleVariation && color == null && size == null) {
      return i`Please attach a color and/or size to all your variations`;
    }

    if (image == null) {
      return isSingleVariation
        ? i`Please attach an image to your product`
        : i`Please attach an image to all your variations`;
    }

    if (showUnitPrice && (quantityValue == null || quantityValue <= 0)) {
      return isSingleVariation
        ? i`Please provide a valid quantity value for your product.`
        : i`Please provide valid quantity values for your product.`;
    }

    return undefined;
  }

  @computed
  get hasChanges(): boolean {
    const { sku, size, color, price, hasImageChange, initialState } = this;
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

    return false;
  }

  @computed
  get hasImageChange(): boolean {
    const { image, initialState, id } = this;
    if (id == null) {
      // new product.
      return true;
    }
    return image?.wishUrl != initialState.image?.wishUrl;
  }

  @computed
  get isSaved(): boolean {
    return this.id != null;
  }

  @computed
  get asInput(): VariationInput {
    const {
      id,
      sku,
      price,
      size,
      color,
      image,
      hasImageChange,
      inventoryByWarehouseId,
      weight,
      customsHsCode,
      quantityValue,
      editState: {
        primaryCurrency,
        measurementType,
        unitPriceUnit,
        unitPrice,
        showUnitPrice,
      },
    } = this;

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

    const weightInput: WeightInput | undefined = weight
      ? {
          value: weight,
          unit: "GRAM",
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
      image: imageInput,
      weight: weightInput,
      customsHsCode,
      ...quantityValueInput,
    };
  }

  setPrice(amount: number | null | undefined) {
    this.price =
      amount == null || isNaN(amount) ? undefined : Math.max(amount, 0);
  }

  setInventory(value: number, warehouseId: string) {
    this.inventoryByWarehouseId.set(warehouseId, Math.max(value, 0));
  }

  getInventory(warehouseId: string): number | undefined {
    return this.inventoryByWarehouseId.get(warehouseId);
  }
}

export class CountryShippingState {
  @observable
  countryCode: CountryCode;

  @observable
  shippingPrice: number | null | undefined;

  @observable
  enabled: PickedCountryShippingSchema["enabled"] | null | undefined;

  @observable
  wishExpressEnabled: boolean | undefined;

  @observable
  editState: ProductEditState;

  @observable
  private initialState: PickedCountryShippingSchema | null | undefined;

  @observable
  private regionalShippingPrices: Map<Region["code"], number> = new Map();

  @observable
  private regionalShippingEnabled: Map<Region["code"], boolean> = new Map();

  constructor(args: {
    readonly countryCode: CountryCode;
    readonly countryShipping?: PickedCountryShippingSchema | null | undefined;
    readonly editState: ProductEditState;
    readonly wishExpressEnabled: boolean;
  }) {
    const {
      countryShipping,
      editState,
      countryCode,
      wishExpressEnabled,
    } = args;
    this.countryCode = countryCode;
    this.enabled = countryShipping?.enabled ?? true;
    this.wishExpressEnabled = wishExpressEnabled;
    this.shippingPrice = countryShipping?.price?.amount;
    this.editState = editState;
    this.initialState = countryShipping;
  }

  @computed
  get priceAmount(): CurrencyValue["amount"] {
    const {
      shippingPrice: countryPrice,
      editState: { defaultShippingPriceForStandardWarehouse },
    } = this;
    if (countryPrice == null) {
      return defaultShippingPriceForStandardWarehouse || 0;
    }
    return countryPrice;
  }

  setPrice(amount: number | undefined) {
    this.shippingPrice = amount;
  }

  @action
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.wishExpressEnabled = false;
    }
  }

  getRegionPrice(regionName: Region["code"]): number {
    return this.regionalShippingPrices.get(regionName) || 0;
  }

  setRegionPrice(amount: number, regionName: Region["code"]) {
    this.regionalShippingPrices.set(regionName, amount);
  }

  getIsRegionEnabled(regionName: Region["code"]): boolean {
    return this.regionalShippingEnabled.get(regionName) || false;
  }

  setIsRegionEnabled(enabled: boolean, regionName: Region["code"]) {
    this.regionalShippingEnabled.set(regionName, enabled);
  }

  @computed
  get errorMessage(): string | undefined {
    const { shippingPrice, countryCode } = this;
    if (shippingPrice != null && isNaN(shippingPrice)) {
      return (
        i`Please provide a shipping price for ${countryCode} ` +
        i`or disable shipping to this country`
      );
    }
    return undefined;
  }

  @computed
  get asInput(): CountryShippingInput | undefined {
    const {
      enabled,
      wishExpressEnabled,
      countryCode,
      initialState,
      shippingPrice,
      editState: { primaryCurrency },
    } = this;
    if (
      !initialState &&
      enabled &&
      !wishExpressEnabled &&
      shippingPrice == null
    ) {
      return undefined;
    }

    const priceInput: CurrencyInput | undefined = shippingPrice
      ? {
          amount: shippingPrice,
          currencyCode: primaryCurrency,
        }
      : undefined;

    return {
      countryCode,
      enabled,
      price: priceInput,
    };
  }
}

export default class ProductEditState {
  @observable
  private variations: Map<string, VariationEditState> = new Map();

  @observable
  private defaultShippingPriceByWarehouseId: Map<string, number> = new Map();

  @observable
  private countryShippingStates: Map<
    CountryCode,
    CountryShippingState
  > = new Map();

  @observable
  isSubmitting = false;

  @observable
  initialState: Partial<InitialProductState>;

  @observable
  id: InitialProductState["id"] | null | undefined;

  @observable
  sku: InitialProductState["sku"] | null | undefined;

  @observable
  name: InitialProductState["name"] | null | undefined;

  @observable
  tags: InitialProductState["tags"] | null | undefined;

  @observable
  requestedBrand: PickedBrandSchema | null | undefined;

  @observable
  description: InitialProductState["description"] | null | undefined;

  @observable
  enabled: InitialProductState["enabled"] | null | undefined;

  @observable
  createTime: InitialProductState["createTime"] | null | undefined;

  @observable
  lastUpdateTime: InitialProductState["lastUpdateTime"] | null | undefined;

  @observable
  images: ReadonlyArray<PickedImage> = [];

  @observable
  storeCountries: ReadonlyArray<PickedShippingSettingsSchema>;

  @observable
  wishExpressCountries: ReadonlyArray<CountryCode>;

  @observable
  countriesWeShipTo: ReadonlyArray<PickedCountryWeShipTo>;

  @observable
  standardWarehouseId: string;

  @observable
  canManageShipping: boolean;

  @observable
  msrp: number | null | undefined;

  @observable
  upc: string | null | undefined;

  @observable
  hasColorOrSizeVariations: boolean = false;

  @observable
  primaryCurrency: PaymentCurrencyCode;

  @observable
  forceValidation = false;

  @observable
  variationFormState: VariationsFormState;

  @observable
  isStoreMerchant: boolean;

  @observable
  condition: InitialProductState["condition"] | null | undefined;

  @observable
  disputeId?: string | null;

  @observable
  showUnitPrice?: boolean;

  @observable
  measurementType?: MeasurementType;

  @observable
  unitPriceUnit?: Unit;

  @observable
  unitPrice?: number;

  constructor(args: {
    readonly standardWarehouseId: string;
    readonly primaryCurrency: PaymentCurrencyCode;
    readonly initialState: Partial<InitialProductState>;
    readonly isCloning?: boolean;
    readonly storeCountries: ReadonlyArray<PickedShippingSettingsSchema>;
    readonly wishExpressCountries: ReadonlyArray<PickedWishExpressCountries>;
    readonly isStoreMerchant: boolean;
    readonly canManageShipping: boolean;
    readonly countriesWeShipTo: ReadonlyArray<PickedCountryWeShipTo>;
    readonly disputeId?: string | null;
  }) {
    const {
      initialState,
      isCloning,
      standardWarehouseId,
      primaryCurrency,
      storeCountries,
      wishExpressCountries,
      canManageShipping,
      countriesWeShipTo,
      disputeId,
    } = args;
    this.initialState = { ...initialState };

    this.id = isCloning ? undefined : initialState.id;
    this.sku = initialState.sku;
    this.name = isCloning ? i`Copy of ${initialState.name}` : initialState.name;
    this.tags = _.uniq([...(initialState.tags || [])]);
    this.enabled = initialState.enabled ?? true;
    this.description = initialState.description;
    this.createTime = initialState.createTime;
    this.lastUpdateTime = initialState.lastUpdateTime;
    if (initialState.mainImage) {
      this.images = [
        initialState.mainImage,
        ...(initialState.extraImages || []),
      ];
    }
    this.requestedBrand = initialState.requestedBrand;
    this.standardWarehouseId = standardWarehouseId;
    this.canManageShipping = canManageShipping;
    this.primaryCurrency = primaryCurrency;
    this.storeCountries = storeCountries;
    this.wishExpressCountries = Array.from(
      wishExpressCountries.map((country) => country.code)
    );
    this.countriesWeShipTo = countriesWeShipTo;
    this.msrp = initialState.msrp?.amount;
    this.upc = initialState.upc;
    this.condition = initialState.condition;
    this.isStoreMerchant = args.isStoreMerchant;
    this.disputeId = disputeId;
    const defaultShippingPrices = initialState.shipping?.defaultShipping;
    for (const defaultShipping of defaultShippingPrices || []) {
      this.defaultShippingPriceByWarehouseId.set(
        defaultShipping.warehouseId,
        defaultShipping.price.amount
      );
    }

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

    const warehouseCountryShippingSettings =
      initialState.shipping?.warehouseCountryShipping;
    for (const warehouseCountryShipping of warehouseCountryShippingSettings ||
      []) {
      for (const countryShipping of warehouseCountryShipping.countryShipping ||
        []) {
        const {
          country: { code: countryCode },
        } = countryShipping;
        const countryShippingState = new CountryShippingState({
          countryCode,
          countryShipping,
          editState: this,
          wishExpressEnabled:
            warehouseCountryShipping.shippingType == "WISH_EXPRESS",
        });
        this.countryShippingStates.set(countryCode, countryShippingState);
      }
    }

    let initialVariations = (initialState.variations || []).map(
      (variationInitial) =>
        new VariationEditState({
          initialState: variationInitial,
          isCloning,
          editState: this,
        })
    );

    if (initialVariations.length == 0) {
      initialVariations = [
        new VariationEditState({
          initialState: {
            // For store merchants they are used to not providing
            // SKU in the store app -- so just fake it for them.
            sku: this.isStoreMerchant
              ? faker.random.alphaNumeric(6).toUpperCase()
              : undefined,
          },
          isCloning,
          editState: this,
        }),
      ];
    }

    this.setVariations(initialVariations);

    this.hasColorOrSizeVariations = this.hasColors || this.hasSizes;
    this.variationFormState = new VariationsFormState({ editState: this });
  }

  @computed
  get isNewProduct(): boolean {
    return this.id == null;
  }

  @computed
  get unitPriceOptions(): ReadonlyArray<Option<Unit>> | undefined {
    if (this.measurementType == null) {
      return;
    }
    return MeasurementOptions[this.measurementType];
  }

  @computed
  get isViewableOnWish(): boolean {
    const {
      initialState: { reviewStatus },
    } = this;
    return reviewStatus == "APPROVED";
  }

  @computed
  get wishExpressEnabled(): CheckboxState {
    const { countryShippingStates, wishExpressCountries } = this;
    const wishExpressStatesArray = Array.from(
      countryShippingStates.values()
    ).filter((state) => wishExpressCountries.includes(state.countryCode));
    const allOn = wishExpressStatesArray.every(
      (state) => state.wishExpressEnabled
    );
    const anyOn = wishExpressStatesArray.some(
      (state) => state.wishExpressEnabled
    );

    if (allOn) {
      return "ON";
    }
    if (anyOn) {
      return "PARTIAL";
    }
    return "OFF";
  }

  @computed
  get isSingleVariation(): boolean {
    const { variationsList, hasColors, hasSizes } = this;
    return variationsList.length == 1 && !hasColors && !hasSizes;
  }

  @computed
  get singleVariation(): VariationEditState | undefined {
    const { isSingleVariation, variationsList } = this;
    return isSingleVariation ? variationsList[0] : undefined;
  }

  @computed
  get errorMessage(): string | undefined {
    const {
      images,
      description,
      name,
      variationsList,
      defaultShippingPriceForStandardWarehouse,
      countryShippingStates,
      canManageShipping,
      condition,
      showUnitPrice,
      measurementType,
      unitPriceUnit,
      unitPrice,
    } = this;
    if (images == null || images.length == 0) {
      return i`Please attach at least one image to your product`;
    }

    if (variationsList.length == 0) {
      return i`Please provide at least one variation`;
    }

    if (name == null || name.trim().length == 0) {
      return i`Please provide a product name`;
    }

    if (description == null || description.trim().length == 0) {
      return i`Please provide a product description`;
    }

    for (const variation of variationsList) {
      if (variation.errorMessage != null) {
        return variation.errorMessage;
      }
    }

    const uniqueVariationSkus = _.uniq(variationsList.map((v) => v.sku));
    if (uniqueVariationSkus.length != variationsList.length) {
      return i`Please make sure each of your variations has a unique sku`;
    }

    if (defaultShippingPriceForStandardWarehouse == null && canManageShipping) {
      return i`Please provide a default shipping price`;
    }

    const countryShipping = Array.from(countryShippingStates.values());
    for (const cs of countryShipping) {
      if (cs.errorMessage != null) {
        return cs.errorMessage;
      }
    }

    const hasEnabledCountry = countryShipping.some((cs) => cs.enabled);
    if (countryShipping.length > 0 && !hasEnabledCountry) {
      return i`Please enable shipping to at least one country`;
    }

    if (condition == null) {
      return i`Please select a condition for your product`;
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
      (!_.isInteger(unitPrice) || unitPrice <= 0)
    ) {
      return i`Reference value must be a positive integer.`;
    }

    return undefined;
  }

  @computed
  get canSave(): boolean {
    const { errorMessage } = this;
    return errorMessage != null;
  }

  @computed
  get hasListingDetailChange(): boolean {
    const {
      initialState: { description: initialDescription, name: initialName },
      name,
      description,
    } = this;

    return (
      (name || "").trim() != (initialName || "").trim() ||
      (description || "").trim() != (initialDescription || "").trim()
    );
  }

  @computed
  get hasImageChange(): boolean {
    const {
      initialState: { mainImage, extraImages = [] },
      images: rawImages,
      isNewProduct,
    } = this;
    if (isNewProduct) {
      return true;
    }
    const images = toJS(rawImages || []);
    const rawInitialImages = mainImage ? [mainImage, ...extraImages] : [];
    const initialImages = toJS(rawInitialImages || []);
    if (initialImages.length != images.length) {
      return true;
    }

    return !_.isEqual(initialImages, images);
  }

  @computed
  get saveButtonInactiveMessage(): string | undefined {
    const {
      initialState: { isRemovedByWish },
    } = this;
    if (isRemovedByWish) {
      return i`This product has been removed by Wish. You are only allowed to edit the SKU`;
    }
  }

  @computed
  get hasChanges(): boolean {
    const {
      initialState: {
        variations: initialVariations = [],
        tags: initialTags,
        requestedBrand: initialRequestedBrand,
        msrp: initialMsrp,
        upc: initialUpc,
        sku: initialSku,
      },
      tags,
      msrp,
      upc,
      sku,
      variationsList,
      hasImageChange,
      requestedBrand,
      isSingleVariation,
      hasListingDetailChange,
    } = this;
    if (
      !isSingleVariation &&
      initialVariations.length != variationsList.length
    ) {
      return true;
    }

    const variationChanged = variationsList.some(
      (variationState) => variationState.hasChanges
    );
    if (variationChanged) {
      return true;
    }

    if (hasImageChange) {
      return true;
    }

    if (hasListingDetailChange) {
      return true;
    }

    // Check if the tags changed
    // https://stackoverflow.com/a/6229258/11192264
    if (!_.isEmpty(_.xor(tags, initialTags || []))) {
      return true;
    }

    if (requestedBrand?.id != initialRequestedBrand?.id) {
      return true;
    }

    if (msrp != initialMsrp?.amount) {
      return true;
    }

    if (upc != initialUpc) {
      return true;
    }

    if (sku != initialSku) {
      return true;
    }

    return false;
  }

  @computed
  get hasTagChanges(): boolean {
    const {
      initialState: { tags: rawInitialTags },
      tags: rawTags,
    } = this;
    const initialTags = rawInitialTags || [];
    const tags = rawTags || [];
    if (tags.length != initialTags.length) {
      return true;
    }
    return tags.some((value) => !initialTags.includes(value));
  }

  @computed
  get variationsList(): ReadonlyArray<VariationEditState> {
    const { variations } = this;
    return _.sortBy(Array.from(variations.values()), (v) => v.isSaved);
  }

  @computed
  get savedVariations(): ReadonlyArray<VariationEditState> {
    const { variationsList } = this;
    return variationsList.filter((v) => v.isSaved);
  }

  @computed
  get hasColors(): boolean {
    return this.colorVariations.length > 0;
  }

  @computed
  get colorVariations(): ReadonlyArray<VariationEditState> {
    const { variationsList } = this;
    return variationsList.filter((variation) => variation.color != null);
  }

  @computed
  get hasSizes(): boolean {
    return this.sizeVariations.length > 0;
  }

  @computed
  get sizeVariations(): ReadonlyArray<VariationEditState> {
    const { variationsList } = this;
    return variationsList.filter((variation) => variation.size != null);
  }

  @action
  clearColorVariations() {
    this.variationFormState.colorsText = "";
    this.variationFormState.regenerateVariations();
  }

  @action
  clearSizeVariations() {
    this.variationFormState.sizesText = "";
    this.variationFormState.regenerateVariations();
  }

  @action
  setWishExpressEnabled(enabled: boolean) {
    const { countryShippingStates, wishExpressCountries } = this;
    countryShippingStates.forEach((state) => {
      if (wishExpressCountries.includes(state.countryCode) && state.enabled) {
        state.wishExpressEnabled = enabled;
      }
    });
  }

  @action
  setVariations(variations: ReadonlyArray<VariationEditState>) {
    this.discardAllNewVariations();
    const newVariarions: ReadonlyArray<[
      string,
      VariationEditState
    ]> = variations.map((variation) => [variation.key, variation]);

    for (const [variationKey, variation] of newVariarions) {
      this.variations.set(variationKey, variation);
    }
    this.syncImages();
  }

  @action
  discardVariations(variations: ReadonlyArray<VariationEditState>) {
    const keysToBeRamoved = variations.map((variation) => variation.key);
    for (const keyToBeRamoved of keysToBeRamoved) {
      this.variations.delete(keyToBeRamoved);
    }
  }

  @action
  discardAllNewVariations() {
    const keysToBeRamoved = this.variationsList
      .filter((variation) => !variation.isSaved)
      .map((v) => v.key);
    for (const keyToBeRamoved of keysToBeRamoved) {
      this.variations.delete(keyToBeRamoved);
    }
  }

  getVariations(args: VariationLookupArgs): ReadonlyArray<VariationEditState> {
    const { variationsList } = this;
    const lookupKey = (args as VariationKeyLookup).key;
    if (lookupKey) {
      const result = this.variations.get(lookupKey);
      return result ? [result] : [];
    }

    const lookupSku = (args as VariationSkuLookup).sku;
    if (lookupSku) {
      return variationsList.filter((variation) => {
        return variation.sku == lookupSku;
      });
    }

    const sizeColorLookupArgs = args as VariationSizeAndColorLookup;
    return variationsList.filter((variation) => {
      return (
        variation.size == sizeColorLookupArgs.size &&
        variation.color == sizeColorLookupArgs.color
      );
    });
  }

  getVariation(args: VariationLookupArgs): VariationEditState | undefined {
    const results = this.getVariations(args);
    if (results.length > 0) {
      return results[0];
    }
    return undefined;
  }

  hasVariation(args: VariationLookupArgs): boolean {
    return this.getVariation(args) != null;
  }

  setSingleVariationPrice(amount: number) {}

  @action
  setHasSizeAndColorVariations(hasSizeAndColorVariations: boolean) {
    this.discardAllNewVariations();
    this.hasColorOrSizeVariations = hasSizeAndColorVariations;
    if (hasSizeAndColorVariations) {
      this.variationFormState.syncFormText();
      return;
    }

    this.setVariations([
      new VariationEditState({ initialState: {}, editState: this }),
    ]);
  }

  @action
  setImages(images: ReadonlyArray<ImageSchema>) {
    this.images = images;
    this.syncImages();
  }

  @action
  syncImages() {
    const images = this.images || [];
    const imageUrls = images.map((im) => im.wishUrl);
    for (const variation of this.variationsList) {
      const { image } = variation;
      if (image != null && !imageUrls.includes(image?.wishUrl)) {
        variation.image = undefined;
      }

      if (variation.image == null && images.length > 0) {
        variation.image = images[0];
      }
    }
  }

  @computed
  get defaultShippingPriceForStandardWarehouse(): number | undefined {
    return this.getDefaultShippingPrice(this.standardWarehouseId);
  }

  getDefaultShippingPrice(
    warehouseId: string
  ): CurrencyValue["amount"] | undefined {
    const { defaultShippingPriceByWarehouseId } = this;
    const amount = defaultShippingPriceByWarehouseId.get(warehouseId);
    if (amount == null) {
      return undefined;
    }
    return amount;
  }

  @action
  setDefaultShippingPrice(amount: number, warehouseId: string) {
    const { defaultShippingPriceByWarehouseId } = this;
    if (isNaN(amount)) {
      defaultShippingPriceByWarehouseId.delete(warehouseId);
    } else {
      defaultShippingPriceByWarehouseId.set(warehouseId, Math.max(amount, 0));
    }
  }

  getCountryShippingState(countryCode: CountryCode): CountryShippingState {
    const state = this.countryShippingStates.get(countryCode);
    if (state != null) {
      return state;
    }

    const newState = new CountryShippingState({
      countryCode,
      editState: this,
      wishExpressEnabled: false,
    });
    this.countryShippingStates.set(countryCode, newState);
    return newState;
  }

  @action
  setMsrp(amount: number | null | undefined) {
    this.msrp = amount;
  }

  @action
  setUpc(upc: string) {
    this.upc = upc;
  }

  @action
  setSku(sku: string) {
    this.sku = sku;
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
    await navigationStore.navigate("/plus/products/list");
    // Lint doesn't see that the arg is a binary expression of string literals
    /* eslint-disable local-rules/only-literals-in-i18n,local-rules/unwrapped-i18n */
    if (isNewProduct) {
      toastStore.positive(
        ci18n(
          "popup telling the merchant a new product has been added to their store, (placeholder is singular). " +
            "The product name is placed in a link that leads to a page where they merchant can view the product",
          "[%1$s](%2$s) has been added to your store",
          name,
          `/plus/products/edit/${productId}`
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
          `/plus/products/edit/${productId}`
        ),
        {
          timeoutMs: 7000,
        }
      );
    }
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

  @computed
  private get asInput(): ProductUpsertInput {
    const {
      id,
      enabled,
      name,
      images,
      description,
      tags,
      msrp,
      upc,
      sku,
      hasImageChange,
      requestedBrand,
      primaryCurrency,
      variationsList,
      countryShippingStates,
      defaultShippingPriceByWarehouseId,
      condition,
      showUnitPrice,
      unitPrice,
      unitPriceUnit,
      measurementType,
    } = this;
    const msrpValue = msrp
      ? {
          amount: msrp,
          currencyCode: primaryCurrency,
        }
      : undefined;

    const regularCountryShippingInputList = Array.from(
      countryShippingStates.values()
    )
      .filter((countryShipping) => !countryShipping.wishExpressEnabled)
      .map((countryShipping) => countryShipping.asInput)
      .filter((input) => input != null) as ReadonlyArray<CountryShippingInput>;

    const expressCountryShippingInputList = Array.from(
      countryShippingStates.values()
    )
      .filter((countryShipping) => countryShipping.wishExpressEnabled)
      .map((countryShipping) => countryShipping.asInput)
      .filter((input) => input != null) as ReadonlyArray<CountryShippingInput>;

    let countryShipping: ReadonlyArray<WarehouseCountryShippingInput> = [];
    if (regularCountryShippingInputList.length > 0) {
      countryShipping = [
        ...countryShipping,
        {
          shippingType: "REGULAR",
          countryShipping: regularCountryShippingInputList,
        },
      ];
    }
    if (expressCountryShippingInputList.length > 0) {
      countryShipping = [
        ...countryShipping,
        {
          shippingType: "WISH_EXPRESS",
          countryShipping: expressCountryShippingInputList,
        },
      ];
    }

    const countryShippingValue =
      countryShipping.length > 0 ? countryShipping : undefined;

    const imageInput: ReadonlyArray<ImageInput> | undefined =
      hasImageChange && images
        ? images.map((image) => ({
            id: image.id,
            url: image.wishUrl,
            isCleanImage: image.isCleanImage,
          }))
        : undefined;

    const defaultShipping: ReadonlyArray<DefaultShippingInput> = Array.from(
      defaultShippingPriceByWarehouseId.entries()
    ).map(([warehouseId, amount]) => {
      return {
        warehouseId,
        price: {
          amount,
          currencyCode: primaryCurrency,
        },
      };
    });

    const requestedBrandId = requestedBrand?.id;

    const referencePriceInput: Pick<
      ProductUpsertInput,
      | "referenceArea"
      | "referenceLength"
      | "referenceUnit"
      | "referenceVolume"
      | "referenceWeight"
    > =
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

    return {
      id,
      sku,
      tags,
      name,
      msrp: msrpValue,
      upc: upc ? upc : undefined,
      images: imageInput,
      enabled,
      variations: variationsList.map((variation) => variation.asInput),
      description,
      defaultShipping,
      requestedBrandId,
      countryShipping: countryShippingValue,
      condition,
      ...referencePriceInput,
    };
  }
}

type VariationKeyLookup = {
  readonly key?: string | null | undefined;
};

type VariationSkuLookup = {
  readonly sku?: string | null | undefined;
};

type VariationSizeAndColorLookup = {
  readonly size?: string | null | undefined;
  readonly color?: string | null | undefined;
};

type VariationLookupArgs =
  | VariationKeyLookup
  | VariationSkuLookup
  | VariationSizeAndColorLookup;

export class VariationsFormState {
  @observable
  sizesText: string;

  @observable
  colorsText: string;

  @observable
  editState: ProductEditState;

  constructor({ editState }: { readonly editState: ProductEditState }) {
    this.sizesText = "";
    this.colorsText = "";
    this.editState = editState;
    this.syncFormText({ isInitialSync: true });
  }

  @action
  regenerateVariations() {
    const { editState, sizesText, colorsText } = this;
    if (colorsText.trim().length == 0 && sizesText.trim().length == 0) {
      editState.discardAllNewVariations();
      return;
    }
    let colorsList: ReadonlyArray<string> = colorsText
      .trim()
      .split(",")
      .filter((s) => s.trim().length > 0);
    let sizesList: ReadonlyArray<string> = sizesText
      .trim()
      .split(",")
      .filter((s) => s.trim().length > 0);
    sizesList = sizesList.length == 0 ? [""] : sizesList;
    colorsList = colorsList.length == 0 ? [""] : colorsList;

    const permutations = getPermutations(colorsList, sizesList);
    const newVariations: ReadonlyArray<VariationEditState> = permutations.map(
      ({ size: sizeValue, color: colorValue }) => {
        const color = colorValue?.trim().length == 0 ? undefined : colorValue;
        const size = sizeValue?.trim().length == 0 ? undefined : sizeValue;
        return (
          editState.getVariation({ color, size }) ||
          new VariationEditState({ initialState: { color, size }, editState })
        );
      }
    );

    editState.setVariations(_.uniqBy([...newVariations], (v) => v.key));
  }

  @action
  syncFormText(options?: { readonly isInitialSync: boolean }) {
    const { isInitialSync = false } = options || {};
    const { editState } = this;

    const fullSizesList = _.uniq(
      editState.sizeVariations.map(
        (variationState) => variationState.size || ""
      )
    );

    const fullColorsList = _.uniq(
      editState.colorVariations.map(
        (variationState) => variationState.color || ""
      )
    );

    // Only prefill the input boxes if variations exists for all
    // permutations of size and color.
    if (isInitialSync) {
      const permutations = getPermutations(fullColorsList, fullSizesList);
      const hasPerfectPairs = permutations.every(({ color, size }) =>
        editState.hasVariation({ color, size })
      );
      if (!hasPerfectPairs) {
        return;
      }
    }

    this.sizesText = fullSizesList.join(",");
    this.colorsText = fullColorsList.join(",");
  }
}

type PermutationResult = ReadonlyArray<{
  readonly color: string | null | undefined;
  readonly size: string | null | undefined;
}>;

const getPermutations = (
  colorsList: ReadonlyArray<string>,
  sizesList: ReadonlyArray<string>
): PermutationResult => {
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

export class UniqueSkuValidator extends Validator {
  editState: ProductEditState;
  customMessage: string | null | undefined;
  isNewVariationForm: boolean;

  constructor({
    editState,
    customMessage,
    isNewVariationForm,
  }: {
    customMessage?: string | null | undefined;
    editState: ProductEditState;
    isNewVariationForm?: boolean;
  }) {
    super({ customMessage });
    this.customMessage = customMessage;
    this.editState = editState;
    this.isNewVariationForm = !!isNewVariationForm;
  }

  async validateText(sku: string): Promise<ValidationResponse> {
    const { editState, isNewVariationForm } = this;
    const skuExists = editState.getVariations({ sku });
    if (!isNewVariationForm && skuExists.length > 1) {
      return (
        this.customMessage ||
        i`Can't have multiple variations with the same SKU`
      );
    }
    if (isNewVariationForm && skuExists.length > 0) {
      return (
        this.customMessage || i`You already have a variation with this SKU`
      );
    }
    return null;
  }
}
