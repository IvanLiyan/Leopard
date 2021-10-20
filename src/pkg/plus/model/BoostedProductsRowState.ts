import gql from "graphql-tag";
import { observable } from "mobx";
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import { BoostedProductType } from "@toolkit/marketing/boosted-products";

import {
  PaymentCurrencyCode,
  UpsertProductPromotions,
  MarketingServiceMutationsUpsertProductPromotionsArgs,
} from "@schema/types";

const TOGGLE_PROMOTION_SWITCH = gql`
  mutation EnabledSwitch_TogglePromotionSwitch(
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

type TogglePromotionSwitchResponse = {
  readonly marketing: {
    readonly upsertProductPromotions: Pick<
      UpsertProductPromotions,
      "ok" | "message"
    >;
  };
};

const UPDATE_PRODUCT_BUDGET = gql`
  mutation ProductBudgetInput_UpdateProductBudget(
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

type UpdateBudgetMutationResponse = {
  readonly marketing: {
    readonly upsertProductPromotions: Pick<
      UpsertProductPromotions,
      "ok" | "message"
    >;
  };
};

export default class BoostedProductsRowState {
  @observable
  isActive: boolean;

  @observable
  isSaving: boolean = false;

  initialData: BoostedProductType;

  constructor({ initialData }: { readonly initialData: BoostedProductType }) {
    this.initialData = initialData;
    this.isActive = initialData.promotionStatus == "ACTIVE";
  }

  get id(): BoostedProductType["product"]["id"] {
    return this.product.id;
  }

  get product(): BoostedProductType["product"] {
    return this.initialData.product;
  }

  get isRemoved(): BoostedProductType["product"]["isRemoved"] {
    return this.product.isRemoved;
  }

  async updateBudget(newBudget: number) {
    const {
      initialData: { dailyPromotionBudget },
      id: productId,
    } = this;
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    this.isSaving = true;
    const { data } = await client.mutate<
      UpdateBudgetMutationResponse,
      MarketingServiceMutationsUpsertProductPromotionsArgs
    >({
      mutation: UPDATE_PRODUCT_BUDGET,
      variables: {
        input: {
          productBudgetInfo: [
            {
              productId,
              budget: {
                amount: newBudget,
                currencyCode:
                  dailyPromotionBudget.currencyCode as PaymentCurrencyCode,
              },
              intenseBoost: null,
            },
          ],
        },
      },
    });
    this.isSaving = false;
    const ok = data?.marketing.upsertProductPromotions.ok;
    const errorMessage = data?.marketing.upsertProductPromotions.message;
    if (!ok) {
      toastStore.error(errorMessage || i`Something went wrong`);
      return;
    }

    this.isActive = true;
    toastStore.info(i`Budget has been updated`);
  }

  async toggleIsActive(isActive: boolean) {
    const {
      initialData: { dailyPromotionBudget },
      id: productId,
    } = this;
    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();
    this.isSaving = true;
    const { data } = await client.mutate<
      TogglePromotionSwitchResponse,
      MarketingServiceMutationsUpsertProductPromotionsArgs
    >({
      mutation: TOGGLE_PROMOTION_SWITCH,
      variables: {
        input: {
          productBudgetInfo: [
            {
              productId,
              budget: {
                amount: isActive ? dailyPromotionBudget.amount : 0,
                currencyCode:
                  dailyPromotionBudget.currencyCode as PaymentCurrencyCode,
              },
              intenseBoost: null,
            },
          ],
        },
      },
    });
    this.isSaving = false;

    const ok = data?.marketing.upsertProductPromotions.ok;
    const errorMessage = data?.marketing.upsertProductPromotions.message;
    if (!ok) {
      toastStore.error(errorMessage || i`Something went wrong`);
      return;
    }

    this.isActive = isActive;

    toastStore.positive(
      isActive
        ? i`Your product is boosted successfully.`
        : i`Your product is no longer boosted.`,
      {
        timeoutMs: 5000,
      },
    );
  }
}
