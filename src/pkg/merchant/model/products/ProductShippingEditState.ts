import { action, computed, observable } from "mobx";

import {
  Country,
  CountryCode,
  CountryShippingInput,
  CountryShippingSchema,
  CurrencyInput,
  CurrencyValue,
  DefaultShippingInput,
  DefaultShippingSchema,
  DomesticShippingInput,
  DomesticShippingSchema,
  PaymentCurrencyCode,
  ProductCatalogMutationsUpsertProductArgs,
  ProductSchema,
  ProductUpsertInput,
  Region,
  RegionShippingSchema,
  RegionShippingInput,
  UpsertProduct,
  WarehouseCountryShippingInput,
  WarehouseCountryShippingSchema,
  Maybe,
  Datetime,
} from "@schema/types";
import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import gql from "graphql-tag";
import {
  MinMaxValueValidator,
  NumbersOnlyValidator,
  RequiredValidator,
  Validator,
} from "@toolkit/validators";

// todo: get this value from backend
const MIN_DELIVERY_DAYS = 1;
const UNITY_PENDING_PERIOD = 7;

export type PickedCountry = Pick<Country, "name" | "code" | "gmvRank">;

export type PickedShippingSettingsSchema = {
  readonly country: PickedCountry;
};

export type RegionPick = Pick<Region, "name" | "code">;

export type PickedRegionShippingSchema = Pick<
  CountryShippingSchema,
  "enabled" | "timeToDoor"
> & {
  readonly region: RegionPick;
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode"> | null;
};

type PickedDefaultShippingSchema = Pick<
  DefaultShippingSchema,
  "warehouseId" | "timeToDoor"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode">;
};

type PickedDomesticShippingSchema = Pick<
  DomesticShippingSchema,
  "warehouseId" | "enabled"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly priceEstimate: Pick<CurrencyValue, "amount" | "currencyCode">;
};

export type PickedCountryShippingSchema = Pick<
  CountryShippingSchema,
  "enabled" | "timeToDoor" | "wishExpressTtdRequirement"
> & {
  readonly country: PickedCountry;
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode"> | null;
  readonly regionShipping:
    | ReadonlyArray<RegionShippingSchema>
    | undefined
    | null;
};

type PickedWarehouseCountryShippingSchema = Pick<
  WarehouseCountryShippingSchema,
  "shippingType"
> & {
  readonly countryShipping:
    | ReadonlyArray<PickedCountryShippingSchema>
    | undefined
    | null;
};

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

export type InitialShippingState = Pick<
  ProductSchema,
  | "id"
  | "name"
  | "isPromoted"
  | "isUnityBlacklisted"
  | "isUnityPendingStandardWarehouse"
  | "isEuCompliant"
> & {
  readonly unityEffectiveDateStandardWarehouse?: Maybe<
    Pick<Datetime, "formatted">
  >;
  readonly shipping: {
    readonly defaultShipping:
      | null
      | undefined
      | ReadonlyArray<PickedDefaultShippingSchema>;
    readonly domesticShipping:
      | null
      | undefined
      | ReadonlyArray<PickedDomesticShippingSchema>;
    readonly warehouseCountryShipping:
      | null
      | undefined
      | ReadonlyArray<PickedWarehouseCountryShippingSchema>;
  };
};

export class CountryShippingState {
  @observable
  countryCode: CountryCode;

  @observable
  countryName: string;

  @observable
  shippingPrice: number | null | undefined;

  @observable
  timeToDoor: PickedCountryShippingSchema["timeToDoor"] | undefined;

  @observable
  wishExpressTTDRequirement: number | null | undefined;

  @observable
  topGMVCountry: boolean | null | undefined;

  @observable
  enabled: PickedCountryShippingSchema["enabled"] | null | undefined;

  @observable
  regions: ReadonlyArray<RegionPick> | null | undefined;

  @observable
  editState: ProductShippingEditState;

  @observable
  isCountryAllowWeRegionalPrice: boolean;

  @observable
  isStandardWarehouse: boolean;

  @observable
  private initialState: PickedCountryShippingSchema | null | undefined;

  @observable
  private regionalShippingPrices: Map<
    Region["code"],
    number | null | undefined
  > = new Map();

  @observable
  private oldRegionShippingEnabled: Map<Region["code"], boolean> = new Map();

  @observable
  private regionalShippingEnabled: Map<Region["code"], boolean> = new Map();

  @observable
  private regionsUseCountryShipping: Map<Region["code"], boolean> = new Map();

  @observable
  private regionsUseCountryTTD: Map<Region["code"], boolean> = new Map();

