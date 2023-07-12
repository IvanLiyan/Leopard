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
  WishExpressCountryDetails,
  WarehouseCountryShippingSchema,
  ProductCategoryDisputeSchema,
  TrueTagSchema,
  Weight,
  Length,
  Volume,
  Area,
  Count,
  RegionShippingSchema,
  UserGateSchema,
  ProductConstantsSchema,
  MerchantProvidedAttributeSchema,
  DeciderKeySchema,
} from "@schema";
import { gql } from "@gql";
import { PickedCategory } from "@core/taxonomy/toolkit";

export const ADD_PRODUCT_INITIAL_DATA_QUERY = gql(`
  query AddProduct_GetInitialDataQuery {
    currentMerchant {
      standardWarehouseId
      primaryCurrency
      canManageShipping
      isCnForFulfillment
      isStoreMerchant
      shippingSettings(enabled: true) {
        country {
          name
          code
          gmvRank
          regions {
            code
            name
          }
          wishExpress {
            expectedTimeToDoor
          }
        }
      }
      countryOfDomicile {
        code
      }
    }
    currentUser {
      gating {
        useCalculatedShipping: isAllowed(name: "use_calculated_shipping")
        showVariationGroupingMUG: isAllowed(name: "variation_options")
      }
    }
    platformConstants {
      product {
        prop65Chemicals
      }
      deciderKey {
        showVariationGroupingDkey: decideForName(name: "variation_grouping_ui")
        showRevampedAddEditProductUI: decideForName(
          name: "add_edit_product_ui_revamp"
        )
        showInventoryOnHand: decideForName(name: "show_inventory_on_hand")
      }
    }
    productCatalog {
      productCount
    }
  }
`);

export const EDIT_PRODUCT_INITIAL_DATA_QUERY = gql(`
  query EditProduct_GetInitialDataQuery($productId: String) {
    currentMerchant {
      standardWarehouseId
      primaryCurrency
      canManageShipping
      isCnForFulfillment
      shippingSettings(enabled: true) {
        country {
          name
          code
          gmvRank
          regions {
            code
            name
          }
          wishExpress {
            expectedTimeToDoor
          }
        }
      }
      countryOfDomicile {
        code
      }
    }
    currentUser {
      gating {
        useCalculatedShipping: isAllowed(name: "use_calculated_shipping")
        showVariationGroupingMUG: isAllowed(name: "variation_options")
      }
    }
    platformConstants {
      product {
        prop65Chemicals
      }
      deciderKey {
        showVariationGroupingDkey: decideForName(name: "variation_grouping_ui")
        showRevampedAddEditProductUI: decideForName(
          name: "add_edit_product_ui_revamp"
        )
        showInventoryOnHand: decideForName(name: "show_inventory_on_hand")
      }
    }
    policy {
      productCategoryDispute {
        disputes(
          searchType: PRODUCT_ID
          query: $productId
          states: [PENDING_REVIEW, RESOLVED_UNCHANGED, RESOLVED_UPDATE]
        ) {
          id
        }
      }
    }
    productCatalog {
      product(id: $productId) {
        id
        name
        sku
        description
        enabled
        reviewStatus
        condition
        maxQuantity
        eligibleForCategoryDispute
        warningType
        chemicalNames
        subcategory {
          id
          name
          categoryChildren {
            id
            name
          }
          categoriesAlongPath {
            id
            name
          }
        }
        createTime {
          formatted(fmt: "%s")
        }
        lastUpdateTime {
          formatted(fmt: "%s")
        }
        tags
        upc
        referenceWeight {
          unit
          value
        }
        referenceLength {
          unit
          value
        }
        referenceVolume {
          unit
          value
        }
        referenceArea {
          unit
          value
        }
        referenceUnit {
          unit
          value
        }
        variations {
          id
          sku
          color
          size
          gtin
          enabled
          declaredValue {
            amount
          }
          declaredName
          declaredLocalName
          pieces
          hasPowder
          hasLiquid
          hasBattery
          hasMetal
          originCountry {
            code
          }
          weight {
            value(targetUnit: GRAM)
          }
          effectiveWeight {
            value(targetUnit: GRAM)
          }
          height {
            value(targetUnit: CENTIMETER)
          }
          width {
            value(targetUnit: CENTIMETER)
          }
          length {
            value(targetUnit: CENTIMETER)
          }
          customsHsCode
          price {
            amount
            currencyCode
          }
          image {
            id
            wishUrl
            isCleanImage
          }
          inventory {
            count
            shippingType
            warehouseId
          }
          quantityWeight {
            value
          }
          quantityLength {
            value
          }
          quantityVolume {
            value
          }
          quantityArea {
            value
          }
          quantityUnit {
            value
          }
          attributes {
            name
            value
          }
          options {
            name
            value
          }
        }
        mainImage {
          id
          wishUrl
          isCleanImage
        }
        extraImages {
          id
          wishUrl
          isCleanImage
        }
        requestedBrand {
          id
          displayName
          logoUrl
        }
        shipping {
          defaultShipping {
            warehouseId
            price {
              amount
              currencyCode
            }
          }
          warehouseCountryShipping {
            shippingType
            countryShipping {
              enabled
              timeToDoor
              wishExpressTtdRequirement
              regionShipping {
                enabled
                timeToDoor
                region {
                  name
                  code
                }
                price {
                  amount
                }
              }
              country {
                code
                name
                gmvRank
                regions {
                  code
                  name
                }
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
        isRemovedByWish
        categories {
          name
        }
        attributes {
          name
          value
        }
      }
    }
  }
`);

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
  | "attributes"
  | "enabled"
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
  readonly options?: ReadonlyArray<PickedMerchantVariationOption> | null;
};

