import {
  ImageSchema,
  MerchantWarehouseSchema,
  ProductCatalogSchema,
  ProductCatalogSchemaProductCountV2Args,
  ProductCatalogSchemaProductsV2Args,
  ProductSchema,
  WarehouseCountryShippingSchema,
  TrueTagSchema,
  VariationSchema,
  CurrencyValue,
  InventorySchema,
  Datetime,
  Country,
  ProductSchemaShippingArgs,
  MerchantSchema,
  ProductCatalogMutationsRemoveProductArgs,
  RemoveProduct,
  CommerceProductListingState,
  ListingStateSchema,
  UpsertProducts,
  UpsertProductsErrorItem,
  ProductCatalogMutationsUpsertProductsArgs,
  ProductCatalogMutationsDownloadAllProductsArgs,
  DownloadAllProducts,
  DefaultShippingSchema,
  CountryShippingSchema,
  Weight,
  Length,
  Volume,
  Area,
  Count,
  BrandSchema,
  CountryCode,
  ProductCsvColumnName,
  MerchantWarehouseMutationsDeleteWarehouseArgs,
  DeleteMerchantWarehouseMutation,
  ProductSchemaVariationsArgs,
  TaxonomyCategorySchema,
  MerchantProvidedAttributeSchema,
  UserGateSchema,
  DeciderKeySchema,
} from "@schema";
import gql from "graphql-tag";
import { ci18n } from "@core/toolkit/i18n";
import { IllustrationName } from "@core/components/Illustration";
import {
  ContestWarningDisplayNames,
  Unit,
  unitDisplayName,
} from "@add-edit-product/toolkit";

export const COLLAPSED_VARIATIONS_SHOWN = 5;

// Initial data
export type PickedWarehouse = Pick<MerchantWarehouseSchema, "id" | "unitId"> & {
  readonly address?: {
    readonly country: Pick<Country, "code">;
  } | null;
};

export const PRODUCTS_CONTAINER_INITIAL_DATA_QUERY = gql`
  query AllProducts_ProductsContainerInitialDataQuery {
    currentMerchant {
      state
      canAccessPaidPlacement
      warehouses {
        id
        unitId
        address {
          country {
            code
          }
        }
      }
    }
    currentUser {
      gating {
        showVariationGroupingMUG: isAllowed(name: "variation_options")
      }
    }
    platformConstants {
      deciderKey {
        showVariationGroupingDkey: decideForName(name: "variation_grouping_ui")
      }
    }
  }
`;

export type ProductsContainerInitialData = {
  readonly currentMerchant?:
    | (Pick<MerchantSchema, "canAccessPaidPlacement" | "state"> & {
        readonly warehouses?: ReadonlyArray<PickedWarehouse> | null;
      })
    | null;
  readonly currentUser?: {
    readonly gating: {
      readonly showVariationGroupingMUG: UserGateSchema["isAllowed"];
    };
  } | null;
  readonly platformConstants?: {
    readonly deciderKey?: {
      readonly showVariationGroupingDkey: DeciderKeySchema["decideForName"];
    } | null;
  } | null;
};

// Get product count query
export const GET_PRODUCT_COUNT_QUERY = gql`
  query AllProducts_GetProductCount(
    $query: String
    $merchantId: ObjectIdType
    $searchType: ProductSearchType
    $isEnabled: Boolean
    $state: ProductListingState
    $fpReviewStatus: ProductFPReviewStatus
    $isWishExpress: Boolean
    $hasBrand: Boolean
    $isPromoted: Boolean
    $isCleanImage: Boolean
    $isReturnEnrolled: Boolean
  ) {
    productCatalog {
      productCountV2(
        query: $query
        merchantId: $merchantId
        searchType: $searchType
        isEnabled: $isEnabled
        state: $state
        fpReviewStatus: $fpReviewStatus
        isWishExpress: $isWishExpress
        hasBrand: $hasBrand
        isPromoted: $isPromoted
        isCleanImage: $isCleanImage
        isReturnEnrolled: $isReturnEnrolled
      )
    }
  }
`;

export type GetProductCountResponseType = {
  readonly productCatalog?: Pick<ProductCatalogSchema, "productCountV2"> | null;
};

export type GetProductCountRequestType = ProductCatalogSchemaProductCountV2Args;

// Get products query
export const GET_PRODUCTS_QUERY = gql`
  query AllProducts_GetProducts(
    $query: String
    $searchType: ProductSearchType
    $merchantId: ObjectIdType
    $offset: Int
    $limit: Int
    $sort: ProductSort
    $isEnabled: Boolean
    $state: ProductListingState
    $fpReviewStatus: ProductFPReviewStatus
    $isWishExpress: Boolean
    $hasBrand: Boolean
    $isPromoted: Boolean
    $isCleanImage: Boolean
    $isReturnEnrolled: Boolean
    $warehouseId: String
  ) {
    productCatalog {
      productsV2(
        query: $query
        searchType: $searchType
        merchantId: $merchantId
        offset: $offset
        limit: $limit
        sort: $sort
        isEnabled: $isEnabled
        state: $state
        fpReviewStatus: $fpReviewStatus
        isWishExpress: $isWishExpress
        hasBrand: $hasBrand
        isPromoted: $isPromoted
        isCleanImage: $isCleanImage
        isReturnEnrolled: $isReturnEnrolled
      ) {
        id
        name
        sku
        enabled
        isRemovedByWish
        isRemovedByMerchant
        isRemoved
        isPromoted
        sales
        wishes
        isLtl
        isReturnsEnabled
        isWishExpress
        categoryExperienceEligibility
        subcategoryId
        subcategory {
          id
          name
          categoriesAlongPath {
            id
            name
          }
        }
        variationOptions
        listingState {
          state
          reason
        }
        mainImage {
          wishUrl(size: TINY)
          isCleanImage
        }
        extraImages {
          isCleanImage
        }
        hasBrand
        shipping(warehouseId: $warehouseId) {
          warehouseCountryShipping {
            shippingType
            countryShipping {
              country {
                code
              }
            }
          }
        }
        categories {
          name
        }
        lastUpdateTime {
          formatted(fmt: "MM-dd-YYYY z")
        }
        createTime {
          formatted(fmt: "MM-dd-YYYY z")
        }
        variationCount
        variations(offset: 0, limit: ${COLLAPSED_VARIATIONS_SHOWN}) {
          id
          productId
          size
          color
          enabled
          sku
          image {
            wishUrl(size: TINY)
          }
          price {
            amount
            currencyCode
            display
          }
          inventory {
            warehouseId
            count
          }
          options {
            name
            value
          }
        }
      }
    }
  }
`;

export type PickedInventory = Pick<InventorySchema, "count" | "warehouseId">;

export type PickedVariationOption = Pick<
  MerchantProvidedAttributeSchema,
  "name" | "value"
>;

export type PickedVariation = Pick<
  VariationSchema,
  "id" | "size" | "color" | "enabled" | "sku" | "productId"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "currencyCode" | "display">;
  readonly inventory: ReadonlyArray<PickedInventory>;
  readonly image?: Pick<ImageSchema, "wishUrl"> | null;
  readonly options?: ReadonlyArray<PickedVariationOption> | null;
};

export type PickedProduct = Pick<
  ProductSchema,
  | "id"
  | "name"
  | "enabled"
  | "isRemovedByWish"
  | "isRemovedByMerchant"
  | "isRemoved"
  | "isPromoted"
  | "sales"
  | "wishes"
  | "sku"
  | "isLtl"
  | "isReturnsEnabled"
  | "hasBrand"
  | "isWishExpress"
  | "variationCount"
> & {
  readonly mainImage: Pick<ImageSchema, "isCleanImage" | "wishUrl">;
  readonly extraImages?: ReadonlyArray<
    Pick<ImageSchema, "isCleanImage">
  > | null;
  readonly listingState: Pick<ListingStateSchema, "state" | "reason">;
  readonly shipping: {
    readonly warehouseCountryShipping?: ReadonlyArray<
      Pick<WarehouseCountryShippingSchema, "shippingType"> & {
        readonly countryShipping?: ReadonlyArray<{
          readonly country: Pick<Country, "code">;
        }> | null;
      }
    > | null;
  };
  readonly categories?: ReadonlyArray<Pick<TrueTagSchema, "name">> | null;
  readonly lastUpdateTime: Pick<Datetime, "formatted">;
  readonly createTime: Pick<Datetime, "formatted">;
  readonly subcategory?:
    | (Pick<TaxonomyCategorySchema, "id" | "name"> & {
        readonly categoriesAlongPath: ReadonlyArray<
          Pick<TaxonomyCategorySchema, "id" | "name">
        >;
      })
    | null;
  readonly variations: ReadonlyArray<PickedVariation>;
};

export type GetProductsResponseType = {
  readonly productCatalog?: {
    readonly productsV2?: ReadonlyArray<PickedProduct> | null;
  } | null;
};

export type GetProductsRequestType = ProductCatalogSchemaProductsV2Args &
  ProductSchemaShippingArgs;

export const GET_PRODUCT_VARIATIONS_QUERY = gql`
  query AllProducts_GetProductVariations($query: String, $limit: Int) {
    productCatalog {
      productsV2(limit: 1, searchType: ID, query: $query) {
        variations(offset: 0, limit: $limit) {
          id
          productId
          size
          color
          enabled
          sku
          image {
            wishUrl
          }
          price {
            amount
            currencyCode
            display
          }
          inventory {
            warehouseId
            count
          }
          options {
            name
            value
          }
        }
      }
    }
  }
`;