  @observable
  private regionalTimeToDoor: Map<
    Region["code"],
    PickedRegionShippingSchema["timeToDoor"] | undefined
  > = new Map();

  constructor(args: {
    readonly countryCode: CountryCode;
    readonly countryName: string;
    readonly gmvRank: number | null | undefined;
    readonly countryShipping?: PickedCountryShippingSchema | null | undefined;
    readonly editState: ProductShippingEditState;
    readonly isCountryAllowWeRegionalPrice: boolean;
    readonly isStandardWarehouse: boolean;
  }) {
    const {
      countryShipping,
      editState,
      countryCode,
      countryName,
      gmvRank,
      isCountryAllowWeRegionalPrice,
      isStandardWarehouse,
    } = args;
    this.countryCode = countryCode;
    this.countryName = countryName;
    this.enabled = countryShipping?.enabled ?? false;
    this.timeToDoor = countryShipping?.timeToDoor;
    this.wishExpressTTDRequirement = countryShipping?.wishExpressTtdRequirement;
    this.topGMVCountry = typeof gmvRank === "number" ? gmvRank <= 10 : false;
    this.shippingPrice = countryShipping?.price?.amount;
    this.editState = editState;
    this.isCountryAllowWeRegionalPrice = isCountryAllowWeRegionalPrice;
    this.initialState = countryShipping;
    this.regions = countryShipping?.regionShipping?.map(
      (regionShipping) => regionShipping.region,
    );
    this.isStandardWarehouse = isStandardWarehouse;
    countryShipping?.regionShipping?.forEach((regionShipping) => {
      this.setIsRegionEnabled(
        regionShipping.enabled || false,
        regionShipping.region.code,
      );
      this.setRegionPrice(
        regionShipping.price?.amount,
        regionShipping.region.code,
      );
      this.setIsRegionUsingCountryShipping(
        regionShipping.price?.amount == null ||
          regionShipping.price?.amount == this.shippingPrice,
        regionShipping.region.code,
      );
      this.setRegionalTimeToDoor(
        regionShipping?.timeToDoor,
        regionShipping.region.code,
      );
      this.setIsRegionUsingCountryTTD(
        regionShipping.timeToDoor == null,
        regionShipping.region.code,
      );
    });
    this.oldRegionShippingEnabled = new Map(this.regionalShippingEnabled);
  }

  @computed
  get priceAmount(): CurrencyValue["amount"] {
    const {
      shippingPrice: countryPrice,
      editState: { defaultShippingPriceForWarehouse },
    } = this;
    if (countryPrice == null) {
      return defaultShippingPriceForWarehouse || 0;
    }
    return countryPrice;
  }

  setPrice(amount: number) {
    this.shippingPrice = isNaN(amount) ? undefined : Math.max(amount, 0);
  }

  @action
  setEnabled(enabled: boolean) {
    const { regionalShippingEnabled } = this;
    this.enabled = enabled;
    Array.from(regionalShippingEnabled.keys()).forEach((key) => {
      regionalShippingEnabled.set(key, enabled);
    });
  }

  @action
  // Disable shipping for a country if all possible regions for a country are disabled
  setIsCountryEnabled() {
    const { regionalShippingEnabled } = this;
    if (
      Array.from(regionalShippingEnabled.values()).every((e) => e === false)
    ) {
      this.enabled = false;
    }
  }

  @computed
  get timeToDoorValue(): PickedCountryShippingSchema["timeToDoor"] | undefined {
    const { timeToDoor, wishExpressTTDRequirement, isStandardWarehouse } = this;
    if (timeToDoor == null && !isStandardWarehouse) {
      return wishExpressTTDRequirement;
    }
    return timeToDoor;
  }

  setTimeToDoor(timeToDoor: number | null | undefined) {
    this.timeToDoor = timeToDoor === undefined ? null : timeToDoor;
  }

  setRegionalTimeToDoor(
    timeToDoor: PickedRegionShippingSchema["timeToDoor"] | undefined,
    regionName: Region["code"],
  ) {
    this.regionalTimeToDoor.set(regionName, timeToDoor);
  }

  getRegionalTimeToDoor(
    regionName: Region["code"],
  ): PickedRegionShippingSchema["timeToDoor"] | undefined {
    return this.regionalTimeToDoor.get(regionName);
  }

  getRegionPrice(regionName: Region["code"]): number | null | undefined {
    return this.regionalShippingPrices.get(regionName);
  }

  setRegionPrice(
    amount: number | null | undefined,
    regionName: Region["code"],
  ) {
    this.regionalShippingPrices.set(regionName, amount);
  }

