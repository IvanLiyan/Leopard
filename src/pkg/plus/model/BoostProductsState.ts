import _ from "lodash";
import gql from "graphql-tag";
import { observable, action, computed } from "mobx";

import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import {
  PaymentCurrencyCode,
  ProductPromotionInput,
  ProductPromotionsInput,
  UpsertProductPromotions,
  MarketingServiceMutationsUpsertProductPromotionsArgs,
} from "@schema/types";

import {
  BoostableProduct,
  BoostProductsInitialData,
  BoostProductsMerchantSpending,
} from "@toolkit/marketing/boost-products";
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import NavigationStore from "@stores/NavigationStore";

const UPSERT_PROMOTIONS_MUTATION = gql`
  mutation BoostProductsState_UpsertProductPromotions(
    $input: ProductPromotionsInput!
  ) {
    marketing {
      upsertProductPromotions(input: $input) {
        ok
        message
      }
    }
  }
`;

export default class BoostProductsState {
  @observable
  initialData: BoostProductsInitialData;

  @observable
  selectedProducts: ReadonlyArray<BoostableProduct> = [];

  @observable
  productBudgetById: Map<string, number> = new Map();

  @observable
  forceValidation = false;

  @observable
  isSubmitting = false;

  constructor(args: { readonly initialData: BoostProductsInitialData }) {
    const { initialData } = args;
    this.initialData = { ...initialData };
  }

  isSelectedProduct(productId: string): boolean {
    return this.selectedProducts.some(({ product }) => product.id == productId);
  }

  selectProduct(boostableProduct: BoostableProduct) {
    const {
      product: { id: boostableProductId },
    } = boostableProduct;
    if (this.isSelectedProduct(boostableProductId)) {
      return;
    }
    this.selectedProducts = [...this.selectedProducts, boostableProduct];
  }

  @action
  deselectProducts(productIds: ReadonlyArray<string>) {
    const { productBudgetById } = this;
    this.selectedProducts = this.selectedProducts.filter(
      ({ product }) => !productIds.includes(product.id),
    );
    for (const productId of productIds) {
      productBudgetById.delete(productId);
    }
  }

  @computed
  get canSave(): boolean {
    return this.selectedProducts.length > 0;
  }

  @computed
  get selectProductCount(): number {
    return this.selectedProducts.length;
  }

  @computed
  get isFreeBudgetMerchant(): boolean {
    const {
      marketing: {
        currentMerchant: { isFreeBudgetMerchant },
      },
    } = this.initialData;
    return isFreeBudgetMerchant;
  }

  @computed
  get budgetAvailable():
    | BoostProductsMerchantSpending["budgetAvailable"]
    | undefined {
    const {
      initialData: {
        marketing: { currentMerchant: marketingProperty },
      },
    } = this;
    return marketingProperty?.spending.budgetAvailable;
  }

  @computed
  get dailyMinBudget(): number {
    const {
      initialData: {
        marketing: { currentMerchant: marketingProperty },
      },
    } = this;
    return marketingProperty?.dailyMinBudget.amount ?? 0;
  }

  @computed
  get totalBudget(): number {
    const { productBudgetById } = this;
    return _.sum(Array.from(productBudgetById.values()));
  }

  @computed
  get isBeyondAvailableBudget(): boolean {
    const { totalBudget, budgetAvailable } = this;
    const availableBudget = budgetAvailable?.amount ?? 0;
    return totalBudget > availableBudget;
  }

  @computed
  get currencyCode(): PaymentCurrencyCode {
    const {
      currentMerchant: { primaryCurrency },
      marketing: { currentMerchant: marketingProperty },
    } = this.initialData;
    return !marketingProperty?.allowLocalizedCurrency ? "USD" : primaryCurrency;
  }

  getProductBudget(productId: string): number {
    return this.productBudgetById.get(productId) || 0;
  }

  setProductBudget(productId: string, value: number) {
    this.productBudgetById.set(productId, Math.max(value, 0));
  }

  @computed
  get budgetErrorMessage(): string | undefined {
    const {
      totalBudget,
      currencyCode,
      dailyMinBudget,
      selectedProducts,
      budgetAvailable,
      isBeyondAvailableBudget,
    } = this;
    if (totalBudget == 0) {
      return i`Please set a daily boost budget on the products you selected`;
    }

    for (const {
      product: { id },
    } of selectedProducts) {
      const budget = this.getProductBudget(id);
      if (budget < dailyMinBudget) {
        return i`On all your products, please set a daily boost budget of at least ${formatCurrency(
          dailyMinBudget,
          currencyCode,
        )}`;
      }
    }

    if (budgetAvailable == null) {
      const walletLink = "/plus/marketing/wallet";
      return i`Please load your [marketing wallet](${walletLink}) to begin boosting products.`;
    }

    if (isBeyondAvailableBudget) {
      return i`Cannot exceed total available budget of ${budgetAvailable.display}`;
    }
  }

  @computed
  get productSelectionErrorMessage(): string | undefined {
    const { selectedProducts } = this;
    if (selectedProducts.length == 0) {
      return i`Please select some products to boost`;
    }
  }

  @computed
  get errorMessage(): string | undefined {
    const { productSelectionErrorMessage, budgetErrorMessage } = this;
    return productSelectionErrorMessage || budgetErrorMessage;
  }

  @computed
  get hasBudgetError(): boolean {
    const { budgetErrorMessage, forceValidation } = this;
    return forceValidation && budgetErrorMessage != null;
  }

  @computed
  get hasProductSelectionError(): boolean {
    const { productSelectionErrorMessage, forceValidation } = this;
    return forceValidation && productSelectionErrorMessage != null;
  }

  @computed
  private get asInput(): ProductPromotionsInput {
    const { selectedProducts, currencyCode } = this;
    let inputs: ReadonlyArray<ProductPromotionInput> = [];
    for (const {
      product: { id: productId },
    } of selectedProducts) {
      const budget = this.getProductBudget(productId);
      inputs = [
        ...inputs,
        {
          productId,
          budget: {
            amount: budget,
            currencyCode,
          },
          intenseBoost: null,
        },
      ];
    }
    return { productBudgetInfo: inputs };
  }

  @action
  async submit() {
    const { errorMessage, asInput: input, selectedProducts } = this;
    const toastStore = ToastStore.instance();
    const navigationStore = NavigationStore.instance();
    this.forceValidation = true;
    if (errorMessage != null) {
      toastStore.error(errorMessage);
      return;
    }

    this.isSubmitting = true;
    type ResponseType = {
      readonly marketing: {
        readonly upsertProductPromotions: Pick<
          UpsertProductPromotions,
          "ok" | "message"
        >;
      };
    };

    const { client } = ApolloStore.instance();
    const { data } = await client.mutate<
      ResponseType,
      MarketingServiceMutationsUpsertProductPromotionsArgs
    >({
      mutation: UPSERT_PROMOTIONS_MUTATION,
      variables: { input },
    });
    this.isSubmitting = false;

    const ok = data?.marketing?.upsertProductPromotions?.ok;
    const message = data?.marketing?.upsertProductPromotions?.message;
    if (!ok) {
      toastStore.negative(message || i`Something went wrong`);
      return;
    }

    navigationStore.releaseNavigationLock();
    await navigationStore.navigate("/plus/marketing/boost");
    const [firstProduct] = selectedProducts;
    toastStore.positive(
      selectedProducts.length == 1
        ? i`You've boosted "${firstProduct.product.name}"!`
        : i`You've boosted ${selectedProducts.length} products!`,
      {
        timeoutMs: 7000,
      },
    );
  }
}
