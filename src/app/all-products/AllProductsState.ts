import ToastStore from "@core/stores/ToastStore";
import { observable, computed, action } from "mobx";
import {
  PickedProduct,
  PickedVariation,
  PickedWarehouse,
  ProductsContainerInitialData,
  UpsertProductsResponseType,
  UpsertProductsRequestType,
  UPSERT_PRODUCTS_MUTATION,
  productHasVariations,
} from "./toolkit";
import ApolloStore from "@core/stores/ApolloStore";
import {
  PaymentCurrencyCode,
  ProductUpsertInput,
  VariationInput,
} from "@schema";
import uniqBy from "lodash/uniqBy";

export default class AllProductsState {
  @observable
  warehouse: PickedWarehouse;

  @observable
  initialData: ProductsContainerInitialData;

  @observable
  showVariationGroupingUI: boolean;

  @observable
  newVariationPrices: Map<
    string, // variation ID
    {
      readonly productId: string;
      readonly newPrice: {
        readonly amount: number;
        readonly currencyCode: PaymentCurrencyCode;
      } | null;
    }
  > = new Map();

  @observable
  newVariationInventories: Map<
    string, // variation ID
    {
      readonly productId: string;
      readonly newInventory: number | null;
    }
  > = new Map();

  @observable
  resetProducts: () => void = () => {
    return;
  };

  @observable
  private newProductEnabled: Map<
    string, // product ID
    {
      readonly hasVariations: boolean;
      readonly newEnabled: boolean;
    }
  > = new Map();

  @observable
  private newVariationEnabled: Map<
    string, // variation ID
    {
      readonly productId: string;
      readonly newEnabled: boolean;
    }
  > = new Map();

  constructor({
    warehouse,
    initialData,
  }: {
    readonly warehouse: AllProductsState["warehouse"];
    readonly initialData: ProductsContainerInitialData;
  }) {
    this.warehouse = warehouse;
    this.initialData = initialData;
    this.showVariationGroupingUI =
      !!initialData.currentUser?.gating.showVariationGroupingMUG ||
      !!initialData.platformConstants?.deciderKey?.showVariationGroupingDkey;
  }

  @computed
  get numberOfChanges(): number {
    return (
      this.newVariationPrices.size +
      this.newVariationInventories.size +
      this.newProductEnabled.size +
      this.newVariationEnabled.size
    );
  }

  @computed
  get isPrimaryWarehouse(): boolean {
    const warehouses = this.initialData.currentMerchant?.warehouses || [];

    return warehouses.length == 0 || this.warehouse.id == warehouses[0].id;
  }

  isVariationEnabledLocally = (variationId: string): boolean | undefined => {
    return this.newVariationEnabled.get(variationId)?.newEnabled;
  };

  isProductEnabledLocally = (productId: string): boolean | undefined => {
    return this.newProductEnabled.get(productId)?.newEnabled;
  };

  @computed
  get hasPriceError(): boolean {
    return Array.from(this.newVariationPrices.values()).some(
      ({ newPrice }) => newPrice == null || newPrice.amount < 0.01,
    );
  }

  @action
  enableProduct = ({
    product,
    skipVariations: skipVariationsProp,
  }: {
    readonly product: PickedProduct;
    readonly skipVariations?: boolean;
  }) => {
    const skipVariations =
      !productHasVariations(product) || skipVariationsProp || false;

    if (!skipVariations) {
      product.variations.forEach((variation) =>
        this.enableVariation({ variation, product }),
      );
    }

    if (product.enabled) {
      this.newProductEnabled.delete(product.id);
      return;
    }

    this.newProductEnabled.set(product.id, {
      hasVariations: productHasVariations(product),
      newEnabled: true,
    });
  };

  @action
  disableProduct = ({
    product,
    skipVariations: skipVariationsProp,
  }: {
    readonly product: PickedProduct;
    readonly skipVariations?: boolean;
  }) => {
    const skipVariations =
      !productHasVariations(product) || skipVariationsProp || false;

    if (!skipVariations) {
      product.variations.forEach((variation) =>
        this.disableVariation({ variation, product }),
      );
    }

    if (!product.enabled) {
      this.newProductEnabled.delete(product.id);
      return;
    }

    this.newProductEnabled.set(product.id, {
      hasVariations: productHasVariations(product),
      newEnabled: false,
    });
  };

