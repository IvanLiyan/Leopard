/* External Libraries */
import { observable, action, computed } from "mobx";
import flatten from "lodash/flatten";
import sum from "lodash/sum";
import sumBy from "lodash/sumBy";
import _min from "lodash/min";
import _max from "lodash/max";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";

import { formatCurrency } from "@toolkit/currency";
import {
  EligibleProductInfo,
  EligibleProduct,
  EligibleVariation,
  MfpCreateCampaignInitialData,
  variationInventory,
} from "@toolkit/mfp/tools";
import { VariationDiscountDataInput } from "@schema/types";

export type SelectedVariationInfo = {
  readonly quantity: number | null | undefined;
  readonly discount: number | null | undefined;
  readonly variation: EligibleVariation;
};

export type SelectedProductInfo = {
  readonly product: EligibleProduct;
  readonly variations: ReadonlyArray<EligibleVariation>;
  readonly selectedVariationInfo: ReadonlyMap<
    string, // variation ID
    SelectedVariationInfo
  >;
};

export default class CreateCampaignState {
  @observable
  initialData: MfpCreateCampaignInitialData;

  @observable
  private selectedProductInfos: Map<
    string, // product ID
    SelectedProductInfo
  > = new Map();

  constructor({
    initialData,
    initialProductInfos,
  }: {
    readonly initialData: MfpCreateCampaignInitialData;
    readonly initialProductInfos?: CreateCampaignState["selectedProductInfos"];
  }) {
    this.initialData = initialData;
    if (initialProductInfos != null) {
      this.selectedProductInfos = initialProductInfos;
    }
  }

  @computed
  get numberOfSelectedVariations(): number {
    return Array.from(this.selectedProductInfos.values()).reduce(
      (acc, { selectedVariationInfo }) => acc + selectedVariationInfo.size,
      0
    );
  }

  @computed
  get asDiscountDataInput(): ReadonlyArray<VariationDiscountDataInput> {
    return flatten(
      Array.from(this.selectedProductInfos.entries()).map(
        ([productId, { selectedVariationInfo }]) =>
          Array.from(selectedVariationInfo.keys())
            .map((variationId) => ({
              productId,
              variationId,
              discountPercentage:
                this.getVariationDiscount({ productId, variationId }) || 0,
              maxQuantity:
                this.getVariationQuantity({ productId, variationId }) || 0,
            }))
            .filter(({ maxQuantity }) => maxQuantity > 0)
      )
    );
  }

  getVariationQuantity = ({
    productId,
    variationId,
  }: {
    readonly productId: string;
    readonly variationId: string;
  }) => {
    const productInfo = this.selectedProductInfos.get(productId);

    if (productInfo == null) {
      return;
    }

    const selectedVariationInfo =
      productInfo.selectedVariationInfo.get(variationId);

    return selectedVariationInfo == null
      ? undefined
      : selectedVariationInfo.quantity;
  };

  getVariationDiscount = ({
    productId,
    variationId,
  }: {
    readonly productId: string;
    readonly variationId: string;
  }) => {
    const productInfo = this.selectedProductInfos.get(productId);

    if (productInfo == null) {
      return;
    }

    const selectedVariationInfo =
      productInfo.selectedVariationInfo.get(variationId);

    return selectedVariationInfo == null
      ? undefined
      : selectedVariationInfo.discount;
  };

  getSelectedProductTotalVariations = ({
    productId,
  }: {
    readonly productId: string;
  }): number => {
    const selectedProductInfo = this.selectedProductInfos.get(productId);

    return selectedProductInfo == null
      ? 0
      : selectedProductInfo.variations.filter(
          ({ inventory, enabled }) =>
            enabled && sumBy(inventory, ({ count }) => count) > 0
        ).length;
  };

  @action
  setVariationQuantity = ({
    productInfo,
    variation,
    quantity,
  }: {
    readonly productInfo: EligibleProductInfo;
    readonly variation: EligibleVariation;
    readonly quantity: number | null | undefined;
  }) => {
    if (!this.selectedProductInfos.has(productInfo.product.id)) {
      const newProductInfo: SelectedProductInfo = {
        product: productInfo.product,
        variations: productInfo.variations,
        selectedVariationInfo: new Map([
          [
            variation.id,
            {
              variation,
              quantity,
              discount: undefined,
            },
          ],
        ]),
      };
      this.selectedProductInfos.set(productInfo.product.id, newProductInfo);
    }
    const selectedProductInfo = this.selectedProductInfos.get(
      productInfo.product.id
    );
    if (selectedProductInfo != null) {
      const newVariationsMap: Map<string, SelectedVariationInfo> = new Map(
        selectedProductInfo.selectedVariationInfo
      );

      newVariationsMap.set(variation.id, {
        variation,
        quantity,
        discount: undefined,
      });

      const newProductInfo: SelectedProductInfo = {
        product: productInfo.product,
        variations: productInfo.variations,
        selectedVariationInfo: newVariationsMap,
      };

      this.selectedProductInfos.set(productInfo.product.id, newProductInfo);
    }
  };