export type PickedMerchantVariationOption = Pick<
  MerchantProvidedAttributeSchema,
  "name" | "value"
>;

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
  | "upc"
  | "reviewStatus"
  | "isRemovedByWish"
  | "condition"
  | "eligibleForCategoryDispute"
  | "maxQuantity"
  | "warningType"
  | "chemicalNames"
  | "attributes"
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
  readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">> | null;
  readonly referenceWeight?: Pick<Weight, "value" | "unit"> | null | undefined;
  readonly referenceLength?: Pick<Length, "value" | "unit"> | null | undefined;
  readonly referenceVolume?: Pick<Volume, "value" | "unit"> | null | undefined;
  readonly referenceArea?: Pick<Area, "value" | "unit"> | null | undefined;
  readonly referenceUnit?: Pick<Count, "value" | "unit"> | null | undefined;
  readonly subcategory?:
    | (PickedCategory & {
        readonly categoriesAlongPath: ReadonlyArray<PickedCategory>;
        readonly categoryChildren?: ReadonlyArray<PickedCategory>;
      })
    | null;
};

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
    | "isCnForFulfillment"
  > & {
    readonly shippingSettings: ReadonlyArray<PickedShippingSettingsSchema>;
    readonly countryOfDomicile?: Pick<Country, "code"> | null;
  };

  readonly currentUser: {
    readonly gating: {
      readonly useCalculatedShipping: UserGateSchema["isAllowed"];
      readonly showVariationGroupingMUG: UserGateSchema["isAllowed"];
    };
  };

  readonly platformConstants: {
    readonly product: Pick<ProductConstantsSchema, "prop65Chemicals">;
    readonly deciderKey?: {
      readonly showVariationGroupingDkey: DeciderKeySchema["decideForName"];
      readonly showRevampedAddEditProductUI: DeciderKeySchema["decideForName"];
      readonly showInventoryOnHand: DeciderKeySchema["decideForName"];
    } | null;
  };

  readonly productCatalog: Pick<ProductCatalogSchema, "productCount"> & {
    readonly product: InitialProductState | null | undefined;
  };
};
