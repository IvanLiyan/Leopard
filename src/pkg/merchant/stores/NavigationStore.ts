//
//  stores/NavigationStore.ts
//  Project-Lego
//
//  Created by Sola Ogunsakin on 8/7/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import { observable, computed, reaction, action, toJS } from "mobx";

/* External Libraries */
import _ from "lodash";
import Id from "valid-objectid";
import Fuse from "fuse.js";
import queryString from "query-string";
import { EventEmitter } from "fbemitter";
import Path from "path-parser";

/* Lego Components */
import { NavigationNode } from "@toolkit/chrome";

/* Merchant API */
import * as adminApi from "@merchant/api/admin";
import * as chromeApi from "@merchant/api/chrome";
import * as zendeskApi from "@merchant/api/zendesk";

/* Relative Imports */
import UserStore from "./UserStore";
import EnvironmentStore from "./EnvironmentStore";
import LocalizationStore from "./LocalizationStore";

export const InternalUrlPrefix = "merchant://";

// Paths that can be loaded "progressively" (without refreshing the
// entire page).
const ProgressiveLoadablePaths: ReadonlyArray<string> = [
  "/home",
  "/plus",
  "/order/",
  "/tax/",
  "/tracking-dispute/v2/",
  "/policy#wish_express",
  "/request-confirmation-email",
  "/product-boost",
  "/collection-boost",
  "/terms-of-service",
  "/announcements",
  "/transactions/action",
  "/branded-products/brand-directory",
  "/my-brand-requests",
  "/seller-profile-verification",
  "/account-balance",
  "/policy",
  "/product-authorization",
  "/demo-videos",
  "/performance-overview",
  "/penalties",
  "/my-brand-requests",
  "/documentation/api/v3/reference",
  "/merchant_apps",
  "/partner-developer",
  "/fulfillment-settings",
  "/vacation-settings",
  "/client-settings",
  "/warehouse-overview",
  "/merchant-early-payment",
  "/merchant-tro",
  "/fbs",
  "/create-shipping-plan",
  "/fbw/shipping-plan",
  "/fbw-performance",
  "/fbw/insights",
  "/fbw/inventory",
  "/fbw/view-fees",
  "/fbw/tos",
  "/transaction/action",
  "/customer-service",
  "/marketplace",
  "/fbw/create-shipping-plan",
  "/product-shipping/",
];

type ResultType =
  | "page"
  | "admin_page"
  | "recent_page"
  | "merchant"
  | "frequent_page"
  | "order"
  | "product"
  | "fine_display_item"
  | "warning"
  | "zendesk"
  | "recent_login"
  | "tracking_dispute";

const PLUS_ZEND_ARTICLES = [
  360051494293,
  360016868094,
  360051155153,
  360050728594,
  360050728714,
  360051495013,
  360051621873,
];

const TypeNameMap: { [key in ResultType]: string } = {
  page: i`Pages`,
  admin_page: i`Wish Operations`,
  order: i`Orders`,
  product: i`Products`,
  fine_display_item: i`Penalties`,
  warning: i`Infractions`,
  zendesk: i`FAQ`,
  recent_login: i`Recent Logins`,
  tracking_dispute: i`Tracking Disputes`,
  recent_page: i`Recently Visited`,
  frequent_page: i`Most Visited`,
  merchant: i`Merchants`,
};

type FlattenedNode = {
  readonly node: NavigationNode;
  readonly parents: ReadonlyArray<NavigationNode>;
};

export type WeightedNode = FlattenedNode & {
  readonly weight: number;
};

type SearchResultPayloadType = WeightedNode | undefined;

export type NavigationSearchResult = {
  readonly url: string;
  readonly type: ResultType;
  readonly title: string;
  readonly description?: null | string;
  readonly image_url?: null | string;
  readonly keywords?: ReadonlyArray<string>;
  readonly breadcrumbs?: ReadonlyArray<string>;
  readonly search_phrase?: string;
  readonly open_in_new_tab?: boolean;
  readonly nuggets?: ReadonlyArray<string | null>;
  readonly weight?: number;
  readonly payload?: SearchResultPayloadType;
};

export type SearchResultGroup = {
  readonly title: string;
  readonly type: ResultType;
  readonly results: ReadonlyArray<NavigationSearchResult>;
};

type HistoryState = {
  readonly pathOnly: string;
  readonly fullPath: string;
};

export type NavigationLock = {
  readonly message: string;
};

export type BuildPackage =
  | "merchant"
  | "internal"
  | "plus"
  | "shopifyapp"
  | "brandpartner";