  getIsRegionEnabled(regionName: Region["code"]): boolean {
    return this.regionalShippingEnabled.get(regionName) || false;
  }

  setIsRegionEnabled(enabled: boolean, regionName: Region["code"]) {
    this.regionalShippingEnabled.set(regionName, enabled);
  }

  getIsRegionUsingCountryShipping(regionName: Region["code"]): boolean {
    return this.regionsUseCountryShipping.get(regionName) || false;
  }

  getIsRegionUsingCountryTTD(regionName: Region["code"]): boolean {
    return this.regionsUseCountryTTD.get(regionName) || false;
  }

  setIsRegionUsingCountryShipping(
    useCountryShipping: boolean,
    regionName: Region["code"],
  ) {
    this.regionsUseCountryShipping.set(regionName, useCountryShipping);
  }

  setIsRegionUsingCountryTTD(
    useCountryTTD: boolean,
    regionName: Region["code"],
  ) {
    this.regionsUseCountryTTD.set(regionName, useCountryTTD);
  }

  validateTTD({
    timeToDoor,
    countryName,
    regionName,
  }: {
    timeToDoor: PickedRegionShippingSchema["timeToDoor"] | undefined;
    countryName: string;
    regionName?: Region["name"];
  }): string | undefined {
    const { editState } = this;
    const name =
      regionName != undefined ? `${countryName} - ${regionName}` : countryName;
    if (
      typeof timeToDoor === "number" &&
      (timeToDoor > editState.maxDeliveryDays || timeToDoor < MIN_DELIVERY_DAYS)
    ) {
      return i`${name}: Max Delivery Days should be between ${MIN_DELIVERY_DAYS} and ${editState.maxDeliveryDays}`;
    }
    return undefined;
  }

  validateShippingPrice(regionCode: Region["code"]): string | undefined {
    const { countryCode } = this;
    let countryRegion: string | undefined = undefined;
    // validating shipping price for region
    const useCountryShipping = this.getIsRegionUsingCountryShipping(regionCode);
    const enabled = this.getIsRegionEnabled(regionCode);
    const shippingPrice = this.getRegionPrice(regionCode);
    if (
      !useCountryShipping &&
      enabled === true &&
      (shippingPrice == null || isNaN(shippingPrice))
    ) {
      countryRegion = countryCode + "_" + regionCode;
    }

    if (countryRegion) {
      return (
        i`Please provide a shipping price for ${countryRegion}. ` +
        i`You cannot remove the country shipping price once set.`
      );
    }

    return undefined;
  }

  @computed
  get errorMessage(): string | undefined {
    const { timeToDoor, regionalTimeToDoor, countryName, regions } = this;
    let message: string | undefined = undefined;

    // validating country ttd
    message = this.validateTTD({
      timeToDoor,
      countryName,
    });
    if (message) return message;

    // validating region
    for (const region of regionalTimeToDoor) {
      const [regionCode, regionTtd] = region;
      message = this.validateShippingPrice(regionCode);
      if (message) return message;
      const regionName = (regions || []).find(
        ({ code }) => code == regionCode,
      )?.name;
      message = this.validateTTD({
        timeToDoor: regionTtd,
        countryName,
        regionName,
      });
      if (message) return message;
    }

    return undefined;
  }

  asInput(
    defaultShippingPrice: number | undefined,
    sendTTDValue: boolean,
  ): CountryShippingInput | undefined {
    const {
      enabled,
      countryCode,
      shippingPrice,
      regions,
      timeToDoor,
      editState: { primaryCurrency },
    } = this;
    let priceInput: CurrencyInput | undefined = undefined;
    if (shippingPrice != null) {
      priceInput = {
        amount: shippingPrice,
        currencyCode: primaryCurrency,
      };
    } else if (
      defaultShippingPrice != undefined &&
      defaultShippingPrice != null
    ) {
      priceInput = {
        amount: defaultShippingPrice,
        currencyCode: primaryCurrency,
      };
    }

    const regionShippingInput: readonly RegionShippingInput[] | undefined =
      regions && regions.length > 0
        ? regions.map((region) => {
            const regionPrice = this.getRegionPrice(region.code);
            const regionEnabled = this.getIsRegionEnabled(region.code);
            return {
              regionCode: region.code,
              enabled: regionEnabled,
              price:
                regionPrice == null || !regionEnabled
                  ? null
                  : {
                      amount: regionPrice,
                      currencyCode: primaryCurrency,
                    },
              timeToDoor:
                this.getRegionalTimeToDoor(region.code) === undefined ||
                !sendTTDValue
                  ? null
                  : this.getRegionalTimeToDoor(region.code),
            };
          })
        : undefined;

    return {
      countryCode,
      enabled,
      timeToDoor: timeToDoor === undefined || !sendTTDValue ? null : timeToDoor,
      price: priceInput,
      regionShipping: regionShippingInput,
    };
  }
}

