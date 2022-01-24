//
//  stores/UserStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

import {
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import { computed } from "mobx";
import { gql } from "@apollo/client";

import {
  UserSchema,
  MerchantSchema,
  AddressSchema,
  CountryCode,
  Country,
  PaymentCurrencyCode as CurrencyCode,
} from "@schema/types";

export const USER_STORE_INITIAL_QUERY = gql`
  query UserStore_InitialQuery {
    currentCountry {
      code
    }
    currentMerchant {
      id
      isCostBased
      isStoreMerchant
      isMerchantPlus
      primaryCurrency
      state
    }
    currentUser {
      id
      firstName
      lastName
      email
      phoneNumber
      businessAddress {
        streetAddress1
        streetAddress2
        city
        state
        zipcode
        country {
          name
          code
        }
      }
      companyName
      entityType
      isStoreOrMerchantUser
    }
    su {
      id
      isAdmin
    }
    recentUsers {
      id
      displayName
      name
      isStoreOrMerchantUser
    }
  }
`;

type PickedCurrentMerchant = Pick<
  MerchantSchema,
  | "id"
  | "isCostBased"
  | "isStoreMerchant"
  | "isMerchantPlus"
  | "primaryCurrency"
  | "state"
>;

type PickedBusinessAddress = {
  readonly country: Pick<Country, "name" | "code">;
} & Pick<
  AddressSchema,
  "streetAddress1" | "streetAddress2" | "city" | "state" | "zipcode"
>;

type PickedCurrentUser = {
  readonly businessAddress: PickedBusinessAddress;
} & Pick<
  UserSchema,
  | "id"
  | "firstName"
  | "lastName"
  | "email"
  | "phoneNumber"
  | "companyName"
  | "entityType"
  | "isStoreOrMerchantUser"
>;

type PickedSU = Pick<UserSchema, "id" | "isAdmin">;

type PickedRecentUser = Pick<
  UserSchema,
  "id" | "displayName" | "name" | "isStoreOrMerchantUser"
>;

export type UserStoreInitialQueryResponse = {
  readonly currentCountry?: Pick<Country, "code">;
  readonly currentMerchant?: PickedCurrentMerchant;
  readonly currentUser?: PickedCurrentUser;
  readonly su?: PickedSU;
  readonly recentUsers: ReadonlyArray<PickedRecentUser>;
};

// the difference between a PickedRecentUser and a RecentUser is that we perform
// processing to use name as displayName if displayName does not exist
export type RecentUser = {
  readonly id: string;
  readonly displayName: string;
  readonly isMerchant: boolean;
};

class UserStore {
  countryCodeByIp: CountryCode | null | undefined;
  isCostBased: boolean;
  isPlusUser: boolean;
  isSu: boolean;
  loggedInMerchantUser: Readonly<PickedCurrentUser> | null | undefined;
  merchantSourceCurrency: CurrencyCode | null | undefined;
  recentUsers: ReadonlyArray<RecentUser>;
  su: Readonly<PickedSU> | null | undefined;
  merchant: Readonly<PickedCurrentMerchant> | null | undefined;

  constructor({
    currentCountry,
    currentMerchant,
    currentUser,
    su,
    recentUsers: pickedRecentUsers,
  }: UserStoreInitialQueryResponse) {
    this.countryCodeByIp = currentCountry != null ? currentCountry.code : null;
    this.isCostBased =
      currentMerchant != null ? currentMerchant.isCostBased : false;
    this.isPlusUser =
      currentMerchant != null ? currentMerchant.isMerchantPlus : false;
    this.isSu = su != null;
    this.loggedInMerchantUser = currentUser;
    this.merchantSourceCurrency =
      currentMerchant != null ? currentMerchant.primaryCurrency : null;
    this.recentUsers = pickedRecentUsers.map((pickedUser) => {
      let displayName = "";
      if (pickedUser.displayName != null) {
        displayName = pickedUser.displayName;
      } else if (pickedUser.name != null) {
        displayName = pickedUser.name;
      }

      return {
        id: pickedUser.id,
        displayName,
        isMerchant: pickedUser.isStoreOrMerchantUser,
      };
    });
    this.su = su;
    this.merchant = currentMerchant;
  }

  @computed
  get isStoreUser(): boolean {
    return !!this.merchant?.isStoreMerchant;
  }

  @computed
  get isLoggedIn(): boolean {
    return this.loggedInMerchantUser != null;
  }

  @computed
  get isSuAdmin(): boolean {
    return this.isSu && this.su?.isAdmin == true;
  }

  @computed
  get isMerchant(): boolean {
    return (
      this.loggedInMerchantUser?.isStoreOrMerchantUser == true
      // TODO [lliepert]: current logic for handling user type is ugly and
      // needs to be refactored. commenting this out for now to avoid bloating
      // GQL since leopard isn't live at the moment
      // this.loggedInMerchantUser?.is_new_merchant_lead == true
    );
  }

  @computed
  get merchantId(): string | null | undefined {
    const { id: merchantId } = this.merchant || {
      merchant_id: null,
    };
    if (!merchantId || merchantId.trim().length == 0) {
      return null;
    }
    return merchantId;
  }

  @computed
  get isDisabledMerchant(): boolean {
    return this.merchant?.state == "DISABLED";
  }
}

export const useUserStore = (): UserStore => {
  return useContext(UserStoreContext);
};

export const useLoggedInUser = ():
  | Readonly<PickedCurrentUser>
  | null
  | undefined => {
  const { loggedInMerchantUser } = useUserStore();
  return loggedInMerchantUser;
};

const defaultUserStoreArgs: UserStoreInitialQueryResponse = {
  currentCountry: {
    code: "US",
  },
  currentMerchant: undefined,
  currentUser: undefined,
  su: undefined,
  recentUsers: [],
};

const UserStoreContext = createContext(new UserStore(defaultUserStoreArgs));

// combined with the later useImperativeHandle, this allows us to access the
// UserStore outside of React
const UserStoreRef = createRef<UserStore>();

export const UserStoreProvider: React.FC<{
  initialData: UserStoreInitialQueryResponse;
}> = ({ initialData, children }) => {
  const userStore = new UserStore(initialData);
  useImperativeHandle(UserStoreRef, () => userStore);

  return (
    <UserStoreContext.Provider value={userStore}>
      {children}
    </UserStoreContext.Provider>
  );
};

// below we mock out UserStore.instance() for compatibility with legacy code
const LegacyUserStoreMock = {
  instance: (): UserStore => {
    const ref = UserStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated UserStore";
    }
    return ref;
  },
};

export default LegacyUserStoreMock;
