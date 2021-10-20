//
//  stores/ToastStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import { createContext, useContext } from "react";
import { observable, action } from "mobx";
import { gql } from "@apollo/client";

/* Lego Components */
import { BannerSentiment } from "@ContextLogic/lego";

/* Relative Imports */
import PersistenceStore, {
  defaultPersistenceStoreArgs,
} from "./PersistenceStore";

type ToastOptions = {
  readonly deferred?: boolean;
  timeoutMs?: number;
  link?: {
    readonly title: string;
    readonly url: string;
  };
};

type ToastConfig = ToastOptions & {
  readonly message: string;
  readonly sentiment: BannerSentiment;
};

const PERSISTENCE_KEY = "ToastStore:ToastMessage";

type ToastStoreArgs = {
  readonly persistenceStore: PersistenceStore;
  readonly userGraph: unknown | null;
};

export default class ToastStore {
  isNavyBlueNav: boolean;

  @observable
  currentToast: ToastConfig | null | undefined = null;

  @observable
  willClose = false;

  @observable
  modalOpen = false;

  private currentTimeout: ReturnType<typeof setTimeout> | null | undefined;

  // TODO [lliepert]: looks like these are only getting called in appStore, since that's deprecated converting to constructor (must test and do to others)
  constructor({ persistenceStore, userGraph }: ToastStoreArgs) {
    this.isNavyBlueNav = userGraph != null;
    const toastJson = persistenceStore.get<ToastConfig>(PERSISTENCE_KEY);
    if (toastJson != null) {
      try {
        const toast: ToastConfig = { ...toastJson, deferred: false };
        this.post(toast);
      } finally {
        persistenceStore.remove(PERSISTENCE_KEY);
      }
    }
  }

  positive(message: string, options?: ToastOptions | null | undefined): void {
    this.post({ message, sentiment: "success", ...options });
  }

  negative(message: string, options?: ToastOptions | null | undefined): void {
    this.error(message, options);
  }

  error(
    message: string,
    options: ToastOptions | null | undefined = {
      timeoutMs: 7 * 1000,
    },
  ): void {
    this.post({ message, sentiment: "error", ...options });
  }

  warning(message: string, options?: ToastOptions | null | undefined): void {
    this.post({ message, sentiment: "warning", ...options });
  }

  info(message: string, options?: ToastOptions | null | undefined): void {
    this.post({ message, sentiment: "info", ...options });
  }

  @action
  post(config: ToastConfig): void {
    if (config.deferred && !this.isNavyBlueNav) {
      const persistenceStore = PersistenceStore.instance();
      persistenceStore.set(PERSISTENCE_KEY, config);
      return;
    }

    const { timeoutMs = 2500 } = config;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }

    this.willClose = false;
    this.currentToast = config;
    this.currentTimeout = setTimeout(() => this.dismissToast(), timeoutMs);
  }

  dismissToast(): void {
    this.willClose = true;
    setTimeout(() => {
      this.currentToast = null;
    }, 250);
  }

  static instance(): ToastStore {
    throw "ToastStore Not Implemented";
  }
}

export const useToastStore = (): ToastStore => {
  return useContext(ToastStoreContext);
};

export const TOAST_STORE_INITIAL_QUERY = gql`
  query ToastStore_InitialQuery {
    currentMerchant {
      userGraph
    }
  }
`;

// TODO [lliepert]: bad typing, redo once query is real
export type ToastStoreInitialQueryResponse = Omit<
  ToastStoreArgs,
  "persistenceStore"
>;

export const defaultToastStoreArgs = {
  persistenceStore: new PersistenceStore(defaultPersistenceStoreArgs),
  userGraph: null,
};

export const ToastStoreContext = createContext(
  new ToastStore(defaultToastStoreArgs),
);