export type GetProductVariationsResponseType = {
  readonly productCatalog?: {
    readonly productsV2?: ReadonlyArray<{
      readonly variations: ReadonlyArray<PickedVariation>;
    }> | null;
  } | null;
};

export type GetProductVariationsRequestType =
  ProductCatalogSchemaProductsV2Args & ProductSchemaVariationsArgs;

// Upsert multiple products mutation
export const UPSERT_PRODUCTS_MUTATION = gql`
  mutation AllProducts_UpsertProductsMutation($input: [ProductUpsertInput!]!) {
    productCatalog {
      upsertProducts(input: $input) {
        ok
        failures {
          message
          productId
        }
      }
    }
  }
`;

export type UpsertProductsResponseType = {
  readonly productCatalog: {
    readonly upsertProducts: Pick<UpsertProducts, "ok"> & {
      readonly failures?: ReadonlyArray<
        Pick<UpsertProductsErrorItem, "message" | "productId">
      > | null;
    };
  };
};
export type UpsertProductsRequestType =
  ProductCatalogMutationsUpsertProductsArgs;

// Remove product mutation
export const REMOVE_PRODUCT_MUTATION = gql`
  mutation AllProducts_RemoveProductMutation($input: RemoveProductInput!) {
    productCatalog {
      removeProduct(input: $input) {
        ok
        message
      }
    }
  }
`;

export type RemoveProductResponseType = {
  readonly productCatalog: {
    readonly removeProduct?: Pick<RemoveProduct, "ok" | "message"> | null;
  };
};
export type RemoveProductRequestType = ProductCatalogMutationsRemoveProductArgs;

