//
//  stores/PromotionStore.tsx
//  Project-Lego
//
//  Created by Hunter Li on 02/11/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable local-rules/no-pageParams */
// Lego toolkit
import * as illustrations from "@assets/illustrations";

/* Merchant Model */
import { ReferralDetails } from "@merchant/model/RevShareState";

export default class PromotionStore {
  discountedRevShare: number | undefined;

  defaultRevShare: number | undefined;

  durationDays: number | undefined;

  launchTimestamp: number | undefined;

  nonErpReferral: {
    [key: string]: ReferralDetails;
  } = {};

  constructor() {
    const promoParams = (window as any).pageParams.promotion_params;
    if (!promoParams) {
      return;
    }
    this.discountedRevShare = promoParams.rev_share_rate.discount || -1;
    this.defaultRevShare = promoParams.rev_share_rate.default || -1;
    this.durationDays = promoParams.duration || -1;
    this.launchTimestamp = promoParams.program_launch_time || 1;
    this.nonErpReferral = {
      paypal: {
        name: "PayPal",
        logoSource: illustrations.paypal,
      },
    };
  }

  static instance(): PromotionStore {
    let { promoStore } = window as any;
    if (promoStore == null) {
      promoStore = new PromotionStore();
      (window as any).promoStore = promoStore;
    }
    return promoStore;
  }
}

export const usePromotionStore = (): PromotionStore => {
  return PromotionStore.instance();
};
