//
//  stores/UserStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable local-rules/no-pageParams */
import { computed } from "mobx";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";
import { CountryCode } from "@toolkit/countries";

/* Merchant API */
import { MerchantUser } from "@merchant/api/authentication";

type RecentSu = {
  readonly id: string;
  readonly display_name: string;
  readonly is_merchant: boolean;
};

export default class UserStore {
  isSu: boolean;
  su: Readonly<MerchantUser> | null | undefined;
  loggedInMerchantUser: Readonly<MerchantUser>;
  merchantSourceCurrency: CurrencyCode | null | undefined;
  recentSu: ReadonlyArray<RecentSu>;
  isPlusUser: boolean;
  isCostBased: boolean;
  countryCodeByIp: CountryCode | null | undefined;
  isStoreUser: boolean;

  constructor() {
    this.su = (window as any).pageParams.su;
    this.isSu = (window as any).pageParams.is_super_user;
    this.recentSu = (window as any).pageParams.recent_su || [];
    this.loggedInMerchantUser = (window as any).pageParams.merchant_user;
    this.merchantSourceCurrency = (window as any).pageParams.merchant_source_currency;
    this.isPlusUser = !!(window as any).pageParams.is_plus_user;
    this.isStoreUser = !!this.loggedInMerchantUser?.is_store_merchant;
    this.isCostBased = (window as any).pageParams.is_cost_based;
    this.countryCodeByIp = (window as any).pageParams.country_code_by_ip;
  }

  @computed
  get isLoggedIn(): boolean {
    return this.loggedInMerchantUser != null;
  }

  @computed
  get isSuAdmin(): boolean {
    return this.isSu && this.su?.is_admin == true;
  }

  @computed
  get isMerchant(): boolean {
    return (
      this.loggedInMerchantUser?.is_merchant == true ||
      this.loggedInMerchantUser?.is_new_merchant_lead
    );
  }

  @computed
  get merchantId(): string | null | undefined {
    const { merchant_id: merchantId } = this.loggedInMerchantUser;
    if (!merchantId || merchantId.trim().length == 0) {
      return null;
    }
    return merchantId;
  }

  @computed
  get isDisabledMerchant(): boolean {
    return this.loggedInMerchantUser?.merchant_state_name == "DISABLED";
  }

  static instance(): UserStore {
    let { userStore } = window as any;
    if (userStore == null) {
      userStore = new UserStore();
      (window as any).userStore = userStore;
    }
    return userStore;
  }
}

export const useUserStore = (): UserStore => {
  return UserStore.instance();
};

export const useLoggedInUser = (): Readonly<MerchantUser> => {
  const { loggedInMerchantUser } = useUserStore();
  return loggedInMerchantUser;
};
