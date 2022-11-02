//
//  stores/NavigationStore.ts
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

import React, {
  useState,
  createContext,
  useContext,
  createRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from "react";
import { useRouter } from "next/router";

/* External Libraries */
import queryString from "query-string";
import Path from "path-parser";

const getPath = (str: string | null | undefined): string | null | undefined => {
  if (str == null) {
    return null;
  }

  if (str.startsWith("/")) {
    return str;
  }
  try {
    return new URL(str).pathname;
  } catch (e) {
    return null;
  }
};

type NavigationLock =
  | {
      readonly message: string;
    }
  | undefined;

// TODO [lliepert]: deprecate options; they don't make sense anymore
type ReloadOptions_DEPRECATED = {
  fullReload: boolean;
};

type PushOptions = {
  readonly queryParams?: Readonly<Record<string, string>> | null | undefined;
  readonly shallow?: boolean;
};

type ReplaceOptions = {
  readonly queryParams?: Readonly<Record<string, string>> | null | undefined;
  readonly shallow?: boolean;
};

type NavigateOptions = {
  readonly openInNewTab?: undefined | null | boolean;
  readonly fullReload?: boolean; // lliepert, implement
};

type NavigationStore = {
  readonly currentPath: string;
  readonly currentSearch: string;
  readonly currentHash: string;
  readonly pathParams: (path: string) => Readonly<Record<string, string>>;
  readonly queryParams: Readonly<Record<string, string>>;
  readonly pushPath: (path: string, options?: PushOptions) => Promise<void>;
  readonly replace: (path: string, options?: ReplaceOptions) => Promise<void>;
  readonly placeNavigationLock: (message: string) => void;
  readonly releaseNavigationLock: () => void;
  readonly reload: (options_DEPRECATED?: ReloadOptions_DEPRECATED) => void;
  readonly back: () => void;
  readonly download: (path: string) => void;
  readonly navigate: (path: string, options?: NavigateOptions) => Promise<void>;
};

const NavigationContext = createContext<NavigationStore>({
  currentPath: "",
  currentSearch: "",
  currentHash: "",
  pathParams: () => {
    throw "Hit Default NavigationContext";
  },
  queryParams: {},
  pushPath: () => {
    throw "Hit Default NavigationContext";
  },
  replace: () => {
    throw "Hit Default NavigationContext";
  },
  placeNavigationLock: () => {
    throw "Hit Default NavigationContext";
  },
  releaseNavigationLock: () => {
    throw "Hit Default NavigationContext";
  },
  reload: () => {
    throw "Hit Default NavigationContext";
  },
  back: () => {
    throw "Hit Default NavigationContext";
  },
  download: () => {
    throw "Hit Default NavigationContext";
  },
  navigate: () => {
    throw "Hit Default NavigationContext";
  },
});

// combined with the later useImperativeHandle, this allows us to access the
// NavigationStore outside of React
const NavigationStoreRef = createRef<NavigationStore>();

export const NavigationProvider: React.FC = ({ children }) => {
  const [navigationLock, setNavigationLock] =
    useState<NavigationLock>(undefined);
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const router = useRouter();

  const currentPath = router.pathname;
  const currentSearch = window.location.search;
  const currentHash = window.location.search; // TODO [lliepert]: deprecate in favour of currentSearch

  const navigationStore = useMemo<NavigationStore>(() => {
    const pathParams = (_path: string) => {
      const path = new Path(_path);
      return (path.partialTest(currentPath) || {}) as {
        [key: string]: string;
      };
    };

    const queryParams: Readonly<Record<string, string>> =
      queryString.parse(currentSearch);

    const pushPath = async (
      pathname: string,
      { queryParams: query, shallow }: PushOptions = {
        queryParams: undefined,
        shallow: true,
      },
    ) => {
      await router.push({ pathname, query }, undefined, { shallow });
    };

    const replace = async (
      pathname: string,
      { queryParams: query, shallow }: ReplaceOptions = {
        queryParams: undefined,
        shallow: true,
      },
    ) => {
      await router.replace({ pathname, query }, undefined, { shallow });
    };

    const placeNavigationLock = (message: string) => {
      setNavigationLock({ message });
      // this is the base navigation lock function
      // eslint-disable-next-line local-rules/no-manual-before-unload
      window.onbeforeunload = () => message;
    };

    const releaseNavigationLock = () => {
      setNavigationLock(undefined);
      // this is the base navigation lock function
      // eslint-disable-next-line local-rules/no-manual-before-unload
      window.onbeforeunload = null;
    };

    const reload = () => {
      router.reload();
    };

    const back = () => {
      router.back();
    };

    const download = (path: string) => {
      // TODO [lliepert]: test if this still works properly
      // this is the base download function
      // eslint-disable-next-line local-rules/no-manual-navigation
      window.location.href = path;
    };

    // TODO [lliepert]: more fully revisit this function in the next.js world
    const navigate = async (
      _path: undefined | null | string,
      { openInNewTab }: NavigateOptions = { openInNewTab: false },
    ) => {
      const path = getPath(_path);

      // blank path check to prevent lock from firing on anchor changes
      if (navigationLock && !openInNewTab && path !== "blank") {
        const navigate = confirm(navigationLock.message);
        if (!navigate) {
          return;
        }
        releaseNavigationLock();
      }

      if (_path == null) {
        return;
      }

      if (openInNewTab) {
        window.open(_path, "_blank");
        return;
      }

      if (path == null) {
        return;
      }

      await router.push(_path);
      // TODO [lliepert]: handle next.js vs non-next.js pages
      // window.location.href = _path;
    };

    return {
      currentPath,
      currentSearch,
      currentHash,
      pathParams,
      queryParams,
      pushPath,
      replace,
      placeNavigationLock,
      releaseNavigationLock,
      reload,
      back,
      download,
      navigate,
    };
  }, [currentHash, currentPath, currentSearch, navigationLock, router]);

  useEffect(() => {
    setShowChildren(NavigationStoreRef.current != null);
  }, []);

  useImperativeHandle(NavigationStoreRef, () => navigationStore);

  // to prevent children from attempting to access an un-instantiated store,
  // we don't render them until the ref for the legacy adapter is populated
  if (!showChildren) {
    return null;
  }

  return (
    <NavigationContext.Provider value={navigationStore}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationStore = (): NavigationStore => {
  const navigationProvider = useContext(NavigationContext);
  return navigationProvider;
};

const LegacyNavigationStoreAdapter = {
  instance: (): NavigationStore => {
    const ref = NavigationStoreRef.current;
    if (ref == null) {
      throw "Attempting to access reference to un-instantiated NavigationStore.\n\nIf this error occurred during a Next.JS Fast Refresh, try performing a full refresh.";
    }
    return ref;
  },
};

export default LegacyNavigationStoreAdapter;