export default class ProductShippingEditState {
  @observable
  productId: InitialShippingState["id"] | null | undefined;

  @observable
  initialState: Partial<InitialShippingState>;

  @observable
  name: InitialShippingState["name"] | null | undefined;

  @observable
  isPromoted: InitialShippingState["isPromoted"] | null | undefined;

  @observable
  isUnityBlacklisted:
    | InitialShippingState["isUnityBlacklisted"]
    | null
    | undefined;

  @observable
  standardWarehouseId: string;

  @observable
  warehouseId: string;

  @observable
  primaryCurrency: PaymentCurrencyCode;

  @observable
  storeCountries: ReadonlyArray<PickedShippingSettingsSchema>;

  @observable
  warehouseConfiguredCountries: ReadonlyArray<PickedShippingSettingsSchema>;

  @observable
  unityCountries: ReadonlyArray<PickedCountry>;

  @observable
  euCompliantCountries: ReadonlyArray<PickedCountry>;

  @observable
  isCnMerchant: boolean;

  @observable
  isUnityEnabled: boolean;

  @observable
  maxDeliveryDays: number;

  @observable
  isUnityPendingStandardWarehouse: boolean | undefined;

  @observable
  isProductEuCompliant: boolean | undefined;

  @observable
  isMerchantInEuCompliantScope: boolean | undefined;

  @observable
  unityEffectiveDateStandardWarehouse: string | undefined;

  @observable
  allowProductShippingPage: boolean;

  @observable
  allowProductShippingPageWeOnly: boolean;

  @observable
  countriesAllowWeRegionalPrice: ReadonlyArray<PickedCountry>;

  @observable
  private defaultShippingPriceByWarehouseId: Map<string, number> = new Map();

  @observable
  private defaultTimeToDoorByWarehouseId: Map<
    string,
    PickedCountryShippingSchema["timeToDoor"] | undefined
  > = new Map();

  @observable
  private domesticShippingPriceByWarehouseId: Map<string, number> = new Map();

  @observable
  private domesticShippingEnabledByWarehouseId: Map<string, boolean> =
    new Map();

  @observable
  private domesticShippingEstimateByWarehouseId: Map<string, number> =
    new Map();

  @observable
  private countryShippingStates: Map<CountryCode, CountryShippingState> =
    new Map();

  @observable
  isSubmitting = false;

  @observable
  forceValidation = false;

  @observable
  showVariationShippingLink = true;

