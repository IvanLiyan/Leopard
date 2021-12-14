/* External Libraries */
import { createContext, useContext } from "react";
import { computed, observable, runInAction } from "mobx";

// TODO [lliepert]: force store to run only on client side, eventually deprecate

// breakpoints represent the lower bound of the named screen size
export const BREAKPOINTS = {
  smallScreen: 640,
  largeScreen: 900,
  veryLargeScreen: 1200,
};

export default class DeviceStore {
  @observable
  screenInnerWidth: number = window.innerWidth;

  @observable
  screenInnerHeight: number = window.innerHeight;

  @observable
  pageScrolled = false;

  @observable
  pageYOffset: number = window.pageYOffset;

  @computed
  get isVeryLargeScreen(): boolean {
    return this.screenInnerWidth >= BREAKPOINTS.veryLargeScreen;
  }

  @computed
  get isLargeScreen(): boolean {
    return this.screenInnerWidth >= BREAKPOINTS.largeScreen;
  }

  @computed
  get isSmallScreen(): boolean {
    return this.screenInnerWidth < BREAKPOINTS.largeScreen;
  }

  @computed
  get isVerySmallScreen(): boolean {
    return this.screenInnerWidth < BREAKPOINTS.smallScreen;
  }

  @computed
  get pageGuideX(): string | number {
    return this.isSmallScreen ? "3%" : "15%";
  }

  @computed
  get pageGuideXForPageWithTable(): string | number {
    return this.isSmallScreen ? "3%" : "5%";
  }

  @computed
  get pageGuideBottom(): string | number {
    return "90px";
  }

  constructor() {
    if (typeof window == "undefined") {
      return;
    }

    window.addEventListener("resize", () => {
      runInAction(() => {
        this.screenInnerWidth = window.innerWidth;
        this.screenInnerHeight = window.innerHeight;
      });
    });
    window.addEventListener("scroll", () => {
      runInAction(() => {
        this.pageYOffset = window.pageYOffset;
        this.pageScrolled = true;
      });
    });
  }

  screenMatch<T>(configs: {
    smallScreen?: T;
    largeScreen?: T;
    verySmallScreen?: T;
    default: T;
  }): T {
    const { verySmallScreen, smallScreen, largeScreen } = configs;

    if (this.isVerySmallScreen && verySmallScreen != undefined) {
      return verySmallScreen;
    }

    if (this.isSmallScreen && smallScreen != undefined) {
      return smallScreen;
    }

    return largeScreen || configs.default;
  }

  @computed
  get isFirefox(): boolean {
    return window.navigator.userAgent.toLowerCase().includes("firefox");
  }

  @computed
  get isIE(): boolean {
    const ua = window.navigator.userAgent;

    if (ua.includes("MSIE")) {
      return true;
    }

    if (ua.includes("Trident/")) {
      return true;
    }

    if (ua.includes("Edge/")) {
      return true;
    }

    return false;
  }

  @computed
  get isiOS(): boolean {
    const ua = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  }

  @computed
  get isAndroid(): boolean {
    const ua = window.navigator.userAgent;
    // Windows Phone must come first because its UA also contains "Android"
    return !/windows phone/i.test(ua) && /android/i.test(ua);
  }
}

export const useDeviceStore = (): DeviceStore => {
  return useContext(DeviceStoreContext);
};

export const useIsSmallScreen = (): boolean => {
  const { isSmallScreen } = useDeviceStore();
  return isSmallScreen;
};

export const useIsVerySmallScreen = (): boolean => {
  const { isVerySmallScreen } = useDeviceStore();
  return isVerySmallScreen;
};

export const DeviceStoreContext = createContext(new DeviceStore());
