/*
 * ViewCampaignState.ts
 *
 * Created by Jonah Dlin on Thu Feb 03 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import { observable, computed, action } from "mobx";
import {
  PickedCampaignPerfomance,
  isCampaignCancellable,
  isCampaignEditable,
  GET_CAMPAIGN_QUERY,
  GetCampaignResponse,
  GetCampaignRequest,
  PickedMfpConstantsPerformance,
  isCampaignRestartable,
} from "@toolkit/mfp/performance";
import {
  CancelCampaignRequest,
  CancelCampaignResponse,
  CANCEL_CAMPAIGN_MUTATION,
} from "@toolkit/mfp/dashboard";
import {
  MfpCampaignCancelReason,
  VariationDiscountDataInput,
} from "@schema/types";
import ToastStore from "@stores/ToastStore";
import ApolloStore from "@stores/ApolloStore";
import {
  UpsertFlashSaleCampaignRequestType,
  UpsertFlashSaleCampaignResponseType,
  UPSERT_FLASH_SALE_CAMPAIGN_MUTATION,
} from "@toolkit/mfp/flash-sale/upsert-campaign";
import {
  UpsertDiscountCampaignRequestType,
  UpsertDiscountCampaignResponseType,
  UPSERT_DISCOUNT_CAMPAIGN_MUTATION,
} from "@toolkit/mfp/discount/upsert-campaign";

export default class ViewCampaignState {
  @observable
  campaign: PickedCampaignPerfomance;

  @observable
  minDiscountPercentage: number;

  @observable
  maxDiscountPercentage: number;

  @observable
  constants: PickedMfpConstantsPerformance;

  @observable
  private newDiscounts: Map<string, Map<string, number | null>> = new Map();

  constructor({
    campaign,
    mfpConstants,
  }: {
    readonly campaign: PickedCampaignPerfomance;
    readonly mfpConstants: PickedMfpConstantsPerformance;
  }) {
    this.campaign = campaign;
    this.constants = mfpConstants;
    if (campaign.promotionType == "FLASH_SALE") {
      this.minDiscountPercentage =
        mfpConstants.mfp?.flashSaleCampaign?.minDiscountPercentage || 0;
      this.maxDiscountPercentage =
        mfpConstants.mfp?.flashSaleCampaign?.maxDiscountPercentage || 100;
    } else if (campaign.promotionType == "PRICE_DISCOUNT") {
      this.minDiscountPercentage =
        mfpConstants.mfp?.discountCampaign?.minDiscountPercentage || 0;
      this.maxDiscountPercentage =
        mfpConstants.mfp?.discountCampaign?.maxDiscountPercentage || 100;
    } else {
      this.minDiscountPercentage = 0;
      this.maxDiscountPercentage = 100;
    }
  }

  @computed
  get canCancel(): boolean {
    return isCampaignCancellable(this.campaign);
  }

  @computed
  get canRestart(): boolean {
    return isCampaignRestartable(this.campaign);
  }

  @computed
  get canEdit(): boolean {
    return isCampaignEditable(this.campaign);
  }

  @computed
  get hasEditError(): boolean {
    const { campaign, getDiscount } = this;
    if (campaign.promotionType == "FLASH_SALE") {
      return (
        campaign.flashSaleDetails != null &&
        campaign.flashSaleDetails.some(
          ({
            discountPercentage: oldDiscount,
            variation: { id: variationId, productId },
          }) => {
            const newDiscount = getDiscount({ productId, variationId });
            // undefined means never set, null means set to empty
            if (newDiscount === undefined) {
              return false;
            }
            return (
              newDiscount == null ||
              newDiscount < this.minDiscountPercentage ||
              newDiscount > this.maxDiscountPercentage ||
              newDiscount < oldDiscount
            );
          }
        )
      );
    }

    if (campaign.promotionType == "PRICE_DISCOUNT") {
      return (
        campaign.discountDetails != null &&
        campaign.discountDetails.some(
          ({
            discountPercentage: oldDiscount,
            variation: { id: variationId, productId },
          }) => {
            const newDiscount = getDiscount({ productId, variationId });
            // undefined means never set, null means set to empty
            if (newDiscount === undefined) {
              return false;
            }
            return (
              newDiscount === null ||
              newDiscount < this.minDiscountPercentage ||
              newDiscount > this.maxDiscountPercentage ||
              newDiscount < oldDiscount
            );
          }
        )
      );
    }

    return false;
  }

  getDiscount = ({
    productId,
    variationId,
  }: {
    readonly productId: string;
    readonly variationId: string;
  }): number | null | undefined => {
    const variationMap = this.newDiscounts.get(productId);
    if (variationMap == null) {
      return undefined;
    }

    return variationMap.get(variationId);
  };

  @action
  setDiscount = ({
    productId,
    variationId,
    amount,
  }: {
    readonly productId: string;
    readonly variationId: string;
    readonly amount: number | null;
  }) => {
    const { newDiscounts } = this;

    const existingMap = newDiscounts.get(productId);

    if (existingMap != null) {
      const map = new Map(existingMap);
      map.set(variationId, amount);
      this.newDiscounts.set(productId, map);
      return;
    }

    this.newDiscounts.set(productId, new Map([[variationId, amount]]));
  };

  @action
  refetchCampaign = async () => {
    const {
      campaign: { id, startTime, endTime },
    } = this;

    const { client } = ApolloStore.instance();
    const toastStore = ToastStore.instance();

    const { data: response } = await client.query<
      GetCampaignResponse,
      GetCampaignRequest
    >({
      query: GET_CAMPAIGN_QUERY,
      variables: {
        id,
        performanceStartDate: {
          unix: startTime.unix,
        },
        performanceEndDate: {
          unix: endTime.unix,
        },
      },
      fetchPolicy: "no-cache",
    });

    if (
      response == null ||
      response.mfp == null ||
      response.mfp.campaigns == null ||
      response.mfp.campaigns.length == 0
    ) {
      toastStore.error(i`Something went wrong`);
      return;
    }

    this.newDiscounts = new Map();
    this.campaign = response.mfp.campaigns[0];
  };

  @action
  cancel = async ({
    reason,
    comment,
  }: {
    readonly reason: MfpCampaignCancelReason;
    readonly comment?: string | null;
  }) => {
    const { campaign, refetchCampaign } = this;
    if (campaign == null) {
      return;
    }

    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    const { data: response } = await client.mutate<
      CancelCampaignResponse,
      CancelCampaignRequest
    >({
      mutation: CANCEL_CAMPAIGN_MUTATION,
      variables: {
        input: {
          campaignId: campaign.id,
          cancelReason: reason,
          comment,
        },
      },
    });

    if (response?.mfp == null) {
      toastStore.negative(i`Something went wrong`);
      return;
    }

    if (!response.mfp.cancelMfpCampaign.ok) {
      toastStore.negative(
        response.mfp.cancelMfpCampaign.message || i`Something went wrong`
      );
      return;
    }

    toastStore.positive(i`${campaign.name} has been cancelled`);
    await refetchCampaign();
  };

  @action
  edit = async () => {
    const { campaign, getDiscount, hasEditError, refetchCampaign } = this;

    if (hasEditError) {
      return;
    }

    const toastStore = ToastStore.instance();
    const { client } = ApolloStore.instance();

    if (campaign.promotionType == "FLASH_SALE") {
      const newDiscountData:
        | ReadonlyArray<VariationDiscountDataInput>
        | undefined =
        campaign.flashSaleDetails == null
          ? undefined
          : campaign.flashSaleDetails.map(
              ({
                discountPercentage: oldDiscount,
                maxQuantity,
                variation: { id: variationId, productId },
              }) => {
                const newDiscount = getDiscount({ productId, variationId });

                return {
                  productId,
                  variationId,
                  maxQuantity,
                  discountPercentage:
                    newDiscount == null ||
                    newDiscount < this.minDiscountPercentage ||
                    newDiscount > this.maxDiscountPercentage ||
                    newDiscount < oldDiscount
                      ? oldDiscount
                      : newDiscount,
                };
              }
            );

      const { data: response } = await client.mutate<
        UpsertFlashSaleCampaignResponseType,
        UpsertFlashSaleCampaignRequestType
      >({
        mutation: UPSERT_FLASH_SALE_CAMPAIGN_MUTATION,
        variables: {
          input: {
            id: campaign.id,
            discountData: newDiscountData,
          },
        },
      });

      if (response == null) {
        toastStore.error(i`Something went wrong`);
        return;
      }
      const { ok, message } = response.mfp.upsertFlashSaleCampaign;
      if (ok) {
        toastStore.positive(i`Your promotion has been updated.`);
      } else {
        toastStore.error(message || i`Something went wrong`);
        return;
      }
      await refetchCampaign();
      return;
    }

    if (campaign.promotionType == "PRICE_DISCOUNT") {
      const newDiscountData:
        | ReadonlyArray<VariationDiscountDataInput>
        | undefined =
        campaign.discountDetails == null
          ? undefined
          : campaign.discountDetails.map(
              ({
                discountPercentage: oldDiscount,
                maxQuantity,
                variation: { id: variationId, productId },
              }) => {
                const newDiscount = getDiscount({ productId, variationId });

                return {
                  productId,
                  variationId,
                  maxQuantity,
                  discountPercentage:
                    newDiscount == null ||
                    newDiscount < this.minDiscountPercentage ||
                    newDiscount > this.maxDiscountPercentage ||
                    newDiscount < oldDiscount
                      ? oldDiscount
                      : newDiscount,
                };
              }
            );

      const { data: response } = await client.mutate<
        UpsertDiscountCampaignResponseType,
        UpsertDiscountCampaignRequestType
      >({
        mutation: UPSERT_DISCOUNT_CAMPAIGN_MUTATION,
        variables: {
          input: {
            id: campaign.id,
            discountData: newDiscountData,
          },
        },
      });

      if (response == null) {
        toastStore.error(i`Something went wrong`);
        return;
      }
      const { ok, message } = response.mfp.upsertDiscountCampaign;
      if (ok) {
        toastStore.positive(i`Your promotion has been updated.`);
      } else {
        toastStore.error(message || i`Something went wrong`);
        return;
      }
      await refetchCampaign();
      return;
    }
  };
}
