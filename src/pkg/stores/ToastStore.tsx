//
//  stores/ToastStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import {
  useState,
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
} from "react";

/* Lego Components */
import { BannerSentiment } from "@ContextLogic/lego";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Relative Imports */
import { usePersistenceStore } from "@stores/PersistenceStore";
import { isProd } from "@stores/EnvironmentStore";

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

export type ToastStore = {
  isNavyBlueNav: boolean;
  currentToast: ToastConfig | null | undefined;
  willClose: boolean;
  modalOpen: boolean;
  setModalOpen(value: boolean): void;
  positive(message: string, options?: ToastOptions | null | undefined): void;
  negative(message: string, options?: ToastOptions | null | undefined): void;
  error(message: string, options?: ToastOptions | null | undefined): void;
  warning(message: string, options?: ToastOptions | null | undefined): void;
  info(message: string, options?: ToastOptions | null | undefined): void;
  post(config: ToastConfig): void;
  dismissToast(): void;
};

// combined with the later useImperativeHandle, this allows us to access the
// ToastStore outside of React (namely, in Apollo)
export const ToastStoreRef = createRef<ToastStore>();

const ToastContext = createContext<ToastStore>({
  isNavyBlueNav: false,
  currentToast: undefined,
  willClose: false,
  modalOpen: false,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setModalOpen: (arg0: boolean) => {
    throw "Hit Default ToastContext";
  },
  positive: (arg0: string) => {
    throw "Hit Default ToastContext";
  },
  negative: (arg0: string) => {
    throw "Hit Default ToastContext";
  },
  error: (arg0: string) => {
    throw "Hit Default ToastContext";
  },
  warning: (arg0: string) => {
    throw "Hit Default ToastContext";
  },
  info: (arg0: string) => {
    throw "Hit Default ToastContext";
  },
  post: (arg0: ToastConfig) => {
    throw "Hit Default ToastContext";
  },
  dismissToast: () => {
    throw "Hit Default ToastContext";
  },
  /* eslint-enable @typescript-eslint/no-unused-vars */
});

export const useToastStore = (): ToastStore => {
  return useContext(ToastContext);
};

export const ToastProvider: React.FC = ({ children }) => {
  const persistenceStore = usePersistenceStore();
  // will bring back set when we have the user graph
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isNavyBlueNav, setIsNavyBlueNav] = useState(false);
  const [currentToast, setCurrentToast] = useState<
    ToastConfig | null | undefined
  >(null);
  const [willClose, setWillClose] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState<
    ReturnType<typeof setTimeout> | null | undefined
  >(undefined);

  const dismissToast = (): void => {
    setWillClose(true);
    setTimeout(() => {
      setCurrentToast(null);
    }, 250);
  };

  const post = (config: ToastConfig): void => {
    if (config.deferred && !isNavyBlueNav) {
      persistenceStore.set(PERSISTENCE_KEY, config);
      return;
    }

    if (!isProd) {
      // eslint-disable-next-line no-console
      console.log(`TRIGGERING TOAST`);
      // eslint-disable-next-line no-console
      console.table(config);
    }

    const { timeoutMs = 2500 } = config;
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    setWillClose(false);
    setCurrentToast(config);
    setCurrentTimeout(setTimeout(() => dismissToast(), timeoutMs));
  };

  const error = (
    message: string,
    options: ToastOptions | null | undefined = {
      timeoutMs: 7 * 1000,
    },
  ): void => {
    post({ message, sentiment: "error", ...options });
  };

  const positive = (
    message: string,
    options?: ToastOptions | null | undefined,
  ): void => {
    post({ message, sentiment: "success", ...options });
  };

  const negative = (
    message: string,
    options?: ToastOptions | null | undefined,
  ): void => {
    error(message, options);
  };

  const warning = (
    message: string,
    options?: ToastOptions | null | undefined,
  ): void => {
    post({ message, sentiment: "warning", ...options });
  };

  const info = (
    message: string,
    options?: ToastOptions | null | undefined,
  ): void => {
    post({ message, sentiment: "info", ...options });
  };

  useMountEffect(() => {
    const toastJson = persistenceStore.get<ToastConfig>(PERSISTENCE_KEY);
    if (toastJson != null) {
      try {
        const toast: ToastConfig = { ...toastJson, deferred: false };
        post(toast);
      } finally {
        persistenceStore.remove(PERSISTENCE_KEY);
      }
    }
  });

  const toastStore: ToastStore = {
    isNavyBlueNav,
    currentToast,
    willClose,
    modalOpen,
    setModalOpen,
    positive,
    negative,
    error,
    warning,
    info,
    post,
    dismissToast,
  };

  // combined with the previous createRef, this allows us to access the
  // ToastStore outside of React (namely, in Apollo)
  useImperativeHandle(ToastStoreRef, () => toastStore);

  return (
    <ToastContext.Provider value={toastStore}>{children}</ToastContext.Provider>
  );
};

const LegacyToastStoreAdapter = {
  instance: (): ToastStore => {
    const ref = ToastStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated ToastStore.\n\nIf this error occurred during a Next.JS Fast Refresh, try performing a full refresh.";
    }
    return ref;
  },
};

export default LegacyToastStoreAdapter;