export type Container = {
  readonly name: string;
  readonly buildPackage: BuildPackage;
  readonly initialData: null | { [key: string]: any };
  readonly showChrome: boolean;
};

type ProgressiveLoadProgress = "IN_PROGRESS" | "DONE";

export default class NavigationStore {
  @observable
  isDrawerOpen = false;

  @observable
  userGraph: null | NavigationNode = (window as any).userGraph;

  @observable
  adminGraph: null | NavigationNode = (window as any).adminGraph;

  isNavyBlueNav = (window as any).userGraph != null;

  @observable
  rawSearchQuery = "";

  @observable
  searchQuery = "";

  debouceTimeoutId: ReturnType<typeof setTimeout> | null = null;

  @observable
  latestPendingNavigationPath: undefined | null | string = null;

  @observable
  progressiveLoadingStatus: undefined | null | ProgressiveLoadProgress = null;

  @observable
  pathUpdateTick = 0;

  @observable
  refreshTick = 0;

  @observable
  navigationLock: NavigationLock | undefined;

  @observable
  currentContainer: Container | undefined = (window as any).pageParams
    .initialContainer;

  private emitter = new EventEmitter();

  async init() {
    reaction(
      () => this.rawSearchQuery,
      (searchQuery) => {
        if (this.debouceTimeoutId != null) {
          clearTimeout(this.debouceTimeoutId);
        }

        this.debouceTimeoutId = setTimeout(() => {
          if (
            Id.isValid(searchQuery.trim()) ||
            this.rawSearchQuery == searchQuery
          ) {
            this.searchQuery = searchQuery.trim();
          }
        }, 300);
      },
      { fireImmediately: false }
    );

    reaction(
      () => this.pageSearchResult,
      (pageSearchResult) => {
        const {
          isPlusUser,
          loggedInMerchantUser,
          isStoreUser,
        } = UserStore.instance();
        const productName = isStoreUser ? i`Wish Local` : i`Wish for Merchants`;
        const appName = isPlusUser
          ? loggedInMerchantUser.display_name
          : productName;
        if (pageSearchResult == null) {
          document.title = appName;
          return;
        }

        const { title } = pageSearchResult;
        document.title = `${title} | ${appName}`;
      },
      { fireImmediately: true }
    );

    // window.addEventListener(
    //   "focus",
    //   () => {
    //     const { isDev } = EnvironmentStore.instance();
    //     if (isDev) {
    //       this.reload();
    //     }
    //   },
    //   false
    // );

    this.initializeHistoryStack();

    window.addEventListener("popstate", (e) => this.onPopState(e));
  }

  onPopState(event: undefined | null | PopStateEvent) {
    const state = event?.state;
    const { currentPath } = this;
    if (!state) {
      return;
    }

    const { fullPath, pathOnly } = state as HistoryState;
    this.pathUpdateTick += 1;

    if (!fullPath || pathOnly == currentPath) {
      return;
    }

    this.navigate(fullPath, {
      push: false,
    });
  }

  pushPath(path: string, queryParams?: any | null | undefined) {
    let query = "";
    if (queryParams) {
      query = `?${queryString.stringify({
        ...queryParams,
      })}`;
    }

    const fullPath = path + query;
    this.pushState(fullPath);
  }

  private pushState(fullPath: string) {
    const pathOnly = fullPath.split(/\?(.+)/)[0];
    const state: HistoryState = { fullPath, pathOnly };
    history.pushState(state, "", fullPath);
    this.pathUpdateTick += 1;
  }

  private replaceState(fullPath: string) {
    const pathOnly = fullPath.split(/\?(.+)/)[0];
    const state: HistoryState = { fullPath, pathOnly };
    history.replaceState(state, "", fullPath);
    this.pathUpdateTick += 1;
  }

  private initializeHistoryStack() {
    const newPath = window.location.href.replace(window.location.origin, "");
    this.replaceState(newPath);
  }

  clearPathParams() {
    const { currentPath } = this;
    this.replaceState(currentPath);
  }

  pathParams(pattern: string): { [key: string]: string } {
    const { currentPath } = this;

    const path = new Path(pattern);
    return (path.partialTest(currentPath) || {}) as {
      [key: string]: string;
    };
  }

  addRouteListener(
    route: string,
    listener: (params: { [key: string]: any }) => unknown
  ) {
    if (!this.isInternalURL(route)) {
      return;
    }
    const { path } = this.extractPathAndParams(route);
    if (path == null) {
      return;
    }

    this.emitter.addListener(path, listener);
  }