// Request download mutation
export const DOWNLOAD_PRODUCTS_MUTATION = gql`
  mutation AllProducts_DownloadProductsMutation(
    $input: DownloadAllProductsInput!
  ) {
    productCatalog {
      downloadAllProducts(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

export type DownloadProductsResponseType = {
  readonly productCatalog: {
    readonly downloadAllProducts?: Pick<
      DownloadAllProducts,
      "ok" | "errorMessage"
    > | null;
  };
};
export type DownloadProductsRequestType =
  ProductCatalogMutationsDownloadAllProductsArgs;

// Delete warehouse mutation
export const DELETE_WAREHOUSE = gql`
  mutation AllProducts_DeleteWarehouse($input: DeleteMerchantWarehouseInput!) {
    currentMerchant {
      warehouseSettings {
        deleteWarehouse(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

export type DeleteWarehouseInputType =
  MerchantWarehouseMutationsDeleteWarehouseArgs;

export type DeleteWarehouseResponseType = {
  readonly currentMerchant: {
    readonly warehouseSettings: {
      readonly deleteWarehouse: Pick<
        DeleteMerchantWarehouseMutation,
        "ok" | "message"
      >;
    };
  };
};

// Helpers
export const ListingStateTitle: {
  readonly [T in CommerceProductListingState]: string;
} = {
  ACTIVE: ci18n("A state that a product listing can be in", "Active"),
  MERCHANT_INACTIVE: ci18n(
    "A state that a product listing can be in",
    "Merchant Inactive",
  ),
  WISH_INACTIVE: ci18n(
    "A state that a product listing can be in",
    "Wish Inactive",
  ),
  REMOVED_BY_MERCHANT: ci18n(
    "A state that a product listing can be in",
    "Removed by Merchant",
  ),
  REMOVED_BY_WISH: ci18n(
    "A state that a product listing can be in",
    "Removed by Wish",
  ),
};

export type ListingStateUrlSelection = CommerceProductListingState | "ALL";
export type ListingEnabledUrlSelection = "ALL" | "TRUE" | "FALSE";

export const DefaultStateFilter: ListingStateUrlSelection = "ACTIVE";
export const DefaultEnabledFilter: ListingEnabledUrlSelection = "TRUE";

export const ListingEnabledSelectionTitle: {
  readonly [T in ListingEnabledUrlSelection]: string;
} = {
  ALL: ci18n(
    "Option in a list of options, selecting it means seeing not applying this filter",
    "All",
  ),
  TRUE: ci18n(
    "An option that when selected shows both enabled products only",
    "Enabled",
  ),
  FALSE: ci18n(
    "An option that when selected shows both disabled products only",
    "Disabled",
  ),
};

export const getProductState = (product: PickedProduct) => {
  return product.listingState;
};

export type ProductBadge =
  | "BRANDED"
  | "WISH_EXPRESS"
  | "YELLOW_BADGE"
  | "CLEAN_IMAGE"
  | "RETURN_ENROLLED";

export const BadgeTitle: { readonly [T in ProductBadge]: string } = {
  BRANDED: ci18n(
    "An attribute of a product in the merchant's catalog. Means the product has an associated brand",
    "Branded",
  ),
  WISH_EXPRESS: ci18n(
    "An attribute of a product in the merchant's catalog. Means the product has wish express shipping",
    "Wish Express",
  ),
  YELLOW_BADGE: ci18n(
    "An attribute of a product in the merchant's catalog. Means the product has the yellow badge and is a popular or promoted product",
    "Yellow Diamond Product",
  ),
  CLEAN_IMAGE: ci18n(
    "An attribute of a product in the merchant's catalog. Means the product has a clean image",
    "Clean image",
  ),
  RETURN_ENROLLED: ci18n(
    "An attribute of a product in the merchant's catalog. Means the product is enrolled for returns",
    "Return enrolled",
  ),
};

export const BadgeIcon: { readonly [T in ProductBadge]: IllustrationName } = {
  BRANDED: "branded",
  WISH_EXPRESS: "wishExpress",
  YELLOW_BADGE: "yellowBadge",
  CLEAN_IMAGE: "cleanImage",
  RETURN_ENROLLED: "returnEnrolled",
};

export const getProductBadges = (
  product: PickedProduct,
): ReadonlyArray<ProductBadge> => {
  const badges: Array<ProductBadge> = [];

  if (product.hasBrand) {
    badges.push("BRANDED");
  }

  if (product.isPromoted) {
    badges.push("YELLOW_BADGE");
  }

  if (
    product.mainImage.isCleanImage ||
    (product.extraImages || []).some(({ isCleanImage }) => isCleanImage)
  ) {
    badges.push("CLEAN_IMAGE");
  }

  if (product.isWishExpress) {
    badges.push("WISH_EXPRESS");
  }

  if (product.isReturnsEnabled) {
    badges.push("RETURN_ENROLLED");
  }

  return badges;
};

export type AllProductsRowType =
  | "PRODUCT"
  | "VARIATION"
  | "VARIATION_EXPAND_ROW";

type AllProductsTableProduct = {
  readonly id: string;
  readonly type: ExtractStrict<AllProductsRowType, "PRODUCT">;
  readonly product: PickedProduct;
};
type AllProductsTableVariation = {
  readonly id: string;
  readonly type: ExtractStrict<AllProductsRowType, "VARIATION">;
  readonly product: PickedProduct;
  readonly variation: PickedVariation;
};
type AllProductsTableVariationExpandRow = {
  readonly type: ExtractStrict<AllProductsRowType, "VARIATION_EXPAND_ROW">;
  readonly variationCount: number;
  readonly open: boolean;
  readonly id: string; // product id
};

export type AllProductsTableEntry =
  | AllProductsTableProduct
  | AllProductsTableVariation
  | AllProductsTableVariationExpandRow;

export type AllProductsTableData = ReadonlyArray<AllProductsTableEntry>;

export const productHasVariations = (
  product: PickedProduct | PickedProductForExport,
): boolean => {
  const noVariations =
    product.variations.length == 1 &&
    product.variations[0].color == null &&
    product.variations[0].size == null &&
    (product.variations[0].options == null ||
      product.variations[0].options.length === 0);

  return !noVariations;
};

export const getVariationInventory = ({
  variation: { inventory },
  warehouse,
}: {
  readonly variation: PickedVariation;
  readonly warehouse: PickedWarehouse;
}): number => {
  return inventory
    .filter(({ warehouseId }) => warehouseId == warehouse.id)
    .reduce<number>((acc, { count }) => acc + count, 0);
};

// Export CSV
type ExportCsvVariationColumn = ExtractStrict<
  ProductCsvColumnName,
  | "PARENT_SKU"
  | "GTIN"
  | "VARIATION_ID"
  | "SKU"
  | "SIZE"
  | "COLOR"
  | "REFERENCE_PRICE"
  | "PRICE"
  | "DEFAULT_SHIPPING_PRICE"
  | "INVENTORY"
  | "SHIPPING_TIME"
  | "STATUS"
  | "VARIATION_IMAGE"
  | "CURRENCY_CODE"
  | "WAREHOUSE"
  | "CONDITION"
  | "CUSTOMS_HS_CODE"
  | "PACKAGE_LENGTH"
  | "PACKAGE_HEIGHT"
  | "PACKAGE_WIDTH"
  | "PACKAGE_WEIGHT"
  | "CUSTOMS_DECLARED_VALUE"
  | "COUNTRY_OF_ORIGIN"
  | "DECLARED_LOCAL_NAME"
  | "CONTAINS_LIQUID"
  | "CONTAINS_METAL"
  | "CONTAINS_POWDER"
  | "CONTAINS_BATTERY"
  | "PIECES_INCLUDED"
  | "DECLARED_NAME"
  | "QUANTITY_VALUE"
  | "CATEGORY_EXPERIENCE_ELIGIBILITY"
  | "SUBCATEGORY_ID"
  | "VARIATION_OPTIONS"
>;

export const GET_PRODUCTS_FOR_EXPORT_QUERY = gql`
  query AllProducts_GetProductsForExport(
    $query: String
    $searchType: ProductSearchType
    $merchantId: ObjectIdType
    $offset: Int
    $limit: Int
    $sort: ProductSort
    $isEnabled: Boolean
    $state: ProductListingState
    $fpReviewStatus: ProductFPReviewStatus
    $isWishExpress: Boolean
    $hasBrand: Boolean
    $isPromoted: Boolean
    $isCleanImage: Boolean
    $isReturnEnrolled: Boolean
    $warehouseId: String
  ) {
    currentMerchant {
      primaryCurrency
    }
    productCatalog {
      csvProductColumnEnums
      productsV2(
        query: $query
        searchType: $searchType
        merchantId: $merchantId
        offset: $offset
        limit: $limit
        sort: $sort
        isEnabled: $isEnabled
        state: $state
        fpReviewStatus: $fpReviewStatus
        isWishExpress: $isWishExpress
        hasBrand: $hasBrand
        isPromoted: $isPromoted
        isCleanImage: $isCleanImage
        isReturnEnrolled: $isReturnEnrolled
      ) {
        id
        name
        description
        wishes
        sales
        sku
        upc
        lastUpdateTime {
          formatted(fmt: "YYYY-MM-dd k:mm:ss z")
        }
        createTime {
          formatted(fmt: "YYYY-MM-dd k:mm:ss z")
        }
        msrp {
          display
        }
        shipping(warehouseId: $warehouseId) {
          defaultShipping {
            warehouseId
            price {
              display
            }
            timeToDoor
          }
          warehouseCountryShipping {
            shippingType
            countryShipping {
              country {
                code
              }
              timeToDoor
              enabled
              price {
                display
              }
            }
          }
        }
        fpReviewStatus
        listingState {
          state
        }
        isPromoted
        isLtl
        mainImage {
          wishUrl(size: TINY)
          isCleanImage
        }
        extraImages {
          wishUrl(size: TINY)
          isCleanImage
        }
        trueTags {
          name
          id
        }
        condition
        maxQuantity
        referenceArea {
          unit
          value
        }
        referenceUnit {
          unit
          value
        }
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
        chemicalNames
        warningType
        requestedBrand {
          id
          name
        }
        categoryExperienceEligibility
        subcategoryId
        subcategory {
          id
          name
        }
        variationOptions
        variations {
          id
          sku
          size
          color
          gtin
          inventory {
            warehouseId
            count
          }
          price {
            display
          }
          image {
            wishUrl(size: TINY)
          }
          customsHsCode
          length {
            unit
            value
          }
          width {
            unit
            value
          }
          height {
            unit
            value
          }
          weight {
            unit
            value
          }
          declaredValue {
            display
          }
          originCountry {
            name
          }
          declaredLocalName
          declaredName
          hasLiquid
          hasMetal
          hasPowder
          hasBattery
          pieces
          quantityArea {
            unit
            value
          }
          quantityUnit {
            unit
            value
          }
          quantityWeight {
            unit
            value
          }
          quantityLength {
            unit
            value
          }
          quantityVolume {
            unit
            value
          }
          options {
            name
            value
          }
        }
      }
    }
  }
`;

// Must be equal so the CSV can match the exact products in the table
export type GetProductsForExportRequestType = GetProductsRequestType;

export type PickedVariationForExport = Pick<
  VariationSchema,
  | "id"
  | "sku"
  | "size"
  | "color"
  | "gtin"
  | "customsHsCode"
  | "declaredLocalName"
  | "declaredName"
  | "hasLiquid"
  | "hasMetal"
  | "hasPowder"
  | "hasBattery"
  | "pieces"
> & {
  readonly inventory: ReadonlyArray<
    Pick<InventorySchema, "count" | "warehouseId">
  >;
  readonly price: Pick<CurrencyValue, "display">;
  readonly image?: Pick<ImageSchema, "wishUrl"> | null;
  readonly weight?: Pick<Weight, "unit" | "value"> | null;
  readonly height?: Pick<Length, "unit" | "value"> | null;
  readonly length?: Pick<Length, "unit" | "value"> | null;
  readonly width?: Pick<Length, "unit" | "value"> | null;
  readonly declaredValue?: Pick<CurrencyValue, "display"> | null;
  readonly originCountry?: Pick<Country, "name">;
  readonly quantityWeight?: Pick<Weight, "unit" | "value"> | null;
  readonly quantityLength?: Pick<Length, "unit" | "value"> | null;
  readonly quantityVolume?: Pick<Volume, "unit" | "value"> | null;
  readonly quantityArea?: Pick<Area, "unit" | "value"> | null;
  readonly quantityUnit?: Pick<Count, "unit" | "value"> | null;
  readonly options?: ReadonlyArray<PickedVariationOption> | null;
};

export type PickedProductForExport = Pick<
  ProductSchema,
  | "id"
  | "name"
  | "description"
  | "wishes"
  | "sales"
  | "sku"
  | "upc"
  | "fpReviewStatus"
  | "condition"
  | "maxQuantity"
  | "chemicalNames"
  | "warningType"
  | "isPromoted"
  | "isLtl"
  | "categoryExperienceEligibility"
  | "subcategoryId"
  | "variationOptions"
> & {
  readonly lastUpdateTime: Pick<Datetime, "formatted">;
  readonly createTime: Pick<Datetime, "formatted">;
  readonly msrp?: Pick<CurrencyValue, "display"> | null;
  readonly shipping: {
    readonly defaultShipping?: ReadonlyArray<
      Pick<DefaultShippingSchema, "timeToDoor" | "warehouseId"> & {
        readonly price: Pick<CurrencyValue, "display">;
      }
    > | null;
    readonly warehouseCountryShipping?: ReadonlyArray<
      Pick<WarehouseCountryShippingSchema, "shippingType"> & {
        readonly countryShipping?: ReadonlyArray<
          Pick<CountryShippingSchema, "enabled" | "timeToDoor"> & {
            readonly country: Pick<Country, "code">;
            readonly price?: Pick<CurrencyValue, "display"> | null;
          }
        > | null;
      }
    > | null;
  };
  readonly listingState: Pick<ListingStateSchema, "state">;
  readonly mainImage: Pick<ImageSchema, "wishUrl" | "isCleanImage">;
  readonly extraImages?: ReadonlyArray<
    Pick<ImageSchema, "wishUrl" | "isCleanImage">
  > | null;
  readonly trueTags?: ReadonlyArray<Pick<TrueTagSchema, "id" | "name">> | null;
  readonly referenceWeight?: Pick<Weight, "unit" | "value"> | null;
  readonly referenceLength?: Pick<Length, "unit" | "value"> | null;
  readonly referenceVolume?: Pick<Volume, "unit" | "value"> | null;
  readonly referenceArea?: Pick<Area, "unit" | "value"> | null;
  readonly referenceUnit?: Pick<Count, "unit" | "value"> | null;
  readonly requestedBrand?: Pick<BrandSchema, "id" | "name"> | null;
  readonly subcategory?: Pick<TaxonomyCategorySchema, "id" | "name"> | null;
  readonly variations: ReadonlyArray<PickedVariationForExport>;
};

export type GetProductsForExportResponseType = {
  readonly currentMerchant?: Pick<MerchantSchema, "primaryCurrency"> | null;
  readonly productCatalog?:
    | (Pick<ProductCatalogSchema, "csvProductColumnEnums"> & {
        readonly productsV2: ReadonlyArray<PickedProductForExport>;
      })
    | null;
};

const escapeForCsv = (s: string): string => {
  return `"${s.replace(/"/g, `""`)}"`;
};

export const generateCsvExport = (
  data: GetProductsForExportResponseType,
  warehouse: PickedWarehouse,
): string => {
  const headers = data.productCatalog?.csvProductColumnEnums || [];

  const headerRow = headers
    .map((header) => ExportCsvColumnDisplayNames[header])
    .join(",");
  const products = data.productCatalog?.productsV2;

  if (products == null) {
    return headerRow;
  }

  const getShipping = (
    product: PickedProductForExport,
    countryCode: CountryCode,
  ) => {
    const countryShipping = product.shipping.warehouseCountryShipping
      ?.find(({ shippingType }) => shippingType == "REGULAR")
      ?.countryShipping?.find(
        ({ country: { code }, enabled }) => enabled && code == countryCode,
      );
    return countryShipping == null || countryShipping.price == null
      ? "D"
      : countryShipping.price.display ?? "D";
  };

  const getTtd = (
    product: PickedProductForExport,
    countryCode: CountryCode,
  ) => {
    const countryShipping = product.shipping.warehouseCountryShipping
      ?.find(({ shippingType }) => shippingType == "REGULAR")
      ?.countryShipping?.find(({ country: { code } }) => code == countryCode);
    return countryShipping == null || countryShipping.timeToDoor == null
      ? "D"
      : `${countryShipping.timeToDoor}`;
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  const productColumnGetter: {
    readonly [T in ProductCsvColumnName]: (
      product: PickedProductForExport,
    ) => string | null | undefined;
  } = {
    PRODUCT_ID: (product) => product.id,
    CATEGORY_EXPERIENCE_ELIGIBILITY: (product) =>
      product.categoryExperienceEligibility ? `TRUE` : `FALSE`,
    SUBCATEGORY_ID: (product) =>
      product.subcategoryId == null ? undefined : `${product.subcategoryId}`,
    VARIATION_OPTIONS: (product) =>
      product.variationOptions == null || product.variationOptions.length == 0
        ? undefined
        : `${product.variationOptions.join(",")}`,
    NAME: (product) => product.name,
    DESCRIPTION: (product) => product.description,
    NUM_OF_WISHES: (product) => `${product.wishes}`,
    NUM_OF_SALES: (product) => `${product.sales}`,
    PARENT_SKU: (product) => product.sku,
    GTIN: (product) =>
      product.variations.length == 0 ? undefined : product.variations[0].gtin,
    LANDING_PAGE_URL: () => null,
    VARIATION_ID: (product) =>
      product.variations.length == 0 ? undefined : product.variations[0].id,
    SKU: (product) =>
      product.variations.length == 0 ? undefined : product.variations[0].sku,
    SIZE: (product) =>
      product.variations.length == 0 ? undefined : product.variations[0].size,
    COLOR: (product) =>
      product.variations.length == 0 ? undefined : product.variations[0].color,
    REFERENCE_PRICE: (product) => product.msrp?.display,
    PRICE: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].price.display,
    DEFAULT_SHIPPING_PRICE: (product) =>
      product.shipping.defaultShipping?.find(
        ({ warehouseId }) => warehouseId == warehouse.id,
      )?.price.display,
    INVENTORY: (product) => {
      const count =
        product.variations.length == 0
          ? undefined
          : product.variations[0].inventory?.find(
              ({ warehouseId }) => warehouseId == warehouse.id,
            )?.count;
      return count == null ? undefined : `${count}`;
    },
    SHIPPING_TIME: () => null,
    STATUS: (product) => product.listingState.state,
    IS_PROMOTED: (product) => (product.isPromoted ? `TRUE` : `FALSE`),
    REVIEW_STATE: (product) => product.fpReviewStatus,
    MAIN_IMAGE: (product) => product.mainImage.wishUrl,
    EXTRA_IMAGES: (product) =>
      product.extraImages == null || product.extraImages.length == 0
        ? undefined
        : product.extraImages.map(({ wishUrl }) => wishUrl).join("|"),
    VARIATION_IMAGE: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].image?.wishUrl,
    TAGS: (product) =>
      product.trueTags == null || product.trueTags.length == 0
        ? undefined
        : product.trueTags
            .map(({ id, name }) => `id:${id},name:${name}`)
            .join("|"),

    LAST_UPDATED: (product) => product.lastUpdateTime.formatted,
    DATE_UPLOADED: (product) => product.createTime.formatted,
    WARNING_ID: () => null,
    WISH_EXPRESS_COUNTRIES: (product) =>
      product.shipping.warehouseCountryShipping
        ?.find(({ shippingType }) => shippingType == "WISH_EXPRESS")
        ?.countryShipping?.filter(({ enabled }) => enabled)
        .map(({ country: { code } }) => code)
        .join("|"),
    WISH_EXPRESS_ENABLED_COUNTRIES: (product) =>
      product.shipping.warehouseCountryShipping
        ?.find(({ shippingType }) => shippingType == "WISH_EXPRESS")
        ?.countryShipping?.filter(({ enabled }) => enabled)
        .map(({ country: { code } }) => code)
        .join("|"),
    WISH_EXPRESS_DISABLED_COUNTRIES: (product) =>
      product.shipping.warehouseCountryShipping
        ?.find(({ shippingType }) => shippingType == "WISH_EXPRESS")
        ?.countryShipping?.filter(({ enabled }) => !enabled)
        .map(({ country: { code } }) => code)
        .join("|"),
    CURRENCY_CODE: () => data.currentMerchant?.primaryCurrency,
    WAREHOUSE: () => warehouse.unitId,
    BRAND_ID: (product) => product.requestedBrand?.id,
    BRAND: (product) => product.requestedBrand?.name,
    BRAND_STATUS: () => null,
    CONDITION: (product) => product.condition,
    CUSTOMS_HS_CODE: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].customsHsCode,
    PACKAGE_LENGTH: (product) => {
      const length =
        product.variations.length == 0
          ? undefined
          : product.variations[0].length;
      return length == null
        ? undefined
        : `${length.value} ${unitDisplayName(length.unit).symbol}`;
    },
    PACKAGE_HEIGHT: (product) => {
      const height =
        product.variations.length == 0
          ? undefined
          : product.variations[0].height;
      return height == null
        ? undefined
        : `${height.value} ${unitDisplayName(height.unit).symbol}`;
    },
    PACKAGE_WIDTH: (product) => {
      const width =
        product.variations.length == 0
          ? undefined
          : product.variations[0].width;
      return width == null
        ? undefined
        : `${width.value} ${unitDisplayName(width.unit).symbol}`;
    },
    PACKAGE_WEIGHT: (product) => {
      const weight =
        product.variations.length == 0
          ? undefined
          : product.variations[0].weight;
      return weight == null
        ? undefined
        : `${weight.value} ${unitDisplayName(weight.unit).symbol}`;
    },
    CUSTOMS_DECLARED_VALUE: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].declaredValue?.display,
    COUNTRY_OF_ORIGIN: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].originCountry?.name,
    DECLARED_LOCAL_NAME: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].declaredLocalName,
    CONTAINS_LIQUID: (product) => {
      const contains =
        product.variations.length == 0
          ? undefined
          : product.variations[0].hasLiquid;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    CONTAINS_METAL: (product) => {
      const contains =
        product.variations.length == 0
          ? undefined
          : product.variations[0].hasMetal;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    CONTAINS_POWDER: (product) => {
      const contains =
        product.variations.length == 0
          ? undefined
          : product.variations[0].hasPowder;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    CONTAINS_BATTERY: (product) => {
      const contains =
        product.variations.length == 0
          ? undefined
          : product.variations[0].hasBattery;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    PIECES_INCLUDED: (product) => {
      const pieces =
        product.variations.length == 0
          ? undefined
          : product.variations[0].pieces;
      return pieces == null ? undefined : `${pieces}`;
    },
    CLEAN_IMAGE: (product) =>
      [product.mainImage, ...(product.extraImages ?? [])].find(
        ({ isCleanImage }) => isCleanImage,
      )?.wishUrl,
    DECLARED_NAME: (product) =>
      product.variations.length == 0
        ? undefined
        : product.variations[0].declaredName,
    MAX_QUANTITY: (product) =>
      product.maxQuantity == null ? undefined : `${product.maxQuantity}`,
    REFERENCE_VALUE: (product) => {
      const {
        referenceArea,
        referenceLength,
        referenceUnit: referenceCount,
        referenceVolume,
        referenceWeight,
      } = product;
      let referenceValue: number | undefined;
      if (referenceArea != null) {
        referenceValue = referenceArea.value;
      } else if (referenceLength != null) {
        referenceValue = referenceLength.value;
      } else if (referenceCount != null) {
        referenceValue = referenceCount.value;
      } else if (referenceVolume != null) {
        referenceValue = referenceVolume.value;
      } else if (referenceWeight != null) {
        referenceValue = referenceWeight.value;
      }

      return referenceValue == null ? undefined : `${referenceValue}`;
    },
    UNIT: (product) => {
      const {
        referenceArea,
        referenceLength,
        referenceUnit: referenceCount,
        referenceVolume,
        referenceWeight,
      } = product;
      let referenceUnit: Unit | undefined;
      if (referenceArea != null) {
        referenceUnit = referenceArea.unit;
      } else if (referenceLength != null) {
        referenceUnit = referenceLength.unit;
      } else if (referenceCount != null) {
        referenceUnit = referenceCount.unit;
      } else if (referenceVolume != null) {
        referenceUnit = referenceVolume.unit;
      } else if (referenceWeight != null) {
        referenceUnit = referenceWeight.unit;
      }

      return referenceUnit == null
        ? undefined
        : unitDisplayName(referenceUnit).symbol;
    },
    QUANTITY_VALUE: (product) => {
      if (product.variations.length == 0) {
        return undefined;
      }
      const {
        quantityArea,
        quantityLength,
        quantityUnit: quantityCount,
        quantityVolume,
        quantityWeight,
      } = product.variations[0];
      let referenceValue: number | undefined;
      let referenceUnit: Unit | undefined;
      if (quantityArea != null) {
        referenceValue = quantityArea.value;
        referenceUnit = quantityArea.unit;
      } else if (quantityLength != null) {
        referenceValue = quantityLength.value;
        referenceUnit = quantityLength.unit;
      } else if (quantityCount != null) {
        referenceValue = quantityCount.value;
        referenceUnit = quantityCount.unit;
      } else if (quantityVolume != null) {
        referenceValue = quantityVolume.value;
        referenceUnit = quantityVolume.unit;
      } else if (quantityWeight != null) {
        referenceValue = quantityWeight.value;
        referenceUnit = quantityWeight.unit;
      }

      return referenceValue == null || referenceUnit == null
        ? undefined
        : `${referenceValue} ${unitDisplayName(referenceUnit).symbol}`;
    },
    AD: (product) => getShipping(product, "AD"),
    AL: (product) => getShipping(product, "AL"),
    AR: (product) => getShipping(product, "AR"),
    AT: (product) => getShipping(product, "AT"),
    AU: (product) => getShipping(product, "AU"),
    BA: (product) => getShipping(product, "BA"),
    BE: (product) => getShipping(product, "BE"),
    BG: (product) => getShipping(product, "BG"),
    BR: (product) => getShipping(product, "BR"),
    CA: (product) => getShipping(product, "CA"),
    CH: (product) => getShipping(product, "CH"),
    CL: (product) => getShipping(product, "CL"),
    CO: (product) => getShipping(product, "CO"),
    CR: (product) => getShipping(product, "CR"),
    CZ: (product) => getShipping(product, "CZ"),
    DE: (product) => getShipping(product, "DE"),
    DK: (product) => getShipping(product, "DK"),
    EE: (product) => getShipping(product, "EE"),
    ES: (product) => getShipping(product, "ES"),
    FI: (product) => getShipping(product, "FI"),
    FR: (product) => getShipping(product, "FR"),
    GB: (product) => getShipping(product, "GB"),
    GI: (product) => getShipping(product, "GI"),
    GR: (product) => getShipping(product, "GR"),
    HR: (product) => getShipping(product, "HR"),
    HU: (product) => getShipping(product, "HU"),
    IE: (product) => getShipping(product, "IE"),
    IL: (product) => getShipping(product, "IL"),
    IS: (product) => getShipping(product, "IS"),
    IT: (product) => getShipping(product, "IT"),
    JE: (product) => getShipping(product, "JE"),
    JP: (product) => getShipping(product, "JP"),
    KR: (product) => getShipping(product, "KR"),
    LI: (product) => getShipping(product, "LI"),
    LT: (product) => getShipping(product, "LT"),
    LU: (product) => getShipping(product, "LU"),
    LV: (product) => getShipping(product, "LV"),
    MC: (product) => getShipping(product, "MC"),
    MD: (product) => getShipping(product, "MD"),
    ME: (product) => getShipping(product, "ME"),
    MK: (product) => getShipping(product, "MK"),
    MT: (product) => getShipping(product, "MT"),
    MX: (product) => getShipping(product, "MX"),
    NL: (product) => getShipping(product, "NL"),
    NO: (product) => getShipping(product, "NO"),
    NZ: (product) => getShipping(product, "NZ"),
    PE: (product) => getShipping(product, "PE"),
    PL: (product) => getShipping(product, "PL"),
    PR: (product) => getShipping(product, "PR"),
    PT: (product) => getShipping(product, "PT"),
    RO: (product) => getShipping(product, "RO"),
    RS: (product) => getShipping(product, "RS"),
    SE: (product) => getShipping(product, "SE"),
    SG: (product) => getShipping(product, "SG"),
    SI: (product) => getShipping(product, "SI"),
    SK: (product) => getShipping(product, "SK"),
    SM: (product) => getShipping(product, "SM"),
    UA: (product) => getShipping(product, "UA"),
    US: (product) => getShipping(product, "US"),
    VI: (product) => getShipping(product, "VI"),
    ZA: (product) => getShipping(product, "ZA"),
    AD_TTD: (product) => getTtd(product, "AD"),
    AL_TTD: (product) => getTtd(product, "AL"),
    AR_TTD: (product) => getTtd(product, "AR"),
    AT_TTD: (product) => getTtd(product, "AT"),
    AU_TTD: (product) => getTtd(product, "AU"),
    BA_TTD: (product) => getTtd(product, "BA"),
    BE_TTD: (product) => getTtd(product, "BE"),
    BG_TTD: (product) => getTtd(product, "BG"),
    BR_TTD: (product) => getTtd(product, "BR"),
    CA_TTD: (product) => getTtd(product, "CA"),
    CH_TTD: (product) => getTtd(product, "CH"),
    CL_TTD: (product) => getTtd(product, "CL"),
    CO_TTD: (product) => getTtd(product, "CO"),
    CR_TTD: (product) => getTtd(product, "CR"),
    CZ_TTD: (product) => getTtd(product, "CZ"),
    DE_TTD: (product) => getTtd(product, "DE"),
    DK_TTD: (product) => getTtd(product, "DK"),
    EE_TTD: (product) => getTtd(product, "EE"),
    ES_TTD: (product) => getTtd(product, "ES"),
    FI_TTD: (product) => getTtd(product, "FI"),
    FR_TTD: (product) => getTtd(product, "FR"),
    GB_TTD: (product) => getTtd(product, "GB"),
    GI_TTD: (product) => getTtd(product, "GI"),
    GR_TTD: (product) => getTtd(product, "GR"),
    HR_TTD: (product) => getTtd(product, "HR"),
    HU_TTD: (product) => getTtd(product, "HU"),
    IE_TTD: (product) => getTtd(product, "IE"),
    IL_TTD: (product) => getTtd(product, "IL"),
    IS_TTD: (product) => getTtd(product, "IS"),
    IT_TTD: (product) => getTtd(product, "IT"),
    JE_TTD: (product) => getTtd(product, "JE"),
    JP_TTD: (product) => getTtd(product, "JP"),
    KR_TTD: (product) => getTtd(product, "KR"),
    LI_TTD: (product) => getTtd(product, "LI"),
    LT_TTD: (product) => getTtd(product, "LT"),
    LU_TTD: (product) => getTtd(product, "LU"),
    LV_TTD: (product) => getTtd(product, "LV"),
    MC_TTD: (product) => getTtd(product, "MC"),
    MD_TTD: (product) => getTtd(product, "MD"),
    ME_TTD: (product) => getTtd(product, "ME"),
    MK_TTD: (product) => getTtd(product, "MK"),
    MT_TTD: (product) => getTtd(product, "MT"),
    MX_TTD: (product) => getTtd(product, "MX"),
    NL_TTD: (product) => getTtd(product, "NL"),
    NO_TTD: (product) => getTtd(product, "NO"),
    NZ_TTD: (product) => getTtd(product, "NZ"),
    PE_TTD: (product) => getTtd(product, "PE"),
    PL_TTD: (product) => getTtd(product, "PL"),
    PR_TTD: (product) => getTtd(product, "PR"),
    PT_TTD: (product) => getTtd(product, "PT"),
    RO_TTD: (product) => getTtd(product, "RO"),
    RS_TTD: (product) => getTtd(product, "RS"),
    SE_TTD: (product) => getTtd(product, "SE"),
    SG_TTD: (product) => getTtd(product, "SG"),
    SI_TTD: (product) => getTtd(product, "SI"),
    SK_TTD: (product) => getTtd(product, "SK"),
    SM_TTD: (product) => getTtd(product, "SM"),
    UA_TTD: (product) => getTtd(product, "UA"),
    US_TTD: (product) => getTtd(product, "US"),
    VI_TTD: (product) => getTtd(product, "VI"),
    ZA_TTD: (product) => getTtd(product, "ZA"),
    CALIFORNIA_PROPOSITION_65_CHEMICAL_NAMES: (product) =>
      product.chemicalNames == null
        ? undefined
        : product.chemicalNames.join(" | "),
    CALIFORNIA_PROPOSITION_65_WARNING_TYPE: (product) =>
      product.warningType == null
        ? undefined
        : ContestWarningDisplayNames[product.warningType],
    IS_LTL: (product) => {
      if (product.isLtl) {
        return null;
      }
      return product.isLtl ? `TRUE` : `FALSE`;
    },

    // Deprecated Unity fields
    COST: () => undefined,
    FIRST_MILE_SHIPPING_PRICE_D_DISABLED: () => undefined,
    EFFECTIVE_DATE: () => undefined,
    CALCULATED_SHIPPING: () => undefined,
  };
  const variationColumnGetter: {
    readonly [T in
      | ExportCsvVariationColumn
      | ExcludeStrict<
          ProductCsvColumnName,
          ExportCsvVariationColumn
        >]: T extends ExportCsvVariationColumn
      ? (
          product: PickedProductForExport,
          variationIndex: number,
        ) => string | null | undefined
      : undefined;
  } = {
    PARENT_SKU: (product) => product.sku,
    GTIN: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].gtin,
    VARIATION_ID: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].id,
    CATEGORY_EXPERIENCE_ELIGIBILITY: (
      product: PickedProductForExport,
      variationIndex: number,
    ) => {
      const eligible =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.categoryExperienceEligibility;
      return eligible ? `TRUE` : `FALSE`;
    },
    SUBCATEGORY_ID: (
      product: PickedProductForExport,
      variationIndex: number,
    ) => {
      const subcategory_id =
        product.subcategoryId == null ? undefined : `${product.subcategoryId}`;
      return product.variations.length < variationIndex + 1
        ? undefined
        : subcategory_id;
    },
    VARIATION_OPTIONS: (
      product: PickedProductForExport,
      variationIndex: number,
    ) => {
      const variation_options =
        product.variationOptions == null || product.variationOptions.length == 0
          ? undefined
          : `${product.variationOptions.join(",")}`;
      return product.variations.length < variationIndex + 1
        ? undefined
        : variation_options;
    },
    SKU: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].sku,
    SIZE: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].size,
    COLOR: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].color,
    REFERENCE_PRICE: (product) => product.msrp?.display,
    PRICE: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].price.display,
    DEFAULT_SHIPPING_PRICE: (product) =>
      product.shipping.defaultShipping?.find(
        ({ warehouseId }) => warehouseId == warehouse.id,
      )?.price.display,
    INVENTORY: (product, variationIndex) => {
      const count =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].inventory?.find(
              ({ warehouseId }) => warehouseId == warehouse.id,
            )?.count;
      return count == null ? undefined : `${count}`;
    },
    SHIPPING_TIME: () => null,
    STATUS: (product) => product.listingState.state,
    VARIATION_IMAGE: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].image?.wishUrl,
    CURRENCY_CODE: () => data.currentMerchant?.primaryCurrency,
    WAREHOUSE: () => warehouse.unitId,
    CONDITION: (product) => product.condition,
    CUSTOMS_HS_CODE: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].customsHsCode,
    PACKAGE_LENGTH: (product, variationIndex) => {
      const length =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].length;
      return length == null
        ? undefined
        : `${length.value} ${unitDisplayName(length.unit).symbol}`;
    },
    PACKAGE_HEIGHT: (product, variationIndex) => {
      const height =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].height;
      return height == null
        ? undefined
        : `${height.value} ${unitDisplayName(height.unit).symbol}`;
    },
    PACKAGE_WIDTH: (product, variationIndex) => {
      const width =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].width;
      return width == null
        ? undefined
        : `${width.value} ${unitDisplayName(width.unit).symbol}`;
    },
    PACKAGE_WEIGHT: (product, variationIndex) => {
      const weight =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].weight;
      return weight == null
        ? undefined
        : `${weight.value} ${unitDisplayName(weight.unit).symbol}`;
    },
    CUSTOMS_DECLARED_VALUE: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].declaredValue?.display,
    COUNTRY_OF_ORIGIN: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].originCountry?.name,
    DECLARED_LOCAL_NAME: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].declaredLocalName,
    CONTAINS_LIQUID: (product, variationIndex) => {
      const contains =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].hasLiquid;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    CONTAINS_METAL: (product, variationIndex) => {
      const contains =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].hasMetal;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    CONTAINS_POWDER: (product, variationIndex) => {
      const contains =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].hasPowder;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    CONTAINS_BATTERY: (product, variationIndex) => {
      const contains =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].hasBattery;
      if (contains == null) {
        return undefined;
      }
      return contains ? `TRUE` : `FALSE`;
    },
    PIECES_INCLUDED: (product, variationIndex) => {
      const pieces =
        product.variations.length < variationIndex + 1
          ? undefined
          : product.variations[variationIndex].pieces;
      return pieces == null ? undefined : `${pieces}`;
    },
    DECLARED_NAME: (product, variationIndex) =>
      product.variations.length < variationIndex + 1
        ? undefined
        : product.variations[variationIndex].declaredName,
    QUANTITY_VALUE: (product, variationIndex) => {
      if (product.variations.length < variationIndex + 1) {
        return undefined;
      }
      const {
        quantityArea,
        quantityLength,
        quantityUnit: quantityCount,
        quantityVolume,
        quantityWeight,
      } = product.variations[variationIndex];
      let referenceValue: number | undefined;
      let referenceUnit: Unit | undefined;
      if (quantityArea != null) {
        referenceValue = quantityArea.value;
        referenceUnit = quantityArea.unit;
      } else if (quantityLength != null) {
        referenceValue = quantityLength.value;
        referenceUnit = quantityLength.unit;
      } else if (quantityCount != null) {
        referenceValue = quantityCount.value;
        referenceUnit = quantityCount.unit;
      } else if (quantityVolume != null) {
        referenceValue = quantityVolume.value;
        referenceUnit = quantityVolume.unit;
      } else if (quantityWeight != null) {
        referenceValue = quantityWeight.value;
        referenceUnit = quantityWeight.unit;
      }

      return referenceValue == null || referenceUnit == null
        ? undefined
        : `${referenceValue} ${unitDisplayName(referenceUnit).symbol}`;
    },
    PRODUCT_ID: undefined,
    NAME: undefined,
    DESCRIPTION: undefined,
    NUM_OF_WISHES: undefined,
    NUM_OF_SALES: undefined,
    LANDING_PAGE_URL: undefined,
    IS_PROMOTED: undefined,
    REVIEW_STATE: undefined,
    MAIN_IMAGE: undefined,
    EXTRA_IMAGES: undefined,
    TAGS: undefined,
    LAST_UPDATED: undefined,
    DATE_UPLOADED: undefined,
    WARNING_ID: undefined,
    WISH_EXPRESS_COUNTRIES: undefined,
    BRAND_ID: undefined,
    BRAND: undefined,
    BRAND_STATUS: undefined,
    CLEAN_IMAGE: undefined,
    MAX_QUANTITY: undefined,
    REFERENCE_VALUE: undefined,
    UNIT: undefined,
    AD: undefined,
    AL: undefined,
    AR: undefined,
    AT: undefined,
    AU: undefined,
    BA: undefined,
    BE: undefined,
    BG: undefined,
    BR: undefined,
    CA: undefined,
    CH: undefined,
    CL: undefined,
    CO: undefined,
    CR: undefined,
    CZ: undefined,
    DE: undefined,
    DK: undefined,
    EE: undefined,
    ES: undefined,
    FI: undefined,
    FR: undefined,
    GB: undefined,
    GI: undefined,
    GR: undefined,
    HR: undefined,
    HU: undefined,
    IE: undefined,
    IL: undefined,
    IS: undefined,
    IT: undefined,
    JE: undefined,
    JP: undefined,
    KR: undefined,
    LI: undefined,
    LT: undefined,
    LU: undefined,
    LV: undefined,
    MC: undefined,
    MD: undefined,
    ME: undefined,
    MK: undefined,
    MT: undefined,
    MX: undefined,
    NL: undefined,
    NO: undefined,
    NZ: undefined,
    PE: undefined,
    PL: undefined,
    PR: undefined,
    PT: undefined,
    RO: undefined,
    RS: undefined,
    SE: undefined,
    SG: undefined,
    SI: undefined,
    SK: undefined,
    SM: undefined,
    UA: undefined,
    US: undefined,
    VI: undefined,
    ZA: undefined,
    AD_TTD: undefined,
    AL_TTD: undefined,
    AR_TTD: undefined,
    AT_TTD: undefined,
    AU_TTD: undefined,
    BA_TTD: undefined,
    BE_TTD: undefined,
    BG_TTD: undefined,
    BR_TTD: undefined,
    CA_TTD: undefined,
    CH_TTD: undefined,
    CL_TTD: undefined,
    CO_TTD: undefined,
    CR_TTD: undefined,
    CZ_TTD: undefined,
    DE_TTD: undefined,
    DK_TTD: undefined,
    EE_TTD: undefined,
    ES_TTD: undefined,
    FI_TTD: undefined,
    FR_TTD: undefined,
    GB_TTD: undefined,
    GI_TTD: undefined,
    GR_TTD: undefined,
    HR_TTD: undefined,
    HU_TTD: undefined,
    IE_TTD: undefined,
    IL_TTD: undefined,
    IS_TTD: undefined,
    IT_TTD: undefined,
    JE_TTD: undefined,
    JP_TTD: undefined,
    KR_TTD: undefined,
    LI_TTD: undefined,
    LT_TTD: undefined,
    LU_TTD: undefined,
    LV_TTD: undefined,
    MC_TTD: undefined,
    MD_TTD: undefined,
    ME_TTD: undefined,
    MK_TTD: undefined,
    MT_TTD: undefined,
    MX_TTD: undefined,
    NL_TTD: undefined,
    NO_TTD: undefined,
    NZ_TTD: undefined,
    PE_TTD: undefined,
    PL_TTD: undefined,
    PR_TTD: undefined,
    PT_TTD: undefined,
    RO_TTD: undefined,
    RS_TTD: undefined,
    SE_TTD: undefined,
    SG_TTD: undefined,
    SI_TTD: undefined,
    SK_TTD: undefined,
    SM_TTD: undefined,
    UA_TTD: undefined,
    US_TTD: undefined,
    VI_TTD: undefined,
    ZA_TTD: undefined,
    COST: undefined,
    CALIFORNIA_PROPOSITION_65_CHEMICAL_NAMES: undefined,
    CALIFORNIA_PROPOSITION_65_WARNING_TYPE: undefined,
    WISH_EXPRESS_ENABLED_COUNTRIES: undefined,
    WISH_EXPRESS_DISABLED_COUNTRIES: undefined,
    IS_LTL: undefined,
    FIRST_MILE_SHIPPING_PRICE_D_DISABLED: undefined,
    EFFECTIVE_DATE: undefined,
    CALCULATED_SHIPPING: undefined,
  };
  /* eslint-enable @typescript-eslint/naming-convention */

  const rows = products
    .map((product) => {
      const productRow = headers
        .map((header) => {
          const getter = productColumnGetter[header];
          return escapeForCsv(getter == null ? "" : getter(product) ?? "");
        })
        .join(",");
      if (!productHasVariations(product) || product.variations.length <= 1) {
        return productRow;
      }

      const variationRows = product.variations
        .slice(1)
        .map((_, index) => {
          return headers
            .map((header) => {
              const getter = variationColumnGetter[header];
              if (getter == null) {
                return "";
              }
              return escapeForCsv(getter(product, index + 1) ?? "");
            })
            .join(",");
        })
        .join("\n");

      return `${productRow}\n${variationRows}`;
    })
    .join("\n");

  return `${headerRow}\n${rows}`;
};

