//
//  stores/ToastStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import { observable, action } from "mobx";

/* Lego Components */
import { BannerSentiment } from "@ContextLogic/lego";

/* Relative Imports */
import PersistenceStore from "./PersistenceStore";

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

export default class ToastStore {
  isNavyBlueNav = (window as any).userGraph != null;

  @observable
  currentToast: ToastConfig | null | undefined = null;

  @observable
  willClose = false;

  @observable
  modalOpen = false;

  private currentTimeout: ReturnType<typeof setTimeout> | null | undefined;

  init() {
    const persistenceStore = PersistenceStore.instance();
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

  positive(message: string, options?: ToastOptions | null | undefined) {
    this.post({ message, sentiment: "success", ...options });
  }

  negative(message: string, options?: ToastOptions | null | undefined) {
    this.error(message, options);
  }

  error(
    message: string,
    options: ToastOptions | null | undefined = {
      timeoutMs: 7 * 1000,
    }
  ) {
    this.post({ message, sentiment: "error", ...options });
  }

  warning(message: string, options?: ToastOptions | null | undefined) {
    this.post({ message, sentiment: "warning", ...options });
  }

  info(message: string, options?: ToastOptions | null | undefined) {
    this.post({ message, sentiment: "info", ...options });
  }

  @action
  post(config: ToastConfig) {
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

  static instance(): ToastStore {
    let { toastStore } = window as any;
    if (toastStore == null) {
      toastStore = new ToastStore();
      (window as any).toastStore = toastStore;
    }
    return toastStore;
  }

  dismissToast() {
    this.willClose = true;
    setTimeout(() => {
      this.currentToast = null;
    }, 250);
  }
}

export const useToastStore = (): ToastStore => {
  return ToastStore.instance();
};
