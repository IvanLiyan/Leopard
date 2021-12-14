//
//  stores/UserStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

import { createContext, useContext } from "react";
import { computed } from "mobx";
import { gql } from "@apollo/client";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";
import { CountryCode } from "@toolkit/countries";

/* Merchant API */
import { MerchantUser } from "@merchant/api/authentication";

export type RecentSu = {
  readonly id: string;
  readonly display_name: string;
  readonly is_merchant: boolean;
};

type UserStoreArgs = {
  readonly countryCodeByIp: CountryCode | null | undefined;
  readonly isCostBased: boolean;
  readonly isPlusUser: boolean;
  readonly isSu: boolean;
  readonly loggedInMerchantUser: Readonly<MerchantUser> | null | undefined;
  readonly merchantSourceCurrency: CurrencyCode | null | undefined;
  readonly recentSu: ReadonlyArray<RecentSu>;
  readonly su: Readonly<MerchantUser> | null | undefined;
};

export default class UserStore {
  countryCodeByIp: CountryCode | null | undefined;
  isCostBased: boolean;
  isPlusUser: boolean;
  isSu: boolean;
  loggedInMerchantUser: Readonly<MerchantUser> | null | undefined;
  merchantSourceCurrency: CurrencyCode | null | undefined;
  recentSu: ReadonlyArray<RecentSu>;
  su: Readonly<MerchantUser> | null | undefined;

  constructor({
    countryCodeByIp,
    isCostBased,
    isPlusUser,
    isSu,
    loggedInMerchantUser,
    merchantSourceCurrency,
    recentSu,
    su,
  }: UserStoreArgs) {
    this.countryCodeByIp = countryCodeByIp;
    this.isCostBased = isCostBased;
    this.isPlusUser = isPlusUser;
    this.isSu = isSu;
    this.loggedInMerchantUser = loggedInMerchantUser;
    this.merchantSourceCurrency = merchantSourceCurrency;
    this.recentSu = recentSu;
    this.su = su;
  }

  @computed
  get isStoreUser(): boolean {
    return !!this.loggedInMerchantUser?.is_store_merchant;
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
      this.loggedInMerchantUser?.is_new_merchant_lead == true
    );
  }

  @computed
  get merchantId(): string | null | undefined {
    const { merchant_id: merchantId } = this.loggedInMerchantUser || {
      merchant_id: null,
    };
    if (!merchantId || merchantId.trim().length == 0) {
      return null;
    }
    return merchantId;
  }

  @computed
  get isDisabledMerchant(): boolean {
    return this.loggedInMerchantUser?.merchant_state_name == "DISABLED";
  }
}

export const useUserStore = (): UserStore => {
  return useContext(UserStoreContext);
};

export const useLoggedInUser = ():
  | Readonly<MerchantUser>
  | null
  | undefined => {
  const { loggedInMerchantUser } = useUserStore();
  return loggedInMerchantUser;
};

export const USER_STORE_INITIAL_QUERY = gql`
  query UserStore_InitialQuery {
    currentMerchant {
      countryCodeByIp
      isCostBased
      isPlusUser
      isSu
      loggedInMerchantUser
      merchantSourceCurrency
      recentSu
      su
    }
  }
`;

// TODO [lliepert]: bad typing, redo once query is real
export type UserStoreInitialQueryResponse = UserStoreArgs;

export const defaultUserStoreArgs = {
  countryCodeByIp: null,
  isCostBased: false,
  isPlusUser: false,
  isSu: false,
  loggedInMerchantUser: null,
  merchantSourceCurrency: null,
  recentSu: [],
  su: null,
};

export const UserStoreContext = createContext(
  new UserStore(defaultUserStoreArgs),
);