  isInternalURL(url: string): boolean {
    return url.toLowerCase().startsWith(InternalUrlPrefix);
  }

  @computed
  get currentPath(): string {
    this.pathUpdateTick;
    return window.location.pathname;
  }

  @computed
  get currentSearch(): string {
    this.pathUpdateTick;
    return window.location.search;
  }

  @computed
  get currentHash(): string {
    this.pathUpdateTick;
    return window.location.search;
  }

  @computed
  get queryParams(): Readonly<{
    [key: string]: string;
  }> {
    const { currentSearch } = this;
    return queryString.parse(currentSearch);
  }

  @computed
  get pageSearchResult(): undefined | null | NavigationSearchResult {
    const { searchDocuments, currentHash, currentPath, currentSearch } = this;
    if (location == null) {
      return null;
    }

    // Used to trigger an recomputation we navigate.
    this.latestPendingNavigationPath;
    const pathAndSearch = currentPath + currentSearch + currentHash;

    const results = searchDocuments.filter((doc) => {
      try {
        const url = new URL(doc.url);

        if (url.search || url.hash) {
          return doc.url.includes(pathAndSearch);
        }

        return location.pathname.startsWith(url.pathname);
      } catch {
        return false;
      }
    });

    const topResults = _.sortBy(results, (doc) => doc.url.length);
    return topResults[0];
  }

  @computed get fuzeSearch() {
    const { searchDocuments } = this;

    const keys: {
      name: keyof NavigationSearchResult;
      weight: number;
    }[] = [
      { name: "title", weight: 0.2 },
      { name: "search_phrase", weight: 0.3 },
      { name: "keywords", weight: 0.2 },
      { name: "description", weight: 0.2 },
      { name: "breadcrumbs", weight: 0.1 },
    ];

    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys,
    };

    const cleanSearchDocuments = searchDocuments.map((doc) => ({
      ...doc,
      // mobxs wraps the arrays with ObservableArray, which
      // messes with fuzy. Convert them back to plain arrays.
      keywords: toJS(doc.keywords),
      breadcrumbs: toJS(doc.breadcrumbs),
    }));

    const index = Fuse.createIndex(
      ["title", "search_phrase", "keywords", "description", "breadcrumbs"],
      cleanSearchDocuments
    );

