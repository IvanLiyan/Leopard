//
//  stores/DimenStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import { observable, computed, runInAction } from "mobx";

export default class DimenStore {
  @observable
  screenInnerWidth: number = window.innerWidth;

  @observable
  screenInnerHeight: number = window.innerHeight;

  @observable
  pageScrolled = false;

  @observable
  pageYOffset: number = window.pageYOffset;

  @computed
  get isVeryLargeScreen() {
    return this.screenInnerWidth >= 1200;
  }

  @computed
  get isLargeScreen() {
    return this.screenInnerWidth >= 900;
  }

  @computed
  get isSmallScreen() {
    return this.screenInnerWidth < 900;
  }

  @computed
  get isVerySmallScreen() {
    return this.screenInnerWidth < 640;
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

  static instance(): DimenStore {
    let { dimenStore } = window as any;
    if (dimenStore == null) {
      dimenStore = new DimenStore();
      (window as any).dimenStore = dimenStore;
    }
    return dimenStore;
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

  constructor() {
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
}

export const useDimenStore = (): DimenStore => {
  return new DimenStore();
};