  @action
  setVariationDiscount = ({
    product,
    variation,
    discount,
  }: {
    readonly product: EligibleProduct;
    readonly variation: EligibleVariation;
    readonly discount: number | null | undefined;
  }) => {
    if (!this.selectedProductInfos.has(product.id)) {
      return;
    }

    const productInfo = this.selectedProductInfos.get(product.id);
    if (productInfo != null) {
      const newVariationsMap: Map<string, SelectedVariationInfo> = new Map(
        productInfo.selectedVariationInfo
      );

      const quantity = productInfo.selectedVariationInfo.get(
        variation.id
      )?.quantity;

      // case is unreachable, can't get here until all quantities exist
      if (quantity == null) {
        return;
      }

      newVariationsMap.set(variation.id, {
        variation,
        quantity,
        discount,
      });

      const newProductInfo: SelectedProductInfo = {
        product,
        variations: productInfo.variations,
        selectedVariationInfo: newVariationsMap,
      };

      this.selectedProductInfos.set(product.id, newProductInfo);
    }
  };

  getProductQuantity = (info: EligibleProductInfo) => {
    return sum(
      info.variations.map(({ id: variationId }) =>
        this.getVariationQuantity({ productId: info.product.id, variationId })
      )
    );
  };

  getProductSales = ({ product: { sales } }: EligibleProductInfo) => {
    return sales;
  };

  getProductInventory = ({ variations }: EligibleProductInfo) => {
    return sum(variations.map((variation) => variationInventory(variation)));
  };

  getSelectedVariations = (product: EligibleProductInfo) => {
    return product.variations.filter(
      ({ id: variationId }) =>
        this.getVariationQuantity({
          productId: product.product.id,
          variationId,
        }) != null &&
        this.getVariationQuantity({
          productId: product.product.id,
          variationId,
        }) != 0
    );
  };

  @action
  toggleAllVariations = (product: EligibleProductInfo, turnOn: boolean) => {
    if (turnOn) {
      product.variations.forEach((variation: EligibleVariation) => {
        const totalInventory = variationInventory(variation);
        if (
          totalInventory != null &&
          totalInventory != 0 &&
          variation.enabled
        ) {
          this.setVariationQuantity({
            productInfo: product,
            variation,
            quantity: totalInventory,
          });
        }
      });
    } else {
      this.selectedProductInfos.delete(product.product.id);
    }
  };

  getSelectedVariationsMinOriginalPrice = (product: EligibleProductInfo) => {
    const minVariation = minBy(
      this.getSelectedVariations(product),
      ({ price }) => price.amount
    );
    return minVariation == null ? undefined : minVariation.price;
  };

  getSelectedVariationsMaxOriginalPrice = (product: EligibleProductInfo) => {
    const maxVariation = maxBy(
      this.getSelectedVariations(product),
      ({ price }) => price.amount
    );
    return maxVariation == null ? undefined : maxVariation.price;
  };

  getSelectedVariationsOriginalPriceRange = (product: EligibleProductInfo) => {
    const minPrice = this.getSelectedVariationsMinOriginalPrice(product);
    const maxPrice = this.getSelectedVariationsMaxOriginalPrice(product);
    const minPriceStr = minPrice == null ? null : minPrice.display;
    const maxPriceStr = maxPrice == null ? null : maxPrice.display;

    if (minPriceStr == null && maxPriceStr == null) {
      return;
    }

    if (minPriceStr == null) {
      return maxPriceStr;
    }

    if (maxPriceStr == null || minPriceStr == maxPriceStr) {
      return minPriceStr;
    }

    return `${minPriceStr} - ${maxPriceStr}`;
  };

