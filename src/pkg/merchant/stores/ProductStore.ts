//
//  stores/ProductStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 3/1/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import { observable, action, runInAction } from "mobx";

/* Merchant API */
import * as productApi from "@merchant/api/product";

/* Merchant Model */
import Product from "@merchant/model/Product";

export default class ProductStore {
  @observable
  fetchingItems = false;

  @observable
  products: Map<string, Product> = new Map();

  pidsToFetch: Set<string> = new Set([]);
  pidsCurrentlyBeingFetched: Set<string> = new Set([]);

  fetchInterval: ReturnType<typeof setTimeout> | null | undefined;

  getProduct(id: string | null | undefined): Product | null | undefined {
    if (id == null) {
      return null;
    }

    if (this.products.has(id)) {
      return this.products.get(id);
    }

    this.fetchProducts([id]);
    return null;
  }

  async fetchProducts(
    pids: ReadonlyArray<string>,
    params: {
      immediate?: boolean;
    } = {}
  ) {
    for (const pid of pids) {
      if (this.products.has(pid)) {
        continue;
      }

      if (this.pidsCurrentlyBeingFetched.has(pid)) {
        continue;
      }

      this.pidsToFetch.add(pid);
    }

    if (params.immediate) {
      this.fetchPendingProducts();
    }
  }

  init() {
    this.fetchInterval = setInterval(async () => {
      this.fetchPendingProducts();
    }, 1000);
  }

  @action
  async fetchPendingProducts() {
    const pidsToFetch = [...this.pidsToFetch];
    if (pidsToFetch.length == 0) {
      return;
    }

    this.pidsToFetch.clear();
    pidsToFetch.forEach((pid) => this.pidsCurrentlyBeingFetched.add(pid));

    try {
      const resp = await productApi
        .getMultiLight({
          pids: pidsToFetch.join(","),
        })
        .call();

      const results = resp.data?.results || [];
      runInAction(() => {
        for (const productDict of results) {
          this.products.set(productDict.id, new Product(productDict));
        }

        pidsToFetch.forEach((pid) => {
          this.pidsCurrentlyBeingFetched.delete(pid);
        });
      });
    } catch (e) {
      runInAction(() => {
        pidsToFetch.forEach((pid) => {
          this.pidsToFetch.add(pid);
          this.pidsCurrentlyBeingFetched.delete(pid);
        });
      });
    }
  }
}
