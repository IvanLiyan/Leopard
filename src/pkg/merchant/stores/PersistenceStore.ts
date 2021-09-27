//
//  stores/PersistenceStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 2/20/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { observable, toJS } from "mobx";

/* Relative Imports */
import UserStore from "./UserStore";

const HasLocalStorage = !!window.localStorage;

const userKey = (key: string) => {
  const userStore = UserStore.instance();
  const userId = userStore.loggedInMerchantUser?.id || "none";
  return `${userId}_${key}`;
};

export default class PersistenceStore {
  @observable
  storage: Map<string, any> = new Map();

  init() {
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
        /* */
      }
    });
  }

  set<T>(key: string, value: T) {
    const internalKey = userKey(key);
    let jsValue: any = toJS(value);
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
        })
      )
    );
  }

  setForDurationOfSession<T>(key: string, value: T) {
    const internalKey = userKey(key);
    let jsValue: any = toJS(value);
    const valueType = typeof jsValue;
    if (valueType === "object") {
      jsValue = JSON.stringify(jsValue);
    }

    this.storage.set(internalKey, toJS(value));
  }

  get<T>(key: string): T | null | undefined {
    const internalKey = userKey(key);
    return toJS(this.storage.get(internalKey));
  }

  remove(key: string) {
    const internalKey = userKey(key);
    this.storage.delete(internalKey);
    if (HasLocalStorage) {
      window.localStorage.removeItem(internalKey);
    }
  }

  clear() {
    this.storage.clear();
    if (HasLocalStorage) {
      window.localStorage.clear();
    }
  }

  static instance(): PersistenceStore {
    let { persistenceStore } = window as any;
    if (persistenceStore == null) {
      persistenceStore = new PersistenceStore();
      (window as any).persistenceStore = persistenceStore;
    }
    return persistenceStore;
  }
}

export const usePersistenceStore = (): PersistenceStore => {
  return PersistenceStore.instance();
};