  constructor(args: {
    readonly standardWarehouseId: string;
    readonly warehouseId: string;
    readonly primaryCurrency: PaymentCurrencyCode;
    readonly initialState: Partial<InitialShippingState>;
    readonly storeCountries: ReadonlyArray<PickedShippingSettingsSchema>;
    readonly unityCountries: ReadonlyArray<PickedCountry>;
    readonly productDestinationCountries: ReadonlyArray<PickedCountry>;
    readonly isCnMerchant: boolean;
    readonly isUnityEnabled: boolean;
    readonly inEuComplianceScope: boolean;
    readonly maxDeliveryDays: number;
    readonly allowProductShippingPage: boolean;
    readonly allowProductShippingPageWeOnly: boolean;
    readonly countriesAllowWeRegionalPrice: ReadonlyArray<PickedCountry>;
  }) {
    const {
      initialState,
      standardWarehouseId,
      warehouseId,
      primaryCurrency,
      storeCountries,
      unityCountries,
      productDestinationCountries,
      isCnMerchant,
      isUnityEnabled,
      inEuComplianceScope,
      maxDeliveryDays,
      allowProductShippingPage,
      allowProductShippingPageWeOnly,
      countriesAllowWeRegionalPrice,
    } = args;
    this.initialState = { ...initialState };
    this.productId = initialState.id;
    this.name = initialState.name;
    this.isPromoted = initialState.isPromoted;
    this.isUnityBlacklisted = initialState.isUnityBlacklisted;
    this.standardWarehouseId = standardWarehouseId;
    this.warehouseId = warehouseId;
    this.primaryCurrency = primaryCurrency;
    this.unityCountries = unityCountries;
    this.euCompliantCountries = productDestinationCountries;
    this.isCnMerchant = isCnMerchant;
    this.isUnityEnabled = isUnityEnabled;
    this.maxDeliveryDays = maxDeliveryDays;
    this.allowProductShippingPage = allowProductShippingPage;
    this.allowProductShippingPageWeOnly = allowProductShippingPageWeOnly;
    this.countriesAllowWeRegionalPrice = countriesAllowWeRegionalPrice;
    this.isUnityPendingStandardWarehouse =
      initialState.isUnityPendingStandardWarehouse;
    this.isProductEuCompliant = initialState.isEuCompliant;
    this.isMerchantInEuCompliantScope = inEuComplianceScope;
    this.unityEffectiveDateStandardWarehouse =
      initialState.unityEffectiveDateStandardWarehouse?.formatted;

    const defaultShippingPrices = initialState.shipping?.defaultShipping;
    for (const defaultShipping of defaultShippingPrices || []) {
      this.defaultShippingPriceByWarehouseId.set(
        defaultShipping.warehouseId,
        defaultShipping.price.amount,
      );
      this.defaultTimeToDoorByWarehouseId.set(
        defaultShipping.warehouseId,
        defaultShipping.timeToDoor,
      );
    }

    const domesticShippingPrices = initialState.shipping?.domesticShipping;
    for (const domesticShipping of domesticShippingPrices || []) {
      this.domesticShippingPriceByWarehouseId.set(
        domesticShipping.warehouseId,
        domesticShipping.price.amount,
      );
      this.domesticShippingEnabledByWarehouseId.set(
        domesticShipping.warehouseId,
        domesticShipping.enabled,
      );
      this.domesticShippingEstimateByWarehouseId.set(
        domesticShipping.warehouseId,
        domesticShipping.priceEstimate.amount,
      );
    }

    const unityCountryCodes = unityCountries.map((country) => country.code);
    const sortedStoreCountries = Array.from(storeCountries).sort((a, b) => {
      if (a.country.name > b.country.name) {
        return 1;
      }
      if (a.country.name < b.country.name) {
        return -1;
      }
      return 0;
    });
    this.storeCountries =
      this.showDomesticShippingPrice && !this.isUnityPendingStandardWarehouse
        ? sortedStoreCountries.filter(
            (country) => !unityCountryCodes.includes(country.country.code),
          )
        : sortedStoreCountries;

    const storeCountryCodes = this.storeCountries.map(
      (country) => country.country.code,
    );
    let allCountryShippingSet: boolean = true;
    const warehouseCountryShippingSettings =
      initialState.shipping?.warehouseCountryShipping;
    const warehouseConfiguredCountries = [];
    for (const warehouseCountryShipping of warehouseCountryShippingSettings ||
      []) {
      for (const countryShipping of warehouseCountryShipping.countryShipping ||
        []) {
        const {
          country: { code: countryCode, name: countryName, gmvRank },
        } = countryShipping;
        if (storeCountryCodes.includes(countryCode)) {
          if (countryShipping.enabled) {
            allCountryShippingSet =
              allCountryShippingSet && Boolean(countryShipping.price);
          }
          const isCountryAllowWeRegionalPrice =
            this.getIsCountryAllowWeRegionalPrice(countryCode);
          const countryShippingState = new CountryShippingState({
            countryCode,
            countryName,
            gmvRank,
            countryShipping,
            editState: this,
            isCountryAllowWeRegionalPrice,
            isStandardWarehouse: this.standardWarehouseId === this.warehouseId,
          });
          this.countryShippingStates.set(countryCode, countryShippingState);
          warehouseConfiguredCountries.push(countryShipping);
        }
      }
    }
    this.warehouseConfiguredCountries = Array.from(
      warehouseConfiguredCountries,
    ).sort((a, b) => {
      if (a.country.name > b.country.name) {
        return 1;
      }
      if (a.country.name < b.country.name) {
        return -1;
      }
      return 0;
    });
    this.showVariationShippingLink = !allCountryShippingSet;
  }

  @computed
  get isStandardWarehouse(): boolean {
    const { standardWarehouseId, warehouseId } = this;
    return standardWarehouseId === warehouseId;
  }

  @computed
  get showTTDColumn(): boolean {
    const {
      isStandardWarehouse,
      allowProductShippingPage,
      allowProductShippingPageWeOnly,
      isCnMerchant,
      showAdvancedSection,
    } = this;
    return (
      (allowProductShippingPage && !isCnMerchant) ||
      (allowProductShippingPageWeOnly && !isStandardWarehouse) ||
      (!showAdvancedSection &&
        ((isCnMerchant && !isStandardWarehouse) || !isCnMerchant))
    );
  }