  @computed
  get selectedProducts(): ReadonlyArray<EligibleProductInfo> {
    return Array.from(this.selectedProductInfos.values()).map(
      ({ product, selectedVariationInfo }) => {
        const variations = Array.from(selectedVariationInfo.values()).map(
          ({ variation }) => variation
        );

        return {
          product,
          variations,
        };
      }
    );
  }

  getMinOriginalPrice = (product: EligibleProductInfo) => {
    const minVariation = minBy(product.variations, ({ price }) => price.amount);
    return minVariation == null ? undefined : minVariation.price;
  };

  getMaxOriginalPrice = (product: EligibleProductInfo) => {
    const maxVariation = maxBy(product.variations, ({ price }) => price.amount);
    return maxVariation == null ? undefined : maxVariation.price;
  };

  getOriginalPriceRange = (product: EligibleProductInfo) => {
    const minPrice = this.getMinOriginalPrice(product);
    const maxPrice = this.getMaxOriginalPrice(product);
    const minPriceStr = minPrice == null ? null : minPrice.display;
    const maxPriceStr = maxPrice == null ? null : maxPrice.display;

    if (minPriceStr == null && maxPriceStr == null) {
      return;
    }

    if (minPriceStr == null) {
      return maxPriceStr;
    }

    if (maxPriceStr == null) {
      return minPriceStr;
    }

    if (minPriceStr == maxPriceStr) {
      return minPriceStr;
    }

    return `${minPriceStr} - ${maxPriceStr}`;
  };

  getNewPrice = (product: EligibleProduct, variation: EligibleVariation) => {
    return (
      (variation.price.amount *
        (100 -
          (this.getVariationDiscount({
            productId: product.id,
            variationId: variation.id,
          }) || 0))) /
      100
    );
  };

  getMinNewPrice = (product: EligibleProductInfo) => {
    return _min(
      this.getSelectedVariations(product).map((variations) =>
        this.getNewPrice(product.product, variations)
      )
    );
  };

  getMaxNewPrice = (product: EligibleProductInfo) => {
    return _max(
      this.getSelectedVariations(product).map((variations) =>
        this.getNewPrice(product.product, variations)
      )
    );
  };

  getNewPriceRange = (product: EligibleProductInfo) => {
    if (product.variations.length == 0) {
      return;
    }

    const currency = product.variations[0].price.currencyCode;

    const minPrice = this.getMinNewPrice(product) || 0;
    const maxPrice = this.getMaxNewPrice(product) || 0;
    const minPriceStr = formatCurrency(minPrice, currency);
    const maxPriceStr = formatCurrency(maxPrice, currency);
    return minPrice == maxPrice
      ? minPriceStr
      : `${minPriceStr} - ${maxPriceStr}`;
  };

  getMinDiscount = (product: EligibleProductInfo) => {
    const min = _min(
      this.getSelectedVariations(product).map((variation) =>
        this.getVariationDiscount({
          productId: product.product.id,
          variationId: variation.id,
        })
      )
    );

    return min == null ? null : min;
  };

  getMaxDiscount = (product: EligibleProductInfo) => {
    const max = _max(
      this.getSelectedVariations(product).map((variation) =>
        this.getVariationDiscount({
          productId: product.product.id,
          variationId: variation.id,
        })
      )
    );

    return max == null ? null : max;
  };

  getDiscountRange = (product: EligibleProductInfo) => {
    const discMin = this.getMinDiscount(product) || 0;
    const discMax = this.getMaxDiscount(product) || 0;
    return discMin == discMax ? `${discMin}%` : `${discMin}-${discMax}%`;
  };

  @action
  setSelectedDiscounts = (
    product: EligibleProductInfo,
    discount: number | null | undefined
  ) => {
    this.getSelectedVariations(product).forEach((variation) =>
      this.setVariationDiscount({
        product: product.product,
        variation,
        discount,
      })
    );
  };

  @action
  setAllSelectedDiscounts = (discount: number) => {
    Array.from(this.selectedProductInfos.entries()).forEach(
      ([productId, productInfo]) => {
        Array.from(productInfo.selectedVariationInfo.keys()).forEach(
          (variationId) => {
            const variationQuantity = this.getVariationQuantity({
              productId,
              variationId,
            });
            const variation =
              productInfo.selectedVariationInfo.get(variationId)?.variation;
            if (variationQuantity && variation != null) {
              this.setVariationDiscount({
                product: productInfo.product,
                variation,
                discount,
              });
            }
          }
        );
      }
    );
  };
}