export const ExportCsvColumnDisplayNames: {
  readonly [T in ProductCsvColumnName]: string;
} = {
  PRODUCT_ID: ci18n(
    "Column title in a spreadsheet containing products",
    "Product ID",
  ),
  CATEGORY_EXPERIENCE_ELIGIBILITY: ci18n(
    "Column title in a spreadsheet containing products",
    "Category Experience Eligibility",
  ),
  SUBCATEGORY_ID: ci18n(
    "Column title in a spreadsheet containing products",
    "Subcategory ID",
  ),
  VARIATION_OPTIONS: ci18n(
    "Option names used to group variations within the product",
    "Variation Options",
  ),
  NAME: ci18n("Column title in a spreadsheet containing products", "Name"),
  DESCRIPTION: ci18n(
    "Column title in a spreadsheet containing products",
    "Description",
  ),
  NUM_OF_WISHES: ci18n(
    "Column title in a spreadsheet containing products",
    "# of Wishes",
  ),
  NUM_OF_SALES: ci18n(
    "Column title in a spreadsheet containing products",
    "# of Sales",
  ),
  PARENT_SKU: ci18n(
    "Column title in a spreadsheet containing products",
    "Parent SKU",
  ),
  GTIN: ci18n("Column title in a spreadsheet containing products", "GTIN"),
  LANDING_PAGE_URL: ci18n(
    "Column title in a spreadsheet containing products",
    "Landing Page URL",
  ),
  VARIATION_ID: ci18n(
    "Column title in a spreadsheet containing products",
    "Variation ID",
  ),
  COST: ci18n("Column title in a spreadsheet containing products", "Cost"),
  SKU: ci18n("Column title in a spreadsheet containing products", "SKU"),
  SIZE: ci18n("Column title in a spreadsheet containing products", "Size"),
  COLOR: ci18n("Column title in a spreadsheet containing products", "Color"),
  REFERENCE_PRICE: ci18n(
    "Column title in a spreadsheet containing products",
    "Reference Price",
  ),
  PRICE: ci18n("Column title in a spreadsheet containing products", "Price"),
  DEFAULT_SHIPPING_PRICE: ci18n(
    "Column title in a spreadsheet containing products",
    "Default Shipping Price",
  ),
  INVENTORY: ci18n(
    "Column title in a spreadsheet containing products",
    "Inventory",
  ),
  SHIPPING_TIME: ci18n(
    "Column title in a spreadsheet containing products",
    "Shipping Time",
  ),
  STATUS: ci18n("Column title in a spreadsheet containing products", "Status"),
  IS_PROMOTED: ci18n(
    "Column title in a spreadsheet containing products",
    "Is Promoted",
  ),
  REVIEW_STATE: ci18n(
    "Column title in a spreadsheet containing products",
    "Review State",
  ),
  MAIN_IMAGE: ci18n(
    "Column title in a spreadsheet containing products",
    "Main Image",
  ),
  EXTRA_IMAGES: ci18n(
    "Column title in a spreadsheet containing products",
    "Extra Images",
  ),
  VARIATION_IMAGE: ci18n(
    "Column title in a spreadsheet containing products",
    "Variation Image",
  ),
  TAGS: ci18n("Column title in a spreadsheet containing products", "Tags"),
  LAST_UPDATED: ci18n(
    "Column title in a spreadsheet containing products",
    "Last Updated",
  ),
  DATE_UPLOADED: ci18n(
    "Column title in a spreadsheet containing products",
    "Date Uploaded",
  ),
  WARNING_ID: ci18n(
    "Column title in a spreadsheet containing products",
    "Warning ID",
  ),
  WISH_EXPRESS_COUNTRIES: ci18n(
    "Column title in a spreadsheet containing products",
    "Wish Express Countries",
  ),
  CURRENCY_CODE: ci18n(
    "Column title in a spreadsheet containing products",
    "Currency Code",
  ),
  WAREHOUSE: ci18n(
    "Column title in a spreadsheet containing products",
    "Warehouse",
  ),
  BRAND_ID: ci18n(
    "Column title in a spreadsheet containing products",
    "Brand ID",
  ),
  BRAND: ci18n("Column title in a spreadsheet containing products", "Brand"),
  BRAND_STATUS: ci18n(
    "Column title in a spreadsheet containing products",
    "Brand Status",
  ),
  CONDITION: ci18n(
    "Column title in a spreadsheet containing products",
    "Condition",
  ),
  CUSTOMS_HS_CODE: ci18n(
    "Column title in a spreadsheet containing products",
    "Customs HS Code",
  ),
  PACKAGE_LENGTH: ci18n(
    "Column title in a spreadsheet containing products",
    "Package Length",
  ),
  PACKAGE_HEIGHT: ci18n(
    "Column title in a spreadsheet containing products",
    "Package Height",
  ),
  PACKAGE_WIDTH: ci18n(
    "Column title in a spreadsheet containing products",
    "Package Width",
  ),
  PACKAGE_WEIGHT: ci18n(
    "Column title in a spreadsheet containing products",
    "Package Weight",
  ),
  CUSTOMS_DECLARED_VALUE: ci18n(
    "Column title in a spreadsheet containing products",
    "Customs Declared Value",
  ),
  COUNTRY_OF_ORIGIN: ci18n(
    "Column title in a spreadsheet containing products",
    "Country of Origin",
  ),
  DECLARED_LOCAL_NAME: ci18n(
    "Column title in a spreadsheet containing products",
    "Declared Local Name",
  ),
  CONTAINS_LIQUID: ci18n(
    "Column title in a spreadsheet containing products",
    "Contains Liquid",
  ),
  CONTAINS_METAL: ci18n(
    "Column title in a spreadsheet containing products",
    "Contains Metal",
  ),
  CONTAINS_POWDER: ci18n(
    "Column title in a spreadsheet containing products",
    "Contains Powder",
  ),
  CONTAINS_BATTERY: ci18n(
    "Column title in a spreadsheet containing products",
    "Contains Battery",
  ),
  PIECES_INCLUDED: ci18n(
    "Column title in a spreadsheet containing products",
    "Pieces Included",
  ),
  CLEAN_IMAGE: ci18n(
    "Column title in a spreadsheet containing products",
    "Clean Image",
  ),
  DECLARED_NAME: ci18n(
    "Column title in a spreadsheet containing products",
    "Declared Name",
  ),
  MAX_QUANTITY: ci18n(
    "Column title in a spreadsheet containing products",
    "Max Quantity",
  ),
  REFERENCE_VALUE: ci18n(
    "Column title in a spreadsheet containing products",
    "Reference Value",
  ),
  UNIT: ci18n("Column title in a spreadsheet containing products", "Unit"),
  QUANTITY_VALUE: ci18n(
    "Column title in a spreadsheet containing products",
    "Quantity Value",
  ),
  AD: ci18n("Column title in a spreadsheet containing products", "AD"),
  AL: ci18n("Column title in a spreadsheet containing products", "AL"),
  AR: ci18n("Column title in a spreadsheet containing products", "AR"),
  AT: ci18n("Column title in a spreadsheet containing products", "AT"),
  AU: ci18n("Column title in a spreadsheet containing products", "AU"),
  BA: ci18n("Column title in a spreadsheet containing products", "BA"),
  BE: ci18n("Column title in a spreadsheet containing products", "BE"),
  BG: ci18n("Column title in a spreadsheet containing products", "BG"),
  BR: ci18n("Column title in a spreadsheet containing products", "BR"),
  CA: ci18n("Column title in a spreadsheet containing products", "CA"),
  CH: ci18n("Column title in a spreadsheet containing products", "CH"),
  CL: ci18n("Column title in a spreadsheet containing products", "CL"),
  CO: ci18n("Column title in a spreadsheet containing products", "CO"),
  CR: ci18n("Column title in a spreadsheet containing products", "CR"),
  CZ: ci18n("Column title in a spreadsheet containing products", "CZ"),
  DE: ci18n("Column title in a spreadsheet containing products", "DE"),
  DK: ci18n("Column title in a spreadsheet containing products", "DK"),
  EE: ci18n("Column title in a spreadsheet containing products", "EE"),
  ES: ci18n("Column title in a spreadsheet containing products", "ES"),
  FI: ci18n("Column title in a spreadsheet containing products", "FI"),
  FR: ci18n("Column title in a spreadsheet containing products", "FR"),
  GB: ci18n("Column title in a spreadsheet containing products", "GB"),
  GI: ci18n("Column title in a spreadsheet containing products", "GI"),
  GR: ci18n("Column title in a spreadsheet containing products", "GR"),
  HR: ci18n("Column title in a spreadsheet containing products", "HR"),
  HU: ci18n("Column title in a spreadsheet containing products", "HU"),
  IE: ci18n("Column title in a spreadsheet containing products", "IE"),
  IL: ci18n("Column title in a spreadsheet containing products", "IL"),
  IS: ci18n("Column title in a spreadsheet containing products", "IS"),
  IT: ci18n("Column title in a spreadsheet containing products", "IT"),
  JE: ci18n("Column title in a spreadsheet containing products", "JE"),
  JP: ci18n("Column title in a spreadsheet containing products", "JP"),
  KR: ci18n("Column title in a spreadsheet containing products", "KR"),
  LI: ci18n("Column title in a spreadsheet containing products", "LI"),
  LT: ci18n("Column title in a spreadsheet containing products", "LT"),
  LU: ci18n("Column title in a spreadsheet containing products", "LU"),
  LV: ci18n("Column title in a spreadsheet containing products", "LV"),
  MC: ci18n("Column title in a spreadsheet containing products", "MC"),
  MD: ci18n("Column title in a spreadsheet containing products", "MD"),
  ME: ci18n("Column title in a spreadsheet containing products", "ME"),
  MK: ci18n("Column title in a spreadsheet containing products", "MK"),
  MT: ci18n("Column title in a spreadsheet containing products", "MT"),
  MX: ci18n("Column title in a spreadsheet containing products", "MX"),
  NL: ci18n("Column title in a spreadsheet containing products", "NL"),
  NO: ci18n("Column title in a spreadsheet containing products", "NO"),
  NZ: ci18n("Column title in a spreadsheet containing products", "NZ"),
  PE: ci18n("Column title in a spreadsheet containing products", "PE"),
  PL: ci18n("Column title in a spreadsheet containing products", "PL"),
  PR: ci18n("Column title in a spreadsheet containing products", "PR"),
  PT: ci18n("Column title in a spreadsheet containing products", "PT"),
  RO: ci18n("Column title in a spreadsheet containing products", "RO"),
  RS: ci18n("Column title in a spreadsheet containing products", "RS"),
  SE: ci18n("Column title in a spreadsheet containing products", "SE"),
  SG: ci18n("Column title in a spreadsheet containing products", "SG"),
  SI: ci18n("Column title in a spreadsheet containing products", "SI"),
  SK: ci18n("Column title in a spreadsheet containing products", "SK"),
  SM: ci18n("Column title in a spreadsheet containing products", "SM"),
  UA: ci18n("Column title in a spreadsheet containing products", "UA"),
  US: ci18n("Column title in a spreadsheet containing products", "US"),
  VI: ci18n("Column title in a spreadsheet containing products", "VI"),
  ZA: ci18n("Column title in a spreadsheet containing products", "ZA"),
  AD_TTD: ci18n("Column title in a spreadsheet containing products", "AD"),
  AL_TTD: ci18n("Column title in a spreadsheet containing products", "AL"),
  AR_TTD: ci18n("Column title in a spreadsheet containing products", "AR"),
  AT_TTD: ci18n("Column title in a spreadsheet containing products", "AT"),
  AU_TTD: ci18n("Column title in a spreadsheet containing products", "AU"),
  BA_TTD: ci18n("Column title in a spreadsheet containing products", "BA"),
  BE_TTD: ci18n("Column title in a spreadsheet containing products", "BE"),
  BG_TTD: ci18n("Column title in a spreadsheet containing products", "BG"),
  BR_TTD: ci18n("Column title in a spreadsheet containing products", "BR"),
  CA_TTD: ci18n("Column title in a spreadsheet containing products", "CA"),
  CH_TTD: ci18n("Column title in a spreadsheet containing products", "CH"),
  CL_TTD: ci18n("Column title in a spreadsheet containing products", "CL"),
  CO_TTD: ci18n("Column title in a spreadsheet containing products", "CO"),
  CR_TTD: ci18n("Column title in a spreadsheet containing products", "CR"),
  CZ_TTD: ci18n("Column title in a spreadsheet containing products", "CZ"),
  DE_TTD: ci18n("Column title in a spreadsheet containing products", "DE"),
  DK_TTD: ci18n("Column title in a spreadsheet containing products", "DK"),
  EE_TTD: ci18n("Column title in a spreadsheet containing products", "EE"),
  ES_TTD: ci18n("Column title in a spreadsheet containing products", "ES"),
  FI_TTD: ci18n("Column title in a spreadsheet containing products", "FI"),
  FR_TTD: ci18n("Column title in a spreadsheet containing products", "FR"),
  GB_TTD: ci18n("Column title in a spreadsheet containing products", "GB"),
  GI_TTD: ci18n("Column title in a spreadsheet containing products", "GI"),
  GR_TTD: ci18n("Column title in a spreadsheet containing products", "GR"),
  HR_TTD: ci18n("Column title in a spreadsheet containing products", "HR"),
  HU_TTD: ci18n("Column title in a spreadsheet containing products", "HU"),
  IE_TTD: ci18n("Column title in a spreadsheet containing products", "IE"),
  IL_TTD: ci18n("Column title in a spreadsheet containing products", "IL"),
  IS_TTD: ci18n("Column title in a spreadsheet containing products", "IS"),
  IT_TTD: ci18n("Column title in a spreadsheet containing products", "IT"),
  JE_TTD: ci18n("Column title in a spreadsheet containing products", "JE"),
  JP_TTD: ci18n("Column title in a spreadsheet containing products", "JP"),
  KR_TTD: ci18n("Column title in a spreadsheet containing products", "KR"),
  LI_TTD: ci18n("Column title in a spreadsheet containing products", "LI"),
  LT_TTD: ci18n("Column title in a spreadsheet containing products", "LT"),
  LU_TTD: ci18n("Column title in a spreadsheet containing products", "LU"),
  LV_TTD: ci18n("Column title in a spreadsheet containing products", "LV"),
  MC_TTD: ci18n("Column title in a spreadsheet containing products", "MC"),
  MD_TTD: ci18n("Column title in a spreadsheet containing products", "MD"),
  ME_TTD: ci18n("Column title in a spreadsheet containing products", "ME"),
  MK_TTD: ci18n("Column title in a spreadsheet containing products", "MK"),
  MT_TTD: ci18n("Column title in a spreadsheet containing products", "MT"),
  MX_TTD: ci18n("Column title in a spreadsheet containing products", "MX"),
  NL_TTD: ci18n("Column title in a spreadsheet containing products", "NL"),
  NO_TTD: ci18n("Column title in a spreadsheet containing products", "NO"),
  NZ_TTD: ci18n("Column title in a spreadsheet containing products", "NZ"),
  PE_TTD: ci18n("Column title in a spreadsheet containing products", "PE"),
  PL_TTD: ci18n("Column title in a spreadsheet containing products", "PL"),
  PR_TTD: ci18n("Column title in a spreadsheet containing products", "PR"),
  PT_TTD: ci18n("Column title in a spreadsheet containing products", "PT"),
  RO_TTD: ci18n("Column title in a spreadsheet containing products", "RO"),
  RS_TTD: ci18n("Column title in a spreadsheet containing products", "RS"),
  SE_TTD: ci18n("Column title in a spreadsheet containing products", "SE"),
  SG_TTD: ci18n("Column title in a spreadsheet containing products", "SG"),
  SI_TTD: ci18n("Column title in a spreadsheet containing products", "SI"),
  SK_TTD: ci18n("Column title in a spreadsheet containing products", "SK"),
  SM_TTD: ci18n("Column title in a spreadsheet containing products", "SM"),
  UA_TTD: ci18n("Column title in a spreadsheet containing products", "UA"),
  US_TTD: ci18n("Column title in a spreadsheet containing products", "US"),
  VI_TTD: ci18n("Column title in a spreadsheet containing products", "VI"),
  ZA_TTD: ci18n("Column title in a spreadsheet containing products", "ZA"),
  CALIFORNIA_PROPOSITION_65_CHEMICAL_NAMES: ci18n(
    "Column title in a spreadsheet containing products",
    "California Proposition 65 Chemical Names",
  ),
  CALIFORNIA_PROPOSITION_65_WARNING_TYPE: ci18n(
    "Column title in a spreadsheet containing products",
    "California Proposition 65 Warning Type",
  ),
  WISH_EXPRESS_ENABLED_COUNTRIES: ci18n(
    "Column title in a spreadsheet containing products",
    "Wish Express Enabled Countries",
  ),
  WISH_EXPRESS_DISABLED_COUNTRIES: ci18n(
    "Column title in a spreadsheet containing products",
    "Wish Express Disabled Countries",
  ),
  IS_LTL: ci18n(
    "Column title in a spreadsheet containing products",
    "Is Less-Than-Truckload",
  ),
  FIRST_MILE_SHIPPING_PRICE_D_DISABLED: ci18n(
    "Column title in a spreadsheet containing products",
    "First Mile Shipping Price",
  ),
  EFFECTIVE_DATE: ci18n(
    "Column title in a spreadsheet containing products",
    "Effective Date",
  ),
  CALCULATED_SHIPPING: ci18n(
    "Column title in a spreadsheet containing products",
    "Calculated Shipping",
  ),
};

export const LEGACY_COLOR_DISPLAY_TEXT = ci18n(
  "Variation type, merchant customized color for a variation",
  "Custom Color",
);
export const LEGACY_SIZE_DISPLAY_TEXT = ci18n(
  "Custom variation type, custom value to distinguish a variation",
  "Custom Variation",
);