  @computed
  get showCustomizeShippingSection(): boolean {
    return this.warehouseConfiguredCountries.length > 0;
  }

  @computed
  get ttdColumnDescription(): string {
    const { isStandardWarehouse } = this;
    const description = isStandardWarehouse
      ? i`This warehouse is your default warehouse. Max delivery days will be high, ` +
        i`and based on historical performance, unless specified.`
      : i`This warehouse is defaulted to wish express. Max delivery days will be ` +
        i`based on normal wish express policies unless specified.`;
    return (
      i`The maximum number of business days it will take for an order to ` +
      i`be processed and delivered to your customer’s door. ` +
      description
    );
  }

  @computed
  get ttdValidators(): ReadonlyArray<Validator> {
    const { maxDeliveryDays, minDeliveryDays } = this;
    return [
      new MinMaxValueValidator({
        customMessage: i`Value should be between ${minDeliveryDays} and ${maxDeliveryDays}.`,
        minAllowedValue: minDeliveryDays,
        maxAllowedValue: maxDeliveryDays,
        allowBlank: true,
      }),
      new NumbersOnlyValidator({
        customMessage: i`Value must be an integer.`,
      }),
    ];
  }

  @computed
  get shippingPriceValidators(): ReadonlyArray<Validator> {
    return [
      new MinMaxValueValidator({
        customMessage: i`Value should be greater than or equal to ${0}.`,
        minAllowedValue: 0,
      }),
      new RequiredValidator(),
    ];
  }

  @computed
  get minDeliveryDays(): number {
    return MIN_DELIVERY_DAYS;
  }

  @computed
  get showAdvancedSection(): boolean {
    const {
      isCnMerchant,
      isStandardWarehouse,
      isUnityEnabled,
      isUnityBlacklisted,
    } = this;
    return (
      isCnMerchant &&
      isStandardWarehouse &&
      isUnityEnabled &&
      !isUnityBlacklisted
    );
  }

  @computed
  get showUnityEffectiveDate(): boolean {
    const { showDomesticShippingPrice, isUnityPendingStandardWarehouse } = this;
    return showDomesticShippingPrice && isUnityPendingStandardWarehouse == true;
  }

  @computed
  get unityPendingPeriod(): number {
    return UNITY_PENDING_PERIOD;
  }

  @computed
  get showDomesticShippingPrice(): boolean {
    const { warehouseId } = this;
    const domesticShippingEnabled =
      this.getDomesticShippingEnabled(warehouseId);
    return this.showAdvancedSection && domesticShippingEnabled !== undefined;
  }

  @computed
  get unityCountryCodesEnabled(): ReadonlyArray<CountryCode> {
    const { countryShippingStates, unityCountries } = this;
    const unityCountryCodes = unityCountries.map((country) => country.code);
    return Array.from(countryShippingStates.values())
      .filter(
        (countryShipping) =>
          countryShipping != null &&
          countryShipping.enabled &&
          unityCountryCodes.includes(countryShipping.countryCode),
      )
      .map(
        (countryShipping) => countryShipping.countryCode,
      ) as ReadonlyArray<CountryCode>;
  }

  @computed
  get hasUnityCountriesEnabled(): boolean {
    const { countryShippingStates, unityCountries } = this;
    const unityCountryCodes = unityCountries.map((country) => country.code);
    return Array.from(countryShippingStates.values()).some(
      (countryShipping) =>
        countryShipping.enabled &&
        unityCountryCodes.includes(countryShipping.countryCode),
    );
  }

  @computed
  get showDisableDomesticShippingConfirmation(): boolean {
    const { warehouseId, wasDomesticShippingEnabled } = this;
    const domesticShippingEnabled =
      this.getDomesticShippingEnabled(warehouseId);
    return (
      this.showAdvancedSection &&
      domesticShippingEnabled === false &&
      wasDomesticShippingEnabled
    );
  }

  @computed
  get showDefaultShippingConfirmation(): boolean {
    const { warehouseId } = this;
    const defaultShippingPrice = this.getDefaultShippingPrice(warehouseId);
    return defaultShippingPrice != null;
  }

  @computed
  get showConfirmation(): boolean {
    const {
      showDisableDomesticShippingConfirmation,
      showDefaultShippingConfirmation,
    } = this;
    return (
      showDisableDomesticShippingConfirmation || showDefaultShippingConfirmation
    );
  }

  @computed
  get isAfterEUComplianceDate(): boolean {
    return true;
  }

