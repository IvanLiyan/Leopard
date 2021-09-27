/* External Libraries */
import { observable } from "mobx";

export default class Product {
  id: string; // product ID
  // used to differentiate products in a campaign
  // (potentially with the same product ID)
  uniqId: number | null | undefined;

  @observable
  name: string | null | undefined;

  @observable
  parentSku: string | null | undefined;

  @observable
  keywords: string | null | undefined;

  @observable
  isMaxboost: boolean | null | undefined;

  @observable
  brandId: string | null | undefined;

  @observable
  trending: boolean | null | undefined;

  @observable
  eligibleForCampaign: boolean | null | undefined;

  @observable
  hasVideo: boolean | null | undefined;

  constructor(params: {
    id: string;
    keywords?: string | null | undefined;
    bid?: string | null | undefined;
    isMaxboost?: boolean | null | undefined;
    uniqId?: number | null | undefined;
    name?: string | null | undefined;
    parentSku?: string | null | undefined;
    brandId?: string | null | undefined;
    trending?: boolean;
    eligibleForCampaign?: boolean;
    hasVideo?: boolean;
  }) {
    this.id = params.id;
    this.keywords = params.keywords;
    this.isMaxboost = params.isMaxboost;
    this.uniqId = params.uniqId;
    this.name = params.name;
    this.parentSku = params.parentSku;
    this.brandId = params.brandId;
    this.trending = params.trending;
    this.eligibleForCampaign = params.eligibleForCampaign;
    this.hasVideo = params.hasVideo;
  }

  toJson() {
    return {
      product_id: this.id,
      keywords: (this.keywords || "")
        .split(",")
        .filter((k) => k.length)
        .join(","),
      is_maxboost: this.isMaxboost,
      brand_id: this.brandId,
      trending: this.trending,
      eligible_for_campaign: this.eligibleForCampaign,
    };
  }
}