    return new Fuse(cleanSearchDocuments, options, index);
  }

  @computed get rawSearchResults(): ReadonlyArray<NavigationSearchResult> {
    const {
      objectSearchResult,
      searchQuery,
      zendeskResults,
      emptyRawSearchResults,
      merchantSearchResults,
    } = this;
    if (searchQuery.trim().length == 0) {
      return emptyRawSearchResults;
    }

    if (objectSearchResult != null) {
      return [objectSearchResult];
    }
    const results = this.fuzeSearch.search(this.searchQuery);

    const rankedResults = _.sortBy(results, (result) => {
      const finalScore =
        -1 *
        ((1 - (result.score || 0)) * 0.7 + (result.item.weight || 0) * 0.3);
      return finalScore;
    });
    return [
      ...rankedResults.map((result) => result.item),
      ...merchantSearchResults,
      ...zendeskResults,
    ];
  }

  @computed get emptyRawSearchResults(): ReadonlyArray<NavigationSearchResult> {
    const { resultLoginResults, mostRecentlyVisitedPages } = this;
    return [...resultLoginResults, ...mostRecentlyVisitedPages];
  }

  @computed get searchResultGroups(): ReadonlyArray<SearchResultGroup> {
    const MAX_RESULTS_PER_GROUP = 3;
    const priority: {
      [key in ResultType]: number;
    } = {
      page: 1,
      merchant: 1,
      admin_page: 2,
      zendesk: 3,
      recent_login: 4,
      recent_page: 5,
      frequent_page: 6,
      order: 1,
      product: 1,
      fine_display_item: 1,
      warning: 1,
      tracking_dispute: 1,
    };

    const { rawSearchResults } = this;
    const groupedResults: {
      [T in ResultType]?: ReadonlyArray<NavigationSearchResult>;
    } = {};

    for (const result of rawSearchResults) {
      const { type } = result;
      let groupResults = groupedResults[type] || [];
      if (groupResults.length == MAX_RESULTS_PER_GROUP) {
        continue;
      }

      // If node was already added (usually because it was swapped for an overview node)
      // don't duplicate
      if (groupResults.some(({ url }) => url == result.url)) {
        continue;
      }

      const { payload } = result;

      const isOverviewNode =
        payload != null &&
        payload.parents.some(({ nodeid }) => nodeid == "overview");

      // If this result is an overview node and its URL exists elsewhere, use
      // the other node as well
      if (isOverviewNode) {
        const duplicateNonOverviewResult = rawSearchResults.find(
          ({ url, payload: otherPayload }) =>
            otherPayload != null &&
            url == result.url &&
            !otherPayload.parents.some(({ nodeid }) => nodeid == "overview")
        );
        if (duplicateNonOverviewResult != null) {
          groupResults = [...groupResults, duplicateNonOverviewResult];
          groupedResults[type] = groupResults;
          continue;
        }
      }

      groupResults = [...groupResults, result];
      groupedResults[type] = groupResults;
    }

    const results: ReadonlyArray<SearchResultGroup> = (Object.keys(
      groupedResults
    ) as ResultType[]).reduce((acc, type) => {
      const results = groupedResults[type];
      return results == null
        ? acc
        : [
            ...acc,
            {
              title: TypeNameMap[type],
              type,
              results,
            },
          ];
    }, [] as ReadonlyArray<SearchResultGroup>);

    const sortedGroups = _.sortBy(results, ({ type }) => {
      if (type in priority) {
        return priority[type];
      }

      return Object.keys(priority).length + 1;
    });

    return sortedGroups;
  }

  @computed get objectSearchResult():
    | null
    | undefined
    | NavigationSearchResult {
    const { searchIsObjectID, searchQuery } = this;
    const { currentPath } = this;
    if (!searchIsObjectID) {
      return null;
    }

    return chromeApi.objectSearch({
      oid: searchQuery.trim(),
      current_path: currentPath,
    }).response?.data?.result;
  }

  @computed get searchIsObjectID(): boolean {
    return Id.isValid(this.searchQuery.trim());
  }

  @computed get zendeskResults(): ReadonlyArray<NavigationSearchResult> {
    const { searchQuery } = this;
    const { isMerchant, isPlusUser } = UserStore.instance();
    const { locale } = LocalizationStore.instance();
    if (!isMerchant || searchQuery.trim().length == 0) {
      return [];
    }

    let results = zendeskApi.searchZendesk({
      query: searchQuery,
      locale,
    }).response?.data?.results;

    if (results == null) {
      return [];
    }

    if (isPlusUser) {
      results = results.filter(({ id }) => PLUS_ZEND_ARTICLES.includes(id));
    }

    return results.map((result) => {
      return {
        type: "zendesk",
        url: result.html_url,
        title: result.title,
        description: result.snippet.replace(/<[^>]*>?/gm, ""),
        open_in_new_tab: true,
      };
    });
  }

  @computed get merchantSearchResults(): ReadonlyArray<NavigationSearchResult> {
    const { searchQuery } = this;
    const { isMerchant } = UserStore.instance();
    const { currentPath } = this;
    const { isStaging } = EnvironmentStore.instance();

    if (isStaging || searchQuery.trim().length == 0) {
      return [];
    }

    const merchants = adminApi
      .getMerchants({
        start: 0,
        count: 3,
        query: searchQuery,
        sort: "username",
        order: "asc",
        submerchants: false,
        search_type: "",
        as_su: true,
        get_channel_partners: true,
      })
      .setOptions({ failSilently: true }).response?.data?.merchants;
    if (merchants == null) {
      return [];
    }

    const redirectPath = isMerchant && currentPath ? currentPath : "/";
    return merchants.map((merchant) => {
      return {
        type: "merchant",
        url: `/go/${merchant.merchant_id}?next=${encodeURIComponent(
          redirectPath
        )}`,
        title: merchant.merchant_name,
      };
    });
  }

  flattenNodes(
    node: NavigationNode,
    parents: ReadonlyArray<NavigationNode>
  ): ReadonlyArray<FlattenedNode> {
    if (node.children.length == 0) {
      return [
        {
          node,
          parents,
        },
      ];
    }

    return _.flatten(
      node.children.map((child) => this.flattenNodes(child, [...parents, node]))
    );
  }

  convertToDocuments(
    flattenedNodes: ReadonlyArray<FlattenedNode>
  ): ReadonlyArray<NavigationSearchResult> {
    const globalMaxHits = Math.max(
      ...flattenedNodes.map(({ node }) => node.total_hits || 0)
    );
    const globalMostRecentHit = Math.max(
      ...flattenedNodes.map(({ node }) => node.most_recent_hit || 0)
    );

    const weightedNodes: ReadonlyArray<WeightedNode> = flattenedNodes.map(
      (node) => {
        const {
          node: {
            total_hits: totalHits = 0,
            most_recent_hit: mostRecentHit = 0,
          },
        } = node;
        const frequencyScore =
          globalMaxHits == 0 || totalHits == null
            ? 0
            : totalHits / globalMaxHits;
        const recencyScore =
          globalMostRecentHit == 0 || mostRecentHit == null
            ? 0
            : mostRecentHit / globalMostRecentHit;

        const weight = 0.6 * frequencyScore + 0.4 * recencyScore;

        return { ...node, weight, isTypeWeightedNode: true };
      }
    );

    return weightedNodes.map((weightedNode) => {
      const {
        node: {
          label: title,
          url,
          keywords,
          description,
          search_phrase: searchPhrase,
        },
        parents,
        weight,
      } = weightedNode;
      const breadcrumbs = [...parents.map((node) => node.label), title];
      return {
        type: "page",
        url,
        title: searchPhrase || title,
        keywords,
        description,
        breadcrumbs,
        search_phrase: searchPhrase || title,
        weight,
        payload: weightedNode,
      };
    });
  }

  @computed get searchDocuments(): ReadonlyArray<NavigationSearchResult> {
    const { userSearchDocuments, adminSearchDocuments } = this;
    return [...userSearchDocuments, ...adminSearchDocuments];
  }

  @computed get userSearchDocuments(): ReadonlyArray<NavigationSearchResult> {
    const { flattenedNodes } = this;
    return this.convertToDocuments(flattenedNodes);
  }

  @computed get adminSearchDocuments(): ReadonlyArray<NavigationSearchResult> {
    const { flattenedAdminNodes } = this;
    return this.convertToDocuments(flattenedAdminNodes).map((doc) => ({
      ...doc,
      type: "admin_page",
    }));
  }

  @computed get flattenedNodes(): ReadonlyArray<FlattenedNode> {
    const { userGraph } = this;
    if (userGraph == null) {
      return [];
    }

    return _.flatten(
      userGraph.children.map((node) => this.flattenNodes(node, []))
    );
  }

  @computed get flattenedAdminNodes(): ReadonlyArray<FlattenedNode> {
    const { adminGraph } = this;
    if (adminGraph == null) {
      return [];
    }

    return _.flatten(
      adminGraph.children.map((node) => this.flattenNodes(node, []))
    ).map((node) => {
      const updatedNode = {
        ...node.node,
        url: `/go/me?next=${encodeURIComponent(node.node.url)}`,
      };
      return {
        ...node,
        node: updatedNode,
      };
    });
  }

  @computed get resultLoginResults(): ReadonlyArray<NavigationSearchResult> {
    const { recentSu, isMerchant } = UserStore.instance();
    const { currentPath } = this;
    return recentSu.map((su) => {
      const redirectPath = isMerchant && su.is_merchant ? currentPath : "/";
      return {
        url: `/go/${su.id}?next=${encodeURIComponent(redirectPath || "/")}`,
        type: "recent_login",
        title: su.display_name,
      };
    });
  }

  @computed
  get mostRecentlyVisitedPages(): ReadonlyArray<NavigationSearchResult> {
    const { searchDocuments } = this;
    return _.sortBy(
      searchDocuments,
      ({ payload }) => -1 * (payload?.node.most_recent_hit || 0)
    )
      .filter(({ payload }) => payload?.node.nodeid != "home")
      .slice(0, 10)
      .map((doc) => ({ ...doc, type: "recent_page" }));
  }

  @computed
  get frequentlyVisitedPages(): ReadonlyArray<NavigationSearchResult> {
    const { searchDocuments, mostRecentlyVisitedPages } = this;
    const res: NavigationSearchResult[] = _.sortBy(
      searchDocuments,
      ({ payload }) => -1 * (payload?.node.total_hits || 0)
    )
      .filter(({ payload }) => payload?.node.nodeid != "home")
      .slice(0, 10);

    return res
      .map(
        (doc): NavigationSearchResult => ({
          ...doc,
          type: "frequent_page",
        })
      )
      .filter(
        ({ url, title }) =>
          !mostRecentlyVisitedPages.some(
            (doc) => doc.title == title && doc.url == url
          )
      );
  }

  @action
  placeNavigationLock(message: string) {
    this.navigationLock = { message };
    // this is the base navigation lock function
    // eslint-disable-next-line local-rules/no-manual-before-unload
    window.onbeforeunload = () => message;
  }

  @action
  releaseNavigationLock() {
    this.navigationLock = undefined;
    // this is the base navigation lock function
    // eslint-disable-next-line local-rules/no-manual-before-unload
    window.onbeforeunload = null;
  }

  @action
  async reload(options?: { fullReload?: boolean }) {
    if (options?.fullReload) {
      // this is the base reload function
      // eslint-disable-next-line local-rules/no-manual-navigation
      window.location.reload();
      return;
    }

    const {
      location: { pathname: currentPath },
    } = window;
    return this.navigate(currentPath, {
      push: false,
    });
  }

  @action
  async back() {
    window.history.back();
  }

  @action
  async replace(path: string) {
    // this is the base reload function
    // eslint-disable-next-line local-rules/no-manual-navigation
    window.location.replace(path);
  }

  @action
  async download(path: string) {
    // this is the base download function
    // eslint-disable-next-line local-rules/no-manual-navigation
    window.location.href = path;
  }

  @action
  async navigate(
    _path: undefined | null | string,
    options: {
      readonly push?: boolean;
      readonly openInNewTab?: undefined | null | boolean;
      readonly fullReload?: boolean;
    } = {
      push: true,
      openInNewTab: false,
      fullReload: false,
    }
  ) {
    const { isNavyBlueNav, navigationLock } = this;
    const { push = true, openInNewTab, fullReload } = options;
    const { isPlusUser } = UserStore.instance();

    const path = this.getPath(_path);

    if (navigationLock && !openInNewTab && path !== "blank") {
      // blank path check to prevent lock from firing on anchor changes
      const navigate = confirm(navigationLock.message);
      if (!navigate) {
        return;
      }
      this.releaseNavigationLock();
    }

    if (_path == null) {
      return;
    }

    if (fullReload) {
      // this is the base navigate function
      // eslint-disable-next-line local-rules/no-manual-navigation
      window.location.href = _path;
      return;
    }

    if (this.isInternalURL(_path)) {
      const { params, path } = this.extractPathAndParams(_path);
      if (path != null) {
        this.emitter.emit(path, params);
      }
      return;
    }

    if (openInNewTab) {
      window.open(_path, "_blank");
      return;
    }

    if (path == null) {
      return;
    }

    const isLoadablePath =
      (isPlusUser && path == "/") ||
      ProgressiveLoadablePaths.some((loadablePath) =>
        path.startsWith(loadablePath)
      );

    if (!isLoadablePath || !isNavyBlueNav) {
      // this is the base navigate function
      // eslint-disable-next-line local-rules/no-manual-navigation
      window.location.href = _path;
      return;
    }

    this.isDrawerOpen = false;
    this.progressiveLoadingStatus = "IN_PROGRESS";
    this.latestPendingNavigationPath = path;

    if (push) {
      this.pushState(path);
    }

    const response = await fetch(path, {
      headers: { Accept: "application/json" },
    });
    if (path != this.latestPendingNavigationPath) {
      // Page has changed since user requested this.
      return;
    }
    try {
      const { container, show_site_nav: showSiteNav } = await response.json();

      if (container == null || !showSiteNav) {
        // this is the base navigate function
        // eslint-disable-next-line local-rules/no-manual-navigation
        window.location.href = _path;
        return;
      }

      this.currentContainer = container;
    } catch (e) {
      // On error, use the base navigate function
      // eslint-disable-next-line local-rules/no-manual-navigation
      window.location.href = _path;
      return;
    }

    this.refreshTick += 1;
    this.progressiveLoadingStatus = "DONE";
    this.latestPendingNavigationPath = null;
  }

  extractPathAndParams(
    url: string
  ): {
    path?: string | null | undefined;
    params?: { [key: string]: any };
  } {
    const chunks = url
      .toLowerCase()
      .split(InternalUrlPrefix)
      .filter((_) => _.length > 0);
    if (chunks.length != 1) {
      return {};
    }

    const path = chunks[0].split("?")[0];
    const a = document.createElement("a");
    a.href = url;
    const params = queryString.parse(a.search);

    return { path: `/${path}`, params };
  }

  getPath(str: string | null | undefined): string | null | undefined {
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
  }

  static instance(): NavigationStore {
    let { navigationStore } = window as any;
    if (navigationStore == null) {
      navigationStore = new NavigationStore();
      (window as any).navigationStore = navigationStore;
    }
    return navigationStore;
  }
}

export const useNavigationStore = (): NavigationStore => {
  return NavigationStore.instance();
};
