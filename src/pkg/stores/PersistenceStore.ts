//
//  stores/PersistenceStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 2/20/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { createContext, useContext } from "react";
import { observable, toJS } from "mobx";

/* Relative Imports */
import UserStore, { defaultUserStoreArgs } from "./UserStore";

const HasLocalStorage = typeof window !== "undefined" && !!window.localStorage;

type PersistenceStoreArgs = {
  readonly userStore: UserStore;
};

export default class PersistenceStore {
  @observable
  storage: Map<string, unknown> = new Map();

  userStore: UserStore;

  constructor({ userStore }: PersistenceStoreArgs) {
    this.userStore = userStore;
  }

  userKey(key: string): string {
    const userId = this.userStore.loggedInMerchantUser?.id || "none";
    return `${userId}_${key}`;
  }

  init(): void {
    if (!HasLocalStorage) {
      return;
    }

    const items = { ...window.localStorage };
    Object.keys(items).forEach((key) => {
      try {
        const storedItem = JSON.parse(items[key]);
        if (storedItem.type === "object") {
          this.storage.set(key, JSON.parse(storedItem.value));
        } else {
          this.storage.set(key, storedItem.value);
        }
      } catch (e) {
        // TODO [lliepert]: discovered in migration; why do we have this?
        /* */
      }
    });
  }

  set<T>(key: string, value: T): void {
    const internalKey = this.userKey(key);
    let jsValue: unknown = toJS(value);
    const valueType = typeof jsValue;
    if (valueType === "object") {
      jsValue = JSON.stringify(jsValue);
    }

    this.storage.set(internalKey, toJS(value));

    if (!HasLocalStorage) {
      return;
    }

    window.localStorage.setItem(
      internalKey,
      JSON.stringify(
        toJS({
          value: jsValue,
          type: valueType,
        }),
      ),
    );
  }

  setForDurationOfSession<T>(key: string, value: T): void {
    const internalKey = this.userKey(key);
    let jsValue: unknown = toJS(value);
    const valueType = typeof jsValue;
    if (valueType === "object") {
      jsValue = JSON.stringify(jsValue);
    }

    this.storage.set(internalKey, toJS(value));
  }

  get<T>(key: string): T | null | undefined {
    const internalKey = this.userKey(key);
    return toJS<T>(this.storage.get(internalKey) as T);
  }

  remove(key: string): void {
    const internalKey = this.userKey(key);
    this.storage.delete(internalKey);
    if (HasLocalStorage) {
      window.localStorage.removeItem(internalKey);
    }
  }

  clear(): void {
    this.storage.clear();
    if (HasLocalStorage) {
      window.localStorage.clear();
    }
  }
}

export const usePersistenceStore = (): PersistenceStore => {
  return useContext(PersistenceStoreContext);
};

export const defaultPersistenceStoreArgs = {
  userStore: new UserStore(defaultUserStoreArgs),
};

export const PersistenceStoreContext = createContext(
  new PersistenceStore(defaultPersistenceStoreArgs),
);
