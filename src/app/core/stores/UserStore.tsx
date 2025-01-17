//
//  stores/UserStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

import {
  useState,
  useMemo,
  useEffect,
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import { computed } from "mobx";
import { gql } from "@gql";

import {
  UserSchema,
  MerchantSchema,
  AddressSchema,
  CountryCode,
  Country,
  PaymentCurrencyCode as CurrencyCode,
  RoleSchema,
} from "@schema";

export const USER_STORE_INITIAL_QUERY = gql(`
  query UserStore_InitialQuery {
    currentCountry {
      code
    }
    currentMerchant {
      id
      isStoreMerchant
      primaryCurrency
      state
    }
    currentUser {
      id
      merchantId
      firstName
      lastName
      displayName
      email
      phoneNumber
      companyName
      entityType
      isStoreOrMerchantUser
      isApiUser
      isAdmin
      roles {
        name
      }
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
`);

type PickedCurrentMerchant = Pick<
  MerchantSchema,
  "id" | "isStoreMerchant" | "primaryCurrency" | "state"
>;

type PickedRoles = Pick<RoleSchema, "name">;

type PickedBusinessAddress = {
  readonly country: Pick<Country, "name" | "code">;
} & Pick<
  AddressSchema,
  "streetAddress1" | "streetAddress2" | "city" | "state" | "zipcode"
>;

type PickedCurrentUser = {
  readonly roles: ReadonlyArray<PickedRoles> | null;
  readonly businessAddress: PickedBusinessAddress;
} & Pick<
  UserSchema,
  | "id"
  | "merchantId"
  | "firstName"
  | "lastName"
  | "displayName"
  | "email"
  | "phoneNumber"
  | "companyName"
  | "entityType"
  | "isStoreOrMerchantUser"
  | "isApiUser"
  | "isAdmin"
>;

type PickedSU = Pick<UserSchema, "id" | "isAdmin" | "isBd">;

type PickedRecentUser = Pick<
  UserSchema,
  "id" | "displayName" | "name" | "isStoreOrMerchantUser"
>;

export type UserStoreInitialQueryResponse = {
  readonly currentCountry?: Pick<Country, "code">;
  readonly currentMerchant?: PickedCurrentMerchant;
  readonly currentUser?: PickedCurrentUser;
  readonly su?: PickedSU;
  readonly recentUsers?: ReadonlyArray<PickedRecentUser>;
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
  isSu: boolean;
  loggedInMerchantUser: Readonly<PickedCurrentUser> | null | undefined;
  merchantSourceCurrency: CurrencyCode | null | undefined;
  recentUsers: ReadonlyArray<RecentUser>;
  su: Readonly<PickedSU> | null | undefined;
  merchant: Readonly<PickedCurrentMerchant> | null | undefined;
  isAdmin = false;

  constructor(initialData?: UserStoreInitialQueryResponse | null) {
    if (initialData != null) {
      const {
        currentCountry,
        currentMerchant,
        currentUser,
        su,
        recentUsers: pickedRecentUsers,
      } = initialData;
      this.countryCodeByIp =
        currentCountry != null ? currentCountry.code : null;
      this.isSu = su != null;
      this.loggedInMerchantUser = currentUser;
      this.merchantSourceCurrency =
        currentMerchant != null ? currentMerchant.primaryCurrency : null;
      this.recentUsers =
        pickedRecentUsers?.map((pickedUser) => {
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
        }) || [];
      this.su = su;
      this.merchant = currentMerchant;
      this.isAdmin =
        // logged in as merchant through admin
        (su?.isAdmin ?? false) ||
        // logged in as admin but not as merchant
        (currentUser?.isAdmin ?? false);
    }

    this.recentUsers = [];
    this.isSu = false;
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
  readonly initialData?: UserStoreInitialQueryResponse | null;
}> = ({ initialData, children }) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  const userStore = useMemo(() => {
    return new UserStore(initialData);
  }, [initialData]);

  useEffect(() => {
    setShowChildren(UserStoreRef.current != null);
  }, []);

  useImperativeHandle(UserStoreRef, () => userStore);

  // to prevent children from attempting to access an un-instantiated store,
  // we don't render them until the ref for the legacy adapter is populated
  if (!showChildren) {
    return null;
  }

  return (
    <UserStoreContext.Provider value={userStore}>
      {children}
    </UserStoreContext.Provider>
  );
};

const LegacyUserStoreAdapter = {
  instance: (): UserStore => {
    const ref = UserStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated UserStore.\n\nIf this error occurred during a Next.JS Fast Refresh, try performing a full refresh.";
    }
    return ref;
  },
};

export default LegacyUserStoreAdapter;