  @action
  enableVariation = ({
    variation,
    product,
  }: {
    readonly variation: PickedVariation;
    readonly product: PickedProduct;
  }) => {
    // If every other variation is enabled locally (or if it hasn't been edited
    // locally but is enabled in the BE) enable product
    if (
      product.variations.every(({ id, enabled }) => {
        if (id == variation.id) {
          return true;
        }

        const localState = this.newVariationEnabled.get(id);
        if (localState == null) {
          return enabled || false;
        }

        return localState.newEnabled;
      })
    ) {
      this.enableProduct({ product, skipVariations: true });
    }

    if (variation.enabled) {
      this.newVariationEnabled.delete(variation.id);
      return;
    }

    this.newVariationEnabled.set(variation.id, {
      productId: product.id,
      newEnabled: true,
    });
  };

  @action
  disableVariation = ({
    variation,
    product,
  }: {
    readonly variation: PickedVariation;
    readonly product: PickedProduct;
  }) => {
    this.disableProduct({ product, skipVariations: true });

    if (variation.enabled === false) {
      this.newVariationEnabled.delete(variation.id);
      return;
    }

    this.newVariationEnabled.set(variation.id, {
      productId: product.id,
      newEnabled: false,
    });
  };

  @action
  clearChanges = () => {
    this.newVariationPrices.clear();
    this.newVariationInventories.clear();
    this.newProductEnabled.clear();
    this.newVariationEnabled.clear();
  };

  @computed
  get asInput(): ReadonlyArray<ProductUpsertInput> {
    const editedPids: Map<
      string, // product ID
      Set<string> // variation ID
    > = new Map();

    Array.from(this.newProductEnabled.keys()).forEach((pid) => {
      editedPids.set(pid, new Set());
    });

    Array.from(this.newVariationInventories.entries()).forEach(
      ([variationId, { productId }]) => {
        const set = editedPids.get(productId);
        if (set != null) {
          set.add(variationId);
          editedPids.set(productId, set);
          return;
        }
        editedPids.set(productId, new Set([variationId]));
      },
      new Map(),
    );

    Array.from(this.newVariationPrices.entries()).forEach(
      ([variationId, { productId }]) => {
        const set = editedPids.get(productId);
        if (set != null) {
          set.add(variationId);
          editedPids.set(productId, set);
          return;
        }
        editedPids.set(productId, new Set([variationId]));
      },
      new Map(),
    );

    Array.from(this.newVariationEnabled.entries()).forEach(
      ([variationId, { productId }]) => {
        const set = editedPids.get(productId);
        if (set != null) {
          set.add(variationId);
          editedPids.set(productId, set);
          return;
        }
        editedPids.set(productId, new Set([variationId]));
      },
      new Map(),
    );

    const input: ReadonlyArray<ProductUpsertInput> = Array.from(
      editedPids.entries(),
    ).map(([pid, variationIds]) => {
      // Only set product to enabled/disabled if it has no variations.
      // If it does, setting the variations will automatically set product too
      const productEnabledData = this.newProductEnabled.get(pid);
      const productEnabled =
        productEnabledData != null && !productEnabledData.hasVariations
          ? productEnabledData.newEnabled
          : undefined;

      return {
        id: pid,
        warehouseId: this.warehouse.id,
        enabled: productEnabled,
        variations:
          variationIds.size == 0
            ? undefined
            : Array.from(variationIds).map((vid): VariationInput => {
                const inventory =
                  this.newVariationInventories.get(vid)?.newInventory;
                const enabled = this.newVariationEnabled.get(vid)?.newEnabled;
                const price = this.newVariationPrices.get(vid)?.newPrice;

                return {
                  id: vid,
                  inventory:
                    inventory == null
                      ? undefined
                      : [
                          {
                            warehouseId: this.warehouse.id,
                            count: inventory,
                          },
                        ],
                  enabled,
                  price,
                };
              }),
      };
    });

    return input;
  }

  @action
  submit = async (): Promise<boolean> => {
    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    const { data } = await client.mutate<
      UpsertProductsResponseType,
      UpsertProductsRequestType
    >({
      mutation: UPSERT_PRODUCTS_MUTATION,
      variables: { input: this.asInput },
    });

    const ok = data?.productCatalog?.upsertProducts.ok;
    const failures = data?.productCatalog?.upsertProducts.failures;

    if (ok == null || !ok) {
      const uniquePidFailures = uniqBy(
        failures || [],
        ({ productId }) => productId,
      ).length;
      toastStore.negative(
        uniquePidFailures > 0 && failures != null
          ? failures[0].message
          : i`Something went wrong`,
      );
    } else {
      toastStore.positive(`Products updated`);
    }

    return true;
  };
}
