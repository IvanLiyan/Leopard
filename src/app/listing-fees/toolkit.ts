import { observable, action } from "mobx";
import { gql } from "@gql";
import {
  MerchantListingFeeHub,
  CurrentCycleListingFeeDetailsSchema,
  LatestListingFeeDetailsSchema,
  PredictedListingFeeDetailSchema,
  WssMerchantLevelType,
  CurrencyValue,
  Scalars,
} from "@schema";

export const MERCHANT_LISTING_FEE_DATA = gql(`
query MerchantListingFee {
  currentMerchant {
    merchantListingFee {
      feePolicyConfig {
          wssTierLevel
          wssTierName
          freeThreshold
          excessItemUnitPrice{
              amount
              currencyCode
          }
      }
      latestListingFeeDetails{
          latestItems
      }
      currentCycleListingFeeDetails{
        currentBasedWssTierLevel
        currentBasedWssTierName
        currentFreeThreshold
        currentItemsOverThreshold
        currentUnitPrice {
            amount
            currencyCode
        }
        currentFeeToPay{
            amount
            currencyCode
        }
        currentCyclePayTime{
            formatted(fmt: "MM/d/yy")
            __typename
        }
      }
      predictedListingFeeDetails{
        latestWssTierLevel,
        latestWssTierName,
        nextUpdateDate{
            formatted(fmt: "MM/d/yy")
            __typename
        }
        predictedFreeThreshold
      }
    }
  }
 } 
`);

export type MerchantListingFeeResponse = {
  readonly currentMerchant: {
    readonly merchantListingFee: MerchantListingFeeHub;
  };
};

export type FeePolicyConfigType = {
  readonly excessItemUnitPrice: CurrencyValue;
  readonly freeThreshold: Scalars["Int"];
  readonly wssTierLevel: Scalars["Int"];
  readonly wssTierName: WssMerchantLevelType;
};

class Store {
  readonly storeName = "merchant-listing-fees-store";

  @observable
  currentCycleListingFeeDetails:
    | CurrentCycleListingFeeDetailsSchema
    | null
    | undefined;

  @observable
  feePolicyConfig: ReadonlyArray<FeePolicyConfigType> = [];

  @observable
  latestListingFeeDetails: LatestListingFeeDetailsSchema | null | undefined;

  @observable
  predictedListingFeeDetails:
    | PredictedListingFeeDetailSchema
    | null
    | undefined;

  @action
  updateListingFeesData(data: MerchantListingFeeResponse) {
    const merchantListingFee = data?.currentMerchant?.merchantListingFee;
    if (merchantListingFee != null) {
      this.currentCycleListingFeeDetails =
        merchantListingFee.currentCycleListingFeeDetails;
      this.latestListingFeeDetails = merchantListingFee.latestListingFeeDetails;
      this.predictedListingFeeDetails =
        merchantListingFee.predictedListingFeeDetails;
    }
  }

  @action
  levelText(levelNumber?: number) {
    let level: WssMerchantLevelType | null = "UNASSESSED";
    if (levelNumber != null && levelNumber > 0) {
      switch (levelNumber) {
        case 1:
          level = "UNASSESSED";
          break;
        case 2:
          level = "BAN";
          break;
        case 3:
          level = "BRONZE";
          break;
        case 4:
          level = "SILVER";
          break;
        case 5:
          level = "GOLD";
          break;
        case 6:
          level = "PLATINUM";
          break;
        default:
          level = "UNASSESSED";
          break;
      }
    }
    return level;
  }

  @action
  feeCalculationData(data: MerchantListingFeeResponse) {
    const merchantListingFee = data?.currentMerchant?.merchantListingFee;
    if (merchantListingFee == null) return null;
    const feePolicyConfigData = Array.from(merchantListingFee.feePolicyConfig);
    if (feePolicyConfigData.length > 0) {
      const feeCalculationData = feePolicyConfigData.filter((item) => {
        return item.wssTierLevel >= 3;
      });
      this.feePolicyConfig = feeCalculationData.map((item) => {
        const { freeThreshold, wssTierLevel, excessItemUnitPrice } = item;
        return {
          wssTierName: item.wssTierName.toUpperCase() as WssMerchantLevelType,
          excessItemUnitPrice,
          freeThreshold,
          wssTierLevel,
        };
      });
      return null;
    }
  }
}

export default new Store();