  @computed
  get showEUComplianceBanners(): boolean {
    const { isProductEuCompliant, isMerchantInEuCompliantScope } = this;

    return (
      isMerchantInEuCompliantScope === true && isProductEuCompliant === false
    );
  }

  @computed
  get showUnityEUComplianceBanners(): boolean {
    const { showDomesticShippingPrice } = this;

    return showDomesticShippingPrice && this.showEUComplianceBanners;
  }

  @computed
  get errorMessage(): string | undefined {
    const {
      defaultShippingPriceForWarehouse,
      wasDefaultShippingSet,
      domesticShippingPriceForStandardWarehouse,
      wasStandardDomesticShippingSet,
      countryShippingStates,
    } = this;
    if (wasDefaultShippingSet && defaultShippingPriceForWarehouse == null) {
      return (
        i`Please provide a default shipping price. ` +
        i`You cannot remove the default shipping price once set.`
      );
    }

    if (
      wasStandardDomesticShippingSet &&
      domesticShippingPriceForStandardWarehouse == null
    ) {
      return (
        i`Please provide a First-Mile Shipping Price. ` +
        i`You cannot remove the First-Mile Shipping Price once set.`
      );
    }

    const countryShipping = Array.from(countryShippingStates.values());
    for (const cs of countryShipping) {
      if (cs.errorMessage != null) {
        return cs.errorMessage;
      }
    }

    return undefined;
  }

  @computed
  get canSave(): boolean {
    const { errorMessage } = this;
    return errorMessage != null;
  }

  @computed
  get hasChanges(): boolean {
    return true;
  }

  @computed
  get defaultShippingPriceForWarehouse(): number | undefined {
    return this.getDefaultShippingPrice(this.warehouseId);
  }

  @computed
  get defaultTTD(): number | undefined {
    return this.getDefaultTTD(this.warehouseId);
  }

  @computed
  get wasDefaultShippingSet(): boolean {
    const { initialState, warehouseId } = this;
    const defaultShippingPrices = initialState.shipping?.defaultShipping;
    return (defaultShippingPrices || []).some(
      (defaultShipping) => defaultShipping.warehouseId == warehouseId,
    );
  }

  @computed
  get domesticShippingPriceForStandardWarehouse(): number | undefined {
    return this.getDomesticShippingPrice(this.standardWarehouseId);
  }

  @computed
  get wasStandardDomesticShippingSet(): boolean {
    const { initialState, standardWarehouseId } = this;
    const domesticShippingPrices = initialState.shipping?.domesticShipping;
    return (domesticShippingPrices || []).some(
      (domesticShipping) => domesticShipping.warehouseId == standardWarehouseId,
    );
  }

  getDefaultShippingPrice(
    warehouseId: string,
  ): CurrencyValue["amount"] | undefined {
    const { defaultShippingPriceByWarehouseId } = this;
    const amount = defaultShippingPriceByWarehouseId.get(warehouseId);
    if (amount == null) {
      return undefined;
    }
    return amount;
  }

