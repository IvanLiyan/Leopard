//
//  stores/WishExpressStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 4/29/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { computed } from "mobx";

/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Merchant API */
import * as wishExpressApi from "@merchant/api/wish-express";
import {
  CountryBan,
  WishExpressState,
  WishExpressApplication,
} from "@merchant/api/wish-express";

export default class WishExpressStore {
  @computed
  get statusRequest() {
    return wishExpressApi.getStatus();
  }

  @computed
  get activeBans():
    | {
        [countryCode: string]: CountryBan;
      }
    | undefined {
    return this.statusRequest.response?.data?.active_bans;
  }

  @computed
  get expressState(): WishExpressState | undefined {
    return this.statusRequest.response?.data?.wish_express_state;
  }

  @computed
  get recentApplication(): WishExpressApplication | undefined {
    return this.statusRequest.response?.data?.most_recent_application;
  }

  @computed
  get recentlyApprovedCountries(): ReadonlyArray<CountryCode> | undefined {
    return this.recentApplication?.approved_countries;
  }

  @computed
  get eligibleApplicationCountries(): ReadonlyArray<CountryCode> | undefined {
    return this.statusRequest.response?.data?.we_eligible_application_countries;
  }

  @computed
  get isApprovedForWishExpress(): boolean {
    return this.expressState === "APPROVED";
  }

  static instance(): WishExpressStore {
    let { wishExpressStore } = window as any;
    if (wishExpressStore == null) {
      wishExpressStore = new WishExpressStore();
      (window as any).wishExpressStore = wishExpressStore;
    }
    return wishExpressStore;
  }
}

export const useWishExpressStore = (): WishExpressStore => {
  return WishExpressStore.instance();
};
