import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Type Imports */
import {
  MarketingCampaignPropertySchema,
  MarketingMerchantPropertySchema,
  Datetime,
  CurrencyValue,
  CampaignSchema,
  CampaignProductSchema,
  ScheduledAddBudgetSchema,
  FlexibleBudgetSchema,
  MerchantSchema,
  MarketingSpendingBreakdown,
  Maybe,
  MarketingServiceSchema,
  MarketingServiceSchemaPromotableProductsArgs,
  PromotableProduct,
  ProductSchema,
  ProductBoostAcceptTos,
  BonusBudgetSchema,
  RefundAssuranceConstants,
} from "@schema/types";

/* Merchant Store */
import ApolloStore from "@stores/ApolloStore";

/* ProductBoost Campaign & Merchant Property Query */
export interface ProductBoostPropertyType {
  readonly campaignProperty: Pick<
    MarketingCampaignPropertySchema,
    | "maxCampaignNameLength"
    | "maxKeywords"
    | "flexibleBudgetSuggestedBudgetFactor"
    | "maxNumWeeks"
    | "maxKeywordLen"
    | "learningStatusThreshold"
    | "dailyBudgetCampaignLimit"
    | "campaignLockDays"
  > & {
    readonly minStartDate: Pick<Datetime, "unix">;
    readonly maxStartDate: Pick<Datetime, "unix">;
    readonly minBid: Pick<CurrencyValue, "amount">;
    readonly maxBid: Pick<CurrencyValue, "amount">;
  };
}

export type PickedCampaignProductSchema = Pick<
  CampaignProductSchema,
  "productId" | "keywords" | "isMaxboost" | "brandId"
>;

export type RefundAssurancePromo = Pick<
  RefundAssuranceConstants,
  "enabled" | "guaranteedRefundRate"
>;

export type ProductBoostCampaignSchema = Pick<
  CampaignSchema,
  | "id"
  | "name"
  | "isEvergreen"
  | "intenseBoost"
  | "merchantId"
  | "localizedCurrency"
  | "state"
> & {
  readonly endDate: Pick<Datetime, "formatted">;
  readonly startDate: Pick<Datetime, "formatted">;
  readonly products: ReadonlyArray<PickedCampaignProductSchema>;
  readonly scheduledAddBudget: Pick<
    ScheduledAddBudgetSchema,
    "days" | "enabled"
  > & {
    readonly amount: Pick<CurrencyValue, "amount">;
  };
  readonly maxBudget: Pick<CurrencyValue, "amount">;
  readonly merchantBudget: Pick<CurrencyValue, "amount">;
  readonly flexibleBudget: Pick<FlexibleBudgetSchema, "enabled" | "type">;
  readonly bonusBudget: Pick<
    BonusBudgetSchema,
    | "isBonusBudgetCampaign"
    | "bonusBudgetRate"
    | "bonusBudgetType"
    | "eligibleBonusBudgetType"
  > & {
    readonly bonusBudget: Pick<CurrencyValue, "amount">;
    readonly usedBonusBudget: Pick<CurrencyValue, "amount">;
  };
};

type ProductBoostPropertyResponseType = {
  readonly marketing: ProductBoostPropertyType;
};

const PB_PROPERTY_QUERY = gql`
  query PBPropertyQuery {
    marketing {
      campaignProperty {
        minStartDate {
          unix
        }
        maxStartDate {
          unix
        }
        maxCampaignNameLength
        minKeywords
        maxKeywords
        flexibleBudgetSuggestedBudgetFactor
        maxNumWeeks
        minBid {
          amount
        }
        maxBid {
          amount
        }
        maxKeywordLen
        maxProducts
        learningStatusThreshold
        dailyBudgetCampaignLimit
        campaignLockDays
      }
    }
  }
`;

export const useProductBoostProperty = ():
  | ProductBoostPropertyType
  | undefined => {
  const { data } = useQuery<ProductBoostPropertyResponseType, void>(
    PB_PROPERTY_QUERY,
  );
  return data?.marketing;
};

export const ProductBoostPropertyContext =
  React.createContext<ProductBoostPropertyType>(undefined!);
// Bypass check here and force unwrap, as the context will be loaded upon container start
// eslint-disable-next-line local-rules/ts-no-force-unrwap

export const ProductBoostPropertyProvider = ({
  pbContext,
  children,
}: {
  readonly pbContext: ProductBoostPropertyType;
  readonly children: React.ReactNode;
}) => {
  return (
    <ProductBoostPropertyContext.Provider value={pbContext}>
      {children}
    </ProductBoostPropertyContext.Provider>
  );
};

/* ProductBoost FlexibleBudget Info Query */
type FlexibleBudgetResponseType = {
  readonly marketing: {
    readonly currentMerchant: Pick<
      MarketingMerchantPropertySchema,
      "defaultFlexibleBudgetType"
    >;
  };
  readonly currentUser: {
    readonly gating: {
      readonly allowFlexibleBudgetV2: boolean;
      readonly allowFlexibleBudgetSuggestBudget: boolean;
    };
  };
};

export const PB_FLEXIBLE_BUDGET_INFO_QUERY = gql`
  query PBFlexibleBudgetInfoQuery {
    marketing {
      currentMerchant {
        defaultFlexibleBudgetType
      }
    }
    currentUser {
      gating {
        allowFlexibleBudgetV2: isAllowed(name: "flexible_budget_v2")
        allowFlexibleBudgetSuggestBudget: isAllowed(
          name: "flexible_budget_suggest_budget"
        )
      }
    }
  }
`;

export const useProductBoostFlexibleBudgetInfo = ():
  | FlexibleBudgetResponseType
  | undefined => {
  const { data } = useQuery<FlexibleBudgetResponseType, void>(
    PB_FLEXIBLE_BUDGET_INFO_QUERY,
  );
  return data;
};

