//
//  stores/AppStore_DEPRECATED.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 10/22/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable local-rules/no-pageParams */
/* eslint-disable filenames/match-exported */
import { computed } from "mobx";

/* External Libraries */
import Cookies from "js-cookie";

/* Lego Toolkit */
import { CountryCode } from "@toolkit/countries";

/* Merchant Store */
import TaxStore from "@merchant/stores/TaxStore";
import TodoStore from "@merchant/stores/TodoStore";
import UserStore from "@merchant/stores/UserStore";
import ToastStore from "@merchant/stores/ToastStore";
import DimenStore from "@merchant/stores/DimenStore";
import RouteStore from "@merchant/stores/RouteStore";
import BannerStore from "@merchant/stores/BannerStore";
import ProductStore from "@merchant/stores/ProductStore";
import ExperimentStore from "@merchant/stores/ExperimentStore";
import WishExpressStore from "@merchant/stores/WishExpressStore";
import PersistenceStore from "@merchant/stores/PersistenceStore";
import NavigationStore from "@merchant/stores/NavigationStore";
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";
import PromotionStore from "@merchant/stores/PromotionStore";

type MerchantEnv =
  | "stage"
  | "testing"
  | "fe_qa_staging"
  | "fe_prod"
  | "sandbox";

export default class AppStore {
  taxStore: TaxStore;
  todoStore: TodoStore;
  userStore: UserStore;
  toastStore: ToastStore;
  dimenStore: DimenStore;
  routeStore: RouteStore;
  bannerStore: BannerStore;
  productStore: ProductStore;
  navigationStore: NavigationStore;
  experimentStore: ExperimentStore;
  wishExpressStore: WishExpressStore;
  persistenceStore: PersistenceStore;
  productBoostStore: ProductBoostStore;
  promotionStore: PromotionStore;

  countryCodeByIp: CountryCode | null | undefined;

  constructor() {
    this.taxStore = TaxStore.instance();
    this.userStore = UserStore.instance();
    this.toastStore = ToastStore.instance();
    this.dimenStore = DimenStore.instance();
    this.routeStore = RouteStore.instance();
    this.bannerStore = new BannerStore();
    this.todoStore = TodoStore.instance();
    this.productStore = new ProductStore();
    this.navigationStore = NavigationStore.instance();
    this.experimentStore = new ExperimentStore();
    this.wishExpressStore = WishExpressStore.instance();
    this.persistenceStore = PersistenceStore.instance();
    this.productBoostStore = ProductBoostStore.instance();
    this.promotionStore = new PromotionStore();
    this.countryCodeByIp = (window as any).pageParams.country_code_by_ip;
  }

  /* eslint-disable local-rules/unwrapped-i18n */

  /* eslint-disable no-console */
  init() {
    this.persistenceStore.init();
    this.productStore.init();
    this.toastStore.init();
    this.navigationStore.init();

    if (this.env === "stage") {
      if ((window as any).pageParams.use_local_web_assets) {
        console.log(`Loading Javascript and CSS from frontend-merch`);
      } else {
        console.log(
          "Loading Javascript and CSS from CDN. " +
            "Please run restart server-merch or server.py with " +
            "`--use_local_web_assets=True` to use your local Javascript and CSS",
        );
      }
    }
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
  get isWebview(): boolean {
    const isWebview = (Cookies.get("_webview") || "").trim();
    return isWebview == "1" || isWebview == "true";
  }

  @computed
  get env(): MerchantEnv {
    return (window as any).pageParams.env;
  }

  @computed
  get isTesting(): boolean {
    return ["testing"].includes(this.env);
  }

  @computed
  get isSandbox(): boolean {
    return ["sandbox"].includes(this.env);
  }

  @computed
  get isStaging(): boolean {
    return ["fe_qa_staging", "stage"].includes(this.env);
  }

  @computed
  get isProd(): boolean {
    return ["testing", "fe_prod"].includes(this.env);
  }

  static instance(): AppStore {
    return (window as any).app;
  }
}

export const useStore = (): AppStore => {
  return AppStore.instance();
};