  getDefaultTTD(warehouseId: string): number | undefined {
    const { defaultTimeToDoorByWarehouseId } = this;
    const ttd = defaultTimeToDoorByWarehouseId.get(warehouseId);
    if (ttd == null) {
      return undefined;
    }
    return ttd;
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

  getDomesticShippingEnabled(warehouseId: string): boolean | undefined {
    const { domesticShippingEnabledByWarehouseId } = this;
    return domesticShippingEnabledByWarehouseId.get(warehouseId);
  }

  @action
  setDomesticShippingEnabled(enabled: boolean, warehouseId: string) {
    const { domesticShippingEnabledByWarehouseId } = this;
    domesticShippingEnabledByWarehouseId.set(warehouseId, enabled);
  }

  @computed
  get wasDomesticShippingEnabled(): boolean {
    const { initialState, warehouseId } = this;
    const domesticShippingPrices = initialState.shipping?.domesticShipping;
    return (domesticShippingPrices || []).some(
      (domesticShipping) =>
        domesticShipping.warehouseId == warehouseId && domesticShipping.enabled,
    );
  }

  getDomesticShippingPrice(
    warehouseId: string,
  ): CurrencyValue["amount"] | undefined {
    const { domesticShippingPriceByWarehouseId } = this;
    const amount = domesticShippingPriceByWarehouseId.get(warehouseId);
    if (amount == null) {
      return undefined;
    }
    return amount;
  }

  @action
  setDomesticShippingPrice(amount: number, warehouseId: string) {
    const { domesticShippingPriceByWarehouseId } = this;
    if (isNaN(amount)) {
      domesticShippingPriceByWarehouseId.delete(warehouseId);
    } else {
      domesticShippingPriceByWarehouseId.set(warehouseId, amount);
    }
  }

  getDomesticShippingEstimate(
    warehouseId: string,
  ): CurrencyValue["amount"] | undefined {
    const { domesticShippingEstimateByWarehouseId } = this;
    const amount = domesticShippingEstimateByWarehouseId.get(warehouseId);
    if (amount == null) {
      return undefined;
    }
    return amount;
  }

  getCountryShippingState(country: PickedCountry): CountryShippingState {
    const state = this.countryShippingStates.get(country.code);
    if (state != null) {
      return state;
    }

    const newState = new CountryShippingState({
      countryCode: country.code,
      countryName: country.name,
      gmvRank: undefined,
      editState: this,
      isCountryAllowWeRegionalPrice: this.getIsCountryAllowWeRegionalPrice(
        country.code,
      ),
      isStandardWarehouse: this.isStandardWarehouse,
    });
    this.countryShippingStates.set(country.code, newState);
    return newState;
  }

  getIsCountryAllowWeRegionalPrice(countryCode: CountryCode): boolean {
    const countryCodesAllowWeRegionalPrice =
      this.countriesAllowWeRegionalPrice.map((country) => country.code);

    return countryCodesAllowWeRegionalPrice.includes(countryCode);
  }

  @action
  async validate() {
    const { errorMessage } = this;
    this.forceValidation = true;
    const toastStore = ToastStore.instance();
    if (errorMessage != null) {
      toastStore.negative(errorMessage, {
        timeoutMs: 4000,
      });
      return false;
    }
    return true;
  }

  @action
  async submit() {
    const { name, asInput: input } = this;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    const { client } = ApolloStore.instance();

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
    toastStore.positive(
      i`Shipping prices have been updated for product ${name}`,
      {
        timeoutMs: 7000,
      },
    );
    navigationStore.reload();
  }

  @computed
  private get asInput(): ProductUpsertInput {
    const {
      productId,
      primaryCurrency,
      countryShippingStates,
      defaultShippingPriceByWarehouseId,
      domesticShippingPriceByWarehouseId,
      domesticShippingEnabledByWarehouseId,
      unityCountries,
      warehouseId,
      isUnityPendingStandardWarehouse,
      showTTDColumn,
    } = this;
    const domesticShippingEnabled =
      this.getDomesticShippingEnabled(warehouseId);
    const unityCountryCodes = unityCountries.map((country) => country.code);
    const unityCountryCodesToDisable = isUnityPendingStandardWarehouse
      ? unityCountryCodes.filter(
          (cc) => !this.unityCountryCodesEnabled.includes(cc),
        )
      : unityCountryCodes;
    const unityDisabledCountryInputList =
      this.showDomesticShippingPrice && domesticShippingEnabled === false
        ? unityCountryCodesToDisable.map((cc) => {
            return {
              countryCode: cc,
              enabled: false,
            } as CountryShippingInput;
          })
        : [];

    const defaultShippingPrice = this.getDefaultShippingPrice(warehouseId);
    const countryShippingInputList = [
      ...Array.from(countryShippingStates.values()).map((countryShipping) =>
        countryShipping.asInput(defaultShippingPrice, showTTDColumn),
      ),
      ...unityDisabledCountryInputList,
    ].filter((input) => input != null) as ReadonlyArray<CountryShippingInput>;

    const countryShipping: ReadonlyArray<WarehouseCountryShippingInput> = [
      {
        shippingType: "REGULAR",
        countryShipping: countryShippingInputList,
      },
    ];

    const countryShippingValue =
      countryShipping.length > 0 ? countryShipping : undefined;

    const defaultShipping: ReadonlyArray<DefaultShippingInput> = Array.from(
      defaultShippingPriceByWarehouseId.entries(),
    ).map(([warehouseId, amount]) => {
      return {
        warehouseId,
        price: {
          amount,
          currencyCode: primaryCurrency,
        },
      };
    });

    const domesticShipping: ReadonlyArray<DomesticShippingInput> = Array.from(
      domesticShippingEnabledByWarehouseId.entries(),
    ).map(([warehouseId, enabled]) => {
      const amount = domesticShippingPriceByWarehouseId.get(warehouseId);
      return {
        warehouseId,
        enabled,
        price:
          amount != null
            ? {
                amount,
                currencyCode: primaryCurrency,
              }
            : null,
      };
    });

    return {
      id: productId,
      defaultShipping,
      domesticShipping,
      warehouseId,
      countryShipping: countryShippingValue,
    };
  }
}