export const queryFlexibleBudgetInfo =
  async (): Promise<FlexibleBudgetResponseType> => {
    const { client } = ApolloStore.instance();
    const { data } = await client.query<FlexibleBudgetResponseType, void>({
      query: PB_FLEXIBLE_BUDGET_INFO_QUERY,
    });
    return data;
  };

/* ProductBoost Merchant Info Query */
type MerchantInfoResponseType = {
  readonly currentMerchant: Pick<MerchantSchema, "primaryCurrency">;
  readonly marketing: {
    readonly currentMerchant: Pick<
      MarketingMerchantPropertySchema,
      | "showCredits"
      | "wishSubsidyDiscountFactor"
      | "allowMaxboost"
      | "hasAutomatedCampaign"
      | "dailyBudgetEnabled"
      | "allowLocalizedCurrency"
    > & {
      readonly minSpendPerProduct: Pick<CurrencyValue, "amount">;
      readonly minBudgetToAdd: Pick<CurrencyValue, "amount">;
      readonly maxBudgetToAdd: Pick<CurrencyValue, "amount">;
      readonly dailyMinBudget: Pick<CurrencyValue, "amount">;
    };
  };
};

export const PB_MERCHANT_INFO_QUERY = gql`
  query PBCurrencyInfoQuery {
    currentMerchant {
      primaryCurrency
    }
    marketing {
      currentMerchant {
        allowLocalizedCurrency
        minBudgetToAdd {
          amount
        }
        maxBudgetToAdd {
          amount
        }
        minSpendPerProduct {
          amount
        }
        dailyMinBudget {
          amount
        }
        showCredits
        wishSubsidyDiscountFactor
        hasAutomatedCampaign
        dailyBudgetEnabled
        allowMaxboost
      }
    }
  }
`;

export const useProductBoostMerchantInfo = ():
  | MerchantInfoResponseType
  | undefined => {
  const { data } = useQuery<MerchantInfoResponseType, void>(
    PB_MERCHANT_INFO_QUERY,
  );
  return data;
};

/* ProductBoost Merchant Spending Stats Query*/
type MarketingSpendingBreakdownResponseType = {
  readonly currentMerchant: Pick<MerchantSchema, "isPayable">;
  readonly marketing: {
    readonly currentMerchant: {
      readonly spending: Pick<
        MarketingSpendingBreakdown,
        "promotionLoanDescription"
      > & {
        readonly accountBalance: Pick<CurrencyValue, "amount">;
        readonly promotionLoan: Pick<CurrencyValue, "amount">;
        readonly budgetAvailable: Pick<CurrencyValue, "amount">;
        readonly promotionCredit: Pick<CurrencyValue, "amount">;
        readonly promotionBalance: Pick<CurrencyValue, "amount">;
        readonly pending: Pick<CurrencyValue, "amount">;
      };
    };
  };
};

export const PB_MARKETING_SPENDING_BREAKDOWN_QUERY = gql`
  query PBMarketingSpendingBreakdownQuery {
    currentMerchant {
      isPayable
    }
    marketing {
      currentMerchant {
        spending {
          accountBalance {
            amount
          }
          promotionLoan {
            amount
          }
          budgetAvailable {
            amount
          }
          promotionBalance {
            amount
          }
          promotionCredit {
            amount
          }
          pending {
            amount
          }
          promotionLoanDescription
        }
      }
    }
  }
`;

export const useProductBoostMarketingSpendingBreakdown = ():
  | MarketingSpendingBreakdownResponseType
  | undefined => {
  const { data } = useQuery<MarketingSpendingBreakdownResponseType, void>(
    PB_MARKETING_SPENDING_BREAKDOWN_QUERY,
  );
  return data;
};

/* ProductBoost Get Promotable Product Query */
export type GetPromotableProductResponseType = {
  readonly marketing: Maybe<
    Pick<MarketingServiceSchema, "promotableProductsCount"> & {
      readonly promotableProducts: ReadonlyArray<
        Pick<PromotableProduct, "isInTrendingCategory"> & {
          readonly product: Pick<
            ProductSchema,
            "id" | "name" | "sku" | "wishes" | "sales" | "requestedBrandId"
          >;
        }
      >;
    }
  >;
};

export type GetPromotableProductRequestType = Pick<
  MarketingServiceSchemaPromotableProductsArgs,
  "query" | "searchType" | "offset" | "limit" | "wishExpressOnly"
>;

export const PB_GET_PROMOTABLE_PRODUCT_QUERY = gql`
  query PBPromotableProductQuery(
    $query: String
    $searchType: ProductPromotionSearchType
    $offset: Int
    $limit: Int
    $wishExpressOnly: Boolean
  ) {
    marketing {
      promotableProducts(
        query: $query
        searchType: $searchType
        offset: $offset
        limit: $limit
        wishExpressOnly: $wishExpressOnly
      ) {
        product {
          id
          name
          sku
          wishes
          sales
          requestedBrandId
        }
        isInTrendingCategory
      }
      promotableProductsCount(
        query: $query
        searchType: $searchType
        wishExpressOnly: $wishExpressOnly
      )
    }
  }
`;

/* ProductBoost accept TOS query */
export type PBAcceptTOSResponseType = {
  readonly marketing: {
    readonly acceptTos: Pick<ProductBoostAcceptTos, "ok" | "message">;
  };
};

export const PB_ACCEPT_TOS_MUTATION = gql`
  mutation PBAcceptTOSQuery($input: ProductBoostAcceptTOSInput!) {
    marketing {
      acceptTos(input: $input) {
        ok
        message
      }
    }
  }
`;
