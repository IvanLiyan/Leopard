//
//  stores/PersistenceStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 2/20/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import {
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";
import { observable, toJS } from "mobx";

const HasLocalStorage = typeof window !== "undefined" && !!window.localStorage;

class PersistenceStore {
  @observable
  storage: Map<string, unknown> = new Map();

  userId: string;

  constructor({ userId }: { userId: string }) {
    this.userId = userId;
  }

  userKey(key: string): string {
    const userId = this.userId || "none";
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

const PersistenceStoreContext = createContext(
  new PersistenceStore({ userId: "" }),
);

// combined with the later useImperativeHandle, this allows us to access the
// PersistenceStore outside of React
const PersistenceStoreRef = createRef<PersistenceStore>();

export const PersistenceStoreProvider: React.FC<{ userId: string }> = ({
  userId,
  children,
}) => {
  const persistenceStore = new PersistenceStore({ userId });
  useImperativeHandle(PersistenceStoreRef, () => persistenceStore);

  return (
    <PersistenceStoreContext.Provider value={persistenceStore}>
      {children}
    </PersistenceStoreContext.Provider>
  );
};

const LegacyPersistenceStoreAdapter = {
  instance: (): PersistenceStore => {
    const ref = PersistenceStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated PersistenceStore.\n\nIf this error occurred during a Next.JS Fast Refresh, try performing a full refresh.";
    }
    return ref;
  },
};

export default LegacyPersistenceStoreAdapter;
